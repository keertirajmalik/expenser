package model

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/keertirajmalik/expenser/expenser-server/internal/database"
	"github.com/keertirajmalik/expenser/expenser-server/internal/repository"
	"github.com/keertirajmalik/expenser/expenser-server/logger"
	"github.com/shopspring/decimal"
)

type InputIncome struct {
	ID       uuid.UUID       `json:"id"`
	Name     string          `json:"name"`
	Amount   decimal.Decimal `json:"amount"`
	Category uuid.UUID       `json:"category"`
	Date     string          `json:"date"`
	Note     string          `json:"note"`
	UserID   uuid.UUID       `json:"user_id"`
}

type ResponseIncome struct {
	ID       uuid.UUID       `json:"id"`
	Name     string          `json:"name"`
	Amount   decimal.Decimal `json:"amount"`
	Category string          `json:"category"`
	Date     string          `json:"date"`
	Note     string          `json:"note"`
	User     string          `json:"user"`
}

type IncomeService struct {
	Queries *repository.Queries
}

func (i IncomeService) GetIncomesFromDB(ctx context.Context, userID uuid.UUID) ([]ResponseIncome, error) {
	dbIncomes, err := i.Queries.GetIncome(ctx, userID)
	if err != nil {
		logger.Error("failed to get incomes: %v", map[string]interface{}{
			"user_id": userID,
			"error":   err,
		})
		return []ResponseIncome{}, err
	}

	incomes := []ResponseIncome{}
	for _, income := range dbIncomes {
		noteValue := ""
		if income.Note != nil {
			noteValue = *income.Note
		}
		date := ""
		if income.Date.Valid {
			date = income.Date.Time.Format("02/01/2006")
		}

		var money decimal.Decimal
		if income.Amount.Valid {

			numStr := income.Amount.Int.String()
			if income.Amount.Exp != 0 {
				numStr = fmt.Sprintf("%se%d", numStr, income.Amount.Exp)
			}

			var err error
			money, err = decimal.NewFromString(numStr)
			if err != nil {
				logger.Error("failed to convert amount to decimal: %v", map[string]interface{}{
					"amount": numStr,
					"error":  err,
				})
			}
		}

		incomes = append(incomes, ResponseIncome{
			ID:       income.ID,
			Name:     income.Name,
			Amount:   money,
			Category: income.Category,
			Date:     date,
			Note:     noteValue,
			User:     income.User,
		})
	}

	return incomes, nil
}

func (i IncomeService) AddIncomeToDB(ctx context.Context, income InputIncome) (ResponseIncome, error) {
	parsedDate, err := time.Parse("02/01/2006", income.Date)
	if err != nil {
		logger.Error("failed to parse date", map[string]interface{}{
			"date":  income.Date,
			"error": err,
		})
		return ResponseIncome{}, fmt.Errorf("invalid date format: %s", income.Date)
	}

	money := &pgtype.Numeric{}
	err = money.Scan(income.Amount.String())
	if err != nil {
		logger.Error("failed to convert amount to numeric: %v", map[string]interface{}{
			"amount": income.Amount,
			"error":  err,
		})

		return ResponseIncome{}, fmt.Errorf("failed to convert amount type: %w", err)
	}

	err = i.validateIncomeCategory(ctx, income.Category, income.UserID)
	if err != nil {
		return ResponseIncome{}, err
	}

	dbIncome, err := i.Queries.CreateIncome(ctx, repository.CreateIncomeParams{
		ID:       uuid.New(),
		Name:     income.Name,
		Category: income.Category,
		Amount:   *money,
		Date: pgtype.Date{
			Time:  parsedDate,
			Valid: true,
		},
		Note:   &income.Note,
		UserID: income.UserID,
	})

	if err != nil {
		logger.Error("failed to create income for user : %v", map[string]interface{}{
			"user_id": income.UserID,
			"error":   err,
		})

		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == database.ErrCodeForeignKeyViolation {
			logger.Warn(fmt.Sprintf("foreign key violation while creating income %s: non-existent category", income.ID))
			return ResponseIncome{}, &database.ErrForeignKeyViolation{Message: "provide valid category"}
		}
		return ResponseIncome{}, fmt.Errorf("failed to create income: %w", err)
	}

	noteValue := ""
	if dbIncome.Note != nil {
		noteValue = *dbIncome.Note
	}
	date := ""
	if dbIncome.Date.Valid {
		date = dbIncome.Date.Time.Format("02/01/2006")
	}

	var dbMoney decimal.Decimal
	if dbIncome.Amount.Valid {

		numStr := dbIncome.Amount.Int.String()
		if dbIncome.Amount.Exp != 0 {
			numStr = fmt.Sprintf("%se%d", numStr, dbIncome.Amount.Exp)
		}

		var err error
		dbMoney, err = decimal.NewFromString(numStr)
		if err != nil {
			logger.Error("failed to convert amount to decimal: %v", map[string]interface{}{
				"amount": numStr,
				"error":  err,
			})
		}
	}
	incomeResponse := ResponseIncome{
		ID:       dbIncome.ID,
		Name:     dbIncome.Name,
		Amount:   dbMoney,
		Category: dbIncome.Category,
		Date:     date,
		Note:     noteValue,
		User:     dbIncome.User,
	}
	return incomeResponse, nil
}

func (i IncomeService) UpdateIncomeInDB(ctx context.Context, income InputIncome) (ResponseIncome, error) {
	parsedDate, err := time.Parse("02/01/2006", income.Date)
	if err != nil {
		logger.Error("failed to parse date", map[string]interface{}{
			"income_id": income.ID,
			"date":          income.Date,
			"error":         err,
		})
		return ResponseIncome{}, fmt.Errorf("invalid date format: %s", income.Date)
	}

	money := &pgtype.Numeric{}
	err = money.Scan(income.Amount.String())
	if err != nil {
		logger.Error("failed to convert amount to numeric: %v", map[string]interface{}{
			"income_id": income.ID,
			"amount":        income.Amount,
			"error":         err,
		})
		return ResponseIncome{}, fmt.Errorf("failed to convert amount type: %w", err)
	}

	err = i.validateIncomeCategory(ctx, income.Category, income.UserID)
	if err != nil {
		return ResponseIncome{}, err
	}

	dbIncome, err := i.Queries.UpdateIncome(ctx, repository.UpdateIncomeParams{
		ID:       income.ID,
		Name:     income.Name,
		Category: income.Category,
		Amount:   *money,
		Date: pgtype.Date{
			Time:  parsedDate,
			Valid: true,
		},
		Note:   &income.Note,
		UserID: income.UserID,
	})

	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == database.ErrCodeForeignKeyViolation {
			logger.Warn(fmt.Sprintf("foreign key violation while updating income %s: non-existent category", income.ID))
			return ResponseIncome{}, &database.ErrForeignKeyViolation{Message: "provide valid category"}
		}
		if errors.Is(err, pgx.ErrNoRows) {
			logger.Warn(fmt.Sprintf("income %s not found for user %s", income.ID, income.UserID))
			return ResponseIncome{}, errors.New("income not found")
		}
		logger.Error("failed to update income: %v", map[string]interface{}{
			"user_id":       income.UserID,
			"income_id": income.ID,
			"error":         err,
		})

		return ResponseIncome{}, err
	}

	noteValue := ""
	if dbIncome.Note != nil {
		noteValue = *dbIncome.Note
	}
	date := ""
	if dbIncome.Date.Valid {
		date = dbIncome.Date.Time.Format("02/01/2006")
	}

	var dbMoney decimal.Decimal
	if dbIncome.Amount.Valid {

		numStr := dbIncome.Amount.Int.String()
		if dbIncome.Amount.Exp != 0 {
			numStr = fmt.Sprintf("%se%d", numStr, dbIncome.Amount.Exp)
		}

		var err error
		dbMoney, err = decimal.NewFromString(numStr)
		if err != nil {
			logger.Error("failed to convert amount to decimal: %v", map[string]interface{}{
				"error": err,
			})
		}
	}
	incomeResponse := ResponseIncome{
		ID:       dbIncome.ID,
		Name:     dbIncome.Name,
		Amount:   dbMoney,
		Category: dbIncome.Category,
		Date:     date,
		Note:     noteValue,
		User:     dbIncome.User,
	}
	return incomeResponse, nil
}

func (i IncomeService) DeleteIncomeFromDB(ctx context.Context, id, userID uuid.UUID) error {
	result, err := i.Queries.DeleteIncome(ctx, repository.DeleteIncomeParams{
		ID:     id,
		UserID: userID,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			logger.Warn(fmt.Sprintf("income %s not found for user %s", id, userID))
			return errors.New("income not found")
		}
		logger.Error("failed to delete income", map[string]interface{}{
			"income_id": id,
			"user_id":       userID,
			"error":         err,
		})
		return err
	}

	rowAffected := result.RowsAffected()
	if rowAffected == 0 {
		logger.Warn(fmt.Sprintf("income %s not found for user %s", id, userID))
		return errors.New("income not found")
	}

	return nil
}

func (i IncomeService) validateIncomeCategory(ctx context.Context, categoryID, userID uuid.UUID) error {
	dbCategory, err := i.Queries.GetCategoryById(ctx, repository.GetCategoryByIdParams{
		ID:     categoryID,
		UserID: userID,
	})
	if err != nil {
		logger.Error("Category not found", map[string]interface{}{
			"category": categoryID,
			"user_id":  userID,
			"error":    err,
		})
		return fmt.Errorf("category type not found")
	}
	if dbCategory.Type != CategoryTypeIncome {
		logger.Error("Category type should be Income", map[string]interface{}{
			"category_name": dbCategory.Name,
			"category_type": dbCategory.Type,
		})
		return fmt.Errorf("category type should be income")
	}
	return nil
}

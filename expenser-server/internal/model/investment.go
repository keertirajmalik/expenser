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

type InputInvestment struct {
	ID       uuid.UUID       `json:"id"`
	Name     string          `json:"name"`
	Amount   decimal.Decimal `json:"amount"`
	Category uuid.UUID       `json:"category"`
	Date     string          `json:"date"`
	Note     string          `json:"note"`
	UserID   uuid.UUID       `json:"user_id"`
}

type ResponseInvestment struct {
	ID       uuid.UUID       `json:"id"`
	Name     string          `json:"name"`
	Amount   decimal.Decimal `json:"amount"`
	Category string          `json:"category"`
	Date     string          `json:"date"`
	Note     string          `json:"note"`
	User     string          `json:"user"`
}

type InvestmentService struct {
	Queries *repository.Queries
}

func (i InvestmentService) GetInvestmentsFromDB(ctx context.Context, userID uuid.UUID) ([]ResponseInvestment, error) {
	dbInvestments, err := i.Queries.GetInvestment(ctx, userID)
	if err != nil {
		logger.Error("failed to get investments: %v", map[string]interface{}{
			"user_id": userID,
			"error":   err,
		})
		return []ResponseInvestment{}, err
	}

	investments := []ResponseInvestment{}
	for _, investment := range dbInvestments {
		noteValue := ""
		if investment.Note != nil {
			noteValue = *investment.Note
		}
		date := ""
		if investment.Date.Valid {
			date = investment.Date.Time.Format("02/01/2006")
		}

		var money decimal.Decimal
		if investment.Amount.Valid {

			numStr := investment.Amount.Int.String()
			if investment.Amount.Exp != 0 {
				numStr = fmt.Sprintf("%se%d", numStr, investment.Amount.Exp)
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

		investments = append(investments, ResponseInvestment{
			ID:       investment.ID,
			Name:     investment.Name,
			Amount:   money,
			Category: investment.Category,
			Date:     date,
			Note:     noteValue,
			User:     investment.User,
		})
	}

	return investments, nil
}

func (i InvestmentService) AddInvestmentToDB(ctx context.Context, investment InputInvestment) (ResponseInvestment, error) {
	parsedDate, err := time.Parse("02/01/2006", investment.Date)
	if err != nil {
		logger.Error("failed to parse date", map[string]interface{}{
			"date":  investment.Date,
			"error": err,
		})
		return ResponseInvestment{}, fmt.Errorf("invalid date format: %s", investment.Date)
	}

	money := &pgtype.Numeric{}
	err = money.Scan(investment.Amount.String())
	if err != nil {
		logger.Error("failed to convert amount to numeric: %v", map[string]interface{}{
			"amount": investment.Amount,
			"error":  err,
		})

		return ResponseInvestment{}, fmt.Errorf("failed to convert amount type: %w", err)
	}

	err = i.validateInvestmentCategory(ctx, investment.Category, investment.UserID)
	if err != nil {
		return ResponseInvestment{}, err
	}
	
	dbInvestment, err := i.Queries.CreateInvestment(ctx, repository.CreateInvestmentParams{
		ID:       uuid.New(),
		Name:     investment.Name,
		Category: investment.Category,
		Amount:   *money,
		Date: pgtype.Date{
			Time:  parsedDate,
			Valid: true,
		},
		Note:   &investment.Note,
		UserID: investment.UserID,
	})

	if err != nil {
		logger.Error("failed to create investment for user : %v", map[string]interface{}{
			"user_id": investment.UserID,
			"error":   err,
		})

		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == database.ErrCodeForeignKeyViolation {
			logger.Warn(fmt.Sprintf("foreign key violation while creating investment %s: non-existent category", investment.ID))
			return ResponseInvestment{}, &database.ErrForeignKeyViolation{Message: "provide valid category"}
		}
		return ResponseInvestment{}, fmt.Errorf("failed to create investment: %w", err)
	}

	noteValue := ""
	if dbInvestment.Note != nil {
		noteValue = *dbInvestment.Note
	}
	date := ""
	if dbInvestment.Date.Valid {
		date = dbInvestment.Date.Time.Format("02/01/2006")
	}

	var dbMoney decimal.Decimal
	if dbInvestment.Amount.Valid {

		numStr := dbInvestment.Amount.Int.String()
		if dbInvestment.Amount.Exp != 0 {
			numStr = fmt.Sprintf("%se%d", numStr, dbInvestment.Amount.Exp)
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
	investmentResponse := ResponseInvestment{
		ID:       dbInvestment.ID,
		Name:     dbInvestment.Name,
		Amount:   dbMoney,
		Category: dbInvestment.Category,
		Date:     date,
		Note:     noteValue,
		User:     dbInvestment.User,
	}
	return investmentResponse, nil
}

func (i InvestmentService) UpdateInvestmentInDB(ctx context.Context, investment InputInvestment) (ResponseInvestment, error) {
	parsedDate, err := time.Parse("02/01/2006", investment.Date)
	if err != nil {
		logger.Error("failed to parse date", map[string]interface{}{
			"investment_id": investment.ID,
			"date":          investment.Date,
			"error":         err,
		})
		return ResponseInvestment{}, fmt.Errorf("invalid date format: %s", investment.Date)
	}

	money := &pgtype.Numeric{}
	err = money.Scan(investment.Amount.String())
	if err != nil {
		logger.Error("failed to convert amount to numeric: %v", map[string]interface{}{
			"investment_id": investment.ID,
			"amount":        investment.Amount,
			"error":         err,
		})
		return ResponseInvestment{}, fmt.Errorf("failed to convert amount type: %w", err)
	}

	err = i.validateInvestmentCategory(ctx, investment.Category, investment.UserID)
	if err != nil {
		return ResponseInvestment{}, err
	}

	dbInvestment, err := i.Queries.UpdateInvestment(ctx, repository.UpdateInvestmentParams{
		ID:       investment.ID,
		Name:     investment.Name,
		Category: investment.Category,
		Amount:   *money,
		Date: pgtype.Date{
			Time:  parsedDate,
			Valid: true,
		},
		Note:   &investment.Note,
		UserID: investment.UserID,
	})

	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == database.ErrCodeForeignKeyViolation {
			logger.Warn(fmt.Sprintf("foreign key violation while updating investment %s: non-existent category", investment.ID))
			return ResponseInvestment{}, &database.ErrForeignKeyViolation{Message: "provide valid category"}
		}
		if errors.Is(err, pgx.ErrNoRows) {
			logger.Warn(fmt.Sprintf("investment %s not found for user %s", investment.ID, investment.UserID))
			return ResponseInvestment{}, errors.New("investment not found")
		}
		logger.Error("failed to update investment: %v", map[string]interface{}{
			"user_id":       investment.UserID,
			"investment_id": investment.ID,
			"error":         err,
		})

		return ResponseInvestment{}, err
	}

	noteValue := ""
	if dbInvestment.Note != nil {
		noteValue = *dbInvestment.Note
	}
	date := ""
	if dbInvestment.Date.Valid {
		date = dbInvestment.Date.Time.Format("02/01/2006")
	}

	var dbMoney decimal.Decimal
	if dbInvestment.Amount.Valid {

		numStr := dbInvestment.Amount.Int.String()
		if dbInvestment.Amount.Exp != 0 {
			numStr = fmt.Sprintf("%se%d", numStr, dbInvestment.Amount.Exp)
		}

		var err error
		dbMoney, err = decimal.NewFromString(numStr)
		if err != nil {
			logger.Error("failed to convert amount to decimal: %v", map[string]interface{}{
				"error": err,
			})
		}
	}
	investmentResponse := ResponseInvestment{
		ID:       dbInvestment.ID,
		Name:     dbInvestment.Name,
		Amount:   dbMoney,
		Category: dbInvestment.Category,
		Date:     date,
		Note:     noteValue,
		User:     dbInvestment.User,
	}
	return investmentResponse, nil
}

func (i InvestmentService) DeleteInvestmentFromDB(ctx context.Context, id, userID uuid.UUID) error {
	result, err := i.Queries.DeleteInvestment(ctx, repository.DeleteInvestmentParams{
		ID:     id,
		UserID: userID,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			logger.Warn(fmt.Sprintf("investment %s not found for user %s", id, userID))
			return errors.New("investment not found")
		}
		logger.Error("failed to delete investment", map[string]interface{}{
			"investment_id": id,
			"user_id":       userID,
			"error":         err,
		})
		return err
	}

	rowAffected := result.RowsAffected()
	if rowAffected == 0 {
		logger.Warn(fmt.Sprintf("investment %s not found for user %s", id, userID))
		return errors.New("investment not found")
	}

	return nil
}

func (i InvestmentService) validateInvestmentCategory(ctx context.Context, categoryID, userID uuid.UUID) error {
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
	if dbCategory.Type != CategoryTypeInvestment {
		logger.Error("Category type should be Investment", map[string]interface{}{
			"category_name": dbCategory.Name,
			"category_type": dbCategory.Type,
		})
		return fmt.Errorf("category type should be investment")
	}
	return nil
}

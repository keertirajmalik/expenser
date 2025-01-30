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

type InputTransaction struct {
	ID       uuid.UUID       `json:"id"`
	Name     string          `json:"name"`
	Amount   decimal.Decimal `json:"amount"`
	Category uuid.UUID       `json:"category"`
	Date     string          `json:"date"`
	Note     string          `json:"note"`
	UserID   uuid.UUID       `json:"user_id"`
}

type ResponseTransaction struct {
	ID       uuid.UUID       `json:"id"`
	Name     string          `json:"name"`
	Amount   decimal.Decimal `json:"amount"`
	Category string          `json:"category"`
	Date     string          `json:"date"`
	Note     string          `json:"note"`
	User     string          `json:"user"`
}

type TransactionService struct {
	Queries *repository.Queries
}

func (t TransactionService) GetTransactionsFromDB(ctx context.Context, userID uuid.UUID) ([]ResponseTransaction, error) {
	dbTransactions, err := t.Queries.GetTransaction(ctx, userID)
	if err != nil {
		logger.Error("failed to get transactions: %v", map[string]interface{}{
			"user_id": userID,
			"error":   err,
		})
		return []ResponseTransaction{}, err
	}

	transactions := []ResponseTransaction{}
	for _, transaction := range dbTransactions {
		noteValue := ""
		if transaction.Note != nil {
			noteValue = *transaction.Note
		}
		date := ""
		if transaction.Date.Valid {
			date = transaction.Date.Time.Format("02/01/2006")
		}

		var money decimal.Decimal
		if transaction.Amount.Valid {

			numStr := transaction.Amount.Int.String()
			if transaction.Amount.Exp != 0 {
				numStr = fmt.Sprintf("%se%d", numStr, transaction.Amount.Exp)
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

		transactions = append(transactions, ResponseTransaction{
			ID:       transaction.ID,
			Name:     transaction.Name,
			Amount:   money,
			Category: transaction.Category,
			Date:     date,
			Note:     noteValue,
			User:     transaction.User,
		})
	}

	return transactions, nil
}

func (t TransactionService) AddTransactionToDB(ctx context.Context, transaction InputTransaction) (ResponseTransaction, error) {
	parsedDate, err := time.Parse("02/01/2006", transaction.Date)
	if err != nil {
		logger.Error("failed to parse date", map[string]interface{}{
			"date":  transaction.Date,
			"error": err,
		})

		return ResponseTransaction{}, fmt.Errorf("invalid date format: %s", transaction.Date)

	}

	money := &pgtype.Numeric{}
	err = money.Scan(transaction.Amount.String())
	if err != nil {
		logger.Error("failed to convert amount to numeric: %v", map[string]interface{}{
			"amount": transaction.Amount,
			"error":  err,
		})

		return ResponseTransaction{}, fmt.Errorf("failed to convert amount type: %w", err)
	}

	err = t.validateTransactionCategory(ctx, transaction.Category, transaction.UserID)
	if err != nil {
		return ResponseTransaction{}, err
	}

	dbTransaction, err := t.Queries.CreateTransaction(ctx, repository.CreateTransactionParams{
		ID:       uuid.New(),
		Name:     transaction.Name,
		Category: transaction.Category,
		Amount:   *money,
		Date: pgtype.Date{
			Time:  parsedDate,
			Valid: true,
		},
		Note:   &transaction.Note,
		UserID: transaction.UserID,
	})

	if err != nil {
		logger.Error("failed to create transaction for user : %v", map[string]interface{}{
			"user_id": transaction.UserID,
			"error":   err,
		})

		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == database.ErrCodeForeignKeyViolation {
			logger.Warn(fmt.Sprintf("foreign key violation while creating transaction %s: non-existent category", transaction.ID))
			return ResponseTransaction{}, &database.ErrForeignKeyViolation{Message: "provide valid category"}
		}
		return ResponseTransaction{}, fmt.Errorf("failed to create transaction: %w", err)
	}

	noteValue := ""
	if dbTransaction.Note != nil {
		noteValue = *dbTransaction.Note
	}
	date := ""
	if dbTransaction.Date.Valid {
		date = dbTransaction.Date.Time.Format("02/01/2006")
	}

	var dbMoney decimal.Decimal
	if dbTransaction.Amount.Valid {

		numStr := dbTransaction.Amount.Int.String()
		if dbTransaction.Amount.Exp != 0 {
			numStr = fmt.Sprintf("%se%d", numStr, dbTransaction.Amount.Exp)
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
	transactionResponse := ResponseTransaction{
		ID:       dbTransaction.ID,
		Name:     dbTransaction.Name,
		Amount:   dbMoney,
		Category: dbTransaction.Category,
		Date:     date,
		Note:     noteValue,
		User:     dbTransaction.User,
	}
	return transactionResponse, nil
}

func (t TransactionService) UpdateTransactionInDB(ctx context.Context, transaction InputTransaction) (ResponseTransaction, error) {
	parsedDate, err := time.Parse("02/01/2006", transaction.Date)
	if err != nil {
		logger.Error("failed to parse date", map[string]interface{}{
			"transaction_id": transaction.ID,
			"date":           transaction.Date,
			"error":          err,
		})
		return ResponseTransaction{}, fmt.Errorf("invalid date format: %s", transaction.Date)
	}

	money := &pgtype.Numeric{}
	err = money.Scan(transaction.Amount.String())
	if err != nil {
		logger.Error("failed to convert amount to numeric: %v", map[string]interface{}{
			"transaction_id": transaction.ID,
			"amount":         transaction.Amount,
			"error":          err,
		})
		return ResponseTransaction{}, fmt.Errorf("failed to convert amount type: %w", err)
	}

	err = t.validateTransactionCategory(ctx, transaction.Category, transaction.UserID)
	if err != nil {
		return ResponseTransaction{}, err
	}

	dbTransaction, err := t.Queries.UpdateTransaction(ctx, repository.UpdateTransactionParams{
		ID:       transaction.ID,
		Name:     transaction.Name,
		Category: transaction.Category,
		Amount:   *money,
		Date: pgtype.Date{
			Time:  parsedDate,
			Valid: true,
		},
		Note:   &transaction.Note,
		UserID: transaction.UserID,
	})

	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == database.ErrCodeForeignKeyViolation {
			logger.Warn(fmt.Sprintf("foreign key violation while updating transaction %s: non-existent category", transaction.ID))
			return ResponseTransaction{}, &database.ErrForeignKeyViolation{Message: "provide valid category"}
		}
		if errors.Is(err, pgx.ErrNoRows) {
			logger.Warn(fmt.Sprintf("transaction %s not found for user %s", transaction.ID, transaction.UserID))
			return ResponseTransaction{}, errors.New("transaction not found")
		}
		logger.Error("failed to update transaction: %v", map[string]interface{}{
			"user_id":        transaction.UserID,
			"transaction_id": transaction.ID,
			"error":          err,
		})

		return ResponseTransaction{}, err
	}

	noteValue := ""
	if dbTransaction.Note != nil {
		noteValue = *dbTransaction.Note
	}
	date := ""
	if dbTransaction.Date.Valid {
		date = dbTransaction.Date.Time.Format("02/01/2006")
	}

	var dbMoney decimal.Decimal
	if dbTransaction.Amount.Valid {

		numStr := dbTransaction.Amount.Int.String()
		if dbTransaction.Amount.Exp != 0 {
			numStr = fmt.Sprintf("%se%d", numStr, dbTransaction.Amount.Exp)
		}

		var err error
		dbMoney, err = decimal.NewFromString(numStr)
		if err != nil {
			logger.Error("failed to convert amount to decimal: %v", map[string]interface{}{
				"error": err,
			})
		}
	}
	transactionResponse := ResponseTransaction{
		ID:       dbTransaction.ID,
		Name:     dbTransaction.Name,
		Amount:   dbMoney,
		Category: dbTransaction.Category,
		Date:     date,
		Note:     noteValue,
		User:     dbTransaction.User,
	}
	return transactionResponse, nil
}

func (t TransactionService) DeleteTransactionFromDB(ctx context.Context, id, userID uuid.UUID) error {
	result, err := t.Queries.DeleteTransaction(ctx, repository.DeleteTransactionParams{
		ID:     id,
		UserID: userID,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			logger.Warn(fmt.Sprintf("transaction %s not found for user %s", id, userID))
			return errors.New("transaction not found")
		}
		logger.Error("failed to delete transaction", map[string]interface{}{
			"transaction_id": id,
			"user_id":        userID,
			"error":          err,
		})
		return err
	}

	rowAffected := result.RowsAffected()
	if rowAffected == 0 {
		logger.Warn(fmt.Sprintf("transaction %s not found for user %s", id, userID))
		return errors.New("transaction not found")
	}

	return nil
}

func (t TransactionService) validateTransactionCategory(ctx context.Context, categoryID, userID uuid.UUID) error {
	dbCategory, err := t.Queries.GetCategoryById(ctx, repository.GetCategoryByIdParams{
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
	if dbCategory.Type != CategoryTypeExpense {
		logger.Error("Category type should be Expense", map[string]interface{}{
			"category_name": dbCategory.Name,
			"category_type": dbCategory.Type,
		})
		return fmt.Errorf("category type should be expense")
	}
	return nil
}

package model

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/keertirajmalik/expenser/expenser-server/database"
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

func (d Config) GetTransactionsFromDB(ctx context.Context, userID uuid.UUID) ([]ResponseTransaction, error) {
	dbTransactions, err := d.Queries.GetTransaction(ctx, userID)
	if err != nil {
		logger.Error(ctx, "Couldn't get transaction from DB: %v", err)
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
				logger.Error(ctx, "Failed to convert Amount: %v", err)
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

func (d Config) AddTransactionToDB(ctx context.Context, transaction InputTransaction) (ResponseTransaction, error) {
	parsedDate, err := time.Parse("02/01/2006", transaction.Date)
	if err != nil {
		logger.Error(ctx, "Invalid date format: %v", err)
		return ResponseTransaction{}, fmt.Errorf("invalid date format: %w", err)

	}

	money := &pgtype.Numeric{}
	err = money.Scan(transaction.Amount.String())
	if err != nil {
		logger.Error(ctx, "Invalid amount format: %v", err)
		return ResponseTransaction{}, fmt.Errorf("Failed to convert amount type: %w", err)
	}

	dbTransaction, err := d.Queries.CreateTransaction(ctx, repository.CreateTransactionParams{
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
		logger.Error(ctx, "Couldn't create transaction in DB: %v", err)
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
			logger.Error(ctx, "Failed to convert Amount: %v", err)
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

func (d *Config) UpdateTransactionInDB(ctx context.Context, transaction InputTransaction) (ResponseTransaction, error) {
	parsedDate, err := time.Parse("02/01/2006", transaction.Date)
	if err != nil {
		logger.Error(ctx, "Invalid date format: %v", err)
		return ResponseTransaction{}, fmt.Errorf("invalid date format: %w", err)
	}

	money := &pgtype.Numeric{}
	err = money.Scan(transaction.Amount.String())
	if err != nil {
		logger.Error(ctx, "Invalid amount format: %v", err)
		return ResponseTransaction{}, fmt.Errorf("Failed to convert amount type: %w", err)
	}

	dbTransaction, err := d.Queries.UpdateTransaction(ctx, repository.UpdateTransactionParams{
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
		logger.Error(ctx, // Pass the context
			"Failed to update transaction",
			err, // Pass the error
			slog.Any("transaction_id", transaction.ID),
			slog.Any("user_id", transaction.UserID),
		)

		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == database.ErrCodeForeignKeyViolation {
			return ResponseTransaction{}, &database.ErrForeignKeyViolation{Message: "Non-existent category"}
		}
		if errors.Is(err, pgx.ErrNoRows) {
			return ResponseTransaction{}, errors.New("Transaction not found")
		}
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
			logger.Error(ctx, "Failed to convert Amount: %v", err)
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

func (d Config) DeleteTransactionFromDB(ctx context.Context, id, userID uuid.UUID) error {
	result, err := d.Queries.DeleteTransaction(ctx, repository.DeleteTransactionParams{
		ID:     id,
		UserID: userID,
	})
	if err != nil {
		logger.Error(ctx, // Pass the context
			"Failed to delete transaction",
			err, // Pass the error
			slog.Any("transaction_id", id),
			slog.Any("user_id", userID),
		)

		if errors.Is(err, pgx.ErrNoRows) {
			return errors.New("Transaction not found: " + id.String())
		}
		return err
	}

	rowAffected := result.RowsAffected()
	if rowAffected == 0 {
		logger.Error(ctx, // Pass the context
			"Failed to delete transaction",
			err, // Pass the error
			slog.Any("transaction_id", id),
			slog.Any("user_id", userID),
		)
		return errors.New("Transaction not found")
	}

	return nil
}

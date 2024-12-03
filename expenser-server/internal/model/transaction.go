package model

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/keertirajmalik/expenser/expenser-server/internal/repository"
	"github.com/shopspring/decimal"
)

type Transaction struct {
	ID              uuid.UUID       `json:"id"`
	Name            string          `json:"name"`
	Amount          decimal.Decimal `json:"amount"`
	TransactionType string          `json:"type"`
	Date            string          `json:"date"`
	Note            string          `json:"note"`
	UserID          uuid.UUID       `json:"user_id"`
}

func NewTransaction(transaction, transactionType, note string, amount decimal.Decimal, date string, userID uuid.UUID) Transaction {
	return Transaction{
		ID:              uuid.New(),
		Name:            transaction,
		Amount:          amount,
		TransactionType: transactionType,
		Date:            date,
		Note:            note,
		UserID:          userID,
	}
}

func ConvertTransaction(id uuid.UUID, transaction, transactionType, note string, amount decimal.Decimal, date string, userID uuid.UUID) Transaction {
	return Transaction{
		ID:              id,
		Name:            transaction,
		Amount:          amount,
		TransactionType: transactionType,
		Date:            date,
		Note:            note,
		UserID:          userID,
	}
}

func (d Config) GetTransactionsFromDB(ctx context.Context, userID uuid.UUID) ([]Transaction, error) {
	dbTransactions, err := d.Queries.GetTransaction(ctx, userID)
	if err != nil {
		log.Printf("Couldn't get transaction from DB: %v", err)
		return []Transaction{}, err
	}
	return convertDBTransactionToTransaction(dbTransactions), nil
}

func convertDBTransactionToTransaction(dbTransactions []repository.Transaction) []Transaction {
	transactions := []Transaction{}

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
			moneyFloat, err := transaction.Amount.Float64Value()
			if err != nil {
				log.Printf("Failed to convert Amount to float64: %v", err)
			} else {
				money = decimal.NewFromFloat(moneyFloat.Float64)
			}
		}
		transactions = append(transactions, Transaction{
			ID:              transaction.ID,
			Name:            transaction.Name,
			Amount:          money,
			TransactionType: transaction.Type,
			Date:            date,
			Note:            noteValue,
			UserID:          transaction.UserID,
		})
	}

	return transactions
}

func (d *Config) AddTransactionToDB(ctx context.Context, transaction Transaction) error {
	parsedDate, err := time.Parse("02/01/2006", transaction.Date)
	if err != nil {
		log.Printf("Invalid date format: %v", err)
		return fmt.Errorf("invalid date format: %w", err)

	}

	money := &pgtype.Numeric{}
	err = money.Scan(transaction.Amount.String())
	if err != nil {
		log.Printf("Invalid amount format: %v", err)
		return fmt.Errorf("Failed to convert amount type: %w", err)
	}

	_, err = d.Queries.CreateTransaction(ctx, repository.CreateTransactionParams{
		ID:     uuid.New(),
		Name:   transaction.Name,
		Type:   transaction.TransactionType,
		Amount: *money,
		Date: pgtype.Date{
			Time:  parsedDate,
			Valid: true,
		},
		Note:   &transaction.Note,
		UserID: transaction.UserID,
	})

	if err != nil {
		log.Printf("Couldn't create transaction in DB: %v", err)
		return fmt.Errorf("failed to create transaction: %w", err)
	}

	return nil
}

func (d *Config) UpdateTransactionInDB(ctx context.Context, transaction Transaction) error {
	parsedDate, err := time.Parse("02/01/2006", transaction.Date)
	if err != nil {
		log.Printf("Invalid date format: %v", err)
		return fmt.Errorf("invalid date format: %w", err)
	}

	money := &pgtype.Numeric{}
	err = money.Scan(transaction.Amount.String())
	if err != nil {
		log.Printf("Invalid amount format: %v", err)
		return fmt.Errorf("Failed to convert amount type: %w", err)
	}

	_, err = d.Queries.UpdateTransaction(ctx, repository.UpdateTransactionParams{
		ID:     transaction.ID,
		Name:   transaction.Name,
		Type:   transaction.TransactionType,
		Amount: *money,
		Date: pgtype.Date{
			Time:  parsedDate,
			Valid: true,
		},
		Note:   &transaction.Note,
		UserID: transaction.UserID,
	})

	if err != nil {
		log.Printf("Couldn't update transaction in DB: %v", err)
		return err
	}

	return nil
}

func (d Config) DeleteTransactionFromDB(ctx context.Context, id, userID uuid.UUID) error {
	result, err := d.Queries.DeleteTransaction(ctx, repository.DeleteTransactionParams{
		ID:     id,
		UserID: userID,
	})
	if err != nil {
		log.Printf("Failed to delete transaction %s for user %s: %v", id, userID, err)
		return err
	}

	rowAffected := result.RowsAffected()
	if rowAffected == 0 {
		return fmt.Errorf("transaction %s not found for user %s", id, userID)
	}

	return nil
}

package model

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/keertirajmalik/expenser/expenser-server/db"
	"github.com/keertirajmalik/expenser/expenser-server/internal/database"
)

type Transaction struct {
	ID              uuid.UUID `json:"id"`
	Name            string    `json:"name"`
	Amount          int       `json:"amount"`
	TransactionType string    `json:"type"`
	Date            string    `json:"date"`
	Note            string    `json:"note"`
	UserID          uuid.UUID `json:"user_id"`
}

func NewTransaction(transaction, transactionType, note string, amount int, date string, userID uuid.UUID) Transaction {
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

func ConvertTransaction(id uuid.UUID, transaction, transactionType, note string, amount int, date string, userID uuid.UUID) Transaction {
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

func (d Config) GetTransactionsFromDB(userID uuid.UUID) ([]Transaction, error) {
	context, cancel := context.WithDeadline(context.Background(), time.Now().Add(30*time.Second))
	defer cancel()

	dbTransactions, err := d.DBConfig.DB.GetTransaction(context, userID)
	if err != nil {
		log.Println("Couldn't get transaction from DB", err)
		return []Transaction{}, err
	}

	return convertDBTransactionToTransaction(dbTransactions), nil
}

func convertDBTransactionToTransaction(dbTransactions []database.Transaction) []Transaction {
	transactions := []Transaction{}

	for _, transaction := range dbTransactions {
		transactions = append(transactions, Transaction{
			ID:              transaction.ID,
			Name:            transaction.Name,
			Amount:          int(transaction.Amount),
			TransactionType: transaction.Type,
			Date:            transaction.Date.Format("02/01/2006"),
			Note:            db.ConvertSqlNullStringToString(transaction.Note),
			UserID:          transaction.UserID,
		})
	}

	return transactions
}

func (d *Config) AddTransactionToDB(transaction Transaction) error {
	context, cancel := context.WithDeadline(context.Background(), time.Now().Add(30*time.Second))
	defer cancel()

	parsedDate, err := time.Parse("02/01/2006", transaction.Date)
	if err != nil {
		log.Println("Invalid date format:", err)
	}

	_, err = d.DBConfig.DB.CreateTransaction(context, database.CreateTransactionParams{
		ID:     uuid.New(),
		Name:   transaction.Name,
		Type:   transaction.TransactionType,
		Amount: int32(transaction.Amount),
		Date:   parsedDate,
		Note:   db.ConvertStringToSqlNullString(transaction.Note, transaction.Note != ""),
		UserID: transaction.UserID,
	})

	if err != nil {
		log.Println("Couldn't create transaction in DB", err)
		return err
	}

	return nil
}

func (d *Config) UpdateTransactionInDB(transaction Transaction) error {
	context, cancel := context.WithDeadline(context.Background(), time.Now().Add(30*time.Second))
	defer cancel()

	parsedDate, err := time.Parse("02/01/2006", transaction.Date)
	if err != nil {
		log.Println("Invalid date format:", err)
	}
	_, err = d.DBConfig.DB.UpdateTransaction(context, database.UpdateTransactionParams{
		ID:     transaction.ID,
		Name:   transaction.Name,
		Type:   transaction.TransactionType,
		Amount: int32(transaction.Amount),
		Date:   parsedDate,
		Note:   db.ConvertStringToSqlNullString(transaction.Note, transaction.Note != ""),
		UserID: transaction.UserID,
	})

	if err != nil {
		log.Println("Couldn't update transaction in DB", err)
		return err
	}

	return nil
}

func (d Config) DeleteTransactionFromDB(id, userID uuid.UUID) error {
	context, cancel := context.WithDeadline(context.Background(), time.Now().Add(30*time.Second))
	defer cancel()

	result, err := d.DBConfig.DB.DeleteTransaction(context, database.DeleteTransactionParams{
		ID:     id,
		UserID: userID,
	})
	if err != nil {
		log.Printf("Failed to delete transaction %s for user %s: %v", id, userID, err)
		return err
	}

	rowAffected, err := result.RowsAffected()
	if err != nil {
		log.Printf("Error retrieving rows affected: %v", err)
		return err
	}
	if rowAffected == 0 {
		return fmt.Errorf("transaction %s not found for user %s", id, userID)
	}

	return nil
}

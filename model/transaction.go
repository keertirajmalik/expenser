package model

import (
	"context"
	"errors"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/keertirajmalik/expenser/db"
	"github.com/keertirajmalik/expenser/internal/database"
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

func ConvertTransacton(id uuid.UUID, transaction, transactionType, note string, amount int, date string, userID uuid.UUID) Transaction {
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

func (d Data) GetTransactionsFromDB() []Transaction {
	context, cancel := context.WithDeadline(context.Background(), time.Now().Add(30*time.Second))
	defer cancel()

	dbTransactions, err := d.DBConfig.DB.GetTransaction(context)
	if err != nil {
		log.Println("Couldn't get transaction from in DB", err)
	}

	return convertDBTransactionToTransaction(dbTransactions)
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

func (d *Data) AddTransactionToDB(transaction Transaction) error {
	context, cancel := context.WithDeadline(context.Background(), time.Now().Add(30*time.Second))
	defer cancel()

	parsedDate, _ := time.Parse("02/01/2006", transaction.Date)

	_, err := d.DBConfig.DB.CreateTransaction(context, database.CreateTransactionParams{
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

func (d *Data) UpdateTransactionInDB(transaction Transaction) error {
	context, cancel := context.WithDeadline(context.Background(), time.Now().Add(30*time.Second))
	defer cancel()

	parsedDate, _ := time.Parse("02/01/2006", transaction.Date)
	log.Println(transaction)
	_, err := d.DBConfig.DB.UpdateTransaction(context, database.UpdateTransactionParams{
		ID:     transaction.ID,
		Name:   transaction.Name,
		Type:   transaction.TransactionType,
		Amount: int32(transaction.Amount),
		Date:   parsedDate,
		Note:   db.ConvertStringToSqlNullString(transaction.Note, transaction.Note != ""),
	})

	if err != nil {
		log.Println("Couldn't update transaction in DB", err)
		return err
	}

	return nil
}

func (d Data) DeleteTransactionFromDB(id uuid.UUID) error {
	context, cancel := context.WithDeadline(context.Background(), time.Now().Add(30*time.Second))
	defer cancel()

	transactions := d.GetTransactionsFromDB()

	if transactionExist(transactions, id) {
		err := d.DBConfig.DB.DeleteTransaction(context, id)
		if err != nil {
			log.Println("Couldn't delete transaction from DB", err)
			return err
		}

		return nil
	}

	return errors.New("Invalid transaction id: " + id.String())

}

func transactionExist(transactions []Transaction, id uuid.UUID) bool {
	for _, transaction := range transactions {
		if transaction.ID == id {
			return true
		}
	}
	return false
}

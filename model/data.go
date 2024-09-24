package model

import (
	"context"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/keertirajmalik/expenser/internal/database"
	"github.com/keertirajmalik/expenser/sql"
)

type Data struct {
	Transactions     []Transaction
	TransactionTypes []TransactionType
	DBConfig         *sql.DBConfig
}

func (d *Data) GetData() Data {
	context, cancel := context.WithDeadline(context.Background(), time.Now().Add(30*time.Second))
	defer cancel()

	dbTransactions, err := d.DBConfig.DB.GetTransaction(context)
	if err != nil {
		log.Println("Couldn't get transaction from in DB", err)
	}

	transactions := convertDBTransactionToTransaction(dbTransactions)

	return Data{
		Transactions: transactions,
		TransactionTypes: []TransactionType{
			NewTransactionType("Food", "Transaction related to food"),
			NewTransactionType("Travel", "Transaction related to travel"),
		},
	}
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
			Note:            transaction.Note,
		})
	}

	return transactions
}

func (d *Data) TransactionTypeIndexOf(id int) int {
	for i, transactionType := range d.TransactionTypes {
		if transactionType.Id == id {
			return i
		}
	}

	return -1
}

func (d *Data) TransactionIndexOf(id uuid.UUID) int {
	for i, transaction := range d.Transactions {
		if transaction.ID == id {
			return i
		}
	}

	return -1
}

func (d *Data) AddData(transaction Transaction) Data {
	context, cancel := context.WithDeadline(context.Background(), time.Now().Add(30*time.Second))
	defer cancel()

	parsedDate, _ := time.Parse("02/01/2006", transaction.Date)
	dbTransaction, err := d.DBConfig.DB.CreateTransaction(context, database.CreateTransactionParams{
		ID:     uuid.New(),
		Name:   transaction.Name,
		Type:   transaction.TransactionType,
		Amount: int32(transaction.Amount),
		Date:   parsedDate,
		Note:   transaction.Note,
	})

	if err != nil {
		log.Println("Couldn't create transaction in DB", err)
	}

	transactions := convertDBTransactionToTransaction([]database.Transaction{dbTransaction})

	return Data{
		Transactions: append(d.Transactions, transactions...),
	}
}

package model

import (
	"context"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/keertirajmalik/expenser/internal/database"
	"github.com/keertirajmalik/expenser/sql"
)

func (d *Data) GetTransactionsFromDB(context context.Context) []Transaction {
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
			Note:            sql.ConvertSqlNullStringToString(transaction.Note),
		})
	}

	return transactions
}

func (d *Data) AddTransactionData(transaction Transaction) {
	context, cancel := context.WithDeadline(context.Background(), time.Now().Add(30*time.Second))
	defer cancel()

	parsedDate, _ := time.Parse("02/01/2006", transaction.Date)
	dbTransaction, err := d.DBConfig.DB.CreateTransaction(context, database.CreateTransactionParams{
		ID:     uuid.New(),
		Name:   transaction.Name,
		Type:   transaction.TransactionType,
		Amount: int32(transaction.Amount),
		Date:   parsedDate,
		Note:   sql.ConvertStringToSqlNullString(transaction.Note, transaction.Note != ""),
	})

	if err != nil {
		log.Println("Couldn't create transaction in DB", err)
	}

	transactions := convertDBTransactionToTransaction([]database.Transaction{dbTransaction})

	d.Transactions = append(d.Transactions, transactions...)
}

func (d *Data) DeleteTransactionData(id uuid.UUID) {
	context, cancel := context.WithDeadline(context.Background(), time.Now().Add(30*time.Second))
	defer cancel()

	if transactionExist(d, id) {
		err := d.DBConfig.DB.DeleteTransaction(context, id)
		if err != nil {
			log.Println("Couldn't delete transaction from DB", err)
		}

		return
	}

	log.Println("Invalid transaction id", id)
}

func transactionExist(d *Data, id uuid.UUID) bool {
	for _, transaction := range d.Transactions {
		if transaction.ID == id {
			return true
		}
	}
	return false
}

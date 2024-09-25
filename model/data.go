package model

import (
	"context"
	"log"
	"time"

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

	transactions := getTransactionsFromDB(context, d)
	transactionTypes := getTransactionTypesFromDB(context, d)
	return Data{
		Transactions:     transactions,
		TransactionTypes: transactionTypes,
	}
}

func getTransactionsFromDB(context context.Context, d *Data) []Transaction {
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

func getTransactionTypesFromDB(context context.Context, d *Data) []TransactionType {
	dbTransactionTypes, err := d.DBConfig.DB.GetTransactionType(context)
	if err != nil {
		log.Println("Couldn't get transaction type from in DB", err)
	}

	return convertDBTransactionTypesToTransactionTypes(dbTransactionTypes)
}

func convertDBTransactionTypesToTransactionTypes(dbTransactions []database.TransactionType) []TransactionType {
	transactionTypes := []TransactionType{}

	for _, transactionType := range dbTransactions {
		transactionTypes = append(transactionTypes, TransactionType{
			ID:          transactionType.ID,
			Name:        transactionType.Name,
			Description: sql.ConvertSqlNullStringToString(transactionType.Description),
		})
	}

	return transactionTypes
}

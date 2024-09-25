package model

import (
	"context"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/keertirajmalik/expenser/internal/database"
	"github.com/keertirajmalik/expenser/sql"
)

func (d *Data) AddTransactionData(transaction Transaction) Data {
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

	return Data{
		Transactions: append(d.Transactions, transactions...),
	}
}

func (d *Data) TransactionIndexOf(id uuid.UUID) int {
	for i, transaction := range d.Transactions {
		if transaction.ID == id {
			return i
		}
	}

	return -1
}



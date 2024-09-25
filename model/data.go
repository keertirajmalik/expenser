package model

import (
	"context"
	"time"

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

	d.Transactions = d.GetTransactionsFromDB(context)
	d.TransactionTypes = d.GetTransactionTypesFromDB(context)

	return *d
}

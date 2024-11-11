package model

import (
	"github.com/keertirajmalik/expenser/db"
)

type Data struct {
	Transactions     []Transaction
	TransactionTypes []TransactionType
	DBConfig         *db.DBConfig
}

func (d *Data) GetData() Data {
	d.Transactions = d.GetTransactionsFromDB()
	d.TransactionTypes = d.GetTransactionTypesFromDB()

	return *d
}

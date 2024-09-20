package model

import "time"

type Transaction struct {
	Id              int
	Name            string
	Amount          int
	TransactionType string
	Date            string
	Note            string
}

var transactionId = 0

func NewTransaction(transaction, transactionType, note string, amount int, date time.Time) Transaction {
	transactionId++

	return Transaction{
		Id:              transactionId,
		Name:            transaction,
		Amount:          amount,
		TransactionType: transactionType,
		Date:            date.Format("02/01/2006"),
		Note:            note,
	}
}

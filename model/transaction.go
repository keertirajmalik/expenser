package model

import "time"

type Transaction struct {
	Id              int
	Name            string
	Amount          int
	TransactionType string
	Date            time.Time
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
		Date:            date,
		Note:            note,
	}
}

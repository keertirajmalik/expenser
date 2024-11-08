package model

import (
	"github.com/google/uuid"
)

type Transaction struct {
	ID              uuid.UUID
	Name            string
	Amount          int
	TransactionType string
	Date            string
	Note            string
}

func NewTransaction(transaction, transactionType, note string, amount int, date string) Transaction {
	return Transaction{
		ID:              uuid.New(),
		Name:            transaction,
		Amount:          amount,
		TransactionType: transactionType,
		Date:            date,
		Note:            note,
	}
}

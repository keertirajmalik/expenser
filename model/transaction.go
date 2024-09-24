package model

import (
	"time"

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

func NewTransaction(transaction, transactionType, note string, amount int, date time.Time) Transaction {
	return Transaction{
		ID:              uuid.New(),
		Name:            transaction,
		Amount:          amount,
		TransactionType: transactionType,
		Date:            date.Format("02/01/2006"),
		Note:            note,
	}
}

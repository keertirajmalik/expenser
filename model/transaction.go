package model

type Transaction struct {
	Id              int
	Name            string
	Amount          int
	TransactionType string
	Note            string
}

var transactionId = 0

func NewTransaction(transaction, transactionType, note string, amount int) Transaction {
	transactionId++
	return Transaction{
		Id:              transactionId,
		Name:            transaction,
		Amount:          amount,
		TransactionType: transactionType,
		Note:            note,
	}
}

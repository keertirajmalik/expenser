package model

type TransactionType struct {
	Id          int
	Name        string
	Description string
}

var transactionTypeId = 0

func NewTransactionType(name, description string) TransactionType {
	transactionTypeId++
	return TransactionType{
		Id:          transactionTypeId,
		Name:        name,
		Description: description,
	}
}

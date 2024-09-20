package model

type TransactionType struct {
	Id          int
	Name        string
	Description string
}

var id = 0

func NewTransactionType(name, description string) TransactionType {
	id++
	return TransactionType{
		Id:          id,
		Name:        name,
		Description: description,
	}
}

package model

type TransactionType struct {
	Name        string
	Description string
}

func NewTransactionType(name, description string) TransactionType {
	return TransactionType{
		Name:        name,
		Description: description,
	}
}

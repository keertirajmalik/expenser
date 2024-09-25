package model

import "github.com/google/uuid"

type TransactionType struct {
	ID          uuid.UUID
	Name        string
	Description string
}

func NewTransactionType(name, description string) TransactionType {
	return TransactionType{
		ID:          uuid.New(),
		Name:        name,
		Description: description,
	}
}

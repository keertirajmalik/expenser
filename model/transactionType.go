package model

import "github.com/google/uuid"

type TransactionType struct {
    ID          uuid.UUID `json:"id"`
    Name        string `json:"name"`
    Description string `json:"description"`
}

func NewTransactionType(name, description string) TransactionType {
	return TransactionType{
		ID:          uuid.New(),
		Name:        name,
		Description: description,
	}
}

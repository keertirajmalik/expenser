package model

import (
	"context"
	"database/sql"
	"errors"
	"log"

	"github.com/google/uuid"
	"github.com/keertirajmalik/expenser/expenser-server/internal/repository"
)

type TransactionType struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
}

func NewTransactionType(name, description string) TransactionType {
	return TransactionType{
		ID:          uuid.New(),
		Name:        name,
		Description: description,
	}
}

func (d Config) GetTransactionTypesFromDB(ctx context.Context) ([]TransactionType, error) {
	dbTransactionTypes, err := d.Queries.GetTransactionType(ctx)
	if err != nil {
		log.Println("Couldn't get transaction type from in DB", err)
		return []TransactionType{}, err
	}

	return convertDBTransactionTypesToTransactionTypes(dbTransactionTypes), nil
}

func convertDBTransactionTypesToTransactionTypes(dbTransactions []repository.TransactionType) []TransactionType {
	transactionTypes := []TransactionType{}

	for _, transactionType := range dbTransactions {
		descriptionValue := ""
		if transactionType.Description != nil {
			descriptionValue = *transactionType.Description
		}
		transactionTypes = append(transactionTypes, TransactionType{
			ID:          transactionType.ID,
			Name:        transactionType.Name,
			Description: descriptionValue,
		})
	}

	return transactionTypes
}

func (d Config) AddTransactionTypeData(ctx context.Context, transactionType TransactionType) (TransactionType, error) {
	dbTransactionType, err := d.Queries.CreateTransactionType(ctx, repository.CreateTransactionTypeParams{
		ID:          uuid.New(),
		Name:        transactionType.Name,
		Description: &transactionType.Description,
	})

	if err != nil {
		log.Println("Couldn't create transaction type in DB", err)
		return TransactionType{}, err
	}

	transactionTypes := convertDBTransactionTypesToTransactionTypes([]repository.TransactionType{dbTransactionType})

	return transactionTypes[0], nil
}

func (d Config) DeleteTransactionTypeFromDB(ctx context.Context, id uuid.UUID) error {
	err := d.Queries.DeleteTransactionType(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return errors.New("Transaction type not found: " + id.String())
		}
		log.Println("Couldn't delete transaction type from DB", err)
		return err
	}

	return nil
}

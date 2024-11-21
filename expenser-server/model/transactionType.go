package model

import (
	"context"
	"database/sql"
	"errors"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/keertirajmalik/expenser/expenser-server/db"
	"github.com/keertirajmalik/expenser/expenser-server/internal/database"
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

func (d Config) GetTransactionTypesFromDB() ([]TransactionType, error) {
	ctx, cancel := context.WithDeadline(context.Background(), time.Now().Add(30*time.Second))
	defer cancel()

	dbTransactionTypes, err := d.DBConfig.DB.GetTransactionType(ctx)
	if err != nil {
		log.Println("Couldn't get transaction type from in DB", err)
		return []TransactionType{}, err
	}

	return convertDBTransactionTypesToTransactionTypes(dbTransactionTypes), nil
}

func convertDBTransactionTypesToTransactionTypes(dbTransactions []database.TransactionType) []TransactionType {
	transactionTypes := []TransactionType{}

	for _, transactionType := range dbTransactions {
		transactionTypes = append(transactionTypes, TransactionType{
			ID:          transactionType.ID,
			Name:        transactionType.Name,
			Description: db.ConvertSqlNullStringToString(transactionType.Description),
		})
	}

	return transactionTypes
}

func (d Config) AddTransactionTypeData(transactionType TransactionType) (TransactionType, error) {
	ctx, cancel := context.WithDeadline(context.Background(), time.Now().Add(30*time.Second))
	defer cancel()

	dbTransactionType, err := d.DBConfig.DB.CreateTransactionType(ctx, database.CreateTransactionTypeParams{
		ID:          uuid.New(),
		Name:        transactionType.Name,
		Description: db.ConvertStringToSqlNullString(transactionType.Description, transactionType.Description != ""),
	})

	if err != nil {
		log.Println("Couldn't create transaction type in DB", err)
		return TransactionType{}, err
	}

	transactionTypes := convertDBTransactionTypesToTransactionTypes([]database.TransactionType{dbTransactionType})

	return transactionTypes[0], nil
}

func (d Config) DeleteTransactionTypeFromDB(id uuid.UUID) error {
	ctx, cancel := context.WithDeadline(context.Background(), time.Now().Add(30*time.Second))
	defer cancel()

	err := d.DBConfig.DB.DeleteTransactionType(ctx, id)
	if err != nil {
		if errors.Is(err,sql.ErrNoRows) {
			return errors.New("Transaction type not found: " + id.String())
		}
		log.Println("Couldn't delete transaction type from DB", err)
		return err
	}

	return nil
}

package model

import (
	"context"
	"errors"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/keertirajmalik/expenser/db"
	"github.com/keertirajmalik/expenser/internal/database"
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

func (d Config) GetTransactionTypesFromDB() []TransactionType {
	context, cancel := context.WithDeadline(context.Background(), time.Now().Add(30*time.Second))
	defer cancel()

	dbTransactionTypes, err := d.DBConfig.DB.GetTransactionType(context)
	if err != nil {
		log.Println("Couldn't get transaction type from in DB", err)
	}

	return convertDBTransactionTypesToTransactionTypes(dbTransactionTypes)
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

func (d *Config) AddTransactionTypeData(transactionType TransactionType) (TransactionType, error) {
	context, cancel := context.WithDeadline(context.Background(), time.Now().Add(30*time.Second))
	defer cancel()

	dbTransactionType, err := d.DBConfig.DB.CreateTransactionType(context, database.CreateTransactionTypeParams{
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
	context, cancel := context.WithDeadline(context.Background(), time.Now().Add(30*time.Second))
	defer cancel()

	transactionTypes := d.GetTransactionTypesFromDB()

	if transactionTypeExist(transactionTypes, id) {
		err := d.DBConfig.DB.DeleteTransactionType(context, id)
		if err != nil {
			log.Println("Couldn't delete transaction type from DB", err)
			return err
		}

		return nil
	}

	return errors.New("Invalid transaction type id: " + id.String())
}

func transactionTypeExist(transactionTypes []TransactionType, id uuid.UUID) bool {
	for _, transactionType := range transactionTypes {
		if transactionType.ID == id {
			return true
		}
	}
	return false
}

package model

import (
	"context"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/keertirajmalik/expenser/db"
	"github.com/keertirajmalik/expenser/internal/database"
)

func (d Data) GetTransactionTypesFromDB(context context.Context) []TransactionType {
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

func (d *Data) AddTransactionTypeData(transactionType TransactionType) error {
	context, cancel := context.WithDeadline(context.Background(), time.Now().Add(30*time.Second))
	defer cancel()

	dbTransactionType, err := d.DBConfig.DB.CreateTransactionType(context, database.CreateTransactionTypeParams{
		ID:          uuid.New(),
		Name:        transactionType.Name,
		Description: db.ConvertStringToSqlNullString(transactionType.Description, transactionType.Description != ""),
	})

	if err != nil {
		log.Println("Couldn't create transaction type in DB", err)
		return err
	}

	transactionTypes := convertDBTransactionTypesToTransactionTypes([]database.TransactionType{dbTransactionType})

	d.TransactionTypes = append(d.TransactionTypes, transactionTypes...)
	return nil
}

func (d Data) DeleteTransactionTypeData(id uuid.UUID) error {
	context, cancel := context.WithDeadline(context.Background(), time.Now().Add(30*time.Second))
	defer cancel()

	err := d.DBConfig.DB.DeleteTransactionType(context, id)
	if err != nil {
		log.Println("Couldn't delete transaction type from DB", err)
		return err
	}
	return nil
}

func (d Data) TransactionTypeIndexOf(id uuid.UUID) bool {
	for _, transactionType := range d.TransactionTypes {
		if transactionType.ID == id {
			return true
		}
	}

	return false
}

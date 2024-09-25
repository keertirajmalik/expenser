package model

import (
	"context"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/keertirajmalik/expenser/internal/database"
	"github.com/keertirajmalik/expenser/sql"
)

func (d *Data) GetTransactionTypesFromDB(context context.Context) []TransactionType {
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
			Description: sql.ConvertSqlNullStringToString(transactionType.Description),
		})
	}

	return transactionTypes
}

func (d *Data) AddTransactionTypeData(transactionType TransactionType) Data {
	context, cancel := context.WithDeadline(context.Background(), time.Now().Add(30*time.Second))
	defer cancel()

	dbTransactionType, err := d.DBConfig.DB.CreateTransactionType(context, database.CreateTransactionTypeParams{
		ID:          uuid.New(),
		Name:        transactionType.Name,
		Description: sql.ConvertStringToSqlNullString(transactionType.Description, transactionType.Description != ""),
	})

	if err != nil {
		log.Println("Couldn't create transaction type in DB", err)
	}

	transactionTypes := convertDBTransactionTypesToTransactionTypes([]database.TransactionType{dbTransactionType})

	return Data{
		TransactionTypes: append(d.TransactionTypes, transactionTypes...),
	}
}

func (d *Data) DeleteTransactionTypeData(id uuid.UUID) {
	context, cancel := context.WithDeadline(context.Background(), time.Now().Add(30*time.Second))
	defer cancel()

	err := d.DBConfig.DB.DeleteTransactionType(context, id)
	if err != nil {
		log.Println("Couldn't delete transaction type from DB", err)
	}

}

func (d *Data) TransactionTypeIndexOf(id uuid.UUID) bool {
	for _, transactionType := range d.TransactionTypes {
		if transactionType.ID == id {
			return true
		}
	}

	return false
}

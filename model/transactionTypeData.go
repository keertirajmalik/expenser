package model

import (
	"context"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/keertirajmalik/expenser/internal/database"
	"github.com/keertirajmalik/expenser/sql"
)

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

func (d *Data) TransactionTypeIndexOf(id uuid.UUID) int {
	for i, transactionType := range d.TransactionTypes {
		if transactionType.ID == id {
			return i
		}
	}

	return -1
}

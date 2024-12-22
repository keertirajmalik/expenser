package model

import (
	"context"
	"errors"
	"fmt"
	"log"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/keertirajmalik/expenser/expenser-server/internal/repository"
)

type TransactionType struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	UserID      uuid.UUID `json:"user_id"`
}

type ResponseTransactionType struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	User        string    `json:"user"`
}

func (d Config) GetTransactionTypesFromDB(ctx context.Context, userId uuid.UUID) ([]ResponseTransactionType, error) {
	dbTransactionTypes, err := d.Queries.GetTransactionType(ctx, userId)
	if err != nil {
		log.Println("Couldn't get transaction type from in DB", err)
		return []ResponseTransactionType{}, err
	}

	return convertDBTransactionTypesToTransactionTypes(d, ctx, dbTransactionTypes), nil
}

func (d Config) GetTransactionTypeByIdFromDB(ctx context.Context, id, userId uuid.UUID) (ResponseTransactionType, error) {
	dbTransactionType, err := d.Queries.GetTransactionTypeById(ctx, repository.GetTransactionTypeByIdParams{ID: id, UserID: userId})
	if err != nil {
		log.Println("Couldn't get transaction type from in DB", err)
		return ResponseTransactionType{}, err
	}

	return convertDBTransactionTypesToTransactionTypes(d, ctx, []repository.TransactionType{dbTransactionType})[0], nil
}

func convertDBTransactionTypesToTransactionTypes(config Config, ctx context.Context, dbTransactions []repository.TransactionType) []ResponseTransactionType {
	transactionTypes := []ResponseTransactionType{}

	for _, transactionType := range dbTransactions {
		descriptionValue := ""
		if transactionType.Description != nil {
			descriptionValue = *transactionType.Description
		}
		user, err := config.Queries.GetUserById(ctx, transactionType.UserID)
		if err != nil {
			log.Printf("Couldn't get user from DB: %v", err)
			return []ResponseTransactionType{}
		}
		transactionTypes = append(transactionTypes, ResponseTransactionType{
			ID:          transactionType.ID,
			Name:        transactionType.Name,
			Description: descriptionValue,
			User:        user.Username,
		})
	}

	return transactionTypes
}

func (d Config) AddTransactionTypeData(ctx context.Context, transactionType TransactionType) (ResponseTransactionType, error) {
	dbTransactionType, err := d.Queries.CreateTransactionType(ctx, repository.CreateTransactionTypeParams{
		ID:          uuid.New(),
		Name:        transactionType.Name,
		Description: &transactionType.Description,
		UserID:      transactionType.UserID,
	})

	if err != nil {
		log.Println("Couldn't create transaction type in DB", err)
		return ResponseTransactionType{}, err
	}

	transactionTypes := convertDBTransactionTypesToTransactionTypes(d, ctx, []repository.TransactionType{dbTransactionType})

	return transactionTypes[0], nil
}

func (d Config) DeleteTransactionTypeFromDB(ctx context.Context, id, userID uuid.UUID) error {
	result, err := d.Queries.DeleteTransactionType(ctx, repository.DeleteTransactionTypeParams{ID: id, UserID: userID})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return errors.New("Transaction type not found: " + id.String())
		}
		log.Println("Couldn't delete transaction type from DB", err)
		return err
	}

	rowAffected := result.RowsAffected()
	if rowAffected == 0 {
		return fmt.Errorf("transaction type %s not found for user %s", id, userID)
	}

	return nil
}

func (d Config) UpdateTransactionTypeInDB(ctx context.Context, transactionType TransactionType) (ResponseTransactionType, error) {
	dbTransactionType, err := d.Queries.UpdateTransactionType(ctx, repository.UpdateTransactionTypeParams{
		ID:          transactionType.ID,
		Name:        transactionType.Name,
		Description: &transactionType.Description,
		UserID:      transactionType.UserID,
	})

	if err != nil {
		log.Printf("Couldn't update transaction in DB: %v", err)
		return ResponseTransactionType{}, err
	}

	transactionTypes := convertDBTransactionTypesToTransactionTypes(d, ctx, []repository.TransactionType{dbTransactionType})

	return transactionTypes[0], nil
}

package model

import (
	"context"
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/keertirajmalik/expenser/expenser-server/database"
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
	CreatedAt   time.Time `json:"created_at"`
}

const (
	errCodeNotNullViolation = "23502"
)

type ErrNotNullConstraint struct {
	column string
}

func (e *ErrNotNullConstraint) Error() string {
	return fmt.Sprintf("%s can't be null", e.column)
}

func (d Config) GetTransactionTypesFromDB(ctx context.Context, userId uuid.UUID) ([]ResponseTransactionType, error) {
	dbTransactionTypes, err := d.Queries.GetTransactionType(ctx, userId)
	if err != nil {
		log.Println("Couldn't get transaction type from in DB", err)
		return []ResponseTransactionType{}, err
	}

	transactionTypes := []ResponseTransactionType{}

	for _, transactionType := range dbTransactionTypes {
		descriptionValue := ""
		if transactionType.Description != nil {
			descriptionValue = *transactionType.Description
		}
		transactionTypes = append(transactionTypes, ResponseTransactionType{
			ID:          transactionType.ID,
			Name:        transactionType.Name,
			Description: descriptionValue,
			User:        transactionType.User,
			CreatedAt:   transactionType.CreatedAt.Time,
		})
	}

	return transactionTypes, nil
}

func (d Config) GetTransactionTypeByIdFromDB(ctx context.Context, id, userId uuid.UUID) (ResponseTransactionType, error) {
	dbTransactionType, err := d.Queries.GetTransactionTypeById(ctx, repository.GetTransactionTypeByIdParams{ID: id, UserID: userId})
	if err != nil {
		log.Println("Couldn't get transaction type from in DB", err)
		return ResponseTransactionType{}, err
	}

	descriptionValue := ""
	if dbTransactionType.Description != nil {
		descriptionValue = *dbTransactionType.Description
	}
	transactionType := ResponseTransactionType{
		ID:          dbTransactionType.ID,
		Name:        dbTransactionType.Name,
		Description: descriptionValue,
		User:        dbTransactionType.User,
		CreatedAt:   dbTransactionType.CreatedAt.Time,
	}
	return transactionType, nil
}

func (d Config) AddTransactionTypeData(ctx context.Context, transactionType TransactionType) (ResponseTransactionType, error) {
	dbTransactionType, err := d.Queries.CreateTransactionType(ctx, repository.CreateTransactionTypeParams{
		ID:          uuid.New(),
		Name:        transactionType.Name,
		Description: &transactionType.Description,
		UserID:      transactionType.UserID,
	})

	if err != nil {
		log.Printf("Failed to create transaction type %s for user %s: %v", transactionType.ID, transactionType.UserID, err)
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == database.ErrCodeUniqueViolation {
			return ResponseTransactionType{}, &database.ErrDuplicateData{Column: transactionType.Name}
		}
		return ResponseTransactionType{}, err
	}

	descriptionValue := ""
	if dbTransactionType.Description != nil {
		descriptionValue = *dbTransactionType.Description
	}

	transactionTypeResponse := ResponseTransactionType{
		ID:          dbTransactionType.ID,
		Name:        dbTransactionType.Name,
		Description: descriptionValue,
		User:        dbTransactionType.User,
		CreatedAt:   dbTransactionType.CreatedAt.Time,
	}
	return transactionTypeResponse, nil
}

func (d Config) DeleteTransactionTypeFromDB(ctx context.Context, id, userID uuid.UUID) error {
	result, err := d.Queries.DeleteTransactionType(ctx, repository.DeleteTransactionTypeParams{ID: id, UserID: userID})
	if err != nil {
		log.Printf("Failed to delete transaction type %s for user %s: %v", id, userID, err)
		if errors.Is(err, pgx.ErrNoRows) {
			return errors.New("Transaction type not found")
		}
		log.Println("Couldn't delete transaction type from DB", err)
		return err
	}

	rowAffected := result.RowsAffected()
	if rowAffected == 0 {
		log.Printf("Failed to delete transaction type %s for user %s: %v", id, userID, err)
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
		log.Printf("Failed to update transaction type %s for user %s: %v", transactionType.ID, transactionType.UserID, err)
		if errors.Is(err, pgx.ErrNoRows) {
			return ResponseTransactionType{}, errors.New("Transaction type not found")
		}
		return ResponseTransactionType{}, err
	}

	descriptionValue := ""
	if dbTransactionType.Description != nil {
		descriptionValue = *dbTransactionType.Description
	}

	transactionTypeResponse := ResponseTransactionType{
		ID:          dbTransactionType.ID,
		Name:        dbTransactionType.Name,
		Description: descriptionValue,
		User:        dbTransactionType.User,
		CreatedAt:   dbTransactionType.CreatedAt.Time,
	}
	return transactionTypeResponse, nil
}

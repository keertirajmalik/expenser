package model

import (
	"context"
	"errors"
	"fmt"
	"log"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
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

// convertDBTransactionTypesToTransactionTypes converts a slice of database transaction types to response transaction types.
// It fetches associated user information for each transaction type and handles nil description fields.
// If a user lookup fails, it logs the error and returns an empty slice.
//
// Parameters:
//   - config: Config object containing database queries
//   - ctx: Context for database operations
//   - dbTransactions: Slice of repository.TransactionType to convert
//
// Returns:
//   - []ResponseTransactionType: Slice of converted transaction types with user information.
//     Returns empty slice if any user lookup fails.
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
		log.Printf("Failed to create transaction type %s for user %s: %v", transactionType.ID, transactionType.UserID, err)
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return ResponseTransactionType{}, fmt.Errorf("Transaction type already exist")
		}

		return ResponseTransactionType{}, err
	}

	transactionTypes := convertDBTransactionTypesToTransactionTypes(d, ctx, []repository.TransactionType{dbTransactionType})

	return transactionTypes[0], nil
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

	transactionTypes := convertDBTransactionTypesToTransactionTypes(d, ctx, []repository.TransactionType{dbTransactionType})

	return transactionTypes[0], nil
}

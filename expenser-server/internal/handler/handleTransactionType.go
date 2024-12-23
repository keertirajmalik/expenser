package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/google/uuid"
	"github.com/keertirajmalik/expenser/expenser-server/internal/model"
)

// HandleTransactionTypeGet returns an HTTP handler function that retrieves transaction types for a user.
// It expects a userID in the request context and returns a JSON response containing an array of
// transaction types. If the database operation fails, it responds with a 500 Internal Server Error.
// The handler uses the provided Config for database operations.
func HandleTransactionTypeGet(data model.Config) http.HandlerFunc {
	type validResponse struct {
		TransactionTypes []model.ResponseTransactionType `json:"transaction_types"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value("userID").(uuid.UUID)
		transactionTypes, err := data.GetTransactionTypesFromDB(r.Context(), userID)
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "Failed to retrieve transaction types")
			return
		}
		respondWithJson(w, http.StatusOK, validResponse{
			TransactionTypes: transactionTypes,
		})
	}
}

// HandleTransactionTypeCreate returns an HTTP handler function that processes requests to create new transaction types.
// It validates the input parameters, ensuring the transaction type name is between 1 and 50 characters,
// and creates a new transaction type in the database. The function requires a valid user ID in the request context.
//
// The handler expects a JSON request body with the following fields:
//   - name: string (required, 1-50 characters)
//   - description: string (optional)
//
// It returns a JSON response containing the created transaction type details.
// If the request fails, it responds with an appropriate HTTP error status and message.
//
// The function requires a model.Config parameter for database operations.
func HandleTransactionTypeCreate(data model.Config) http.HandlerFunc {
	type parameters struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}

	type response struct {
		TransactionTypes model.ResponseTransactionType `json:"transaction_types"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)
		params := parameters{}
		err := decoder.Decode(&params)
		if err != nil {
			log.Printf("Error while decoding parameters:%s", err)
			respondWithError(w, http.StatusBadRequest, "Couldn't decode parameters")
			return
		}

		if len(params.Name) == 0 {
			respondWithError(w, http.StatusBadRequest, "Transaction type name cannot be empty")
			return
		}
		if len(params.Name) > 50 {
			respondWithError(w, http.StatusBadRequest, "Transaction type name too long")
			return
		}

		userID := r.Context().Value("userID").(uuid.UUID)
		transactionType, err := data.AddTransactionTypeData(r.Context(), model.TransactionType{
			ID:          uuid.New(),
			Name:        params.Name,
			Description: params.Description,
			UserID:      userID,
		})

		if err != nil {
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}

		respondWithJson(w, http.StatusOK, response{
			TransactionTypes: transactionType,
		})
	}
}

// HandleTransactionTypeUpdate returns an HTTP handler function that processes transaction type updates.
// It expects a transaction type ID in the URL path and a JSON body containing 'name' and 'description'.
// The handler validates the user's authentication, updates the transaction type in the database,
// and returns the updated transaction type data.
//
// The function requires a valid user ID in the request context and returns a 400 status code
// for invalid UUIDs, malformed JSON bodies, or database operation failures.
//
// Returns an HTTP handler that responds with:
//   - 200 OK with updated transaction type on success
//   - 400 Bad Request on validation errors or database failures
func HandleTransactionTypeUpdate(data model.Config) http.HandlerFunc {
	type parameters struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}

	type response struct {
		TransactionTypes model.ResponseTransactionType `json:"transaction_types"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		idStr := r.PathValue("id")

		id, err := uuid.Parse(idStr)
		if err != nil {
			log.Println("Error while parsing uuid: ", err)
			respondWithError(w, http.StatusBadRequest, "Invalid id")
			return
		}

		decoder := json.NewDecoder(r.Body)
		params := parameters{}
		err = decoder.Decode(&params)
		if err != nil {
			log.Printf("Error while decoding parameters:%v", err)
			respondWithError(w, http.StatusBadRequest, "Couldn't decode parameters")
			return
		}

		userID := r.Context().Value("userID").(uuid.UUID)
		transactionType, err := data.UpdateTransactionTypeInDB(r.Context(), model.TransactionType{
			ID:          id,
			Name:        params.Name,
			Description: params.Description,
			UserID:      userID,
		})

		if err != nil {
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		respondWithJson(w, http.StatusOK, response{
			TransactionTypes: transactionType,
		})
	}
}
// HandleTransactionTypeDelete returns an HTTP handler function that processes DELETE requests for transaction types.
// It extracts the transaction type ID from the URL path, validates the requesting user's permissions,
// and deletes the specified transaction type from the database. The function requires a valid user ID
// in the request context. It responds with 204 No Content on success, 400 Bad Request for invalid IDs
// or deletion failures.
func HandleTransactionTypeDelete(data model.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := r.PathValue("id")

		id, err := uuid.Parse(idStr)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, "Invalid id")
			return
		}

		userID := r.Context().Value("userID").(uuid.UUID)
		err = data.DeleteTransactionTypeFromDB(r.Context(), id, userID)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}

		w.WriteHeader(http.StatusNoContent)
	}
}

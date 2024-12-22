package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/google/uuid"
	"github.com/keertirajmalik/expenser/expenser-server/internal/model"
)

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

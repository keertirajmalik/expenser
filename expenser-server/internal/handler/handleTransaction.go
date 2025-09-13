package handler

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"github.com/keertirajmalik/expenser/expenser-server/auth"
	"github.com/keertirajmalik/expenser/expenser-server/internal/model"
	"github.com/keertirajmalik/expenser/expenser-server/logger"
	"github.com/shopspring/decimal"
)

func HandleTransactionGet(transactionService model.TransactionService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value(auth.UserIDKey).(uuid.UUID)
		transactions, err := transactionService.GetTransactionsFromDB(r.Context(), userID)
		if err != nil {
			logger.Error("Error while fetching tranasactions", map[string]any{
				"error": err,
			})
			respondWithError(w, http.StatusInternalServerError, err.Error())
			return
		}

		respondWithJson(w, http.StatusOK, transactions)
	}
}

func HandleTransactionCreate(transactionService model.TransactionService) http.HandlerFunc {
	type parameters struct {
		Name     string          `json:"name"`
		Amount   decimal.Decimal `json:"amount"`
		Category uuid.UUID       `json:"category"`
		Date     string          `json:"date"`
		Note     string          `json:"note"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)
		params := parameters{}
		err := decoder.Decode(&params)
		if err != nil {
			logger.Error("Error while decoding parameters", map[string]any{
				"params": params,
				"error":  err,
			})
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}

		userID := r.Context().Value(auth.UserIDKey).(uuid.UUID)

		transaction := model.InputTransaction{
			ID:       uuid.New(),
			Name:     params.Name,
			Category: params.Category,
			Note:     params.Note,
			Amount:   params.Amount,
			Date:     params.Date,
			UserID:   userID,
		}

		dbTransaction, err := transactionService.AddTransactionToDB(r.Context(), transaction)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		respondWithJson(w, http.StatusOK, dbTransaction)
	}
}

func HandleTransactionUpdate(transactionService model.TransactionService) http.HandlerFunc {
	type parameters struct {
		Name     string          `json:"name"`
		Amount   decimal.Decimal `json:"amount"`
		Category uuid.UUID       `json:"category"`
		Date     string          `json:"date"`
		Note     string          `json:"note"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		idStr := r.PathValue("id")

		id, err := uuid.Parse(idStr)
		if err != nil {
			logger.Error("Error while parsing transaction ID", map[string]any{
				"error": err,
				"uuid":  idStr,
			})
			respondWithError(w, http.StatusBadRequest, "Invalid id")
			return
		}

		decoder := json.NewDecoder(r.Body)
		params := parameters{}
		err = decoder.Decode(&params)
		if err != nil {
			logger.Error("Error while decoding parameters", map[string]any{
				"error":  err,
				"params": params,
			})
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}

		userID := r.Context().Value(auth.UserIDKey).(uuid.UUID)

		transaction := model.InputTransaction{
			ID:       id,
			Name:     params.Name,
			Category: params.Category,
			Note:     params.Note,
			Amount:   params.Amount,
			Date:     params.Date,
			UserID:   userID,
		}

		dbTransaction, err := transactionService.UpdateTransactionInDB(r.Context(), transaction)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		respondWithJson(w, http.StatusOK, dbTransaction)
	}
}

func HandleTransactionDelete(transactionService model.TransactionService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := r.PathValue("id")

		id, err := uuid.Parse(idStr)
		if err != nil {
			logger.Error("Error while parsing uuid", map[string]any{
				"error": err,
				"uuid":  idStr,
			})
			respondWithError(w, http.StatusBadRequest, "Invalid id")
			return
		}

		userID := r.Context().Value(auth.UserIDKey).(uuid.UUID)
		err = transactionService.DeleteTransactionFromDB(r.Context(), id, userID)
		if err != nil {
			logger.Error("Error while deleting transaction", map[string]any{
				"transaction_id": id,
				"user_id":        userID,
				"error":          err,
			})
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}

		w.WriteHeader(http.StatusNoContent)
	}
}

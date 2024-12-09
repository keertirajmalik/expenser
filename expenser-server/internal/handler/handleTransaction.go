package handler

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"github.com/keertirajmalik/expenser/expenser-server/internal/model"
	"github.com/shopspring/decimal"
)

func HandleTransactionGet(data model.Config) http.HandlerFunc {
	type validResponse struct {
		Transactions []model.Transaction `json:"transactions"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value("userID").(uuid.UUID)
		transactions, err := data.GetTransactionsFromDB(r.Context(), userID)
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, err.Error())
			return
		}

		respondWithJson(w, http.StatusOK, validResponse{
			Transactions: transactions,
		})
	}
}

func HandleTransactionCreate(data model.Config) http.HandlerFunc {
	type parameters struct {
		Name   string          `json:"name"`
		Amount decimal.Decimal `json:"amount"`
		Type   string          `json:"type"`
		Date   string          `json:"date"`
		Note   string          `json:"note"`
	}

	type response struct {
		Transaction model.Transaction `json:"transaction"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)
		params := parameters{}
		err := decoder.Decode(&params)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, "Couldn't decode parameters")
			return
		}

		userID := r.Context().Value("userID").(uuid.UUID)

		transaction := model.NewTransaction(params.Name, params.Type, params.Note, params.Amount, params.Date, userID)

		err = data.AddTransactionToDB(r.Context(), transaction)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		respondWithJson(w, http.StatusOK, response{
			Transaction: transaction,
		})
	}
}

func HandleTransactionUpdate(data model.Config) http.HandlerFunc {
	type parameters struct {
		Name   string          `json:"name"`
		Amount decimal.Decimal `json:"amount"`
		Type   string          `json:"type"`
		Date   string          `json:"date"`
		Note   string          `json:"note"`
	}

	type response struct {
		Transaction model.Transaction `json:"transaction"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		idStr := r.PathValue("id")

		id, err := uuid.Parse(idStr)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, "Invalid id")
			return
		}

		decoder := json.NewDecoder(r.Body)
		params := parameters{}
		err = decoder.Decode(&params)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, "Couldn't decode parameters")
			return
		}

		userID := r.Context().Value("userID").(uuid.UUID)
		transaction := model.ConvertTransaction(id, params.Name, params.Type, params.Note, params.Amount, params.Date, userID)

		err = data.UpdateTransactionInDB(r.Context(), transaction)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		respondWithJson(w, http.StatusOK, response{
			Transaction: transaction,
		})
	}
}

func HandleTransactionDelete(data model.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := r.PathValue("id")

		id, err := uuid.Parse(idStr)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, "Invalid id")
			return
		}

		userID := r.Context().Value("userID").(uuid.UUID)
		err = data.DeleteTransactionFromDB(r.Context(), id, userID)
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, err.Error())
			return
		}

		w.WriteHeader(http.StatusNoContent)
	}
}

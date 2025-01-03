package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/google/uuid"
	"github.com/keertirajmalik/expenser/expenser-server/internal/model"
	"github.com/shopspring/decimal"
)

func HandleTransactionGet(data model.Config) http.HandlerFunc {
	type validResponse struct {
		Transactions []model.ResponseTransaction `json:"transactions"`
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
		Type   uuid.UUID       `json:"type"`
		Date   string          `json:"date"`
		Note   string          `json:"note"`
	}

	type response struct {
		Transaction model.ResponseTransaction `json:"transaction"`
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

		transaction := model.InputTransaction{
			ID:              uuid.New(),
			Name:            params.Name,
			TransactionType: params.Type,
			Note:            params.Note,
			Amount:          params.Amount,
			Date:            params.Date,
			UserID:          userID,
		}

		dbTransaction, err := data.AddTransactionToDB(r.Context(), transaction)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		respondWithJson(w, http.StatusOK, response{
			Transaction: dbTransaction,
		})
	}
}

func HandleTransactionUpdate(data model.Config) http.HandlerFunc {
	type parameters struct {
		Name   string          `json:"name"`
		Amount decimal.Decimal `json:"amount"`
		Type   uuid.UUID       `json:"type"`
		Date   string          `json:"date"`
		Note   string          `json:"note"`
	}

	type response struct {
		Transaction model.ResponseTransaction `json:"transaction"`
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

		transaction := model.InputTransaction{
			ID:              id,
			Name:            params.Name,
			TransactionType: params.Type,
			Note:            params.Note,
			Amount:          params.Amount,
			Date:            params.Date,
			UserID:          userID,
		}
		dbTransaction, err := data.UpdateTransactionInDB(r.Context(), transaction)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		respondWithJson(w, http.StatusOK, response{
			Transaction: dbTransaction,
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

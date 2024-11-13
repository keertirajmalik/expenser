package handler

import (
	"encoding/json"
	"github.com/google/uuid"
	"github.com/keertirajmalik/expenser/model"
	"net/http"
)

func HandleTransactionGet(data *model.Data) http.HandlerFunc {
	type validResponse struct {
		Transactions []model.Transaction `json:"transaction"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		respondWithJson(w, http.StatusOK, validResponse{
			Transactions: data.GetTransactionsFromDB(),
		})
	}
}

func HandleTransactionCreate(data *model.Data) http.HandlerFunc {
	type parameters struct {
		Name   string `json:"name"`
		Amount int    `json:"amount"`
		Type   string `json:"type"`
		Date   string `json:"date"`
		Note   string `json:"note"`
	}

	type response struct {
		Transaction model.Transaction `json:"transaction"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)
		params := parameters{}
		err := decoder.Decode(&params)
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters")
			return
		}

		transaction := model.NewTransaction(params.Name, params.Type, params.Note, params.Amount, params.Date)
		err = data.AddTransactionData(transaction)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		respondWithJson(w, http.StatusOK, response{
			Transaction: transaction,
		})
	}
}

func HandleTransactionUpdate(data *model.Data) http.HandlerFunc {
	type parameters struct {
		Name   string `json:"name"`
		Amount int    `json:"amount"`
		Type   string `json:"type"`
		Date   string `json:"date"`
		Note   string `json:"note"`
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
			respondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters")
			return
		}

		transaction := model.ConvertTransacton(id, params.Name, params.Type, params.Note, params.Amount, params.Date)
		err = data.UpdateTransactionData(transaction)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		respondWithJson(w, http.StatusOK, response{
			Transaction: transaction,
		})
	}
}

func HandleTransactionDelete(data *model.Data) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := r.PathValue("id")

		id, err := uuid.Parse(idStr)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, "Invalid id")
			return
		}

		data.DeleteTransactionData(id)

		w.WriteHeader(http.StatusNoContent)
	}
}

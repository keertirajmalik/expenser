package handler

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"github.com/keertirajmalik/expenser/model"
)

func HandleTransactionTypeGet(data *model.Data) http.HandlerFunc {
	type validResponse struct {
		TransactionTypes []model.TransactionType `json:"transaction_types"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		respondWithJson(w, http.StatusOK, validResponse{
			TransactionTypes: data.GetData().TransactionTypes,
		})
	}
}

func HandleTransactionTypeCreate(data *model.Data) http.HandlerFunc {
	type parameters struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}

	type response struct {
		TransactionTypes model.TransactionType `json:"transaction_types"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)
		params := parameters{}
		err := decoder.Decode(&params)
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters")
			return
		}

		transactionType := model.NewTransactionType(params.Name, params.Description)
		err = data.AddTransactionTypeData(transactionType)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}

		respondWithJson(w, http.StatusOK, response{
			TransactionTypes: transactionType,
		})
	}
}

func HandleTransactionTypeDelete(data *model.Data) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := r.PathValue("id")

		id, err := uuid.Parse(idStr)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, "Invalid id")
			return
		}

		err = data.DeleteTransactionTypeData(id)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}

		w.WriteHeader(http.StatusNoContent)
	}
}

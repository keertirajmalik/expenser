package handler

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"github.com/keertirajmalik/expenser/internal/auth"
	"github.com/keertirajmalik/expenser/model"
)

func HandleTransactionGet(data model.Data) http.HandlerFunc {
	type validResponse struct {
		Transactions []model.Transaction `json:"transaction"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		respondWithJson(w, http.StatusOK, validResponse{
			Transactions: data.GetTransactionsFromDB(),
		})
	}
}

func HandleTransactionCreate(data model.Data) http.HandlerFunc {
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

		token, err := auth.GetBearerToken(r.Header)
		if err != nil {
			respondWithError(w, http.StatusUnauthorized, err.Error())
			return
		}

		userID, err := auth.ValidateJWT(token, data.JWTSeceret)
		if err != nil {
			respondWithError(w, http.StatusUnauthorized, err.Error())
			return
		}

		transaction := model.NewTransaction(params.Name, params.Type, params.Note, params.Amount, params.Date, userID)

		err = data.AddTransactionToDB(transaction)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		respondWithJson(w, http.StatusOK, response{
			Transaction: transaction,
		})
	}
}

func HandleTransactionUpdate(data model.Data) http.HandlerFunc {
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

		token, err := auth.GetBearerToken(r.Header)
		if err != nil {
			respondWithError(w, http.StatusUnauthorized, err.Error())
			return
		}

		userID, err := auth.ValidateJWT(token, data.JWTSeceret)
		if err != nil {
			respondWithError(w, http.StatusUnauthorized, "Couldn't validate JWT")
			return
		}

		transaction := model.ConvertTransacton(id, params.Name, params.Type, params.Note, params.Amount, params.Date, userID)

		err = data.UpdateTransactionInDB(transaction)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		respondWithJson(w, http.StatusOK, response{
			Transaction: transaction,
		})
	}
}

func HandleTransactionDelete(data model.Data) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := r.PathValue("id")

		id, err := uuid.Parse(idStr)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, "Invalid id")
			return
		}

		data.DeleteTransactionFromDB(id)

		w.WriteHeader(http.StatusNoContent)
	}
}

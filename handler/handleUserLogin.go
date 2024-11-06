package handler

import (
	"encoding/json"
	"net/http"

	"github.com/keertirajmalik/expenser/model"
)

func HandleHome(data *model.Data) http.HandlerFunc {
	type response struct {
		Transaction      []model.Transaction     `json:"transaction"`
		TransactionTypes []model.TransactionType `json:"types"`
	}
	return func(w http.ResponseWriter, r *http.Request) {
		respondWithJson(w, http.StatusOK, response{
			Transaction:      data.GetData().Transactions,
			TransactionTypes: data.GetData().TransactionTypes,
		})
	}
}

func HandleUserLogin(data model.Data) http.HandlerFunc {
	type parameters struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)
		params := parameters{}
		err := decoder.Decode(&params)
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters")
			return
		}

		// In a real application, you would validate the credentials against a database
		if params.Username == "admin" && params.Password == "password" {

			w.WriteHeader(http.StatusNoContent)
		} else {
			w.WriteHeader(http.StatusUnauthorized)
		}
	}
}

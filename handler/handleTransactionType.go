package handler

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/keertirajmalik/expenser/model"
)

func HandleTransactionTypeGet(template *model.Templates, data *model.Data) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		template.Render(w, "transaction-type", data.GetData())
	}
}

func HandleTransactionTypeCreate(template *model.Templates, data *model.Data) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		name := r.FormValue("name")
		description := r.FormValue("description")

		transactionType := model.NewTransactionType(name, description)
		data.AddTransactionTypeData(transactionType)

		template.Render(w, "transaction-type-list-oob", transactionType)
	}
}

func HandleTransactionTypeDelete(_ *model.Templates, data *model.Data) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := r.PathValue("id")

		id, err := uuid.Parse(idStr)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("Invalid id"))
			return
		}

		index := data.TransactionTypeIndexOf(id)
		if index == -1 {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("Transaction type not found"))
			return
		}

		data.TransactionTypes = append(data.TransactionTypes[:index], data.TransactionTypes[index+1:]...)

		w.WriteHeader(http.StatusNoContent)
	}
}

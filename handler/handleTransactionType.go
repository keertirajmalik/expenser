package handler

import (
	"net/http"

	"github.com/keertirajmalik/expenser/model"
)

func HandleTransactionTypeGet(template *model.Templates, data *model.TypeData) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		template.Render(w, "transaction-type", data)
	}
}

func HandleTransactionTypeCreate(template *model.Templates, data *model.TypeData) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		name := r.FormValue("name")
		description := r.FormValue("description")

		transactionType := model.NewTransactionType(name, description)
		template.Render(w, "transaction-type-list-oob", transactionType)
	}
}

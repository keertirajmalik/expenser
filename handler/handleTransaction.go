package handler

import (
	"net/http"
	"strconv"

	"github.com/keertirajmalik/expenser/model"
)

func HandleTransactionGet(template *model.Templates, data *model.Data) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		template.Render(w, "transaction-create", data)
	}
}

func HandleTransactionCreate(template *model.Templates, data *model.Data) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		name := r.FormValue("name")
		amount, _ := strconv.Atoi(r.FormValue("amount"))
		transactionType := r.FormValue("type")
		note := r.FormValue("note")

		transaction := model.NewTransaction(name, transactionType, note, amount)
		data.Transactions = append(data.Transactions, transaction)

		template.Render(w, "transaction-list-oob", transaction)
	}
}

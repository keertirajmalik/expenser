package handler

import (
	"net/http"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/keertirajmalik/expenser/model"
)

func HandleTransactionGet(template *model.Templates, data *model.Data) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		template.Render(w, "transaction-create", data.GetData())
	}
}

func HandleTransactionCreate(template *model.Templates, data *model.Data) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		name := r.FormValue("name")
		amount, _ := strconv.Atoi(r.FormValue("amount"))
		transactionType := r.FormValue("type")
		note := r.FormValue("note")

		// 02/01/2006 used to show the date format. that is how it works in go
		parsedDate, _ := time.Parse("02/01/2006", r.FormValue("date"))

		transaction := model.NewTransaction(name, transactionType, note, amount, parsedDate)
		data.AddTransactionData(transaction)

		template.Render(w, "transaction-list-oob", transaction)
	}
}

func HandleTransactionDelete(_ *model.Templates, data *model.Data) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := r.PathValue("id")

		id, err := uuid.Parse(idStr)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("Invalid id"))
			return
		}

		index := data.TransactionIndexOf(id)
		if index == -1 {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("Transaction not found"))
			return
		}

		data.Transactions = append(data.Transactions[:index], data.Transactions[index+1:]...)

		w.WriteHeader(http.StatusNoContent)
	}
}

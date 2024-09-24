package handler

import (
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/keertirajmalik/expenser/internal/database"
	"github.com/keertirajmalik/expenser/model"
	"github.com/keertirajmalik/expenser/sql"
)

func HandleTransactionGet(template *model.Templates, data *model.Data) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		template.Render(w, "transaction-create", data)
	}
}

func HandleTransactionCreate(template *model.Templates, data *model.Data, db *sql.DbConfig) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		name := r.FormValue("name")
		amount, _ := strconv.Atoi(r.FormValue("amount"))
		transactionType := r.FormValue("type")
		note := r.FormValue("note")

		// 02/01/2006 used to show the date format. that is how it works in go
		parsedDate, _ := time.Parse("02/01/2006", r.FormValue("date"))

		transaction := model.NewTransaction(name, transactionType, note, amount, parsedDate)

		_, err := db.DB.CreateTransaction(r.Context(), database.CreateTransactionParams{
			ID:     uuid.New(),
			Name:   transaction.Name,
			Type:   transaction.TransactionType,
			Amount: int32(transaction.Amount),
			Date:   transaction.Date,
			Note:   note,
		})

		if err != nil {
			log.Println("Couldn't create transaction in DB", err)
		}
		template.Render(w, "transaction-list-oob", transaction)
	}
}

func HandleTransactionDelete(_ *model.Templates, data *model.Data) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := r.PathValue("id")

		id, err := strconv.Atoi(idStr)
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

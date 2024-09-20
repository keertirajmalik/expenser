package main

import (
	"log"
	"net/http"
	"strconv"
)

type Transaction struct {
	Name            string
	Amount          int
	TransactionType string
	Note            string
}

func newTransaction(transaction, transactionType, note string, amount int) Transaction {
	return Transaction{
		Name:            transaction,
		Amount:          amount,
		TransactionType: transactionType,
		Note:            note,
	}
}

type Data struct {
	Transactions []Transaction
}

func newData() Data {
	return Data{
		Transactions: []Transaction{
			newTransaction("Tea", "food", "", 10),
			newTransaction("Bike", "Travel", "", 100),
		},
	}
}
func main() {
	const port = "8080"

	template := newTemplates()

	mux := http.NewServeMux()

	data := newData()

	mux.HandleFunc("GET /", handleGetHome(template, data))
	mux.HandleFunc("POST /transaction", handleTransactionCreate(template, data))
	server := &http.Server{
		Addr:    ":" + port,
		Handler: mux,
	}

	log.Printf("Start of our new project on port:%s \n", port)
	log.Fatal(server.ListenAndServe())
}

func handleGetHome(template *Templates, data Data) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		template.Render(w, "home", data)
	}
}

func handleTransactionCreate(template *Templates, data Data) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		name := r.FormValue("name")
		amount, _ := strconv.Atoi(r.FormValue("amount"))
		transactionType := r.FormValue("type")
		note := r.FormValue("note")

		transaction := newTransaction(name, transactionType, note, amount)
		data.Transactions = append(data.Transactions, transaction)

		template.Render(w, "transaction-list-oob", transaction)
	}
}

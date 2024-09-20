package main

import (
	"log"
	"net/http"

	"github.com/keertirajmalik/expenser/handler"
	"github.com/keertirajmalik/expenser/model"
)

func main() {
	const port = "8080"

	template := model.NewTemplates()

	mux := http.NewServeMux()

	transactionData := model.NewTransactionData()
    transactionTypeData := model.NewTransactionTypesData()

    fs := http.FileServer(http.Dir("views/css"))
    mux.Handle("GET /css/", http.StripPrefix("/css/", fs))

	mux.HandleFunc("GET /", handler.HandleTransactionGet(template, &transactionData))
	mux.HandleFunc("POST /transaction", handler.HandleTransactionCreate(template, &transactionData))

	mux.HandleFunc("GET /type", handler.HandleTransactionTypeGet(template, &transactionTypeData))
	mux.HandleFunc("POST /type", handler.HandleTransactionTypeCreate(template, &transactionTypeData))
	server := &http.Server{
		Addr:    ":" + port,
		Handler: mux,
	}

	log.Printf("Start of our new project on port:%s \n", port)
	log.Fatal(server.ListenAndServe())
}

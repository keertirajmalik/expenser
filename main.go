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

	data := model.NewData()

	mux.HandleFunc("GET /", handler.HandleTransactionGet(template, &data))
	mux.HandleFunc("POST /transaction", handler.HandleTransactionCreate(template, &data))
	server := &http.Server{
		Addr:    ":" + port,
		Handler: mux,
	}

	log.Printf("Start of our new project on port:%s \n", port)
	log.Fatal(server.ListenAndServe())
}


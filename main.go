package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/keertirajmalik/expenser/handler"
	"github.com/keertirajmalik/expenser/model"
	"github.com/keertirajmalik/expenser/sql"
	_ "github.com/lib/pq"
)

func main() {

	godotenv.Load()

	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("PORT is not found in the enviornment")
	}

	dbURL := os.Getenv("DB_URL")
	if dbURL == "" {
		log.Fatal("DB_URL is not found in the enviornment")
	}

	dbConfig := sql.CreateDbConnection(dbURL)

	template := model.NewTemplates()

	mux := http.NewServeMux()

	transactionData := model.NewData()

	fs := http.FileServer(http.Dir("views/css"))
	mux.Handle("GET /css/", http.StripPrefix("/css/", fs))

	mux.HandleFunc("GET /", HandleHome(template, &transactionData))

	mux.HandleFunc("GET /transaction", handler.HandleTransactionGet(template, &transactionData))
	mux.HandleFunc("POST /transaction", handler.HandleTransactionCreate(template, &transactionData, &dbConfig))
	mux.HandleFunc("DELETE /transaction/{id}", handler.HandleTransactionDelete(template, &transactionData))

	mux.HandleFunc("GET /type", handler.HandleTransactionTypeGet(template, &transactionData))
	mux.HandleFunc("POST /type", handler.HandleTransactionTypeCreate(template, &transactionData))
	mux.HandleFunc("DELETE /type/{id}", handler.HandleTransactionTypeDelete(template, &transactionData))

	server := &http.Server{
		Addr:    ":" + port,
		Handler: mux,
	}

	log.Printf("Start of our new project on port:%s \n", port)
	log.Fatal(server.ListenAndServe())
}

func HandleHome(template *model.Templates, data *model.Data) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		template.Render(w, "home", data)
	}
}

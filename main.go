package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/keertirajmalik/expenser/db"
	"github.com/keertirajmalik/expenser/handler"
	"github.com/keertirajmalik/expenser/middleware"
	"github.com/keertirajmalik/expenser/model"
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

	dbConfig := db.CreateDbConnection(dbURL)

	mux := http.NewServeMux()

	transactionData := model.Data{DBConfig: &dbConfig}

	//	mux.HandleFunc("GET /", HandleLogin(template))

	mux.HandleFunc("POST /login", handler.HandleUserLogin(transactionData))

	mux.HandleFunc("GET /home", handler.HandleHome(&transactionData))

	mux.HandleFunc("GET /transaction", handler.HandleTransactionGet(&transactionData))
	mux.HandleFunc("POST /transaction", handler.HandleTransactionCreate(&transactionData))
	mux.HandleFunc("DELETE /transaction/{id}", handler.HandleTransactionDelete(&transactionData))

	mux.HandleFunc("GET /type", handler.HandleTransactionTypeGet(&transactionData))
	mux.HandleFunc("POST /type", handler.HandleTransactionTypeCreate(&transactionData))
	mux.HandleFunc("DELETE /type/{id}", handler.HandleTransactionTypeDelete(&transactionData))

	server := &http.Server{
		Addr:    ":" + port,
		Handler: middleware.Logging(mux),
	}

	log.Printf("Start of our new project on port:%s \n", port)
	log.Fatal(server.ListenAndServe())
}

func HandleLogin(template *model.Templates) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		template.Render(w, "login", nil)
	}
}

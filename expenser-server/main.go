package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/keertirajmalik/expenser/expenser-server/db"
	"github.com/keertirajmalik/expenser/expenser-server/handler"
	"github.com/keertirajmalik/expenser/expenser-server/middleware"
	"github.com/keertirajmalik/expenser/expenser-server/model"
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

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET enviornment variable is not set")
	}

	dbConfig, err := db.CreateDbConnection(dbURL)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	mux := http.NewServeMux()

	config := model.Config{
		DBConfig:   &dbConfig,
		JWTSecret: jwtSecret,
	}

	mux.HandleFunc("POST /cxf/login", handler.HandleUserLogin(config))

	mux.HandleFunc("POST /cxf/user", handler.HandleUserCreate(config))

	mux.HandleFunc("GET /cxf/transaction", handler.HandleTransactionGet(config))
	mux.HandleFunc("POST /cxf/transaction", handler.HandleTransactionCreate(config))
	mux.HandleFunc("DELETE /cxf/transaction/{id}", handler.HandleTransactionDelete(config))
	mux.HandleFunc("PUT /cxf/transaction/{id}", handler.HandleTransactionUpdate(config))

	mux.HandleFunc("GET /cxf/type", handler.HandleTransactionTypeGet(config))
	mux.HandleFunc("POST /cxf/type", handler.HandleTransactionTypeCreate(config))
	mux.HandleFunc("DELETE /type/{id}", handler.HandleTransactionTypeDelete(config))

	stack := middleware.CreateStack(
		middleware.Logging,
		middleware.AllowCors,
	)

	server := &http.Server{
		Addr:    ":" + port,
		Handler: stack(mux),
	}

	log.Printf("Start of our new project on port:%s \n", port)
	log.Fatal(server.ListenAndServe())
}

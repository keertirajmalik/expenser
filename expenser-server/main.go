package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/joho/godotenv"
	"github.com/keertirajmalik/expenser/expenser-server/database"
	"github.com/keertirajmalik/expenser/expenser-server/internal/handler"
	"github.com/keertirajmalik/expenser/expenser-server/internal/repository"
	"github.com/keertirajmalik/expenser/expenser-server/middleware"
	"github.com/keertirajmalik/expenser/expenser-server/internal/model"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("PORT is not found in the environment")
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET environment variable is not set")
	}

	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()

	db, err := database.Connect(ctx)
	if err != nil {
		log.Fatal("failed to connect to database: ", err)
	}
	mux := http.NewServeMux()

	config := model.Config{
		Queries:   repository.New(db),
		JWTSecret: []byte(jwtSecret),
	}

	mux.HandleFunc("POST /cxf/login", handler.HandleUserLogin(config))

	mux.HandleFunc("POST /cxf/user", handler.HandleUserCreate(config))

	mux.HandleFunc("GET /cxf/transaction", handler.HandleTransactionGet(config))
	mux.HandleFunc("POST /cxf/transaction", handler.HandleTransactionCreate(config))
	mux.HandleFunc("DELETE /cxf/transaction/{id}", handler.HandleTransactionDelete(config))
	mux.HandleFunc("PUT /cxf/transaction/{id}", handler.HandleTransactionUpdate(config))

	mux.HandleFunc("GET /cxf/type", handler.HandleTransactionTypeGet(config))
	mux.HandleFunc("POST /cxf/type", handler.HandleTransactionTypeCreate(config))
	mux.HandleFunc("DELETE /cxf/type/{id}", handler.HandleTransactionTypeDelete(config))
	//mux.HandleFunc("PUT /cxf/type/{id}", handler.HandleTransactionTypeUpdate(config))

	stack := middleware.CreateStack(
		middleware.AllowCors,
		middleware.Logging,
		middleware.AuthMiddleware,
	)

	server := &http.Server{
		Addr:    ":" + port,
		Handler: stack(mux),
	}

	log.Printf("Server is running on port %s\n", port)
	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed: %v", err)
		}
	}()

	<-ctx.Done()
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(shutdownCtx); err != nil {
		log.Printf("Server shutdown failed: %v", err)
	}
	db.Close()
}

package server

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/keertirajmalik/expenser/expenser-server/internal/handler"
	"github.com/keertirajmalik/expenser/expenser-server/internal/model"
)

func (s *Server) RegisterRoutes(config model.Config) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", s.healthHandler)

	mux.HandleFunc("POST /cxf/login", handler.HandleUserLogin(config))

	mux.HandleFunc("POST /cxf/user", handler.HandleUserCreate(config))
	mux.HandleFunc("PUT /cxf/user", handler.HandleUserUpdate(config))

	mux.HandleFunc("GET /cxf/transaction", handler.HandleTransactionGet(config))
	mux.HandleFunc("POST /cxf/transaction", handler.HandleTransactionCreate(config))
	mux.HandleFunc("DELETE /cxf/transaction/{id}", handler.HandleTransactionDelete(config))
	mux.HandleFunc("PUT /cxf/transaction/{id}", handler.HandleTransactionUpdate(config))

	mux.HandleFunc("GET /cxf/type", handler.HandleTransactionTypeGet(config))
	mux.HandleFunc("POST /cxf/type", handler.HandleTransactionTypeCreate(config))
	mux.HandleFunc("DELETE /cxf/type/{id}", handler.HandleTransactionTypeDelete(config))
	mux.HandleFunc("PUT /cxf/type/{id}", handler.HandleTransactionTypeUpdate(config))

	return mux
}

func (s *Server) healthHandler(w http.ResponseWriter, r *http.Request) {
	resp, err := json.Marshal(s.db.Health())
	if err != nil {
		http.Error(w, "Failed to marshal health check response", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if _, err := w.Write(resp); err != nil {
		log.Printf("Failed to write response: %v", err)
	}
}

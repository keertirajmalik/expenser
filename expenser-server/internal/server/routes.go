package server

import (
	"encoding/json"
	"net/http"

	"github.com/keertirajmalik/expenser/expenser-server/internal/handler"
	"github.com/keertirajmalik/expenser/expenser-server/internal/model"
	"github.com/keertirajmalik/expenser/expenser-server/logger"
)

func (s *Server) RegisterRoutes(config model.Config) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", s.healthHandler)

	mux.HandleFunc("POST /cxf/login", handler.HandleUserLogin(config))

	mux.HandleFunc("GET /cxf/user", handler.HandleUserGet(config))
	mux.HandleFunc("POST /cxf/user", handler.HandleUserCreate(config))
	mux.HandleFunc("PUT /cxf/user", handler.HandleUserUpdate(config))

	mux.HandleFunc("GET /cxf/transaction", handler.HandleTransactionGet(config))
	mux.HandleFunc("POST /cxf/transaction", handler.HandleTransactionCreate(config))
	mux.HandleFunc("DELETE /cxf/transaction/{id}", handler.HandleTransactionDelete(config))
	mux.HandleFunc("PUT /cxf/transaction/{id}", handler.HandleTransactionUpdate(config))

	mux.HandleFunc("GET /cxf/category", handler.HandleCategoryGet(config))
	mux.HandleFunc("POST /cxf/category", handler.HandleCategoryCreate(config))
	mux.HandleFunc("DELETE /cxf/category/{id}", handler.HandleCategoryDelete(config))
	mux.HandleFunc("PUT /cxf/category/{id}", handler.HandleCategoryUpdate(config))

	mux.HandleFunc("POST /cxf/investment", handler.HandleInvestmentCreate(config))
	return mux
}

func (s *Server) healthHandler(w http.ResponseWriter, r *http.Request) {
	logger.Debug("processing health check request")
	resp, err := json.Marshal(s.db.Health())
	if err != nil {
		http.Error(w, "Failed to marshal health check response", http.StatusInternalServerError)
		logger.Error("failed to marshal health check response", map[string]interface{}{
			"error": err,
		})
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if _, err := w.Write(resp); err != nil {
		logger.Error("failed to write health cealth check response", map[string]interface{}{
			"error": err,
		})
	}
	logger.Info("health check completed successfully")
}

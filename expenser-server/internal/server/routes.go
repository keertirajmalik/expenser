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

	mux.HandleFunc("POST /cxf/login", handler.HandleUserLogin(config.UserService))

	mux.HandleFunc("GET /cxf/user", handler.HandleUserGet(config.UserService))
	mux.HandleFunc("POST /cxf/user", handler.HandleUserCreate(config.UserService))
	mux.HandleFunc("PUT /cxf/user", handler.HandleUserUpdate(config.UserService))

	mux.HandleFunc("GET /cxf/transaction", handler.HandleTransactionGet(config.TransactionService))
	mux.HandleFunc("POST /cxf/transaction", handler.HandleTransactionCreate(config.TransactionService))
	mux.HandleFunc("DELETE /cxf/transaction/{id}", handler.HandleTransactionDelete(config.TransactionService))
	mux.HandleFunc("PUT /cxf/transaction/{id}", handler.HandleTransactionUpdate(config.TransactionService))

	mux.HandleFunc("GET /cxf/category", handler.HandleCategoryGet(config.CategoryService))
	mux.HandleFunc("POST /cxf/category", handler.HandleCategoryCreate(config.CategoryService))
	mux.HandleFunc("DELETE /cxf/category/{id}", handler.HandleCategoryDelete(config.CategoryService))
	mux.HandleFunc("PUT /cxf/category/{id}", handler.HandleCategoryUpdate(config.CategoryService))

	mux.HandleFunc("POST /cxf/investment", handler.HandleInvestmentCreate(config.InvestmentService))
	mux.HandleFunc("GET /cxf/investment", handler.HandleInvestmentGet(config.InvestmentService))
	mux.HandleFunc("PUT /cxf/investment/{id}", handler.HandleInvestmentUpdate(config.InvestmentService))
	mux.HandleFunc("DELETE /cxf/investment/{id}", handler.HandleInvestmentDelete(config.InvestmentService))

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

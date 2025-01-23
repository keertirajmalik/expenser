package handler

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/keertirajmalik/expenser/expenser-server/logger"
)

func respondWithError(w http.ResponseWriter, code int, msg string) {
	if code > 499 {
		logger.Error("Responding with 5XX error", map[string]interface{}{
			"code":    code,
			"message": msg,
		})
	}

	type errorResponse struct {
		Error string `json:"error"`
	}

	respondWithJson(w, code, errorResponse{
		Error: msg,
	})
}

func respondWithJson(w http.ResponseWriter, code int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	dat, err := json.Marshal(payload)
	if err != nil {
		logger.Error("Error marshalling JSON", map[string]interface{}{
			"payload": payload,
			"error":   err,
		})
		w.WriteHeader(500)
		return
	}

	w.Header().Set("Content-Length", fmt.Sprintf("%d", len(dat)))
	w.WriteHeader(code)
	w.Write(dat)
}

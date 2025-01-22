package handler

import (
	"encoding/json"
	"fmt"
	"net/http"

)

func respondWithError(w http.ResponseWriter, code int, msg string) {
	if code > 499 {
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
		w.WriteHeader(500)
		return
	}

	w.Header().Set("Content-Length", fmt.Sprintf("%d", len(dat)))
	w.WriteHeader(code)
	w.Write(dat)
}

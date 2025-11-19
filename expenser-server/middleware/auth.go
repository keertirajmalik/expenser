package middleware

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/keertirajmalik/expenser/expenser-server/auth"
	"github.com/keertirajmalik/expenser/expenser-server/logger"
)

type errorResponse struct {
	Error string `json:"error"`
}

func AuthMiddleware(jwtSecret string) Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if strings.Contains(r.URL.Path, "login") || (strings.Contains(r.URL.Path, "user") && r.Method == "POST") {
				next.ServeHTTP(w, r)
				return
			}

			token, err := auth.GetBearerToken(r.Header)
			if err != nil {
				logger.Error("error with token", map[string]any{"error": err})
				respondWithJson(w, err)
				return
			}

			userID, err := auth.ValidateJWT(token, []byte(jwtSecret))
			if err != nil {
				logger.Error("error with token", map[string]any{"error": err})
				respondWithJson(w, err)
				return
			}

			// Add userID to request context
			ctx := context.WithValue(r.Context(), auth.UserIDKey, userID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func respondWithJson(w http.ResponseWriter, err error) {
	dat, err := json.Marshal(errorResponse{
		Error: err.Error(),
	})
	if err != nil {
		logger.Error("Error marshalling JSON", map[string]any{"error": err})
		w.WriteHeader(500)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusUnauthorized)
	_, err = w.Write(dat)
	if err != nil {
		logger.Error("error while writing the response", map[string]any{"error": err})
		w.WriteHeader(500)
		return
	}
}

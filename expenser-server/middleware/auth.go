package middleware

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/keertirajmalik/expenser/expenser-server/internal/auth"
)

type errorResponse struct {
	Error string `json:"error"`
}

func AuthMiddleware(next http.Handler) http.Handler {

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET environment variable is not set")
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.Contains(r.URL.Path, "login") || strings.Contains(r.URL.Path, "user") {
			next.ServeHTTP(w, r)
			return
		}

		token, err := auth.GetBearerToken(r.Header)
		if err != nil {
			respondWithJson(w, err)
			return
		}

		userID, err := auth.ValidateJWT(token, []byte(jwtSecret))
		if err != nil {
            log.Print("I am here")
			respondWithJson(w, err)
			return
		}

		// Add userID to request context
		ctx := context.WithValue(r.Context(), "userID", userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func respondWithJson(w http.ResponseWriter, err error) {
	dat, err := json.Marshal(errorResponse{
		Error: err.Error(),
	})
	if err != nil {
		log.Printf("Error marshalling JSON: %s", err)
		w.WriteHeader(500)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusUnauthorized)
	w.Write(dat)
}

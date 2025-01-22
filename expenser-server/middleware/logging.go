package middleware

import (
	"fmt"
	"net/http"
	"time"

	"github.com/keertirajmalik/expenser/expenser-server/logger"
)

type wrappedWriter struct {
	http.ResponseWriter
	statusCode int
}

func (w *wrappedWriter) WriteHeader(statusCode int) {
	w.ResponseWriter.WriteHeader(statusCode)
	w.statusCode = statusCode
}

func Logging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		wrapped := &wrappedWriter{
			ResponseWriter: w,
			statusCode:     http.StatusOK,
		}

		next.ServeHTTP(wrapped, r)

		duration := time.Since(start)
		logMessage := fmt.Sprintf("HTTP Request: %d | %s | %s | %s",
			wrapped.statusCode, // Status code
			r.Method,           // HTTP method
			r.URL.Path,         // Request path
			duration,           // Duration
		)
		logger.Info(r.Context(), logMessage)
	})
}


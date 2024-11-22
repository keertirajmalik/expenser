package middleware

import "net/http"

type Middleware func(http.Handler) http.Handler

func CreateStack(middlewares ...Middleware) Middleware {
	return func(next http.Handler) http.Handler {
		if next == nil {
			next = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {})
		}
		for i := len(middlewares) - 1; i >= 0; i-- {
			middleware := middlewares[i]
            if middleware == nil {
                continue
            }
			next = middleware(next)
		}
		return next
	}
}

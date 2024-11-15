package middleware

import "net/http"

type Middelware func(http.Handler) http.Handler

func CreateStack(xs ...Middelware) Middelware {
	return func(next http.Handler) http.Handler {
		for i := len(xs) - 1; i >= 0; i-- {
			x := xs[i]
			next = x(next)
		}
		return next
	}
}

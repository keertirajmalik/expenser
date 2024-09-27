package handler

import (
	"net/http"

	"github.com/keertirajmalik/expenser/model"
)

func HandleUserLogin(template *model.Templates, data model.Data) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		username := r.FormValue("username")
		password := r.FormValue("password")

		// In a real application, you would validate the credentials against a database
		if username == "admin" && password == "password" {
			w.Header().Set("HX-Redirect", "/home")

			template.Render(w, "home", data.GetData())
		} else {
			template.Render(w, "login", nil)
		}
	}
}

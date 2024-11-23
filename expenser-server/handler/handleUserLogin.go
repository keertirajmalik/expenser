package handler

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/keertirajmalik/expenser/expenser-server/internal/auth"
	"github.com/keertirajmalik/expenser/expenser-server/model"
)

func HandleUserLogin(data model.Config) http.HandlerFunc {
	type parameters struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	type response struct {
		Name     string `json:"name"`
		Username string `json:"username"`
		Token    string `json:"token"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)
		params := parameters{}
		err := decoder.Decode(&params)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, "Invalid request payload")
			return
		}

		user, err := data.GetUserByUsernameFromDB(r.Context(), params.Username)
		if err != nil {
			respondWithError(w, http.StatusUnauthorized, "Invalid credentials")
			return
		}

		err = auth.CheckPasswordHash(params.Password, user.HashedPassword)
		if err != nil {
			respondWithError(w, http.StatusUnauthorized, "Invalid credentials")
			return
		}

		accessToken, err := auth.MakeJWT(user.ID, data.JWTSecret, time.Hour)
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "Couldn't create JWT")
			return
		}

		respondWithJson(w, http.StatusOK, response{
			Name:     user.Name,
			Username: user.Username,
			Token:    accessToken,
		})
	}

}

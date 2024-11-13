package handler

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/keertirajmalik/expenser/internal/auth"
	"github.com/keertirajmalik/expenser/model"
)

func HandleUserLogin(data model.Config) http.HandlerFunc {
	type parameters struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	type response struct {
		model.User
		Token string `json:"token"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)
		params := parameters{}
		err := decoder.Decode(&params)
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters")
			return
		}

		user, err := data.GetUserByUsernameFromDB(params.Username)
		if err != nil {
			respondWithError(w, http.StatusUnauthorized, "Invalid user")
			return
		}

		err = auth.CheckPasswordHash(params.Password, user.HashedPassword)
		if err != nil {
			respondWithError(w, http.StatusUnauthorized, "Invalid password")
			return
		}

		accessToken, err := auth.MakeJWT(user.ID, data.JWTSeceret, time.Hour)
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "Couldn't create JWT")
			return
		}

		respondWithJson(w, http.StatusOK, response{
			User: model.User{
				Name:     user.Name,
				Username: user.Username,
			},
			Token: accessToken,
		})
	}

}

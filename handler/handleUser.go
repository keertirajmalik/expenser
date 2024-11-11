package handler

import (
	"encoding/json"
	"net/http"

	"github.com/keertirajmalik/expenser/internal/auth"
	"github.com/keertirajmalik/expenser/model"
)

func HandleUserCreate(data *model.Data) http.HandlerFunc {
	type parameters struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	return func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)
		params := parameters{}
		err := decoder.Decode(&params)
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters")
			return
		}

		if params.Username == "" || params.Password == "" {
			respondWithError(w, http.StatusBadRequest, "Provide valid credentials")
			return
		}

		hashedPassword, err := auth.HashPassword(params.Password)
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "Couldn't hash password")
			return
		}

		user := model.NewUser(params.Username, hashedPassword)
		user, err = data.AddUserToDB(user)
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, err.Error())
			return
		}
		respondWithJson(w, http.StatusCreated, model.User{
			ID:       user.ID,
			Username: user.Username,
		})
	}

}

package handler

import (
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/keertirajmalik/expenser/expenser-server/auth"
	"github.com/keertirajmalik/expenser/expenser-server/internal/model"
	"github.com/keertirajmalik/expenser/expenser-server/logger"
)

func HandleUserLogin(userService model.UserService) http.HandlerFunc {
	type parameters struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	type response struct {
		Name     string `json:"name"`
		Username string `json:"username"`
		Token    string `json:"token"`
		Image    string `json:"image"`
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		logger.Error("JWT_SECRET environment variable is not set", map[string]interface{}{})
		os.Exit(1)
	}
	return func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)
		params := parameters{}
		err := decoder.Decode(&params)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, "Invalid request payload")
			return
		}

		user, err := userService.GetUserByUsernameFromDB(r.Context(), params.Username)
		if err != nil {
			respondWithError(w, http.StatusUnauthorized, "Invalid credentials")
			return
		}

		err = auth.CheckPasswordHash(params.Password, user.HashedPassword)
		if err != nil {
			respondWithError(w, http.StatusUnauthorized, "Invalid credentials")
			return
		}

		accessToken, err := auth.MakeJWT(user.ID, []byte(jwtSecret), time.Hour)
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "Couldn't create JWT")
			return
		}

		respondWithJson(w, http.StatusOK, response{
			Name:     user.Name,
			Username: user.Username,
			Token:    accessToken,
			Image:    user.Image,
		})
	}

}

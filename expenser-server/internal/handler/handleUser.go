package handler


import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"github.com/keertirajmalik/expenser/expenser-server/auth"
	"github.com/keertirajmalik/expenser/expenser-server/internal/model"
)

func HandleUserGet(data model.Config) http.HandlerFunc {
	type response struct {
		Name     string `json:"name"`
		Username string `json:"username"`
		Image    string `json:"image"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value("userID").(uuid.UUID)

		user, err := data.GetUserByUserIdFromDB(r.Context(), userID)
		if err != nil {
			respondWithError(w, http.StatusUnauthorized, err.Error())
			return
		}

		respondWithJson(w, http.StatusOK, response{
			Name:     user.Name,
			Username: user.Username,
			Image:    user.Image,
		})
	}

}
func HandleUserCreate(data model.Config) http.HandlerFunc {
	type parameters struct {
		Name     string `json:"name"`
		Username string `json:"username"`
		Password string `json:"password"`
	}
	return func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)
		decoder.DisallowUnknownFields()
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

		user, err := data.AddUserToDB(r.Context(), model.User{ID: uuid.New(), Name: params.Name, Username: params.Username, HashedPassword: hashedPassword})

		if err != nil {
			respondWithError(w, http.StatusInternalServerError, err.Error())
			return
		}
		respondWithJson(w, http.StatusCreated, model.User{
			ID:       user.ID,
			Username: user.Username,
			Name:     user.Name,
		})
	}

}

func HandleUserUpdate(data model.Config) http.HandlerFunc {
	type parameters struct {
		Name  string `json:"name"`
		Image string `json:"image"`
	}
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value("userID").(uuid.UUID)

		decoder := json.NewDecoder(r.Body)
		decoder.DisallowUnknownFields()
		params := parameters{}
		err := decoder.Decode(&params)
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters")
			return
		}

		user, err := data.UpdateUserInDB(r.Context(), model.User{
			ID:    userID,
			Name:  params.Name,
			Image: params.Image,
		})

		if err != nil {
			respondWithError(w, http.StatusInternalServerError, err.Error())
			return
		}
		respondWithJson(w, http.StatusOK, model.User{
			ID:       user.ID,
			Username: user.Username,
			Name:     user.Name,
			Image:    user.Image,
		})
	}

}

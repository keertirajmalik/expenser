package handler

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"github.com/keertirajmalik/expenser/expenser-server/internal/model"
	"github.com/keertirajmalik/expenser/expenser-server/logger"
)

func HandleCategoryGet(data model.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value("userID").(uuid.UUID)
		categories, err := data.GetCategoriesFromDB(r.Context(), userID)
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "Failed to retrieve categories")
			return
		}
		respondWithJson(w, http.StatusOK, categories)
	}
}

func HandleCategoryCreate(data model.Config) http.HandlerFunc {
	type parameters struct {
		Name        string `json:"name"`
		Type        string `json:"type"`
		Description string `json:"description"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)
		params := parameters{}
		err := decoder.Decode(&params)
		if err != nil {
			logger.Error("Error while decoding parameters:%s", map[string]interface{}{
				"error":  err,
				"params": params,
			})
			respondWithError(w, http.StatusBadRequest, "Couldn't decode parameters")
			return
		}

		if len(params.Name) == 0 {
			respondWithError(w, http.StatusBadRequest, "Category name cannot be empty")
			return
		}
		if len(params.Name) > 50 {
			respondWithError(w, http.StatusBadRequest, "Category name too long")
			return
		}

		if len(params.Type) == 0 {
			respondWithError(w, http.StatusBadRequest, "Category type cannot be empty")
			return
		}

		if !(params.Type == "Expense" || params.Type == "Investment") {
			respondWithError(w, http.StatusBadRequest, "Category type has to be Expense or Investment")
			return
		}

		userID := r.Context().Value("userID").(uuid.UUID)
		category, err := data.AddCategoryToDB(r.Context(), model.Category{
			ID:          uuid.New(),
			Name:        params.Name,
			Type:        params.Type,
			Description: params.Description,
			UserID:      userID,
		})

		if err != nil {
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}

		respondWithJson(w, http.StatusOK, category)
	}
}

func HandleCategoryUpdate(data model.Config) http.HandlerFunc {
	type parameters struct {
		Name        string `json:"name"`
		Type        string `json:"type"`
		Description string `json:"description"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		idStr := r.PathValue("id")

		id, err := uuid.Parse(idStr)
		if err != nil {
			logger.Error("Error while parsing uuid", map[string]interface{}{
				"error": err,
				"uuid":  idStr,
			})
			respondWithError(w, http.StatusBadRequest, "Invalid id")
			return
		}

		decoder := json.NewDecoder(r.Body)
		params := parameters{}
		err = decoder.Decode(&params)
		if err != nil {
			logger.Error("Error while decoding parameters:%s", map[string]interface{}{
				"error":  err,
				"params": params,
			})
			respondWithError(w, http.StatusBadRequest, "Couldn't decode parameters")
			return
		}

		if len(params.Name) == 0 {
			respondWithError(w, http.StatusBadRequest, "Category name cannot be empty")
			return
		}
		if len(params.Name) > 50 {
			respondWithError(w, http.StatusBadRequest, "Category name too long")
			return
		}

		if !(params.Type == "Expense" || params.Type == "Investment") {
			respondWithError(w, http.StatusBadRequest, "Category type has to be Expense or Investment")
			return
		}

		userID := r.Context().Value("userID").(uuid.UUID)
		category, err := data.UpdateCategoryInDB(r.Context(), model.Category{
			ID:          id,
			Name:        params.Name,
			Type:        params.Type,
			Description: params.Description,
			UserID:      userID,
		})

		if err != nil {
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		respondWithJson(w, http.StatusOK, category)
	}
}

func HandleCategoryDelete(data model.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := r.PathValue("id")

		id, err := uuid.Parse(idStr)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, "Invalid id")
			return
		}

		userID := r.Context().Value("userID").(uuid.UUID)
		err = data.DeleteCategoryFromDB(r.Context(), id, userID)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}

		w.WriteHeader(http.StatusNoContent)
	}
}

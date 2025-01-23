package handler

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"github.com/keertirajmalik/expenser/expenser-server/internal/model"
	"github.com/keertirajmalik/expenser/expenser-server/logger"
	"github.com/shopspring/decimal"
)

func HandleInvestmentCreate(data model.Config) http.HandlerFunc {
	type parameters struct {
		Name     string          `json:"name"`
		Amount   decimal.Decimal `json:"amount"`
		Category uuid.UUID       `json:"category"`
		Date     string          `json:"date"`
		Note     string          `json:"note"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)
		params := parameters{}
		err := decoder.Decode(&params)
		if err != nil {
			logger.Error("Error while decoding parameters", map[string]interface{}{
				"params": params,
				"error":  err,
			})
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}

		userID := r.Context().Value("userID").(uuid.UUID)

		investment := model.InputInvestment{
			ID:       uuid.New(),
			Name:     params.Name,
			Category: params.Category,
			Note:     params.Note,
			Amount:   params.Amount,
			Date:     params.Date,
			UserID:   userID,
		}

		dbCategory, err := data.GetCategoryByIdFromDB(r.Context(), investment.Category, investment.UserID)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}

		if dbCategory.Type != "Investment" {
			logger.Error("Category type should be Investment", map[string]interface{}{
				"category_name": dbCategory.Name,
				"category_type": dbCategory.Type,
			})
			respondWithError(w, http.StatusBadRequest, "Category type should be Investment")
			return
		}

		dbInvestment, err := data.AddInvestmentToDB(r.Context(), investment)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		respondWithJson(w, http.StatusOK, dbInvestment)
	}
}

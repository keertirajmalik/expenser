package handler

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/keertirajmalik/expenser/expenser-server/internal/model"
	"github.com/keertirajmalik/expenser/expenser-server/logger"
	"github.com/shopspring/decimal"
)

func HandleInvestmentGet(investmentService model.InvestmentService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value("userID").(uuid.UUID)
		investments, err := investmentService.GetInvestmentsFromDB(r.Context(), userID)
		if err != nil {
			logger.Error("Error while fetching investments", map[string]interface{}{
				"error": err,
			})
			respondWithError(w, http.StatusInternalServerError, err.Error())
			return
		}

		respondWithJson(w, http.StatusOK, investments)
	}
}

func HandleInvestmentCreate(investmentService model.InvestmentService) http.HandlerFunc {
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

		dbInvestment, err := investmentService.AddInvestmentToDB(r.Context(), investment)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		respondWithJson(w, http.StatusCreated, dbInvestment)
	}
}

func HandleInvestmentUpdate(investmentService model.InvestmentService) http.HandlerFunc {
	type parameters struct {
		Name     string          `json:"name"`
		Amount   decimal.Decimal `json:"amount"`
		Category uuid.UUID       `json:"category"`
		Date     string          `json:"date"`
		Note     string          `json:"note"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		idStr := r.PathValue("id")

		id, err := uuid.Parse(idStr)
		if err != nil {
			logger.Error("Error while parsing investment ID", map[string]interface{}{
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
			logger.Error("Error while decoding parameters", map[string]interface{}{
				"error":  err,
				"params": params,
			})
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}

		userID := r.Context().Value("userID").(uuid.UUID)

		investment := model.InputInvestment{
			ID:       id,
			Name:     params.Name,
			Category: params.Category,
			Note:     params.Note,
			Amount:   params.Amount,
			Date:     params.Date,
			UserID:   userID,
		}

		dbInvestment, err := investmentService.UpdateInvestmentInDB(r.Context(), investment)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		respondWithJson(w, http.StatusOK, dbInvestment)
	}
}

func HandleInvestmentDelete(investmentService model.InvestmentService) http.HandlerFunc {
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

		userID := r.Context().Value("userID").(uuid.UUID)
		err = investmentService.DeleteInvestmentFromDB(r.Context(), id, userID)
		if err != nil {
			if err == pgx.ErrNoRows {
				respondWithError(w, http.StatusNotFound, "Investment not found")
				return
			}
			logger.Error("Error while deleting investment", map[string]interface{}{
				"investmentId": id,
				"userIDd":      userID,
				"error":        err,
			})
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}

		w.WriteHeader(http.StatusNoContent)
	}
}

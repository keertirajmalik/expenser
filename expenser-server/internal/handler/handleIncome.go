package handler

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/keertirajmalik/expenser/expenser-server/auth"
	"github.com/keertirajmalik/expenser/expenser-server/internal/model"
	"github.com/keertirajmalik/expenser/expenser-server/logger"
	"github.com/shopspring/decimal"
)

func HandleIncomeGet(incomeService model.IncomeService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, ok := auth.UserIDFromContext(r.Context())
		if !ok {
			respondWithError(w, http.StatusUnauthorized, "Unauthorized")
			return
		}
		incomes, err := incomeService.GetIncomesFromDB(r.Context(), userID)
		if err != nil {
			logger.Error("Error while fetching incomes", map[string]interface{}{
				"error": err,
			})
			respondWithError(w, http.StatusInternalServerError, err.Error())
			return
		}

		respondWithJson(w, http.StatusOK, incomes)
	}
}

func HandleIncomeCreate(incomeService model.IncomeService) http.HandlerFunc {
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

		userID, ok := auth.UserIDFromContext(r.Context())
		if !ok {
			respondWithError(w, http.StatusUnauthorized, "Unauthorized")
			return
		}

		income := model.InputIncome{
			ID:       uuid.New(),
			Name:     params.Name,
			Category: params.Category,
			Note:     params.Note,
			Amount:   params.Amount,
			Date:     params.Date,
			UserID:   userID,
		}

		dbIncome, err := incomeService.AddIncomeToDB(r.Context(), income)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		respondWithJson(w, http.StatusCreated, dbIncome)
	}
}

func HandleIncomeUpdate(incomeService model.IncomeService) http.HandlerFunc {
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
			logger.Error("Error while parsing income ID", map[string]interface{}{
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

		userID, ok := auth.UserIDFromContext(r.Context())
		if !ok {
			respondWithError(w, http.StatusUnauthorized, "Unauthorized")
			return
		}

		income := model.InputIncome{
			ID:       id,
			Name:     params.Name,
			Category: params.Category,
			Note:     params.Note,
			Amount:   params.Amount,
			Date:     params.Date,
			UserID:   userID,
		}

		dbIncome, err := incomeService.UpdateIncomeInDB(r.Context(), income)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		respondWithJson(w, http.StatusOK, dbIncome)
	}
}

func HandleIncomeDelete(incomeService model.IncomeService) http.HandlerFunc {
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

		userID, ok := auth.UserIDFromContext(r.Context())
		if !ok {
			respondWithError(w, http.StatusUnauthorized, "Unauthorized")
			return
		}
		err = incomeService.DeleteIncomeFromDB(r.Context(), id, userID)
		if err != nil {
			if err == pgx.ErrNoRows {
				respondWithError(w, http.StatusNotFound, "Income not found")
				return
			}
			logger.Error("Error while deleting income", map[string]interface{}{
				"incomeId": id,
				"userId":   userID,
				"error":    err,
			})
			respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Failed to delete income: %v", err))
			return
		}

		w.WriteHeader(http.StatusNoContent)
	}
}

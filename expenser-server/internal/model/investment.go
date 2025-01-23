package model

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/keertirajmalik/expenser/expenser-server/database"
	"github.com/keertirajmalik/expenser/expenser-server/internal/repository"
	"github.com/keertirajmalik/expenser/expenser-server/logger"
	"github.com/shopspring/decimal"
)

type InputInvestment struct {
	ID       uuid.UUID       `json:"id"`
	Name     string          `json:"name"`
	Amount   decimal.Decimal `json:"amount"`
	Category uuid.UUID       `json:"category"`
	Date     string          `json:"date"`
	Note     string          `json:"note"`
	UserID   uuid.UUID       `json:"user_id"`
}

type ResponseInvestment struct {
	ID       uuid.UUID       `json:"id"`
	Name     string          `json:"name"`
	Amount   decimal.Decimal `json:"amount"`
	Category string          `json:"category"`
	Date     string          `json:"date"`
	Note     string          `json:"note"`
	User     string          `json:"user"`
}

func (d Config) AddInvestmentToDB(ctx context.Context, investment InputInvestment) (ResponseInvestment, error) {
	parsedDate, err := time.Parse("02/01/2006", investment.Date)
	if err != nil {
		logger.Error("failed to parse date", map[string]interface{}{
			"date":  investment.Date,
			"error": err,
		})
		return ResponseInvestment{}, fmt.Errorf("invalid date format: %s", investment.Date)
	}

	money := &pgtype.Numeric{}
	err = money.Scan(investment.Amount.String())
	if err != nil {
		logger.Error("failed to convert amount to numeric: %v", map[string]interface{}{
			"amount": investment.Amount,
			"error":  err,
		})

		return ResponseInvestment{}, fmt.Errorf("Failed to convert amount type: %w", err)
	}

	dbInvestment, err := d.Queries.CreateInvestment(ctx, repository.CreateInvestmentParams{
		ID:       uuid.New(),
		Name:     investment.Name,
		Category: investment.Category,
		Amount:   *money,
		Date: pgtype.Date{
			Time:  parsedDate,
			Valid: true,
		},
		Note:   &investment.Note,
		UserID: investment.UserID,
	})

	if err != nil {
		logger.Error("failed to create investment for user : %v", map[string]interface{}{
			"user_id": investment.UserID,
			"error":   err,
		})

		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == database.ErrCodeForeignKeyViolation {
			logger.Warn(fmt.Sprintf("foreign key violation while creating investment %s: non-existent category", investment.ID))
			return ResponseInvestment{}, &database.ErrForeignKeyViolation{Message: "provide valid category"}
		}
		return ResponseInvestment{}, fmt.Errorf("failed to create investment: %w", err)
	}

	noteValue := ""
	if dbInvestment.Note != nil {
		noteValue = *dbInvestment.Note
	}
	date := ""
	if dbInvestment.Date.Valid {
		date = dbInvestment.Date.Time.Format("02/01/2006")
	}

	var dbMoney decimal.Decimal
	if dbInvestment.Amount.Valid {

		numStr := dbInvestment.Amount.Int.String()
		if dbInvestment.Amount.Exp != 0 {
			numStr = fmt.Sprintf("%se%d", numStr, dbInvestment.Amount.Exp)
		}

		var err error
		dbMoney, err = decimal.NewFromString(numStr)
		if err != nil {
			logger.Error("failed to convert amount to decimal: %v", map[string]interface{}{
				"amount": numStr,
				"error":  err,
			})
		}
	}
	investmentResponse := ResponseInvestment{
		ID:       dbInvestment.ID,
		Name:     dbInvestment.Name,
		Amount:   dbMoney,
		Category: dbInvestment.Category,
		Date:     date,
		Note:     noteValue,
		User:     dbInvestment.User,
	}
	return investmentResponse, nil
}

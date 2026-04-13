package util

import (
	"errors"
	"strings"

	"github.com/keertirajmalik/expenser/expenser-server/internal/model"
	"github.com/keertirajmalik/expenser/expenser-server/logger"
	"github.com/shopspring/decimal"
	"github.com/xuri/excelize/v2"
)

func ReadExcelFile(filename string) ([]model.BulkTransaction, error) {
	f, err := excelize.OpenFile(filename)
	if err != nil {
		logger.Error("Error while reading the file content", map[string]any{
			"error":    err.Error(),
			"filename": filename,
		})
		return nil, err
	}
	defer func() {
		if cerr := f.Close(); cerr != nil {
			logger.Error("failed to close excel file", map[string]any{
				"error":    cerr.Error(),
				"filename": filename,
			})
		}
	}()

	// Get all the rows in the Sheet1.
	sheet := f.GetSheetName(0)
	if sheet == "" {
		return nil, errors.New("excel file has no sheets")
	}
	rows, err := f.GetRows(sheet)
	if err != nil {
		logger.Error("empty excel sheet uploaded", map[string]any{
			"error":    err.Error(),
			"filename": filename,
		})
		return nil, err
	}
	if len(rows) == 0 {
		logger.Error("excel file contains no rows", map[string]any{
			"filename": filename,
		})
		return nil, errors.New("excel file contains no rows")
	}

	var transactions []model.BulkTransaction

	for _, row := range rows {
		// skip empty/trailing rows
		if len(row) == 0 || strings.TrimSpace(strings.Join(row, "")) == "" {
			continue
		}
		if len(row) < 8 {
			logger.Info("remove the extra row in sheet other than transaction table")
			continue
		}

		expectedHeader := "S No. Value Date Transaction Date Cheque Number Transaction Remarks Withdrawal Amount(INR) Deposit Amount(INR) Balance(INR)"
		actualHeader := strings.Join(row, " ")

		if strings.Contains(actualHeader, expectedHeader) {
			continue
		}

		debitAmount, err := decimal.NewFromString(row[6])
		if err != nil {
			logger.Error("unable to parse amount", map[string]any{
				"error":    err.Error(),
				"cell":     row[6],
				"filename": filename,
			})
			return nil, errors.New("unable to parse amount; expected like: INR 5,000.00")
		}

		creditAmount, err := decimal.NewFromString(row[7])
		if err != nil {
			logger.Error("unable to parse amount", map[string]any{
				"error":    err.Error(),
				"cell":     row[7],
				"filename": filename,
			})
			return nil, errors.New("unable to parse amount; expected like: INR 5,000.00")
		}

		var debitTransactionType bool
		var amount decimal.Decimal

		if debitAmount.Equal(decimal.NewFromFloat32(0.00)) {
			debitTransactionType = false
			amount = creditAmount
		} else {
			debitTransactionType = true
			amount = debitAmount
		}

		transaction := model.BulkTransaction{
			Name:    strings.TrimSpace(row[5]),
			Date:    strings.TrimSpace(row[2]),
			Expense: debitTransactionType,
			Amount:  amount,
		}
		transactions = append(transactions, transaction)
	}
	return transactions, nil
}

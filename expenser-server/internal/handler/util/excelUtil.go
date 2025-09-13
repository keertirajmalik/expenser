package util

import (
	"errors"
	"strconv"
	"strings"

	"github.com/keertirajmalik/expenser/expenser-server/internal/model"
	"github.com/keertirajmalik/expenser/expenser-server/logger"
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

	//check for the table titles
	expectedHeader := "Serial Number Transaction Date Transaction Remark CR/DR Amount(INR)"
	actualHeader := strings.Join(rows[0], " ")
	if !strings.Contains(actualHeader, expectedHeader) {
		logger.Error("remove the extra cell from sheet till the transaction table header", map[string]any{
			"error":  "file has additional cells on top of transactions table keep only the transaction details table",
			"header": rows[0],
		})
		return nil, errors.New("remove the extra cell from sheet till the transaction table header keep only the transaction table")
	}

	var transactions []model.BulkTransaction

	for _, row := range rows[1:] {
		if len(row) < 5 {
			logger.Error("remove the extra cell in sheet from the bottom of transaction table", map[string]any{
				"error": "file has additional cells on bottom of transaction table ",
				"row":   row,
			})
			return nil, errors.New("remove the extra cell in sheet from the bottom of transaction table")
		}

		amount, err := strconv.ParseFloat((strings.SplitAfter(strings.ReplaceAll(row[4], ",", ""), " ")[1]), 64)
		if err != nil {
			logger.Error("unable to convert the amount to required format is: INR 5,000.00", map[string]any{
				"error":  err.Error(),
				"amount": row[4],
			})
			return nil, errors.New("remove the extra cell in sheet from the bottom of transaction table")
		}

		transactionType := strings.TrimSpace(row[3])
		transaction := model.BulkTransaction{
			Name:    strings.TrimSpace(row[2]),
			Date:    strings.TrimSpace(row[1]),
			Expense: strings.EqualFold(transactionType, "Dr.") || strings.EqualFold(transactionType, "DR"),
			Amount:  amount,
		}
		transactions = append(transactions, transaction)
	}
	return transactions, nil
}

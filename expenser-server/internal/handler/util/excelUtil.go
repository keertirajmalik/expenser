package util

import (
	"errors"
	"fmt"
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
		// Close the spreadsheet.
		if err := f.Close(); err != nil {
			fmt.Println(err)
		}
	}()
	// Get all the rows in the Sheet1.
	rows, err := f.GetRows(f.GetSheetName(0))
	if err != nil {
		logger.Error("empty excel sheet uploaded", map[string]any{
			"error":    err.Error(),
			"filename": filename,
		})
		return nil, err
	}

	//check for the table titles
	if !strings.Contains("Serial Number Transaction Date Transaction Remark CR/DR Amount(INR)", strings.Join(rows[0], " ")) {
		logger.Error("remove the extra cell from sheet till the transaction table header", map[string]any{
			"error":  "file has additional cells on top of file",
			"header": rows[0],
		})
		return nil, errors.New("remove the extra cell from sheet till the transaction table header")
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
		transaction := model.BulkTransaction{
			Name:    row[2],
			Date:    row[1],
			Expense: row[3] == "Dr.",
			Amount:  amount,
		}
		transactions = append(transactions, transaction)
	}
	return transactions, nil
}

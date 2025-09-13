package model

import "github.com/shopspring/decimal"

type BulkTransaction struct {
	Name    string          `json:"name"`
	Date    string          `json:"date"`
	Expense bool            `json:"expense"`
	Amount  decimal.Decimal `json:"amount"`
}

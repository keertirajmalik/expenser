package model

type BulkTransaction struct {
	Name    string  `json:"name"`
	Date    string  `json:"date"`
	Expense bool    `json:"expense"`
	Amount  float64 `json:"amount"`
}

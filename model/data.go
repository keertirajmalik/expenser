package model

import "time"

type Data struct {
	Transactions     []Transaction
	TransactionTypes []TransactionType
}

func NewData() Data {
	return Data{
		Transactions: []Transaction{
			NewTransaction("Tea", "food", "", 10, time.Now()),
			NewTransaction("Bike", "Travel", "", 100, time.Now()),
		},
		TransactionTypes: []TransactionType{
			NewTransactionType("Food", "Transaction related to food"),
			NewTransactionType("Travel", "Transaction related to travel"),
		},
	}
}

func (d *Data) TransactionTypeIndexOf(id int) int {
	for i, transactionType := range d.TransactionTypes {
		if transactionType.Id == id {
			return i
		}
	}

	return -1
}

func (d *Data) TransactionIndexOf(id int) int {
	for i, transaction := range d.Transactions {
		if transaction.Id == id {
			return i
		}
	}

	return -1
}

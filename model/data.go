package model

type TransactionData struct {
	Transactions []Transaction
}

func NewTransactionData() TransactionData {
	return TransactionData{
		Transactions: []Transaction{
			NewTransaction("Tea", "food", "", 10),
			NewTransaction("Bike", "Travel", "", 100),
		},
	}
}

type TypeData struct {
	TransactionTypes []TransactionType
}

func NewTransactionTypesData() TypeData {
	return TypeData{
		TransactionTypes: []TransactionType{
			NewTransactionType("Food", "Transaction related to food"),
			NewTransactionType("Travel", "Transaction related to travel"),
		},
	}
}

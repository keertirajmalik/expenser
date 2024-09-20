package model

type TransactionData struct {
	Transactions     []Transaction
	TransactionTypes []TransactionType
}

func NewTransactionData() TransactionData {
	return TransactionData{
		Transactions: []Transaction{
			NewTransaction("Tea", "food", "", 10),
			NewTransaction("Bike", "Travel", "", 100),
		},
		TransactionTypes: []TransactionType{
			NewTransactionType("Food", "Transaction related to food"),
			NewTransactionType("Travel", "Transaction related to travel"),
		},
	}
}

type TransactionTypeData struct {
	TransactionTypes []TransactionType
}

func NewTransactionTypesData() TransactionTypeData {
	return TransactionTypeData{
		TransactionTypes: []TransactionType{
			NewTransactionType("Food", "Transaction related to food"),
			NewTransactionType("Travel", "Transaction related to travel"),
		},
	}
}

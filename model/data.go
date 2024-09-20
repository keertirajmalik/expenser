package model

type Data struct {
	Transactions     []Transaction
	TransactionTypes []TransactionType
}

func NewData() Data {
	return Data{
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

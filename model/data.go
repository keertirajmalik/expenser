package model

type Data struct {
	Transactions []Transaction
}

func NewData() Data {
	return Data{
		Transactions: []Transaction{
			NewTransaction("Tea", "food", "", 10),
			NewTransaction("Bike", "Travel", "", 100),
		},
	}
}

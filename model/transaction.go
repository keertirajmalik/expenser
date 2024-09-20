package model

type Transaction struct {
	Name            string
	Amount          int
	TransactionType string
	Note            string
}

func NewTransaction(transaction, transactionType, note string, amount int) Transaction {
	return Transaction{
		Name:            transaction,
		Amount:          amount,
		TransactionType: transactionType,
		Note:            note,
	}
}

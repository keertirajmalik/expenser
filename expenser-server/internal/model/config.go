package model

type Config struct {
	UserService        UserService
	CategoryService    CategoryService
	TransactionService TransactionService
	InvestmentService  InvestmentService
}

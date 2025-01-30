package model

type Config struct {
	JWTSecret		  string
	UserService        UserService
	CategoryService    CategoryService
	TransactionService TransactionService
	InvestmentService  InvestmentService
}

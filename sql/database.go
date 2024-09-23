package sql

import (
	"database/sql"
	"log"

	"github.com/keertirajmalik/expenser/internal/database"
)

type DbConfig struct {
	DB *database.Queries
}

func CreateDbConnection(dbURL string) DbConfig {

	conn, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal("Can't connect to database", err)
	}

	dbConfig := DbConfig{
		DB: database.New(conn),
	}
	return dbConfig
}

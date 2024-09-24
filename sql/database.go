package sql

import (
	"database/sql"
	"log"

	"github.com/keertirajmalik/expenser/internal/database"
)

type DBConfig struct {
	DB *database.Queries
}

func CreateDbConnection(dbURL string) DBConfig {

	conn, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal("Can't connect to database", err)
	}

	dbConfig := DBConfig{
		DB: database.New(conn),
	}
	return dbConfig
}

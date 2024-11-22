package db

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/keertirajmalik/expenser/expenser-server/internal/database"
)

type DBConfig struct {
	DB *database.Queries
}

func CreateDbConnection(dbURL string) (DBConfig, error) {

	conn, err := sql.Open("postgres", dbURL)
	if err != nil {
		return DBConfig{}, fmt.Errorf("failed to open database: %w", err)
	}

	err = conn.Ping()
	if err != nil {
		return DBConfig{}, fmt.Errorf("failed to ping database: %w", err)
	}

	log.Print("Successfully connected to database")

	dbConfig := DBConfig{
		DB: database.New(conn),
	}
	return dbConfig, nil
}

func ConvertStringToSqlNullString(str string, valid bool) sql.NullString {
	return sql.NullString{String: str, Valid: valid}
}

func ConvertSqlNullStringToString(str sql.NullString) string {
	if str.Valid {
		return str.String
	}

	return ""
}

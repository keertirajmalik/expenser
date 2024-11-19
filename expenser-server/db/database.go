package db

import (
	"database/sql"
	"log"

	"github.com/keertirajmalik/expenser/expenser-server/internal/database"
)

type DBConfig struct {
	DB *database.Queries
}

func CreateDbConnection(dbURL string) DBConfig {

	conn, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal("Can't connect to database", err)
	}

	err = conn.Ping()
	if err != nil {
		log.Fatal(err)
	}

	log.Print("DB connected successfully")

	dbConfig := DBConfig{
		DB: database.New(conn),
	}
	return dbConfig
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

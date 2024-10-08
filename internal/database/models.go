// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0

package database

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
)

type Transaction struct {
	ID     uuid.UUID
	Name   string
	Amount int32
	Type   string
	Date   time.Time
	Note   sql.NullString
}

type TransactionType struct {
	ID          uuid.UUID
	Name        string
	Description sql.NullString
}

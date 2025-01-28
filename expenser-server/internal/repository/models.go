// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0

package repository

import (
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

type Category struct {
	ID          uuid.UUID          `json:"id"`
	Name        string             `json:"name"`
	Description *string            `json:"description"`
	UserID      uuid.UUID          `json:"user_id"`
	CreatedAt   pgtype.Timestamptz `json:"created_at"`
	UpdatedAt   pgtype.Timestamptz `json:"updated_at"`
	Type        string             `json:"type"`
}

type Investment struct {
	ID        uuid.UUID          `json:"id"`
	Name      string             `json:"name"`
	Amount    pgtype.Numeric     `json:"amount"`
	Category  uuid.UUID          `json:"category"`
	Date      pgtype.Date        `json:"date"`
	Note      *string            `json:"note"`
	UserID    uuid.UUID          `json:"user_id"`
	CreatedAt pgtype.Timestamptz `json:"created_at"`
	UpdatedAt pgtype.Timestamptz `json:"updated_at"`
}

type Transaction struct {
	ID        uuid.UUID          `json:"id"`
	Name      string             `json:"name"`
	Amount    pgtype.Numeric     `json:"amount"`
	Category  uuid.UUID          `json:"category"`
	Date      pgtype.Date        `json:"date"`
	Note      *string            `json:"note"`
	UserID    uuid.UUID          `json:"user_id"`
	CreatedAt pgtype.Timestamptz `json:"created_at"`
	UpdatedAt pgtype.Timestamptz `json:"updated_at"`
}

type User struct {
	ID             uuid.UUID          `json:"id"`
	Name           string             `json:"name"`
	Username       string             `json:"username"`
	HashedPassword string             `json:"hashed_password"`
	Image          *string            `json:"image"`
	CreatedAt      pgtype.Timestamptz `json:"created_at"`
	UpdatedAt      pgtype.Timestamptz `json:"updated_at"`
}

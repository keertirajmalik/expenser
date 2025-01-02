// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: transaction_types.sql

package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgtype"
)

const createTransactionType = `-- name: CreateTransactionType :one
WITH inserted AS (
    INSERT INTO transaction_types (id, name, description, user_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, description, user_id, created_at, updated_at
)
SELECT
    inserted.id,
    inserted.name,
    inserted.description,
    users.name AS user,
    inserted.created_at,
    inserted.updated_at
FROM inserted
INNER JOIN users ON inserted.user_id = users.id
`

type CreateTransactionTypeParams struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Description *string   `json:"description"`
	UserID      uuid.UUID `json:"user_id"`
}

type CreateTransactionTypeRow struct {
	ID          uuid.UUID          `json:"id"`
	Name        string             `json:"name"`
	Description *string            `json:"description"`
	User        string             `json:"user"`
	CreatedAt   pgtype.Timestamptz `json:"created_at"`
	UpdatedAt   pgtype.Timestamptz `json:"updated_at"`
}

func (q *Queries) CreateTransactionType(ctx context.Context, arg CreateTransactionTypeParams) (CreateTransactionTypeRow, error) {
	row := q.db.QueryRow(ctx, createTransactionType,
		arg.ID,
		arg.Name,
		arg.Description,
		arg.UserID,
	)
	var i CreateTransactionTypeRow
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.User,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const deleteTransactionType = `-- name: DeleteTransactionType :execresult
DELETE FROM transaction_types where id=$1 AND user_id=$2
`

type DeleteTransactionTypeParams struct {
	ID     uuid.UUID `json:"id"`
	UserID uuid.UUID `json:"user_id"`
}

func (q *Queries) DeleteTransactionType(ctx context.Context, arg DeleteTransactionTypeParams) (pgconn.CommandTag, error) {
	return q.db.Exec(ctx, deleteTransactionType, arg.ID, arg.UserID)
}

const getTransactionType = `-- name: GetTransactionType :many
SELECT
    transaction_types.id,
    transaction_types.name,
    transaction_types.description,
    users.name AS user,
    transaction_types.created_at,
    transaction_types.updated_at
FROM transaction_types
INNER JOIN users ON transaction_types.user_id = users.id
WHERE transaction_types.user_id=$1
ORDER BY transaction_types.created_at DESC
`

type GetTransactionTypeRow struct {
	ID          uuid.UUID          `json:"id"`
	Name        string             `json:"name"`
	Description *string            `json:"description"`
	User        string             `json:"user"`
	CreatedAt   pgtype.Timestamptz `json:"created_at"`
	UpdatedAt   pgtype.Timestamptz `json:"updated_at"`
}

func (q *Queries) GetTransactionType(ctx context.Context, userID uuid.UUID) ([]GetTransactionTypeRow, error) {
	rows, err := q.db.Query(ctx, getTransactionType, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetTransactionTypeRow
	for rows.Next() {
		var i GetTransactionTypeRow
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Description,
			&i.User,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getTransactionTypeById = `-- name: GetTransactionTypeById :one
SELECT
    transaction_types.id,
    transaction_types.name,
    transaction_types.description,
    users.name AS user,
    transaction_types.created_at,
    transaction_types.updated_at
FROM transaction_types
INNER JOIN users ON transaction_types.user_id = users.id
WHERE transaction_types.user_id=$1 AND transaction_types.id=$2
ORDER BY transaction_types.created_at DESC
`

type GetTransactionTypeByIdParams struct {
	UserID uuid.UUID `json:"user_id"`
	ID     uuid.UUID `json:"id"`
}

type GetTransactionTypeByIdRow struct {
	ID          uuid.UUID          `json:"id"`
	Name        string             `json:"name"`
	Description *string            `json:"description"`
	User        string             `json:"user"`
	CreatedAt   pgtype.Timestamptz `json:"created_at"`
	UpdatedAt   pgtype.Timestamptz `json:"updated_at"`
}

func (q *Queries) GetTransactionTypeById(ctx context.Context, arg GetTransactionTypeByIdParams) (GetTransactionTypeByIdRow, error) {
	row := q.db.QueryRow(ctx, getTransactionTypeById, arg.UserID, arg.ID)
	var i GetTransactionTypeByIdRow
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.User,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const updateTransactionType = `-- name: UpdateTransactionType :one
WITH updated AS (
    UPDATE transaction_types
    SET name = $2,
    description = $3
    WHERE transaction_types.id = $1 And transaction_types.user_id=$4
    RETURNING id, name, description, user_id, created_at, updated_at
)
SELECT
    updated.id,
    updated.name,
    updated.description,
    users.name AS user,
    updated.created_at,
    updated.updated_at
FROM updated
INNER JOIN users ON updated.user_id = users.id
`

type UpdateTransactionTypeParams struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Description *string   `json:"description"`
	UserID      uuid.UUID `json:"user_id"`
}

type UpdateTransactionTypeRow struct {
	ID          uuid.UUID          `json:"id"`
	Name        string             `json:"name"`
	Description *string            `json:"description"`
	User        string             `json:"user"`
	CreatedAt   pgtype.Timestamptz `json:"created_at"`
	UpdatedAt   pgtype.Timestamptz `json:"updated_at"`
}

func (q *Queries) UpdateTransactionType(ctx context.Context, arg UpdateTransactionTypeParams) (UpdateTransactionTypeRow, error) {
	row := q.db.QueryRow(ctx, updateTransactionType,
		arg.ID,
		arg.Name,
		arg.Description,
		arg.UserID,
	)
	var i UpdateTransactionTypeRow
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.User,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

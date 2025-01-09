-- name: CreateUser :one
INSERT INTO account(id, name,username, hashed_password)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetUser :many
SELECT * FROM account;

-- name: GetUserByUsername :one
SELECT * FROM account WHERE username=$1;

-- name: GetUserById :one
SELECT * FROM account WHERE id=$1;

-- name: UpdateUser :one
UPDATE account
SET name = $2,
    image = $3
WHERE id = $1
RETURNING *;

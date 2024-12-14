-- name: CreateUser :one
INSERT INTO users(id, name,username, hashed_password)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetUsers :many
SELECT * FROM users;

-- name: GetUserByUsername :one
SELECT * FROM users WHERE username=$1;

-- name: GetUserById :one
SELECT * FROM users WHERE id=$1;

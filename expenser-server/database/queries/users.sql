-- name: CreateUser :one
INSERT INTO users(id, name,username, hashed_password)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetUsers :many
SELECT * from users;

-- name: GetUserByUsername :one
SELECT * from users where username=$1;


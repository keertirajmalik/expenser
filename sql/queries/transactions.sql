-- name: CreateTransaction :one
INSERT INTO transactions(id, name, amount, type, date, note)
VALUES ($1, $2, $3, $4,$5, $6)
RETURNING *;

-- name: GetTransaction :many
SELECT * from transactions;

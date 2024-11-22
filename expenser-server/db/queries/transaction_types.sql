-- name: CreateTransactionType :one
INSERT INTO transaction_types(id, name, description)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetTransactionType :many
SELECT * from transaction_types;

-- name: DeleteTransactionType :exec
DELETE FROM transaction_types where id=$1;

-- name: CreateTransactionType :one
INSERT INTO transaction_types(id, name, description, user_id)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetTransactionType :many
SELECT * FROM transaction_types WHERE user_id=$1;

-- name: DeleteTransactionType :execresult
DELETE FROM transaction_types where id=$1 AND user_id=$2;

-- name: GetTransactionTypeById :one
SELECT * FROM transaction_types where id=$1 AND user_id=$2;

-- name: UpdateTransactionType :one
UPDATE transaction_types
SET name = $2,
    description = $3
WHERE id = $1 And user_id=$4
RETURNING *;

-- name: CreateTransactionType :one
WITH inserted AS (
    INSERT INTO transaction_types (id, name, description, user_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
)
SELECT
    inserted.id,
    inserted.name,
    inserted.description,
    users.name AS user,
    inserted.created_at,
    inserted.updated_at
FROM inserted
INNER JOIN users ON inserted.user_id = users.id;

-- name: GetTransactionType :many
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
ORDER BY transaction_types.created_at DESC;

-- name: DeleteTransactionType :execresult
DELETE FROM transaction_types where id=$1 AND user_id=$2;

-- name: GetTransactionTypeById :one
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
ORDER BY transaction_types.created_at DESC;

-- name: UpdateTransactionType :one
WITH updated AS (
    UPDATE transaction_types
    SET name = $2,
    description = $3
    WHERE transaction_types.id = $1 And transaction_types.user_id=$4
    RETURNING *
)
SELECT
    updated.id,
    updated.name,
    updated.description,
    users.name AS user,
    updated.created_at,
    updated.updated_at
FROM updated
INNER JOIN users ON updated.user_id = users.id;

-- name: GetTransactionHistory :many
SELECT
    transaction_history.transaction_id,
    transaction_history.field_name,
    transaction_history.old_value,
    transaction_history.new_value,
    transaction_history.changed_at
FROM transaction_history
WHERE transaction_history.transaction_id=$1
ORDER BY transaction_history.changed_at DESC;

-- name: CreateTransactionHistory :one
INSERT INTO transaction_history(transaction_id, field_name, old_value, new_value)
VALUES ($1, $2, $3, $4)
RETURNING *;


-- name: CreateTransaction :one
WITH inserted AS (
    INSERT INTO transactions(id, name, amount, type, date, note, user_id)
    VALUES ($1, $2, $3, $4,$5, $6, $7)
    RETURNING *
)
SELECT inserted.id,
    inserted."name",
    inserted.amount,
    transaction_types."name" AS type,
    inserted."date",
    inserted.note,
    users."name" AS user,
    inserted.created_at,
    inserted.updated_at
FROM inserted
INNER JOIN users ON inserted.user_id = users.id
INNER JOIN transaction_types ON inserted."type" = transaction_types.id;

-- name: GetTransaction :many
SELECT transactions.id,
transactions."name",
    transactions.amount,
    transaction_types."name" AS type,
    transactions."date",
    transactions.note,
    users."name" AS user,
    transactions.created_at,
    transactions.updated_at
FROM transactions
INNER JOIN users ON transactions.user_id = users.id
INNER JOIN transaction_types ON transactions."type"  = transaction_types.id
WHERE transactions.user_id=$1
ORDER BY transactions.created_at DESC;

-- name: DeleteTransaction :execresult
DELETE FROM transactions where id = $1 AND user_id=$2;

-- name: UpdateTransaction :one
WITH updated AS (
    UPDATE transactions
    SET name = $2,
        amount = $3,
        type =  $4,
        date = $5,
        note = $6
    WHERE transactions.id = $1 AND transactions.user_id=$7
    RETURNING *
)
SELECT updated.id,
    updated."name",
    updated.amount,
    transaction_types."name" AS type,
    updated."date",
    updated.note,
    users."name" AS user,
    updated.created_at,
    updated.updated_at
FROM updated
INNER JOIN users ON updated.user_id = users.id
INNER JOIN transaction_types ON updated."type" = transaction_types.id;



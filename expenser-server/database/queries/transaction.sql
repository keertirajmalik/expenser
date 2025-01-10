-- name: CreateTransaction :one
WITH inserted AS (
    INSERT INTO transactions(id, name, amount, category, date, note, user_id)
    VALUES ($1, $2, $3, $4,$5, $6, $7)
    RETURNING *
)
SELECT inserted.id,
    inserted."name",
    inserted.amount,
    categories."name" AS category,
    inserted."date",
    inserted.note,
    users."name" AS user,
    inserted.created_at,
    inserted.updated_at
FROM inserted
INNER JOIN users ON inserted.user_id = users.id
INNER JOIN categories ON inserted.category = categories.id;

-- name: GetTransaction :many
SELECT transactions.id,
    transactions."name",
    transactions.amount,
    categories."name" AS category,
    transactions."date",
    transactions.note,
    users."name" AS user,
    transactions.created_at,
    transactions.updated_at
FROM transactions
INNER JOIN users ON transactions.user_id = users.id
INNER JOIN categories ON transactions.category  = categories.id
WHERE transactions.user_id=$1
ORDER BY transactions.date DESC;

-- name: DeleteTransaction :execresult
DELETE FROM transactions where id = $1 AND user_id=$2;

-- name: UpdateTransaction :one
WITH updated AS (
    UPDATE transactions
    SET name = $2,
        amount = $3,
        category =  $4,
        date = $5,
        note = $6
    WHERE transactions.id = $1 AND transactions.user_id=$7
    RETURNING *
)
SELECT updated.id,
    updated."name",
    updated.amount,
    categories."name" AS category,
    updated."date",
    updated.note,
    users."name" AS user,
    updated.created_at,
    updated.updated_at
FROM updated
INNER JOIN users ON updated.user_id = users.id
INNER JOIN categories ON updated."category" = categories.id;



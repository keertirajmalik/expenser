-- name: CreateTransaction :one
WITH inserted AS (
    INSERT INTO transaction(id, name, amount, category, date, note, user_id)
    VALUES ($1, $2, $3, $4,$5, $6, $7)
    RETURNING *
)
SELECT inserted.id,
    inserted."name",
    inserted.amount,
    category."name" AS category,
    inserted."date",
    inserted.note,
    account."name" AS user,
    inserted.created_at,
    inserted.updated_at
FROM inserted
INNER JOIN account ON inserted.user_id = account.id
INNER JOIN category ON inserted.category = category.id;

-- name: GetTransaction :many
SELECT transaction.id,
    transaction."name",
    transaction.amount,
    category."name" AS category,
    transaction."date",
    transaction.note,
    account."name" AS user,
    transaction.created_at,
    transaction.updated_at
FROM transaction
INNER JOIN account ON transaction.user_id = account.id
INNER JOIN category ON transaction.category  = category.id
WHERE transaction.user_id=$1
ORDER BY transaction.date DESC;

-- name: DeleteTransaction :execresult
DELETE FROM transaction where id = $1 AND user_id=$2;

-- name: UpdateTransaction :one
WITH updated AS (
    UPDATE transaction
    SET name = $2,
        amount = $3,
        category =  $4,
        date = $5,
        note = $6
    WHERE transaction.id = $1 AND transaction.user_id=$7
    RETURNING *
)
SELECT updated.id,
    updated."name",
    updated.amount,
    category."name" AS category,
    updated."date",
    updated.note,
    account."name" AS user,
    updated.created_at,
    updated.updated_at
FROM updated
INNER JOIN account ON updated.user_id = account.id
INNER JOIN category ON updated."category" = category.id;



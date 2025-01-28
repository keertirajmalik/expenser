-- name: CreateInvestment :one
WITH inserted AS (
    INSERT INTO investments(id, name, amount, category, date, note, user_id)
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

-- name: GetInvestment :many
SELECT investments.id,
    investments."name",
    investments.amount,
    categories."name" AS category,
    investments."date",
    investments.note,
    users."name" AS user,
    investments.created_at,
    investments.updated_at
FROM investments
INNER JOIN users ON investments.user_id = users.id
INNER JOIN categories ON investments.category  = categories.id
WHERE investments.user_id=$1
ORDER BY investments.date DESC;

-- name: UpdateInvestment :one
WITH updated AS (
    UPDATE investments
    SET name = $2,
        amount = $3,
        category =  $4,
        date = $5,
        note = $6
    WHERE investments.id = $1 AND investments.user_id=$7
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

-- name: DeleteInvestment :execresult
DELETE FROM investments where id = $1 AND user_id=$2;


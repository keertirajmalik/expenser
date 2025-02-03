-- name: CreateIncome :one
WITH inserted AS (
    INSERT INTO incomes(id, name, amount, category, date, note, user_id)
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

-- name: GetIncome :many
SELECT incomes.id,
    incomes."name",
    incomes.amount,
    categories."name" AS category,
    incomes."date",
    incomes.note,
    users."name" AS user,
    incomes.created_at,
    incomes.updated_at
FROM incomes
INNER JOIN users ON incomes.user_id = users.id
INNER JOIN categories ON incomes.category  = categories.id
WHERE incomes.user_id=$1
ORDER BY incomes.date DESC;

-- name: UpdateIncome :one
WITH updated AS (
    UPDATE incomes
    SET name = $2,
        amount = $3,
        category =  $4,
        date = $5,
        note = $6
    WHERE incomes.id = $1 AND incomes.user_id=$7
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

-- name: DeleteIncome :execresult
DELETE FROM incomes where id = $1 AND user_id=$2;


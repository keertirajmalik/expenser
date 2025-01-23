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


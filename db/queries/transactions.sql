-- name: CreateTransaction :one
INSERT INTO transactions(id, name, amount, type, date, note)
VALUES ($1, $2, $3, $4,$5, $6)
RETURNING *;

-- name: GetTransaction :many
SELECT * from transactions;

-- name: DeleteTransaction :exec
DELETE FROM transactions where id = $1;

-- name: UpdateTransaction :one
UPDATE transactions
SET name = $2,
    amount = $3,
    type =  $4,
    date = $5,
    note = $6
WHERE id = $1
RETURNING *;

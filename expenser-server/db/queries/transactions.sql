-- name: CreateTransaction :one
INSERT INTO transactions(id, name, amount, type, date, note, user_id)
VALUES ($1, $2, $3, $4,$5, $6, $7)
RETURNING *;

-- name: GetTransaction :many
SELECT * from transactions where user_id=$1;

-- name: DeleteTransaction :execresult
DELETE FROM transactions where id = $1 AND user_id=$2;

-- name: UpdateTransaction :one
UPDATE transactions
SET name = $2,
    amount = $3,
    type =  $4,
    date = $5,
    note = $6
WHERE id = $1
RETURNING *;

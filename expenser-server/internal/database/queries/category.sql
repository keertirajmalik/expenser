-- name: CreateCategory :one
WITH inserted AS (
    INSERT INTO categories(id, name,type, description, user_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
)
SELECT
    inserted.id,
    inserted.name,
    inserted.description,
    inserted.type,
    users.name AS user,
    inserted.created_at,
    inserted.updated_at
FROM inserted
INNER JOIN users ON inserted.user_id = users.id;

-- name: GetCategory :many
SELECT
    categories.id,
    categories.name,
    categories.description,
    categories.type,
    users.name AS user,
    categories.created_at,
    categories.updated_at
FROM categories
INNER JOIN users ON categories.user_id = users.id
WHERE categories.user_id=$1
ORDER BY categories.created_at DESC;

-- name: DeleteCategory :execresult
DELETE FROM categories where id=$1 AND user_id=$2;

-- name: GetCategoryById :one
SELECT
    categories.id,
    categories.name,
    categories.description,
    categories.type,
    users.name AS user,
    categories.created_at,
    categories.updated_at
FROM categories
INNER JOIN users ON categories.user_id = users.id
WHERE categories.user_id=$1 AND categories.id=$2
ORDER BY categories.created_at DESC;

-- name: UpdateCategory :one
WITH updated AS (
    UPDATE categories
    SET name = $2,
    description = $3,
    type = $4
    WHERE categories.id = $1 And categories.user_id=$5
    RETURNING *
)
SELECT
    updated.id,
    updated.name,
    updated.description,
    updated.type,
    users.name AS user,
    updated.created_at,
    updated.updated_at
FROM updated
INNER JOIN users ON updated.user_id = users.id;

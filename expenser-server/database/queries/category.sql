-- name: CreateCategory :one
WITH inserted AS (
    INSERT INTO category (id, name, description, user_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
)
SELECT
    inserted.id,
    inserted.name,
    inserted.description,
    account.name AS user,
    inserted.created_at,
    inserted.updated_at
FROM inserted
INNER JOIN account ON inserted.user_id = account.id;

-- name: GetCategory :many
SELECT
    category.id,
    category.name,
    category.description,
    account.name AS user,
    category.created_at,
    category.updated_at
FROM category
INNER JOIN account ON category.user_id = account.id
WHERE category.user_id=$1
ORDER BY category.created_at DESC;

-- name: DeleteCategory :execresult
DELETE FROM category where id=$1 AND user_id=$2;

-- name: GetCategoryById :one
SELECT
    category.id,
    category.name,
    category.description,
    account.name AS user,
    category.created_at,
    category.updated_at
FROM category
INNER JOIN account ON category.user_id = account.id
WHERE category.user_id=$1 AND category.id=$2
ORDER BY category.created_at DESC;

-- name: UpdateCategory :one
WITH updated AS (
    UPDATE category
    SET name = $2,
    description = $3
    WHERE category.id = $1 And category.user_id=$4
    RETURNING *
)
SELECT
    updated.id,
    updated.name,
    updated.description,
    account.name AS user,
    updated.created_at,
    updated.updated_at
FROM updated
INNER JOIN account ON updated.user_id = account.id;

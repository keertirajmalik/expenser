-- +goose Up
-- Drop the existing foreign key constraint
ALTER TABLE categories
DROP CONSTRAINT categories_user_id_fkey;

-- Add the new foreign key constraint with ON DELETE RESTRICT
ALTER TABLE categories
ADD CONSTRAINT categories_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT;


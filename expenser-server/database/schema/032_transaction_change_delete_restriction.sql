-- +goose Up
-- Drop the existing foreign key constraint on the `category` column
ALTER TABLE transactions
DROP CONSTRAINT transactions_category_fkey;

-- Drop the existing foreign key constraint on the `user_id` column
ALTER TABLE transactions
DROP CONSTRAINT transactions_user_id_fkey;

-- Add a new foreign key constraint on the `category` column with ON DELETE RESTRICT
ALTER TABLE transactions
ADD CONSTRAINT transactions_category_fkey
FOREIGN KEY (category) REFERENCES categories(id) ON DELETE RESTRICT;

-- Add a new foreign key constraint on the `user_id` column with ON DELETE RESTRICT
ALTER TABLE transactions
ADD CONSTRAINT transactions_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT;


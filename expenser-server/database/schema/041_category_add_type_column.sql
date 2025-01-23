-- +goose Up
ALTER TABLE categories
ADD type TEXT;

UPDATE categories
SET type = 'Expense';

ALTER TABLE categories
ALTER COLUMN type SET NOT NULL;


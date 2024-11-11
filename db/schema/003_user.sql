-- +goose Up
CREATE TABLE users(
    id UUID PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL
);

-- +goose Down
DROP TABLE users;

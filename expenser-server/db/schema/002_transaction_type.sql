-- +goose Up

CREATE TABLE transaction_types(
    id UUID PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

-- +goose Down
DROP TABLE transaction_types;

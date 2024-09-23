-- +goose Up

CREATE TABLE transactions(
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL,
    date DATE NOT NULL,
    note TEXT
);

-- +goose Down
DROP TABLE transactions;

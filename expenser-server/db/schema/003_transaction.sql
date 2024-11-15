-- +goose Up

CREATE TABLE transactions(
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL REFERENCES transaction_types(name),
-- cascade on delete of the transaction type
    date DATE NOT NULL,
    note TEXT,
    user_id UUID NOT NULL REFERENCES users(id)
);

-- +goose Down
DROP TABLE transactions;

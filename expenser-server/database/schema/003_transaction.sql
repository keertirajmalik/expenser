-- +goose Up

CREATE TABLE transactions(
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL REFERENCES transaction_types(name),
-- cascade on delete of the transaction type
    date DATE NOT NULL,
    note TEXT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transaction_id ON transactions(id);

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$ BEGIN NEW.updated_at = CURRENT_TIMESTAMP; RETURN NEW; END; $$ ;

CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- +goose Down
DROP TABLE transactions;

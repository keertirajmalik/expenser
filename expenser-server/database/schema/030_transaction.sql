-- +goose Up

CREATE TABLE transactions(
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    amount NUMERIC(12,4) NOT NULL,
    type TEXT NOT NULL REFERENCES transaction_types(name) ON DELETE CASCADE,
    date DATE NOT NULL,
    note TEXT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_transaction_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_date ON transactions(date);

-- +goose Down
DROP TABLE transactions;

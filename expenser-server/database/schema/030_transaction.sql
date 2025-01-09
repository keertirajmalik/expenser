-- +goose Up

CREATE TABLE transaction(
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    amount NUMERIC(12,4) NOT NULL,
    category UUID NOT NULL REFERENCES category(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    note TEXT,
    user_id UUID NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_transaction_updated_at
    BEFORE UPDATE ON transaction
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

CREATE INDEX idx_transaction_user_id ON transaction(user_id);
CREATE INDEX idx_transaction_category ON transaction(category);
CREATE INDEX idx_transaction_date ON transaction(date);

-- +goose Down
DROP TABLE transaction;

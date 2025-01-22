-- +goose Up
CREATE TABLE transaction_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    field_name TEXT NOT NULL,
    old_value TEXT NOT NULL,
    new_value TEXT NOT NULL,
    changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transaction_history_transaction_id ON transaction_history(transaction_id);
CREATE INDEX idx_transaction_history_changed_at ON transaction_history(changed_at);

-- +goose Down
DROP TABLE transaction_history;

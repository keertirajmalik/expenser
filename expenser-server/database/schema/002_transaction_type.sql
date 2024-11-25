-- +goose Up

CREATE TABLE transaction_types(
    id UUID PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transaction_types_name ON transaction_types(name);

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$ BEGIN NEW.updated_at = CURRENT_TIMESTAMP; RETURN NEW; END; $$;

CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON transaction_types
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- +goose Down
DROP TABLE transaction_types;

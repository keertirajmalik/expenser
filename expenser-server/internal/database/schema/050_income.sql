-- +goose Up
CREATE TABLE incomes(
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    amount NUMERIC(12,4) NOT NULL,
    category UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    note TEXT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_incomes_updated_at
    BEFORE UPDATE ON incomes
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

CREATE INDEX idx_incomes_user_id ON incomes(user_id);
CREATE INDEX idx_incomes_categories ON incomes(category);
CREATE INDEX idx_incomes_date ON incomes(date);

-- +goose Down
DROP TABLE incomes;

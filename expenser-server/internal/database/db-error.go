package database

import "fmt"

const (
	ErrCodeUniqueViolation     = "23505"
	ErrCodeNotNullViolation    = "23502"
	ErrCodeForeignKeyViolation = "23503"
)

type ErrDuplicateData struct {
	Column string
}

func (e *ErrDuplicateData) Error() string {
	return fmt.Sprintf("%s already exist", e.Column)
}

type ErrNotNullConstraint struct {
	Column string
}

func (e *ErrNotNullConstraint) Error() string {
	return fmt.Sprintf("%s can't be null", e.Column)
}

type ErrForeignKeyViolation struct {
	Message string
}

func (e *ErrForeignKeyViolation) Error() string {
    return e.Message
}

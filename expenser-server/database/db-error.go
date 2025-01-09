package database

import "fmt"

const (
	ErrCodeUniqueViolation     = "23505"
	ErrCodeNotNullViolation    = "23502"
	ErrCodeForiegnKeyViolation = "23503"
)

type ErrDuplicateData struct {
	Column string
}

func (e *ErrDuplicateData) Error() string {
	return fmt.Sprintf("Data %s already exist", e.Column)
}

type ErrNotNullConstraint struct {
	column string
}

func (e *ErrNotNullConstraint) Error() string {
	return fmt.Sprintf("%s can't be null", e.column)
}

type ErrForiegnKeyViolation struct {
	Column string
}

func (e *ErrForiegnKeyViolation) Error() string {
    return fmt.Sprintf("%s column has foriegn key constraint violation", e.Column)
}

package database

import "fmt"

const (
	ErrCodeUniqueViolation = "23505"
)

type ErrDuplicateData struct {
	Column string
}

func (e *ErrDuplicateData) Error() string {
	return fmt.Sprintf("Data %s already exist", e.Column)
}

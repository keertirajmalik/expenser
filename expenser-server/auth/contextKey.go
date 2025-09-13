package auth

import (
	"context"

	"github.com/google/uuid"
)

// unexported type to prevent key collisions
type contextKey string

// exported key of the unexported type
const UserIDKey = contextKey("userID")

func UserIDFromContext(ctx context.Context) (uuid.UUID, bool) {
	id, ok := ctx.Value(UserIDKey).(uuid.UUID)
	return id, ok
}

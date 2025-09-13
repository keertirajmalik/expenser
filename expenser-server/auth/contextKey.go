package auth

// unexported type to prevent key collisions
type contextKey string

// exported key of the unexported type
var UserIDKey = contextKey("userID")

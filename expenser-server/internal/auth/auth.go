package auth

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	data, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	if err != nil {
		return "", err
	}

	return string(data), nil
}

func CheckPasswordHash(password, hash string) error {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
}

func MakeJWT(userId uuid.UUID, tokenSecret []byte, expiresIn time.Duration) (string, error) {
	signingKey := []byte(tokenSecret)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.RegisteredClaims{
		Issuer:    "expenser",
		IssuedAt:  jwt.NewNumericDate(time.Now().UTC()),
		ExpiresAt: jwt.NewNumericDate(time.Now().UTC().Add(expiresIn)),
		Subject:   userId.String(),
	})

	return token.SignedString(signingKey)
}

func GetBearerToken(header http.Header) (string, error) {
	authHeader := header.Get("Authorization")

	if authHeader == "" {
		return "", errors.New("No auth header included in request")
	}

	splitAuth := strings.Split(authHeader, " ")
	if len(splitAuth) < 2 || splitAuth[0] != "Bearer" {
		return "", errors.New("Malformed authorization header")
	}

	return splitAuth[1], nil
}

func ValidateJWT(tokenString string, tokenSecret []byte) (uuid.UUID, error) {
	claimStruct := jwt.RegisteredClaims{}

	token, err := jwt.ParseWithClaims(tokenString, &claimStruct, func(t *jwt.Token) (interface{}, error) {
		return []byte(tokenSecret), nil
	})

	if err != nil {
		return uuid.Nil, err
	}

	if !token.Valid {
		return uuid.Nil, errors.New("invalid token")
	}

	userId, err := claimStruct.GetSubject()
	if userId == "" || err != nil {
		return uuid.Nil, err
	}

	issuer, _ := claimStruct.GetIssuer()
	if issuer != "expenser" {
		return uuid.Nil, errors.New("Invalid issuer")
	}

	userUUID, err := uuid.Parse(userId)
	if err != nil {
		return uuid.Nil, err
	}

	return userUUID, nil
}

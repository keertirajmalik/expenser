package model

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/keertirajmalik/expenser/expenser-server/internal/database"
	"github.com/keertirajmalik/expenser/expenser-server/internal/repository"
	"github.com/keertirajmalik/expenser/expenser-server/logger"
)

type User struct {
	ID             uuid.UUID `json:"-"`
	Name           string    `json:"name"`
	Username       string    `json:"username"`
	HashedPassword string    `json:"-"`
	Image          string    `json:"image"`
}

func (d Config) GetUsersFromDB(ctx context.Context) ([]User, error) {
	dbUsers, err := d.Queries.GetUser(ctx)
	if err != nil {
		logger.Error("failed to get user from database", map[string]interface{}{
			"error": err,
		})
		return []User{}, err
	}

	return convertDBUserToUser(dbUsers), nil
}

func (d Config) AddUserToDB(ctx context.Context, user User) (User, error) {
	dbUser, err := d.Queries.CreateUser(ctx, repository.CreateUserParams{
		ID:             user.ID,
		Name:           user.Name,
		Username:       user.Username,
		HashedPassword: user.HashedPassword,
	})

	if err != nil {
		logger.Error("failed to create user in database", map[string]interface{}{
			"error": err,
		})
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == database.ErrCodeUniqueViolation {
			return User{}, &database.ErrDuplicateData{Column: user.Username}
		}
		return User{}, err
	}

	users := convertDBUserToUser([]repository.User{dbUser})

	return users[0], nil
}

func (d Config) GetUserByUsernameFromDB(ctx context.Context, username string) (User, error) {
	dbUser, err := d.Queries.GetUserByUsername(ctx, username)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			logger.Error("User not found", map[string]interface{}{"username": username, "error": err})
			return User{}, fmt.Errorf("user not found")
		}
		logger.Error("Failed to get user from DB", map[string]interface{}{
			"username": username,
			"error":    err,
		})
	}
	user := convertDBUserToUser([]repository.User{dbUser})
	return user[0], nil
}

func (d Config) GetUserByUserIdFromDB(ctx context.Context, userId uuid.UUID) (User, error) {
	dbUser, err := d.Queries.GetUserById(ctx, userId)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			logger.Error("User not found", map[string]interface{}{"userId": userId})
			return User{}, fmt.Errorf("user not found")
		}
		logger.Error("Failed to get user from DB", map[string]interface{}{
			"userId": userId,
			"error":  err,
		})
	}

	user := convertDBUserToUser([]repository.User{dbUser})
	return user[0], nil
}

func convertDBUserToUser(dbUsers []repository.User) []User {
	users := []User{}

	for _, user := range dbUsers {
		image := ""
		if user.Image != nil {
			image = *user.Image
		}
		users = append(users, User{
			ID:             user.ID,
			Name:           user.Name,
			Username:       user.Username,
			HashedPassword: user.HashedPassword,
			Image:          image,
		})
	}

	return users
}

func (d Config) UpdateUserInDB(ctx context.Context, user User) (User, error) {
	dbUser, err := d.Queries.UpdateUser(ctx, repository.UpdateUserParams{
		ID:    user.ID,
		Name:  user.Name,
		Image: &user.Image,
	})

	if err != nil {
		logger.Error("failed to update user in database", map[string]interface{}{
			"user_id": user.ID,
			"error":   err,
		})
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == database.ErrCodeUniqueViolation {
			return User{}, &database.ErrDuplicateData{Column: user.Username}
		}
		return User{}, err
	}

	users := convertDBUserToUser([]repository.User{dbUser})

	return users[0], nil
}

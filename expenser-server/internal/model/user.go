package model

import (
	"context"
	"errors"
	"fmt"
	"log"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/keertirajmalik/expenser/expenser-server/internal/repository"
)

type User struct {
	ID             uuid.UUID `json:"-"`
	Name           string    `json:"name"`
	Username       string    `json:"username"`
	HashedPassword string    `json:"-"`
}

func NewUser(name, username, password string) User {
	return User{
		ID:             uuid.New(),
		Name:           name,
		Username:       username,
		HashedPassword: password,
	}
}

func (d Config) GetUsersFromDB(ctx context.Context) ([]User, error) {
	dbUsers, err := d.Queries.GetUsers(ctx)
	if err != nil {
		log.Println("Couldn't get users from DB", err)
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
		log.Printf("Failed to create user in DB - username: %s, error: %v", user.Username, err)
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return User{}, fmt.Errorf("User already exist")
		}
		return User{}, err
	}

	users := convertDBUserToUser([]repository.User{dbUser})

	return users[0], nil
}

func (d Config) GetUserByUsernameFromDB(ctx context.Context, username string) (User, error) {
	dbUser, err := d.Queries.GetUserByUsername(ctx, username)
	if err != nil {
		log.Printf("Failed to get user from DB - username: %s, error: %v", username, err)
		return User{}, err
	}

	user := convertDBUserToUser([]repository.User{dbUser})
	return user[0], nil
}

func userExist(users []repository.User, newUser User) bool {
	for _, user := range users {
		if user.Username == newUser.Username {
			return true
		}
	}
	return false
}

func convertDBUserToUser(dbUsers []repository.User) []User {
	users := []User{}

	for _, user := range dbUsers {
		users = append(users, User{
			ID:             user.ID,
			Name:           user.Name,
			Username:       user.Username,
			HashedPassword: user.HashedPassword,
		})
	}

	return users
}

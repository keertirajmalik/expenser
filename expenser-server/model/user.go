package model

import (
	"context"
	"errors"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/keertirajmalik/expenser/expenser-server/internal/database"
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

func (d Config) GetUsersFromDB(context context.Context) ([]User, error) {
	dbUsers, err := d.DBConfig.DB.GetUsers(context)
	if err != nil {
		log.Println("Couldn't get users from DB", err)
		return []User{}, err
	}

	return convertDBUserToUser(dbUsers), nil
}

func (d Config) AddUserToDB(user User) (User, error) {
	ctx, cancel := context.WithDeadline(context.Background(), time.Now().Add(30*time.Second))
	defer cancel()

	dbUser, err := d.DBConfig.DB.CreateUser(ctx, database.CreateUserParams{
		ID:             user.ID,
		Name:           user.Name,
		Username:       user.Username,
		HashedPassword: user.HashedPassword,
	})

	if err != nil {
		log.Println("Couldn't create user in DB", err)
		return User{}, err
	}

	users := convertDBUserToUser([]database.User{dbUser})

	return users[0], nil
}

func (d Config) GetUserByUsernameFromDB(username string) (User, error) {
	ctx, cancel := context.WithDeadline(context.Background(), time.Now().Add(30*time.Second))
	defer cancel()

	dbUser, err := d.DBConfig.DB.GetUserByUsername(ctx, username)
	if err != nil {
		return User{}, err
	}

	user := convertDBUserToUser([]database.User{dbUser})
	return user[0], nil
}

func userExist(users []database.User, newUser User) bool {
	for _, user := range users {
		if user.Username == newUser.Username {
			return true
		}
	}
	return false
}

func convertDBUserToUser(dbUsers []database.User) []User {
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

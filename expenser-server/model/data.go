package model

import (
	"github.com/keertirajmalik/expenser/expenser-server/db"
)

type Config struct {
	DBConfig   *db.DBConfig
	JWTSecret string
}

package model

import (
	"github.com/keertirajmalik/expenser/db"
)

type Config struct {
	DBConfig   *db.DBConfig
	JWTSeceret string
}

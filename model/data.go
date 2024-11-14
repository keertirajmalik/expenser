package model

import (
	"github.com/keertirajmalik/expenser/db"
)

type Data struct {
	DBConfig   *db.DBConfig
	JWTSeceret string
}

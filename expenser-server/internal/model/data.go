package model

import (
	"github.com/keertirajmalik/expenser/expenser-server/internal/repository"
)

type Config struct {
	Queries  *repository.Queries
	JWTSecret []byte
}

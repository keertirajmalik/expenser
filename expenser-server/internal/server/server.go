package server

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/keertirajmalik/expenser/expenser-server/database"
	"github.com/keertirajmalik/expenser/expenser-server/internal/model"
	"github.com/keertirajmalik/expenser/expenser-server/internal/repository"
	"github.com/keertirajmalik/expenser/expenser-server/logger"
	"github.com/keertirajmalik/expenser/expenser-server/middleware"
)

type Server struct {
	port int

	db database.Service
}

func NewServer() *http.Server {
	port, _ := strconv.Atoi(os.Getenv("PORT"))
	NewServer := &Server{
		port: port,

		db: database.New(),
	}

	stack := middleware.CreateStack(
		middleware.AllowCors,
		middleware.Logging,
		middleware.AuthMiddleware,
	)

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET environment variable is not set")
	}

	config := model.Config{
		Queries:   repository.New(NewServer.db.GetConnection()),
		JWTSecret: []byte(jwtSecret),
	}

	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", NewServer.port),
		Handler:      stack(NewServer.RegisterRoutes(config)),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	log.Println(`
 _____
| ____| __  __  _ __     ___   _ __    ___    ___   _ __
|  _|   \ \/ / | '_ \   / _ \ | '_ \  / __|  / _ \ | '__|
| |___   >  <  | |_) | |  __/ | | | | \__ \ |  __/ | |
|_____| /_/\_\ | .__/   \___| |_| |_| |___/  \___| |_|
               |_|                                       `)

	logger.Info(fmt.Sprintf("Server is running on port %d\n", port))
	return server
}

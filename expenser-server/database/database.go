package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/jackc/pgx/v5/stdlib"
	_ "github.com/joho/godotenv/autoload"
)

// Service represents a service that interacts with a database.
type Service interface {
    GetConnection() *pgxpool.Pool

	// Health returns a map of health status information.
	// The keys and values in the map are service-specific.
	Health() map[string]string

	// Close terminates the database connection.
	// It returns an error if the connection cannot be closed.
	Close()
}

type service struct {
	DB *pgxpool.Pool
}

var (
	database   = os.Getenv("DB_DATABASE")
	password   = os.Getenv("DB_PASSWORD")
	username   = os.Getenv("DB_USERNAME")
	port       = os.Getenv("DB_PORT")
	host       = os.Getenv("DB_HOST")
	schema     = os.Getenv("DB_SCHEMA")
	dbInstance *service
)

func New() Service {
	// Reuse Connection
	if dbInstance != nil {
		return dbInstance
	}

	connStr := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable&search_path=%s", username, password, host, port, database, schema)
	db, err := pgxpool.New(context.Background(), connStr)
	if err != nil {
		log.Fatal(err)
	}
	if err != nil {
		log.Fatal(err)
	}
	dbInstance = &service{
		DB: db,
	}

	return dbInstance
}

func (s *service) GetConnection() *pgxpool.Pool {
    if dbInstance == nil {
        log.Fatal("Database not initialized")
    }
    return dbInstance.DB
}

// Health checks the health of the database connection by pinging the database.
// It returns a map with keys indicating various health statistics.
func (s *service) Health() map[string]string {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	stats := make(map[string]string)

	// Ping the database
	err := s.DB.Ping(ctx)
	if err != nil {
		stats["status"] = "down"
		stats["error"] = fmt.Sprintf("db down: %v", err)
		log.Fatalf("db down: %v", err) // Log the error and terminate the program
		return stats
	}

	// Database is up, add more statistics
	stats["status"] = "up"
	stats["message"] = "It's healthy"

	// Get pool stats for pgxpool
	poolStats := s.DB.Stat()
	stats["open_connections"] = strconv.Itoa(int(poolStats.TotalConns()))
	stats["idle"] = strconv.Itoa(int(poolStats.IdleConns()))
	stats["in_use"] = strconv.Itoa(int(poolStats.TotalConns() - poolStats.IdleConns()))

	// Additional pool-specific statistics
	stats["acquire_count"] = strconv.FormatInt(poolStats.AcquireCount(), 10)
	stats["create_count"] = strconv.FormatInt(poolStats.NewConnsCount(), 10)
	stats["max_conns"] = strconv.Itoa(int(poolStats.MaxConns()))

	// Evaluate stats to provide a health message
	if poolStats.TotalConns() > poolStats.MaxConns()/2 {
		stats["message"] = "The database connection pool is approaching its maximum capacity."
	}

	if poolStats.AcquireCount() > 1000 {
		stats["message"] = "High number of connection acquisitions, potential performance bottleneck."
	}

	return stats
}

// Close closes the database connection.
// It logs a message indicating the disconnection from the specific database.
// If the connection is succesBLUEPRINT_sfully closed, it returns nil.
// If an error occurs while closing the connection, it returns the error.
func (s *service) Close() {
	log.Printf("Disconnected from database: %s", database)
	s.DB.Close()
}


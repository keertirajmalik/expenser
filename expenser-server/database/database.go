package database

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/url"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	ErrMissingDatabaseURL = errors.New("DATABASE_URL env missing")
)

func loadConfigFromURL() (*pgxpool.Config, error) {
	dbURL, ok := os.LookupEnv("DATABASE_URL")
	if !ok {
		return nil, ErrMissingDatabaseURL
	}

	config, err := pgxpool.ParseConfig(dbURL)
	if err != nil {
		return nil, fmt.Errorf("failed to parse config: %w", err)
	}

	return config, nil
}

func loadConfig() (*pgxpool.Config, error) {
	cfg, err := NewDatabase()
	if err != nil {
		log.Printf("Failed to load config from NewDatabase, falling back to URL")
		return loadConfigFromURL()
	}

	// Validate config parameters
	if cfg.Username == "" || cfg.Host == "" || cfg.DBName == "" {
		return nil, fmt.Errorf("invalid config: missing required parameters")
	}

	// Use proper escaping for connection string parameters
	connStr := fmt.Sprintf(
		"user=%s password=%s host=%s port=%d dbname=%s sslmode=%s",
		url.QueryEscape(cfg.Username),
		url.QueryEscape(cfg.Password),
		url.QueryEscape(cfg.Host),
		cfg.Port,
		url.QueryEscape(cfg.DBName),
		url.QueryEscape(cfg.SSLMode),
	)
	return pgxpool.ParseConfig(connStr)
}

func Connect(ctx context.Context) (*pgxpool.Pool, error) {
	config, err := loadConfig()
	if err != nil {
		return nil, err
	}

	conn, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		return nil, fmt.Errorf("could not connect to database: %w", err)
	}

	// Verify connection
	connCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
    defer cancel()

	if err := conn.Ping(connCtx); err != nil {
		conn.Close()
		return nil, fmt.Errorf("failed to verify database connection: %w", err)
	}

	return conn, nil
}

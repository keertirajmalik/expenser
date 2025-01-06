include .env
export $(shell sed 's/=.*//' .env)


watch:
	@if command -v air > /dev/null; then \
		air; \
		echo "Watching..."; \
	else \
		read -p "Go's 'air' is not installed on your machine. Do you want to install it? [Y/n] " choice; \
		if [ "$$choice" != "n" ] && [ "$$choice" != "N" ]; then \
			go install github.com/air-verse/air@latest; \
			air; \
			echo "Watching..."; \
		else \
			echo "You chose not to install air. Exiting..."; \
			exit 1; \
		fi \
	fi

# Create DB container
docker-run:
	@if docker compose up  db -d --build 2>/dev/null; then \
		: ; \
	else \
		echo "Falling back to Docker Compose V1"; \
		docker-compose up db --build; \
	fi
	@for i in {1..10}; do \
		if echo > /dev/tcp/localhost/5432 2>/dev/null; then \
			echo "Database is ready!"; \
			sleep 5; \
			break; \
		fi; \
		echo "Waiting for PostgreSQL... ($$i/10)"; \
		sleep 2; \
	done
	@echo "Running database migrations..."
	@goose postgres "user=${DB_USERNAME} dbname=${DB_DATABASE} sslmode=disable host=localhost password=${DB_PASSWORD}" -dir database/schema up


# Shutdown DB container
docker-down:
	@echo "Running database migrations..."
	@goose postgres "user=${DB_USERNAME} dbname=${DB_DATABASE} sslmode=disable host=localhost password=${DB_PASSWORD}" -dir database/schema reset
	@if docker compose down db 2>/dev/null; then \
		: ; \
	else \
		echo "Falling back to Docker Compose V1"; \
		docker-compose down db; \
	fi

.PHONY: watch docker-run docker-down

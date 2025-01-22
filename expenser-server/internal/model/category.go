package model

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/keertirajmalik/expenser/expenser-server/database"
	"github.com/keertirajmalik/expenser/expenser-server/internal/repository"
	"github.com/keertirajmalik/expenser/expenser-server/logger"
)

type Category struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	UserID      uuid.UUID `json:"user_id"`
}

type ResponseCategory struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	User        string    `json:"user"`
	CreatedAt   time.Time `json:"created_at"`
}

func (d Config) GetCategoriesFromDB(ctx context.Context, userId uuid.UUID) ([]ResponseCategory, error) {
	dbCategories, err := d.Queries.GetCategory(ctx, userId)
	if err != nil {
		logger.Error("Couldn't get categories from in DB", err)
		return []ResponseCategory{}, err
	}

	categories := []ResponseCategory{}

	for _, category := range dbCategories {
		descriptionValue := ""
		if category.Description != nil {
			descriptionValue = *category.Description
		}
		categories = append(categories, ResponseCategory{
			ID:          category.ID,
			Name:        category.Name,
			Description: descriptionValue,
			User:        category.User,
			CreatedAt:   category.CreatedAt.Time,
		})
	}

	return categories, nil
}

func (d Config) GetCategoryByIdFromDB(ctx context.Context, id, userId uuid.UUID) (ResponseCategory, error) {
	dbCategory, err := d.Queries.GetCategoryById(ctx, repository.GetCategoryByIdParams{ID: id, UserID: userId})
	if err != nil {
		logger.Error("Couldn't get transaction type from in DB", err)
		return ResponseCategory{}, err
	}

	descriptionValue := ""
	if dbCategory.Description != nil {
		descriptionValue = *dbCategory.Description
	}
	category := ResponseCategory{
		ID:          dbCategory.ID,
		Name:        dbCategory.Name,
		Description: descriptionValue,
		User:        dbCategory.User,
		CreatedAt:   dbCategory.CreatedAt.Time,
	}
	return category, nil
}

func (d Config) AddCategoryToDB(ctx context.Context, category Category) (ResponseCategory, error) {
	dbCategory, err := d.Queries.CreateCategory(ctx, repository.CreateCategoryParams{
		ID:          uuid.New(),
		Name:        category.Name,
		Description: &category.Description,
		UserID:      category.UserID,
	})

	if err != nil {
		logger.Error("Failed to create category %s for user %s: %v", category.ID, category.UserID, err)
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == database.ErrCodeUniqueViolation {
			return ResponseCategory{}, &database.ErrDuplicateData{Column: category.Name}
		}
		return ResponseCategory{}, err
	}

	descriptionValue := ""
	if dbCategory.Description != nil {
		descriptionValue = *dbCategory.Description
	}

	categoryResponse := ResponseCategory{
		ID:          dbCategory.ID,
		Name:        dbCategory.Name,
		Description: descriptionValue,
		User:        dbCategory.User,
		CreatedAt:   dbCategory.CreatedAt.Time,
	}
	return categoryResponse, nil
}

func (d Config) DeleteCategoryFromDB(ctx context.Context, id, userID uuid.UUID) error {
	result, err := d.Queries.DeleteCategory(ctx, repository.DeleteCategoryParams{ID: id, UserID: userID})
	if err != nil {
		logger.Error(fmt.Sprintf("Failed to delete category"), map[string]interface{}{
			"category_id": id,
			"user_id":     userID,
			"error":       err,
			"error_type":  "foreign_key_violation",
		})
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == database.ErrCodeForeignKeyViolation {
			data, _ := d.GetCategoryByIdFromDB(ctx, id, userID)
			return &database.ErrForeignKeyViolation{Message: fmt.Sprintf("%s category has been used in transaction", data.Name)}
		}
		if errors.Is(err, pgx.ErrNoRows) {
			logger.Error(fmt.Sprintf("Category not found"), map[string]interface{}{
				"category_id": id,
				"user_id":     userID,
			})
			return errors.New("Category not found")
		}
		logger.Error("Couldn't delete category from DB", err)
		return err
	}

	rowAffected := result.RowsAffected()
	if rowAffected == 0 {
		logger.Error("Failed to delete category %s for user %s: %v", id, userID, err)
		return fmt.Errorf("category %s not found for user %s", id, userID)
	}

	return nil
}

func (d Config) UpdateCategoryInDB(ctx context.Context, category Category) (ResponseCategory, error) {
	dbCategory, err := d.Queries.UpdateCategory(ctx, repository.UpdateCategoryParams{
		ID:          category.ID,
		Name:        category.Name,
		Description: &category.Description,
		UserID:      category.UserID,
	})

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			logger.Error(fmt.Sprintf("Category not found during update"), map[string]interface{}{
				"category_id": category.ID,
				"user_id":     category.UserID,
			})
			return ResponseCategory{}, errors.New("Category not found")
		}
		logger.Error(fmt.Sprintf("Failed to update category"), map[string]interface{}{
			"category_id": category.ID,
			"user_id":     category.UserID,
			"error":       err,
		})
		return ResponseCategory{}, err
	}

	descriptionValue := ""
	if dbCategory.Description != nil {
		descriptionValue = *dbCategory.Description
	}

	categoryResponse := ResponseCategory{
		ID:          dbCategory.ID,
		Name:        dbCategory.Name,
		Description: descriptionValue,
		User:        dbCategory.User,
		CreatedAt:   dbCategory.CreatedAt.Time,
	}
	return categoryResponse, nil
}

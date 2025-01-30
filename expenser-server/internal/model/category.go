package model

import (
	"context"
	"errors"
	"fmt"
	"maps"
	"slices"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/keertirajmalik/expenser/expenser-server/internal/database"
	"github.com/keertirajmalik/expenser/expenser-server/internal/repository"
	"github.com/keertirajmalik/expenser/expenser-server/logger"
)

type Category struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Type        string    `json:"type"`
	Description string    `json:"description"`
	UserID      uuid.UUID `json:"user_id"`
}

type ResponseCategory struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Type        string    `json:"type"`
	Description string    `json:"description"`
	User        string    `json:"user"`
	CreatedAt   time.Time `json:"created_at"`
}

const (
	CategoryTypeExpense    = "Expense"
	CategoryTypeInvestment = "Investment"
)

var ValidCategoryTypes = map[string]bool{
	CategoryTypeExpense:    true,
	CategoryTypeInvestment: true,
}

type CategoryService struct {
    Queries *repository.Queries
}

func (c Category) Validate() error {
	if len(strings.TrimSpace(c.Name)) == 0 {
		return fmt.Errorf("category name cannot be empty")
	}

	if len(c.Name) > 50 {
		return fmt.Errorf("category name too long")
	}

	if len(strings.TrimSpace(c.Type)) == 0 {
		return fmt.Errorf("category type cannot be empty")
	}

	if !ValidCategoryTypes[c.Type] {
		validTypes := strings.Join(slices.Collect(maps.Keys(ValidCategoryTypes)), " or ")
		return fmt.Errorf("invalid category type: %q (must be %s)", c.Type, validTypes)
	}

	return nil
}

func (c CategoryService) GetCategoriesFromDB(ctx context.Context, userId uuid.UUID) ([]ResponseCategory, error) {
	dbCategories, err := c.Queries.GetCategory(ctx, userId)
	if err != nil {
		logger.Error("Couldn't get category from DB", map[string]interface{}{
			"user_id": userId,
			"error":   err,
		})
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
			Type:        category.Type,
			Description: descriptionValue,
			User:        category.User,
			CreatedAt:   category.CreatedAt.Time,
		})
	}

	return categories, nil
}

func (c CategoryService) GetCategoryByIdFromDB(ctx context.Context, id, userId uuid.UUID) (ResponseCategory, error) {
	dbCategory, err := c.Queries.GetCategoryById(ctx, repository.GetCategoryByIdParams{ID: id, UserID: userId})
	if err != nil {
		logger.Error("Couldn't get category from DB", map[string]interface{}{
			"category_id": id,
			"user_id":     userId,
			"error":       err,
		})
		return ResponseCategory{}, err
	}

	descriptionValue := ""
	if dbCategory.Description != nil {
		descriptionValue = *dbCategory.Description
	}
	category := ResponseCategory{
		ID:          dbCategory.ID,
		Name:        dbCategory.Name,
		Type:        dbCategory.Type,
		Description: descriptionValue,
		User:        dbCategory.User,
		CreatedAt:   dbCategory.CreatedAt.Time,
	}
	return category, nil
}

func (c CategoryService) AddCategoryToDB(ctx context.Context, category Category) (ResponseCategory, error) {
	if err := category.Validate(); err != nil {
		logger.Error("Provided category is not valid", map[string]interface{}{
			"category": category,
		})
		return ResponseCategory{}, err
	}

	dbCategory, err := c.Queries.CreateCategory(ctx, repository.CreateCategoryParams{
		ID:          uuid.New(),
		Name:        category.Name,
		Type:        category.Type,
		Description: &category.Description,
		UserID:      category.UserID,
	})

	if err != nil {
		logger.Error("Failed to create category", map[string]interface{}{
			"category_id": category.ID,
			"user_id":     category.UserID,
			"error":       err,
		})
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
		Type:        dbCategory.Type,
		Description: descriptionValue,
		User:        dbCategory.User,
		CreatedAt:   dbCategory.CreatedAt.Time,
	}
	return categoryResponse, nil
}

func (c CategoryService) DeleteCategoryFromDB(ctx context.Context, id, userID uuid.UUID) error {
	result, err := c.Queries.DeleteCategory(ctx, repository.DeleteCategoryParams{ID: id, UserID: userID})
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == database.ErrCodeForeignKeyViolation {
			data, _ := c.GetCategoryByIdFromDB(ctx, id, userID)
			logger.Error("Couldn't delete category", map[string]interface{}{
				"category_id": id,
				"user_id":     userID,
				"error":       err,
			})
			return &database.ErrForeignKeyViolation{Message: fmt.Sprintf("%s category has been used in transaction", data.Name)}
		}

		if errors.Is(err, pgx.ErrNoRows) {
			logger.Error("Failed to delete category", map[string]interface{}{
				"category_id": id,
				"user_id":     userID,
				"error":       err,
				"error_type":  "not_found_violation",
			})
			return errors.New("Category not found")
		}
		logger.Error("Couldn't delete category", map[string]interface{}{
			"category_id": id,
			"user_id":     userID,
			"error":       err,
		})
		return err
	}

	rowAffected := result.RowsAffected()
	if rowAffected == 0 {
		logger.Error("Failed to delete category", map[string]interface{}{
			"category_id": id,
			"user_id":     userID,
			"error":       "no category found",
		})
		return fmt.Errorf("category %s not found for user %s", id, userID)
	}

	return nil
}

func (c CategoryService) UpdateCategoryInDB(ctx context.Context, category Category) (ResponseCategory, error) {
	if err := category.Validate(); err != nil {
		logger.Error("Provided category is not valid", map[string]interface{}{
			"category": category,
		})
		return ResponseCategory{}, err
	}

	dbCategory, err := c.Queries.UpdateCategory(ctx, repository.UpdateCategoryParams{
		ID:          category.ID,
		Name:        category.Name,
		Type:        category.Type,
		Description: &category.Description,
		UserID:      category.UserID,
	})

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			logger.Error("Category not found during update", map[string]interface{}{
				"category_id": category.ID,
				"user_id":     category.UserID,
			})
			return ResponseCategory{}, errors.New("Category not found")
		}

		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == database.ErrCodeForeignKeyViolation {
			data, _ := c.GetCategoryByIdFromDB(ctx, category.ID, category.UserID)
			logger.Error("Couldn't update category", map[string]interface{}{
				"category_id": category.ID,
				"user_id":     category.UserID,
				"error":       err,
			})
			return ResponseCategory{}, &database.ErrForeignKeyViolation{Message: fmt.Sprintf("%s category has been used in transaction", data.Name)}
		}

		if errors.As(err, &pgErr) && pgErr.Code == database.ErrCodeUniqueViolation {
			logger.Error("Failed to update category", map[string]interface{}{
				"category_id": category.ID,
				"user_id":     category.UserID,
				"error":       err,
			})
			return ResponseCategory{}, &database.ErrDuplicateData{Column: category.Name}
		}

		logger.Error("Failed to update category", map[string]interface{}{
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
		Type:        dbCategory.Type,
		Description: descriptionValue,
		User:        dbCategory.User,
		CreatedAt:   dbCategory.CreatedAt.Time,
	}
	return categoryResponse, nil
}

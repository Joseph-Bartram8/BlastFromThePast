package models

import (
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

// User struct
type User struct {
	ID           uuid.UUID `json:"id"`
	FirstName    string    `json:"first_name"`
	LastName     string    `json:"last_name"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	CreatedAt    string    `json:"created_at"`
}

// UserBio struct
type UserBio struct {
	UserID         uuid.UUID `json:"user_id"`
	DisplayName    string    `json:"display_name"`
	StoreName      *string   `json:"store_name"`
	BioDescription string    `json:"bio_description"`
	ProfileImage   string    `json:"profile_image"`
	UpdatedAt      string    `json:"updated_at"`
}

var Validate = validator.New()

// CreateUserRequest struct
type CreateUserRequest struct {
	FirstName   string `json:"first_name" validate:"required"`
	LastName    string `json:"last_name" validate:"required"`
	Email       string `json:"email" validate:"required,email"`
	Password    string `json:"password" validate:"required,min=8"`
	DisplayName string `json:"display_name" validate:"required"`
}

// UserResponse struct
type UserResponse struct {
	ID           uuid.UUID `json:"id"`
	DisplayName  string    `json:"display_name"`
	FirstName    *string   `json:"first_name,omitempty"`
	LastName     *string   `json:"last_name,omitempty"`
	ProfileImage string    `json:"profile_image"`
}

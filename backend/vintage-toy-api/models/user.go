package models

import "github.com/google/uuid"

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

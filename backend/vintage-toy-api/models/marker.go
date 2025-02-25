package models

import "github.com/google/uuid"

// Marker struct
type Marker struct {
	ID          uuid.UUID `json:"id"`
	UserID      uuid.UUID `json:"user_id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Photo       string    `json:"photo"`
	Location    string    `json:"location"`
	CreatedAt   string    `json:"created_at"`
}

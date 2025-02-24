package models

// Marker struct represents a location marker in the database
type Marker struct {
	ID          int     `json:"id"`
	UserID      int     `json:"user_id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Photo       string  `json:"photo"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
	MarkerType  string  `json:"marker_type"`
	Privacy     string  `json:"privacy"`
	CreatedAt   string  `json:"created_at"`
}

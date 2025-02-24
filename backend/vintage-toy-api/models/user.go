package models

type User struct {
	ID           int    `json:"id"`
	FirstName    string `json:"first_name"`
	LastName     string `json:"last_name"`
	Email        string `json:"email"`
	MobileNumber string `json:"mobile_number"` // Change back to string
	CreatedAt    string `json:"created_at"`
}

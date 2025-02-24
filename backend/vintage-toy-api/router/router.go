package router

import (
	"github.com/Joseph_Bartram8/vintage-toy-api/handlers"
	"github.com/gorilla/mux"
)

// SetupRouter initializes routes
func SetupRouter() *mux.Router {
	r := mux.NewRouter()

	// User Routes
	r.HandleFunc("/users", handlers.GetUsers).Methods("GET")         // Get all users
	r.HandleFunc("/users/{id}", handlers.GetUserByID).Methods("GET") // Get single user
	r.HandleFunc("/users", handlers.CreateUser).Methods("POST")      // Create a user

	// Marker Routes
	r.HandleFunc("/markers", handlers.GetMarkers).Methods("GET") // Get all public markers

	return r
}

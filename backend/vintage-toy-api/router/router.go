package router

import (
	"fmt"
	"net/http"

	"github.com/Joseph_Bartram8/vintage-toy-api/handlers"
	"github.com/Joseph_Bartram8/vintage-toy-api/middleware"
	"github.com/gorilla/mux"
)

// SetupRouter with Explicit Middleware Application
func SetupRouter() *mux.Router {
	r := mux.NewRouter().UseEncodedPath()

	// Log Middleware Registration
	fmt.Println("📌 Middleware Registered for All Routes")

	// Apply Middleware to ALL Routes
	r.Use(middleware.AuthMiddleware)

	// Register Routes
	r.HandleFunc("/users", handlers.GetUsers).Methods("GET")
	r.HandleFunc("/users/{id}", handlers.GetUserByID).Methods("GET")
	r.HandleFunc("/users", handlers.CreateUser).Methods("POST")
	r.HandleFunc("/login", handlers.Login).Methods("POST")

	r.HandleFunc("/users/me", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("📌 Route `/users/me` reached in router.go - Sending test response")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Test response from /users/me"))
	}).Methods("GET")

	return r
}

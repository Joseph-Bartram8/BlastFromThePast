package main

import (
	"log"
	"net/http"

	_ "github.com/lib/pq"

	"github.com/Joseph_Bartram8/vintage-toy-api/db"
	"github.com/Joseph_Bartram8/vintage-toy-api/router"
)

func main() {
	// Connect to database
	db.ConnectDB()

	// Initialize router with database instance
	r := router.SetupRouter(db.DB)

	// Start server
	log.Println("Server running on :8080")
	http.ListenAndServe(":8080", r)
}

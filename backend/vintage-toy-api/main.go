package main

import (
	"fmt"
	"log"
	"net/http"

	// Add this import directly
	_ "github.com/joho/godotenv" // Add underscore to load dotenv (even if not used directly)
	_ "github.com/lib/pq"        // Ensure pq is properly imported

	"github.com/Joseph_Bartram8/vintage-toy-api/db"
	"github.com/Joseph_Bartram8/vintage-toy-api/router"
)

func main() {
	// Connect to the database
	db.ConnectDB()

	// Setup router
	r := router.SetupRouter()

	// Start the server
	port := ":8080"
	fmt.Println("🚀 Server running on http://localhost" + port)
	log.Fatal(http.ListenAndServe(port, r))
}

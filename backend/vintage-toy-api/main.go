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

	r.Use(loggingMiddleware)

	// Start the server
	port := ":8080"
	fmt.Println("🚀 Server running on http://localhost" + port)
	log.Fatal(http.ListenAndServe(port, r))
}

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println("📌 Incoming Request:", r.Method, r.URL.Path)
		next.ServeHTTP(w, r)
	})
}

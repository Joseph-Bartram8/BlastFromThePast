package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/Joseph_Bartram8/vintage-toy-api/db"
	"github.com/google/uuid"
)

// GetMarkers fetches all markers
func GetMarkers(w http.ResponseWriter, r *http.Request) {
	log.Println("🔍 Fetching all markers")

	rows, err := db.DB.Query("SELECT id, user_id, name, description, photo, location FROM user_markers")
	if err != nil {
		log.Println("Database error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var markers []struct {
		ID          uuid.UUID `json:"id"`
		UserID      uuid.UUID `json:"user_id"`
		Name        string    `json:"name"`
		Description string    `json:"description"`
		Photo       string    `json:"photo"`
		Location    string    `json:"location"`
	}

	for rows.Next() {
		var marker struct {
			ID          uuid.UUID `json:"id"`
			UserID      uuid.UUID `json:"user_id"`
			Name        string    `json:"name"`
			Description string    `json:"description"`
			Photo       string    `json:"photo"`
			Location    string    `json:"location"`
		}

		err := rows.Scan(&marker.ID, &marker.UserID, &marker.Name, &marker.Description, &marker.Photo, &marker.Location)
		if err != nil {
			log.Println("Error scanning marker:", err)
			http.Error(w, "Error retrieving markers", http.StatusInternalServerError)
			return
		}

		markers = append(markers, marker)
	}

	if err = rows.Err(); err != nil {
		log.Println("Row iteration error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(markers)
}

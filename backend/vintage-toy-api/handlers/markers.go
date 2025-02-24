package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/Joseph_Bartram8/vintage-toy-api/db"
	"github.com/Joseph_Bartram8/vintage-toy-api/models" // Import models package
)

// Get all public markers
func GetMarkers(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query("SELECT id, user_id, name, description, photo, latitude, longitude, marker_type, privacy, created_at FROM user_markers WHERE privacy = 'public'")
	if err != nil {
		http.Error(w, "Database query error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var markers []models.Marker // Use models.Marker instead of defining the struct again
	for rows.Next() {
		var marker models.Marker
		if err := rows.Scan(&marker.ID, &marker.UserID, &marker.Name, &marker.Description, &marker.Photo, &marker.Latitude, &marker.Longitude, &marker.MarkerType, &marker.Privacy, &marker.CreatedAt); err != nil {
			http.Error(w, "Error scanning result", http.StatusInternalServerError)
			return
		}
		markers = append(markers, marker)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(markers)
}

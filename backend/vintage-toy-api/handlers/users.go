package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/Joseph_Bartram8/vintage-toy-api/db"
	"github.com/Joseph_Bartram8/vintage-toy-api/models"
	"github.com/gorilla/mux"
)

// Get all users
func GetUsers(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query("SELECT id, first_name, last_name, email, mobile_number, created_at FROM users")
	if err != nil {
		log.Println("Database query error:", err)
		http.Error(w, "Database query error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var user models.User
		var mobile sql.NullString // Temporary variable

		err := rows.Scan(&user.ID, &user.FirstName, &user.LastName, &user.Email, &mobile, &user.CreatedAt)
		if err != nil {
			log.Println("Error scanning user data:", err)
			http.Error(w, "Error scanning result", http.StatusInternalServerError)
			return
		}

		// Convert NULL to an empty string
		if mobile.Valid {
			user.MobileNumber = mobile.String
		} else {
			user.MobileNumber = ""
		}

		users = append(users, user)
	}

	log.Println("✅ Successfully retrieved users")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

// Get a single user by ID
func GetUserByID(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	userID, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	var user models.User
	var mobile sql.NullString // Temporary variable

	err = db.DB.QueryRow("SELECT id, first_name, last_name, email, mobile_number, created_at FROM users WHERE id = $1", userID).
		Scan(&user.ID, &user.FirstName, &user.LastName, &user.Email, &mobile, &user.CreatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			http.Error(w, "Database error", http.StatusInternalServerError)
		}
		return
	}

	// Convert NULL to empty string
	if mobile.Valid {
		user.MobileNumber = mobile.String
	} else {
		user.MobileNumber = ""
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// Create a new user
func CreateUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Use NULL if mobile_number is empty
	var mobile sql.NullString
	if user.MobileNumber != "" {
		mobile = sql.NullString{String: user.MobileNumber, Valid: true}
	} else {
		mobile = sql.NullString{Valid: false}
	}

	query := "INSERT INTO users (first_name, last_name, email, mobile_number) VALUES ($1, $2, $3, $4) RETURNING id, created_at"
	err = db.DB.QueryRow(query, user.FirstName, user.LastName, user.Email, mobile).
		Scan(&user.ID, &user.CreatedAt)

	if err != nil {
		http.Error(w, "Database insert error", http.StatusInternalServerError)
		return
	}

	// Convert NULL to empty string before returning response
	if mobile.Valid {
		user.MobileNumber = mobile.String
	} else {
		user.MobileNumber = ""
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}

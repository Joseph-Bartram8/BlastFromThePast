package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/Joseph_Bartram8/vintage-toy-api/db"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

// Get all users
func GetUsers(w http.ResponseWriter, r *http.Request) {
	log.Println("🔍 Fetching all users")

	rows, err := db.DB.Query("SELECT id, first_name, last_name FROM users")
	if err != nil {
		log.Println("Database error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var users []struct {
		ID        uuid.UUID `json:"id"`
		FirstName string    `json:"first_name"`
		LastName  string    `json:"last_name"`
	}

	for rows.Next() {
		var user struct {
			ID        uuid.UUID `json:"id"`
			FirstName string    `json:"first_name"`
			LastName  string    `json:"last_name"`
		}

		err := rows.Scan(&user.ID, &user.FirstName, &user.LastName)
		if err != nil {
			log.Println("Error scanning user:", err)
			http.Error(w, "Error retrieving users", http.StatusInternalServerError)
			return
		}

		users = append(users, user)
	}

	if err = rows.Err(); err != nil {
		log.Println("Row iteration error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(users)
}

// Get a single user by ID
func GetUserByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID, err := uuid.Parse(vars["id"])
	if err != nil {
		http.Error(w, "Invalid user ID format", http.StatusBadRequest)
		return
	}

	log.Println("Fetching user with ID:", userID)

	var user struct {
		ID        uuid.UUID `json:"id"`
		FirstName string    `json:"first_name"`
		LastName  string    `json:"last_name"`
		Email     string    `json:"email"`
	}

	err = db.DB.QueryRow(
		"SELECT id, first_name, last_name, email FROM users WHERE id = $1", userID,
	).Scan(&user.ID, &user.FirstName, &user.LastName, &user.Email)

	if err == sql.ErrNoRows {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(user)
}

// Create a new user
func CreateUser(w http.ResponseWriter, r *http.Request) {
	var user struct {
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
		Email     string `json:"email"`
		Password  string `json:"password"`
	}

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Generate a new UUID for the user
	userID := uuid.New()

	_, err = db.DB.Exec(
		"INSERT INTO users (id, first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4, $5)",
		userID, user.FirstName, user.LastName, user.Email, user.Password,
	)

	if err != nil {
		log.Println("❌ Error inserting user:", err)
		http.Error(w, "Error creating user", http.StatusInternalServerError)
		return
	}

	log.Println("New user created with ID:", userID)

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"id": userID.String()})
}

func GetMyProfile(w http.ResponseWriter, r *http.Request) {
	log.Println("🔍 GetMyProfile function called!")

	// ✅ Extract UUID from Request Context
	userIDStr, ok := r.Context().Value("user").(string)
	if !ok {
		log.Println("❌ No UUID found in request context")
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	log.Println("✅ Extracted user ID from request context:", userIDStr)

	// ✅ Convert UUID from String
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		log.Println("❌ UUID Parsing Error:", err)
		http.Error(w, "Invalid user ID format", http.StatusBadRequest)
		return
	}

	log.Println("✅ UUID Successfully Parsed:", userID)

	var user struct {
		ID        uuid.UUID `json:"id"`
		FirstName string    `json:"first_name"`
		LastName  string    `json:"last_name"`
		Email     string    `json:"email"`
	}

	// ✅ Fetch User from Database
	err = db.DB.QueryRow(
		"SELECT id, first_name, last_name, email FROM users WHERE id = $1", userID,
	).Scan(&user.ID, &user.FirstName, &user.LastName, &user.Email)

	if err == sql.ErrNoRows {
		log.Println("❌ User not found in database")
		http.Error(w, "User not found", http.StatusNotFound)
		return
	} else if err != nil {
		log.Println("❌ Database error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	log.Println("✅ Successfully retrieved user profile:", user)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

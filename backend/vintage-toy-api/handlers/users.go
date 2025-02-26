package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/Joseph_Bartram8/vintage-toy-api/models"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// Get all users
func GetUsersHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Query users with privacy setting applied
		rows, err := db.Query(`
			SELECT u.id, ub.display_name, ub.profile_image, ub.show_real_name, 
				CASE WHEN ub.show_real_name THEN u.first_name ELSE NULL END AS first_name,
				CASE WHEN ub.show_real_name THEN u.last_name ELSE NULL END AS last_name
			FROM users u
			JOIN user_bios ub ON u.id = ub.user_id
			WHERE u.is_deleted = FALSE;
		`)
		if err != nil {
			http.Error(w, "Database error", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		// Parse results into a slice
		var users []models.UserResponse
		for rows.Next() {
			var user models.UserResponse
			var firstName, lastName sql.NullString // Nullable values

			err := rows.Scan(&user.ID, &user.DisplayName, &user.ProfileImage, new(bool), &firstName, &lastName)
			if err != nil {
				http.Error(w, "Error scanning users", http.StatusInternalServerError)
				return
			}

			// Handle null values (hide real names if show_real_name = false)
			if firstName.Valid {
				user.FirstName = &firstName.String
			}
			if lastName.Valid {
				user.LastName = &lastName.String
			}

			users = append(users, user)
		}

		// Return JSON response
		json.NewEncoder(w).Encode(users)
	}
}

// Create a new user
func CreateUserHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req models.CreateUserRequest

		// Decode JSON request
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		// Validate user input
		if err := models.Validate.Struct(req); err != nil {
			http.Error(w, "Invalid input: "+err.Error(), http.StatusBadRequest)
			return
		}

		// Hash the password
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			http.Error(w, "Error hashing password", http.StatusInternalServerError)
			return
		}

		// Generate a UUID for the new user
		userID := uuid.New()

		// Insert user into the database
		tx, err := db.Begin()
		if err != nil {
			http.Error(w, "Database error", http.StatusInternalServerError)
			return
		}

		// Insert into users table
		_, err = tx.Exec(`
			INSERT INTO users (id, first_name, last_name, email, password_hash, created_at)
			VALUES ($1, $2, $3, $4, $5, NOW())`,
			userID, req.FirstName, req.LastName, req.Email, string(hashedPassword),
		)
		if err != nil {
			tx.Rollback()
			http.Error(w, "Error creating user", http.StatusInternalServerError)
			return
		}

		// Insert into user_bios table
		_, err = tx.Exec(`
			INSERT INTO user_bios (user_id, display_name, bio_description, profile_image, updated_at)
			VALUES ($1, $2, '', '', NOW())`,
			userID, req.DisplayName,
		)
		if err != nil {
			tx.Rollback()
			http.Error(w, "Error creating user bio", http.StatusInternalServerError)
			return
		}

		// Commit transaction
		err = tx.Commit()
		if err != nil {
			http.Error(w, "Database commit error", http.StatusInternalServerError)
			return
		}

		// Return created user info (excluding password)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"id":           userID,
			"first_name":   req.FirstName,
			"last_name":    req.LastName,
			"email":        req.Email,
			"display_name": req.DisplayName,
		})
	}
}

func GetUserByID(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Extract user ID from URL
		userIDStr := chi.URLParam(r, "id")
		userID, err := uuid.Parse(userIDStr)
		if err != nil {
			http.Error(w, "Invalid user ID", http.StatusBadRequest)
			return
		}

		// Fetch user data
		var user models.User
		err = db.QueryRow("SELECT id, first_name, last_name, email, created_at FROM users WHERE id=$1", userID).
			Scan(&user.ID, &user.FirstName, &user.LastName, &user.Email, &user.CreatedAt)
		if err != nil {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}

		json.NewEncoder(w).Encode(user)
	}
}

// GetCurrentUserHandler fetches the authenticated user's info
func GetCurrentUserHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Extract user ID from JWT context
		userID, ok := r.Context().Value("userID").(uuid.UUID)
		if !ok {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Fetch user data
		var user struct {
			ID        uuid.UUID `json:"id"`
			FirstName string    `json:"first_name"`
			LastName  string    `json:"last_name"`
			Email     string    `json:"email"`
			CreatedAt string    `json:"created_at"`
		}

		err := db.QueryRow(
			"SELECT id, first_name, last_name, email, created_at FROM users WHERE id = $1 AND is_deleted = FALSE",
			userID,
		).Scan(&user.ID, &user.FirstName, &user.LastName, &user.Email, &user.CreatedAt)

		if err == sql.ErrNoRows {
			http.Error(w, "User not found or deleted", http.StatusNotFound)
			return
		}

		// Return the authenticated user's info
		json.NewEncoder(w).Encode(user)
	}
}

func UpdateUserHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Extract user ID from JWT context
		userID, ok := r.Context().Value("userID").(uuid.UUID)
		if !ok {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Parse request body
		var req models.UpdateUserRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		// Start a transaction
		tx, err := db.Begin()
		if err != nil {
			http.Error(w, "Database transaction error", http.StatusInternalServerError)
			return
		}

		// Update `users` table if needed
		if req.FirstName != nil || req.LastName != nil {
			_, err := tx.Exec(`
				UPDATE users 
				SET first_name = COALESCE($1, first_name), 
					last_name = COALESCE($2, last_name)
				WHERE id = $3`,
				req.FirstName, req.LastName, userID,
			)
			if err != nil {
				tx.Rollback()
				http.Error(w, "Error updating user profile", http.StatusInternalServerError)
				return
			}
		}

		// Update `user_bios` table if needed
		if req.DisplayName != nil || req.BioDescription != nil || req.ProfileImage != nil {
			_, err := tx.Exec(`
				UPDATE user_bios 
				SET display_name = COALESCE($1, display_name), 
					bio_description = COALESCE($2, bio_description), 
					profile_image = COALESCE($3, profile_image),
					updated_at = NOW()
				WHERE user_id = $4`,
				req.DisplayName, req.BioDescription, req.ProfileImage, userID,
			)
			if err != nil {
				tx.Rollback()
				http.Error(w, "Error updating user bio", http.StatusInternalServerError)
				return
			}
		}

		// Commit transaction
		err = tx.Commit()
		if err != nil {
			http.Error(w, "Database commit error", http.StatusInternalServerError)
			return
		}

		// Return success message
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "Profile updated successfully"})
	}
}

func DeleteUserHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Extract user ID from JWT context
		userID, ok := r.Context().Value("userID").(uuid.UUID)
		if !ok {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Perform soft delete
		_, err := db.Exec("UPDATE users SET is_deleted = TRUE WHERE id = $1", userID)
		if err != nil {
			http.Error(w, "Error deleting account", http.StatusInternalServerError)
			return
		}

		// Return success response
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "Account deleted successfully"})
	}
}

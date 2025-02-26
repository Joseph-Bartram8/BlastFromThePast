package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"golang.org/x/crypto/bcrypt"

	"github.com/Joseph_Bartram8/vintage-toy-api/models"
	"github.com/Joseph_Bartram8/vintage-toy-api/utils"
)

// LoginHandler authenticates a user and returns a JWT token
func LoginHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req models.LoginRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		var user models.User
		err := db.QueryRow(
			"SELECT id, password_hash FROM users WHERE email = $1 AND is_deleted = FALSE", req.Email).
			Scan(&user.ID, &user.PasswordHash)

		if err == sql.ErrNoRows {
			http.Error(w, "Invalid email or password", http.StatusUnauthorized)
			return
		}

		// Compare hashed password
		if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
			http.Error(w, "Invalid email or password", http.StatusUnauthorized)
			return
		}

		// Generate JWT
		token, err := utils.GenerateJWT(user.ID)
		if err != nil {
			http.Error(w, "Could not generate token", http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(models.LoginResponse{Token: token})
	}
}

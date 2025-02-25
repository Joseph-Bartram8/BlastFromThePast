package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/Joseph_Bartram8/vintage-toy-api/db"
	"github.com/Joseph_Bartram8/vintage-toy-api/models"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

func Login(w http.ResponseWriter, r *http.Request) {
	var user struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	var storedUser struct {
		ID           uuid.UUID `json:"id"`
		FirstName    string    `json:"first_name"`
		LastName     string    `json:"last_name"`
		PasswordHash string
	}

	err = db.DB.QueryRow(
		"SELECT id, first_name, last_name, password_hash FROM users WHERE email = $1",
		user.Email,
	).Scan(&storedUser.ID, &storedUser.FirstName, &storedUser.LastName, &storedUser.PasswordHash)

	if err == sql.ErrNoRows {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	} else if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// ✅ Store UUID in Token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":    storedUser.ID.String(),
		"first_name": storedUser.FirstName,
		"last_name":  storedUser.LastName,
		"exp":        time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, _ := token.SignedString([]byte(os.Getenv("JWT_SECRET")))

	json.NewEncoder(w).Encode(map[string]string{"token": tokenString})
}

func GenerateJWT(user models.User) (string, error) {
	secret := os.Getenv("JWT_SECRET") // Load secret from environment variable

	// Create the JWT claims
	claims := jwt.MapClaims{
		"user_id":    user.ID,
		"first_name": user.FirstName,
		"last_name":  user.LastName,
		"email":      user.Email,
		"exp":        time.Now().Add(time.Hour * 24).Unix(), // Token expires in 24 hours
	}

	// Create token with claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign and return token
	return token.SignedString([]byte(secret))
}

package middleware

import (
	"context"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const UserContextKey contextKey = "user"

func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		log.Printf("%s %s %s", r.Method, r.RequestURI, time.Since(start))
	})
}

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println("🔍 AuthMiddleware Triggered for:", r.URL.Path)

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			log.Println("Missing token, blocking request")
			http.Error(w, "Missing token", http.StatusUnauthorized)
			return
		}

		tokenString := strings.Replace(authHeader, "Bearer ", "", 1)
		log.Println("📝 Received Token:", tokenString)

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil || !token.Valid {
			log.Println("Invalid token:", err)
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			log.Println("Failed to extract JWT claims")
			http.Error(w, "Invalid token claims", http.StatusUnauthorized)
			return
		}

		// Extract UUID from JWT claims (as string)
		userIDStr, exists := claims["user_id"].(string)
		if !exists {
			log.Println("user_id missing in token")
			http.Error(w, "Invalid user ID", http.StatusBadRequest)
			return
		}

		log.Println("Extracted user_id from JWT:", userIDStr)

		// Attach UUID to context
		ctx := context.WithValue(r.Context(), UserContextKey, userIDStr)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

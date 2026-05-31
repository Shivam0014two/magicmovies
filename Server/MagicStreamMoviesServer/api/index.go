package handler

import (
	"context"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/GavinLonDigital/MagicStream/Server/MagicStreamServer/database"
	"github.com/GavinLonDigital/MagicStream/Server/MagicStreamServer/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

var app *gin.Engine

func init() {
	app = gin.New()
	app.Use(gin.Recovery())

	// Configuration
	allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
	var origins []string
	if allowedOrigins != "" {
		origins = strings.Split(allowedOrigins, ",")
		for i := range origins {
			origins[i] = strings.TrimSpace(origins[i])
		}
	} else {
		origins = []string{"http://localhost:5173"}
	}

	config := cors.Config{}
	config.AllowOrigins = origins
	config.AllowMethods = []string{"GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	config.ExposeHeaders = []string{"Content-Length"}
	config.AllowCredentials = true
	config.MaxAge = 12 * time.Hour

	app.Use(cors.New(config))

	// Connect to MongoDB
	client := database.Connect()
	
	// Routes
	app.GET("/api/hello", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Hello from Vercel Go Serverless!"})
	})

	// Vercel usually expects /api prefix for serverless functions
	api := app.Group("/api")
	{
		routes.SetupUnProtectedRoutes(api, client)
		routes.SetupProtectedRoutes(api, client)
	}

	// Also setup root routes just in case the rewrite doesn't happen as expected
	routes.SetupUnProtectedRoutes(app, client)
	routes.SetupProtectedRoutes(app, client)
}

func Handler(w http.ResponseWriter, r *http.Request) {
	app.ServeHTTP(w, r)
}

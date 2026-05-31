package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/GavinLonDigital/MagicStream/Server/MagicStreamServer/database"
	"github.com/GavinLonDigital/MagicStream/Server/MagicStreamServer/models"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Println("Warning: .env file not found")
	}

	client := database.Connect()
	if client == nil {
		log.Fatal("Could not connect to MongoDB")
	}
	defer client.Disconnect(context.Background())

	seedCollection(client, "genres", "C:/Users/Shivam/MagicStream/magic-stream-seed-data/genres.json", &[]models.Genre{})
	seedCollection(client, "rankings", "C:/Users/Shivam/MagicStream/magic-stream-seed-data/rankings.json", &[]models.Ranking{})
	seedMovies(client)
}

func seedCollection(client *mongo.Client, name string, filePath string, target interface{}) {
	fmt.Printf("Seeding %s...\n", name)
	file, err := os.ReadFile(filePath)
	if err != nil {
		log.Printf("Error reading %s: %v", filePath, err)
		return
	}

	err = json.Unmarshal(file, target)
	if err != nil {
		log.Printf("Error unmarshaling %s: %v", name, err)
		return
	}

	collection := database.OpenCollection(name, client)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, _ = collection.DeleteMany(ctx, bson.M{})

	// Target is a pointer to a slice
	// We need to convert it to []interface{}
	var docs []interface{}
	
	// This is a bit hacky because target is interface{}, but for seeding it's okay
	// We'll re-marshal and unmarshal into generic map for insertion
	var generic []map[string]interface{}
	json.Unmarshal(file, &generic)
	for _, doc := range generic {
		docs = append(docs, doc)
	}

	if len(docs) > 0 {
		_, err = collection.InsertMany(ctx, docs)
		if err != nil {
			log.Printf("Error inserting %s: %v", name, err)
			return
		}
		fmt.Printf("Successfully seeded %d %s!\n", len(docs), name)
	}
}

func seedMovies(client *mongo.Client) {
	fmt.Println("Seeding movies...")
	file, err := os.ReadFile("C:/Users/Shivam/MagicStream/magic-stream-seed-data/movies.json")
	if err != nil {
		log.Printf("Error reading movies.json: %v", err)
		return
	}

	var movies []models.Movie
	err = json.Unmarshal(file, &movies)
	if err != nil {
		log.Printf("Error unmarshaling movies: %v", err)
		return
	}

	collection := database.OpenCollection("movies", client)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, _ = collection.DeleteMany(ctx, bson.M{})

	var docs []interface{}
	for _, m := range movies {
		// Ensure omitempty _id is handled if needed
		docs = append(docs, m)
	}

	if len(docs) > 0 {
		_, err = collection.InsertMany(ctx, docs)
		if err != nil {
			log.Printf("Error inserting movies: %v", err)
			return
		}
		fmt.Printf("Successfully seeded %d movies!\n", len(docs))
	}
}

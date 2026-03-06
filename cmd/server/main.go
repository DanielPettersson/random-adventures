package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"random-adventures/internal/service"
	"random-adventures/proto/narrative/narrativeconnect"

	"github.com/rs/cors"
	"google.golang.org/genai"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
)

func main() {
	ctx := context.Background()

	// Initialize GenAI client
	genaiClient, err := genai.NewClient(ctx, nil)
	if err != nil {
		log.Fatalf("failed to create genai client: %v", err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "50051"
	}

	// Create narrative service
	realClient := service.NewRealGeminiClient(genaiClient)
	narrativeService := service.NewNarrativeService(realClient)

	// Create Connect handler
	path, handler := narrativeconnect.NewNarrativeServiceHandler(narrativeService)

	mux := http.NewServeMux()
	mux.Handle(path, handler)

	// CORS support
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:5173"}, // Frontend dev server
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type", "Connect-Protocol-Version", "X-User-Agent", "X-Grpc-Web"},
		ExposedHeaders: []string{"Grpc-Status", "Grpc-Message", "Grpc-Status-Details-Bin"},
	})

	srv := &http.Server{
		Addr:    fmt.Sprintf(":%s", port),
		Handler: h2c.NewHandler(c.Handler(mux), &http2.Server{}),
	}

	go func() {
		log.Printf("server listening at %v", srv.Addr)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("failed to serve: %v", err)
		}
	}()

	// Wait for control C to gracefully stop the server
	ch := make(chan os.Signal, 1)
	signal.Notify(ch, os.Interrupt, syscall.SIGTERM)

	// Block until a signal is received
	<-ch

	log.Println("Stopping the server")
	if err := srv.Shutdown(context.Background()); err != nil {
		log.Fatalf("failed to shutdown: %v", err)
	}
	log.Println("End of Program")
}

package main

import (
	"context"
	"fmt"
	"net"
	"net/http"
	"testing"
	"time"
)

func TestServerStartup(t *testing.T) {
	port := 50052
	
	mux := http.NewServeMux()
	srv := &http.Server{
		Addr:    fmt.Sprintf(":%d", port),
		Handler: mux,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			fmt.Printf("failed to serve: %v\n", err)
		}
	}()

	// Wait a bit to ensure server started
	time.Sleep(100 * time.Millisecond)

	conn, err := net.DialTimeout("tcp", fmt.Sprintf("localhost:%d", port), 1*time.Second)
	if err != nil {
		t.Errorf("could not connect to server: %v", err)
	} else {
		conn.Close()
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	srv.Shutdown(ctx)
}

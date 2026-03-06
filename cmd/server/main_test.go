package main

import (
	"fmt"
	"net"
	"testing"
	"time"

	"google.golang.org/grpc"
)

func TestServerStartup(t *testing.T) {
	port := 50052
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		t.Fatalf("failed to listen: %v", err)
	}
	defer lis.Close()

	s := grpc.NewServer()
	go func() {
		if err := s.Serve(lis); err != nil && err != grpc.ErrServerStopped {
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

	s.GracefulStop()
}

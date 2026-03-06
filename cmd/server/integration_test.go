package main

import (
	"context"
	"fmt"
	"net"
	"testing"

	"random-adventures/internal/service"
	narrative "random-adventures/proto"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type mockGeminiClient struct{}

func (m *mockGeminiClient) GenerateContent(ctx context.Context, model string, prompt string) (string, error) {
	return "AI generated adventure", nil
}

func TestNarrativeService_GenerateNarrative(t *testing.T) {
	// Start server on a random port
	lis, err := net.Listen("tcp", ":0")
	if err != nil {
		t.Fatalf("failed to listen: %v", err)
	}
	defer lis.Close()

	s := grpc.NewServer()
	narrativeService := service.NewNarrativeService(&mockGeminiClient{})
	narrative.RegisterNarrativeServiceServer(s, narrativeService)

	go func() {
		if err := s.Serve(lis); err != nil && err != grpc.ErrServerStopped {
			fmt.Printf("failed to serve: %v\n", err)
		}
	}()
	defer s.GracefulStop()

	// Create client connection
	conn, err := grpc.Dial(lis.Addr().String(), grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		t.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()

	client := narrative.NewNarrativeServiceClient(conn)

	req := &narrative.GenerateNarrativeRequest{
		Prompt: "Tell me a story",
		Tone:   "Epic",
	}
	resp, err := client.GenerateNarrative(context.Background(), req)

	if err != nil {
		t.Fatalf("GenerateNarrative failed: %v", err)
	}

	if resp.Text != "AI generated adventure" {
		t.Errorf("expected 'AI generated adventure', got %v", resp.Text)
	}
}

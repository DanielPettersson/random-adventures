package main

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"

	"random-adventures/internal/service"
	"random-adventures/proto/narrative"
	"random-adventures/proto/narrative/narrativeconnect"

	"connectrpc.com/connect"
)

type testMockGeminiClient struct{}

func (m *testMockGeminiClient) GenerateContent(ctx context.Context, model string, systemInstruction string, prompt string) (string, error) {
	return "AI generated adventure", nil
}

func (m *testMockGeminiClient) GenerateImage(ctx context.Context, model string, prompt string, imageData []byte) ([]byte, error) {
	return []byte("fake-image-data"), nil
}

func (m *testMockGeminiClient) GenerateAudio(ctx context.Context, model string, text string) ([]byte, error) {
	return []byte("fake-audio-data"), nil
}

func TestNarrativeService_GenerateNarrative(t *testing.T) {
	mux := http.NewServeMux()
	narrativeService := service.NewNarrativeService(&testMockGeminiClient{})
	mux.Handle(narrativeconnect.NewNarrativeServiceHandler(narrativeService))
	srv := httptest.NewServer(mux)
	defer srv.Close()

	client := narrativeconnect.NewNarrativeServiceClient(
		http.DefaultClient,
		srv.URL,
	)

	req := connect.NewRequest(&narrative.GenerateNarrativeRequest{
		Prompt: "Tell me a story",
		Tone:   "Epic",
	})
	resp, err := client.GenerateNarrative(context.Background(), req)

	if err != nil {
		t.Fatalf("GenerateNarrative failed: %v", err)
	}

	if resp.Msg.Text != "AI generated adventure" {
		t.Errorf("expected 'AI generated adventure', got %v", resp.Msg.Text)
	}
}

func TestNarrativeService_GenerateImage(t *testing.T) {
	mux := http.NewServeMux()
	narrativeService := service.NewNarrativeService(&testMockGeminiClient{})
	mux.Handle(narrativeconnect.NewNarrativeServiceHandler(narrativeService))
	srv := httptest.NewServer(mux)
	defer srv.Close()

	client := narrativeconnect.NewNarrativeServiceClient(
		http.DefaultClient,
		srv.URL,
	)

	req := connect.NewRequest(&narrative.GenerateImageRequest{
		Prompt: "A dark forest",
	})
	resp, err := client.GenerateImage(context.Background(), req)

	if err != nil {
		t.Fatalf("GenerateImage failed: %v", err)
	}

	if string(resp.Msg.ImageData) != "fake-image-data" {
		t.Errorf("expected 'fake-image-data', got %v", string(resp.Msg.ImageData))
	}
}

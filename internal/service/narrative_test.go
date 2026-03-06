package service

import (
	"context"
	"testing"

	"random-adventures/proto/narrative"

	"connectrpc.com/connect"
)

type mockGeminiClient struct {
	generateContentFunc func(ctx context.Context, model string, systemInstruction string, prompt string) (string, error)
	generateImageFunc   func(ctx context.Context, model string, prompt string) ([]byte, error)
}

func (m *mockGeminiClient) GenerateContent(ctx context.Context, model string, systemInstruction string, prompt string) (string, error) {
	return m.generateContentFunc(ctx, model, systemInstruction, prompt)
}

func (m *mockGeminiClient) GenerateImage(ctx context.Context, model string, prompt string) ([]byte, error) {
	return m.generateImageFunc(ctx, model, prompt)
}

func TestGenerateNarrative_Success(t *testing.T) {
	mockClient := &mockGeminiClient{
		generateContentFunc: func(ctx context.Context, model string, systemInstruction string, prompt string) (string, error) {
			return "AI generated story", nil
		},
	}

	s := NewNarrativeService(mockClient)

	req := connect.NewRequest(&narrative.GenerateNarrativeRequest{
		Prompt: "Start an adventure",
		Tone:   "Dark",
	})
	resp, err := s.GenerateNarrative(context.Background(), req)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if resp.Msg.Text != "AI generated story" {
		t.Errorf("Expected 'AI generated story', got %v", resp.Msg.Text)
	}
}

func TestGenerateNarrative_SystemInstruction(t *testing.T) {
	var capturedInstruction string
	mockClient := &mockGeminiClient{
		generateContentFunc: func(ctx context.Context, model string, systemInstruction string, prompt string) (string, error) {
			capturedInstruction = systemInstruction
			return "AI generated story", nil
		},
	}

	s := NewNarrativeService(mockClient)

	req := connect.NewRequest(&narrative.GenerateNarrativeRequest{
		Prompt: "Enter the cave",
		Tone:   "Epic",
	})
	_, _ = s.GenerateNarrative(context.Background(), req)

	// Verify system instruction content
	expectedParts := []string{
		"Direct & Impactful",
		"600-700 characters",
		"mandatory closing question",
		"Tone: Epic",
	}

	for _, part := range expectedParts {
		if !contains(capturedInstruction, part) {
			t.Errorf("System instruction missing expected part %q: %q", part, capturedInstruction)
		}
	}
}

func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || (len(substr) > 0 && (func() bool {
		for i := 0; i <= len(s)-len(substr); i++ {
			if s[i:i+len(substr)] == substr {
				return true
			}
		}
		return false
	})()))
}

func TestGenerateImage_Success(t *testing.T) {
	mockClient := &mockGeminiClient{
		generateImageFunc: func(ctx context.Context, model string, prompt string) ([]byte, error) {
			return []byte("fake-image-data"), nil
		},
	}

	s := NewNarrativeService(mockClient)

	req := connect.NewRequest(&narrative.GenerateImageRequest{
		Prompt: "A dark forest",
	})
	resp, err := s.GenerateImage(context.Background(), req)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if string(resp.Msg.ImageData) != "fake-image-data" {
		t.Errorf("Expected 'fake-image-data', got %v", string(resp.Msg.ImageData))
	}
}

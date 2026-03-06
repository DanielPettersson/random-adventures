package service

import (
	"context"
	"testing"

	narrative "random-adventures/proto"
)

type mockGeminiClient struct {
	generateContentFunc func(ctx context.Context, model string, prompt string) (string, error)
}

func (m *mockGeminiClient) GenerateContent(ctx context.Context, model string, prompt string) (string, error) {
	return m.generateContentFunc(ctx, model, prompt)
}

func TestGenerateNarrative_Success(t *testing.T) {
	mockClient := &mockGeminiClient{
		generateContentFunc: func(ctx context.Context, model string, prompt string) (string, error) {
			return "AI generated story", nil
		},
	}

	s := NewNarrativeService(mockClient)

	req := &narrative.GenerateNarrativeRequest{
		Prompt: "Start an adventure",
		Tone:   "Dark",
	}
	resp, err := s.GenerateNarrative(context.Background(), req)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if resp.Text != "AI generated story" {
		t.Errorf("Expected 'AI generated story', got %v", resp.Text)
	}
}

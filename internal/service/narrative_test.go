package service

import (
	"context"
	"fmt"
	"testing"

	"random-adventures/proto/narrative"

	"connectrpc.com/connect"
)

type mockGeminiClient struct {
	generateContentFunc func(ctx context.Context, model string, systemInstruction string, prompt string) (string, error)
	generateImageFunc   func(ctx context.Context, model string, prompt string, imageData []byte) ([]byte, error)
	generateAudioFunc   func(ctx context.Context, model string, text string) ([]byte, string, error)
}

func (m *mockGeminiClient) GenerateContent(ctx context.Context, model string, systemInstruction string, prompt string) (string, error) {
	return m.generateContentFunc(ctx, model, systemInstruction, prompt)
}

func (m *mockGeminiClient) GenerateImage(ctx context.Context, model string, prompt string, imageData []byte) ([]byte, error) {
	return m.generateImageFunc(ctx, model, prompt, imageData)
}

func (m *mockGeminiClient) GenerateAudio(ctx context.Context, model string, text string) ([]byte, string, error) {
	return m.generateAudioFunc(ctx, model, text)
}

func TestGenerateNarrative_Success(t *testing.T) {
	mockClient := &mockGeminiClient{
		generateContentFunc: func(ctx context.Context, model string, systemInstruction string, prompt string) (string, error) {
			return "AI generated story", nil
		},
		generateAudioFunc: nil,
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
		generateAudioFunc: nil,
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

func TestGenerateNarrative_Error(t *testing.T) {
	mockClient := &mockGeminiClient{
		generateContentFunc: func(ctx context.Context, model string, systemInstruction string, prompt string) (string, error) {
			return "", fmt.Errorf("API error")
		},
		generateAudioFunc: nil,
	}

	s := NewNarrativeService(mockClient)

	req := connect.NewRequest(&narrative.GenerateNarrativeRequest{
		Prompt: "Start an adventure",
		Tone:   "Dark",
	})
	_, err := s.GenerateNarrative(context.Background(), req)

	if err == nil {
		t.Fatal("Expected error, got nil")
	}
}

func TestGenerateImage_Error(t *testing.T) {
	mockClient := &mockGeminiClient{
		generateImageFunc: func(ctx context.Context, model string, prompt string, imageData []byte) ([]byte, error) {
			return nil, fmt.Errorf("API error")
		},
		generateAudioFunc: nil,
	}

	s := NewNarrativeService(mockClient)

	req := connect.NewRequest(&narrative.GenerateImageRequest{
		Prompt: "A dark forest",
	})
	_, err := s.GenerateImage(context.Background(), req)

	if err == nil {
		t.Fatal("Expected error, got nil")
	}
}

func TestGenerateNarrative_History(t *testing.T) {
	var capturedPrompt string
	mockClient := &mockGeminiClient{
		generateContentFunc: func(ctx context.Context, model string, systemInstruction string, prompt string) (string, error) {
			capturedPrompt = prompt
			return "AI generated story", nil
		},
		generateAudioFunc: nil,
	}

	s := NewNarrativeService(mockClient)

	req := connect.NewRequest(&narrative.GenerateNarrativeRequest{
		Prompt:  "Next move",
		Tone:    "Epic",
		History: []string{"Step 1", "Step 2"},
	})
	_, _ = s.GenerateNarrative(context.Background(), req)

	if !contains(capturedPrompt, "Recent History for Context:") {
		t.Errorf("Prompt missing history context: %q", capturedPrompt)
	}
	if !contains(capturedPrompt, "- Step 1") || !contains(capturedPrompt, "- Step 2") {
		t.Errorf("Prompt missing history steps: %q", capturedPrompt)
	}
}

func TestGenerateImage_Success(t *testing.T) {
	mockClient := &mockGeminiClient{
		generateImageFunc: func(ctx context.Context, model string, prompt string, imageData []byte) ([]byte, error) {
			return []byte("fake-image-data"), nil
		},
		generateAudioFunc: nil,
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

func TestGenerateImage_WithPlayerPhoto(t *testing.T) {
	var capturedPrompt string
	mockClient := &mockGeminiClient{
		generateImageFunc: func(ctx context.Context, model string, prompt string, imageData []byte) ([]byte, error) {
			capturedPrompt = prompt
			return []byte("fake-image-data"), nil
		},
		generateAudioFunc: nil,
	}

	s := NewNarrativeService(mockClient)

	photo := "YmFzZTY0LWVuY29kZWQtcGhvdG8=" // "base64-encoded-photo" in valid base64
	req := connect.NewRequest(&narrative.GenerateImageRequest{
		Prompt:      "A hero in a forest",
		PlayerPhoto: &photo,
	})
	_, err := s.GenerateImage(context.Background(), req)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	// Verify the prompt contains the player photo reference and realism keywords
	expectedParts := []string{
		"The person in the attached photo is the protagonist",
		"photorealistic",
		"stylized",
		"vibrant",
		"expressive",
		"atmospheric",
	}

	for _, part := range expectedParts {
		if !contains(capturedPrompt, part) {
			t.Errorf("Image prompt missing expected part %q: %q", part, capturedPrompt)
		}
	}
}

func TestGenerateImage_DecodingError(t *testing.T) {
	var capturedPrompt string
	mockClient := &mockGeminiClient{
		generateImageFunc: func(ctx context.Context, model string, prompt string, imageData []byte) ([]byte, error) {
			capturedPrompt = prompt
			return []byte("fake-image-data"), nil
		},
		generateAudioFunc: nil,
	}

	s := NewNarrativeService(mockClient)

	photo := "invalid-base64-!!!"
	req := connect.NewRequest(&narrative.GenerateImageRequest{
		Prompt:      "A hero in a forest",
		PlayerPhoto: &photo,
	})
	_, err := s.GenerateImage(context.Background(), req)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	// Verify the prompt doesn't contain the photo reference but has realism keywords
	if contains(capturedPrompt, "The person in the attached photo is the protagonist") {
		t.Errorf("Image prompt should NOT contain photo reference if decoding failed: %q", capturedPrompt)
	}

	if !contains(capturedPrompt, "stylized") {
		t.Errorf("Image prompt missing realism keywords: %q", capturedPrompt)
	}
}

func TestGenerateAudio_Success(t *testing.T) {
	mockClient := &mockGeminiClient{
		generateAudioFunc: func(ctx context.Context, model string, text string) ([]byte, string, error) {
			return []byte("fake-audio-data"), "audio/mpeg", nil
		},
	}

	s := NewNarrativeService(mockClient)

	req := connect.NewRequest(&narrative.GenerateAudioRequest{
		Text:     "Hello world",
		Language: "English",
	})
	resp, err := s.GenerateAudio(context.Background(), req)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if string(resp.Msg.AudioData) != "fake-audio-data" {
		t.Errorf("Expected 'fake-audio-data', got %v", string(resp.Msg.AudioData))
	}

	if resp.Msg.MimeType != "audio/mpeg" {
		t.Errorf("Expected 'audio/mpeg', got %v", resp.Msg.MimeType)
	}
}

func TestGenerateImage_Retry(t *testing.T) {
	callCount := 0
	var capturedPrompts []string
	mockClient := &mockGeminiClient{
		generateImageFunc: func(ctx context.Context, model string, prompt string, imageData []byte) ([]byte, error) {
			callCount++
			capturedPrompts = append(capturedPrompts, prompt)
			if callCount == 1 {
				return nil, fmt.Errorf("first attempt failed")
			}
			return []byte("retry-image-data"), nil
		},
	}

	s := NewNarrativeService(mockClient)

	req := connect.NewRequest(&narrative.GenerateImageRequest{
		Prompt: "Complex story segment",
	})
	resp, err := s.GenerateImage(context.Background(), req)

	if err != nil {
		t.Fatalf("Expected no error after retry, got %v", err)
	}

	if callCount != 2 {
		t.Errorf("Expected 2 calls to GenerateImage, got %d", callCount)
	}

	if string(resp.Msg.ImageData) != "retry-image-data" {
		t.Errorf("Expected 'retry-image-data', got %v", string(resp.Msg.ImageData))
	}

	if !contains(capturedPrompts[1], "A cinematic scene illustrating the story") {
		t.Errorf("Second attempt should use simple prompt, got %q", capturedPrompts[1])
	}
}

func TestGenerateImage_PromptCleaning(t *testing.T) {
	var capturedPrompt string
	mockClient := &mockGeminiClient{
		generateImageFunc: func(ctx context.Context, model string, prompt string, imageData []byte) ([]byte, error) {
			capturedPrompt = prompt
			return []byte("fake-image-data"), nil
		},
	}

	s := NewNarrativeService(mockClient)

	// A prompt ending with a question
	inputPrompt := "You see a dark cave. There are eyes glowing in the dark. What do you do?"
	req := connect.NewRequest(&narrative.GenerateImageRequest{
		Prompt: inputPrompt,
	})
	_, _ = s.GenerateImage(context.Background(), req)

	if contains(capturedPrompt, "What do you do?") {
		t.Errorf("Cleaned prompt should NOT contain the question: %q", capturedPrompt)
	}

	if !contains(capturedPrompt, "You see a dark cave") {
		t.Errorf("Cleaned prompt missing core story: %q", capturedPrompt)
	}
}

func TestGenerateAudio_Error(t *testing.T) {
	mockClient := &mockGeminiClient{
		generateAudioFunc: func(ctx context.Context, model string, text string) ([]byte, string, error) {
			return nil, "", fmt.Errorf("API error")
		},
	}

	s := NewNarrativeService(mockClient)

	req := connect.NewRequest(&narrative.GenerateAudioRequest{
		Text: "Hello world",
	})
	_, err := s.GenerateAudio(context.Background(), req)

	if err == nil {
		t.Fatal("Expected error, got nil")
	}
}

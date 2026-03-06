package service

import (
	"context"
	"fmt"
	narrative "random-adventures/proto"

	"google.golang.org/genai"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type GeminiClient interface {
	GenerateContent(ctx context.Context, model string, prompt string) (string, error)
	GenerateImage(ctx context.Context, model string, prompt string) ([]byte, error)
}

type NarrativeService struct {
	narrative.UnimplementedNarrativeServiceServer
	genaiClient GeminiClient
}

func NewNarrativeService(client GeminiClient) *NarrativeService {
	return &NarrativeService{
		genaiClient: client,
	}
}

func (s *NarrativeService) GenerateNarrative(ctx context.Context, req *narrative.GenerateNarrativeRequest) (*narrative.GenerateNarrativeResponse, error) {
	prompt := fmt.Sprintf("Narrative Tone: %s. Prompt: %s", req.Tone, req.Prompt)
	if len(req.History) > 0 {
		prompt += "\nHistory:\n"
		for _, h := range req.History {
			prompt += fmt.Sprintf("- %s\n", h)
		}
	}

	text, err := s.genaiClient.GenerateContent(ctx, "gemini-3.0-flash-preview", prompt)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to generate narrative: %v", err)
	}

	return &narrative.GenerateNarrativeResponse{Text: text}, nil
}

func (s *NarrativeService) GenerateImage(ctx context.Context, req *narrative.GenerateImageRequest) (*narrative.GenerateImageResponse, error) {
	// Stylized illustration support
	prompt := fmt.Sprintf("A vibrant, stylized illustration of: %s. Art style: digital painting, expressive, atmospheric.", req.Prompt)

	imageData, err := s.genaiClient.GenerateImage(ctx, "gemini-3.1-flash-image-preview", prompt)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to generate image: %v", err)
	}

	return &narrative.GenerateImageResponse{ImageData: imageData}, nil
}

// realGeminiClient implements GeminiClient using the actual GenAI client
type realGeminiClient struct {
	client *genai.Client
}

func NewRealGeminiClient(client *genai.Client) GeminiClient {
	return &realGeminiClient{client: client}
}

func (r *realGeminiClient) GenerateContent(ctx context.Context, model string, prompt string) (string, error) {
	result, err := r.client.Models.GenerateContent(ctx, model, genai.Text(prompt), nil)
	if err != nil {
		return "", err
	}
	return result.Text(), nil
}

func (r *realGeminiClient) GenerateImage(ctx context.Context, model string, prompt string) ([]byte, error) {
	config := &genai.GenerateContentConfig{
		ResponseModalities: []string{"IMAGE"},
	}
	resp, err := r.client.Models.GenerateContent(ctx, model, genai.Text(prompt), config)
	if err != nil {
		return nil, err
	}
	if len(resp.Candidates) == 0 {
		return nil, fmt.Errorf("no candidates returned")
	}
	for _, part := range resp.Candidates[0].Content.Parts {
		if part.InlineData != nil {
			return part.InlineData.Data, nil
		}
	}
	return nil, fmt.Errorf("no image found in response")
}

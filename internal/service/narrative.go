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

	text, err := s.genaiClient.GenerateContent(ctx, "gemini-3-flash-preview", prompt)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to generate narrative: %v", err)
	}

	return &narrative.GenerateNarrativeResponse{Text: text}, nil
}

func (s *NarrativeService) GenerateImage(ctx context.Context, req *narrative.GenerateImageRequest) (*narrative.GenerateImageResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GenerateImage not implemented")
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

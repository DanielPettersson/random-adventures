package service

import (
	"context"
	"fmt"
	"random-adventures/proto/narrative"
	"random-adventures/proto/narrative/narrativeconnect"

	"connectrpc.com/connect"
	"google.golang.org/genai"
)

type GeminiClient interface {
	GenerateContent(ctx context.Context, model string, systemInstruction string, prompt string) (string, error)
	GenerateImage(ctx context.Context, model string, prompt string) ([]byte, error)
}

type NarrativeService struct {
	genaiClient GeminiClient
}

func NewNarrativeService(client GeminiClient) *NarrativeService {
	return &NarrativeService{
		genaiClient: client,
	}
}

func (s *NarrativeService) GenerateNarrative(
	ctx context.Context,
	req *connect.Request[narrative.GenerateNarrativeRequest],
) (*connect.Response[narrative.GenerateNarrativeResponse], error) {
	prompt := fmt.Sprintf("Narrative Tone: %s. Prompt: %s", req.Msg.Tone, req.Msg.Prompt)
	if len(req.Msg.History) > 0 {
		prompt += "\nHistory:\n"
		for _, h := range req.Msg.History {
			prompt += fmt.Sprintf("- %s\n", h)
		}
	}

	text, err := s.genaiClient.GenerateContent(ctx, "gemini-3-flash-preview", "", prompt)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("failed to generate narrative: %v", err))
	}

	return connect.NewResponse(&narrative.GenerateNarrativeResponse{Text: text}), nil
}

func (s *NarrativeService) GenerateImage(
	ctx context.Context,
	req *connect.Request[narrative.GenerateImageRequest],
) (*connect.Response[narrative.GenerateImageResponse], error) {
	// Stylized illustration support
	prompt := fmt.Sprintf("A vibrant, stylized illustration of: %s. Art style: digital painting, expressive, atmospheric.", req.Msg.Prompt)

	imageData, err := s.genaiClient.GenerateImage(ctx, "gemini-3.1-flash-image-preview", prompt)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("failed to generate image: %v", err))
	}

	return connect.NewResponse(&narrative.GenerateImageResponse{ImageData: imageData}), nil
}

// realGeminiClient implements GeminiClient using the actual GenAI client
type realGeminiClient struct {
	client *genai.Client
}

func NewRealGeminiClient(client *genai.Client) GeminiClient {
	return &realGeminiClient{client: client}
}

func (r *realGeminiClient) GenerateContent(ctx context.Context, model string, systemInstruction string, prompt string) (string, error) {
	var config *genai.GenerateContentConfig
	if systemInstruction != "" {
		config = &genai.GenerateContentConfig{
			SystemInstruction: &genai.Content{
				Parts: []*genai.Part{
					{Text: systemInstruction},
				},
			},
		}
	}
	result, err := r.client.Models.GenerateContent(ctx, model, genai.Text(prompt), config)
	if err != nil {
		return "", err
	}
	return result.Text(), nil
}

func (r *realGeminiClient) GenerateImage(ctx context.Context, model string, prompt string) ([]byte, error) {
	config := &genai.GenerateContentConfig{
		ResponseModalities: []string{"IMAGE"},
		ImageConfig: &genai.ImageConfig{
			AspectRatio: "16:9",
			ImageSize:   "0.5K",
		},
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

// Verify that NarrativeService implements the handler interface
var _ narrativeconnect.NarrativeServiceHandler = (*NarrativeService)(nil)

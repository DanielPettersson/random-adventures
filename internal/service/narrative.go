package service

import (
	"context"
	"encoding/base64"
	"fmt"
	"random-adventures/proto/narrative"
	"random-adventures/proto/narrative/narrativeconnect"

	"connectrpc.com/connect"
	"google.golang.org/genai"
)

type GeminiClient interface {
	GenerateContent(ctx context.Context, model string, systemInstruction string, prompt string) (string, error)
	GenerateImage(ctx context.Context, model string, prompt string, imageData []byte) ([]byte, error)
	GenerateAudio(ctx context.Context, model string, text string) ([]byte, string, error)
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
	language := req.Msg.Language
	if language == "" {
		language = "English"
	}

	systemInstruction := fmt.Sprintf(`You are a master storyteller for a text-based adventure game.
Your style is Direct & Impactful. Avoid excessive exposition; focus on immediate actions and sensory details.
Your response must be concise, ideally between 600-700 characters.
Tone: %s
Language: %s

CRITICAL: You MUST write the entire story and all questions in %s.
CRITICAL: Every response MUST end with a mandatory closing question that forces the player to make a choice to continue the story. The question can be open-ended or offer specific contextual choices.`, req.Msg.Tone, language, language)

	prompt := fmt.Sprintf("User Input: %s", req.Msg.Prompt)
	if len(req.Msg.History) > 0 {
		prompt += "\n\nRecent History for Context:\n"
		for _, h := range req.Msg.History {
			prompt += fmt.Sprintf("- %s\n", h)
		}
	}

	text, err := s.genaiClient.GenerateContent(ctx, "gemini-3-flash-preview", systemInstruction, prompt)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("failed to generate narrative: %v", err))
	}

	return connect.NewResponse(&narrative.GenerateNarrativeResponse{Text: text}), nil
}

func (s *NarrativeService) GenerateImage(
	ctx context.Context,
	req *connect.Request[narrative.GenerateImageRequest],
) (*connect.Response[narrative.GenerateImageResponse], error) {
	prompt := req.Msg.Prompt
	var imageData []byte
	var err error

	if req.Msg.PlayerPhoto != nil && *req.Msg.PlayerPhoto != "" {
		// Decode the base64 photo
		imageData, err = base64.StdEncoding.DecodeString(*req.Msg.PlayerPhoto)
		if err != nil {
			// Fallback to text only if decoding fails
			fmt.Printf("Warning: failed to decode player photo: %v\n", err)
		} else {
			prompt = fmt.Sprintf("The person in the attached photo is the protagonist. %s", prompt)
		}
	}

	// Update the prompt with realism keywords as per spec
	prompt = fmt.Sprintf("%s. Style: photorealistic, stylized, vibrant, expressive, atmospheric.", prompt)

	generatedImage, err := s.genaiClient.GenerateImage(ctx, "gemini-3.1-flash-image-preview", prompt, imageData)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("failed to generate image: %v", err))
	}

	return connect.NewResponse(&narrative.GenerateImageResponse{ImageData: generatedImage}), nil
}

func (s *NarrativeService) GenerateAudio(
	ctx context.Context,
	req *connect.Request[narrative.GenerateAudioRequest],
) (*connect.Response[narrative.GenerateAudioResponse], error) {
	audioData, mimeType, err := s.genaiClient.GenerateAudio(ctx, "gemini-2.5-flash-preview-tts", req.Msg.Text)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("failed to generate audio: %v", err))
	}

	return connect.NewResponse(&narrative.GenerateAudioResponse{AudioData: audioData, MimeType: mimeType}), nil
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

func (r *realGeminiClient) GenerateImage(ctx context.Context, model string, prompt string, imageData []byte) ([]byte, error) {
	config := &genai.GenerateContentConfig{
		ResponseModalities: []string{"IMAGE"},
		ImageConfig: &genai.ImageConfig{
			AspectRatio: "16:9",
			ImageSize:   "0.5K",
		},
	}

	// The SDK's GenerateContent expects []*genai.Content
	contents := genai.Text(prompt)
	if len(imageData) > 0 {
		contents[0].Parts = append(contents[0].Parts, &genai.Part{
			InlineData: &genai.Blob{
				MIMEType: "image/jpeg",
				Data:     imageData,
			},
		})
	}

	resp, err := r.client.Models.GenerateContent(ctx, model, contents, config)
	if err != nil {
		return nil, err
	}
	if len(resp.Candidates) == 0 {
		return nil, fmt.Errorf("no candidates returned")
	}

	// Log candidate info for debugging
	candidate := resp.Candidates[0]
	if candidate.FinishReason != "" && candidate.FinishReason != "STOP" {
		fmt.Printf("Warning: Image generation finished with reason: %s. Safety ratings: %+v\n", candidate.FinishReason, candidate.SafetyRatings)
	}

	for _, part := range candidate.Content.Parts {
		if part.InlineData != nil {
			return part.InlineData.Data, nil
		}
	}

	// Log the parts we did get
	fmt.Printf("No image found. Candidate had %d parts. FinishReason: %s\n", len(candidate.Content.Parts), candidate.FinishReason)
	for i, p := range candidate.Content.Parts {
		if p.Text != "" {
			fmt.Printf("Part %d: Text: %s\n", i, p.Text)
		} else {
			fmt.Printf("Part %d: (non-text, non-image)\n", i)
		}
	}

	return nil, fmt.Errorf("no image found in response")
}

func (r *realGeminiClient) GenerateAudio(ctx context.Context, model string, text string) ([]byte, string, error) {
	config := &genai.GenerateContentConfig{
		ResponseModalities: []string{"AUDIO"},
	}

	resp, err := r.client.Models.GenerateContent(ctx, model, genai.Text(text), config)
	if err != nil {
		return nil, "", err
	}
	if len(resp.Candidates) == 0 {
		return nil, "", fmt.Errorf("no candidates returned")
	}

	candidate := resp.Candidates[0]
	for _, part := range candidate.Content.Parts {
		if part.InlineData != nil && (part.InlineData.MIMEType == "audio/mpeg" || 
			part.InlineData.MIMEType == "audio/mp3" || 
			part.InlineData.MIMEType == "audio/L16;codec=pcm;rate=24000" ||
			part.InlineData.MIMEType == "audio/L16") {
			return part.InlineData.Data, part.InlineData.MIMEType, nil
		}
	}

	return nil, "", fmt.Errorf("no audio found in response")
}

// Verify that NarrativeService implements the handler interface
var _ narrativeconnect.NarrativeServiceHandler = (*NarrativeService)(nil)

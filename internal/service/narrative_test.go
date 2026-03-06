package service

import (
	"context"
	"testing"

	narrative "random-adventures/proto"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func TestGenerateNarrative_Unimplemented(t *testing.T) {
	s := NewNarrativeService()
	req := &narrative.GenerateNarrativeRequest{Prompt: "test"}
	resp, err := s.GenerateNarrative(context.Background(), req)

	if resp != nil {
		t.Errorf("Expected nil response, got %v", resp)
	}

	if err == nil {
		t.Fatal("Expected error, got nil")
	}

	st, ok := status.FromError(err)
	if !ok {
		t.Fatal("Expected gRPC status error")
	}

	if st.Code() != codes.Unimplemented {
		t.Errorf("Expected Unimplemented code, got %v", st.Code())
	}
}

func TestGenerateImage_Unimplemented(t *testing.T) {
	s := NewNarrativeService()
	req := &narrative.GenerateImageRequest{Prompt: "test"}
	resp, err := s.GenerateImage(context.Background(), req)

	if resp != nil {
		t.Errorf("Expected nil response, got %v", resp)
	}

	if err == nil {
		t.Fatal("Expected error, got nil")
	}

	st, ok := status.FromError(err)
	if !ok {
		t.Fatal("Expected gRPC status error")
	}

	if st.Code() != codes.Unimplemented {
		t.Errorf("Expected Unimplemented code, got %v", st.Code())
	}
}

package service

import (
	"context"
	narrative "random-adventures/proto"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type NarrativeService struct {
	narrative.UnimplementedNarrativeServiceServer
}

func NewNarrativeService() *NarrativeService {
	return &NarrativeService{}
}

func (s *NarrativeService) GenerateNarrative(ctx context.Context, req *narrative.GenerateNarrativeRequest) (*narrative.GenerateNarrativeResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GenerateNarrative not implemented")
}

func (s *NarrativeService) GenerateImage(ctx context.Context, req *narrative.GenerateImageRequest) (*narrative.GenerateImageResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GenerateImage not implemented")
}

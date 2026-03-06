# Specification: Implement core web backend and narrative generation API

## Goal
Establish a robust Go-based backend using gRPC and Protocol Buffers to handle dynamic narrative and image generation using Google's GenAI model (Gemini).

## Requirements
- Define gRPC service and messages for narrative and image generation.
- Implement a Go backend using a modular architecture (`cmd`, `internal`, `proto`).
- Integrate `google.golang.org/genai` library.
- Support dynamic narrative generation based on player choices and selected tone.
- Support stylized image generation using GenAI.
- Enforce TDD and high code coverage (>80%).

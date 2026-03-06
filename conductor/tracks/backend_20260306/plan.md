# Implementation Plan: Implement core web backend and narrative generation API

## Phase 1: Foundation & API Definition [checkpoint: 5cfaeef]
- [x] Task: Define gRPC service and Protobuf messages [1d05d47]
    - [x] Create `proto/narrative.proto` with `NarrativeService` and message definitions
    - [x] Generate Go code from the Protobuf definition
- [x] Task: Initialize Go project structure and dependencies [1d05d47]
    - [x] Organize project directories into `cmd`, `internal`, and `proto`
    - [x] Update `go.mod` with necessary dependencies
- [x] Task: Implement basic gRPC server [1d05d47]
    - [x] Write unit tests for server startup and error handling
    - [x] Implement the main gRPC server logic and graceful shutdown
- [x] Task: Conductor - User Manual Verification 'Foundation & API Definition' (Protocol in workflow.md) [5cfaeef]

## Phase 2: Narrative Generation Logic [checkpoint: dd81760]
- [x] Task: Integrate Gemini for narrative generation [3c0c8f3]
    - [x] Write tests for the narrative service (mocking the GenAI client)
    - [x] Implement Gemini client integration and `GenerateNarrative` logic
- [x] Task: Implement Narrative gRPC Endpoint [3c0c8f3]
    - [x] Write integration tests for the `GenerateNarrative` gRPC endpoint
    - [x] Implement the handler for narrative generation in the gRPC server
- [x] Task: Conductor - User Manual Verification 'Narrative Generation Logic' (Protocol in workflow.md) [dd81760]

## Phase 3: Multi-modal & Image Support
- [x] Task: Implement Image Generation using Gemini [8b314f9]
    - [x] Write tests for the image generation service (mocking GenAI)
    - [x] Implement `GenerateImage` logic with stylized illustration support
- [x] Task: Implement Image gRPC Endpoint [8b314f9]
    - [x] Write integration tests for the `GenerateImage` gRPC endpoint
    - [x] Implement the handler for image generation in the gRPC server
- [ ] Task: Conductor - User Manual Verification 'Multi-modal Support (Initial)' (Protocol in workflow.md)

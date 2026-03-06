# Implementation Plan: Implement core web backend and narrative generation API

## Phase 1: Foundation & API Definition
- [ ] Task: Define gRPC service and Protobuf messages
    - [ ] Create `proto/narrative.proto` with `NarrativeService` and message definitions
    - [ ] Generate Go code from the Protobuf definition
- [ ] Task: Initialize Go project structure and dependencies
    - [ ] Organize project directories into `cmd`, `internal`, and `proto`
    - [ ] Update `go.mod` with necessary dependencies
- [ ] Task: Implement basic gRPC server
    - [ ] Write unit tests for server startup and error handling
    - [ ] Implement the main gRPC server logic and graceful shutdown
- [ ] Task: Conductor - User Manual Verification 'Foundation & API Definition' (Protocol in workflow.md)

## Phase 2: Narrative Generation Logic
- [ ] Task: Integrate Gemini for narrative generation
    - [ ] Write tests for the narrative service (mocking the GenAI client)
    - [ ] Implement Gemini client integration and `GenerateNarrative` logic
- [ ] Task: Implement Narrative gRPC Endpoint
    - [ ] Write integration tests for the `GenerateNarrative` gRPC endpoint
    - [ ] Implement the handler for narrative generation in the gRPC server
- [ ] Task: Conductor - User Manual Verification 'Narrative Generation Logic' (Protocol in workflow.md)

## Phase 3: Multi-modal & Image Support
- [ ] Task: Implement Image Generation using Gemini
    - [ ] Write tests for the image generation service (mocking GenAI)
    - [ ] Implement `GenerateImage` logic with stylized illustration support
- [ ] Task: Implement Image gRPC Endpoint
    - [ ] Write integration tests for the `GenerateImage` gRPC endpoint
    - [ ] Implement the handler for image generation in the gRPC server
- [ ] Task: Conductor - User Manual Verification 'Multi-modal Support (Initial)' (Protocol in workflow.md)

# Implementation Plan: Text-to-Speech Generation

## Phase 1: Backend Implementation (RPC & Service)
- [x] Task: Update `proto/narrative.proto` to include a new `GenerateAudio` RPC. (ee7bec1)
- [x] Task: Update the narrative service in the Go backend with the new RPC implementation. (ee7bec1)
- [x] Task: Implement the `GenerateAudio` handler using the Gemini API for speech generation. (ee7bec1)
    - [x] Add the `GenerateAudio` method to `internal/service/narrative.go`. (ee7bec1)
    - [x] Update the `google.golang.org/genai` client integration to handle speech generation requests. (ee7bec1)
- [x] Task: Write failing tests for the `GenerateAudio` RPC. (ee7bec1)
- [x] Task: Verify the implementation passes all tests. (ee7bec1)
- [x] Task: Conductor - User Manual Verification 'Phase 1: Backend Implementation (RPC & Service)' (Protocol in workflow.md) (ee7bec1)

## Phase 2: Frontend Service Layer
- [x] Task: Update the generated Connect RPC client for the frontend. (ee7bec1)
- [x] Task: Add a `generateAudio` function to `frontend/src/api/narrative.ts` to call the new RPC. (c9d7b39)
- [x] Task: Write failing tests for the `generateAudio` API call. (c9d7b39)
- [x] Task: Verify the implementation passes all tests. (c9d7b39)
- [x] Task: Conductor - User Manual Verification 'Phase 2: Frontend Service Layer' (Protocol in workflow.md) (c9d7b39)

## Phase 3: Frontend Integration & State Management
- [x] Task: Update the `useAdventure` hook to store and update audio data for segments. (edd55f6)
    - [x] Update the `AdventureSegment` type in `frontend/src/components/AdventureFeed.tsx` to include `audioData`. (edd55f6)
    - [x] Add an `updateSegmentAudio` function to the `useAdventure` hook. (edd55f6)
- [x] Task: Add a global `isAudioEnabled` state to the UI to toggle TTS. (edd55f6)
    - [x] Store this state in a suitable location (e.g., `App.tsx` or a context provider). (edd55f6)
- [x] Task: Write failing tests for the updated `useAdventure` hook and audio state. (edd55f6)
- [x] Task: Verify the implementation passes all tests. (edd55f6)
- [x] Task: Conductor - User Manual Verification 'Phase 3: Frontend Integration & State Management' (Protocol in workflow.md) (edd55f6)

## Phase 4: UI Components & Playback Logic
- [x] Task: Add a "Text-to-Speech" global toggle to the UI. (8c3a286)
    - [x] Place the toggle in an accessible location (e.g., in a settings section or near the prompt input). (8c3a286)
- [x] Task: Implement audio playback logic in the frontend. (8c3a286)
    - [x] Create a utility function or component for handling audio playback from bytes (Base64). (8c3a286)
    - [x] Trigger audio fetching and playback when a new narrative segment is added and TTS is enabled. (8c3a286)
- [x] Task: Write failing tests for the UI components and playback triggers. (8c3a286)
- [x] Task: Verify the implementation passes all tests. (8c3a286)
- [x] Task: Conductor - User Manual Verification 'Phase 4: UI Components & Playback Logic' (Protocol in workflow.md) (8c3a286)

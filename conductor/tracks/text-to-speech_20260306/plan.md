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
- [ ] Task: Update the generated Connect RPC client for the frontend.
- [ ] Task: Add a `generateAudio` function to `frontend/src/api/narrative.ts` to call the new RPC.
- [ ] Task: Write failing tests for the `generateAudio` API call.
- [ ] Task: Verify the implementation passes all tests.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Frontend Service Layer' (Protocol in workflow.md)

## Phase 3: Frontend Integration & State Management
- [ ] Task: Update the `useAdventure` hook to store and update audio data for segments.
    - [ ] Update the `AdventureSegment` type in `frontend/src/components/AdventureFeed.tsx` to include `audioData`.
    - [ ] Add an `updateSegmentAudio` function to the `useAdventure` hook.
- [ ] Task: Add a global `isAudioEnabled` state to the UI to toggle TTS.
    - [ ] Store this state in a suitable location (e.g., `App.tsx` or a context provider).
- [ ] Task: Write failing tests for the updated `useAdventure` hook and audio state.
- [ ] Task: Verify the implementation passes all tests.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Frontend Integration & State Management' (Protocol in workflow.md)

## Phase 4: UI Components & Playback Logic
- [ ] Task: Add a "Text-to-Speech" global toggle to the UI.
    - [ ] Place the toggle in an accessible location (e.g., in a settings section or near the prompt input).
- [ ] Task: Implement audio playback logic in the frontend.
    - [ ] Create a utility function or component for handling audio playback from bytes (Base64).
    - [ ] Trigger audio fetching and playback when a new narrative segment is added and TTS is enabled.
- [ ] Task: Write failing tests for the UI components and playback triggers.
- [ ] Task: Verify the implementation passes all tests.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: UI Components & Playback Logic' (Protocol in workflow.md)

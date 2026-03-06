# Implementation Plan - Player Camera Integration

## Phase 1: Proto and Backend Updates

### Task: Update Proto Definitions
- [x] Update `proto/narrative.proto` to include an optional field for the player's photo (Base64 string). f45184c
- [x] Generate Go and TypeScript code from the updated proto. f45184c
- [x] Task: Conductor - User Manual Verification 'Update Proto Definitions' (Protocol in workflow.md) f45184c

### Task: Backend Narrative Service Update
- [x] **Red Phase:** Write failing tests in `internal/service/narrative_test.go` to verify that the photo is received and included in the image generation prompt. 198090e
- [x] **Green Phase:** Implement the logic in `internal/service/narrative.go` to parse the photo from the RPC request. 198090e
- [x] **Green Phase:** Update the image generation prompt to include the player photo and the realism keywords. 198090e
- [x] **Refactor:** Clean up the prompt construction logic. 198090e
- [x] Verify coverage (>80%) for new code. 198090e
- [x] Task: Conductor - User Manual Verification 'Backend Narrative Service Update' (Protocol in workflow.md) 198090e

## Phase 2: Frontend Implementation

### Task: Create Camera Component
- [x] **Red Phase:** Write failing tests in `frontend/src/test/CameraComponent.test.tsx` for a new `CameraComponent`. d41261f
- [x] **Green Phase:** Implement `CameraComponent` using the browser's MediaDevices API. d41261f
- [x] **Green Phase:** Add functionality to capture a photo and convert it to Base64. d41261f
- [x] Verify coverage (>80%) for new code. d41261f
- [x] Task: Conductor - User Manual Verification 'Create Camera Component' (Protocol in workflow.md) d41261f

### Task: Integrate Camera into Main UI
- [ ] **Red Phase:** Update `frontend/src/test/App.test.tsx` to verify the presence of the camera expandable card.
- [ ] **Green Phase:** Implement the expandable card in `frontend/src/App.tsx` or a new component.
- [ ] **Green Phase:** Connect the `CameraComponent` to the main application state.
- [ ] **Green Phase:** Update `frontend/src/api/narrative.ts` to include the photo in the RPC request.
- [ ] Verify coverage (>80%) for new code.
- [ ] Task: Conductor - User Manual Verification 'Integrate Camera into Main UI' (Protocol in workflow.md)

### Task: Final Polish and Realism Check
- [ ] Verify the "realistic" style of generated images with the captured photo.
- [ ] Ensure smooth transitions and error handling for camera access.
- [ ] Task: Conductor - User Manual Verification 'Final Polish and Realism Check' (Protocol in workflow.md)

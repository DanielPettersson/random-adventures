# Implementation Plan: Narrative Prompt Improvement

## Phase 1: Core Interface Update [checkpoint: 94c1e8d]
Update the communication layer to support structured system instructions for the Gemini model.

- [x] Task: Update `GeminiClient` interface in `internal/service/narrative.go` to support system instructions. 512a4cd
- [x] Task: Update `realGeminiClient` to utilize the `SystemInstruction` parameter in `genai.GenerateContentConfig`. 512a4cd
- [x] Task: Update all mocks and integration tests (`internal/service/narrative_test.go`, `cmd/server/integration_test.go`) to match the new interface. 512a4cd
- [x] Task: Conductor - User Manual Verification 'Phase 1: Core Interface Update' (Protocol in workflow.md) 94c1e8d

## Phase 2: Narrative Prompt Implementation (TDD)
Refactor the narrative generation logic to meet the new style and constraint requirements.

- [ ] Task: Write failing unit tests in `internal/service/narrative_test.go` to verify the new prompt structure and system instruction content.
- [ ] Task: Refactor `NarrativeService.GenerateNarrative` to construct the system instruction (style, character limit, mandatory question) and user prompt.
- [ ] Task: Ensure historical context and narrative tone are correctly integrated into the system instructions.
- [ ] Task: Verify that tests pass with the new structured prompt logic.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Narrative Prompt Implementation (TDD)' (Protocol in workflow.md)

## Phase 3: Quality Assurance & Finalization
Ensure the changes are stable, meet performance standards, and align with the user experience vision.

- [ ] Task: Run full suite of automated tests (`go test ./...`) and verify >80% code coverage for changed files.
- [ ] Task: Perform manual validation of the generated narrative quality (Impactful style, length constraint, concluding question).
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Quality Assurance & Finalization' (Protocol in workflow.md)

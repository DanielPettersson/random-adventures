# Specification: Narrative Prompt Improvement

## Overview
Improve the Gemini model's narrative generation to produce more concise, impactful storytelling that always drives player engagement through a mandatory closing question.

## Functional Requirements
- **Prompt Structure:** Refactor the narrative generation logic to use a distinct System Instruction set for Gemini.
- **Narrative Style:** The AI should produce direct and impactful narrative text, avoiding excessive exposition.
- **Output Constraints:**
    - The narrative segment should be limited to approximately 600-700 characters (equivalent to ~10 lines of text).
    - Every narrative segment MUST conclude with a question that forces the player to make a choice to continue the story.
    - The closing question can be open-ended or offer specific contextual choices based on the narrative state.
- **Context Management:** Ensure the narrative tone and historical context are correctly integrated into the new system instruction format.

## Acceptance Criteria
- [x] Narrative segments are consistently under 700 characters.
- [x] Every AI response ends with a question.
- [x] Narrative style is significantly more direct and impactful.
- [x] Tests verify the new prompt structure and response format.
- [x] The system instruction format is correctly implemented in `internal/service/narrative.go`.

## Out of Scope
- Changing the image generation prompt or constraints.
- Modifying the frontend UI (other than what's already done).

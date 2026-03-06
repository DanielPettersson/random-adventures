# Specification: Create the UI for the Adventure Game

## Overview
This track focuses on building a modern web frontend for the "random-adventures" game. The UI will allow players to select a narrative tone, start a new AI-generated adventure, and interact with the story using text prompts. Each narrative segment will be accompanied by an AI-generated image.

## Functional Requirements
- **Tone Selection:** A screen to choose from at least three narrative tones (e.g., Dark, Humorous, Epic).
- **Adventure Feed:** A scrollable area displaying narrative text paired with AI-generated images.
- **Prompt Input:** A text input and "Submit" button for the player to influence the story.
- **Narrative Flow:**
    - Sending a tone selection triggers the initial story generation.
    - Subsequent prompts generate new narrative segments and images.
- **Parallel Loading:** Narrative text should appear immediately, with a placeholder shown while the image is being generated.
- **State Management:**
    - Maintain a local history of the adventure.
    - Provide a way to reset the session and start a new adventure.

## Non-Functional Requirements
- **Desktop-Focused:** The UI will be optimized for desktop browsers.
- **Responsive Design:** Basic adjustments for different screen sizes.
- **UX First:** Intuitive and immersive interface.

## Acceptance Criteria
- [ ] User can select a tone and start a new adventure.
- [ ] Narrative text is displayed correctly in the feed.
- [ ] AI-generated images are displayed alongside their matching narrative segments.
- [ ] User can input a prompt and receive a new story segment.
- [ ] A "Reset" button clears the history and returns the user to the tone selection screen.

## Out of Scope
- User accounts and server-side persistence (to be implemented in a future track).
- Advanced mobile optimizations (touch gestures beyond basic scrolling).

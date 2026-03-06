# Track Specification: Text-to-Speech Generation

## Overview
Add Text-to-Speech (TTS) capabilities to the adventure game. When a new narrative segment is generated, the frontend will optionally request an audio version of the text and play it automatically if configured.

## Functional Requirements
1. **Backend TTS Generation:**
   - Update `proto/narrative.proto` to include a new `GenerateAudio` RPC.
   - Implement the `GenerateAudio` RPC in the Go backend using the Gemini API's speech generation capabilities (as described in https://ai.google.dev/gemini-api/docs/speech-generation).
   - The RPC should return the audio data as bytes.
2. **Frontend Audio Management:**
   - Update the narrative API client to support `generateAudio`.
   - Update the `useAdventure` hook to store and update audio data for narrative segments.
   - Implement a "Text-to-Speech" global toggle in the UI.
   - If TTS is enabled, fetch and play audio when a new narrative segment is added.
3. **UI/UX:**
   - Visual indicator when audio is playing (optional but recommended).
   - Global toggle to enable/disable TTS auto-play.
   - Ensure the audio playback is optional and controllable.

## Non-Functional Requirements
- **Performance:** Audio generation should be responsive to maintain immersion.
- **Usability:** The UI toggle should be easily accessible.

## Acceptance Criteria
- [ ] New `GenerateAudio` RPC is defined and implemented.
- [ ] Backend correctly calls Gemini API for speech generation.
- [ ] Frontend fetches audio data from the backend when enabled.
- [ ] UI includes a global toggle to enable/disable TTS.
- [ ] Narrative text is automatically spoken when TTS is enabled.

## Out of Scope
- Voice customization (selecting different voices).
- Fine-grained playback controls (seek, speed, etc.) per segment beyond basic play/pause if implemented.

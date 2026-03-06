# Track: Player Camera Integration

## Overview
This feature allows players to take a picture of themselves when starting a new adventure. This photo will be used as a visual reference for the AI-generated images throughout the story, ensuring the protagonist's appearance is consistent with the player's. The generated images will also have a more realistic style.

## Functional Requirements
- **Camera Access:** The frontend must request permission to access the device's web camera.
- **Integrated UI:** A camera preview and capture control will be provided in an expandable card above the narrative input field.
- **Photo Capture:** Users can take a photo, which will be stored locally in the frontend session (client-side only).
- **Optional Feature:** If the device has no camera or the user denies permission, the photo capture step will be skipped, and the UI will handle the protagonist's default appearance.
- **RPC Transmission:** The captured photo will be sent as a Base64-encoded string in every image generation RPC request to the backend.
- **Prompt Injection:** The backend will include the player's photo as an input to the Gemini image generation model.
- **Prompt Content:**
    - Explicitly state: "The person in the attached photo is the protagonist."
    - Include realism keywords: "photorealistic", "vibrant", "cinematic", "dramatic".
- **Realistic Style:** Ensure the image generation model (Gemini 3.1 Flash Image Preview) is configured or prompted to produce more realistic images.

## Non-Functional Requirements
- **Privacy:** Photos are only stored in the client's session and not persisted on the server beyond the request processing.
- **Latency:** Capture and encoding should be efficient to avoid slowing down the user experience.

## Acceptance Criteria
- [ ] User can see a camera preview in the expandable card.
- [ ] User can capture a photo and see a preview of the captured image.
- [ ] Captured photo is sent to the backend with narrative/image requests.
- [ ] Generated images for the adventure segments feature a character resembling the player in the photo.
- [ ] Generated images exhibit a "photorealistic", "vibrant", "cinematic", and "dramatic" style.
- [ ] The app remains functional if camera access is unavailable or denied.

## Out of Scope
- Server-side persistence of player photos.
- Real-time video processing during the adventure.
- Post-processing of captured photos (filters, cropping, etc.) beyond basic resizing if needed for model limits.

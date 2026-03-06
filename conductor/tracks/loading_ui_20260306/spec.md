# Specification: Flashy Loading Progress UI

## Overview
This track adds a "flashy" and immersive loading experience to the adventure game. Instead of simple text or a blank screen, players will see skeleton screens and dynamic, atmospheric loading messages while waiting for AI-generated content.

## Functional Requirements
- **Skeleton Screen:**
    - Display a skeleton component that mimics the shape of a narrative segment (text block + image block).
    - Use a pulsed animation effect on the skeleton blocks.
- **Dynamic Messages:**
    - Cycle through a set of atmospheric messages while loading (e.g., "Consulting the Oracle...", "Dreaming of distant lands...", "Weaving the threads of fate...").
    - The message should change every few seconds.
- **Visual Effects:**
    - Add a subtle "magical" glow or pulsed border to the loading component.
- **Loading Logic:**
    - The loading UI should appear as soon as a prompt is submitted.
    - The narrative text part of the skeleton is replaced once the text is received.
    - The image part of the skeleton remains (with a specific image placeholder) until the image is received.
- **Interaction:**
    - Disable the "Send" button while a narrative generation is in progress.
    - Allow the user to type in the input field while the image is still loading (if the text has already arrived).

## Non-Functional Requirements
- **Smooth Transitions:** High-quality CSS animations for appearing and disappearing elements.
- **Immersive:** Tone should match the "Dark/Fantasy" theme of the app.

## Acceptance Criteria
- [ ] Submitting a prompt immediately shows a pulse-animated skeleton screen.
- [ ] Loading messages cycle and are clearly visible.
- [ ] Narrative text replaces the text skeleton immediately upon arrival.
- [ ] Image skeleton continues to pulse until the image arrives.
- [ ] User can't send multiple prompts simultaneously.

## Out of Scope
- Real-time progress bars (since we don't have progress percentages from the backend).
- Audio cues or sound effects.

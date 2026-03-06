# Tech Stack

## Programming Language & Core Frameworks
- **Language:** Go (v1.26) for a high-performance and scalable backend.
- **Backend Communication:** gRPC and Protocol Buffers (`google.golang.org/grpc`, `google.golang.org/protobuf`) for structured and efficient communication.
- **AI Integration:** Google GenAI for Go (`google.golang.org/genai`) to power the game's narrative and image generation.
  - **Narrative Model:** `gemini-3.0-flash-preview`
  - **Image Model:** `gemini-3.1-flash-image-preview`

## Web Frontend (Planned)
- **Framework:** React with TypeScript for a modern, component-based, and type-safe user interface.
- **Styling:** Vanilla CSS or Styled Components for maximum flexibility and custom animations.
- **State Management:** React Context API or Redux Toolkit for managing the game's state and narrative flow.

## Database & Persistence (Suggested)
- **Database:** PostgreSQL for robust and structured storage of player profiles, game history, and model configurations.
- **Caching:** Redis for fast retrieval of transient game state or session data.

## Deployment & Infrastructure (Planned)
- **Containerization:** Docker for consistent development and deployment environments.
- **Hosting:** Cloud platforms (e.g., Google Cloud Run or AWS ECS) for hosting the containerized Go backend and the React frontend.

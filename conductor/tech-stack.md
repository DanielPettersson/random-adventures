# Tech Stack

## Programming Language & Core Frameworks
- **Language:** Go (v1.26) for a high-performance and scalable backend.
- **Backend Communication:** Connect RPC (gRPC compatible) and Protocol Buffers for seamless web and mobile support.
- **AI Integration:** Google GenAI for Go (`google.golang.org/genai`) to power the game's narrative and image generation.
  - **Narrative Model:** `gemini-3-flash-preview`
  - **Image Model:** `gemini-3.1-flash-image-preview`

## Web Frontend
- **Framework:** React with TypeScript (Vite) for a modern, component-based, and type-safe user interface.
- **Styling:** Vanilla CSS for maximum flexibility and custom animations.
- **Communication:** Connect RPC Web for direct browser-to-backend communication.
- **Testing:** Vitest and React Testing Library for robust component and API testing.

## Database & Persistence (Suggested)
- **Database:** PostgreSQL for robust and structured storage of player profiles, game history, and model configurations.
- **Caching:** Redis for fast retrieval of transient game state or session data.

## Deployment & Infrastructure (Planned)
- **Containerization:** Docker for consistent development and deployment environments.
- **Hosting:** Cloud platforms (e.g., Google Cloud Run or AWS ECS) for hosting the containerized Go backend and the React frontend.
- **Middleware:** CORS (rs/cors) for secure cross-origin requests from the frontend.

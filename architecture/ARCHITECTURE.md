# LegacyBridge ULTRA — Architecture

## Data Flow
React Frontend
  → WebSocket (wss://)
  → FastAPI on Cloud Run
  → Gemini Live API (gemini-2.0-flash-live-001)
     ├── Audio stream (PCM 16kHz Int16)
     ├── Video stream (JPEG 1fps)
     └── Tool calls → ADK Executor
          ├── observe_screen() → pyautogui + Gemini vision
          ├── map_fields() → Firestore storage
          ├── execute_migration() → pyautogui actions
          └── generate_training_video() → Storyteller
               ├── Gemini interleaved output
               ├── Imagen 3 diagrams
               └── Google TTS → Cloud Storage

## GCP Services
- Cloud Run: Backend container hosting
- Firestore: Migration state, field mappings, logs
- Cloud Storage: Training videos, screenshots
- Vertex AI / Gemini: Live API, Imagen 3
- Text-to-Speech: Multilingual narration

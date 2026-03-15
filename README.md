# LegacyBridge ULTRA

## Description
A fast multimodal live mapping agent using Gemini 2.0 Flash Live. Built for the Gemini Live API Hackathon.

## 🚀 One-Command Quick Start
You can run the entire application (Backend + Frontend) with a single command! It will automatically ask you for your Google API Key and set everything up.

```bash
chmod +x start.sh
./start.sh
```

## How to run locally (Manual Setup)
If you prefer to run things manually:

**1. Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY 
pip install -r requirements.txt
uvicorn main:app --port 8080
```

**2. Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Security & API Keys
We use a `.env` file to securely store your `GOOGLE_API_KEY` and Google Cloud credentials. 
- A `.env.example` file is provided in the repository. 
- The actual `.env` file is excluded from git via `.gitignore` so your keys are **never** accidentally pushed to GitHub.
- If you use the `./start.sh` script, it will securely prompt you for your keys and create the `.env` file locally for you.

## GCP Services
- Cloud Run (Hosting)
- Firestore (Logging, Proof of Work)
- Cloud Storage (Generated Storyteller Assets)
- Vertex AI (Live Agent Multimodal Models)
- Text-to-Speech

## Architecture
See `architecture/ARCHITECTURE.md`

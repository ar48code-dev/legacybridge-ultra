#!/bin/bash

echo "============================================="
echo "      🚀 Starting LegacyBridge ULTRA 🚀      "
echo "============================================="

# Ask for API keys if not set in environment or .env
if [ ! -f "backend/.env" ]; then
    echo "No .env file found in backend. Let's create one."
    
    read -p "🔑 Enter your GOOGLE_API_KEY (from Google AI Studio): " api_key
    read -p "☁️ Enter your GOOGLE_CLOUD_PROJECT ID: " project_id
    
    echo "GOOGLE_API_KEY=$api_key" > backend/.env
    echo "GOOGLE_CLOUD_PROJECT=$project_id" >> backend/.env
    echo "GREEN_MODE=false" >> backend/.env
    echo "GCS_BUCKET=legacybridge-training-videos" >> backend/.env
    echo "DISPLAY=:99" >> backend/.env
    echo "VITE_WS_URL=ws://localhost:8080" >> backend/.env
    echo "✅ .env file created successfully in backend/.env"
fi

# Start Backend
echo "📦 Setting up Backend..."
cd backend
# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1
echo "🔄 Starting FastAPI Backend on port 8080..."
# Load env variables from .env
set -a
source .env
set +a
uvicorn main:app --host 0.0.0.0 --port 8080 &
BACKEND_PID=$!
cd ..

# Start Frontend
echo "💻 Setting up Frontend..."
cd frontend
npm install > /dev/null 2>&1
echo "✨ Starting React Frontend..."
npm run dev &
FRONTEND_PID=$!
cd ..

echo "============================================="
echo "✅ Everything is running!"
echo "➡️ Backend API: http://localhost:8080"
echo "➡️ Frontend UI: http://localhost:5173 (check your terminal for exact local Vite URL)"
echo "Press Ctrl+C to stop both servers."
echo "============================================="

# Wait for process exit
trap "echo 'Stopping servers...'; kill $BACKEND_PID; kill $FRONTEND_PID; exit" INT
wait

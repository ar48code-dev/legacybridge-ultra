#!/bin/bash

# LegacyBridge ULTRA - One Command Startup
echo "============================================="
echo "      🚀 Initializing LegacyBridge ULTRA     "
echo "============================================="

# 1. Normalize directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

# 2. Check for .env and setup
if [ ! -f "backend/.env" ]; then
    echo "🔍 First time setup: Creating configuration..."
    read -p "🔑 Enter your GOOGLE_API_KEY: " api_key
    read -p "☁️ Enter your GOOGLE_CLOUD_PROJECT ID: " project_id
    
    echo "GOOGLE_API_KEY=$api_key" > backend/.env
    echo "GOOGLE_CLOUD_PROJECT=$project_id" >> backend/.env
    echo "GREEN_MODE=false" >> backend/.env
    echo "GCS_BUCKET=legacybridge-training-videos" >> backend/.env
    [ ! -z "$DISPLAY" ] && echo "DISPLAY=$DISPLAY" >> backend/.env
    echo "VITE_WS_URL=ws://localhost:8080" >> backend/.env
else
    # Auto-fix DISPLAY if user is on local desktop
    if [ ! -z "$DISPLAY" ] && ! grep -q "DISPLAY=$DISPLAY" backend/.env; then
        sed -i "/DISPLAY=/d" backend/.env
        echo "DISPLAY=$DISPLAY" >> backend/.env
    fi
fi

# 3. Clean up ports
lsof -ti:8080 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null

# 4. Check Dependencies
echo "📦 Checking Dependencies..."
cd backend
if [ ! -d "venv" ] && [ -f "requirements.txt" ]; then
    pip install -r ../requirements.txt 2>/dev/null | grep -v "already satisfied"
fi
cd ..

cd frontend
if [ ! -d "node_modules" ]; then
    echo "⏳ Initial npm install (this may take a minute)..."
    npm install --legacy-peer-deps
fi
cd ..

# 5. Start Backend
echo "🚀 Starting Backend (API)..."
cd backend
python3 -m uvicorn main:app --host 0.0.0.0 --port 8080 --log-level error &
BACKEND_PID=$!
cd ..

# 6. Start Frontend
echo "💻 Starting Frontend (UI)..."
cd frontend
npm run dev -- --logLevel silent &
FRONTEND_PID=$!
cd ..

# 7. Final Polish
echo "============================================="
echo "🎉 SUCCESS: LegacyBridge ULTRA is running!"
echo "============================================="
echo "🌍 Waiting for UI to be ready..."

# Function to check if server is up
wait_for_server() {
  local url=$1
  local max_attempts=20
  local attempt=1
  while [ $attempt -le $max_attempts ]; do
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
      return 0
    fi
    sleep 1
    attempt=$((attempt + 1))
  done
  return 1
}

if wait_for_server "http://localhost:5173"; then
    echo "✨ Dashboard is ready! Opening browser..."
    if command -v xdg-open > /dev/null; then
        xdg-open http://localhost:5173 > /dev/null 2>&1
    elif command -v open > /dev/null; then
        open http://localhost:5173 > /dev/null 2>&1
    fi
else
    echo "⚠️  UI is taking longer than expected. Please open manually: http://localhost:5173"
fi

echo "➡️  Frontend: http://localhost:5173"
echo "➡️  Backend:  http://localhost:8080"
echo "============================================="
echo "💡 To stop, press Ctrl+C"
echo "============================================="

# Wait and handle shutdown
trap "echo ''; echo '🛑 Stopping services...'; kill $BACKEND_PID; kill $FRONTEND_PID; exit" INT
wait


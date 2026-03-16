#!/bin/bash
# LegacyBridge ULTRA - One Command Startup
# Gemini Live Agent Challenge 2026
echo "============================================="
echo "      🚀 Initializing LegacyBridge ULTRA     "
echo "============================================="

# 1. Normalize directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

# ── NEW: Auto-install system deps on Linux ────────────────────
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if command -v apt-get &> /dev/null; then
        echo "📦 Installing system dependencies (tkinter, xvfb, scrot)..."
        sudo apt-get install -y python3-tk python3-dev xvfb scrot \
            x11-utils 2>/dev/null | grep -v "already installed" || true
    fi
fi

# ── NEW: Start virtual display on Linux (needed for PyAutoGUI) ─
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if command -v Xvfb &> /dev/null; then
        pkill Xvfb 2>/dev/null || true
        Xvfb :99 -screen 0 1920x1080x24 &
        export DISPLAY=:99
        echo "✅ Virtual display started (DISPLAY=:99)"
    elif [ -z "$DISPLAY" ]; then
        export DISPLAY=:0
        echo "⚠️  Xvfb not found — using DISPLAY=:0"
    fi
fi

# 2. Setup environment
if [ ! -f "backend/.env" ]; then
    echo "📄 Creating basic backend/.env"
    echo "GREEN_MODE=false" > backend/.env
    echo "GCS_BUCKET=legacybridge-training-videos" >> backend/.env
    echo "VITE_WS_URL=ws://localhost:8080" >> backend/.env
fi

# Auto-fix DISPLAY in .env
if [ ! -z "$DISPLAY" ] && ! grep -q "DISPLAY=$DISPLAY" backend/.env; then
    sed -i "/DISPLAY=/d" backend/.env 2>/dev/null
    echo "DISPLAY=$DISPLAY" >> backend/.env
fi

# ── NEW: Prompt for API key if not set ───────────────────────
EXISTING_KEY=$(grep "GOOGLE_API_KEY=" backend/.env 2>/dev/null | cut -d'=' -f2 | tr -d '"')
if [ -z "$EXISTING_KEY" ]; then
    echo ""
    echo "============================================="
    echo "  🔑 API Key Setup"
    echo "  Get free key: aistudio.google.com"
    echo "============================================="
    read -p "  Google AI Studio API Key (AIzaSy...): " USER_API_KEY
    read -p "  GCP Project ID (gen-lang-client-...): " USER_PROJECT_ID
    echo "GOOGLE_API_KEY=${USER_API_KEY}" >> backend/.env
    echo "GCP_PROJECT_ID=${USER_PROJECT_ID}" >> backend/.env
    echo "✅ API keys saved!"
else
    echo "✅ API keys already configured"
fi

# Export keys for this session
export GOOGLE_API_KEY=$(grep "GOOGLE_API_KEY=" backend/.env | cut -d'=' -f2)
export GCP_PROJECT_ID=$(grep "GCP_PROJECT_ID=" backend/.env | cut -d'=' -f2)

# 3. Clean up ports
echo "🧹 Cleaning up ports 8080 and 5173..."
lsof -ti:8080 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
sleep 1

# 4. Check Dependencies
echo "📦 Checking Python dependencies..."
cd backend
pip install -r ../requirements.txt 2>/dev/null | grep -v "already satisfied" || \
pip install fastapi uvicorn websockets google-genai pyautogui pillow python-dotenv 2>/dev/null
cd ..

echo "📦 Checking Node dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "⏳ Initial npm install (this may take a minute)..."
    npm install --legacy-peer-deps
else
    echo "✅ node_modules already present"
fi
cd ..

# 5. Start Backend
echo "🚀 Starting Backend (API) on port 8080..."
cd backend
python3 -m uvicorn main:app --host 0.0.0.0 --port 8080 --log-level error &
BACKEND_PID=$!
cd ..

# ── NEW: Wait for backend health check ───────────────────────
echo "⏳ Waiting for backend to be ready..."
for i in {1..15}; do
    if curl -s http://localhost:8080/health > /dev/null 2>&1 || \
       curl -s http://localhost:8080/ > /dev/null 2>&1; then
        echo "✅ Backend is ready!"
        break
    fi
    sleep 1
    echo -n "."
done
echo ""

# 6. Start Frontend
echo "💻 Starting Frontend (UI) on port 5173..."
cd frontend
npm run dev -- --logLevel silent &
FRONTEND_PID=$!
cd ..

# 7. Final Polish
echo "============================================="
echo "🎉 SUCCESS: LegacyBridge ULTRA is running!"
echo "============================================="
echo "🌍 Waiting for UI to be ready..."

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
    echo "⚠️  Please open manually: http://localhost:5173"
fi

echo "➡️  Frontend:  http://localhost:5173"
echo "➡️  Backend:   http://localhost:8080"
echo "➡️  API Docs:  http://localhost:8080/docs"
echo "============================================="
echo "💡 To stop: press Ctrl+C"
echo "============================================="

# Shutdown handler
trap "echo ''; echo '🛑 Stopping services...'; kill $BACKEND_PID 2>/dev/null; kill $FRONTEND_PID 2>/dev/null; pkill Xvfb 2>/dev/null; exit 0" INT TERM
wait

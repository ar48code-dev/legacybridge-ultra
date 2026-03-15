FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    scrot \
    xvfb \
    python3-tk \
    x11-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY backend/ /app/backend/
COPY prompts/ /app/prompts/

# Setup the virtual display for GUI automation on Cloud Run headless environment
ENV DISPLAY=:99
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Run Virtual Framebuffer X server in background natively, then start the FastAPI application
CMD Xvfb :99 -screen 0 1920x1080x24 & uvicorn backend.main:app --host 0.0.0.0 --port 8000

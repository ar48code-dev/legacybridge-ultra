from fastapi import FastAPI, WebSocket
from websocket_handler import websocket_endpoint
import os
import logging
from contextlib import asynccontextmanager

logger = logging.getLogger(__name__)

def ensure_gcs_bucket():
    """Create GCS bucket if it does not exist. Called on startup."""
    try:
        from google.cloud import storage
        client = storage.Client()
        bucket_name = "legacybridge-training-videos"
        bucket = client.bucket(bucket_name)
        if not bucket.exists():
            new_bucket = client.create_bucket(bucket_name, location="europe-north1")
            logger.info(f"Created GCS bucket: {bucket_name} in europe-north1")
        else:
            logger.info(f"GCS bucket already exists: {bucket_name}")
    except Exception as e:
        logger.warning(f"Could not verify GCS bucket: {e}")

def init_virtual_display():
    if os.environ.get('DISPLAY') is None:
        os.system("Xvfb :99 -screen 0 1920x1080x24 &")
        os.environ['DISPLAY'] = ':99'

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_virtual_display()
    ensure_gcs_bucket()
    logger.info("LegacyBridge ULTRA backend started")
    yield
    logger.info("LegacyBridge ULTRA backend shutting down")

app = FastAPI(lifespan=lifespan)

@app.websocket("/ws/{session_id}")
async def websocket_route(websocket: WebSocket, session_id: str):
    await websocket_endpoint(websocket, session_id)

@app.get("/health")
async def health():
    return {"status": "ok", "service": "LegacyBridge ULTRA"}

if __name__ == "__main__":
    import uvicorn
    # Use PORT environment variable for Cloud Run integration
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port, workers=1)

import asyncio
import os
import json
import logging
from fastapi import WebSocket
from adk_executor import ADKExecutor
from gemini_live_client import GeminiLiveSession
from storyteller import StorytellerAgent

logger = logging.getLogger(__name__)

class SessionManager:
    def __init__(self):
        self.sessions = {}

    async def create(self, session_data):
        self.sessions[session_data["session_id"]] = session_data

session_mgr = SessionManager()

async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    
    # Tool Definitions matching adk_executor signatures exactly
    adk = ADKExecutor(session_id)
    tool_handler = adk.handle_tool_call
    
    try:
        while True:
            # Continuously receive messages
            data = await websocket.receive_text()
            try:
                msg = json.loads(data)
                msg_type = msg.get("type", "")
                
                if msg_type == "init":
                    # Read green_mode from frontend message first
                    green_mode = msg.get("green_mode", False)
                    
                    # Read dynamic keys from UI if provided
                    ui_api_key = msg.get("google_api_key")
                    ui_project_id = msg.get("google_cloud_project")
                    
                    if ui_api_key:
                        os.environ["GOOGLE_API_KEY"] = ui_api_key
                    if ui_project_id:
                        os.environ["GOOGLE_CLOUD_PROJECT"] = ui_project_id

                    # Fallback to environment variable for green_mode
                    if not green_mode:
                        green_mode = os.environ.get("GREEN_MODE", "false").lower() == "true"
                    
                    logger.info(f"Session {session_id} initialized with UI credentials. Green Mode: {green_mode}")
                    
                    # Store on adk for logging
                    adk.green_mode = green_mode

                    # Initialize Live session
                    live = GeminiLiveSession(session_id, green_mode=green_mode)
                    live_task = asyncio.create_task(live.start(tool_handler))
                    
                    # dummy forward responses task
                    async def forward_live_responses():
                        pass
                        
                    asyncio.create_task(forward_live_responses())
                    
                    await session_mgr.create({"green_mode": green_mode, "session_id": session_id})
                    await websocket.send_json({"type": "ready", "session_id": session_id, "green_mode": green_mode})
                    
                # Interleaved output generation
                elif msg_type == "complete":
                    story = StorytellerAgent(session_id).generate_training_video()
                    await websocket.send_text(json.dumps(story))

            except json.JSONDecodeError:
                pass

    except Exception as e:
        logger.error(f"WebSocket Connection {session_id} closed: {e}")

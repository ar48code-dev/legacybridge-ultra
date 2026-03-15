import asyncio
from google.genai import types
import json

class GeminiLiveSession:
    def __init__(self, session_id, green_mode=False):
        self.session_id = session_id
        self.green_mode = green_mode

    async def start(self, tool_handler):
        pass

def build_live_config():
    tools = [
        types.FunctionDeclaration(
            name="observe_screen",
            description="Tool function to capture the screen and send screenshot to Gemini",
            parameters=types.Schema(type="OBJECT", properties={})
        ),
        types.FunctionDeclaration(
            name="type_into_field",
            description="Tool function to automate keyboard input for data migration.",
            parameters=types.Schema(
                type="OBJECT", 
                properties={"data": types.Schema(type="STRING", description="Text to type")}
            )
        ),
        types.FunctionDeclaration(
            name="execute_migration",
            description="Execute migration step",
            parameters=types.Schema(
                type="OBJECT", 
                properties={"command": types.Schema(type="STRING", description="Command")}
            )
        ),
        types.FunctionDeclaration(
            name="map_fields",
            description="Visually map all fields from the legacy system screen to equivalent fields in the new system. Creates a reusable field mapping stored in Firestore.",
            parameters=types.Schema(
                type="OBJECT",
                properties={
                    "legacy_system": types.Schema(
                        type="STRING",
                        description="Name of legacy system e.g. SAP, Oracle, custom database"
                    ),
                    "new_system": types.Schema(
                        type="STRING",
                        description="Name of new system e.g. Salesforce, HubSpot, Dynamics"
                    ),
                    "workflow_name": types.Schema(
                        type="STRING",
                        description="Name of the workflow being mapped e.g. invoice_creation, customer_record"
                    )
                },
                required=["legacy_system", "new_system", "workflow_name"]
            )
        ),
        types.FunctionDeclaration(
            name="verify_record",
            description="Visually verify a migrated record by taking screenshots of both systems and comparing values using Gemini vision.",
            parameters=types.Schema(
                type="OBJECT",
                properties={
                    "record_id": types.Schema(
                        type="STRING",
                        description="ID or index of the record to verify"
                    ),
                    "expected_values": types.Schema(
                        type="STRING",
                        description="JSON string of expected field name to value pairs"
                    )
                },
                required=["record_id"]
            )
        )
    ]
    return tools

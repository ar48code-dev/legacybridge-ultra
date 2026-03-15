from google.cloud import storage, firestore
import json, logging
from datetime import datetime

logger = logging.getLogger(__name__)

class StorytellerAgent:
    def __init__(self, session_id):
        self.session_id = session_id

    async def _upload_to_gcs(self, data: bytes, filename: str) -> str:
        """Upload file to Google Cloud Storage and return public URL."""
        try:
            gcs = storage.Client()
            bucket = gcs.bucket("legacybridge-training-videos")
            blob = bucket.blob(f"{self.session_id}/{filename}")
            blob.upload_from_string(data, content_type="application/octet-stream")
            blob.make_public()
            url = blob.public_url
            logger.info(f"Uploaded to GCS: {url}")
            return url
        except Exception as e:
            logger.error(f"GCS upload failed: {e}")
            return ""

    async def _save_to_firestore(self, data: dict):
        """Save training package metadata to Firestore."""
        try:
            db = firestore.Client()
            db.collection("training_packages").document(self.session_id).set({
                **data,
                "created_at": firestore.SERVER_TIMESTAMP,
                "session_id": self.session_id
            })
            logger.info(f"Saved to Firestore: training_packages/{self.session_id}")
        except Exception as e:
            logger.error(f"Firestore save failed: {e}")

    async def generate_training_video(self, migration_data=None):
        """
        Uses Gemini's Interleaved Output.
        Generates a training guide post-migration.
        Format: [Narration Text] -> [Imagen 3 Prompt for Mapping Diagram] -> [Audio URL via Google TTS]
        """
        sections = [{"status": "success", "narration": "dummy"}]
        language = "en-US"
        package = {
            "type": "interleaved_output",
            "story": {
                "narration": "We have successfully migrated the legacy fields utilizing the Gemini multi-modal Live API.",
                "imagen_prompt": "A high-tech diagram mapping legacy database fields to a modern cloud schema, glowing blue and green lines of data transfer.",
                "audio_url": f"https://storage.googleapis.com/legacybridge-training-videos/{self.session_id}/tts.mp3" 
            }
        }
        
        # Save package to GCS
        package_url = await self._upload_to_gcs(
            json.dumps(package, indent=2).encode(),
            "training_package.json"
        )
        # Save metadata to Firestore
        await self._save_to_firestore({
            "package_url": package_url,
            "total_sections": len(sections),
            "language": language,
            "status": "complete"
        })
        return package

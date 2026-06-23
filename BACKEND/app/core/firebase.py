import os
import firebase_admin
from firebase_admin import credentials
from app.core.config import settings

def initialize_firebase():
    """
    Initializes the Firebase Admin SDK using the absolute service account file path.
    """
    if not firebase_admin._apps:
        cred_path = settings.firebase_service_account_absolute_path
        if not os.path.exists(cred_path):
            raise FileNotFoundError(
                f"Firebase service account key file not found at: {cred_path}\n"
                f"Please ensure it exists at BACKEND/secrets/serviceAccountKey.json"
            )

        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred, {
            'projectId': settings.FIREBASE_PROJECT_ID
        })

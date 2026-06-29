from google import genai
import os
from typing import List
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

class EmbeddingService:
    def __init__(self):
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            raise ValueError("GEMINI_API_KEY is missing in settings")
        self.client = genai.Client(api_key=api_key)
        self.model = "gemini-embedding-2"
        
    def embed_texts(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of texts."""
        if not texts:
            return []
            
        try:
            embeddings = []
            # Loop over texts as google-genai treats a list of strings as a single multi-part content
            for text in texts:
                result = self.client.models.embed_content(
                    model=self.model,
                    contents=text,
                )
                embeddings.append(result.embeddings[0].values)
            return embeddings
            
        except Exception as e:
            logger.error(f"Failed to generate embeddings: {e}")
            raise e
            
    def embed_query(self, query: str) -> List[float]:
        """Generate embedding for a single query."""
        results = self.embed_texts([query])
        if results and len(results) > 0:
            return results[0]
        return []

embedding_service = EmbeddingService()

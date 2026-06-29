import chromadb
from chromadb.config import Settings
import os
from typing import List, Dict, Any, Optional

DB_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "chroma_db")

class VectorStore:
    def __init__(self, collection_name: str = "nyaay_knowledge"):
        os.makedirs(DB_DIR, exist_ok=True)
        # Initialize ChromaDB client using PersistentClient for local storage
        self.client = chromadb.PersistentClient(path=DB_DIR, settings=Settings(anonymized_telemetry=False))
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"}
        )

    def add_chunks(self, ids: List[str], embeddings: List[List[float]], documents: List[str], metadatas: List[Dict[str, Any]]):
        """Add vectorized chunks to the collection."""
        if not ids:
            return
        
        # Chroma API limits batch size (usually 41666, but we keep it small to be safe)
        batch_size = 500
        for i in range(0, len(ids), batch_size):
            self.collection.upsert(
                ids=ids[i:i + batch_size],
                embeddings=embeddings[i:i + batch_size],
                documents=documents[i:i + batch_size],
                metadatas=metadatas[i:i + batch_size]
            )

    def search(self, query_embedding: List[float], n_results: int = 5, where: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Search for the most similar chunks."""
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            where=where,
            include=["documents", "metadatas", "distances"]
        )
        
        # Format results
        formatted_results = []
        if results and results["ids"] and len(results["ids"]) > 0:
            for i in range(len(results["ids"][0])):
                formatted_results.append({
                    "id": results["ids"][0][i],
                    "document": results["documents"][0][i],
                    "metadata": results["metadatas"][0][i],
                    "distance": results["distances"][0][i]
                })
        
        return formatted_results
        
    def delete_by_metadata(self, where: Dict[str, Any]):
        """Delete documents matching specific metadata (e.g. document_id)."""
        self.collection.delete(where=where)

# Singleton instance for global access
vector_store = VectorStore()

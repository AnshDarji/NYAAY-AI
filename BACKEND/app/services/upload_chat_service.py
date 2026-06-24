import json
import re
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.document import Document
from app.schemas.upload_chat import ChatQueryRequest, ChatQueryResponse
from app.core.config import settings
from google import genai
from google.genai import types

class UploadChatService:
    def __init__(self):
        api_key = settings.GEMINI_API_KEY or "DUMMY_KEY_FOR_TESTING"
        self.client = genai.Client(api_key=api_key)

    def query(self, request: ChatQueryRequest, db: Session, user_uid: str) -> ChatQueryResponse:
        # 1. Fetch Document
        doc = db.query(Document).filter(Document.id == request.document_id, Document.user_uid == user_uid).first()
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found or access denied.")
            
        if not doc.extracted_text:
            raise HTTPException(status_code=400, detail="Document contains no text.")

        # 2. Simple Keyword Filtering (Chunking by paragraph)
        chunks = [p.strip() for p in doc.extracted_text.split('\n') if len(p.strip()) > 30]
        
        # If the document is small enough, just send the whole thing (approx 50 pages)
        if len(doc.extracted_text) < 100000:
            relevant_text = doc.extracted_text
        else:
            relevant_text = self._filter_chunks(request.question, chunks)
            
        # 3. Prompt Gemini
        system_instruction = """You are NYAAY AI, a legal assistant for the Indian Judiciary Ecosystem.
Your task is to answer the user's question STRICTLY using the provided document content.

Rules:
1. Answer ONLY using the uploaded document content.
2. If the answer cannot be found in the provided text, explicitly say "The document does not contain information to answer this question."
3. Do not invent information or use outside knowledge.
4. Summarize before providing a detailed explanation.
5. State uncertainty when the document is unclear.
6. Use Markdown formatting for your detailed answer! Use bold text (**like this**) for emphasis on important clauses or deadlines. Use bullet points or numbered lists to break down complex legal jargon into scannable points.

You MUST respond strictly in the following JSON format:
{
    "answer": "Detailed, highly structured Markdown explanation based ONLY on the document",
    "summary": "A short one-to-two sentence summary",
    "confidence": "High, Medium, or Low"
}"""
        
        prompt = f"Document Content:\n{relevant_text}\n\nUser Question:\n{request.question}"
        
        try:
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    response_mime_type="application/json",
                ),
            )
            response_json = json.loads(response.text)
            return ChatQueryResponse(**response_json)
        except Exception as e:
            return ChatQueryResponse(
                answer="I encountered an error while processing your request. Please try again.",
                summary="Error processing request.",
                confidence="Low"
            )

    def _filter_chunks(self, question: str, chunks: list[str]) -> str:
        # Very basic stop word removal
        stop_words = {"what", "are", "is", "the", "a", "an", "of", "and", "in", "to", "for", "with", "on", "my", "this", "can", "do", "does", "how", "why", "where"}
        words = re.findall(r'\b\w+\b', question.lower())
        keywords = [w for w in words if w not in stop_words and len(w) > 2]
        
        if not keywords:
            # Fallback to returning beginning and end if no keywords
            return "\n\n".join(chunks[:10] + chunks[-10:])
            
        # Score chunks based on keyword hits
        scored_chunks = []
        for chunk in chunks:
            chunk_lower = chunk.lower()
            score = sum(1 for kw in keywords if kw in chunk_lower)
            if score > 0:
                scored_chunks.append((score, chunk))
                
        # Sort by score descending
        scored_chunks.sort(key=lambda x: x[0], reverse=True)
        
        # Take top 30 chunks
        top_chunks = [c[1] for c in scored_chunks[:30]]
        
        if not top_chunks:
            # Fallback
            return "\n\n".join(chunks[:20])
            
        return "\n\n".join(top_chunks)

upload_chat_service = UploadChatService()

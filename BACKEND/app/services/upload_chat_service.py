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
        from app.models.chat import Conversation, Message, FeatureType, MessageRole
        import json
        
        # 1. Fetch Document
        doc = db.query(Document).filter(Document.id == request.document_id, Document.user_uid == user_uid).first()
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found or access denied.")
            
        if not doc.extracted_text:
            raise HTTPException(status_code=400, detail="Document contains no text.")

        # 2. Simple Keyword Filtering (Chunking by paragraph)
        chunks = [p.strip() for p in doc.extracted_text.split('\n') if len(p.strip()) > 30]
        
        if len(doc.extracted_text) < 100000:
            relevant_text = doc.extracted_text
        else:
            relevant_text = self._filter_chunks(request.question, chunks)
            
        # 3. Conversation Persistence
        conversation = None
        gemini_history = []
        
        if request.conversation_id:
            conversation = db.query(Conversation).filter(
                Conversation.id == request.conversation_id,
                Conversation.user_id == user_uid
            ).first()
            if conversation:
                for msg in conversation.messages:
                    if msg.role == MessageRole.user:
                        gemini_history.append({"role": "user", "parts": [{"text": msg.content}]})
                    else:
                        gemini_history.append({"role": "model", "parts": [{"text": msg.content}]})
                        
        if not conversation:
            title = request.question[:60]
            conversation = Conversation(
                user_id=user_uid,
                title=title,
                feature_type=FeatureType.upload_chat,
                document_id=request.document_id
            )
            db.add(conversation)
            db.commit()
            db.refresh(conversation)

        # Save User Message
        user_msg = Message(
            conversation_id=conversation.id,
            role=MessageRole.user,
            content=request.question
        )
        db.add(user_msg)
        db.commit()

        # 4. Prompt Gemini
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
        
        current_prompt = f"Document Content:\n{relevant_text}\n\nUser Question:\n{request.question}"
        gemini_history.append({"role": "user", "parts": [{"text": current_prompt}]})
        
        import time
        import logging
        import concurrent.futures
        logger = logging.getLogger(__name__)
        
        max_retries = 4
        response = None
        last_exception = None
        # Models to try in order of preference (restored gemini-2.5-flash as primary)
        models_to_try = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest', 'gemini-flash-lite-latest']
        
        try:
            for attempt in range(max_retries):
                model_name = models_to_try[attempt % len(models_to_try)]
                try:
                    logger.info(f"Attempting to generate content with model: {model_name}")
                    
                    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                        future = executor.submit(
                            self.client.models.generate_content,
                            model=model_name,
                            contents=gemini_history,
                            config=types.GenerateContentConfig(
                                system_instruction=system_instruction,
                                response_mime_type="application/json",
                            ),
                        )
                        response = future.result(timeout=15)
                    break
                except concurrent.futures.TimeoutError as e:
                    last_exception = e
                    logger.warning(f"Model {model_name} timed out after 15 seconds.")
                    if attempt < max_retries - 1:
                        continue
                    raise e
                except Exception as e:
                    last_exception = e
                    logger.warning(f"Model {model_name} failed with error: {str(e)}")
                    # Continue to the next fallback model on ANY API exception (404, 429, 503, etc.)
                    if attempt < max_retries - 1:
                        time.sleep(2 ** attempt)
                        continue
                    logger.error(f"All {max_retries} attempts failed. Last exception: {str(e)}")
                    raise e
                    
            if not response:
                raise last_exception
                
            response_json = json.loads(response.text)
            
            # Save Assistant Message
            assistant_msg = Message(
                conversation_id=conversation.id,
                role=MessageRole.assistant,
                content=json.dumps(response_json)
            )
            db.add(assistant_msg)
            db.commit()
            
            return ChatQueryResponse(conversation_id=conversation.id, **response_json)
        except Exception as e:
            fallback_json = {
                "answer": "I encountered an error while processing your request. Please try again.",
                "summary": "Error processing request.",
                "confidence": "Low"
            }
            assistant_msg = Message(
                conversation_id=conversation.id,
                role=MessageRole.assistant,
                content=json.dumps(fallback_json)
            )
            db.add(assistant_msg)
            db.commit()
            return ChatQueryResponse(conversation_id=conversation.id, **fallback_json)

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

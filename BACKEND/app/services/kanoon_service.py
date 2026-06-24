import json
from google import genai
from google.genai import types
from app.core.config import settings
from app.schemas.kanoon import KanoonQueryRequest, KanoonQueryResponse
from sqlalchemy.orm import Session

class KanoonService:
    def __init__(self):
        # The genai client will automatically pick up GEMINI_API_KEY from environment or it can be passed.
        api_key = settings.GEMINI_API_KEY or "DUMMY_KEY_FOR_TESTING"
        self.client = genai.Client(api_key=api_key)
            
    def query(self, request: KanoonQueryRequest, user_id: str, db: Session) -> KanoonQueryResponse:
        from app.models.chat import Conversation, Message, FeatureType, MessageRole
        import json
        
        system_instruction = """You are NYAAY AI, a legal assistant for the Indian Judiciary Ecosystem.
Your goal is to answer legal questions clearly and simply.

Instructions:
1. Explain legal concepts clearly.
2. Use simple language when possible.
3. Distinguish facts from interpretation.
4. Never claim to be a lawyer.
5. Always include a legal disclaimer.
6. Avoid hallucinating court judgments.
7. State uncertainty when unsure.
8. Focus on Indian law generally. Use Constitution, BNS, BNSS, BSA and other relevant Indian legal principles when applicable.
9. You MUST provide real-life examples of cases with judgments passed mainly by the Supreme Court or High Courts to prove a point or support the query. Provide the base of the judgment (i.e. it was because of these specific reasons).
10. Format your output using Markdown (bolding, bullet points).

You MUST respond strictly in the following JSON format:
{
    "answer": "Detailed explanation of the legal concept using Markdown",
    "summary": "A short one-to-two sentence summary",
    "similar_cases": "Markdown formatted section titled 'Similar Cases Verdicts' containing verdicts with reasoning in a simplified and short manner",
    "disclaimer": "This information is for educational purposes only and does not constitute legal advice. Please consult a qualified lawyer for legal matters.",
    "category": "e.g., Property Law, Constitutional Law, Criminal Law, etc."
}"""

        conversation = None
        gemini_history = []
        
        if request.conversation_id:
            conversation = db.query(Conversation).filter(
                Conversation.id == request.conversation_id,
                Conversation.user_id == user_id
            ).first()
            if conversation:
                # Load previous messages for context
                for msg in conversation.messages:
                    if msg.role == MessageRole.user:
                        gemini_history.append({"role": "user", "parts": [{"text": msg.content}]})
                    else:
                        # Reconstruct JSON string for model context
                        gemini_history.append({"role": "model", "parts": [{"text": msg.content}]})
        
        if not conversation:
            title = request.question[:60]
            conversation = Conversation(
                user_id=user_id,
                title=title,
                feature_type=FeatureType.know_kanoon
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

        # Build contents array
        gemini_history.append({"role": "user", "parts": [{"text": request.question}]})

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
                    
                    # Use ThreadPoolExecutor to prevent the SDK from hanging on 429 Retry-After sleeps
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
                        response = future.result(timeout=15) # Wait max 15 seconds per model
                    break # Success!
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
                        time.sleep(2 ** attempt) # Exponential backoff: 1s, 2s
                        continue
                    logger.error(f"All {max_retries} attempts failed. Last exception: {str(e)}")
                    raise e # If we've run out of retries, raise the last exception
            
            if not response:
                raise last_exception
            
            # Parse the JSON response
            response_json = json.loads(response.text)
            
            # Save Assistant Message
            assistant_msg = Message(
                conversation_id=conversation.id,
                role=MessageRole.assistant,
                content=json.dumps(response_json) # Save raw structured json
            )
            db.add(assistant_msg)
            db.commit()
            
            return KanoonQueryResponse(conversation_id=conversation.id, **response_json)
        except Exception as e:
            import traceback
            traceback.print_exc()
            # Fallback if parsing fails or API fails
            error_msg = "I encountered an error while processing your request. Please try again."
            if "UNAVAILABLE" in str(e) or "503" in str(e):
                error_msg = "The NYAAY AI model is currently experiencing high demand. Please try again in a moment."
                
            fallback_json = {
                "answer": error_msg,
                "summary": "Error processing request.",
                "similar_cases": ["No cases could be retrieved due to an error."],
                "key_clauses": [],
                "disclaimer": "This information is for educational purposes only and does not constitute legal advice.",
                "category": "General"
            }
            assistant_msg = Message(
                conversation_id=conversation.id,
                role=MessageRole.assistant,
                content=json.dumps(fallback_json)
            )
            db.add(assistant_msg)
            db.commit()
            
            return KanoonQueryResponse(conversation_id=conversation.id, **fallback_json)



kanoon_service = KanoonService()

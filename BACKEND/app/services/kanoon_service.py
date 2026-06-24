import json
from google import genai
from google.genai import types
from app.core.config import settings
from app.schemas.kanoon import KanoonQueryRequest, KanoonQueryResponse

class KanoonService:
    def __init__(self):
        # The genai client will automatically pick up GEMINI_API_KEY from environment or it can be passed.
        api_key = settings.GEMINI_API_KEY or "DUMMY_KEY_FOR_TESTING"
        self.client = genai.Client(api_key=api_key)
            
    def query(self, request: KanoonQueryRequest) -> KanoonQueryResponse:
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

        response = self.client.models.generate_content(
            model='gemini-2.5-flash',
            contents=request.question,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
            ),
        )
        
        # Parse the JSON response
        try:
            response_json = json.loads(response.text)
            return KanoonQueryResponse(**response_json)
        except Exception as e:
            # Fallback if parsing fails
            return KanoonQueryResponse(
                answer="I encountered an error while processing your request. Please try again.",
                summary="Error processing request.",
                similar_cases="No cases could be retrieved due to an error.",
                disclaimer="This information is for educational purposes only and does not constitute legal advice.",
                category="General"
            )



kanoon_service = KanoonService()

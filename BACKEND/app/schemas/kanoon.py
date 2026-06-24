from pydantic import BaseModel, Field

from typing import Optional

class KanoonQueryRequest(BaseModel):
    question: str = Field(..., min_length=5, max_length=1000, description="The legal question to ask")
    conversation_id: Optional[str] = Field(None, description="Optional ID of an existing conversation to continue")

class KanoonQueryResponse(BaseModel):
    conversation_id: str = Field(..., description="ID of the conversation this query belongs to")
    answer: str = Field(..., description="Detailed explanation of the legal concept")
    summary: str = Field(..., description="A short one-to-two sentence summary")
    similar_cases: str = Field(..., description="Markdown string detailing similar real-life cases and verdicts")
    disclaimer: str = Field(..., description="Legal disclaimer stating this is not legal advice")
    category: str = Field(..., description="Category of law (e.g., Property Law, Constitutional Law)")

from pydantic import BaseModel, Field

class DocumentUploadResponse(BaseModel):
    document_id: str
    filename: str
    pages: int
    summary: str

from typing import Optional

class ChatQueryRequest(BaseModel):
    document_id: str
    question: str = Field(..., min_length=5, max_length=1000)
    conversation_id: Optional[str] = Field(None, description="Optional ID of an existing conversation to continue")

class ChatQueryResponse(BaseModel):
    conversation_id: str
    answer: str
    summary: str
    confidence: str = Field(..., description="High, Medium, or Low")

from pydantic import BaseModel, Field

class DocumentUploadResponse(BaseModel):
    document_id: str
    filename: str
    pages: int
    summary: str

class ChatQueryRequest(BaseModel):
    document_id: str
    question: str = Field(..., min_length=5, max_length=1000)

class ChatQueryResponse(BaseModel):
    answer: str
    summary: str
    confidence: str = Field(..., description="High, Medium, or Low")

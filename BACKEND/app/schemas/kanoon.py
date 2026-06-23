from pydantic import BaseModel, Field

class KanoonQueryRequest(BaseModel):
    question: str = Field(..., min_length=5, max_length=1000, description="The legal question to ask")

class KanoonQueryResponse(BaseModel):
    answer: str = Field(..., description="Detailed explanation of the legal concept")
    summary: str = Field(..., description="A short one-to-two sentence summary")
    disclaimer: str = Field(..., description="Legal disclaimer stating this is not legal advice")
    category: str = Field(..., description="Category of law (e.g., Property Law, Constitutional Law)")

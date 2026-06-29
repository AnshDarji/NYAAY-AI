from fastapi import APIRouter, Depends, HTTPException
from app.services.reasoning_service import reasoning_service, ReasoningRequest
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter()

class ReasoningResponse(BaseModel):
    analysis_id: str
    content: str
    citations: List[Dict[str, Any]]
    created_at: str

@router.post("/generate", response_model=ReasoningResponse)
def generate_analysis(request: ReasoningRequest):
    try:
        response = reasoning_service.generate_analysis(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

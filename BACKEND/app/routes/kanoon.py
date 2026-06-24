from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse
from app.schemas.kanoon import KanoonQueryRequest, KanoonQueryResponse
from app.services.kanoon_service import kanoon_service
from app.middleware.auth import verify_firebase_token
from app.core.rate_limit import limiter

router = APIRouter()

@router.post("/query", response_model=KanoonQueryResponse, dependencies=[Depends(verify_firebase_token)])
@limiter.limit("20/minute")
async def ask_kanoon(request: Request, payload: KanoonQueryRequest):
    return kanoon_service.query(payload)



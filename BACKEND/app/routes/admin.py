from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.database import get_db
from app.models.chat import Conversation, Message
from app.core.metrics import global_metrics

router = APIRouter()

@router.get("/metrics")
def get_operational_metrics(db: Session = Depends(get_db)):
    # Fetch active users (unique users who have a conversation)
    active_users = db.query(func.count(func.distinct(Conversation.user_id))).scalar()
    
    # Fetch feedback stats
    total_feedback = db.query(Message).filter(Message.is_helpful != None).count()
    helpful_feedback = db.query(Message).filter(Message.is_helpful == "yes").count()
    
    snapshot = global_metrics.get_snapshot()
    snapshot["active_users"] = active_users
    
    snapshot["feedback"] = {
        "total_responses_rated": total_feedback,
        "helpful_responses": helpful_feedback,
        "approval_rating_percent": (helpful_feedback / total_feedback * 100) if total_feedback > 0 else 0.0
    }
    
    return snapshot

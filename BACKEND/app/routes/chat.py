from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.middleware.auth import verify_firebase_token
from app.models.chat import Conversation, Message
from app.schemas.chat import ConversationListResponse, MessageListResponse

router = APIRouter()

@router.get("/conversations", response_model=ConversationListResponse)
def get_conversations(
    user_token: dict = Depends(verify_firebase_token),
    db: Session = Depends(get_db)
):
    uid = user_token.uid
    conversations = db.query(Conversation).filter(Conversation.user_id == uid).order_by(Conversation.updated_at.desc()).all()
    return ConversationListResponse(conversations=conversations)

@router.get("/conversations/{conversation_id}/messages", response_model=MessageListResponse)
def get_messages(
    conversation_id: str,
    user_token: dict = Depends(verify_firebase_token),
    db: Session = Depends(get_db)
):
    uid = user_token.uid
    # Verify ownership
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == uid
    ).first()
    
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
        
    messages = db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.created_at.asc()).all()
    return MessageListResponse(messages=messages)

@router.delete("/conversations/{conversation_id}", status_code=status.HTTP_200_OK)
def delete_conversation(
    conversation_id: str,
    user_token: dict = Depends(verify_firebase_token),
    db: Session = Depends(get_db)
):
    uid = user_token.uid
    # Verify ownership
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == uid
    ).first()
    
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
        
    db.delete(conversation)
    db.commit()
    
    return {"success": True, "message": "Conversation deleted successfully"}

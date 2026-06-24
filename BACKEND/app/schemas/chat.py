from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime
from app.models.chat import FeatureType, MessageRole

class MessageResponse(BaseModel):
    id: str
    conversation_id: str
    role: MessageRole
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

class ConversationResponse(BaseModel):
    id: str
    user_id: str
    title: str
    feature_type: FeatureType
    document_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ConversationListResponse(BaseModel):
    conversations: List[ConversationResponse]

class MessageListResponse(BaseModel):
    messages: List[MessageResponse]

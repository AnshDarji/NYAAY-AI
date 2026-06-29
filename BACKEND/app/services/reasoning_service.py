from typing import Dict, Any, Optional
import uuid
import logging
from app.ai.orchestrator import rag_orchestrator
from pydantic import BaseModel
from datetime import datetime

logger = logging.getLogger(__name__)

class ReasoningRequest(BaseModel):
    user_facts: str
    tenant_id: Optional[str] = "global"

class ReasoningService:
    def generate_analysis(self, request: ReasoningRequest) -> Dict[str, Any]:
        """
        Generates a structured legal reasoning analysis using the RAG orchestrator.
        """
        logger.info("Generating legal reasoning analysis")
        
        # Trigger the pipeline with REASONING task_type
        filters = {"tenant_id": request.tenant_id} if request.tenant_id else None
        
        response = rag_orchestrator.trigger_pipeline(
            question=request.user_facts,
            filters=filters,
            history=[],
            task_type="REASONING"
        )
        
        # Format the response
        return {
            "analysis_id": str(uuid.uuid4()),
            "content": response.get("answer", "Failed to generate analysis."),
            "citations": response.get("citations", []),
            "created_at": datetime.utcnow().isoformat()
        }

reasoning_service = ReasoningService()

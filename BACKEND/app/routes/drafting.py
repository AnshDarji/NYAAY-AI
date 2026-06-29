from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from app.ai.drafting_orchestrator import drafting_orchestrator
from app.schemas.drafting import StructuredDocumentObject
from app.utils.document_generators import DocumentGenerator

router = APIRouter()

class DraftRequest(BaseModel):
    user_facts: str
    provided_fields: Optional[Dict[str, str]] = None

class EditRequest(BaseModel):
    document_object: StructuredDocumentObject
    edit_instructions: str

@router.post("/generate")
def generate_draft(request: DraftRequest):
    try:
        response = drafting_orchestrator.trigger_drafting_pipeline(request.user_facts, request.provided_fields)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/edit", response_model=StructuredDocumentObject)
def edit_draft(request: EditRequest):
    try:
        updated_doc = drafting_orchestrator.edit_document_object(
            request.document_object.model_dump(),
            request.edit_instructions
        )
        # Manually increment version (or rely on LLM to do it, but let's enforce it)
        updated_doc.metadata.version = request.document_object.metadata.version + 1
        return updated_doc
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/download/pdf")
def download_pdf(doc_obj: StructuredDocumentObject):
    try:
        buffer = DocumentGenerator.generate_pdf(doc_obj)
        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={doc_obj.document_type.lower()}_draft.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/download/docx")
def download_docx(doc_obj: StructuredDocumentObject):
    try:
        buffer = DocumentGenerator.generate_docx(doc_obj)
        return StreamingResponse(
            buffer,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": f"attachment; filename={doc_obj.document_type.lower()}_draft.docx"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

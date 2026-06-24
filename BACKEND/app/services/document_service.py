import os
import uuid
import shutil
import fitz # PyMuPDF
import docx
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from app.models.document import Document
from app.schemas.upload_chat import DocumentUploadResponse
from app.core.config import settings
from google import genai
from google.genai import types

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class DocumentService:
    def __init__(self):
        api_key = settings.GEMINI_API_KEY or "DUMMY_KEY_FOR_TESTING"
        self.client = genai.Client(api_key=api_key)

    def process_upload(self, user_uid: str, file: UploadFile, db: Session) -> DocumentUploadResponse:
        doc_id = str(uuid.uuid4())
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in [".pdf", ".docx"]:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload PDF or DOCX.")
            
        filepath = os.path.join(UPLOAD_DIR, f"{doc_id}{ext}")
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Check size limit (10MB)
        file_size = os.path.getsize(filepath)
        if file_size > 10 * 1024 * 1024:
            os.remove(filepath)
            raise HTTPException(status_code=400, detail="File size exceeds the 10MB limit.")
            
        text = ""
        pages = 0
        
        try:
            if ext == ".pdf":
                doc = fitz.open(filepath)
                pages = len(doc)
                if pages > 300:
                    doc.close()
                    os.remove(filepath)
                    raise HTTPException(status_code=400, detail="Document exceeds the maximum limit of 300 pages.")
                for page in doc:
                    text += page.get_text() + "\n"
                doc.close()
            elif ext == ".docx":
                doc = docx.Document(filepath)
                pages = 1 # Approximation for DOCX
                for para in doc.paragraphs:
                    text += para.text + "\n"
        except HTTPException:
            raise
        except Exception as e:
            if os.path.exists(filepath):
                os.remove(filepath)
            raise HTTPException(status_code=400, detail=f"Failed to process document: {str(e)}")
            
        if not text.strip():
            os.remove(filepath)
            raise HTTPException(status_code=400, detail="Document is empty or text could not be extracted.")
            
        # Generate Summary
        summary = self._generate_summary(text)
        
        db_doc = Document(
            id=doc_id,
            user_uid=user_uid,
            filename=file.filename,
            filepath=filepath,
            pages=pages,
            extracted_text=text,
            summary=summary
        )
        db.add(db_doc)
        db.commit()
        
        return DocumentUploadResponse(
            document_id=doc_id,
            filename=file.filename,
            pages=pages,
            summary=summary
        )

    def _generate_summary(self, text: str) -> str:
        prompt = "Summarize the following legal document in 2-3 concise sentences. Focus on the nature of the document and its primary purpose:\n\n" + text[:15000]
        try:
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt
            )
            return response.text.strip()
        except Exception as e:
            print(f"Error generating summary: {e}")
            return f"Document summary could not be generated. Error: {str(e)}"

document_service = DocumentService()

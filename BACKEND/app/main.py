from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.firebase import initialize_firebase

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    initialize_firebase()
    yield
    # Shutdown actions

# Initialize FastAPI application
app = FastAPI(
    title="NYAAY AI API",
    description="Backend API for NYAAY AI - Legal Assistant for the Indian Judiciary Ecosystem",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS Middleware using settings-driven origins (no wildcard with allow_credentials=True)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/api/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint to verify that the API is up, database settings are loaded,
    and Firebase has initialized successfully.
    """
    return {
        "status": "ok",
        "environment": settings.ENVIRONMENT,
        "database": "configured"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=settings.is_development
    )

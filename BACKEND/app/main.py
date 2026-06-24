from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.firebase import initialize_firebase
from app.database.database import Base, engine
from app.routes import auth, kanoon, upload_chat
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.core.rate_limit import limiter

# Import models so Base.metadata knows about them before create_all()
import app.models  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup ---
    initialize_firebase()
    # Create all tables that do not yet exist (idempotent)
    Base.metadata.create_all(bind=engine)
    yield
    # --- Shutdown --- (nothing to clean up yet)


app = FastAPI(
    title="NYAAY AI API",
    description="Backend API for NYAAY AI — Legal Assistant for the Indian Judiciary Ecosystem",
    version="1.0.0",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Settings-driven CORS — no wildcard with allow_credentials=True
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(kanoon.router, prefix="/api/kanoon", tags=["Know Your Kanoon"])
app.include_router(upload_chat.router, prefix="/api/upload-chat", tags=["Upload & Chat"])


@app.get("/api/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint.
    Verifies that the API is running and configuration has loaded.
    """
    return {
        "status": "ok",
        "environment": settings.ENVIRONMENT,
        "database": "configured",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=settings.is_development,
    )

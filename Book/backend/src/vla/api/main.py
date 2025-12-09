"""FastAPI application for VLA Chapter 4 backend."""

import os
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Load environment variables from .env file
# Look for .env in the backend directory (4 levels up from this file)
# File structure: backend/src/vla/api/main.py -> backend/.env
backend_dir = Path(__file__).parent.parent.parent.parent
env_path = backend_dir / ".env"
load_dotenv(dotenv_path=env_path)

# Also try loading from current directory as fallback
load_dotenv()

app = FastAPI(
    title="VLA Chapter 4 API",
    description="API for Chapter 4: Vision-Language-Action (VLA) Systems",
    version="0.1.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "*"  # Allow all origins for development (remove in production)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "VLA Chapter 4 API", "version": "0.1.0"}


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}


# Import and include routers
from .endpoints import chat

# Initialize Qdrant collections on startup
@app.on_event("startup")
async def startup_event():
    """Initialize Qdrant collections on application startup."""
    try:
        from ..services.chat_service import initialize_chat_collection
        from ..services.rag_service import initialize_qdrant_collection
        
        # Initialize chat messages collection
        initialize_chat_collection()
        
        # Initialize chapter content collection (optional)
        # initialize_qdrant_collection()
        
        print("Qdrant collections initialized successfully")
    except Exception as e:
        print(f"Error initializing Qdrant collections: {e}")

# Chat endpoints
app.include_router(chat.router, prefix="/api/v1/chat", tags=["RAG Chatbot"])

# TODO: Import and include other routers when endpoints are created
# from .endpoints import whisper, planner, executor, vla, personalization, translation
# app.include_router(whisper.router, prefix="/api/v1/whisper", tags=["Whisper"])
# app.include_router(planner.router, prefix="/api/v1/plan", tags=["Cognitive Planning"])
# app.include_router(executor.router, prefix="/api/v1/execute", tags=["Action Execution"])
# app.include_router(vla.router, prefix="/api/v1/vla", tags=["VLA Pipeline"])
# app.include_router(personalization.router, prefix="/api/v1/personalize", tags=["Personalization"])
# app.include_router(translation.router, prefix="/api/v1/translate", tags=["Translation"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


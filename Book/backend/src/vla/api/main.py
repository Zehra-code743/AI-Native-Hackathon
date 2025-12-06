"""FastAPI application for VLA Chapter 4 backend."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI(
    title="VLA Chapter 4 API",
    description="API for Chapter 4: Vision-Language-Action (VLA) Systems",
    version="0.1.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Docusaurus dev server
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


# TODO: Import and include routers when endpoints are created
# from .endpoints import whisper, planner, executor, vla, chat, personalization, translation
# app.include_router(whisper.router, prefix="/api/v1/whisper", tags=["Whisper"])
# app.include_router(planner.router, prefix="/api/v1/plan", tags=["Cognitive Planning"])
# app.include_router(executor.router, prefix="/api/v1/execute", tags=["Action Execution"])
# app.include_router(vla.router, prefix="/api/v1/vla", tags=["VLA Pipeline"])
# app.include_router(chat.router, prefix="/api/v1/chat", tags=["RAG Chatbot"])
# app.include_router(personalization.router, prefix="/api/v1/personalize", tags=["Personalization"])
# app.include_router(translation.router, prefix="/api/v1/translate", tags=["Translation"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


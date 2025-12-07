"""API endpoints for chatbot functionality."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from ...services.chat_service import save_message, get_session_messages, search_similar_messages
from ...services.gemini_service import get_chatbot_response

router = APIRouter()


class ChatMessageRequest(BaseModel):
    """Request model for saving a chat message."""
    session_id: str
    message_type: str  # 'user' or 'bot'
    content: str
    chapter_context: Optional[str] = None


class ChatMessageResponse(BaseModel):
    """Response model for chat message."""
    id: str
    session_id: str
    message_type: str
    content: str
    chapter_context: Optional[str] = None
    timestamp: str


class SessionMessagesResponse(BaseModel):
    """Response model for session messages."""
    session_id: str
    messages: List[ChatMessageResponse]


class SearchQuery(BaseModel):
    """Request model for searching similar messages."""
    query: str
    session_id: Optional[str] = None
    limit: int = 10


class ChatQueryRequest(BaseModel):
    """Request model for chatbot query with Gemini."""
    session_id: str
    message: str
    chapter_context: Optional[str] = None


class ChatQueryResponse(BaseModel):
    """Response model for chatbot query."""
    session_id: str
    user_message: str
    bot_response: str
    chapter_context: Optional[str] = None


@router.post("/messages", response_model=ChatMessageResponse)
async def save_chat_message(request: ChatMessageRequest):
    """
    Save a chat message to Qdrant.
    
    Args:
        request: Chat message request with session_id, message_type, content, etc.
        
    Returns:
        Saved message details
    """
    try:
        # Validate message_type
        if request.message_type not in ['user', 'bot']:
            raise HTTPException(
                status_code=400,
                detail="message_type must be 'user' or 'bot'"
            )
        
        # Save message to Qdrant
        saved_message = save_message(
            session_id=request.session_id,
            message_type=request.message_type,
            content=request.content,
            chapter_context=request.chapter_context
        )
        
        return ChatMessageResponse(**saved_message)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error saving message: {str(e)}"
        )


@router.get("/messages/{session_id}", response_model=SessionMessagesResponse)
async def get_messages(session_id: str, limit: int = 100):
    """
    Retrieve all messages for a given session.
    
    Args:
        session_id: Session identifier
        limit: Maximum number of messages to retrieve
        
    Returns:
        List of messages for the session
    """
    try:
        messages = get_session_messages(session_id, limit=limit)
        
        # Convert to response models
        message_responses = [
            ChatMessageResponse(**msg) for msg in messages
        ]
        
        return SessionMessagesResponse(
            session_id=session_id,
            messages=message_responses
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving messages: {str(e)}"
        )


@router.post("/query", response_model=ChatQueryResponse)
async def chat_query(request: ChatQueryRequest):
    """
    Process a chat query using Gemini LLM and save to Qdrant.
    
    Args:
        request: Chat query with session_id, message, and optional chapter_context
        
    Returns:
        Bot response from Gemini
    """
    try:
        # Get response from Gemini
        bot_response = get_chatbot_response(
            user_message=request.message,
            session_id=request.session_id,
            chapter_context=request.chapter_context
        )
        
        # Save user message to Qdrant
        save_message(
            session_id=request.session_id,
            message_type="user",
            content=request.message,
            chapter_context=request.chapter_context
        )
        
        # Save bot response to Qdrant
        save_message(
            session_id=request.session_id,
            message_type="bot",
            content=bot_response,
            chapter_context=request.chapter_context
        )
        
        return ChatQueryResponse(
            session_id=request.session_id,
            user_message=request.message,
            bot_response=bot_response,
            chapter_context=request.chapter_context
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing chat query: {str(e)}"
        )


@router.post("/messages/search", response_model=List[ChatMessageResponse])
async def search_messages(search: SearchQuery):
    """
    Search for similar messages using semantic search.
    
    Args:
        search: Search query with optional session_id filter
        
    Returns:
        List of similar messages with relevance scores
    """
    try:
        results = search_similar_messages(
            query=search.query,
            session_id=search.session_id,
            limit=search.limit
        )
        
        # Convert to response models (score is included in the dict but not in response model)
        message_responses = [
            ChatMessageResponse(
                id=msg["id"],
                session_id=msg["session_id"],
                message_type=msg["message_type"],
                content=msg["content"],
                chapter_context=msg.get("chapter_context"),
                timestamp=msg["timestamp"]
            )
            for msg in results
        ]
        
        return message_responses
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error searching messages: {str(e)}"
        )


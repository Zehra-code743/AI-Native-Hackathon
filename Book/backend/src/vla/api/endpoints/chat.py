"""API endpoints for chatbot functionality."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from ...services.chat_service import save_message, get_session_messages, search_similar_messages
from ...services.gemini_service import get_chatbot_response
from ...services.rag_service import get_rag_response

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
    Process a chat query using RAG with vector database search and save to Qdrant.
    Always searches the vector database before generating a response.
    
    Args:
        request: Chat query with session_id, message, and optional chapter_context
        
    Returns:
        Bot response from RAG service (with vector database search)
    """
    try:
        print(f"[Chat Query] Received query from session {request.session_id}: {request.message[:50]}...")
        
        # Get conversation history for context
        previous_messages = get_session_messages(request.session_id, limit=10)
        print(f"[Chat Query] Loaded {len(previous_messages)} previous messages")
        
        # Build conversation history format for RAG service
        conversation_history = []
        for msg in previous_messages[-6:]:  # Last 6 messages (3 exchanges)
            role = "user" if msg["message_type"] == "user" else "assistant"
            conversation_history.append({
                "role": role,
                "content": msg["content"]
            })
        
        # Get response from RAG service (always searches vector database first)
        print(f"[Chat Query] Calling RAG service to search vector database and generate response...")
        bot_response = get_rag_response(
            user_message=request.message,
            conversation_history=conversation_history if conversation_history else None
        )
        
        if not bot_response or not bot_response.strip():
            bot_response = "I apologize, but I couldn't generate a response. Please try again."
            print(f"[Chat Query] WARNING: Empty response from RAG service")
        
        print(f"[Chat Query] Generated response: {bot_response[:100]}...")
        
        # Save user message to Qdrant
        try:
            save_message(
                session_id=request.session_id,
                message_type="user",
                content=request.message,
                chapter_context=request.chapter_context
            )
        except Exception as save_error:
            print(f"[Chat Query] Warning: Failed to save user message: {save_error}")
        
        # Save bot response to Qdrant
        try:
            save_message(
                session_id=request.session_id,
                message_type="bot",
                content=bot_response,
                chapter_context=request.chapter_context
            )
        except Exception as save_error:
            print(f"[Chat Query] Warning: Failed to save bot response: {save_error}")
        
        return ChatQueryResponse(
            session_id=request.session_id,
            user_message=request.message,
            bot_response=bot_response,
            chapter_context=request.chapter_context
        )
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"[Chat Query] Error processing chat query: {e}")
        print(f"[Chat Query] Traceback: {error_trace}")
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


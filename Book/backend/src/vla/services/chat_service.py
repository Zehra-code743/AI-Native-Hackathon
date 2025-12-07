"""Chat service for saving and retrieving chatbot messages from Qdrant."""

import os
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue
from openai import OpenAI

# Import rag_service for shared client and embedding functions
from .rag_service import qdrant_client, generate_embeddings

# Collection name for chatbot messages
CHAT_MESSAGES_COLLECTION = "chatbot_messages"


def initialize_chat_collection():
    """Initialize Qdrant collection for chatbot messages."""
    try:
        # Check if collection exists
        collections = qdrant_client.get_collections()
        collection_names = [col.name for col in collections.collections]
        
        if CHAT_MESSAGES_COLLECTION not in collection_names:
            # Create collection with OpenAI text-embedding-3-small dimensions (1536)
            qdrant_client.create_collection(
                collection_name=CHAT_MESSAGES_COLLECTION,
                vectors_config=VectorParams(
                    size=1536,  # OpenAI text-embedding-3-small dimension
                    distance=Distance.COSINE
                )
            )
            print(f"Created Qdrant collection: {CHAT_MESSAGES_COLLECTION}")
        else:
            print(f"Qdrant collection {CHAT_MESSAGES_COLLECTION} already exists")
    except Exception as e:
        print(f"Error initializing chat collection: {e}")
        raise


def save_message(
    session_id: str,
    message_type: str,  # 'user' or 'bot'
    content: str,
    chapter_context: Optional[str] = None
) -> Dict[str, Any]:
    """
    Save a chat message to Qdrant.
    
    Args:
        session_id: Unique session identifier for the conversation
        message_type: Type of message ('user' or 'bot')
        content: Message content
        chapter_context: Optional chapter context
        
    Returns:
        Dictionary with saved message details including ID
    """
    try:
        # Initialize collection if not exists
        initialize_chat_collection()
        
        # Generate embedding for the message content
        embedding = generate_embeddings(content)
        
        # Create unique ID for the message
        message_id = str(uuid.uuid4())
        
        # Create point with vector and payload
        point = PointStruct(
            id=message_id,
            vector=embedding,
            payload={
                "session_id": session_id,
                "message_type": message_type,
                "content": content,
                "chapter_context": chapter_context,
                "timestamp": datetime.utcnow().isoformat(),
            }
        )
        
        # Upsert the point
        qdrant_client.upsert(
            collection_name=CHAT_MESSAGES_COLLECTION,
            points=[point]
        )
        
        return {
            "id": message_id,
            "session_id": session_id,
            "message_type": message_type,
            "content": content,
            "chapter_context": chapter_context,
            "timestamp": point.payload["timestamp"]
        }
    except Exception as e:
        print(f"Error saving message to Qdrant: {e}")
        raise


def get_session_messages(session_id: str, limit: int = 100) -> List[Dict[str, Any]]:
    """
    Retrieve all messages for a given session from Qdrant.
    
    Args:
        session_id: Session identifier
        limit: Maximum number of messages to retrieve
        
    Returns:
        List of message dictionaries sorted by timestamp
    """
    try:
        # Query points with session_id filter
        filter_condition = Filter(
            must=[
                FieldCondition(
                    key="session_id",
                    match=MatchValue(value=session_id)
                )
            ]
        )
        
        # Scroll through points matching the filter
        points, _ = qdrant_client.scroll(
            collection_name=CHAT_MESSAGES_COLLECTION,
            scroll_filter=filter_condition,
            limit=limit,
            with_payload=True,
            with_vectors=False
        )
        
        # Convert points to message dictionaries
        messages = []
        for point in points:
            payload = point.payload
            messages.append({
                "id": str(point.id),
                "session_id": payload.get("session_id"),
                "message_type": payload.get("message_type"),
                "content": payload.get("content"),
                "chapter_context": payload.get("chapter_context"),
                "timestamp": payload.get("timestamp")
            })
        
        # Sort by timestamp (oldest first)
        messages.sort(key=lambda x: x.get("timestamp", ""))
        
        return messages
    except Exception as e:
        print(f"Error retrieving messages from Qdrant: {e}")
        return []


def search_similar_messages(
    query: str,
    session_id: Optional[str] = None,
    limit: int = 10
) -> List[Dict[str, Any]]:
    """
    Search for similar messages using semantic search.
    
    Args:
        query: Search query text
        session_id: Optional session ID to filter results
        limit: Maximum number of results
        
    Returns:
        List of similar messages with relevance scores
    """
    try:
        # Generate embedding for query
        query_embedding = generate_embeddings(query)
        
        # Build filter if session_id provided
        query_filter = None
        if session_id:
            query_filter = Filter(
                must=[
                    FieldCondition(
                        key="session_id",
                        match=MatchValue(value=session_id)
                    )
                ]
            )
        
        # Search for similar points
        search_results = qdrant_client.search(
            collection_name=CHAT_MESSAGES_COLLECTION,
            query_vector=query_embedding,
            query_filter=query_filter,
            limit=limit,
            with_payload=True
        )
        
        # Convert to message dictionaries
        messages = []
        for result in search_results:
            payload = result.payload
            messages.append({
                "id": str(result.id),
                "session_id": payload.get("session_id"),
                "message_type": payload.get("message_type"),
                "content": payload.get("content"),
                "chapter_context": payload.get("chapter_context"),
                "timestamp": payload.get("timestamp"),
                "score": result.score  # Relevance score
            })
        
        return messages
    except Exception as e:
        print(f"Error searching messages in Qdrant: {e}")
        return []


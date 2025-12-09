"""RAG service for Chapter 4 chatbot using OpenAI Agents SDK, Neon PostgreSQL, and Qdrant."""

import os
from pathlib import Path
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv
# Lazy imports to reduce memory usage at startup
# from qdrant_client import QdrantClient
# from qdrant_client.models import Distance, VectorParams, PointStruct, Filter
import openai
from openai import OpenAI

# Load environment variables from .env file
# Try to find .env file in backend directory (4 levels up from this file)
# File structure: backend/src/vla/services/rag_service.py -> backend/.env
try:
    backend_dir = Path(__file__).parent.parent.parent.parent
    env_path = backend_dir / ".env"
    
    # Load .env file from backend directory
    if env_path.exists():
        load_dotenv(dotenv_path=env_path, override=True)
        print(f"Loaded .env from: {env_path}")
    else:
        # Fallback: try current directory and parent directories
        load_dotenv(override=True)
        load_dotenv(dotenv_path=backend_dir.parent / ".env", override=True)
        print(f"Warning: .env file not found at {env_path}, trying fallback locations")
except Exception as e:
    print(f"Warning: Error loading .env file: {e}")
    # Fallback: try loading from current directory
    load_dotenv(override=True)

# Initialize Qdrant client
# Qdrant Cloud credentials from environment variables
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Check for required environment variables
missing_vars = []
if not QDRANT_URL:
    missing_vars.append("QDRANT_URL")
if not QDRANT_API_KEY:
    missing_vars.append("QDRANT_API_KEY")
if not OPENAI_API_KEY:
    missing_vars.append("OPENAI_API_KEY")

if missing_vars:
    error_msg = (
        f"Missing required environment variables: {', '.join(missing_vars)}\n"
        f"Please create a .env file in {backend_dir} with the following variables:\n"
        f"  QDRANT_URL=your_qdrant_url\n"
        f"  QDRANT_API_KEY=your_qdrant_api_key\n"
        f"  OPENAI_API_KEY=your_openai_api_key"
    )
    print(f"WARNING: {error_msg}")
    # Don't raise error immediately, allow lazy initialization

# Lazy initialization function for Qdrant client
_qdrant_client = None

def get_qdrant_client():
    """Lazy initialization of Qdrant client to reduce memory usage at startup."""
    global _qdrant_client
    if _qdrant_client is None:
        if QDRANT_URL and QDRANT_API_KEY:
            try:
                from qdrant_client import QdrantClient
                _qdrant_client = QdrantClient(
                    url=QDRANT_URL,
                    api_key=QDRANT_API_KEY if QDRANT_API_KEY else None,
                )
            except Exception as e:
                print(f"Error initializing Qdrant client: {e}")
                _qdrant_client = None
    return _qdrant_client

# For backward compatibility - use get_qdrant_client() instead
def qdrant_client():
    """Backward compatibility wrapper - use get_qdrant_client() instead."""
    return get_qdrant_client()

# Collection name for Chapter 4 embeddings
COLLECTION_NAME = "chapter_4_content"

# OpenAI client (will be None if API key is missing)
openai_client = None
if OPENAI_API_KEY:
    try:
        openai_client = OpenAI(api_key=OPENAI_API_KEY)
    except Exception as e:
        print(f"Error initializing OpenAI client: {e}")
        openai_client = None


def initialize_qdrant_collection():
    """Initialize Qdrant collection for Chapter 4 content embeddings."""
    try:
        from qdrant_client.models import Distance, VectorParams
        client = get_qdrant_client()
        if not client:
            raise ValueError("Qdrant client not initialized. Check QDRANT_URL and QDRANT_API_KEY.")
        
        # Check if collection exists
        collections = client.get_collections()
        collection_names = [col.name for col in collections.collections]
        
        if COLLECTION_NAME not in collection_names:
            # Create collection with OpenAI text-embedding-3-small dimensions (1536)
            client.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=VectorParams(
                    size=1536,  # OpenAI text-embedding-3-small dimension
                    distance=Distance.COSINE
                )
            )
            print(f"Created Qdrant collection: {COLLECTION_NAME}")
        else:
            print(f"Qdrant collection {COLLECTION_NAME} already exists")
    except Exception as e:
        print(f"Error initializing Qdrant collection: {e}")
        raise


def generate_embeddings(text: str) -> List[float]:
    """Generate embeddings for text using OpenAI."""
    if not openai_client:
        raise ValueError("OpenAI client not initialized. Please set OPENAI_API_KEY in .env file.")
    
    response = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding


def search_vector_database(query: str, limit: int = 5) -> List[Dict[str, Any]]:
    """
    Search the vector database for relevant content.
    
    Args:
        query: Search query text
        limit: Maximum number of results to return
        
    Returns:
        List of relevant documents with content and metadata
    """
    try:
        client = get_qdrant_client()
        if not client:
            print("[Vector DB] ERROR: Qdrant client not initialized. Cannot search vector database.")
            print("[Vector DB] Please check QDRANT_URL and QDRANT_API_KEY in .env file.")
            return []
        
        if not openai_client:
            print("[Vector DB] ERROR: OpenAI client not initialized. Cannot generate embeddings.")
            print("[Vector DB] Please check OPENAI_API_KEY in .env file.")
            return []
        
        print(f"[Vector DB] Generating embedding for query: {query[:50]}...")
        # Generate embedding for the query
        query_embedding = generate_embeddings(query)
        print(f"[Vector DB] Embedding generated, dimension: {len(query_embedding)}")
        
        # Check if collection exists
        try:
            collections = client.get_collections()
            collection_names = [col.name for col in collections.collections]
            if COLLECTION_NAME not in collection_names:
                print(f"[Vector DB] WARNING: Collection '{COLLECTION_NAME}' does not exist.")
                print(f"[Vector DB] Available collections: {collection_names}")
                print(f"[Vector DB] You may need to create the collection or populate it with data.")
                return []
        except Exception as check_error:
            print(f"[Vector DB] ERROR: Could not check collections: {check_error}")
            return []
        
        print(f"[Vector DB] Searching collection '{COLLECTION_NAME}' with limit={limit}...")
        # Search in the vector database
        search_results = client.search(
            collection_name=COLLECTION_NAME,
            query_vector=query_embedding,
            limit=limit,
            with_payload=True
        )
        
        print(f"[Vector DB] Search completed, found {len(search_results)} results")
        
        # Format results
        results = []
        for i, result in enumerate(search_results, 1):
            payload = result.payload or {}
            content = payload.get("content", "") or payload.get("text", "") or str(payload)
            results.append({
                "content": content,
                "metadata": payload.get("metadata", {}),
                "score": result.score
            })
            print(f"[Vector DB] Result {i}: score={result.score:.4f}, content_length={len(content)}")
        
        if not results:
            print(f"[Vector DB] WARNING: No results found for query: {query}")
            print(f"[Vector DB] This might mean the vector database is empty or the query doesn't match any content.")
        
        return results
    except Exception as e:
        print(f"[Vector DB] ERROR: Error searching vector database: {e}")
        import traceback
        traceback.print_exc()
        return []


def get_rag_response(user_message: str, conversation_history: Optional[List[Dict[str, str]]] = None) -> str:
    """
    Get RAG-based response using OpenAI with vector database search.
    Always searches the vector database before generating a response.
    
    Args:
        user_message: User's question or message
        conversation_history: Optional conversation history
        
    Returns:
        Response text based on vector database search
    """
    try:
        print(f"[RAG] Processing query: {user_message[:50]}...")
        
        if not openai_client:
            error_msg = "I apologize, but the OpenAI API key is not configured. Please set OPENAI_API_KEY in the .env file."
            print(f"[RAG] ERROR: {error_msg}")
            return error_msg
        
        # ALWAYS search vector database first
        print(f"[RAG] Searching vector database for: {user_message[:50]}...")
        search_results = search_vector_database(user_message, limit=5)
        print(f"[RAG] Found {len(search_results)} results from vector database")
        
        # Build context from search results
        context_parts = []
        if search_results:
            for i, result in enumerate(search_results, 1):
                content = result.get("content", "")
                score = result.get("score", 0)
                if content:
                    context_parts.append(f"Source {i} (relevance: {score:.2f}): {content}")
                    print(f"[RAG] Source {i}: {content[:50]}... (score: {score:.2f})")
        else:
            print(f"[RAG] WARNING: No results found in vector database for query: {user_message}")
        
        # Build system prompt
        system_prompt = """You are an AI chatbot named "AI Robotics Hackathon." Your purpose is to assist users by answering their questions or requests.

Whenever a user interacts with you, always search for relevant information from a vector database before generating a response. Use the data you find to produce your answer.

Respond to all user messages exclusively in English, regardless of the language of the user's input.

Maintain helpfulness, clarity, and accuracy at all times.

# Output Format

- All answers must be in English, in a clear, concise, and informative paragraph.
- Do not include any content in other languages.
- Never respond without searching the vector database for relevant data first.

# Notes

- If you cannot find relevant data in the vector database, politely state that you could not find the requested information, but do so in English.
- Never switch languages even if the user continues the conversation in a language other than English.
- Do not fabricate answers that are not grounded in the vector database.
- Always ensure your responses are connected to your role as part of the "AI Robotics Hackathon" project."""

        # Build messages for OpenAI
        messages = [
            {"role": "system", "content": system_prompt}
        ]
        
        # Add conversation history if provided
        if conversation_history:
            messages.extend(conversation_history)
        
        # Add vector database context
        if context_parts:
            context_text = "\n\nRelevant information from vector database:\n" + "\n\n".join(context_parts)
            messages.append({
                "role": "user",
                "content": f"{context_text}\n\nUser question: {user_message}"
            })
            print(f"[RAG] Added {len(context_parts)} sources from vector database to context")
        else:
            messages.append({
                "role": "user",
                "content": user_message
            })
            print(f"[RAG] No vector database results found, proceeding with user message only")
        
        # Call OpenAI API
        print(f"[RAG] Calling OpenAI API with {len(messages)} messages...")
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",  # Using a similar model to gpt-4.1-nano
            messages=messages,
            temperature=1,
            top_p=1,
            max_tokens=2048
        )
        
        result = response.choices[0].message.content.strip()
        print(f"[RAG] Successfully generated response: {result[:100]}...")
        return result
    
    except Exception as e:
        print(f"Error in get_rag_response: {e}")
        import traceback
        traceback.print_exc()
        # Fallback response with more details
        error_msg = f"I apologize, but I encountered an error: {str(e)}. "
        if "OPENAI_API_KEY" in str(e) or not openai_client:
            error_msg += "Please check that OPENAI_API_KEY is set in the .env file."
        elif "QDRANT" in str(e) or not get_qdrant_client():
            error_msg += "Please check that QDRANT_URL and QDRANT_API_KEY are set in the .env file."
        else:
            error_msg += "Please try again or check the server logs for more details."
        return error_msg


# Initialize collection on module import (can be called explicitly if needed)
# initialize_qdrant_collection()


"""RAG service for Chapter 4 chatbot using OpenAI Agents SDK, Neon PostgreSQL, and Qdrant."""

import os
from typing import List, Optional
from dotenv import load_dotenv
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
import openai
from openai import OpenAI

# Load environment variables from .env file
load_dotenv()

# Initialize Qdrant client
# Qdrant Cloud credentials from environment variables
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

if not QDRANT_URL:
    raise ValueError("QDRANT_URL environment variable is required. Please set it in .env file.")
if not QDRANT_API_KEY:
    raise ValueError("QDRANT_API_KEY environment variable is required. Please set it in .env file.")

qdrant_client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY if QDRANT_API_KEY else None,
)

# Collection name for Chapter 4 embeddings
COLLECTION_NAME = "chapter_4_content"


def initialize_qdrant_collection():
    """Initialize Qdrant collection for Chapter 4 content embeddings."""
    try:
        # Check if collection exists
        collections = qdrant_client.get_collections()
        collection_names = [col.name for col in collections.collections]
        
        if COLLECTION_NAME not in collection_names:
            # Create collection with OpenAI text-embedding-3-small dimensions (1536)
            qdrant_client.create_collection(
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
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding


# Initialize collection on module import (can be called explicitly if needed)
# initialize_qdrant_collection()


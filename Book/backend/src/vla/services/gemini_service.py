"""Gemini LLM service for chatbot responses."""

import os
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Initialize Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is required. Please set it in .env file.")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

# Default model
DEFAULT_MODEL = "gemini-pro"


def get_gemini_response(
    user_message: str,
    conversation_history: Optional[List[Dict[str, str]]] = None,
    system_prompt: Optional[str] = None
) -> str:
    """
    Get response from Gemini LLM.
    
    Args:
        user_message: Current user message
        conversation_history: List of previous messages in format [{"role": "user", "content": "..."}, ...]
        system_prompt: Optional system prompt to set context
    
    Returns:
        Gemini's response text
    """
    try:
        # Initialize the model
        model = genai.GenerativeModel(DEFAULT_MODEL)
        
        # Build conversation context
        chat_history = []
        
        # Add system prompt if provided
        if system_prompt:
            chat_history.append({
                "role": "user",
                "content": system_prompt
            })
            chat_history.append({
                "role": "model",
                "content": "I understand. I'm ready to help."
            })
        
        # Add conversation history
        if conversation_history:
            chat_history.extend(conversation_history)
        
        # Add current user message
        chat_history.append({
            "role": "user",
            "content": user_message
        })
        
        # Start chat session if we have history, otherwise single turn
        if len(chat_history) > 1:
            # Create chat with history
            chat = model.start_chat(history=chat_history[:-1])
            response = chat.send_message(user_message)
        else:
            # Single turn conversation
            response = model.generate_content(user_message)
        
        return response.text.strip()
    
    except Exception as e:
        print(f"Error getting Gemini response: {e}")
        raise


def get_chatbot_response(
    user_message: str,
    session_id: str,
    chapter_context: Optional[str] = None
) -> str:
    """
    Get chatbot response using Gemini with context awareness.
    
    Args:
        user_message: User's message
        session_id: Session identifier for conversation continuity
        chapter_context: Optional chapter context for specialized responses
    
    Returns:
        Bot response text
    """
    try:
        # Import here to avoid circular dependency
        from .chat_service import get_session_messages
        
        # Build system prompt based on context
        system_prompt = "You are a helpful AI assistant for an AI and Robotics textbook. "
        
        if chapter_context:
            system_prompt += f"You are currently helping with {chapter_context}. "
        
        system_prompt += (
            "Provide clear, accurate, and educational responses. "
            "If asked about robotics, AI, or technical topics, provide detailed explanations. "
            "Be friendly and encouraging. Keep responses concise but informative."
        )
        
        # Load conversation history from Qdrant
        previous_messages = get_session_messages(session_id, limit=10)
        
        # Initialize the model
        model = genai.GenerativeModel(DEFAULT_MODEL)
        
        # Build conversation history for Gemini
        chat_history = []
        
        # Add system message
        chat_history.append({
            "role": "user",
            "content": system_prompt
        })
        chat_history.append({
            "role": "model",
            "content": "I understand. I'm ready to help with AI and Robotics topics."
        })
        
        # Add previous conversation messages
        for msg in previous_messages[-6:]:  # Last 6 messages for context (3 exchanges)
            role = "user" if msg["message_type"] == "user" else "model"
            chat_history.append({
                "role": role,
                "content": msg["content"]
            })
        
        # Start chat with history
        chat = model.start_chat(history=chat_history)
        
        # Get response from Gemini
        response = chat.send_message(user_message)
        return response.text.strip()
    
    except Exception as e:
        print(f"Error in get_chatbot_response: {e}")
        # Fallback: try simple generation without history
        try:
            model = genai.GenerativeModel(DEFAULT_MODEL)
            prompt = f"You are a helpful AI assistant for an AI and Robotics textbook. {user_message}"
            response = model.generate_content(prompt)
            return response.text.strip()
        except:
            return "I apologize, but I'm having trouble processing your request right now. Please try again."


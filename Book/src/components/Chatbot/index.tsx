import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';

// API base URL - adjust if your backend runs on a different port
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'http://localhost:8000' 
  : 'http://localhost:8000';

// Generate or retrieve session ID
const getSessionId = (): string => {
  let sessionId = localStorage.getItem('chatbot_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('chatbot_session_id', sessionId);
  }
  return sessionId;
};

export default function Chatbot(): JSX.Element {
  const [sessionId] = useState<string>(getSessionId());
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'bot' }>>([
    { text: 'Hello! How can I help you today?', sender: 'bot' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [messagesLoaded, setMessagesLoaded] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatContainerRef.current &&
        !chatContainerRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(`.${styles.chatbotButton}`)
      ) {
        // Don't close if clicking inside the chat
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Load previous messages when chat opens
  useEffect(() => {
    if (isOpen && !messagesLoaded) {
      loadPreviousMessages();
      setMessagesLoaded(true);
    }
  }, [isOpen, messagesLoaded, sessionId]);

  const loadPreviousMessages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat/messages/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.messages && data.messages.length > 0) {
          // Convert API messages to component format
          const loadedMessages = data.messages.map((msg: any) => ({
            text: msg.content,
            sender: msg.message_type === 'user' ? 'user' : 'bot' as 'user' | 'bot',
          }));
          setMessages(loadedMessages);
        }
      }
    } catch (error) {
      console.error('Error loading previous messages:', error);
    }
  };

  const saveMessageToAPI = async (
    messageType: 'user' | 'bot',
    content: string
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          message_type: messageType,
          content: content,
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to save message to API');
      }
    } catch (error) {
      console.error('Error saving message to API:', error);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessageText = inputValue.trim();
    const userMessage = { text: userMessageText, sender: 'user' as const };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call Gemini API endpoint
      const response = await fetch(`${API_BASE_URL}/api/v1/chat/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: userMessageText,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage = {
          text: data.bot_response,
          sender: 'bot' as const,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        // Error handling
        const errorMessage = {
          text: 'Sorry, I encountered an error. Please try again.',
          sender: 'bot' as const,
        };
        setMessages((prev) => [...prev, errorMessage]);
        console.error('Error getting response from API');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot' as const,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className={styles.chatbotButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open chatbot">
        {isOpen ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>

      {isOpen && (
        <div className={styles.chatbotContainer} ref={chatContainerRef}>
          <div className={styles.chatbotHeader}>
            <div className={styles.chatbotHeaderContent}>
              <div className={styles.chatbotAvatar}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
              </div>
              <div>
                <h3>AI Assistant</h3>
                <p>Online</p>
              </div>
            </div>
            <button
              className={styles.minimizeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Minimize chatbot">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>

          <div className={styles.chatbotMessages}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${styles.message} ${
                  message.sender === 'user' ? styles.userMessage : styles.botMessage
                }`}>
                <div className={styles.messageContent}>{message.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className={styles.chatbotInput}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className={styles.input}
            />
            <button 
              type="submit" 
              className={styles.sendButton} 
              aria-label="Send message"
              disabled={isLoading}>
              {isLoading ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2">
                  <circle cx="12" cy="12" r="10" opacity="0.5" />
                  <path d="M12 2v4" />
                  <path d="M12 18v4" />
                  <path d="M4.93 4.93l2.83 2.83" />
                  <path d="M16.24 16.24l2.83 2.83" />
                  <path d="M2 12h4" />
                  <path d="M18 12h4" />
                  <path d="M4.93 19.07l2.83-2.83" />
                  <path d="M16.24 7.76l2.83-2.83" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}


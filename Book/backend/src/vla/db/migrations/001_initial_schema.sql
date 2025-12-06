-- Initial database schema for VLA Chapter 4
-- Neon PostgreSQL database migrations

-- Conversation history for RAG chatbot
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) NOT NULL,
    message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('USER_QUERY', 'BOT_RESPONSE')),
    content TEXT NOT NULL,
    chapter_context VARCHAR(100),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_timestamp ON chat_messages(timestamp);

-- Source citations for RAG responses
CREATE TABLE IF NOT EXISTS source_citations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
    chapter_id VARCHAR(100),
    section VARCHAR(255),
    relevance_score FLOAT,
    excerpt TEXT
);

-- User profiles for personalization
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id VARCHAR(255) PRIMARY KEY,
    experience_level VARCHAR(20) CHECK (experience_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    learning_style VARCHAR(20) CHECK (learning_style IN ('VISUAL', 'TEXTUAL', 'HANDS_ON', 'MIXED')),
    preferred_language VARCHAR(10),
    preferred_code_complexity VARCHAR(20) CHECK (preferred_code_complexity IN ('SIMPLIFIED', 'STANDARD', 'ADVANCED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Translation requests and results
CREATE TABLE IF NOT EXISTS translation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_text TEXT NOT NULL,
    target_language VARCHAR(10) NOT NULL,
    context VARCHAR(100),
    preserve_technical_terms BOOLEAN DEFAULT TRUE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS translation_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    translation_request_id UUID REFERENCES translation_requests(id),
    translated_text TEXT NOT NULL,
    quality_score FLOAT,
    validation_status VARCHAR(20) CHECK (validation_status IN ('PENDING', 'PASSED', 'FAILED', 'NEEDS_REVIEW')),
    translation_metadata JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


# Quickstart Guide: Chapter 4 - Vision-Language-Action (VLA) Systems

**Branch**: `004-vla-chapter` | **Date**: 2025-01-27 | **Plan**: [plan.md](plan.md)

This quickstart guide provides step-by-step instructions to get the VLA system running locally.

## Prerequisites

- Python 3.10+
- ROS 2 Humble or Iron (installed and sourced)
- Node.js 18+ (for Docusaurus)
- OpenAI API key
- Neon PostgreSQL account (free tier sufficient)
- Qdrant instance (local or cloud)

## Step 1: Clone and Setup

```bash
# Navigate to project root
cd HackathonAiRebortics

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Install ROS 2 dependencies (if not already installed)
# Follow ROS 2 installation guide for your platform
```

## Step 2: Environment Configuration

Create `.env` file in `backend/`:

```bash
# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here

# Neon PostgreSQL
NEON_DATABASE_URL=postgresql://user:password@host/database

# Qdrant
QDRANT_URL=http://localhost:6333  # or cloud URL
QDRANT_API_KEY=your_qdrant_key  # if using cloud

# ROS 2 (optional, for local ROS 2 nodes)
ROS_DOMAIN_ID=0
```

## Step 3: Database Setup

### Neon PostgreSQL

```bash
# Connection string is in .env file
# Run migrations (when implemented)
cd backend
alembic upgrade head
```

### Qdrant

```bash
# If running locally
docker run -p 6333:6333 qdrant/qdrant

# Or use Qdrant Cloud (free tier available)
# Update QDRANT_URL in .env
```

## Step 4: Build ROS 2 Messages

```bash
# Create ROS 2 workspace (if not exists)
mkdir -p ~/vla_ws/src
cd ~/vla_ws/src

# Clone or create vla_ros package (with custom messages)
# See contracts/ros-interfaces.md for message definitions

# Build workspace
cd ~/vla_ws
colcon build
source install/setup.bash
```

## Step 5: Start Backend Services

```bash
# From backend/ directory
cd backend

# Start FastAPI server
uvicorn src.vla.api.main:app --reload --port 8000

# In another terminal, start ROS 2 action executor node
source ~/vla_ws/install/setup.bash
ros2 run vla_ros action_executor_node
```

## Step 6: Test API Endpoints

```bash
# Test Whisper transcription
curl -X POST "http://localhost:8000/api/v1/whisper/transcribe" \
  -F "audio_file=@test_audio.wav"

# Test cognitive planning
curl -X POST "http://localhost:8000/api/v1/plan/generate" \
  -H "Content-Type: application/json" \
  -d '{"command": "move forward 1 meter"}'

# Test RAG chatbot
curl -X POST "http://localhost:8000/api/v1/chat/query" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test_session",
    "message": "How does Whisper work?",
    "chapter_context": "chapter-4"
  }'
```

## Step 7: Setup Docusaurus Frontend

```bash
# From Book/ directory
cd Book

# Install dependencies
npm install

# Start development server
npm start

# Open http://localhost:3000
```

## Step 8: Generate Chapter 4 Embeddings

```bash
# From backend/ directory
cd backend

# Run script to generate embeddings for Chapter 4 content
python scripts/generate_embeddings.py --chapter chapter-4

# Embeddings will be stored in Qdrant
```

## Step 9: Test End-to-End VLA Pipeline

```bash
# Record a test audio file
# "move forward 1 meter"

# Process through VLA pipeline
curl -X POST "http://localhost:8000/api/v1/vla/process" \
  -F "input_type=voice" \
  -F "audio_file=@test_command.wav" \
  -F "robot_id=humanoid_01" \
  -F "execute=true"

# Check execution status
# (Implementation will provide status endpoint or WebSocket)
```

## Step 10: Access Chapter 4 in Docusaurus

1. Navigate to `http://localhost:3000/docs/chapter-4/introduction`
2. Test RAG chatbot widget (should appear on page)
3. Click "Personalize" button to see content adaptation
4. Click "Translate to Urdu" to see translation

## Troubleshooting

### OpenAI API Errors
- Verify API key is correct
- Check API rate limits
- Ensure sufficient credits

### ROS 2 Connection Issues
- Verify ROS 2 is sourced: `source /opt/ros/humble/setup.bash`
- Check ROS_DOMAIN_ID matches across processes
- Verify custom messages are built: `ros2 interface list | grep vla`

### Database Connection Errors
- Verify Neon connection string format
- Check Qdrant is running (if local): `curl http://localhost:6333/health`
- Verify network access to cloud services

### FastAPI Not Starting
- Check port 8000 is not in use
- Verify all dependencies installed: `pip list`
- Check Python version: `python --version` (should be 3.10+)

## Next Steps

- Complete hands-on lab: "Build a Conversational Humanoid"
- Review API documentation: `http://localhost:8000/docs` (Swagger UI)
- Explore chapter content in Docusaurus
- Experiment with different voice commands
- Customize personalization profiles

## Development Workflow

1. **Backend Changes**: Edit Python code in `backend/src/vla/`, restart FastAPI
2. **ROS 2 Changes**: Edit messages in `vla_ros/`, rebuild: `colcon build`
3. **Frontend Changes**: Edit React components in `Book/src/components/`, Docusaurus auto-reloads
4. **Chapter Content**: Edit markdown in `Book/docs/chapter-4/`, Docusaurus auto-reloads

## Resources

- API Documentation: http://localhost:8000/docs
- ROS 2 Documentation: https://docs.ros.org/
- Docusaurus Docs: https://docusaurus.io/docs
- OpenAI API Docs: https://platform.openai.com/docs


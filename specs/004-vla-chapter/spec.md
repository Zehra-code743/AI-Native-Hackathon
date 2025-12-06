# Feature Specification: Chapter 4 - Vision-Language-Action (VLA) Systems

**Feature Branch**: `004-vla-chapter`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "Create a complete `sp.specify` file for **Chapter 4: Vision-Language-Action (VLA)** of my Physical AI & Humanoid Robotics textbook. Vision-Language-Action systems that connect natural language → perception → robot actions using OpenAI Whisper for Voice-to-Text, LLM-based Cognitive Planning (natural language → ROS 2 action graph), ROS 2 action executor, NVIDIA Isaac perception modules (optional), and book integrations: RAG chatbot, Personalize button, Translate-to-Urdu button."

## Metadata

- **Chapter Number**: 4
- **Chapter Title**: Vision-Language-Action (VLA) Systems
- **Module**: Module 4 - Vision-Language-Action
- **Prerequisites**: Chapters 1-3 (ROS 2 Fundamentals, Digital Twins, AI-Robot Brain)
- **Estimated Reading Time**: 4-6 hours
- **Hands-on Lab Time**: 6-8 hours
- **Difficulty Level**: Advanced
- **Target Audience**: Robotics/AI students, educators, academic instructors

## Chapter Summary

Chapter 4 introduces Vision-Language-Action (VLA) systems, which enable robots to understand natural language commands, perceive their environment through vision, and execute complex action sequences. This chapter covers the complete pipeline from voice input (OpenAI Whisper) through cognitive planning (LLM-based) to safe ROS 2 action execution. Students will learn how to build end-to-end conversational robotics systems that can interpret "pick up the red cup" or "navigate to the kitchen" and translate these into executable robot behaviors. The chapter integrates perception data (camera depth, object IDs) with planning, implements safety constraints in action execution, and demonstrates how VLA enables full conversational robotics. Additionally, the chapter includes in-book RAG chatbot integration, personalized content generation, and Urdu translation capabilities.

## Learning Objectives

Upon completing this chapter, students will be able to:

1. **LO-001**: Explain how Vision-Language-Action systems bridge natural language understanding, visual perception, and robotic control
2. **LO-002**: Implement voice-to-text conversion using OpenAI Whisper API and integrate it with ROS 2 systems
3. **LO-003**: Design and implement an LLM-based cognitive planner that converts natural language commands into structured ROS 2 action graphs
4. **LO-004**: Connect perception data (camera depth, object detection IDs) to cognitive planning for context-aware action generation
5. **LO-005**: Implement a safe ROS 2 action executor with motion constraints, collision avoidance, and error recovery
6. **LO-006**: Integrate NVIDIA Isaac perception modules (optional) for advanced visual processing in VLA pipelines
7. **LO-007**: Build an end-to-end VLA system that processes voice commands, generates action plans, and executes them safely
8. **LO-008**: Understand ethical considerations and safety constraints in conversational robotics
9. **LO-009**: Use the in-book RAG chatbot to query VLA concepts and receive contextual answers
10. **LO-010**: Access personalized content variations and Urdu translations of chapter materials

## Success Criteria

### Measurable Outcomes

- **SC-001**: Students can successfully convert a voice command to text using Whisper API with >95% accuracy for clear audio input
- **SC-002**: Cognitive planner generates valid ROS 2 action sequences for 90% of common natural language commands (e.g., "go to X", "pick up Y", "place Z on W")
- **SC-003**: Action executor successfully executes planned sequences with zero unsafe motions (collisions, joint limit violations, workspace boundary violations)
- **SC-004**: End-to-end VLA pipeline processes voice command → action execution in <5 seconds for simple commands, <15 seconds for complex multi-step tasks
- **SC-005**: Perception connector correctly maps object names to 3D coordinates with <10cm accuracy in simulation
- **SC-006**: RAG chatbot provides relevant answers to VLA-related queries with >80% user satisfaction (measured via feedback)
- **SC-007**: Personalized content generator adapts chapter content based on user profile (experience level, preferred learning style)
- **SC-008**: Urdu translation button successfully translates chapter content with grammatical correctness verified by native speakers
- **SC-009**: All code examples are reproducible and execute without errors in provided simulation environment
- **SC-010**: Students complete hands-on lab: "Build a Conversational Humanoid" with all checkpoints passing

## User Scenarios & Testing

### User Story 1 - Voice Command to Robot Action (Priority: P1)

As a student, I want to speak a natural language command and have the robot execute the corresponding action, so that I can interact with robots using conversational language.

**Why this priority**: Core functionality of VLA systems - without this, the chapter's main learning objective cannot be achieved.

**Independent Test**: Can be fully tested by recording a voice command "move forward 1 meter", processing it through Whisper → Cognitive Planner → Action Executor, and observing the robot moving forward exactly 1 meter in simulation.

**Acceptance Scenarios**:

1. **Given** a running ROS 2 simulation with a humanoid robot, **When** I speak "move forward 1 meter" into the microphone, **Then** the robot moves forward 1 meter and stops
2. **Given** a voice command "pick up the red cup", **When** the system processes it, **Then** the cognitive planner generates a sequence: [locate_object("red cup"), navigate_to_object(), grasp_object("red cup")]
3. **Given** an ambiguous command "go there", **When** the system processes it, **Then** the system requests clarification or uses visual context to disambiguate

---

### User Story 2 - Cognitive Planning from Natural Language (Priority: P1)

As a student, I want the system to convert my natural language instructions into step-by-step robot action plans, so that I can command complex behaviors without programming each step.

**Why this priority**: Essential for demonstrating how LLMs enable high-level robot control - core learning objective.

**Independent Test**: Can be fully tested by providing text input "navigate to the kitchen, then pick up the apple on the counter" and verifying the planner outputs a valid ROS 2 action graph with correct sequence and dependencies.

**Acceptance Scenarios**:

1. **Given** the text command "navigate to the kitchen", **When** the cognitive planner processes it, **Then** it generates a ROS 2 action graph with nodes: [get_current_pose(), get_goal_pose("kitchen"), plan_path(), execute_navigation()]
2. **Given** a multi-step command "pick up the cup and place it on the table", **When** the planner processes it, **Then** it generates a sequential action graph with proper dependencies and object references
3. **Given** an impossible command "fly to the moon", **When** the planner processes it, **Then** it returns an error message explaining the constraint violation

---

### User Story 3 - Safe Action Execution with Constraints (Priority: P1)

As a student, I want the action executor to prevent unsafe robot motions, so that I can experiment with VLA systems without risking damage or collisions.

**Why this priority**: Safety is critical in robotics - students must learn to implement safety constraints.

**Independent Test**: Can be fully tested by attempting to execute an action that would cause a collision or joint limit violation, and verifying the executor rejects it with an appropriate error message.

**Acceptance Scenarios**:

1. **Given** an action plan that would cause a collision, **When** the executor validates it, **Then** the action is rejected and an error is returned before execution
2. **Given** an action that exceeds joint limits, **When** the executor checks constraints, **Then** the action is clamped to safe limits or rejected
3. **Given** a valid action sequence, **When** the executor runs it, **Then** all actions complete successfully with status feedback for each step

---

### User Story 4 - Perception-Planning Integration (Priority: P2)

As a student, I want the system to use visual perception data (object locations, depth) when generating action plans, so that commands can reference objects in the environment.

**Why this priority**: Demonstrates how perception and planning integrate - important for understanding VLA architecture.

**Independent Test**: Can be fully tested by issuing command "pick up the red cup" when a red cup is visible in the camera feed, and verifying the planner uses the cup's 3D coordinates from perception.

**Acceptance Scenarios**:

1. **Given** a command "pick up the red cup" and a camera feed showing a red cup at coordinates (x, y, z), **When** the planner processes it, **Then** it uses the cup's coordinates in the generated action plan
2. **Given** a command referencing an object not in view, **When** the system processes it, **Then** it either requests the robot to search for the object or returns an error
3. **Given** multiple objects matching a description, **When** the system processes the command, **Then** it either uses the closest object or requests disambiguation

---

### User Story 5 - RAG Chatbot for VLA Learning (Priority: P2)

As a student, I want to ask questions about VLA concepts using an in-book chatbot, so that I can get instant clarification while reading.

**Why this priority**: Enhances learning experience and demonstrates RAG integration - part of book's AI-native features.

**Independent Test**: Can be fully tested by asking the chatbot "How does Whisper convert speech to text?" and receiving a relevant answer with citations to chapter content.

**Acceptance Scenarios**:

1. **Given** I am reading Chapter 4, **When** I ask the chatbot "What is cognitive planning?", **Then** I receive an answer explaining cognitive planning with references to relevant sections
2. **Given** I ask a question about code examples, **When** the chatbot responds, **Then** it provides code snippets or explanations from the chapter
3. **Given** I ask an off-topic question, **When** the chatbot responds, **Then** it either redirects to relevant content or indicates the question is outside the chapter scope

---

### User Story 6 - Personalized Content and Urdu Translation (Priority: P3)

As a student, I want to access personalized content variations and Urdu translations of the chapter, so that I can learn in my preferred style and language.

**Why this priority**: Accessibility and personalization features - important for diverse learning needs but not core to VLA concepts.

**Independent Test**: Can be fully tested by clicking the "Personalize" button and seeing content adapt to my profile, and clicking "Translate to Urdu" to see the chapter in Urdu.

**Acceptance Scenarios**:

1. **Given** I have a beginner profile, **When** I click "Personalize", **Then** code examples show simplified versions with more comments
2. **Given** I click "Translate to Urdu", **When** the translation completes, **Then** the entire chapter content is displayed in grammatically correct Urdu
3. **Given** I switch between personalized and standard views, **When** I toggle the setting, **Then** content updates dynamically without page reload

---

### Edge Cases

- What happens when Whisper API is unavailable or returns an error?
- How does the system handle noisy audio input or multiple speakers?
- What if the cognitive planner generates an invalid ROS 2 action graph?
- How does the executor handle partial action failures (some steps succeed, others fail)?
- What happens when perception data is stale or unavailable during planning?
- How does the system handle commands that require information not available in current perception?
- What if the RAG chatbot cannot find relevant content for a query?
- How does personalization handle users with no profile data?
- What happens if Urdu translation fails or produces incorrect grammar?

## Requirements

### Functional Requirements

- **FR-001**: System MUST accept audio input (microphone or file) and convert it to text using OpenAI Whisper API
- **FR-002**: System MUST provide a FastAPI endpoint `/api/v1/whisper/transcribe` that accepts audio and returns transcribed text
- **FR-003**: System MUST implement a cognitive planner that converts natural language text into structured ROS 2 action graphs
- **FR-004**: System MUST provide a FastAPI endpoint `/api/v1/plan/generate` that accepts text commands and returns action graphs
- **FR-005**: System MUST implement a perception connector that maps object names to 3D coordinates from camera/depth data
- **FR-006**: System MUST provide a FastAPI endpoint `/api/v1/perception/query` that accepts object names and returns coordinates
- **FR-007**: System MUST implement a ROS 2 action executor that validates and executes action sequences with safety constraints
- **FR-008**: System MUST prevent execution of actions that would cause collisions, joint limit violations, or workspace boundary violations
- **FR-009**: System MUST provide status feedback for each action execution step (pending, executing, completed, failed)
- **FR-010**: System MUST integrate NVIDIA Isaac perception modules (optional) for advanced visual processing
- **FR-011**: System MUST provide a FastAPI endpoint `/api/v1/execute/action` that accepts action graphs and returns execution status
- **FR-012**: System MUST implement an end-to-end VLA pipeline that chains Whisper → Planner → Executor
- **FR-013**: System MUST provide a FastAPI endpoint `/api/v1/vla/process` that accepts voice/text and returns execution results
- **FR-014**: Docusaurus chapter MUST include an embedded RAG chatbot component using OpenAI Agents SDK
- **FR-015**: RAG chatbot MUST use Neon (PostgreSQL) for storing conversation history and Qdrant for vector embeddings
- **FR-016**: System MUST provide a FastAPI endpoint `/api/v1/chat/query` that accepts questions and returns RAG-generated answers
- **FR-017**: Docusaurus chapter MUST include a "Personalize" button that adapts content based on user profile
- **FR-018**: System MUST provide a FastAPI endpoint `/api/v1/personalize/content` that accepts user profile and returns personalized content
- **FR-019**: Docusaurus chapter MUST include a "Translate to Urdu" button that translates chapter content
- **FR-020**: System MUST provide a FastAPI endpoint `/api/v1/translate/urdu` that accepts text and returns Urdu translation
- **FR-021**: Translation service MUST use a subagent to ensure grammatical correctness and context preservation
- **FR-022**: All FastAPI endpoints MUST include proper error handling, input validation, and logging
- **FR-023**: All ROS 2 nodes MUST follow ROS 2 best practices (lifecycle management, QoS settings, parameter declarations)
- **FR-024**: System MUST include comprehensive code examples with comments and explanations
- **FR-025**: System MUST provide a hands-on lab: "Build a Conversational Humanoid" with step-by-step instructions

### Key Entities

- **VoiceCommand**: Audio input (file or stream) containing natural language instruction from user
- **TranscribedText**: Text output from Whisper API representing the voice command
- **ActionGraph**: Directed graph structure representing a sequence of ROS 2 actions with dependencies and parameters
- **ActionNode**: Individual action in the graph (e.g., navigate_to, grasp_object, place_object) with inputs, outputs, and constraints
- **PerceptionData**: Visual information including object detections, depth maps, camera frames with metadata (timestamp, frame_id)
- **ObjectDetection**: Detected object with name, 3D coordinates (x, y, z), confidence score, and bounding box
- **ExecutionStatus**: Status of action execution (pending, executing, completed, failed) with error messages and timestamps
- **UserProfile**: User preferences including experience level (beginner/intermediate/advanced), learning style, preferred language
- **ChatMessage**: RAG chatbot message with query, response, sources, and session ID
- **PersonalizedContent**: Content variation adapted to user profile with flags for complexity, detail level, code style
- **TranslationRequest**: Request for content translation with source text, target language (Urdu), and context

## Acceptance Tests

### AT-001: Whisper Voice-to-Text
- **Given** an audio file containing "move forward 2 meters"
- **When** the `/api/v1/whisper/transcribe` endpoint is called with the audio file
- **Then** the response contains transcribed text "move forward 2 meters" with >95% accuracy

### AT-002: Cognitive Planner - Simple Command
- **Given** the text command "go to the kitchen"
- **When** the `/api/v1/plan/generate` endpoint is called with the command
- **Then** the response contains a valid ROS 2 action graph with nodes: [get_pose(), plan_path("kitchen"), execute_navigation()]

### AT-003: Cognitive Planner - Complex Command
- **Given** the text command "pick up the red cup and place it on the table"
- **When** the `/api/v1/plan/generate` endpoint is called
- **Then** the response contains an action graph with sequential dependencies: [locate_object("red cup"), navigate_to_object(), grasp_object(), navigate_to("table"), place_object()]

### AT-004: Perception Connector
- **Given** a camera feed showing a red cup at coordinates (1.5, 0.3, 0.8)
- **When** the `/api/v1/perception/query` endpoint is called with object_name="red cup"
- **Then** the response contains coordinates (1.5, 0.3, 0.8) with confidence >0.8

### AT-005: Safe Action Executor - Collision Prevention
- **Given** an action plan that would cause a collision with an obstacle
- **When** the `/api/v1/execute/action` endpoint is called with the plan
- **Then** the response indicates the action was rejected with error code "COLLISION_RISK"

### AT-006: Safe Action Executor - Joint Limit Protection
- **Given** an action that would exceed joint limits
- **When** the executor validates the action
- **Then** the action is either clamped to safe limits or rejected with error "JOINT_LIMIT_EXCEEDED"

### AT-007: End-to-End VLA Pipeline
- **Given** a voice command "move forward 1 meter" recorded in an audio file
- **When** the `/api/v1/vla/process` endpoint is called with the audio file
- **Then** the robot moves forward 1 meter in simulation within 5 seconds, and the response contains execution status "completed"

### AT-008: RAG Chatbot Query
- **Given** a question "How does Whisper convert speech to text?"
- **When** the `/api/v1/chat/query` endpoint is called with the question and chapter_context="chapter-4"
- **Then** the response contains a relevant answer with at least one source citation to Chapter 4 content

### AT-009: Personalization
- **Given** a user profile with experience_level="beginner"
- **When** the `/api/v1/personalize/content` endpoint is called with chapter_id="chapter-4" and the profile
- **Then** the response contains simplified code examples with additional comments and explanations

### AT-010: Urdu Translation
- **Given** English text "Vision-Language-Action systems enable robots to understand natural language"
- **When** the `/api/v1/translate/urdu` endpoint is called with the text
- **Then** the response contains grammatically correct Urdu translation verified by native speaker review

## Required Features

### Core VLA Features

1. **Whisper Integration**
   - Audio input handling (file upload, microphone stream)
   - OpenAI Whisper API integration
   - Error handling for API failures
   - Support for multiple audio formats (WAV, MP3, FLAC)

2. **Cognitive Planner**
   - LLM integration (OpenAI GPT-4 or similar)
   - Natural language to ROS 2 action graph conversion
   - Action dependency resolution
   - Parameter extraction from commands
   - Error handling for ambiguous/impossible commands

3. **Perception Connector**
   - Object detection integration (YOLO, Isaac perception, or similar)
   - Depth camera data processing
   - Object name to coordinate mapping
   - Confidence scoring
   - Temporal data handling (stale data detection)

4. **ROS 2 Action Executor**
   - Action graph parsing and validation
   - Safety constraint checking (collisions, joint limits, workspace boundaries)
   - Sequential action execution with status tracking
   - Error recovery mechanisms
   - ROS 2 lifecycle management

5. **End-to-End Pipeline**
   - Voice → Text → Plan → Execute workflow
   - Status monitoring and feedback
   - Error propagation and handling
   - Logging and debugging support

### Book Integration Features

6. **RAG Chatbot**
   - OpenAI Agents SDK integration
   - Neon PostgreSQL for conversation history
   - Qdrant vector database for embeddings
   - Chapter-specific context retrieval
   - Source citation in responses

7. **Personalization**
   - User profile management
   - Content adaptation based on experience level
   - Code example variations (simplified/advanced)
   - Learning style preferences
   - Dynamic content rendering in Docusaurus

8. **Urdu Translation**
   - Translation subagent for quality control
   - Context-aware translation
   - Technical term preservation
   - Grammatical correctness validation
   - Docusaurus i18n integration

## Implementation Plan

### Phase 1: Foundation - Whisper Integration (Week 1)
- Set up FastAPI backend structure
- Integrate OpenAI Whisper API
- Create `/api/v1/whisper/transcribe` endpoint
- Implement audio preprocessing and format conversion
- Add error handling and logging
- Create unit tests for transcription accuracy

### Phase 2: Cognitive Planning (Week 1-2)
- Design action graph data structure
- Integrate LLM (OpenAI GPT-4) for planning
- Implement natural language parsing and intent extraction
- Create action graph generator with dependency resolution
- Build `/api/v1/plan/generate` endpoint
- Add validation for generated action graphs
- Create test cases for various command types

### Phase 3: Perception Integration (Week 2)
- Integrate object detection (YOLO or Isaac perception)
- Implement depth camera data processing
- Create object name to coordinate mapping service
- Build `/api/v1/perception/query` endpoint
- Add confidence scoring and stale data detection
- Test with simulated camera feeds

### Phase 4: ROS 2 Action Executor (Week 2-3)
- Design safety constraint system (collision detection, joint limits, workspace boundaries)
- Implement ROS 2 action executor node
- Create action validation logic
- Build sequential execution engine with status tracking
- Implement error recovery mechanisms
- Create `/api/v1/execute/action` endpoint
- Add comprehensive safety tests

### Phase 5: End-to-End VLA Pipeline (Week 3)
- Integrate Whisper → Planner → Executor workflow
- Build `/api/v1/vla/process` endpoint
- Implement status monitoring and feedback
- Add end-to-end error handling
- Create integration tests
- Performance optimization

### Phase 6: RAG Chatbot Integration (Week 3-4)
- Set up Neon PostgreSQL database
- Set up Qdrant vector database
- Generate embeddings for Chapter 4 content
- Integrate OpenAI Agents SDK
- Build `/api/v1/chat/query` endpoint
- Create Docusaurus chatbot React component
- Implement conversation history management
- Add source citation in responses

### Phase 7: Personalization (Week 4)
- Design user profile data model
- Implement content adaptation logic
- Create code example variations
- Build `/api/v1/personalize/content` endpoint
- Create Docusaurus "Personalize" button component
- Implement client-side profile storage
- Test with different user profiles

### Phase 8: Urdu Translation (Week 4)
- Set up translation subagent
- Implement context-aware translation
- Build `/api/v1/translate/urdu` endpoint
- Create Docusaurus "Translate to Urdu" button
- Integrate with Docusaurus i18n
- Validate translations with native speakers
- Test technical term preservation

### Phase 9: Documentation and Lab (Week 4-5)
- Write chapter content with code examples
- Create hands-on lab: "Build a Conversational Humanoid"
- Add architectural diagrams
- Write API documentation
- Create troubleshooting guide
- Final testing and bug fixes

## Tasks

### T001 [P1] [US1] Set up FastAPI backend structure for VLA chapter
- Create `backend/src/vla/` directory structure
- Initialize FastAPI application with proper routing
- Set up logging and error handling middleware
- Create requirements.txt with dependencies
- **Acceptance**: FastAPI server starts and responds to health check

### T002 [P1] [US1] Integrate OpenAI Whisper API
- Install openai Python package
- Create `backend/src/vla/services/whisper_service.py`
- Implement audio file upload handling
- Implement Whisper API call with error handling
- Add support for multiple audio formats (WAV, MP3, FLAC)
- **Acceptance**: Can transcribe a test audio file with >95% accuracy

### T003 [P1] [US1] Create `/api/v1/whisper/transcribe` FastAPI endpoint
- Create `backend/src/vla/api/endpoints/whisper.py`
- Define Pydantic models for request/response
- Implement audio file upload endpoint
- Add input validation and error responses
- Write API documentation with examples
- **Acceptance**: Endpoint accepts audio file and returns transcribed text

### T004 [P1] [US2] Design action graph data structure
- Create `backend/src/vla/models/action_graph.py`
- Define ActionNode class with inputs, outputs, constraints
- Define ActionGraph class with nodes and dependencies
- Implement graph serialization (JSON)
- Add validation methods
- **Acceptance**: Can create and validate a simple action graph

### T005 [P1] [US2] Integrate LLM for cognitive planning
- Install openai package (if not already)
- Create `backend/src/vla/services/cognitive_planner.py`
- Implement prompt engineering for action graph generation
- Add LLM API call with retry logic
- Parse LLM response into ActionGraph structure
- **Acceptance**: LLM generates valid action graph for "go to kitchen"

### T006 [P1] [US2] Implement natural language parsing
- Create `backend/src/vla/services/nlp_parser.py`
- Implement intent extraction (navigate, grasp, place, etc.)
- Extract parameters (object names, locations, distances)
- Handle ambiguous commands with clarification requests
- **Acceptance**: Correctly parses "pick up the red cup" → intent=grasp, object="red cup"

### T007 [P1] [US2] Create `/api/v1/plan/generate` FastAPI endpoint
- Create `backend/src/vla/api/endpoints/planner.py`
- Define Pydantic models for planning requests
- Integrate cognitive planner service
- Add error handling for invalid commands
- Write API documentation
- **Acceptance**: Endpoint accepts text command and returns action graph

### T008 [P2] [US4] Integrate object detection for perception
- Choose object detection model (YOLO or Isaac perception)
- Create `backend/src/vla/services/perception_service.py`
- Implement object detection inference
- Process camera frames and extract detections
- **Acceptance**: Can detect objects in test camera image

### T009 [P2] [US4] Implement depth camera data processing
- Create `backend/src/vla/services/depth_processor.py`
- Integrate depth camera data (ROS 2 topics or API)
- Implement coordinate transformation (pixel → 3D)
- Add depth data validation
- **Acceptance**: Can convert pixel coordinates to 3D world coordinates

### T010 [P2] [US4] Create object name to coordinate mapping
- Create `backend/src/vla/services/object_mapper.py`
- Implement object name matching (fuzzy matching for variations)
- Combine detection results with depth data
- Add confidence scoring
- Implement stale data detection (timestamp-based)
- **Acceptance**: Maps "red cup" to correct 3D coordinates from perception

### T011 [P2] [US4] Create `/api/v1/perception/query` FastAPI endpoint
- Create `backend/src/vla/api/endpoints/perception.py`
- Define Pydantic models for perception queries
- Integrate object mapper service
- Add error handling for objects not found
- Write API documentation
- **Acceptance**: Endpoint accepts object name and returns coordinates

### T012 [P1] [US3] Design safety constraint system
- Create `backend/src/vla/services/safety_validator.py`
- Implement collision detection logic (using collision models or simulation)
- Implement joint limit checking
- Implement workspace boundary validation
- Define safety error types
- **Acceptance**: Can validate actions and detect unsafe conditions

### T013 [P1] [US3] Implement ROS 2 action executor node
- Create `backend/src/vla/ros_nodes/action_executor_node.py`
- Implement ROS 2 node with lifecycle management
- Create action execution state machine
- Implement sequential action execution
- Add status publishing (ROS 2 topics)
- **Acceptance**: ROS 2 node starts and can execute a simple action

### T014 [P1] [US3] Create action validation logic
- Integrate safety validator into executor
- Implement pre-execution validation
- Add runtime monitoring during execution
- Implement action clamping for minor violations
- Add rejection logic for major violations
- **Acceptance**: Executor rejects unsafe actions before execution

### T015 [P1] [US3] Build `/api/v1/execute/action` FastAPI endpoint
- Create `backend/src/vla/api/endpoints/executor.py`
- Define Pydantic models for execution requests
- Integrate ROS 2 action executor
- Add status polling or WebSocket for real-time updates
- Implement error handling and timeout management
- **Acceptance**: Endpoint accepts action graph and returns execution status

### T016 [P1] [US1,US2,US3] Integrate end-to-end VLA pipeline
- Create `backend/src/vla/services/vla_pipeline.py`
- Chain Whisper → Planner → Executor services
- Implement status monitoring and feedback
- Add error propagation and recovery
- Create `/api/v1/vla/process` endpoint
- **Acceptance**: Voice command processes end-to-end and robot executes action

### T017 [P2] [US5] Set up RAG infrastructure (Neon + Qdrant)
- Set up Neon PostgreSQL database for conversation history
- Set up Qdrant vector database for embeddings
- Create database schemas and connection utilities
- Generate embeddings for Chapter 4 markdown content
- Store embeddings in Qdrant with metadata
- **Acceptance**: Can query Qdrant and retrieve relevant chapter content

### T018 [P2] [US5] Integrate OpenAI Agents SDK for RAG
- Install OpenAI Agents SDK
- Create `backend/src/vla/services/rag_service.py`
- Implement RAG query processing with Agents SDK
- Integrate Qdrant vector search
- Implement response generation with source citations
- **Acceptance**: RAG service returns answers with source citations

### T019 [P2] [US5] Create `/api/v1/chat/query` FastAPI endpoint
- Create `backend/src/vla/api/endpoints/chat.py`
- Define Pydantic models for chat requests/responses
- Integrate RAG service
- Implement conversation history management (Neon)
- Add session management
- Write API documentation
- **Acceptance**: Endpoint accepts question and returns RAG answer

### T020 [P2] [US5] Create Docusaurus RAG chatbot React component
- Create `Book/src/components/VLAChatbot/index.tsx`
- Implement chat UI with message history
- Integrate with `/api/v1/chat/query` endpoint
- Display source citations in responses
- Add loading states and error handling
- **Acceptance**: Chatbot component renders and can query backend

### T021 [P3] [US6] Implement personalization service
- Create `backend/src/vla/services/personalization_service.py`
- Design user profile data model
- Implement content adaptation logic (code examples, explanations)
- Create content variation templates
- Build `/api/v1/personalize/content` endpoint
- **Acceptance**: Service adapts content based on user profile

### T022 [P3] [US6] Create Docusaurus "Personalize" button component
- Create `Book/src/components/PersonalizeButton/index.tsx`
- Implement client-side profile storage (localStorage)
- Create profile selection UI
- Integrate with personalization API
- Implement dynamic content rendering
- **Acceptance**: Button toggles personalized content in chapter

### T023 [P3] [US6] Implement Urdu translation subagent
- Create `backend/src/vla/services/translation_subagent.py`
- Set up translation service (OpenAI or Google Translate API)
- Implement context-aware translation
- Add technical term preservation logic
- Implement grammatical correctness validation
- **Acceptance**: Subagent produces grammatically correct Urdu translations

### T024 [P3] [US6] Create `/api/v1/translate/urdu` FastAPI endpoint
- Create `backend/src/vla/api/endpoints/translation.py`
- Define Pydantic models for translation requests
- Integrate translation subagent
- Add error handling and validation
- Write API documentation
- **Acceptance**: Endpoint accepts English text and returns Urdu translation

### T025 [P3] [US6] Create Docusaurus "Translate to Urdu" button
- Create `Book/src/components/TranslateButton/index.tsx`
- Integrate with Docusaurus i18n system
- Implement chapter content translation on demand
- Add loading states and error handling
- Test with native speaker validation
- **Acceptance**: Button translates chapter content to Urdu

### T026 [P1] Write Chapter 4 content with code examples
- Create `Book/docs/chapter-4/` directory
- Write introduction and VLA fundamentals section
- Write Whisper integration section with code examples
- Write cognitive planning section with examples
- Write perception integration section
- Write action executor section
- Write end-to-end pipeline section
- Add architectural diagrams (Mermaid or images)
- **Acceptance**: Complete chapter content with all sections

### T027 [P1] Create hands-on lab: "Build a Conversational Humanoid"
- Create `Book/docs/chapter-4/hands-on-lab-conversational-humanoid.md`
- Write step-by-step lab instructions
- Include setup requirements and prerequisites
- Add code snippets for each step
- Create checkpoints with verification steps
- Add troubleshooting section
- **Acceptance**: Lab can be completed by students with all checkpoints passing

### T028 [P1] Create architectural diagram
- Design VLA system architecture diagram
- Show data flow: Voice → Whisper → Planner → Perception → Executor → Robot
- Include API endpoints and services
- Create diagram using Mermaid or image tool
- Embed in chapter content
- **Acceptance**: Diagram clearly shows VLA system architecture

### T029 [P1] Write API documentation
- Document all FastAPI endpoints with OpenAPI/Swagger
- Add request/response examples
- Document error codes and handling
- Create API usage guide
- **Acceptance**: Complete API documentation accessible via Swagger UI

### T030 [P1] Create comprehensive tests
- Write unit tests for all services
- Write integration tests for API endpoints
- Write end-to-end tests for VLA pipeline
- Add test fixtures and mock data
- Achieve >80% code coverage
- **Acceptance**: All tests pass and coverage meets threshold

## Glossary

- **Action Graph**: A directed graph structure representing a sequence of robot actions with dependencies, where nodes are actions and edges represent execution order or data flow
- **Cognitive Planning**: The process of converting high-level natural language commands into structured, executable robot action sequences using Large Language Models
- **Joint Limits**: Physical constraints on robot joint angles that prevent damage to motors or mechanical components
- **Neon**: Serverless PostgreSQL database service used for storing conversation history in the RAG chatbot
- **Perception Connector**: A service that bridges visual perception data (object detections, depth maps) with cognitive planning by mapping object names to 3D coordinates
- **Qdrant**: Vector database used for storing and querying embeddings of textbook content for RAG (Retrieval-Augmented Generation)
- **RAG (Retrieval-Augmented Generation)**: An AI technique that enhances LLM responses by retrieving relevant context from a knowledge base (textbook content) before generating answers
- **ROS 2 Action**: A ROS 2 communication pattern for long-running tasks with feedback, cancellation, and result reporting
- **Safety Constraints**: Rules that prevent unsafe robot motions, including collision avoidance, joint limit enforcement, and workspace boundary checking
- **VLA (Vision-Language-Action)**: A system architecture that connects visual perception, natural language understanding, and robotic action execution
- **Whisper**: OpenAI's automatic speech recognition (ASR) system that converts spoken language into text
- **Workspace Boundary**: The physical limits of the robot's operating area, beyond which the robot should not move

## Subagents & Skills

### Translation Subagent
- **Purpose**: Ensure high-quality Urdu translations with grammatical correctness and context preservation
- **Skills**:
  - Natural language translation (English → Urdu)
  - Technical terminology preservation
  - Context-aware translation (maintains meaning in robotics context)
  - Grammatical validation
  - Cultural adaptation (when appropriate)
- **Integration**: Called by `/api/v1/translate/urdu` endpoint before returning translation
- **Output**: Validated Urdu translation with quality score

### Content Personalization Subagent
- **Purpose**: Adapt chapter content based on user learning profile
- **Skills**:
  - Code complexity analysis
  - Content simplification (for beginners)
  - Content enhancement (for advanced users)
  - Learning style adaptation (visual, textual, hands-on)
  - Terminology level adjustment
- **Integration**: Called by `/api/v1/personalize/content` endpoint
- **Output**: Personalized content variations with adaptation flags

### Safety Validation Subagent (Optional Enhancement)
- **Purpose**: Advanced safety analysis beyond basic constraint checking
- **Skills**:
  - Trajectory analysis for collision prediction
  - Dynamic obstacle avoidance planning
  - Energy consumption estimation
  - Stability analysis for humanoid robots
- **Integration**: Could be integrated into safety validator service
- **Output**: Enhanced safety analysis with recommendations

## API Endpoints

### Whisper Service

#### POST `/api/v1/whisper/transcribe`
- **Description**: Converts audio input to text using OpenAI Whisper
- **Request Body**:
  ```json
  {
    "audio_file": "<base64_encoded_audio>",
    "audio_format": "wav|mp3|flac",
    "language": "en" // optional, auto-detect if not provided
  }
  ```
- **Response**:
  ```json
  {
    "transcribed_text": "move forward 1 meter",
    "confidence": 0.95,
    "language": "en",
    "duration_seconds": 2.3
  }
  ```
- **Error Codes**: `400` (Invalid audio format), `500` (Whisper API error), `503` (Service unavailable)

### Cognitive Planning Service

#### POST `/api/v1/plan/generate`
- **Description**: Generates ROS 2 action graph from natural language command
- **Request Body**:
  ```json
  {
    "command": "pick up the red cup and place it on the table",
    "robot_context": {
      "current_pose": {"x": 0.0, "y": 0.0, "z": 0.0},
      "available_actions": ["navigate", "grasp", "place"]
    }
  }
  ```
- **Response**:
  ```json
  {
    "action_graph": {
      "nodes": [
        {
          "id": "locate_cup",
          "type": "perception_query",
          "parameters": {"object_name": "red cup"}
        },
        {
          "id": "navigate_to_cup",
          "type": "navigate",
          "dependencies": ["locate_cup"],
          "parameters": {"target": "{{locate_cup.output.coordinates}}"}
        }
      ],
      "edges": [{"from": "locate_cup", "to": "navigate_to_cup"}]
    },
    "confidence": 0.88,
    "estimated_duration_seconds": 15.0
  }
  ```
- **Error Codes**: `400` (Invalid command), `422` (Ambiguous command), `500` (Planning error)

### Perception Service

#### POST `/api/v1/perception/query`
- **Description**: Queries perception system for object coordinates
- **Request Body**:
  ```json
  {
    "object_name": "red cup",
    "camera_frame_id": "camera_depth_frame",
    "timeout_seconds": 5.0
  }
  ```
- **Response**:
  ```json
  {
    "object_found": true,
    "coordinates": {"x": 1.5, "y": 0.3, "z": 0.8},
    "confidence": 0.92,
    "timestamp": "2025-01-27T10:30:00Z",
    "bounding_box": {"x_min": 100, "y_min": 200, "x_max": 150, "y_max": 250}
  }
  ```
- **Error Codes**: `404` (Object not found), `408` (Timeout), `500` (Perception error)

### Action Execution Service

#### POST `/api/v1/execute/action`
- **Description**: Executes a ROS 2 action graph with safety validation
- **Request Body**:
  ```json
  {
    "action_graph": { /* ActionGraph structure */ },
    "robot_id": "humanoid_01",
    "timeout_seconds": 30.0
  }
  ```
- **Response**:
  ```json
  {
    "execution_id": "exec_12345",
    "status": "completed",
    "results": [
      {
        "action_id": "navigate_to_cup",
        "status": "completed",
        "duration_seconds": 5.2
      }
    ],
    "total_duration_seconds": 12.5
  }
  ```
- **Error Codes**: `400` (Invalid action graph), `409` (Safety violation), `500` (Execution error), `504` (Timeout)

### End-to-End VLA Service

#### POST `/api/v1/vla/process`
- **Description**: Complete VLA pipeline: voice/text → plan → execute
- **Request Body**:
  ```json
  {
    "input_type": "voice|text",
    "audio_file": "<base64_encoded_audio>", // if input_type is "voice"
    "text_command": "move forward 1 meter", // if input_type is "text"
    "robot_id": "humanoid_01",
    "execute": true // if false, only plan without execution
  }
  ```
- **Response**:
  ```json
  {
    "pipeline_id": "vla_67890",
    "transcribed_text": "move forward 1 meter", // if voice input
    "action_graph": { /* ActionGraph structure */ },
    "execution_status": "completed",
    "execution_results": { /* Execution results */ },
    "total_duration_seconds": 8.3
  }
  ```
- **Error Codes**: `400` (Invalid input), `500` (Pipeline error)

### RAG Chatbot Service

#### POST `/api/v1/chat/query`
- **Description**: Query RAG chatbot with question about chapter content
- **Request Body**:
  ```json
  {
    "session_id": "session_12345",
    "message": "How does Whisper convert speech to text?",
    "chapter_context": "chapter-4", // optional
    "conversation_history": [] // optional, for context
  }
  ```
- **Response**:
  ```json
  {
    "response": "Whisper uses a transformer-based architecture...",
    "sources": [
      {
        "chapter_id": "chapter-4",
        "section": "Voice-to-Action with OpenAI Whisper",
        "relevance_score": 0.95
      }
    ],
    "session_id": "session_12345"
  }
  ```
- **Error Codes**: `400` (Invalid query), `500` (RAG processing error)

### Personalization Service

#### POST `/api/v1/personalize/content`
- **Description**: Get personalized content variations for chapter
- **Request Body**:
  ```json
  {
    "chapter_id": "chapter-4",
    "user_profile": {
      "experience_level": "beginner|intermediate|advanced",
      "learning_style": "visual|textual|hands-on",
      "preferred_language": "en|ur"
    }
  }
  ```
- **Response**:
  ```json
  {
    "personalized_content": {
      "code_examples": "simplified", // or "standard" or "advanced"
      "explanations": "detailed", // or "concise"
      "terminology_level": "basic", // or "intermediate" or "advanced"
      "adaptations_applied": ["simplified_code", "extra_comments"]
    }
  }
  ```
- **Error Codes**: `400` (Invalid profile), `404` (Chapter not found), `500` (Personalization error)

### Translation Service

#### POST `/api/v1/translate/urdu`
- **Description**: Translate English text to Urdu with quality validation
- **Request Body**:
  ```json
  {
    "text": "Vision-Language-Action systems enable robots...",
    "context": "robotics_textbook", // for context-aware translation
    "preserve_technical_terms": true
  }
  ```
- **Response**:
  ```json
  {
    "translated_text": "ویژن-زبان-ایکشن سسٹمز روبوٹس کو...",
    "quality_score": 0.94,
    "technical_terms_preserved": ["VLA", "ROS 2", "Whisper"],
    "translation_metadata": {
      "model": "gpt-4",
      "validation": "passed"
    }
  }
  ```
- **Error Codes**: `400` (Invalid text), `500` (Translation error)

## Docusaurus Integration Items

### RAG Chatbot Component

**Location**: `Book/src/components/VLAChatbot/index.tsx`

**Features**:
- Persistent chat widget accessible from any page
- Chapter-specific context awareness
- Message history with session management
- Source citation display
- Loading states and error handling

**Integration**:
- Add to Docusaurus layout: `Book/src/theme/Layout/index.tsx`
- Embed in chapter MDX: `Book/docs/chapter-4/*.mdx`
- Styling: `Book/src/css/custom.css`

### Personalize Button Component

**Location**: `Book/src/components/PersonalizeButton/index.tsx`

**Features**:
- Toggle button in chapter header
- Profile selection modal (beginner/intermediate/advanced)
- Client-side profile storage (localStorage)
- Dynamic content re-rendering
- Visual indicator when personalized

**Integration**:
- Add to chapter MDX frontmatter or custom component
- Styling: `Book/src/css/custom.css`
- API integration: Calls `/api/v1/personalize/content`

### Translate to Urdu Button Component

**Location**: `Book/src/components/TranslateButton/index.tsx`

**Features**:
- Button in chapter header
- On-demand translation of chapter content
- Loading state during translation
- Toggle between English and Urdu
- Integration with Docusaurus i18n

**Integration**:
- Add to chapter MDX frontmatter
- Docusaurus config: `Book/docusaurus.config.ts` (i18n settings)
- API integration: Calls `/api/v1/translate/urdu`
- Content routing: `Book/i18n/ur/docusaurus-plugin-content-docs/current/chapter-4/`

### Custom MDX Components

**Location**: `Book/src/components/MDXComponents/`

**Components to create**:
- `<VLACodeExample>`: Code examples with personalization support
- `<VLADiagram>`: Architectural diagrams (Mermaid or image)
- `<VLABox>`: Callout boxes for important concepts
- `<VLALab>`: Lab instruction formatting

**Integration**:
- Register in `Book/src/theme/MDXComponents.tsx`
- Use in chapter MDX files

### Chapter Navigation Scripts

**Location**: `Book/static/js/` or `Book/src/scripts/`

**Scripts**:
- `vla-chapter-init.js`: Initialize chatbot, personalization, translation on page load
- `vla-progress-tracker.js`: Track reading progress and lab completion
- `vla-code-runner.js`: Interactive code execution (if applicable)

**Integration**:
- Add to `Book/docusaurus.config.ts` under `scripts` array
- Or import in custom React components

### Sidebar Configuration

**Location**: `Book/sidebars.ts`

**Updates**:
- Add Chapter 4 entries:
  ```typescript
  chapter4: [
    'chapter-4/introduction',
    'chapter-4/whisper-integration',
    'chapter-4/cognitive-planning',
    'chapter-4/perception-integration',
    'chapter-4/action-executor',
    'chapter-4/end-to-end-pipeline',
    'chapter-4/hands-on-lab-conversational-humanoid',
    'chapter-4/ethical-considerations'
  ]
  ```


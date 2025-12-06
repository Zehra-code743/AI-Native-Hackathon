---
description: "Task list for Chapter 4: Vision-Language-Action (VLA) Systems feature."
---

# Tasks: Chapter 4 - Vision-Language-Action (VLA) Systems

**Input**: Design documents from `/specs/004-vla-chapter/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions.

## Path Conventions

- **backend**: `backend/src/vla/`, `backend/tests/vla/`
- **frontend**: `Book/src/components/`, `Book/docs/chapter-4/`
- **ROS 2**: `backend/src/vla/ros_nodes/`, custom messages in separate ROS 2 workspace

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for VLA backend and frontend.

- [X] T001 Create VLA backend directory structure in `backend/src/vla/` (api/endpoints, services, models, ros_nodes, utils) and `backend/tests/vla/` (unit, integration, e2e).
- [X] T002 Initialize Python dependencies for VLA in `backend/requirements.txt` (FastAPI, OpenAI, rclpy, qdrant-client, psycopg2, pytest, pytest-asyncio).
- [X] T003 [P] Configure linting (ruff) and formatting (black) for VLA backend in `backend/pyproject.toml`.
- [X] T004 Create `.env.example` file in `backend/` with VLA environment variables (OPENAI_API_KEY, NEON_DATABASE_URL, QDRANT_URL, ROS_DOMAIN_ID).
- [X] T005 Create Chapter 4 content directory structure in `Book/docs/chapter-4/` (introduction.md, whisper-integration.md, cognitive-planning.md, perception-integration.md, action-executor.md, end-to-end-pipeline.md, hands-on-lab-conversational-humanoid.md, ethical-considerations.md).
- [X] T006 [P] Create React component directories in `Book/src/components/` (VLAChatbot/, PersonalizeButton/, TranslateButton/, MDXComponents/).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that must be complete before user stories.

- [X] T007 Create FastAPI app instance for VLA in `backend/src/vla/api/main.py` with router setup and CORS configuration.
- [X] T008 Create ROS 2 workspace structure for VLA custom messages in `backend/src/vla_ros/` (msg/, srv/, action/ directories per contracts/ros-interfaces.md).
- [X] T009 [P] Define ROS 2 custom messages in `backend/src/vla_ros/msg/` (ActionGraph.msg, ActionNode.msg, ActionEdge.msg, SafetyConstraint.msg, ExecutionStatus.msg, ActionResult.msg, ObjectQuery.msg, ObjectDetection.msg).
- [X] T010 [P] Define ROS 2 services in `backend/src/vla_ros/srv/` (ValidateActionGraph.srv, QueryObject.srv).
- [X] T011 [P] Define ROS 2 action interface in `backend/src/vla_ros/action/ExecuteActionGraph.action`.
- [X] T012 Create package.xml and CMakeLists.txt for vla_ros package in `backend/src/vla_ros/`.
- [X] T013 Set up Neon PostgreSQL database schema for conversation history and user profiles (create migration scripts in `backend/src/vla/db/migrations/`).
- [X] T014 Set up Qdrant collection for Chapter 4 content embeddings (create initialization script in `backend/src/vla/services/rag_service.py`).

**Checkpoint**: Foundation ready - VLA user story implementation can now begin.

---

## Phase 3: User Story 1 - Voice Command to Robot Action (Priority: P1) 🎯 MVP

**Goal**: Enable students to speak natural language commands and have the robot execute corresponding actions.
**Independent Test**: Record voice command "move forward 1 meter", process through Whisper → Cognitive Planner → Action Executor, observe robot moving forward exactly 1 meter in simulation.

### Implementation for User Story 1

- [ ] T015 [US1] Create Pydantic models for voice commands and transcription in `backend/src/vla/models/voice.py` (VoiceCommand, TranscribedText).
- [ ] T016 [US1] Implement Whisper service in `backend/src/vla/services/whisper_service.py` with OpenAI Whisper API integration, audio format support (WAV, MP3, FLAC), and error handling.
- [ ] T017 [US1] Create `/api/v1/whisper/transcribe` FastAPI endpoint in `backend/src/vla/api/endpoints/whisper.py` with file upload handling, validation, and response models.
- [ ] T018 [US1] Create Pydantic models for action graphs in `backend/src/vla/models/action_graph.py` (ActionGraph, ActionNode, ActionEdge, SafetyConstraint).
- [ ] T019 [US1] Implement cognitive planner service in `backend/src/vla/services/cognitive_planner.py` with GPT-4 integration, prompt templates, action graph generation, and validation.
- [ ] T020 [US1] Create `/api/v1/plan/generate` FastAPI endpoint in `backend/src/vla/api/endpoints/planner.py` with request validation and action graph response.
- [ ] T021 [US1] Create Pydantic models for execution status in `backend/src/vla/models/execution.py` (ExecutionStatus, ActionResult).
- [ ] T022 [US1] Implement safety validator service in `backend/src/vla/services/safety_validator.py` with collision detection, joint limit checking, and workspace boundary validation.
- [ ] T023 [US1] Implement ROS 2 action executor node in `backend/src/vla/ros_nodes/action_executor_node.py` with lifecycle management, action execution state machine, and status publishing.
- [ ] T024 [US1] Create `/api/v1/execute/action` FastAPI endpoint in `backend/src/vla/api/endpoints/executor.py` with action graph validation, ROS 2 integration, and status polling.
- [ ] T025 [US1] Implement end-to-end VLA pipeline service in `backend/src/vla/services/vla_pipeline.py` that chains Whisper → Planner → Executor with status monitoring.
- [ ] T026 [US1] Create `/api/v1/vla/process` FastAPI endpoint in `backend/src/vla/api/endpoints/vla.py` that accepts voice/text input and returns execution results.

**Checkpoint**: User Story 1 is functional. Voice command "move forward 1 meter" successfully processes and robot executes the action.

---

## Phase 4: User Story 2 - Cognitive Planning from Natural Language (Priority: P1)

**Goal**: System converts natural language instructions into step-by-step robot action plans.
**Independent Test**: Provide text input "navigate to the kitchen, then pick up the apple on the counter" and verify planner outputs valid ROS 2 action graph with correct sequence and dependencies.

### Implementation for User Story 2

- [ ] T027 [US2] Enhance cognitive planner service in `backend/src/vla/services/cognitive_planner.py` with natural language parsing, intent extraction, parameter extraction, and dependency resolution.
- [ ] T028 [US2] Implement NLP parser utility in `backend/src/vla/utils/nlp_parser.py` for intent extraction (navigate, grasp, place, etc.) and parameter extraction (object names, locations, distances).
- [ ] T029 [US2] Add action graph validation logic in `backend/src/vla/utils/graph_validator.py` to check for circular dependencies, missing parameters, and invalid node types.
- [ ] T030 [US2] Enhance `/api/v1/plan/generate` endpoint in `backend/src/vla/api/endpoints/planner.py` with error handling for ambiguous/impossible commands and clarification requests.
- [ ] T031 [US2] Create unit tests for cognitive planner in `backend/tests/vla/unit/test_cognitive_planner.py` covering simple commands, complex multi-step commands, and error cases.

**Checkpoint**: User Story 2 is functional. Text command "pick up the cup and place it on the table" generates valid sequential action graph with proper dependencies.

---

## Phase 5: User Story 3 - Safe Action Execution with Constraints (Priority: P1)

**Goal**: Action executor prevents unsafe robot motions (collisions, joint limit violations, workspace boundary violations).
**Independent Test**: Attempt to execute action that would cause collision or joint limit violation, verify executor rejects it with appropriate error message.

### Implementation for User Story 3

- [ ] T032 [US3] Enhance safety validator service in `backend/src/vla/services/safety_validator.py` with collision detection using robot collision models, joint limit validation from URDF, and workspace boundary checking.
- [ ] T033 [US3] Implement action clamping logic in `backend/src/vla/services/safety_validator.py` for minor violations (clamp to safe limits) vs. major violations (reject action).
- [ ] T034 [US3] Enhance ROS 2 action executor node in `backend/src/vla/ros_nodes/action_executor_node.py` with pre-execution validation, runtime monitoring during execution, and error recovery mechanisms.
- [ ] T035 [US3] Implement action result tracking in `backend/src/vla/ros_nodes/action_executor_node.py` to publish status for each action (pending, executing, completed, failed).
- [ ] T036 [US3] Enhance `/api/v1/execute/action` endpoint in `backend/src/vla/api/endpoints/executor.py` with safety validation integration, error response codes (COLLISION_RISK, JOINT_LIMIT_EXCEEDED), and timeout handling.
- [ ] T037 [US3] Create integration tests for action executor in `backend/tests/vla/integration/test_action_executor.py` covering collision prevention, joint limit protection, and successful execution.

**Checkpoint**: User Story 3 is functional. Unsafe actions are rejected before execution, and valid actions complete successfully with status feedback.

---

## Phase 6: User Story 4 - Perception-Planning Integration (Priority: P2)

**Goal**: System uses visual perception data (object locations, depth) when generating action plans.
**Independent Test**: Issue command "pick up the red cup" when red cup is visible in camera feed, verify planner uses cup's 3D coordinates from perception.

### Implementation for User Story 4

- [ ] T038 [US4] Integrate object detection (YOLO via ultralytics) in `backend/src/vla/services/perception_service.py` with model loading, inference, and detection result processing.
- [ ] T039 [US4] Implement depth camera data processing in `backend/src/vla/services/depth_processor.py` with ROS 2 topic subscription, coordinate transformation (pixel → 3D), and depth validation.
- [ ] T040 [US4] Create object name to coordinate mapping service in `backend/src/vla/services/object_mapper.py` with fuzzy matching for object name variations, confidence scoring, and stale data detection.
- [ ] T041 [US4] Create ROS 2 perception connector node in `backend/src/vla/ros_nodes/perception_connector_node.py` that subscribes to camera topics and publishes object detections.
- [ ] T042 [US4] Create `/api/v1/perception/query` FastAPI endpoint in `backend/src/vla/api/endpoints/perception.py` that accepts object names and returns coordinates with confidence scores.
- [ ] T043 [US4] Integrate perception connector into cognitive planner in `backend/src/vla/services/cognitive_planner.py` to use object coordinates when generating action plans.
- [ ] T044 [US4] Add error handling for objects not found in `backend/src/vla/services/object_mapper.py` (request robot to search or return error).
- [ ] T045 [US4] Implement disambiguation logic in `backend/src/vla/services/object_mapper.py` for multiple objects matching description (use closest or request clarification).
- [ ] T046 [P] [US4] Add optional NVIDIA Isaac perception module integration in `backend/src/vla/services/isaac_perception_service.py` (if hardware available).

**Checkpoint**: User Story 4 is functional. Command "pick up the red cup" uses cup's 3D coordinates from perception in generated action plan.

---

## Phase 7: User Story 5 - RAG Chatbot for VLA Learning (Priority: P2)

**Goal**: Students can ask questions about VLA concepts using in-book chatbot and receive contextual answers.
**Independent Test**: Ask chatbot "How does Whisper convert speech to text?" and receive relevant answer with citations to chapter content.

### Implementation for User Story 5

- [ ] T047 [US5] Create Pydantic models for chat messages in `backend/src/vla/models/chat.py` (ChatMessage, SourceCitation).
- [ ] T048 [US5] Implement RAG service in `backend/src/vla/services/rag_service.py` with OpenAI Agents SDK integration, Qdrant vector search, and response generation with source citations.
- [ ] T049 [US5] Create script to generate embeddings for Chapter 4 content in `backend/scripts/generate_embeddings.py` using OpenAI text-embedding-3-small model and store in Qdrant.
- [ ] T050 [US5] Implement conversation history management in `backend/src/vla/services/rag_service.py` using Neon PostgreSQL to store chat messages and session data.
- [ ] T051 [US5] Create `/api/v1/chat/query` FastAPI endpoint in `backend/src/vla/api/endpoints/chat.py` with session management, conversation context, and source citation in responses.
- [ ] T052 [US5] Create React chatbot component in `Book/src/components/VLAChatbot/index.tsx` with message history UI, API integration, source citation display, and loading/error states.
- [ ] T053 [US5] Integrate chatbot component into Docusaurus layout in `Book/src/theme/Layout/index.tsx` or embed in chapter MDX files.
- [ ] T054 [US5] Add chapter-specific context awareness to RAG service in `backend/src/vla/services/rag_service.py` to focus retrieval on current chapter content.
- [ ] T055 [US5] Create unit tests for RAG service in `backend/tests/vla/unit/test_rag_service.py` covering query processing, source retrieval, and response generation.

**Checkpoint**: User Story 5 is functional. Chatbot provides relevant answers to VLA questions with source citations from Chapter 4.

---

## Phase 8: User Story 6 - Personalized Content and Urdu Translation (Priority: P3)

**Goal**: Students can access personalized content variations and Urdu translations of chapter materials.
**Independent Test**: Click "Personalize" button and see content adapt to profile; click "Translate to Urdu" and see chapter in grammatically correct Urdu.

### Implementation for User Story 6

- [ ] T056 [US6] Create Pydantic models for user profiles in `backend/src/vla/models/user.py` (UserProfile, PersonalizedContent).
- [ ] T057 [US6] Implement personalization service in `backend/src/vla/services/personalization_service.py` with content adaptation logic based on experience level, learning style, and code complexity preferences.
- [ ] T058 [US6] Create content variation templates in `backend/src/vla/services/personalization_service.py` for simplified/standard/advanced code examples and detailed/concise explanations.
- [ ] T059 [US6] Create `/api/v1/personalize/content` FastAPI endpoint in `backend/src/vla/api/endpoints/personalization.py` that accepts user profile and returns personalized content variations.
- [ ] T060 [US6] Create React PersonalizeButton component in `Book/src/components/PersonalizeButton/index.tsx` with profile selection UI, client-side localStorage storage, and dynamic content rendering.
- [ ] T061 [US6] Integrate PersonalizeButton into chapter MDX files in `Book/docs/chapter-4/` with conditional content rendering based on profile.
- [ ] T062 [US6] Create Pydantic models for translation in `backend/src/vla/models/translation.py` (TranslationRequest, TranslationResult).
- [ ] T063 [US6] Implement translation subagent in `backend/src/vla/services/translation_subagent.py` with GPT-4 integration, context-aware translation, technical term preservation, and grammatical validation.
- [ ] T064 [US6] Create `/api/v1/translate/urdu` FastAPI endpoint in `backend/src/vla/api/endpoints/translation.py` with translation request handling and quality validation.
- [ ] T065 [US6] Create React TranslateButton component in `Book/src/components/TranslateButton/index.tsx` with translation trigger, loading states, and Docusaurus i18n integration.
- [ ] T066 [US6] Configure Docusaurus i18n for Urdu in `Book/docusaurus.config.ts` with language switcher and content routing.
- [ ] T067 [US6] Implement translation caching in `backend/src/vla/services/translation_subagent.py` to avoid re-translating unchanged content.
- [ ] T068 [US6] Create unit tests for personalization and translation services in `backend/tests/vla/unit/test_personalization.py` and `backend/tests/vla/unit/test_translation.py`.

**Checkpoint**: User Story 6 is functional. Personalization adapts content based on user profile, and Urdu translation produces grammatically correct chapter content.

---

## Phase 9: Documentation and Hands-On Lab

**Purpose**: Complete chapter content, hands-on lab, and documentation.

- [ ] T069 Write Chapter 4 introduction in `Book/docs/chapter-4/introduction.md` covering VLA fundamentals, learning objectives, and chapter overview.
- [ ] T070 Write Whisper integration section in `Book/docs/chapter-4/whisper-integration.md` with code examples, API usage, and integration patterns.
- [ ] T071 Write cognitive planning section in `Book/docs/chapter-4/cognitive-planning.md` with LLM integration examples, action graph generation, and prompt engineering.
- [ ] T072 Write perception integration section in `Book/docs/chapter-4/perception-integration.md` with object detection examples, depth processing, and coordinate mapping.
- [ ] T073 Write action executor section in `Book/docs/chapter-4/action-executor.md` with safety constraints, ROS 2 integration, and execution patterns.
- [ ] T074 Write end-to-end pipeline section in `Book/docs/chapter-4/end-to-end-pipeline.md` with complete VLA workflow examples and integration patterns.
- [ ] T075 Create hands-on lab "Build a Conversational Humanoid" in `Book/docs/chapter-4/hands-on-lab-conversational-humanoid.md` with step-by-step instructions, code snippets, checkpoints, and troubleshooting.
- [ ] T076 Write ethical considerations section in `Book/docs/chapter-4/ethical-considerations.md` covering safety, bias, and responsible AI in conversational robotics.
- [ ] T077 [P] Create architectural diagrams for VLA system in `Book/static/img/chapter-4/` (Mermaid diagrams or images showing data flow and system architecture).
- [ ] T078 [P] Generate API documentation with OpenAPI/Swagger accessible at `/docs` endpoint in FastAPI app.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements, testing, and quality assurance.

- [ ] T079 [P] Add comprehensive error handling and logging throughout all VLA services in `backend/src/vla/services/` with structured logging and error codes.
- [ ] T080 [P] Create end-to-end tests for VLA pipeline in `backend/tests/vla/e2e/test_vla_pipeline.py` covering voice command → action execution workflow.
- [ ] T081 [P] Create integration tests for all FastAPI endpoints in `backend/tests/vla/integration/test_api_endpoints.py` with mock OpenAI and ROS 2 services.
- [ ] T082 [P] Add input validation and sanitization to all API endpoints in `backend/src/vla/api/endpoints/` using Pydantic validators.
- [ ] T083 [P] Implement rate limiting and API key management for OpenAI API calls in `backend/src/vla/utils/api_client.py` with exponential backoff.
- [ ] T084 [P] Add comprehensive code comments and docstrings to all VLA modules in `backend/src/vla/` following Python docstring conventions.
- [ ] T085 [P] Create custom MDX components for Chapter 4 in `Book/src/components/MDXComponents/` (VLACodeExample, VLADiagram, VLABox, VLALab).
- [ ] T086 [P] Register custom MDX components in `Book/src/theme/MDXComponents.tsx` for use in chapter markdown files.
- [ ] T087 [P] Add Chapter 4 entries to Docusaurus sidebar in `Book/sidebars.ts` with all chapter sections and lab.
- [ ] T088 [P] Create chapter initialization script in `Book/src/scripts/vla-chapter-init.js` for initializing chatbot, personalization, and translation on page load.
- [ ] T089 [P] Verify all code examples in chapter content are executable and tested in simulation environment.
- [ ] T090 [P] Perform final review of chapter content for accuracy, clarity, and completeness.

---

## Dependencies & Execution Order

- **Setup (Phase 1)** must complete before all other phases.
- **Foundational (Phase 2)** must complete before all user story phases.
  - ROS 2 custom messages (T009-T012) must be built before ROS 2 nodes can use them.
  - Database setup (T013-T014) must complete before RAG and personalization services.
- **User Story Phases (3-8)** can begin after Foundational phase:
  - **US1 (Phase 3)** - MVP: Voice → Action execution. Must complete first as it establishes core pipeline.
  - **US2 (Phase 4)** - Depends on US1's cognitive planner foundation, enhances it with better NLP.
  - **US3 (Phase 5)** - Depends on US1's action executor, enhances it with safety validation.
  - **US4 (Phase 6)** - Can develop in parallel with US2/US3 but depends on US1's planner for integration.
  - **US5 (Phase 7)** - Can develop in parallel with US1-4, independent RAG system.
  - **US6 (Phase 8)** - Can develop in parallel with US1-5, independent personalization/translation.
- **Documentation (Phase 9)** can begin after US1-3 are functional (core VLA concepts).
- **Polish (Phase 10)** should be done last after all features are implemented.

### Parallel Execution Opportunities

**Within US1 (Phase 3)**:
- T015-T017 (Whisper models/service/endpoint) can be done in parallel with T018-T020 (Action graph models/planner/endpoint)
- T021-T024 (Execution models/validator/executor node/endpoint) can be done in parallel with above

**Within US4 (Phase 6)**:
- T038-T040 (Object detection, depth processing, object mapper) can be done in parallel
- T041-T042 (ROS node, API endpoint) can be done in parallel with T043 (Planner integration)

**Within US5 (Phase 7)**:
- T047-T051 (Backend RAG service and endpoint) can be done in parallel with T052-T053 (Frontend chatbot component)

**Within US6 (Phase 8)**:
- T056-T061 (Personalization backend and frontend) can be done in parallel with T062-T067 (Translation backend and frontend)

**Phase 9 & 10**:
- Most documentation and polish tasks can be done in parallel

---

## Implementation Strategy

### MVP First (User Stories 1, 2, 3)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (especially ROS 2 messages and database setup)
3. Complete Phase 3: User Story 1 (Voice Command to Robot Action) - **MVP Core**
4. Complete Phase 4: User Story 2 (Cognitive Planning enhancements)
5. Complete Phase 5: User Story 3 (Safe Action Execution)
6. **STOP and VALIDATE**: End-to-end VLA pipeline works: voice command → plan → safe execution. This is a solid MVP.

### Incremental Delivery

After MVP:
- Add Phase 6: Perception integration (enhances planning with visual context)
- Add Phase 7: RAG chatbot (enhances learning experience)
- Add Phase 8: Personalization & Translation (accessibility features)
- Complete Phase 9: Documentation and lab
- Complete Phase 10: Polish and quality assurance

### Testing Strategy

- Unit tests: Write alongside implementation for each service
- Integration tests: Write after each user story phase completes
- End-to-end tests: Write after MVP (Phase 3-5) is complete
- Manual testing: Test each user story independently before moving to next phase

---

## Task Summary

- **Total Tasks**: 90 tasks
- **Setup Tasks**: 6 (Phase 1)
- **Foundational Tasks**: 8 (Phase 2)
- **User Story 1 Tasks**: 12 (Phase 3) - MVP
- **User Story 2 Tasks**: 5 (Phase 4)
- **User Story 3 Tasks**: 6 (Phase 5)
- **User Story 4 Tasks**: 9 (Phase 6)
- **User Story 5 Tasks**: 9 (Phase 7)
- **User Story 6 Tasks**: 13 (Phase 8)
- **Documentation Tasks**: 10 (Phase 9)
- **Polish Tasks**: 12 (Phase 10)

**Parallel Opportunities**: ~40% of tasks can be executed in parallel within their phases.

**Estimated Timeline**: 
- MVP (Phases 1-5): 3-4 weeks
- Full Implementation (All Phases): 6-8 weeks


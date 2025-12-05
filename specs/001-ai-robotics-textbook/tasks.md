---
description: "Task list for the AI & Humanoid Robotics Textbook feature."
---

# Tasks: AI & Humanoid Robotics Textbook

**Input**: Design documents from `/specs/001-ai-robotics-textbook/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions.

## Path Conventions

- **backend**: `backend/src/`, `backend/tests/`
- **frontend**: `Book/src/`, `Book/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for the backend.

- [ ] T001 Create backend directory structure in `backend/src/` (api, models, services, ai_pipelines, ros_nodes) and `backend/tests/`.
- [ ] T002 Initialize Python project with a `requirements.txt` in `backend/`.
- [ ] T003 Add `fastapi`, `uvicorn`, `pydantic`, `python-dotenv` to `backend/requirements.txt`.
- [ ] T004 [P] Configure linting (e.g., `ruff`) and formatting (e.g., `black`) for the backend project in `backend/pyproject.toml`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that must be complete before user stories.

- [ ] T005 Create a basic FastAPI app instance in `backend/src/api/main.py`.
- [ ] T006 Create a ROS 2 workspace in `backend/src/ros_ws/`.
- [ ] T007 Create a placeholder humanoid description package in `backend/src/ros_ws/src/humanoid_description/`.
- [ ] T008 [P] Create a `.env` file from `.env.example` in `backend/` for environment variables.

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Build ROS 2 Packages (Priority: P1) 🎯 MVP

**Goal**: Enable students to build ROS 2 packages and control a simulated humanoid.
**Independent Test**: Successfully compile a ROS 2 package and publish a command that a placeholder node receives.

### Implementation for User Story 1

- [ ] T009 [US1] Define a basic humanoid structure in a URDF file in `backend/src/ros_ws/src/humanoid_description/urdf/humanoid.urdf`.
- [ ] T010 [US1] Create a new ROS 2 package for humanoid control in `backend/src/ros_ws/src/humanoid_control/`.
- [ ] T011 [US1] Create a simple "teleop" publisher node in `backend/src/ros_ws/src/humanoid_control/humanoid_control/nodes/teleop_node.py`.
- [ ] T012 [US1] Create a simple "subscriber" log node in `backend/src/ros_ws/src/humanoid_control/humanoid_control/nodes/subscriber_node.py`.
- [ ] T013 [US1] Create a launch file to start the nodes in `backend/src/ros_ws/src/humanoid_control/launch/control.launch.py`.

**Checkpoint**: User Story 1 is functional. A ROS 2 package can be built and nodes can communicate.

---

## Phase 4: User Story 2 - Create Humanoid Digital Twin (Priority: P1)

**Goal**: Create a digital twin in a simulator with working sensors.
**Independent Test**: Launch the simulation and visualize the humanoid and its sensor data streams in RViz.

### Implementation for User Story 2

- [ ] T014 [US2] Create a Gazebo world file in `backend/src/ros_ws/src/humanoid_control/worlds/simple.world`.
- [ ] T015 [US2] Enhance the URDF from T009 to include Gazebo plugins for physics and control in `backend/src/ros_ws/src/humanoid_description/urdf/humanoid.urdf`.
- [ ] T016 [P] [US2] Add sensor plugins (IMU, LiDAR, Depth Camera) to the `humanoid.urdf`.
- [ ] T017 [US2] Create a launch file to start Gazebo with the humanoid in `backend/src/ros_ws/src/humanoid_control/launch/simulation.launch.py`.
- [ ] T018 [P] [US2] Create an RViz2 configuration file to visualize the robot and sensor data in `backend/src/ros_ws/src/humanoid_control/rviz/simulation.rviz`.

**Checkpoint**: User Story 2 is functional. The humanoid can be simulated and its sensors visualized.

---

## Phase 5: User Story 3 - AI Perception & Navigation (Priority: P2)

**Goal**: Implement basic localization and navigation pipelines.
**Independent Test**: Launch the simulation, run the VSLAM pipeline, and command a navigation goal via Nav2, which the robot successfully reaches.

### Implementation for User Story 3

- [ ] T019 [US3] Install NVIDIA Isaac ROS dependencies for VSLAM.
- [ ] T020 [US3] Create a launch file to run the Isaac ROS VSLAM node with the simulated sensor data in `backend/src/ros_ws/src/humanoid_control/launch/vslam.launch.py`.
- [ ] T021 [US3] Configure the Nav2 stack for the humanoid robot in a new package `backend/src/ros_ws/src/humanoid_navigation/`.
- [ ] T022 [US3] Create a launch file to bring up the full Nav2 stack in `backend/src/ros_ws/src/humanoid_navigation/launch/nav2.launch.py`.

**Checkpoint**: User Story 3 is functional. The robot can localize and navigate in the simulated environment.

---

## Phase 6: User Story 4/5 - RAG Chatbot & VLA Integration (Priority: P2)

**Goal**: The humanoid can receive voice commands, and users can ask questions via a chatbot.
**Independent Test**: Issue a voice command like "go to the kitchen" and see the robot plan a path. Ask the chatbot a question and receive an answer.

### Implementation for User Story 4/5

- [ ] T023 [P] [US4] Create `ChatInteraction` and `ChatMessage` Pydantic models in `backend/src/models/chat.py`.
- [ ] T024 [US4] Implement a vector database service to store and query textbook content in `backend/src/services/rag_service.py`.
- [ ] T025 [US4] Implement the `/api/v1/chat` endpoint logic in `backend/src/api/endpoints/chat.py`, using the `rag_service`.
- [ ] T026 [P] [US5] Create a React component for the chatbot UI in `Book/src/components/Chatbot/index.tsx`.
- [ ] T027 [US5] Implement the frontend logic to call the `/api/v1/chat` API and display results in the `Chatbot` component.
- [ ] T028 [P] [US4] Create a ROS 2 node that uses a library like `speech_recognition` to process audio in `backend/src/ai_pipelines/nodes/voice_recognition_node.py`.
- [ ] T029 [US4] Implement a service to translate recognized text to navigation goals in `backend/src/services/planning_service.py`.

**Checkpoint**: User Stories 4 and 5 are functional. The robot accepts voice commands and the chatbot is interactive.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final deliverables.

- [ ] T030 [P] Add content personalization hooks to the Docusaurus site in `Book/src/theme/Root.js`.
- [ ] T031 [P] Implement i18n for Urdu translation and add a language switcher component in `Book/src/components/LanguageSwitcher/`.
- [ ] T032 Write the main content for Modules 1-4 in the `Book/docs/` directory.
- [ ] T033 [P] Write the 5,000-7,000 word research paper and save it as `research/paper.md`.
- [ ] T034 [P] Generate final PDF outputs for all deliverables.

---

## Dependencies & Execution Order

- **Setup (Phase 1)** must complete before all other phases.
- **Foundational (Phase 2)** must complete before all user story phases.
- **User Story Phases (3-6)** can begin after the Foundational phase.
  - US1 and US2 are P1 and should be prioritized.
  - US2 depends on the URDF from US1.
  - US3 depends on the simulated robot from US2.
  - US4/5 (Chatbot/VLA) can be developed in parallel with US1-3 but depends on the Foundational backend API setup.
- **Polish (Phase 7)** can be done last.

---

## Implementation Strategy

### MVP First (User Stories 1 & 2)

1.  Complete Phase 1: Setup
2.  Complete Phase 2: Foundational
3.  Complete Phase 3: User Story 1 (ROS 2 Packages)
4.  Complete Phase 4: User Story 2 (Digital Twin)
5.  **STOP and VALIDATE**: A simulated humanoid exists, can be controlled, and has working sensors. This is a solid MVP.

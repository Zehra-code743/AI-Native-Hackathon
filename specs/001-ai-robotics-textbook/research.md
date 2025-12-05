# Research Plan

This document outlines the key technical questions and clarifications required before starting implementation. The goal is to resolve all "NEEDS CLARIFICATION" items identified in the `plan.md`.

## Research Tasks

1.  **Technology Versions & Compatibility:**
    *   **Task**: Determine and document the specific, compatible versions of all core technologies:
        *   Python (e.g., 3.10.x)
        *   ROS 2 Distro (e.g., Humble Hawksbill, Iron Irwini)
        *   Gazebo Version (e.g., 11, Fortress)
        *   Unity Version (if used as an alternative to Gazebo)
        *   NVIDIA Driver and CUDA versions
        *   NVIDIA Isaac Sim and Isaac ROS versions
    *   **Rationale**: Ensures a stable and reproducible development environment, avoiding dependency conflicts.

2.  **RAG Implementation Details:**
    *   **Task**: Select a vector database for the RAG chatbot.
    *   **Options**: ChromaDB (lightweight, in-process), FAISS (high-performance library), Pinecone/Weaviate (managed services).
    *   **Evaluation Criteria**: Ease of setup, performance, scalability, and cost.
    *   **Rationale**: The choice of vector DB is critical for the performance and scalability of the RAG chatbot.

3.  **Testing Strategy Definition:**
    *   **Task**: Define the testing strategy, frameworks, and coverage targets for each part of the system.
        *   **Backend (Python/FastAPI)**: `pytest` for unit/integration tests. What is the target code coverage?
        *   **ROS 2 Packages**: `colcon test` with `gtest` (C++) or `pytest` (Python). How will we test node interactions?
        *   **Frontend (Docusaurus/React)**: Jest/React Testing Library for component tests, Playwright/Cypress for end-to-end tests.
    *   **Rationale**: A clear testing strategy is essential for ensuring the quality and reproducibility of the project.

4.  **Non-Functional Requirements (NFRs):**
    *   **Task**: Define and quantify the NFRs for the system.
        *   **Performance**: What is the target p95 response time for the RAG chatbot? What is the minimum acceptable framerate (FPS) for the Gazebo/Unity simulation?
        *   **Scalability**: How many concurrent users should the Docusaurus site and chatbot support?
        *   **Resource Constraints**: What are the maximum memory/CPU limits for the simulation environment and backend services?
    *   **Rationale**: NFRs are required to make informed architectural decisions and to have measurable success criteria for system performance.

5.  **Project Constitution Definition:**
    *   **Task**: Lead a discussion with the project stakeholders to define and ratify the core principles in `.specify/memory/constitution.md`.
    *   **Rationale**: A shared constitution is non-negotiable for establishing consistent development standards, quality gates, and decision-making processes.

6.  **VLA Model Selection and Integration:**
    *   **Task**: Research and select a suitable pre-trained Vision-Language-Action (VLA) model.
    *   **Options**: Explore models available on platforms like Hugging Face.
    *   **Evaluation Criteria**: Performance on relevant tasks (e.g., object recognition, navigation commands), licensing, and ease of integration with ROS 2.
    *   **Rationale**: The choice of VLA model directly impacts the "smarts" of the humanoid robot.

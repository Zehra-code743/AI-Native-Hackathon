---
id: 0001
title: Update Project Constitution
stage: constitution
date: 2025-12-04
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: unknown
command: /sp.constitution
labels: ["constitution", "project setup", "principles"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - none
---

## Prompt

```text
Project: Physical AI & Humanoid Robotics Hackathon

Core principles:
- Accuracy through primary source verification (peer-reviewed articles, official ROS 2/NVIDIA/Unity documentation)
- Clarity for academic audience (computer science and robotics background)
- Reproducibility (all code, simulations, and claims cited and traceable)
- Rigor (prefer peer-reviewed sources, verified AI-native methods)

Key standards:
- All factual claims must be traceable to sources
- Citation format: APA style
- Source types: minimum 50% peer-reviewed articles
- Plagiarism check: 0% tolerance before submission
- Writing clarity: Flesch-Kincaid grade 10-12

Constraints:
- Word count: 5,000-7,000 words (for research-paper component)
- Minimum 15 sources
- Format: PDF with embedded citations
- Chapters must support RAG embeddings, personalization, and Urdu translation

Modules:

Module 1: The Robotic Nervous System (ROS 2)
- Focus: Middleware for robot control
- Topics: ROS 2 Nodes, Topics, Services
- Integration: Bridging Python Agents to ROS controllers using rclpy
- Robot Description: Understanding URDF (Unified Robot Description Format) for humanoids
- Outcome: Students can build ROS 2 packages and control simulated humanoids

Module 2: The Digital Twin (Gazebo & Unity)
- Focus: Physics simulation and environment building
- Topics: Simulating physics, gravity, collisions in Gazebo; High-fidelity rendering in Unity
- Sensors: LiDAR, Depth Cameras, IMUs
- Outcome: Students can create digital twins of humanoid robots and simulate sensor data

Module 3: The AI-Robot Brain (NVIDIA Isaac™)
- Focus: Advanced perception and training
- Topics: NVIDIA Isaac Sim, Isaac ROS (hardware-accelerated VSLAM), Nav2 path planning
- Outcome: Students can implement perception, navigation, and reinforcement learning pipelines

Module 4: Vision-Language-Action (VLA)
- Focus: Convergence of LLMs and Robotics
- Topics: Voice-to-Action using OpenAI Whisper, cognitive planning to translate natural language into ROS 2 actions
- Capstone: Autonomous Humanoid executes voice command, plans path, navigates obstacles, identifies and manipulates objects
- Outcome: Students can integrate multi-modal AI with robotic control and human-robot interaction

Success criteria:
- All claims verified against sources
- Zero plagiarism detected
- Passes fact-checking review
- Fully reproducible code and simulation instructions
- Deployed Docusaurus book with RAG chatbot functionality
- Chapter personalization and Urdu translation buttons functional
```

## Response snapshot

The project constitution has been updated to version 1.0.0, establishing core principles, key standards, project constraints, module descriptions, and success criteria for the Physical AI & Humanoid Robotics Hackathon.

## Outcome

- ✅ Impact: Updated the project constitution to version 1.0.0, incorporating core principles, key standards, constraints, project modules, and success criteria.
- 🧪 Tests: none
- 📁 Files: Modified .specify/memory/constitution.md
- 🔁 Next prompts: Review and update plan-template.md, spec-template.md, and tasks-template.md to align with the new constitution.
- 🧠 Reflection: The system script for PHR creation was not found, requiring a fallback to agent-native file operations.

## Evaluation notes (flywheel)

- Failure modes observed: The script `.specify/scripts/bash/create-phr.sh` was not found.
- Graders run and results (PASS/FAIL): None
- Prompt variant (if applicable): None
- Next experiment (smallest change to try): Ensure the PHR creation script is available and executable, or enhance agent's ability to locate it.

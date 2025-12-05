<!-- Sync Impact Report:
Version change: None → 1.0.0
Modified principles: None
Added sections: Key Standards, Constraints, Project Modules, Success Criteria
Removed sections: None
Templates requiring updates:
- .specify/templates/plan-template.md: ⚠ pending
- .specify/templates/spec-template.md: ⚠ pending
- .specify/templates/tasks-template.md: ⚠ pending
- .specify/templates/commands/sp.constitution.md: ✅ updated
Follow-up TODOs: None
-->
# Physical AI & Humanoid Robotics Hackathon Constitution

## Core Principles

### I. Accuracy through Primary Source Verification
All claims MUST be verified against peer-reviewed articles, official ROS 2, NVIDIA, and Unity documentation.

### II. Clarity for Academic Audience
All content MUST be clear and accessible for an academic audience with a computer science and robotics background.

### III. Reproducibility
All code, simulations, and claims MUST be cited and traceable, ensuring full reproducibility.

### IV. Rigor
The project MUST prefer peer-reviewed sources and verified AI-native methods.

## Key Standards

- All factual claims MUST be traceable to sources.
- Citation format MUST adhere to APA style.
- Source types MUST include a minimum of 50% peer-reviewed articles.
- Plagiarism check: 0% tolerance before submission.
- Writing clarity: Flesch-Kincaid grade 10-12.

## Constraints

- Word count: 5,000-7,000 words for the research-paper component.
- Minimum 15 sources.
- Format: PDF with embedded citations.
- Chapters MUST support RAG embeddings, personalization, and Urdu translation.

## Project Modules

### Module 1: The Robotic Nervous System (ROS 2)
- Focus: Middleware for robot control.
- Topics: ROS 2 Nodes, Topics, Services.
- Integration: Bridging Python Agents to ROS controllers using rclpy.
- Robot Description: Understanding URDF (Unified Robot Description Format) for humanoids.
- Outcome: Students can build ROS 2 packages and control simulated humanoids.

### Module 2: The Digital Twin (Gazebo & Unity)
- Focus: Physics simulation and environment building.
- Topics: Simulating physics, gravity, collisions in Gazebo; High-fidelity rendering in Unity.
- Sensors: LiDAR, Depth Cameras, IMUs.
- Outcome: Students can create digital twins of humanoid robots and simulate sensor data.

### Module 3: The AI-Robot Brain (NVIDIA Isaac™)
- Focus: Advanced perception and training.
- Topics: NVIDIA Isaac Sim, Isaac ROS (hardware-accelerated VSLAM), Nav2 path planning.
- Outcome: Students can implement perception, navigation, and reinforcement learning pipelines.

### Module 4: Vision-Language-Action (VLA)
- Focus: Convergence of LLMs and Robotics.
- Topics: Voice-to-Action using OpenAI Whisper, cognitive planning to translate natural language into ROS 2 actions.
- Capstone: Autonomous Humanoid executes voice command, plans path, navigates obstacles, identifies and manipulates objects.
- Outcome: Students can integrate multi-modal AI with robotic control and human-robot interaction.

## Success Criteria

- All claims MUST be verified against sources.
- Zero plagiarism detected.
- Passes fact-checking review.
- Fully reproducible code and simulation instructions.
- Deployed Docusaurus book with RAG chatbot functionality.
- Chapter personalization and Urdu translation buttons functional.

## Governance

Constitution supersedes all other practices; Amendments require documentation, approval, migration plan. All PRs/reviews MUST verify compliance. Complexity MUST be justified.

**Version**: 1.0.0 | **Ratified**: 2025-12-04 | **Last Amended**: 2025-12-04

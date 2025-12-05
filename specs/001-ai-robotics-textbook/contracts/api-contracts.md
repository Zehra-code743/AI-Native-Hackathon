# API Contracts: Physical AI & Humanoid Robotics Hackathon Research and Textbook Project

**Feature Branch**: `001-ai-robotics-textbook`
**Created**: 2025-12-05
**Status**: Draft
**Spec**: [./../spec.md](../spec.md)

## Overview

This document outlines conceptual API contracts and interaction points for the AI-native textbook features (RAG, personalization, translation) and the robotics modules (ROS 2, simulation, AI pipelines). These are primarily internal interfaces for feature integration rather than external RESTful APIs.

## Textbook Feature Contracts

### 1. RAG Chatbot Interface
- **Description**: Defines the interaction for querying the RAG chatbot with natural language and receiving contextually relevant responses from the textbook content.
- **Endpoint/Function**: `query_rag_chatbot(user_query: str, chapter_context: str) -> str`
- **Inputs**:
    - `user_query` (string): The natural language query from the user.
    - `chapter_context` (string, optional): Relevant chapter content to ground the RAG response.
- **Outputs**:
    - (string): The chatbot's natural language response.
- **Error Taxonomy**:
    - `400 Bad Request`: Invalid query format.
    - `500 Internal Server Error`: RAG processing failure.

### 2. Personalization Service Interface
- **Description**: Manages user preferences and dynamically adjusts textbook content or recommendations based on user profiles.
- **Endpoint/Function**: `get_personalized_content(user_id: str, chapter_id: str) -> dict`
- **Inputs**:
    - `user_id` (string): Unique identifier for the user.
    - `chapter_id` (string): Identifier for the current chapter.
- **Outputs**:
    - (dict): Personalized content variations or flags for the frontend.
- **Error Taxonomy**:
    - `404 Not Found`: User or chapter not found.
    - `500 Internal Server Error`: Personalization logic failure.

### 3. Translation Service Interface (Urdu)
- **Description**: Provides on-demand translation of textbook content, specifically to Urdu.
- **Endpoint/Function**: `translate_content(text: str, target_language: 'Urdu') -> str`
- **Inputs**:
    - `text` (string): The content to be translated.
    - `target_language` (enum: 'Urdu'): The desired target language.
- **Outputs**:
    - (string): The translated content.
- **Error Taxonomy**:
    - `400 Bad Request`: Invalid input text or unsupported language.
    - `500 Internal Server Error`: Translation API failure.

## Robotics Module Interaction Contracts

### 4. ROS 2 Control Interface
- **Description**: Defines how Python agents or higher-level AI pipelines interact with ROS 2 nodes to control simulated humanoids.
- **Endpoint/Function**: `send_ros_command(robot_id: str, command: dict) -> bool`
    - (ROS 2 Topics/Services): `/robot_id/cmd_vel`, `/robot_id/joint_states` (publisher/subscriber model)
- **Inputs**:
    - `robot_id` (string): Identifier for the target humanoid robot.
    - `command` (dict): Structured command (e.g., `{'linear_x': 0.5, 'angular_z': 0.1}` for `cmd_vel`).
- **Outputs**:
    - (bool): Success status of command execution.
- **Error Taxonomy**:
    - `ROS Error`: Specific ROS 2 communication or execution errors (e.g., node not found, invalid message).

### 5. Simulation Environment Interface (Gazebo/Unity)
- **Description**: Defines how external systems interact with the digital twin for creating, updating, and retrieving sensor data.
- **Endpoint/Function**: `spawn_digital_twin(model_urdf: str, pose: dict) -> str`
- **Endpoint/Function**: `get_sensor_data(digital_twin_id: str, sensor_type: str) -> list`
- **Inputs**:
    - `model_urdf` (string): URDF content for robot model.
    - `pose` (dict): Initial position and orientation.
    - `digital_twin_id` (string): Identifier for the digital twin.
    - `sensor_type` (enum: LiDAR, DepthCamera, IMU):
- **Outputs**:
    - (string): `digital_twin_id` on spawn.
    - (list): Sensor data array.
- **Error Taxonomy**:
    - `Simulation Error`: Failed to spawn, invalid model, sensor read error.

### 6. AI Pipeline Integration Interface
- **Description**: Defines the input/output for various AI models (perception, navigation, VLA) within the robotics system.
- **Endpoint/Function**: `process_perception(sensor_data: dict) -> dict`
- **Endpoint/Function**: `plan_navigation(current_pose: dict, goal_pose: dict, obstacles: list) -> list`
- **Endpoint/Function**: `interpret_vla_command(voice_input: str, visual_context: dict) -> dict`
- **Inputs**:
    - `sensor_data` (dict): Raw or processed sensor data.
    - `current_pose`, `goal_pose` (dict): Robot's position/orientation.
    - `obstacles` (list): Detected environmental obstacles.
    - `voice_input` (string): User's voice command.
    - `visual_context` (dict): Visual information from camera.
- **Outputs**:
    - (dict): Processed perception (e.g., object detection).
    - (list): Planned path (e.g., sequence of waypoints).
    - (dict): Translated ROS 2 actions or cognitive plan.
- **Error Taxonomy**:
    - `AI Model Error`: Processing failure, invalid input, inference error.

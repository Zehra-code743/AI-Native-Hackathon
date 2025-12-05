# Data Model

This document defines the key data entities for the AI & Humanoid Robotics Textbook project, based on the feature specification.

## Core Entities

### 1. HumanoidRobot

Represents the physical or simulated humanoid robot.

*   **`id`**: `string` (unique identifier, e.g., "humanoid-01")
*   **`urdf_model`**: `string` (path or content of the URDF file describing the robot's structure)
*   **`state`**: `enum` (e.g., `IDLE`, `EXECUTING_TASK`, `ERROR`)
*   **`pose`**: `object` (position and orientation in the world)
*   **`joint_states`**: `map<string, float>` (map of joint names to their current angle/position)

### 2. DigitalTwin

A virtual replica of the robot and its environment used for simulation.

*   **`id`**: `string` (unique identifier)
*   **`robot_id`**: `string` (foreign key to `HumanoidRobot`)
*   **`environment_id`**: `string` (foreign key to `SimulationEnvironment`)
*   **`simulator`**: `enum` (`GAZEBO`, `UNITY`, `ISAAC_SIM`)
*   **`sensors`**: `list<Sensor>` (list of attached virtual sensors)

### 3. SimulationEnvironment

Defines a virtual world for the digital twin.

*   **`id`**: `string`
*   **`name`**: `string` (e.g., "IndoorLab", "ObstacleCourse")
*   **`world_file`**: `string` (path to the Gazebo .world or Unity scene file)
*   **`physics_properties`**: `object` (gravity, friction, etc.)

### 4. Sensor

Represents a virtual sensor attached to the digital twin.

*   **`id`**: `string`
*   **`type`**: `enum` (`LIDAR`, `DEPTH_CAMERA`, `IMU`)
*   **`topic`**: `string` (the ROS 2 topic where data is published, e.g., `/scan`, `/depth/image_raw`)
*   **`configuration`**: `object` (sensor-specific settings like range, resolution, noise model)

### 5. AIPipeline

A sequence of AI models for a specific task.

*   **`id`**: `string`
*   **`name`**: `string` (e.g., "VisualSLAM", "VoiceCommandNavigation")
*   **`type`**: `enum` (`NAVIGATION`, `PERCEPTION`, `MANIPULATION`)
*   **`models`**: `list<string>` (list of AI models/nodes in the pipeline)

### 6. TextbookChapter

A single chapter in the Docusaurus textbook.

*   **`id`**: `string` (e.g., "module-1-ros-nodes")
*   **`title`**: `string`
*   **`content_md`**: `string` (Markdown content)
*   **`vector_embedding`**: `list<float>` (for RAG search)
*   **`translation_ur`**: `string` (Markdown content translated to Urdu)

### 7. ChatInteraction

Represents a single turn in the RAG chatbot conversation.

*   **`session_id`**: `string`
*   **`user_query`**: `string`
*   **`response`**: `string`
*   **`source_chapters`**: `list<string>` (IDs of chapters used to generate the response)
*   **`timestamp`**: `datetime`
# Data Model: Physical AI & Humanoid Robotics Hackathon Research and Textbook Project

**Feature Branch**: `001-ai-robotics-textbook`
**Created**: 2025-12-05
**Status**: Draft
**Spec**: [./spec.md](spec.md)

## Key Entities

### Humanoid Robot
- **Description**: A physical or simulated robot with a human-like form, capable of complex interactions.
- **Attributes**:
    - `id`: Unique identifier (e.g., string)
    - `type`: Physical or Simulated (enum)
    - `capabilities`: List of actions/interactions (e.g., navigation, manipulation, voice command)
    - `status`: Current operational status (e.g., active, idle, error)

### ROS 2 Package
- **Description**: A software bundle containing ROS 2 nodes, libraries, and resources for robot control.
- **Attributes**:
    - `name`: Package name (string)
    - `nodes`: List of ROS 2 nodes within the package
    - `libraries`: List of associated libraries
    - `resources`: Other assets (e.g., URDF files)
    - `dependencies`: External package dependencies

### Digital Twin
- **Description**: A virtual replica of a physical humanoid robot and its environment.
- **Attributes**:
    - `id`: Unique identifier (e.g., string)
    - `robot_model`: Reference to Humanoid Robot (e.g., `humanoid_robot.id`)
    - `environment`: Description of the simulated environment (e.g., string, JSON config)
    - `simulation_platform`: (e.g., Gazebo, Unity)
    - `sensor_data_streams`: List of active sensor data streams

### Sensor Data
- **Description**: Information gathered from virtual sensors (LiDAR, Depth Camera, IMU) in the simulation.
- **Attributes**:
    - `type`: (e.g., LiDAR, Depth Camera, IMU)
    - `timestamp`: Time of data capture (datetime)
    - `value`: Raw sensor readings (various data types, e.g., array for LiDAR, image for camera)
    - `source_digital_twin`: Reference to Digital Twin (e.g., `digital_twin.id`)

### AI Pipeline
- **Description**: A sequence of AI models and processes for perception, navigation, and decision-making.
- **Attributes**:
    - `id`: Unique identifier (e.g., string)
    - `type`: (e.g., perception, navigation, VLA, reinforcement learning)
    - `models_used`: List of AI models (e.g., VSLAM, LLM, object detection)
    - `input_data`: Expected input data types (e.g., sensor_data, natural_language)
    - `output_actions`: Expected robot actions or decisions
    - `status`: Current operational status (e.g., active, training, idle)

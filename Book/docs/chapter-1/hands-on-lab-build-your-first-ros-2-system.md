# 1.7 Hands-On Lab: Build Your First ROS 2 System

**Content Type:** hands-on project

## Description

- Guided project: simulate a humanoid robot's sensor-to-control pipeline
- Tasks:
  * Create 3 nodes: SensorSimulator, Planner, MotorController
  * SensorSimulator publishes fake sensor data (position, velocity)
  * Planner subscribes to sensor data, computes target trajectory (service)
  * MotorController requests plan from Planner (service), publishes motor commands
  * All nodes communicate via topics and services
- Testing: verify data flow using ros2 topic list, ros2 topic echo
- Debugging: identify bottlenecks, latency issues

## Deliverables

- Working 3-node ROS 2 system
- Launch file that starts all nodes
- Explanation of data flow and design choices

## Visuals Needed

- Diagram: Node graph for this system
- Screenshots: ros2 topic echo output

## Code Examples (6)

- sensor_simulator.py (publisher)
- planner.py (service server)
- motor_controller.py (service client + publisher)
- Launch file
- Custom message definitions
- CMakeLists.txt / package.xml

**Estimated Length:** 10-12 pages

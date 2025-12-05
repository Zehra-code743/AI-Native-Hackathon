# 3.5 Hands-On Lab: Integration Challenge

**Content Type:** capstone integration project
**Estimated Length:** 12-15 pages

## Description

- Comprehensive project integrating Modules 1-2 content
- Scenario: Humanoid robot receives commands to execute tasks
- Tasks:
  * Create a full ROS 2 system with 5+ nodes:
    - TaskDispatcher (listens for high-level goals)
    - MotionPlanner (plans trajectories given goals)
    - StateEstimator (tracks robot state from mock sensors)
    - MotorController (executes trajectories)
    - Monitor (logs system state, detects failures)
  * Use custom messages for task descriptions
  * Use services for planner queries
  * Use parameters for tuning (control gains, velocity limits)
  * Integrate a humanoid URDF for visualization
  * Create launch file that starts all nodes
  * Implement logging and error handling
  * Test with RViz visualization
- Success criteria:
  * All nodes start cleanly
  * Task flows through system correctly
  * RViz shows robot executing trajectory
  * No crashes or deadlocks

## Deliverables

- 5+ ROS 2 nodes (Python)
- Custom message definitions
- Custom service definitions
- Launch file
- Humanoid URDF
- System description document (node graph, data flow)
- Screenshots: RViz visualization
- Test results: successful task execution

## Visuals Needed

- Node graph diagram
- RViz screenshots
- System flowchart

## Code Examples (8)

- All 5 nodes
- Custom messages
- Custom services
- Launch file
- URDF
- Parameter configuration file

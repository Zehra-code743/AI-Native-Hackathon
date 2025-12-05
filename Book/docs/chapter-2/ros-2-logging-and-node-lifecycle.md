# 2.4 ROS 2 Logging and Node Lifecycle

**Content Type:** conceptual + code
**Estimated Length:** 8-10 pages

## Description

- Python logging with rclpy.logging
- Log levels: DEBUG, INFO, WARN, ERROR, FATAL
- Node lifecycle management (managed nodes)
- Lifecycle states: unconfigured → inactive → active → finalized
- Lifecycle transitions: configure, activate, deactivate, cleanup
- Use case: graceful startup/shutdown for humanoid robots
- Error handling and exception propagation

## Visuals Needed

- Diagram: Node lifecycle state machine
- Code walkthrough: Managed node

## Code Examples (3)

- Basic logging in rclpy
- Managed node with lifecycle
- Error handling patterns

# 1.4 Services: Request-Response Communication

**Content Type:** conceptual + code
**Estimated Length:** 12-14 pages

## Description

- When topics are not enough (request-response patterns)
- Services vs. Topics comparison
- Service definition syntax (.srv files)
- Service server implementation (rclpy)
- Service client implementation (rclpy)
- Synchronous and asynchronous service calls
- Error handling and timeouts
- Use case: motion planning service (robot queries planner, gets path back)

## Visuals Needed

- Diagram: Service call flow (client → server → response)
- Table: Services vs. Topics (when to use which)
- Code walkthrough: Service definition and implementation

## Code Examples (4)

- Custom .srv file definition
- Service server node (e.g., GetRobotPose service)
- Service client node
- Async service client with callbacks

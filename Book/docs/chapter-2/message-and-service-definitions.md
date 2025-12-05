# 2.2 Message and Service Definitions

**Content Type:** conceptual + code
**Estimated Length:** 12-14 pages

## Description

- Built-in ROS message types (std_msgs, geometry_msgs, sensor_msgs)
- When to create custom messages
- Custom message syntax (.msg files)
- Custom service syntax (.srv files)
- Custom action syntax (.action files)
- Type safety and code generation
- Including messages in custom packages
- Practical examples for humanoid robotics:
  * HumanoidState.msg (joint angles, velocities, forces)
  * PlanTrajectory.srv (query planner)
  * Navigate.action (goal-oriented navigation)

## Visuals Needed

- Table: Common geometry_msgs and sensor_msgs
- Code examples: Message definitions

## Code Examples (6)

- Simple custom message (HumanoidJointCommand)
- Complex message with nested types
- Custom service definition
- Custom action definition
- Generated message class usage in Python
- package.xml with message generation

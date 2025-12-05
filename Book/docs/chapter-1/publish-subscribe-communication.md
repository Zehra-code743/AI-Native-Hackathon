# 1.3 Topics: Publish-Subscribe Communication

**Content Type:** conceptual + code
**Estimated Length:** 15-18 pages

## Description

- The publish-subscribe pattern explained
- Topics as named data streams (e.g., /camera/rgb, /lidar/scan, /joint_commands)
- Message types: built-in (std_msgs, geometry_msgs) vs. custom
- Quality of Service (QoS): reliability, durability, history policies
- Topic remapping and composition
- Latency considerations: best-effort vs. reliable
- Use case: sensor fusion (multiple sources publishing to single topic)

## Visuals Needed

- Diagram: Topic graph for humanoid robot (multiple publishers, multiple subscribers)
- Table: Common message types for robotics
- Table: QoS profiles (best-effort, reliable, sensor, services)
- Timing diagram: publisher → topic → subscriber flow

## Code Examples (4)

- Publisher node (publishes camera images)
- Subscriber node (consumes camera images)
- Multiple publishers on same topic (sensor fusion setup)
- QoS configuration example

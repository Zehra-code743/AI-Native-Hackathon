# 2.8 Time in ROS 2: Clocks and Timing

**Content Type:** conceptual + code
**Estimated Length:** 8-10 pages

## Description

- System time vs. simulation time (crucial for sim-to-real)
- ROS 2 clocks: steady, system, simulation
- Using ros_time for reproducible experiments
- Timing utilities: Rate, Sleep
- Measuring execution time: get_clock().now()
- Scheduling: timers for periodic tasks
- Why timing matters for robots: missed deadlines = falls/collisions
- Use case: tuning control loop frequency for motor commands

## Visuals Needed

- Diagram: Clock hierarchy in ROS 2

## Code Examples (3)

- Reading clock in node
- Setting up periodic timer
- Measuring execution time

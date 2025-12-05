# 3.3 Motor Controllers: Actuating Robots

**Content Type:** technical
**Estimated Length:** 10-12 pages

## Description

- Typical robot motor hardware: servos, brushless motors, stepper motors
- Motor driver boards: PWM controllers, CAN bus interfaces
- ROS 2 abstraction: MotorCommand message → actual hardware signals
- Feedback loops: reading encoder values for odometry
- Safety considerations: max velocity limits, torque limits, temperature monitoring
- Example controller node:
  * Subscribe to /motor_commands (list of desired joint velocities/positions)
  * Compute motor signals (PWM duty cycle, direction)
  * Apply safety bounds
  * Send to hardware
  * Read encoder feedback
  * Publish actual joint states
- Sim-to-real: same motor controller works with gazebo /gazebo/set_model_state

## Visuals Needed

- Diagram: Motor feedback control loop
- Hardware schematic example

## Code Examples (2)

- Motor controller node
- Safety-limited command handler

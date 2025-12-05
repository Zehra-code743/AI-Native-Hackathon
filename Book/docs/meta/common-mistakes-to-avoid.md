# Common Mistakes to Avoid

## Mistake: Ignoring QoS settings
- **Result:** Data loss or latency.
- **Prevention:** Always specify QoS explicitly. Use 'reliable' for critical data (commands), 'best-effort' for high-frequency data (camera).

## Mistake: Creating monolithic nodes
- **Result:** Debugging nightmare, poor reusability.
- **Prevention:** Each node should have single responsibility. Separate perception, planning, control.

## Mistake: Not handling dynamic reconnection
- **Result:** System hangs if a node crashes.
- **Prevention:** Implement timeout handling, graceful degradation, lifecycle management.

## Mistake: URDF with incorrect inertia
- **Result:** Physics simulation diverges from reality.
- **Prevention:** Use actual CAD properties or estimate conservatively. Always validate in Gazebo.

## Mistake: Mixing real-time and non-real-time in same node
- **Result:** Control jitter, motion instability.
- **Prevention:** Keep control loop in separate, dedicated thread. Use timers for periodic tasks.

## Mistake: Assuming simulated time = real time
- **Result:** Code works in sim, fails on real robot.
- **Prevention:** Always be explicit about time. Use ros_time. Test timing on actual hardware.

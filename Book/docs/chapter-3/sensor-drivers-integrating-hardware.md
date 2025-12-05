# 3.2 Sensor Drivers: Integrating Hardware

**Content Type:** technical + reference
**Estimated Length:** 10-12 pages

## Description

- What is a ROS 2 sensor driver? (Hardware interface → ROS topics)
- Using existing drivers vs. writing custom drivers
- Wrapping hardware libraries in ROS nodes
- Example driver structure:
  * Initialize hardware
  * Read data in loop
  * Convert to ROS message format
  * Publish
  * Handle errors and disconnections
- Common drivers for this course:
  * usb_cam / camera_calibration_parsers (for USB cameras)
  * realsense2_camera (Intel RealSense)
  * ldlidar_stl_ros2 (affordable LiDAR)
  * Generic IMU driver
- Configuration: intrinsics, extrinsics, calibration

## Visuals Needed

- Diagram: Sensor driver architecture
- Code walkthrough: Simple sensor driver

## Code Examples (2)

- Minimal camera driver (wrapper around OpenCV)
- IMU driver implementation

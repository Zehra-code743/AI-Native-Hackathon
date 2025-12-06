# ROS 2 Interfaces: Chapter 4 - Vision-Language-Action (VLA) Systems

**Branch**: `004-vla-chapter` | **Date**: 2025-01-27 | **Plan**: [plan.md](plan.md)

This document defines ROS 2 message types, service definitions, and action interfaces used in the VLA system.

## Custom Messages

### vla_msgs/ActionGraph

Represents an action graph for robot execution.

```yaml
# ActionGraph.msg
std_msgs/Header header
ActionNode[] nodes
ActionEdge[] edges
string source_command
string robot_id
float64 estimated_duration_seconds
```

### vla_msgs/ActionNode

Individual action node in the graph.

```yaml
# ActionNode.msg
string id
string type  # NAVIGATE, GRASP, PLACE, PERCEPTION_QUERY, WAIT, CUSTOM
string[] dependencies
string parameters_json  # JSON string of parameters
string outputs_json    # JSON string of expected outputs
SafetyConstraint[] constraints
float64 estimated_duration_seconds
```

### vla_msgs/ActionEdge

Edge representing dependency between action nodes.

```yaml
# ActionEdge.msg
string from_node_id
string to_node_id
string edge_type  # SEQUENTIAL, DATA_FLOW, CONDITIONAL
string condition  # Optional condition expression
```

### vla_msgs/SafetyConstraint

Safety constraint for action validation.

```yaml
# SafetyConstraint.msg
string type  # COLLISION_AVOIDANCE, JOINT_LIMIT, WORKSPACE_BOUNDARY, etc.
string parameters_json  # JSON string of constraint parameters
string severity  # ERROR, WARNING
```

### vla_msgs/ExecutionStatus

Status of action execution.

```yaml
# ExecutionStatus.msg
std_msgs/Header header
string execution_id
string action_graph_id
string robot_id
string status  # PENDING, EXECUTING, COMPLETED, FAILED, CANCELLED
string current_action_id
ActionResult[] results
string error_message
builtin_interfaces/Time started_at
builtin_interfaces/Time completed_at
float64 total_duration_seconds
```

### vla_msgs/ActionResult

Result of executing a single action.

```yaml
# ActionResult.msg
string action_id
string status  # SUCCESS, FAILED, CANCELLED
string outputs_json  # JSON string of action outputs
float64 duration_seconds
string error_message
builtin_interfaces/Time timestamp
```

### vla_msgs/ObjectQuery

Query for object coordinates from perception.

```yaml
# ObjectQuery.msg
std_msgs/Header header
string object_name
string camera_frame_id
float64 timeout_seconds
```

### vla_msgs/ObjectDetection

Detected object with coordinates.

```yaml
# ObjectDetection.msg
std_msgs/Header header
string object_name
geometry_msgs/Point coordinates
float64 confidence
sensor_msgs/RegionOfInterest bounding_box
string detection_model
```

## Services

### vla_srvs/ValidateActionGraph

Service to validate an action graph before execution.

```yaml
# ValidateActionGraph.srv
---
# Request
vla_msgs/ActionGraph action_graph
string robot_id

# Response
bool is_valid
string[] validation_errors
string[] warnings
```

### vla_srvs/QueryObject

Service to query perception system for object coordinates.

```yaml
# QueryObject.srv
---
# Request
string object_name
string camera_frame_id
float64 timeout_seconds

# Response
bool object_found
geometry_msgs/Point coordinates
float64 confidence
sensor_msgs/RegionOfInterest bounding_box
string error_message
```

## Actions

### vla_actions/ExecuteActionGraph

Action interface for executing an action graph with feedback.

```yaml
# ExecuteActionGraph.action
---
# Goal
vla_msgs/ActionGraph action_graph
string robot_id
float64 timeout_seconds

# Result
vla_msgs/ExecutionStatus execution_status

# Feedback
string current_action_id
string status
float64 progress_percentage  # 0.0 to 1.0
string current_status_message
```

## Standard ROS 2 Messages Used

The VLA system also uses standard ROS 2 messages:

- `geometry_msgs/Pose`, `geometry_msgs/Point`, `geometry_msgs/Twist` - For robot poses and motion
- `sensor_msgs/Image`, `sensor_msgs/PointCloud2` - For camera and depth data
- `sensor_msgs/RegionOfInterest` - For bounding boxes
- `nav_msgs/Path` - For navigation paths
- `std_msgs/Header` - For timestamps and frame IDs
- `builtin_interfaces/Time` - For timestamps

## Topics

### Published Topics

- `/vla/execution_status` (vla_msgs/ExecutionStatus) - Current execution status
- `/vla/action_feedback` (vla_msgs/ActionResult) - Feedback for completed actions
- `/vla/perception/objects` (vla_msgs/ObjectDetection[]) - Current object detections

### Subscribed Topics

- `/robot/joint_states` (sensor_msgs/JointState) - Current joint states for safety validation
- `/robot/odom` (nav_msgs/Odometry) - Robot pose for navigation
- `/camera/depth/image_raw` (sensor_msgs/Image) - Depth camera data
- `/camera/rgb/image_raw` (sensor_msgs/Image) - RGB camera data
- `/perception/detections` (vla_msgs/ObjectDetection[]) - Object detections from perception system

## ROS 2 Package Structure

```
vla_ros/
├── CMakeLists.txt
├── package.xml
├── msg/
│   ├── ActionGraph.msg
│   ├── ActionNode.msg
│   ├── ActionEdge.msg
│   ├── SafetyConstraint.msg
│   ├── ExecutionStatus.msg
│   ├── ActionResult.msg
│   ├── ObjectQuery.msg
│   └── ObjectDetection.msg
├── srv/
│   ├── ValidateActionGraph.srv
│   └── QueryObject.srv
└── action/
    └── ExecuteActionGraph.action
```

## Integration Notes

- All custom messages should be in a ROS 2 package `vla_ros`
- Use standard ROS 2 message types where possible to maintain compatibility
- JSON fields in messages allow flexibility for action parameters without defining many message types
- Action interface provides feedback during long-running executions
- Services are used for synchronous queries (validation, object lookup)
- Topics are used for asynchronous status updates and sensor data


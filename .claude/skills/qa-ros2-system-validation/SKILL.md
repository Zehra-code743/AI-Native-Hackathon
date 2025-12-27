# Skill: ROS2 System Validation and Testing

**Created**: 2025-12-27
**Context**: This skill provides comprehensive testing methodologies for ROS2-based humanoid robotics systems, covering node lifecycle testing, message validation, service reliability, action server testing, parameter management, and distributed system integration for Phase 1 and Phase 2 development.

## Overview

ROS2 system validation ensures reliable communication, correct behavior, and robust performance of distributed robotics applications. This skill covers:
- Node lifecycle and state management testing
- Topic message validation and timing
- Service request/response reliability
- Action server goal execution and feedback
- Parameter server validation
- Transform (TF2) tree integrity
- Launch file and composition testing
- Real-time performance validation
- Network communication reliability
- QoS (Quality of Service) policy testing

## Architecture Pattern

### ROS2 Testing Hierarchy

1. **Unit Testing (Single Node)**
   - Node initialization and shutdown
   - Publisher/subscriber functionality
   - Service server/client behavior
   - Action server/client operations
   - Parameter handling

2. **Integration Testing (Multi-Node)**
   - Inter-node communication
   - Service orchestration
   - Action coordination
   - TF tree consistency
   - Launch file validation

3. **System Testing (Full System)**
   - End-to-end workflows
   - Real-time performance
   - Network resilience
   - Load testing
   - Failure recovery

## Testing Framework Structure

```
tests/
├── ros2/
│   ├── unit/
│   │   ├── test_sensor_publisher.py
│   │   ├── test_controller_node.py
│   │   ├── test_planning_service.py
│   │   └── test_motion_action.py
│   ├── integration/
│   │   ├── test_sensor_controller_integration.py
│   │   ├── test_planning_execution_pipeline.py
│   │   └── test_multi_node_coordination.py
│   ├── system/
│   │   ├── test_full_walking_pipeline.py
│   │   ├── test_manipulation_workflow.py
│   │   └── test_autonomous_navigation.py
│   ├── performance/
│   │   ├── test_message_latency.py
│   │   ├── test_throughput.py
│   │   └── test_realtime_constraints.py
│   ├── fixtures/
│   │   ├── test_robot.yaml
│   │   ├── mock_sensors.py
│   │   └── test_launch.py
│   └── utils/
│       ├── ros2_test_helpers.py
│       └── assertion_helpers.py
├── launch/
│   └── test_launch_files/
│       ├── test_sensor_suite.launch.py
│       └── test_control_stack.launch.py
└── reports/
    └── ros2_test_results/
```

## Core Testing Components

### 1. Node Lifecycle Testing

```python
# tests/ros2/unit/test_controller_node.py
import pytest
import rclpy
from rclpy.node import Node
from rclpy.executors import SingleThreadedExecutor
from std_msgs.msg import Float64
from sensor_msgs.msg import JointState
from geometry_msgs.msg import Twist

from humanoid_control import MotorControllerNode

class TestMotorControllerNode:
    """Test motor controller node lifecycle and functionality."""

    @pytest.fixture
    def node(self):
        """Initialize ROS2 node for testing."""
        rclpy.init()
        node = MotorControllerNode()
        yield node
        node.destroy_node()
        rclpy.shutdown()

    def test_node_initialization(self, node):
        """Verify node initializes with correct configuration."""
        assert node.get_name() == 'motor_controller'
        assert node.get_namespace() == '/humanoid'

        # Check publishers exist
        assert node.count_publishers('joint_commands') == 1

        # Check subscribers exist
        assert node.count_subscribers('joint_states') == 1

        # Check services exist
        service_names = [s.name for s in node.get_service_names_and_types()]
        assert '/humanoid/motor_controller/set_parameters' in service_names

    def test_node_parameters(self, node):
        """Validate node parameters are loaded correctly."""
        # Check parameter existence
        assert node.has_parameter('control_frequency')
        assert node.has_parameter('max_torque')

        # Check parameter values
        control_freq = node.get_parameter('control_frequency').value
        assert control_freq == 100.0  # 100 Hz

        max_torque = node.get_parameter('max_torque').value
        assert max_torque == 50.0  # 50 Nm

    def test_publisher_creation(self, node):
        """Test topic publishers are created correctly."""
        # Get publisher info
        pub_info = node.get_publishers_info_by_topic('joint_commands')
        assert len(pub_info) > 0

        # Check QoS settings
        qos_profile = pub_info[0].qos_profile
        assert qos_profile.reliability == rclpy.qos.ReliabilityPolicy.RELIABLE
        assert qos_profile.durability == rclpy.qos.DurabilityPolicy.VOLATILE

    def test_subscriber_callback(self, node):
        """Test subscriber receives and processes messages."""
        # Create test publisher
        test_pub = node.create_publisher(JointState, 'joint_states', 10)

        # Create test message
        msg = JointState()
        msg.name = ['hip_pitch_left']
        msg.position = [0.5]
        msg.velocity = [0.1]
        msg.effort = [10.0]

        # Publish message
        test_pub.publish(msg)

        # Spin to process callbacks
        executor = SingleThreadedExecutor()
        executor.add_node(node)
        executor.spin_once(timeout_sec=1.0)

        # Verify callback processed message
        assert node.last_joint_state is not None
        assert node.last_joint_state.name[0] == 'hip_pitch_left'
        assert node.last_joint_state.position[0] == 0.5

    def test_node_cleanup(self, node):
        """Verify proper node shutdown and cleanup."""
        # Capture initial state
        initial_pub_count = node.count_publishers('joint_commands')

        # Destroy node
        node.destroy_node()

        # Verify cleanup (node should be destroyed)
        with pytest.raises(Exception):
            node.get_name()
```

### 2. Topic Communication Testing

```python
# tests/ros2/unit/test_sensor_publisher.py
import pytest
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Imu, Image
from std_msgs.msg import Header
import time

from humanoid_sensors import IMUPublisher, CameraPublisher

class TestSensorPublishers:
    """Test sensor data publishers."""

    @pytest.fixture
    def imu_publisher(self):
        """Initialize IMU publisher node."""
        rclpy.init()
        node = IMUPublisher()
        yield node
        node.destroy_node()
        rclpy.shutdown()

    def test_imu_publish_rate(self, imu_publisher):
        """Verify IMU publishes at correct frequency (100 Hz)."""
        received_messages = []

        # Create subscriber to collect messages
        test_node = rclpy.create_node('test_subscriber')
        sub = test_node.create_subscription(
            Imu,
            'imu/data',
            lambda msg: received_messages.append(msg),
            10
        )

        # Collect messages for 1 second
        executor = rclpy.executors.SingleThreadedExecutor()
        executor.add_node(imu_publisher)
        executor.add_node(test_node)

        start_time = time.time()
        while time.time() - start_time < 1.0:
            executor.spin_once(timeout_sec=0.01)

        # Should receive approximately 100 messages (±5%)
        assert 95 <= len(received_messages) <= 105, \
            f"Publish rate incorrect: {len(received_messages)} msgs in 1 sec"

        test_node.destroy_node()

    def test_imu_message_content(self, imu_publisher):
        """Validate IMU message fields."""
        received_message = None

        def callback(msg):
            nonlocal received_message
            received_message = msg

        # Subscribe to IMU topic
        test_node = rclpy.create_node('test_subscriber')
        sub = test_node.create_subscription(Imu, 'imu/data', callback, 10)

        # Wait for message
        executor = rclpy.executors.SingleThreadedExecutor()
        executor.add_node(imu_publisher)
        executor.add_node(test_node)
        executor.spin_once(timeout_sec=1.0)

        # Verify message received and valid
        assert received_message is not None

        # Check header
        assert received_message.header.frame_id == 'body_imu'
        assert received_message.header.stamp.sec > 0

        # Check orientation (quaternion should be normalized)
        q = received_message.orientation
        magnitude = (q.x**2 + q.y**2 + q.z**2 + q.w**2) ** 0.5
        assert abs(magnitude - 1.0) < 0.01

        # Check angular velocity bounds
        assert abs(received_message.angular_velocity.x) < 10.0  # rad/s
        assert abs(received_message.angular_velocity.y) < 10.0
        assert abs(received_message.angular_velocity.z) < 10.0

        # Check linear acceleration bounds
        assert abs(received_message.linear_acceleration.z - 9.81) < 1.0  # m/s²

        test_node.destroy_node()

    def test_message_timestamp_monotonic(self, imu_publisher):
        """Verify timestamps are monotonically increasing."""
        timestamps = []

        def callback(msg):
            timestamps.append(msg.header.stamp.sec + msg.header.stamp.nanosec * 1e-9)

        test_node = rclpy.create_node('test_subscriber')
        sub = test_node.create_subscription(Imu, 'imu/data', callback, 10)

        # Collect 100 messages
        executor = rclpy.executors.SingleThreadedExecutor()
        executor.add_node(imu_publisher)
        executor.add_node(test_node)

        while len(timestamps) < 100:
            executor.spin_once(timeout_sec=0.01)

        # Check monotonicity
        for i in range(1, len(timestamps)):
            assert timestamps[i] > timestamps[i-1], \
                f"Timestamp not monotonic at index {i}"

        test_node.destroy_node()
```

### 3. Service Testing

```python
# tests/ros2/unit/test_planning_service.py
import pytest
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import PoseStamped
from nav_msgs.msg import Path

from humanoid_interfaces.srv import PlanTrajectory
from humanoid_planning import TrajectoryPlanner

class TestPlanningService:
    """Test trajectory planning service."""

    @pytest.fixture
    def planner_node(self):
        """Initialize planning service node."""
        rclpy.init()
        node = TrajectoryPlanner()
        yield node
        node.destroy_node()
        rclpy.shutdown()

    def test_service_availability(self, planner_node):
        """Verify planning service is available."""
        # Create client
        client_node = rclpy.create_node('test_client')
        client = client_node.create_client(PlanTrajectory, 'plan_trajectory')

        # Wait for service (max 5 seconds)
        assert client.wait_for_service(timeout_sec=5.0), \
            "Planning service not available"

        client_node.destroy_node()

    def test_valid_planning_request(self, planner_node):
        """Test service with valid planning request."""
        # Create client
        client_node = rclpy.create_node('test_client')
        client = client_node.create_client(PlanTrajectory, 'plan_trajectory')
        client.wait_for_service(timeout_sec=5.0)

        # Create request
        request = PlanTrajectory.Request()
        request.start.pose.position.x = 0.0
        request.start.pose.position.y = 0.0
        request.goal.pose.position.x = 1.0
        request.goal.pose.position.y = 1.0

        # Send request
        future = client.call_async(request)

        # Wait for response
        executor = rclpy.executors.SingleThreadedExecutor()
        executor.add_node(planner_node)
        executor.add_node(client_node)

        timeout = 10.0  # seconds
        start_time = time.time()
        while not future.done() and (time.time() - start_time) < timeout:
            executor.spin_once(timeout_sec=0.1)

        assert future.done(), "Service call timeout"

        # Check response
        response = future.result()
        assert response.success is True
        assert len(response.trajectory.poses) > 0

        # Verify trajectory starts at start pose
        assert abs(response.trajectory.poses[0].pose.position.x - 0.0) < 0.01
        assert abs(response.trajectory.poses[0].pose.position.y - 0.0) < 0.01

        # Verify trajectory ends at goal pose
        assert abs(response.trajectory.poses[-1].pose.position.x - 1.0) < 0.01
        assert abs(response.trajectory.poses[-1].pose.position.y - 1.0) < 0.01

        client_node.destroy_node()

    def test_invalid_planning_request(self, planner_node):
        """Test service handles invalid requests correctly."""
        client_node = rclpy.create_node('test_client')
        client = client_node.create_client(PlanTrajectory, 'plan_trajectory')
        client.wait_for_service(timeout_sec=5.0)

        # Create invalid request (unreachable goal)
        request = PlanTrajectory.Request()
        request.start.pose.position.x = 0.0
        request.start.pose.position.y = 0.0
        request.goal.pose.position.x = 1000.0  # Unreachable
        request.goal.pose.position.y = 1000.0

        # Send request
        future = client.call_async(request)

        # Wait for response
        executor = rclpy.executors.SingleThreadedExecutor()
        executor.add_node(planner_node)
        executor.add_node(client_node)

        while not future.done():
            executor.spin_once(timeout_sec=0.1)

        # Should return failure
        response = future.result()
        assert response.success is False
        assert "unreachable" in response.message.lower()

        client_node.destroy_node()

    def test_concurrent_service_requests(self, planner_node):
        """Test service handles multiple concurrent requests."""
        client_node = rclpy.create_node('test_client')
        client = client_node.create_client(PlanTrajectory, 'plan_trajectory')
        client.wait_for_service(timeout_sec=5.0)

        # Send 10 concurrent requests
        futures = []
        for i in range(10):
            request = PlanTrajectory.Request()
            request.start.pose.position.x = 0.0
            request.start.pose.position.y = 0.0
            request.goal.pose.position.x = float(i)
            request.goal.pose.position.y = float(i)
            futures.append(client.call_async(request))

        # Wait for all responses
        executor = rclpy.executors.SingleThreadedExecutor()
        executor.add_node(planner_node)
        executor.add_node(client_node)

        timeout = 30.0
        start_time = time.time()
        while not all(f.done() for f in futures) and (time.time() - start_time) < timeout:
            executor.spin_once(timeout_sec=0.1)

        # All should complete successfully
        for future in futures:
            assert future.done()
            response = future.result()
            assert response.success is True

        client_node.destroy_node()
```

### 4. Action Server Testing

```python
# tests/ros2/unit/test_motion_action.py
import pytest
import rclpy
from rclpy.action import ActionClient
from rclpy.node import Node
import time

from humanoid_interfaces.action import ExecuteMotion
from humanoid_control import MotionActionServer

class TestMotionActionServer:
    """Test motion execution action server."""

    @pytest.fixture
    def action_server_node(self):
        """Initialize action server node."""
        rclpy.init()
        node = MotionActionServer()
        yield node
        node.destroy_node()
        rclpy.shutdown()

    def test_action_server_availability(self, action_server_node):
        """Verify action server is available."""
        client_node = rclpy.create_node('test_action_client')
        client = ActionClient(client_node, ExecuteMotion, 'execute_motion')

        # Wait for server (max 5 seconds)
        assert client.wait_for_server(timeout_sec=5.0), \
            "Action server not available"

        client_node.destroy_node()

    def test_action_goal_execution(self, action_server_node):
        """Test action server executes goal successfully."""
        client_node = rclpy.create_node('test_action_client')
        client = ActionClient(client_node, ExecuteMotion, 'execute_motion')
        client.wait_for_server(timeout_sec=5.0)

        # Create goal
        goal = ExecuteMotion.Goal()
        goal.motion_type = 'walk_forward'
        goal.distance = 1.0  # meters
        goal.duration = 5.0  # seconds

        # Send goal
        send_goal_future = client.send_goal_async(goal)

        executor = rclpy.executors.SingleThreadedExecutor()
        executor.add_node(action_server_node)
        executor.add_node(client_node)

        # Wait for goal acceptance
        while not send_goal_future.done():
            executor.spin_once(timeout_sec=0.1)

        goal_handle = send_goal_future.result()
        assert goal_handle.accepted, "Goal rejected"

        # Wait for result
        result_future = goal_handle.get_result_async()

        timeout = 10.0
        start_time = time.time()
        while not result_future.done() and (time.time() - start_time) < timeout:
            executor.spin_once(timeout_sec=0.1)

        assert result_future.done(), "Action execution timeout"

        # Check result
        result = result_future.result().result
        assert result.success is True
        assert result.distance_traveled >= 0.95  # Within 5%

        client_node.destroy_node()

    def test_action_feedback(self, action_server_node):
        """Test action server provides feedback during execution."""
        feedback_received = []

        def feedback_callback(feedback_msg):
            feedback_received.append(feedback_msg.feedback)

        client_node = rclpy.create_node('test_action_client')
        client = ActionClient(client_node, ExecuteMotion, 'execute_motion')
        client.wait_for_server(timeout_sec=5.0)

        # Create goal
        goal = ExecuteMotion.Goal()
        goal.motion_type = 'walk_forward'
        goal.distance = 1.0
        goal.duration = 5.0

        # Send goal with feedback callback
        send_goal_future = client.send_goal_async(
            goal,
            feedback_callback=feedback_callback
        )

        executor = rclpy.executors.SingleThreadedExecutor()
        executor.add_node(action_server_node)
        executor.add_node(client_node)

        # Wait for goal acceptance
        while not send_goal_future.done():
            executor.spin_once(timeout_sec=0.1)

        goal_handle = send_goal_future.result()
        result_future = goal_handle.get_result_async()

        # Wait for completion
        while not result_future.done():
            executor.spin_once(timeout_sec=0.1)

        # Should have received multiple feedback messages
        assert len(feedback_received) >= 5

        # Feedback progress should be increasing
        for i in range(1, len(feedback_received)):
            assert feedback_received[i].progress >= feedback_received[i-1].progress

        client_node.destroy_node()

    def test_action_cancellation(self, action_server_node):
        """Test action can be cancelled mid-execution."""
        client_node = rclpy.create_node('test_action_client')
        client = ActionClient(client_node, ExecuteMotion, 'execute_motion')
        client.wait_for_server(timeout_sec=5.0)

        # Create long-running goal
        goal = ExecuteMotion.Goal()
        goal.motion_type = 'walk_forward'
        goal.distance = 10.0  # Long distance
        goal.duration = 20.0  # Long duration

        # Send goal
        send_goal_future = client.send_goal_async(goal)

        executor = rclpy.executors.SingleThreadedExecutor()
        executor.add_node(action_server_node)
        executor.add_node(client_node)

        # Wait for acceptance
        while not send_goal_future.done():
            executor.spin_once(timeout_sec=0.1)

        goal_handle = send_goal_future.result()

        # Let it run for 1 second
        time.sleep(1)
        executor.spin_once(timeout_sec=0.1)

        # Cancel goal
        cancel_future = goal_handle.cancel_goal_async()

        # Wait for cancellation
        while not cancel_future.done():
            executor.spin_once(timeout_sec=0.1)

        # Get result
        result_future = goal_handle.get_result_async()
        while not result_future.done():
            executor.spin_once(timeout_sec=0.1)

        result = result_future.result()

        # Should be cancelled
        assert result.status == rclpy.action.GoalStatus.STATUS_CANCELED

        client_node.destroy_node()
```

### 5. TF2 Transform Testing

```python
# tests/ros2/integration/test_tf_tree.py
import pytest
import rclpy
from rclpy.node import Node
from tf2_ros import Buffer, TransformListener
from geometry_msgs.msg import TransformStamped
import time

class TestTFTree:
    """Test robot TF transform tree integrity."""

    @pytest.fixture
    def tf_buffer(self):
        """Initialize TF buffer and listener."""
        rclpy.init()
        node = rclpy.create_node('test_tf_listener')
        tf_buffer = Buffer()
        tf_listener = TransformListener(tf_buffer, node)

        # Wait for transforms to populate
        time.sleep(2)

        yield tf_buffer, node

        node.destroy_node()
        rclpy.shutdown()

    def test_required_frames_exist(self, tf_buffer):
        """Verify all required TF frames exist."""
        buffer, node = tf_buffer

        required_frames = [
            'base_link',
            'body_imu',
            'hip_pitch_left',
            'knee_pitch_left',
            'ankle_pitch_left',
            'foot_left',
            'hip_pitch_right',
            'knee_pitch_right',
            'ankle_pitch_right',
            'foot_right',
        ]

        # Check each frame exists
        for frame in required_frames:
            try:
                # Try to get transform from base_link
                transform = buffer.lookup_transform(
                    'base_link',
                    frame,
                    rclpy.time.Time(),
                    timeout=rclpy.duration.Duration(seconds=1.0)
                )
                assert transform is not None
            except Exception as e:
                pytest.fail(f"Frame '{frame}' not found in TF tree: {e}")

    def test_transform_chain_continuity(self, tf_buffer):
        """Verify TF chain from base to end effectors."""
        buffer, node = tf_buffer

        # Test left leg chain
        try:
            transform = buffer.lookup_transform(
                'base_link',
                'foot_left',
                rclpy.time.Time(),
                timeout=rclpy.duration.Duration(seconds=1.0)
            )

            # Foot should be roughly 1 meter below base
            assert transform.transform.translation.z < -0.5
            assert transform.transform.translation.z > -1.5

        except Exception as e:
            pytest.fail(f"Left leg TF chain broken: {e}")

        # Test right leg chain
        try:
            transform = buffer.lookup_transform(
                'base_link',
                'foot_right',
                rclpy.time.Time(),
                timeout=rclpy.duration.Duration(seconds=1.0)
            )

            # Foot should be roughly 1 meter below base
            assert transform.transform.translation.z < -0.5
            assert transform.transform.translation.z > -1.5

        except Exception as e:
            pytest.fail(f"Right leg TF chain broken: {e}")

    def test_transform_update_rate(self, tf_buffer):
        """Verify transforms update at expected rate."""
        buffer, node = tf_buffer

        timestamps = []

        # Collect transform timestamps over 1 second
        start_time = time.time()
        while time.time() - start_time < 1.0:
            try:
                transform = buffer.lookup_transform(
                    'base_link',
                    'foot_left',
                    rclpy.time.Time()
                )
                timestamp = transform.header.stamp.sec + \
                           transform.header.stamp.nanosec * 1e-9
                if not timestamps or timestamp != timestamps[-1]:
                    timestamps.append(timestamp)
            except:
                pass
            time.sleep(0.01)

        # Should update at least 50 Hz (20ms intervals)
        assert len(timestamps) >= 50, \
            f"Transform update rate too low: {len(timestamps)} Hz"
```

### 6. QoS Policy Testing

```python
# tests/ros2/unit/test_qos_policies.py
import pytest
import rclpy
from rclpy.qos import QoSProfile, ReliabilityPolicy, DurabilityPolicy, HistoryPolicy

class TestQoSPolicies:
    """Test ROS2 Quality of Service policies."""

    def test_reliable_communication(self):
        """Verify reliable QoS prevents message loss."""
        rclpy.init()

        # Create publisher with RELIABLE QoS
        pub_node = rclpy.create_node('reliable_publisher')
        qos = QoSProfile(
            reliability=ReliabilityPolicy.RELIABLE,
            history=HistoryPolicy.KEEP_LAST,
            depth=10
        )
        pub = pub_node.create_publisher(String, 'test_topic', qos)

        # Create subscriber
        received_messages = []
        sub_node = rclpy.create_node('reliable_subscriber')
        sub = sub_node.create_subscription(
            String,
            'test_topic',
            lambda msg: received_messages.append(msg),
            qos
        )

        # Publish 100 messages rapidly
        for i in range(100):
            msg = String()
            msg.data = f"Message {i}"
            pub.publish(msg)

        # Spin to receive messages
        executor = rclpy.executors.SingleThreadedExecutor()
        executor.add_node(pub_node)
        executor.add_node(sub_node)

        # Process for 2 seconds
        start_time = time.time()
        while time.time() - start_time < 2.0:
            executor.spin_once(timeout_sec=0.01)

        # Should receive all 100 messages (reliable QoS)
        assert len(received_messages) == 100

        pub_node.destroy_node()
        sub_node.destroy_node()
        rclpy.shutdown()

    def test_best_effort_allows_loss(self):
        """Verify best-effort QoS may drop messages under load."""
        rclpy.init()

        # Create publisher with BEST_EFFORT QoS
        pub_node = rclpy.create_node('best_effort_publisher')
        qos = QoSProfile(
            reliability=ReliabilityPolicy.BEST_EFFORT,
            history=HistoryPolicy.KEEP_LAST,
            depth=1  # Small depth to encourage drops
        )
        pub = pub_node.create_publisher(String, 'test_topic', qos)

        # Create slow subscriber
        received_messages = []
        def slow_callback(msg):
            time.sleep(0.1)  # Slow processing
            received_messages.append(msg)

        sub_node = rclpy.create_node('best_effort_subscriber')
        sub = sub_node.create_subscription(String, 'test_topic', slow_callback, qos)

        # Publish 100 messages rapidly
        for i in range(100):
            msg = String()
            msg.data = f"Message {i}"
            pub.publish(msg)
            time.sleep(0.01)

        # Spin to receive
        executor = rclpy.executors.SingleThreadedExecutor()
        executor.add_node(pub_node)
        executor.add_node(sub_node)

        start_time = time.time()
        while time.time() - start_time < 15.0:
            executor.spin_once(timeout_sec=0.01)

        # May receive fewer than 100 (best effort allows drops)
        # But should still receive a reasonable amount
        assert 10 <= len(received_messages) < 100

        pub_node.destroy_node()
        sub_node.destroy_node()
        rclpy.shutdown()
```

## Best Practices

### Test Organization
1. **Separate** unit, integration, and system tests
2. **Use** fixtures for common node initialization
3. **Mock** external dependencies when appropriate
4. **Test** both success and failure paths
5. **Document** expected behavior clearly

### ROS2-Specific Testing
1. **Always** call `rclpy.init()` before creating nodes
2. **Always** call `rclpy.shutdown()` in test cleanup
3. **Use** executors properly for spinning nodes
4. **Set** appropriate timeouts for service/action calls
5. **Verify** QoS compatibility between publishers/subscribers

### Performance Validation
1. **Measure** message latency end-to-end
2. **Test** system under maximum expected load
3. **Verify** real-time constraints are met
4. **Monitor** CPU and memory usage
5. **Test** network resilience and recovery

### Launch File Testing
1. **Test** launch files start all required nodes
2. **Verify** parameters are loaded correctly
3. **Check** node remappings and namespaces
4. **Test** conditional launches work correctly
5. **Validate** argument passing

## Common Issues and Solutions

### Issue: Service call hangs indefinitely
**Solution**: Always use timeouts in `wait_for_service()` and spin executors

### Issue: Messages not received by subscriber
**Solution**: Check QoS compatibility and spin executor properly

### Issue: Transform not found in TF tree
**Solution**: Verify transform is published and timestamp is valid

### Issue: Action goal rejected
**Solution**: Check action server is running and goal meets preconditions

## References

- ROS2 Testing: https://docs.ros.org/en/rolling/Tutorials/Intermediate/Testing/Testing-Main.html
- ROS2 QoS: https://docs.ros.org/en/rolling/Concepts/About-Quality-of-Service-Settings.html
- pytest: https://docs.pytest.org/

## Changelog

- **2025-12-27**: Initial skill creation for Phase 1/2 humanoid robotics ROS2 testing

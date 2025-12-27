# Skill: Hardware Integration Testing for Humanoid Robots

**Created**: 2025-12-27
**Context**: This skill provides comprehensive guidelines for testing hardware integration in physical humanoid robots, covering sensor validation, actuator verification, communication protocols, and hardware-software interface testing for Phase 1 and Phase 2 humanoid robotics systems.

## Overview

Hardware integration testing ensures that all physical components of a humanoid robot work correctly individually and as an integrated system. This skill covers:
- Sensor calibration and validation (IMU, cameras, force sensors, encoders)
- Actuator testing (motors, servos, pneumatics)
- Communication protocol verification (CAN bus, I2C, SPI, UART)
- Power system validation
- Emergency stop and safety circuit testing
- Hardware-software interface validation
- Environmental testing (temperature, humidity, vibration)

## Architecture Pattern

### Hardware Testing Hierarchy

1. **Component-Level Testing**
   - Individual sensor validation
   - Actuator functional tests
   - Power subsystem checks
   - Communication interface tests

2. **Subsystem Integration Testing**
   - Sensor fusion validation
   - Coordinated actuator control
   - Power distribution verification
   - Communication bus reliability

3. **System-Level Integration Testing**
   - Full kinematic chain validation
   - Multi-sensor coordination
   - Real-time performance testing
   - Safety system integration

## Testing Framework Structure

```
tests/
├── hardware/
│   ├── sensors/
│   │   ├── test_imu_calibration.py
│   │   ├── test_camera_validation.py
│   │   ├── test_force_sensors.py
│   │   └── test_encoders.py
│   ├── actuators/
│   │   ├── test_motor_drivers.py
│   │   ├── test_servo_control.py
│   │   └── test_joint_limits.py
│   ├── communication/
│   │   ├── test_can_bus.py
│   │   ├── test_i2c_devices.py
│   │   └── test_uart_protocol.py
│   ├── power/
│   │   ├── test_battery_management.py
│   │   ├── test_voltage_regulation.py
│   │   └── test_current_limits.py
│   └── safety/
│       ├── test_emergency_stop.py
│       ├── test_limit_switches.py
│       └── test_watchdog_timer.py
├── integration/
│   ├── test_sensor_actuator_loop.py
│   ├── test_kinematic_chain.py
│   └── test_full_system.py
├── fixtures/
│   ├── hardware_config.yaml
│   └── test_data/
└── reports/
    └── hardware_test_results/
```

## Core Testing Components

### 1. Sensor Validation Framework

```python
# tests/hardware/sensors/test_imu_calibration.py
import pytest
import numpy as np
from robot_hardware import IMU, SensorConfig
from test_fixtures import RobotTestHarness

class TestIMUCalibration:
    """Validate IMU sensor calibration and accuracy."""

    @pytest.fixture
    def imu_sensor(self):
        """Initialize IMU sensor for testing."""
        config = SensorConfig(
            sensor_type="IMU",
            interface="I2C",
            address=0x68,
            sample_rate=100  # Hz
        )
        return IMU(config)

    def test_imu_initialization(self, imu_sensor):
        """Verify IMU initializes correctly."""
        assert imu_sensor.is_connected()
        assert imu_sensor.get_device_id() == 0x68
        assert imu_sensor.get_sample_rate() == 100

    def test_accelerometer_calibration(self, imu_sensor):
        """Test accelerometer zero-bias calibration."""
        # Place robot on level surface
        samples = imu_sensor.read_accelerometer(num_samples=1000)

        # X and Y should be near zero (±0.05 m/s²)
        x_bias = np.mean(samples[:, 0])
        y_bias = np.mean(samples[:, 1])

        assert abs(x_bias) < 0.05, f"X-axis bias too high: {x_bias}"
        assert abs(y_bias) < 0.05, f"Y-axis bias too high: {y_bias}"

        # Z should be near 9.81 m/s² (±0.1 m/s²)
        z_mean = np.mean(samples[:, 2])
        assert 9.71 < z_mean < 9.91, f"Z-axis gravity incorrect: {z_mean}"

    def test_gyroscope_drift(self, imu_sensor):
        """Test gyroscope drift over time."""
        # Keep robot stationary for 60 seconds
        initial_reading = imu_sensor.read_gyroscope()
        time.sleep(60)
        final_reading = imu_sensor.read_gyroscope()

        # Maximum drift: 0.5 deg/s over 60 seconds
        drift = np.linalg.norm(final_reading - initial_reading)
        assert drift < 0.5, f"Gyroscope drift too high: {drift} deg/s"

    def test_magnetometer_calibration(self, imu_sensor):
        """Verify magnetometer hard-iron and soft-iron calibration."""
        # Rotate robot 360 degrees in all axes
        samples = []
        for angle in range(0, 360, 10):
            reading = imu_sensor.read_magnetometer()
            samples.append(reading)

        samples = np.array(samples)

        # Check that samples form a sphere (properly calibrated)
        # Calculate center and radius
        center = np.mean(samples, axis=0)
        radii = np.linalg.norm(samples - center, axis=1)
        radius_std = np.std(radii)

        # Standard deviation should be < 5% of mean radius
        assert radius_std / np.mean(radii) < 0.05

    def test_sensor_noise_characteristics(self, imu_sensor):
        """Validate sensor noise is within acceptable bounds."""
        # Collect 1000 samples at 100 Hz
        samples = imu_sensor.read_all(num_samples=1000)

        # Calculate Allan variance (measure of noise)
        allan_var = calculate_allan_variance(samples)

        # Compare to sensor datasheet specifications
        assert allan_var['accel'] < 0.01  # m/s²
        assert allan_var['gyro'] < 0.001  # deg/s
        assert allan_var['mag'] < 0.05    # µT
```

### 2. Actuator Testing Framework

```python
# tests/hardware/actuators/test_motor_drivers.py
import pytest
import time
from robot_hardware import MotorController, JointConfig
from safety import EmergencyStop

class TestMotorControllers:
    """Test motor drivers and joint actuators."""

    @pytest.fixture
    def motor_controller(self):
        """Initialize motor controller for testing."""
        config = JointConfig(
            joint_name="hip_pitch_left",
            motor_type="brushless_dc",
            max_torque=50.0,  # Nm
            max_velocity=6.28,  # rad/s (1 rev/s)
            gear_ratio=100.0,
            encoder_resolution=4096
        )
        return MotorController(config)

    def test_motor_communication(self, motor_controller):
        """Verify communication with motor driver."""
        assert motor_controller.is_connected()
        assert motor_controller.get_status() == "ready"

        # Test firmware version
        version = motor_controller.get_firmware_version()
        assert version >= "2.0.0"

    def test_encoder_feedback(self, motor_controller):
        """Validate encoder feedback accuracy."""
        # Move motor to known position
        target_position = 1.57  # 90 degrees in radians
        motor_controller.set_position(target_position)

        # Wait for movement to complete
        time.sleep(2)

        # Check actual position
        actual_position = motor_controller.get_position()
        position_error = abs(actual_position - target_position)

        # Tolerance: ±0.01 radians (±0.57 degrees)
        assert position_error < 0.01, f"Position error: {position_error} rad"

    def test_velocity_control(self, motor_controller):
        """Test velocity control loop."""
        target_velocity = 3.14  # rad/s
        motor_controller.set_velocity(target_velocity)

        # Let system reach steady state
        time.sleep(1)

        # Measure actual velocity over 2 seconds
        velocities = []
        for _ in range(20):
            velocities.append(motor_controller.get_velocity())
            time.sleep(0.1)

        avg_velocity = np.mean(velocities)
        velocity_error = abs(avg_velocity - target_velocity)

        # Tolerance: ±5% of target velocity
        assert velocity_error < 0.05 * target_velocity

    def test_torque_limiting(self, motor_controller):
        """Verify torque limits are enforced."""
        # Set torque limit to 30 Nm (below max of 50 Nm)
        motor_controller.set_torque_limit(30.0)

        # Apply large position error to generate high torque demand
        motor_controller.set_position(3.14)  # 180 degrees
        motor_controller.set_current_position(0.0)

        # Monitor torque over movement
        max_torque = 0
        for _ in range(100):
            current_torque = motor_controller.get_torque()
            max_torque = max(max_torque, abs(current_torque))
            time.sleep(0.01)

        # Verify torque never exceeded limit
        assert max_torque <= 30.5, f"Torque limit violated: {max_torque} Nm"

    def test_emergency_stop_response(self, motor_controller):
        """Test emergency stop behavior."""
        # Start motor moving
        motor_controller.set_velocity(3.0)
        time.sleep(0.5)

        # Trigger emergency stop
        initial_velocity = motor_controller.get_velocity()
        motor_controller.emergency_stop()

        # Verify motor stopped within 100ms
        time.sleep(0.1)
        final_velocity = motor_controller.get_velocity()

        assert abs(final_velocity) < 0.1, "Emergency stop too slow"
        assert motor_controller.get_status() == "e_stop"

    def test_thermal_monitoring(self, motor_controller):
        """Validate temperature monitoring and limits."""
        initial_temp = motor_controller.get_temperature()

        # Run motor at high torque for extended period
        motor_controller.set_torque(40.0)  # 80% of max

        # Monitor temperature rise
        for _ in range(600):  # 10 minutes
            temp = motor_controller.get_temperature()

            # Should not exceed 80°C
            assert temp < 80.0, f"Motor overheating: {temp}°C"

            # Check for thermal shutdown
            if temp > 75.0:
                assert motor_controller.get_status() == "thermal_warning"

            time.sleep(1)

    def test_backlash_measurement(self, motor_controller):
        """Measure mechanical backlash in gear train."""
        # Move forward then backward
        positions_forward = []
        positions_backward = []

        for target in np.linspace(0, 1.57, 20):
            motor_controller.set_position(target)
            time.sleep(0.5)
            positions_forward.append(motor_controller.get_position())

        for target in np.linspace(1.57, 0, 20):
            motor_controller.set_position(target)
            time.sleep(0.5)
            positions_backward.append(motor_controller.get_position())

        # Calculate backlash
        backlash = np.mean(np.abs(
            np.array(positions_forward) - np.array(positions_backward[::-1])
        ))

        # Backlash should be < 0.02 radians (~1 degree)
        assert backlash < 0.02, f"Excessive backlash: {backlash} rad"
```

### 3. Communication Protocol Testing

```python
# tests/hardware/communication/test_can_bus.py
import pytest
import can
from robot_hardware import CANBusInterface
from test_fixtures import CANAnalyzer

class TestCANBus:
    """Validate CAN bus communication and reliability."""

    @pytest.fixture
    def can_bus(self):
        """Initialize CAN bus for testing."""
        return CANBusInterface(
            channel='can0',
            bitrate=1000000,  # 1 Mbps
            timeout=0.1
        )

    def test_can_bus_initialization(self, can_bus):
        """Verify CAN bus starts correctly."""
        assert can_bus.is_connected()
        assert can_bus.get_bitrate() == 1000000
        assert can_bus.get_bus_state() == "active"

    def test_message_transmission(self, can_bus):
        """Test basic message transmission and reception."""
        # Send test message
        test_msg = can.Message(
            arbitration_id=0x123,
            data=[0x11, 0x22, 0x33, 0x44],
            is_extended_id=False
        )

        can_bus.send(test_msg)

        # Receive with loopback
        received = can_bus.recv(timeout=1.0)

        assert received is not None
        assert received.arbitration_id == 0x123
        assert list(received.data) == [0x11, 0x22, 0x33, 0x44]

    def test_bus_load_capacity(self, can_bus):
        """Test CAN bus under high message load."""
        messages_sent = 0
        messages_received = 0
        errors = 0

        # Send 10000 messages as fast as possible
        start_time = time.time()

        for i in range(10000):
            msg = can.Message(
                arbitration_id=0x100 + (i % 256),
                data=[i & 0xFF, (i >> 8) & 0xFF],
            )
            try:
                can_bus.send(msg)
                messages_sent += 1
            except can.CanError:
                errors += 1

        duration = time.time() - start_time

        # Verify bus utilization and error rate
        bus_load = messages_sent / duration
        error_rate = errors / messages_sent if messages_sent > 0 else 1

        assert bus_load > 8000, f"Bus load too low: {bus_load} msg/s"
        assert error_rate < 0.01, f"Error rate too high: {error_rate}"

    def test_arbitration_priority(self, can_bus):
        """Verify CAN arbitration prioritizes lower IDs."""
        # Send messages with different priorities simultaneously
        high_priority = can.Message(arbitration_id=0x100, data=[0x01])
        low_priority = can.Message(arbitration_id=0x200, data=[0x02])

        # Send both at same time (will arbitrate)
        can_bus.send(high_priority, block=False)
        can_bus.send(low_priority, block=False)

        # High priority should be received first
        first = can_bus.recv(timeout=1.0)
        second = can_bus.recv(timeout=1.0)

        assert first.arbitration_id == 0x100
        assert second.arbitration_id == 0x200

    def test_error_recovery(self, can_bus):
        """Test bus recovery from error states."""
        # Induce bus error by disconnecting one node
        can_bus.simulate_error("bus_off")

        assert can_bus.get_bus_state() == "bus_off"

        # Attempt recovery
        can_bus.reset()
        time.sleep(0.1)

        # Verify recovery
        assert can_bus.get_bus_state() == "active"

        # Verify messages can be sent again
        test_msg = can.Message(arbitration_id=0x123, data=[0xFF])
        can_bus.send(test_msg)
```

### 4. Power System Testing

```python
# tests/hardware/power/test_battery_management.py
import pytest
from robot_hardware import BatteryManagementSystem
from test_fixtures import PowerSupply

class TestBatteryManagement:
    """Validate power system and battery management."""

    @pytest.fixture
    def bms(self):
        """Initialize battery management system."""
        return BatteryManagementSystem(
            battery_type="LiPo",
            cell_count=6,  # 6S battery (22.2V nominal)
            capacity=10000,  # mAh
            max_current=50  # A
        )

    def test_cell_voltage_monitoring(self, bms):
        """Verify individual cell voltage monitoring."""
        cell_voltages = bms.get_cell_voltages()

        # Check all cells within safe range (3.3V - 4.2V)
        for i, voltage in enumerate(cell_voltages):
            assert 3.3 <= voltage <= 4.2, \
                f"Cell {i+1} voltage out of range: {voltage}V"

        # Check cell balance (max difference < 0.05V)
        max_diff = max(cell_voltages) - min(cell_voltages)
        assert max_diff < 0.05, f"Cell imbalance too high: {max_diff}V"

    def test_overcurrent_protection(self, bms):
        """Test overcurrent protection triggers correctly."""
        # Simulate high current draw (60A, above 50A limit)
        try:
            bms.simulate_load(current=60.0)
            time.sleep(0.1)

            # Should have triggered protection
            assert False, "Overcurrent protection did not trigger"
        except BatteryError as e:
            assert "overcurrent" in str(e).lower()
            assert bms.get_status() == "protected"

    def test_low_voltage_cutoff(self, bms):
        """Verify low voltage protection."""
        # Discharge battery to low voltage (3.0V per cell)
        bms.simulate_discharge(target_voltage=3.0)

        # Should trigger low voltage warning
        assert bms.get_status() == "low_voltage"

        # Further discharge should trigger cutoff
        bms.simulate_discharge(target_voltage=2.9)
        assert bms.get_status() == "cutoff"
        assert bms.is_output_enabled() == False

    def test_state_of_charge_accuracy(self, bms):
        """Validate state of charge estimation."""
        # Start with full battery
        bms.reset_to_full()
        assert bms.get_soc() == 100

        # Discharge known amount (5000 mAh = 50% capacity)
        bms.simulate_discharge(capacity_mah=5000)

        # SOC should be approximately 50%
        soc = bms.get_soc()
        assert 48 <= soc <= 52, f"SOC inaccurate: {soc}%"

    def test_temperature_monitoring(self, bms):
        """Test battery temperature monitoring."""
        temp = bms.get_temperature()

        # Should be within safe operating range
        assert 10 <= temp <= 45, f"Temperature out of range: {temp}°C"

        # Simulate overheating
        bms.simulate_temperature(60)

        # Should trigger thermal protection
        assert bms.get_status() == "thermal_protection"
        assert bms.is_output_enabled() == False
```

### 5. Safety System Testing

```python
# tests/hardware/safety/test_emergency_stop.py
import pytest
from robot_hardware import SafetySystem, EmergencyStop
from robot_control import RobotController

class TestEmergencyStop:
    """Validate emergency stop and safety systems."""

    @pytest.fixture
    def safety_system(self):
        """Initialize safety system for testing."""
        return SafetySystem(
            emergency_stop_inputs=["physical_button", "software_trigger", "wireless_remote"],
            monitored_systems=["motors", "sensors", "power", "communication"]
        )

    def test_physical_estop_button(self, safety_system):
        """Test physical emergency stop button."""
        # Verify button is not pressed initially
        assert safety_system.get_estop_status() == "released"

        # Simulate button press
        safety_system.simulate_estop_press("physical_button")

        # Should trigger immediately
        assert safety_system.get_estop_status() == "triggered"
        assert safety_system.is_system_safe() == False

        # All motors should be disabled
        for motor in safety_system.get_all_motors():
            assert motor.is_enabled() == False

    def test_estop_response_time(self, safety_system):
        """Verify emergency stop response time < 50ms."""
        # Start motors moving
        robot = RobotController()
        robot.start_walking()

        # Trigger emergency stop and measure time
        start_time = time.perf_counter()
        safety_system.trigger_estop()

        # Wait for all motors to stop
        while any(m.get_velocity() != 0 for m in robot.get_motors()):
            elapsed = time.perf_counter() - start_time
            assert elapsed < 0.1, "E-stop response too slow"
            time.sleep(0.001)

        response_time = time.perf_counter() - start_time
        assert response_time < 0.05, \
            f"E-stop response time too high: {response_time*1000:.1f}ms"

    def test_watchdog_timer(self, safety_system):
        """Test watchdog timer triggers on communication loss."""
        # Start watchdog with 500ms timeout
        safety_system.start_watchdog(timeout=0.5)

        # Feed watchdog normally
        for _ in range(5):
            safety_system.feed_watchdog()
            time.sleep(0.1)

        assert safety_system.get_estop_status() == "released"

        # Stop feeding watchdog (simulate communication loss)
        time.sleep(0.6)

        # Should trigger emergency stop
        assert safety_system.get_estop_status() == "triggered"

    def test_limit_switch_detection(self, safety_system):
        """Verify limit switches stop motion."""
        # Configure limit switches for joint
        joint = safety_system.get_joint("knee_left")

        # Move joint toward limit
        joint.set_velocity(1.0)

        # Simulate limit switch activation
        safety_system.simulate_limit_switch("knee_left", "max")

        # Joint should stop immediately
        time.sleep(0.01)
        assert abs(joint.get_velocity()) < 0.1
        assert joint.get_status() == "limit_reached"

    def test_estop_reset_procedure(self, safety_system):
        """Test proper emergency stop reset sequence."""
        # Trigger emergency stop
        safety_system.trigger_estop()
        assert safety_system.get_estop_status() == "triggered"

        # Attempt reset without releasing physical button
        try:
            safety_system.reset_estop()
            assert False, "Reset should fail with button pressed"
        except SafetyError:
            pass

        # Release physical button
        safety_system.release_estop_button()

        # Attempt reset
        safety_system.reset_estop()

        # System should enter "ready" state (not immediately enabled)
        assert safety_system.get_estop_status() == "reset_required"

        # Require manual enable command
        safety_system.enable_system()
        assert safety_system.get_estop_status() == "released"
```

## Integration Testing Scenarios

### Full System Integration Test

```python
# tests/integration/test_full_system.py
import pytest
from robot_hardware import HumanoidRobot
from test_fixtures import IntegrationTestHarness

class TestFullSystemIntegration:
    """End-to-end hardware integration tests."""

    @pytest.fixture
    def robot(self):
        """Initialize full robot system."""
        return HumanoidRobot(config_file="config/robot_config.yaml")

    def test_system_startup_sequence(self, robot):
        """Verify complete system startup."""
        # Power on sequence
        robot.power_on()

        # Check all subsystems initialize
        assert robot.check_power_system() == "ok"
        assert robot.check_communication_bus() == "ok"
        assert robot.check_all_sensors() == "ok"
        assert robot.check_all_actuators() == "ok"
        assert robot.check_safety_systems() == "ok"

        # Verify robot enters ready state
        assert robot.get_state() == "ready"

    def test_sensor_actuator_control_loop(self, robot):
        """Test closed-loop sensor-actuator integration."""
        # Command robot to move leg
        robot.command_joint("hip_pitch_left", position=0.5)

        # Wait for movement
        time.sleep(1)

        # Verify sensor feedback matches commanded position
        imu_data = robot.get_imu_data()
        encoder_pos = robot.get_joint_position("hip_pitch_left")

        # Position should match within tolerance
        assert abs(encoder_pos - 0.5) < 0.02

        # IMU should detect body tilt from leg movement
        assert abs(imu_data.pitch) > 0.01

    def test_multi_joint_coordination(self, robot):
        """Test coordinated motion across multiple joints."""
        # Command walking pattern
        trajectory = robot.generate_walking_trajectory()

        # Execute trajectory
        for waypoint in trajectory:
            robot.set_joint_positions(waypoint)
            time.sleep(0.01)

            # Verify all joints tracking
            for joint_name, target_pos in waypoint.items():
                actual_pos = robot.get_joint_position(joint_name)
                error = abs(actual_pos - target_pos)
                assert error < 0.05, f"{joint_name} tracking error: {error}"

    def test_system_under_load(self, robot):
        """Test system performance under load."""
        # Apply external force simulation
        robot.apply_external_force(force=[0, 0, -500])  # 50kg downward

        # Robot should maintain balance
        time.sleep(2)

        # Check stability
        imu = robot.get_imu_data()
        assert abs(imu.roll) < 0.1  # < 5.7 degrees
        assert abs(imu.pitch) < 0.1

        # Check no motor overload
        for motor in robot.get_all_motors():
            assert motor.get_torque() < motor.get_max_torque()
```

## Test Data Management

### Hardware Configuration File

```yaml
# tests/fixtures/hardware_config.yaml
robot:
  name: "Humanoid Test Platform"
  version: "1.0"

sensors:
  imu:
    - name: "body_imu"
      interface: "i2c"
      address: 0x68
      sample_rate: 100
      calibration_file: "calibration/imu_body.json"

  cameras:
    - name: "head_camera_left"
      interface: "usb"
      resolution: [1920, 1080]
      framerate: 30

    - name: "head_camera_right"
      interface: "usb"
      resolution: [1920, 1080]
      framerate: 30

  force_sensors:
    - name: "foot_left_heel"
      interface: "spi"
      max_force: 500  # N

    - name: "foot_left_toe"
      interface: "spi"
      max_force: 500

actuators:
  motors:
    - name: "hip_pitch_left"
      type: "brushless_dc"
      can_id: 0x10
      max_torque: 50
      max_velocity: 6.28
      gear_ratio: 100

    - name: "knee_pitch_left"
      type: "brushless_dc"
      can_id: 0x11
      max_torque: 80
      max_velocity: 6.28
      gear_ratio: 120

communication:
  can_bus:
    channel: "can0"
    bitrate: 1000000
    protocol: "CANopen"

  ethernet:
    interface: "eth0"
    ip_address: "192.168.1.100"

power:
  battery:
    type: "LiPo"
    cells: 6
    capacity: 10000  # mAh
    voltage_nominal: 22.2  # V

  safety_limits:
    max_current: 50  # A
    min_voltage: 19.8  # V (3.3V per cell)
    max_temperature: 45  # °C

safety:
  emergency_stop:
    inputs: ["physical_button", "software_trigger", "wireless_remote"]
    response_time_max: 0.05  # seconds

  watchdog:
    enabled: true
    timeout: 0.5  # seconds
```

## Best Practices

### Safety-First Testing
1. **Always** test emergency stop before any motion tests
2. **Always** have physical emergency stop accessible during tests
3. **Never** disable safety systems for convenience
4. **Always** test under controlled conditions with proper safety equipment
5. **Implement** redundant safety checks at hardware and software levels

### Incremental Integration
1. **Start** with individual component tests
2. **Progress** to subsystem integration
3. **Build** to full system integration
4. **Validate** each level before moving to next
5. **Document** test results at each stage

### Test Environment Control
1. **Control** ambient temperature (20-25°C)
2. **Control** humidity (30-60% RH)
3. **Use** stable power supply for consistency
4. **Minimize** electromagnetic interference
5. **Use** dedicated test fixtures and jigs

### Measurement and Calibration
1. **Calibrate** all sensors before testing
2. **Use** calibrated test equipment
3. **Record** environmental conditions
4. **Measure** repeatability with statistical methods
5. **Document** calibration procedures and dates

### Failure Analysis
1. **Log** all test failures with detailed context
2. **Capture** sensor data around failure points
3. **Analyze** failure modes systematically
4. **Update** test procedures based on findings
5. **Maintain** failure database for trend analysis

## Common Issues and Solutions

### Issue: Inconsistent Sensor Readings
**Solution**: Check for:
- Loose connections or damaged cables
- Electromagnetic interference from motors
- Insufficient power supply filtering
- Incorrect sensor calibration
- Software timing issues

### Issue: Motor Control Instability
**Solution**: Verify:
- PID controller gains properly tuned
- Encoder feedback clean and accurate
- Communication latency within bounds
- Power supply stable under load
- No mechanical binding or excessive friction

### Issue: CAN Bus Communication Errors
**Solution**: Check:
- Bus termination resistors (120Ω at each end)
- Cable length and quality
- Bitrate configuration on all nodes
- Ground connections
- Electrical noise from power systems

### Issue: Emergency Stop Not Responding
**Solution**: Inspect:
- Physical button connection and continuity
- Safety circuit wiring and relay operation
- Software watchdog configuration
- Power supply to safety systems
- Redundancy paths

## Testing Checklist

### Pre-Test Setup
- [ ] All connections secure and inspected
- [ ] Power systems checked and voltage verified
- [ ] Emergency stop tested and functional
- [ ] Test environment prepared and safe
- [ ] Data logging systems ready
- [ ] Safety equipment available (fire extinguisher, first aid)

### Component-Level Tests
- [ ] IMU calibration and validation
- [ ] Camera image quality and calibration
- [ ] Force sensor calibration
- [ ] Encoder accuracy verification
- [ ] Motor driver communication
- [ ] CAN bus functionality
- [ ] Power system voltage and current limits

### Integration Tests
- [ ] Sensor fusion validation
- [ ] Multi-joint coordination
- [ ] Closed-loop control performance
- [ ] System response time
- [ ] Load testing
- [ ] Thermal performance

### Safety Tests
- [ ] Emergency stop response time
- [ ] Limit switch detection
- [ ] Overcurrent protection
- [ ] Watchdog timer functionality
- [ ] Battery protection
- [ ] Thermal shutdown

### Documentation
- [ ] Test results recorded
- [ ] Failures documented with root cause
- [ ] Calibration data saved
- [ ] Configuration files backed up
- [ ] Test report generated

## References

- ROS2 Hardware Interface: http://wiki.ros.org/ros2_control
- Safety Standards: ISO 10218 (Robots and robotic devices)
- CAN Bus Protocol: ISO 11898
- IMU Calibration: "An Introduction to Inertial Navigation" by Oliver Woodman
- Motor Control: "Modern Robotics" by Kevin Lynch

## Changelog

- **2025-12-27**: Initial skill creation for Phase 1/2 humanoid robotics hardware testing

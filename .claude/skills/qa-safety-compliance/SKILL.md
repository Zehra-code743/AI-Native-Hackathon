# Skill: Safety and Compliance Testing for Humanoid Robotics

**Created**: 2025-12-27
**Context**: This skill provides comprehensive safety validation and regulatory compliance testing methodologies for physical humanoid robots, covering international safety standards (ISO 13482, ISO 10218), risk assessment, collision detection, emergency stop systems, workspace monitoring, and certification requirements for Phase 1 and Phase 2 deployments.

## Overview

Safety and compliance testing ensures humanoid robots operate safely around humans and meet regulatory requirements for deployment. This skill covers:
- ISO 13482 (Personal care robots) compliance validation
- ISO 10218 (Industrial robots) safety requirements
- Risk assessment and FMEA (Failure Mode Effects Analysis)
- Collision detection and reaction testing
- Emergency stop system validation
- Workspace and proximity monitoring
- Power and force limiting
- Functional safety (ISO 13849, IEC 61508)
- Certification and documentation requirements
- Human-robot interaction safety

## Architecture Pattern

### Safety Testing Hierarchy

1. **Component Safety Testing**
   - Emergency stop circuits
   - Protective devices (light curtains, safety scanners)
   - Safety-rated sensors
   - Power limiting circuits
   - Mechanical safety features

2. **System Safety Testing**
   - Collision detection and avoidance
   - Safe motion profiles
   - Workspace monitoring
   - Human detection and tracking
   - Safety function validation

3. **Compliance Testing**
   - ISO standard conformance
   - Risk assessment validation
   - Documentation review
   - Third-party certification
   - Field deployment validation

## Testing Framework Structure

```
tests/
├── safety/
│   ├── component/
│   │   ├── test_emergency_stop_circuit.py
│   │   ├── test_safety_sensors.py
│   │   ├── test_force_limiting.py
│   │   └── test_mechanical_safety.py
│   ├── system/
│   │   ├── test_collision_detection.py
│   │   ├── test_collision_reaction.py
│   │   ├── test_workspace_monitoring.py
│   │   ├── test_safe_motion.py
│   │   └── test_human_robot_interaction.py
│   ├── compliance/
│   │   ├── test_iso13482_compliance.py
│   │   ├── test_iso10218_compliance.py
│   │   ├── test_risk_assessment.py
│   │   └── test_functional_safety.py
│   ├── scenarios/
│   │   ├── test_fall_scenarios.py
│   │   ├── test_collision_scenarios.py
│   │   ├── test_failure_modes.py
│   │   └── test_edge_cases.py
│   └── fixtures/
│       ├── safety_test_rig.py
│       ├── collision_test_dummies.py
│       └── measurement_equipment.py
├── documentation/
│   ├── risk_assessment/
│   ├── safety_analysis/
│   ├── test_reports/
│   └── certification/
└── reports/
    └── safety_test_results/
```

## Core Testing Components

### 1. Emergency Stop System Testing

```python
# tests/safety/component/test_emergency_stop_circuit.py
import pytest
import time
from robot_safety import EmergencyStopSystem
from robot_control import RobotController
from test_fixtures import SafetyTestRig

class TestEmergencyStopCircuit:
    """Test emergency stop circuits according to ISO 13850."""

    @pytest.fixture
    def safety_system(self):
        """Initialize safety system with test instrumentation."""
        return EmergencyStopSystem(
            circuit_category="Category 0",  # Immediate power removal
            safety_integrity_level="SIL 3",
            response_time_max=50  # milliseconds
        )

    def test_estop_circuit_redundancy(self, safety_system):
        """Verify dual-channel emergency stop circuit (ISO 13849-1)."""
        # Check both channels are monitored
        assert safety_system.get_channel_count() == 2

        # Verify cross-monitoring (each channel monitors the other)
        assert safety_system.has_cross_monitoring()

        # Test Channel 1 failure detection
        safety_system.simulate_channel_failure(channel=1)
        assert safety_system.get_status() == "fault_detected"
        assert safety_system.is_estop_triggered()

        # Reset and test Channel 2 failure
        safety_system.reset()
        safety_system.simulate_channel_failure(channel=2)
        assert safety_system.get_status() == "fault_detected"
        assert safety_system.is_estop_triggered()

    def test_estop_response_time_category0(self, safety_system):
        """Verify Category 0 stop (immediate power removal) < 50ms."""
        robot = RobotController()
        test_rig = SafetyTestRig()

        # Start robot motion at maximum velocity
        robot.set_all_joints_velocity(3.14)  # rad/s
        time.sleep(0.5)  # Reach steady state

        # Trigger emergency stop and measure response time
        start_time = test_rig.get_high_precision_time()
        safety_system.trigger_estop()

        # Measure time until power is removed from all motors
        while not all(m.get_power_state() == "off" for m in robot.get_motors()):
            elapsed = test_rig.get_high_precision_time() - start_time
            assert elapsed < 0.1, "E-stop response timeout"

        response_time = test_rig.get_high_precision_time() - start_time

        # Must be < 50ms for Category 0
        assert response_time < 0.050, \
            f"E-stop response too slow: {response_time*1000:.2f}ms"

        # Record response time for documentation
        test_rig.record_measurement("estop_response_time_ms", response_time * 1000)

    def test_estop_button_mechanical_latching(self, safety_system):
        """Verify emergency stop button mechanically latches (ISO 13850)."""
        # Press emergency stop button
        safety_system.press_estop_button()
        assert safety_system.is_button_latched()

        # Attempt to reset without releasing button
        try:
            safety_system.reset_estop()
            pytest.fail("Should not allow reset with latched button")
        except SafetyError as e:
            assert "button latched" in str(e).lower()

        # Button must require deliberate action to release
        # (cannot reset accidentally)
        safety_system.attempt_accidental_reset()
        assert safety_system.is_button_latched()

        # Proper release procedure
        safety_system.twist_and_pull_button()
        assert not safety_system.is_button_latched()

    def test_estop_multiple_activation_points(self, safety_system):
        """Verify emergency stop accessible from multiple locations."""
        # ISO 13850 requires easily accessible e-stop from all operator positions
        activation_points = safety_system.get_estop_activation_points()

        # Humanoid robot should have e-stops on:
        # - Physical robot body
        # - Wireless pendant
        # - Fixed control station
        # - Software emergency stop
        assert len(activation_points) >= 4

        # Test each activation point
        for point in activation_points:
            safety_system.reset()
            safety_system.activate_estop(point)
            assert safety_system.is_estop_triggered(), \
                f"E-stop point '{point}' failed to trigger"

    def test_estop_circuit_self_check(self, safety_system):
        """Test automatic safety circuit monitoring and diagnostics."""
        # System should perform self-check on power-up
        safety_system.power_on()
        assert safety_system.self_check_passed()

        # Periodic self-check during operation
        initial_check_count = safety_system.get_self_check_count()
        time.sleep(5)  # Wait for periodic checks

        # Should have performed multiple checks
        assert safety_system.get_self_check_count() > initial_check_count

        # Simulate circuit fault
        safety_system.inject_circuit_fault("open_circuit")

        # Should detect fault within 1 second
        time.sleep(1)
        assert safety_system.get_status() == "fault_detected"
        assert safety_system.is_estop_triggered()

    def test_estop_reset_requires_deliberate_action(self, safety_system):
        """Verify reset requires deliberate action (ISO 13850 §5.3)."""
        # Trigger emergency stop
        safety_system.trigger_estop()

        # Release button
        safety_system.release_estop_button()

        # System should NOT automatically reset
        time.sleep(2)
        assert safety_system.get_status() == "estop_released_awaiting_reset"

        # Reset requires:
        # 1. Operator present at reset location
        # 2. Visual verification of safety
        # 3. Deliberate reset action
        # 4. Two-hand control or confirmation

        safety_system.operator_present()
        safety_system.verify_safe_conditions()
        safety_system.press_reset_button()

        # Should enter "ready" state, not immediate operation
        assert safety_system.get_status() == "ready"
        assert not safety_system.are_motors_enabled()

        # Require separate enable action
        safety_system.enable_operation()
        assert safety_system.get_status() == "operating"
```

### 2. Collision Detection Testing

```python
# tests/safety/system/test_collision_detection.py
import pytest
import numpy as np
from robot_safety import CollisionDetectionSystem
from robot_control import RobotController
from test_fixtures import CollisionTestDummy, ForceGauge

class TestCollisionDetection:
    """Test collision detection capabilities (ISO 13482 §5.8)."""

    @pytest.fixture
    def collision_system(self):
        """Initialize collision detection system."""
        return CollisionDetectionSystem(
            detection_method="torque_observer",  # Model-based
            sensitivity="high",
            reaction_time_max=0.1  # 100ms
        )

    def test_collision_detection_sensitivity(self, collision_system):
        """Verify collision detected at low force thresholds."""
        robot = RobotController()
        force_gauge = ForceGauge()

        # Move robot arm
        robot.move_joint("shoulder_pitch_left", target=1.0, velocity=0.5)

        # Apply gradually increasing force to moving arm
        for force in np.linspace(0, 50, 100):  # 0-50N
            force_gauge.apply_force_to_link("upper_arm_left", force)

            if collision_system.is_collision_detected():
                detected_force = force
                break

        # Should detect collision at < 20N (ISO 13482 recommendation)
        assert detected_force < 20.0, \
            f"Collision detection threshold too high: {detected_force}N"

        # Record detection threshold
        collision_system.record_test_result("detection_threshold_N", detected_force)

    def test_collision_detection_during_motion(self, collision_system):
        """Test collision detection while robot is moving at various speeds."""
        robot = RobotController()
        test_dummy = CollisionTestDummy()

        velocities = [0.1, 0.5, 1.0, 2.0]  # rad/s

        for velocity in velocities:
            # Move joint at test velocity
            robot.move_joint("elbow_pitch_left", target=1.57, velocity=velocity)

            # Position dummy in path
            test_dummy.position_in_path("elbow_pitch_left", time_to_contact=0.5)

            # Wait for collision
            collision_detected = False
            start_time = time.time()

            while time.time() - start_time < 2.0:
                if collision_system.is_collision_detected():
                    collision_detected = True
                    detection_time = collision_system.get_detection_time()
                    impact_force = test_dummy.get_measured_force()
                    break
                time.sleep(0.001)

            # Verify collision was detected
            assert collision_detected, \
                f"Collision not detected at velocity {velocity} rad/s"

            # Verify detection time < 100ms
            assert detection_time < 0.1, \
                f"Detection too slow at velocity {velocity}: {detection_time*1000}ms"

            # Verify impact force within safety limits
            assert impact_force < 150, \
                f"Impact force too high: {impact_force}N at {velocity} rad/s"

            # Reset for next test
            robot.stop_all_motion()
            collision_system.reset()
            time.sleep(1)

    def test_collision_detection_all_body_parts(self, collision_system):
        """Verify collision detection on all robot body segments."""
        robot = RobotController()
        test_dummy = CollisionTestDummy()

        # Test collision detection on each link
        body_parts = [
            "torso", "head",
            "upper_arm_left", "forearm_left", "hand_left",
            "upper_arm_right", "forearm_right", "hand_right",
            "thigh_left", "shin_left", "foot_left",
            "thigh_right", "shin_right", "foot_right"
        ]

        for part in body_parts:
            # Apply force to body part
            test_dummy.apply_force_to_link(part, force=15.0)

            # Should detect within 100ms
            detected = False
            start_time = time.time()

            while time.time() - start_time < 0.2:
                if collision_system.is_collision_detected():
                    detected = True
                    detected_link = collision_system.get_collision_link()
                    break
                time.sleep(0.001)

            assert detected, f"Collision not detected on {part}"
            assert detected_link == part, \
                f"Incorrect link identified: {detected_link} (expected {part})"

            # Reset
            test_dummy.remove_force()
            collision_system.reset()
            time.sleep(0.5)

    def test_false_positive_rate(self, collision_system):
        """Verify collision detection has low false positive rate."""
        robot = RobotController()

        false_positives = 0
        test_count = 1000

        # Run robot through normal motion sequence 1000 times
        for _ in range(test_count):
            # Execute normal walking motion
            robot.execute_walking_step()

            # Check for false collision detection
            if collision_system.is_collision_detected():
                # Verify it's actually a false positive (no contact)
                if not collision_system.verify_actual_contact():
                    false_positives += 1

                collision_system.reset()

        # False positive rate should be < 0.1%
        false_positive_rate = (false_positives / test_count) * 100
        assert false_positive_rate < 0.1, \
            f"False positive rate too high: {false_positive_rate}%"

    def test_collision_classification(self, collision_system):
        """Test ability to classify collision types (ISO/TS 15066)."""
        robot = RobotController()
        test_dummy = CollisionTestDummy()

        # Test transient contact (brief touch)
        test_dummy.apply_transient_contact("upper_arm_left", duration=0.05)
        time.sleep(0.1)
        assert collision_system.get_collision_type() == "transient"

        collision_system.reset()

        # Test quasi-static contact (sustained pressure)
        test_dummy.apply_sustained_contact("upper_arm_left", force=10.0, duration=1.0)
        time.sleep(0.5)
        assert collision_system.get_collision_type() == "quasi_static"

        collision_system.reset()

        # Test clamping (trapped between robot and fixed object)
        test_dummy.simulate_clamping("hand_left", "table")
        time.sleep(0.5)
        assert collision_system.get_collision_type() == "clamping"
```

### 3. Safe Motion Testing

```python
# tests/safety/system/test_safe_motion.py
import pytest
import numpy as np
from robot_safety import SafeMotionController
from robot_control import RobotController
from test_fixtures import MotionCapture, ForceGauge

class TestSafeMotion:
    """Test safe motion planning and execution (ISO 13482 §5.9)."""

    @pytest.fixture
    def safe_motion(self):
        """Initialize safe motion controller."""
        return SafeMotionController(
            velocity_limit_human_present=0.25,  # m/s (ISO/TS 15066)
            acceleration_limit=1.0,  # m/s²
            force_limit_transient=150,  # N
            force_limit_quasi_static=50  # N
        )

    def test_velocity_limiting_human_present(self, safe_motion):
        """Verify velocity reduced when human detected nearby."""
        robot = RobotController()
        human_detector = HumanDetectionSystem()

        # No human present - robot can move at normal speed
        human_detector.set_human_present(False)
        safe_motion.plan_trajectory(start=[0, 0, 0], goal=[1, 1, 1])

        max_velocity = safe_motion.get_max_trajectory_velocity()
        assert max_velocity >= 1.0, "Should allow normal velocity when no human present"

        # Human detected in workspace
        human_detector.set_human_present(True)
        human_detector.set_human_distance(0.5)  # 0.5m away

        safe_motion.plan_trajectory(start=[0, 0, 0], goal=[1, 1, 1])

        max_velocity = safe_motion.get_max_trajectory_velocity()

        # Should limit to 250 mm/s (ISO/TS 15066 recommendation)
        assert max_velocity <= 0.25, \
            f"Velocity not limited with human present: {max_velocity} m/s"

    def test_separation_distance_monitoring(self, safe_motion):
        """Test motion stops at safe separation distance."""
        robot = RobotController()
        human_detector = HumanDetectionSystem()

        # Set minimum separation distance (300mm per ISO/TS 15066)
        safe_motion.set_minimum_separation(0.3)

        # Command robot to move toward human
        human_detector.set_human_position([1.0, 0, 0])
        robot.move_end_effector_to([1.0, 0, 0])

        # Monitor end effector position during motion
        while robot.is_moving():
            ee_position = robot.get_end_effector_position()
            human_position = human_detector.get_human_position()

            distance = np.linalg.norm(ee_position - human_position)

            # Should never violate minimum separation
            assert distance >= 0.3, \
                f"Minimum separation violated: {distance}m"

            time.sleep(0.01)

        # Final position should be at minimum separation distance
        final_distance = np.linalg.norm(
            robot.get_end_effector_position() - human_detector.get_human_position()
        )

        assert abs(final_distance - 0.3) < 0.05, \
            f"Did not stop at minimum separation: {final_distance}m"

    def test_power_and_force_limiting(self, safe_motion):
        """Verify power and force limits per ISO/TS 15066."""
        robot = RobotController()
        force_gauge = ForceGauge()

        # ISO/TS 15066 Annex A specifies maximum permissible contact forces
        # for different body regions

        body_regions = {
            "skull": {"transient": 130, "quasi_static": 50},
            "forehead": {"transient": 130, "quasi_static": 50},
            "face": {"transient": 110, "quasi_static": 35},
            "neck": {"transient": 150, "quasi_static": 45},
            "torso": {"transient": 140, "quasi_static": 65},
            "abdomen": {"transient": 110, "quasi_static": 45},
            "pelvis": {"transient": 180, "quasi_static": 75},
            "upper_arm": {"transient": 150, "quasi_static": 60},
            "forearm": {"transient": 160, "quasi_static": 70},
            "hand": {"transient": 200, "quasi_static": 85},
        }

        # Test transient contact force limiting
        for region, limits in body_regions.items():
            # Configure robot to contact test region
            force_gauge.position_at_body_region(region)

            # Command motion that would cause contact
            robot.move_toward_force_gauge(velocity=0.5)

            # Measure maximum contact force during motion
            max_force = 0
            while robot.is_moving():
                current_force = force_gauge.get_force()
                max_force = max(max_force, current_force)
                time.sleep(0.001)

            # Verify force stayed below limit for this body region
            assert max_force <= limits["transient"], \
                f"Force exceeded limit for {region}: {max_force}N > {limits['transient']}N"

            robot.reset()
            time.sleep(1)

    def test_acceleration_limiting(self, safe_motion):
        """Verify acceleration limits to prevent sudden movements."""
        robot = RobotController()
        motion_capture = MotionCapture()

        # Command sudden motion change
        robot.set_target_position([0, 0, 0])
        time.sleep(1)

        # Sudden command to opposite direction
        robot.set_target_position([1, 1, 1])

        # Monitor acceleration during motion
        positions = []
        timestamps = []

        while robot.is_moving():
            positions.append(robot.get_end_effector_position())
            timestamps.append(time.time())
            time.sleep(0.001)

        # Calculate accelerations
        positions = np.array(positions)
        timestamps = np.array(timestamps)

        velocities = np.diff(positions, axis=0) / np.diff(timestamps)[:, None]
        accelerations = np.diff(velocities, axis=0) / np.diff(timestamps[:-1])[:, None]

        max_acceleration = np.max(np.linalg.norm(accelerations, axis=1))

        # Should not exceed 1.0 m/s² acceleration limit
        assert max_acceleration <= 1.0, \
            f"Acceleration limit exceeded: {max_acceleration} m/s²"

    def test_hand_guiding_mode(self, safe_motion):
        """Test hand-guiding mode for safe manual positioning."""
        robot = RobotController()
        force_sensor = ForceSensor()

        # Enable hand-guiding mode
        safe_motion.enable_hand_guiding()

        # Verify robot is compliant (low impedance)
        assert robot.get_impedance_mode() == "low"

        # Apply force to end effector (simulate human guiding)
        force_sensor.apply_force([10, 0, 0])  # 10N in X direction

        time.sleep(0.5)

        # Robot should move in direction of applied force
        displacement = robot.get_end_effector_displacement()
        assert displacement[0] > 0.01, "Robot not responding to guiding force"

        # Release force
        force_sensor.apply_force([0, 0, 0])
        time.sleep(0.1)

        # Robot should stop moving
        velocity = robot.get_end_effector_velocity()
        assert np.linalg.norm(velocity) < 0.01, "Robot not stopping when force released"

        # Apply excessive force (safety test)
        force_sensor.apply_force([100, 0, 0])  # 100N

        # Should trigger safety stop
        time.sleep(0.1)
        assert safe_motion.is_safety_stop_active(), \
            "Excessive force did not trigger safety stop"
```

### 4. Risk Assessment Validation

```python
# tests/safety/compliance/test_risk_assessment.py
import pytest
from robot_safety import RiskAssessment, HazardIdentification
from test_fixtures import RiskMatrix

class TestRiskAssessment:
    """Validate risk assessment per ISO 13482 and ISO 12100."""

    @pytest.fixture
    def risk_assessment(self):
        """Load risk assessment for humanoid robot."""
        return RiskAssessment.load_from_file("documentation/risk_assessment/humanoid_risk_assessment.yaml")

    def test_hazard_identification_completeness(self, risk_assessment):
        """Verify all potential hazards have been identified."""
        # ISO 12100 requires systematic hazard identification
        required_hazard_categories = [
            "mechanical_hazards",
            "electrical_hazards",
            "thermal_hazards",
            "noise_hazards",
            "vibration_hazards",
            "radiation_hazards",
            "material_substance_hazards",
            "ergonomic_hazards",
            "hazards_from_failure"
        ]

        identified_categories = risk_assessment.get_hazard_categories()

        for category in required_hazard_categories:
            assert category in identified_categories, \
                f"Missing hazard category: {category}"

    def test_mechanical_hazards_documented(self, risk_assessment):
        """Verify mechanical hazards are identified and assessed."""
        mechanical_hazards = risk_assessment.get_hazards_by_category("mechanical_hazards")

        # Should include common humanoid robot mechanical hazards
        expected_hazards = [
            "crushing_between_robot_parts",
            "crushing_between_robot_and_environment",
            "impact_from_moving_parts",
            "shearing_at_joints",
            "entanglement_with_cables",
            "stabbing_from_sharp_edges",
            "falling_robot_parts",
            "robot_tip_over",
        ]

        identified_hazards = [h.name for h in mechanical_hazards]

        for hazard in expected_hazards:
            assert hazard in identified_hazards, \
                f"Mechanical hazard not identified: {hazard}"

    def test_risk_estimation_methodology(self, risk_assessment):
        """Validate risk estimation follows ISO 12100 methodology."""
        for hazard in risk_assessment.get_all_hazards():
            # Each hazard should have severity and probability assessed
            assert hazard.has_severity_rating()
            assert hazard.has_probability_rating()

            # Risk should be calculated from severity × probability
            calculated_risk = hazard.severity * hazard.probability
            assert hazard.risk_level == calculated_risk

            # Risk should be classified (negligible, low, medium, high, unacceptable)
            assert hazard.risk_classification in [
                "negligible", "low", "medium", "high", "unacceptable"
            ]

    def test_risk_reduction_measures(self, risk_assessment):
        """Verify risk reduction measures applied per ISO 12100 hierarchy."""
        # ISO 12100 three-step method:
        # 1. Inherently safe design
        # 2. Safeguarding and complementary protective measures
        # 3. Information for use

        for hazard in risk_assessment.get_high_risk_hazards():
            # High risk hazards must have mitigation measures
            assert len(hazard.mitigation_measures) > 0

            # Verify mitigation follows three-step method
            for measure in hazard.mitigation_measures:
                assert measure.step in [
                    "inherently_safe_design",
                    "safeguarding",
                    "information_for_use"
                ]

            # Check if residual risk is acceptable after mitigation
            residual_risk = hazard.calculate_residual_risk()
            assert residual_risk.classification in ["negligible", "low", "medium"], \
                f"Residual risk too high for {hazard.name}: {residual_risk.classification}"

    def test_fmea_completeness(self, risk_assessment):
        """Validate Failure Mode and Effects Analysis (FMEA) is complete."""
        fmea = risk_assessment.get_fmea()

        # Critical systems should have FMEA
        critical_systems = [
            "emergency_stop",
            "collision_detection",
            "power_system",
            "communication",
            "motion_control",
            "balance_control"
        ]

        for system in critical_systems:
            assert fmea.has_analysis_for_system(system), \
                f"FMEA missing for critical system: {system}"

            # Each system should have identified failure modes
            failure_modes = fmea.get_failure_modes(system)
            assert len(failure_modes) > 0, \
                f"No failure modes identified for {system}"

            # Each failure mode should have RPN (Risk Priority Number)
            for mode in failure_modes:
                assert mode.has_severity_rating()
                assert mode.has_occurrence_rating()
                assert mode.has_detection_rating()

                rpn = mode.severity * mode.occurrence * mode.detection
                assert mode.rpn == rpn

    def test_safety_integrity_level(self, risk_assessment):
        """Verify Safety Integrity Level (SIL) per IEC 61508."""
        safety_functions = risk_assessment.get_safety_functions()

        # Emergency stop should be SIL 3
        estop = safety_functions.get("emergency_stop")
        assert estop.sil_level == 3

        # Collision detection should be at least SIL 2
        collision_detection = safety_functions.get("collision_detection")
        assert collision_detection.sil_level >= 2

        # Safe motion monitoring should be at least SIL 2
        safe_motion = safety_functions.get("safe_motion_monitoring")
        assert safe_motion.sil_level >= 2
```

### 5. ISO 13482 Compliance Testing

```python
# tests/safety/compliance/test_iso13482_compliance.py
import pytest
from robot_safety import ISO13482Validator
from test_fixtures import ComplianceTestSuite

class TestISO13482Compliance:
    """Test compliance with ISO 13482 (Personal care robots)."""

    @pytest.fixture
    def validator(self):
        """Initialize ISO 13482 compliance validator."""
        return ISO13482Validator(
            robot_type="mobile_servant_robot",  # Humanoid classification
            intended_use="assistance_and_service"
        )

    def test_section_5_2_safety_requirements(self, validator):
        """Verify general safety requirements (ISO 13482 §5.2)."""
        # §5.2.2 - Emergency stop
        assert validator.check_emergency_stop_compliant()

        # §5.2.3 - Power systems
        assert validator.check_power_system_compliant()

        # §5.2.4 - Protective stop
        assert validator.check_protective_stop_compliant()

        # §5.2.5 - Speed and separation monitoring
        assert validator.check_speed_separation_monitoring_compliant()

        # §5.2.6 - Hand guiding
        assert validator.check_hand_guiding_compliant()

        # §5.2.7 - Power and force limiting
        assert validator.check_power_force_limiting_compliant()

    def test_section_5_8_contact_safety(self, validator):
        """Test contact safety requirements (ISO 13482 §5.8)."""
        test_suite = ComplianceTestSuite()

        # §5.8.2 - Contact during normal operation
        result = test_suite.test_normal_operation_contact()
        assert result.compliant
        assert result.max_force_transient < 150  # N
        assert result.max_force_quasi_static < 50  # N

        # §5.8.3 - Contact from protective stop
        result = test_suite.test_protective_stop_contact()
        assert result.compliant
        assert result.stopping_time < 0.5  # seconds

        # §5.8.4 - Contact in hand-guiding mode
        result = test_suite.test_hand_guiding_contact()
        assert result.compliant

    def test_section_5_9_motion_safety(self, validator):
        """Test motion safety requirements (ISO 13482 §5.9)."""
        test_suite = ComplianceTestSuite()

        # §5.9.2 - Velocity limits
        result = test_suite.test_velocity_limits()
        assert result.compliant
        assert result.max_velocity_human_present <= 0.25  # m/s

        # §5.9.3 - Acceleration limits
        result = test_suite.test_acceleration_limits()
        assert result.compliant
        assert result.max_acceleration <= 1.0  # m/s²

        # §5.9.4 - Momentum limits
        result = test_suite.test_momentum_limits()
        assert result.compliant

    def test_section_5_10_stability(self, validator):
        """Test stability requirements (ISO 13482 §5.10)."""
        test_suite = ComplianceTestSuite()

        # §5.10.2 - Static stability
        result = test_suite.test_static_stability()
        assert result.compliant
        assert result.tip_angle > 15  # degrees

        # §5.10.3 - Dynamic stability
        result = test_suite.test_dynamic_stability()
        assert result.compliant

        # §5.10.4 - Stability on slopes
        result = test_suite.test_slope_stability()
        assert result.compliant
        assert result.max_stable_slope >= 5  # degrees

    def test_section_6_3_verification(self, validator):
        """Verify all safety measures have been validated (ISO 13482 §6.3)."""
        # All safety functions must be verified
        safety_functions = validator.get_safety_functions()

        for function in safety_functions:
            assert function.has_verification_test()
            assert function.verification_passed()
            assert function.has_documentation()

    def test_section_7_documentation(self, validator):
        """Verify required documentation exists (ISO 13482 §7)."""
        # §7.2 - Information for use
        assert validator.check_user_manual_exists()
        assert validator.check_user_manual_complete()

        # §7.3 - Marking and labeling
        assert validator.check_safety_markings_present()
        assert validator.check_warning_labels_present()

        # §7.4 - Technical documentation
        assert validator.check_risk_assessment_documented()
        assert validator.check_safety_analysis_documented()
        assert validator.check_test_results_documented()
```

## Documentation Requirements

### Safety Test Report Template

```markdown
# Safety Test Report: Humanoid Robot XYZ

**Report Date**: 2025-12-27
**Test Engineer**: [Name]
**Robot Serial Number**: HR-001
**Firmware Version**: 2.1.0

## 1. Executive Summary
- Overall safety compliance status
- Critical findings
- Recommendations

## 2. Emergency Stop System Tests
### 2.1 Circuit Redundancy Test
- **Result**: PASS/FAIL
- **Response Time**: X.XX ms (Requirement: < 50ms)
- **Evidence**: Test log reference

### 2.2 Multiple Activation Points
- **Result**: PASS/FAIL
- **Tested Points**: Physical, Wireless, Software, Fixed Station
- **Evidence**: Video recording references

## 3. Collision Detection Tests
### 3.1 Detection Sensitivity
- **Threshold**: X.X N (Requirement: < 20N)
- **Result**: PASS/FAIL

### 3.2 Detection Coverage
- **Body Parts Tested**: [List]
- **Result**: PASS/FAIL

## 4. Power and Force Limiting Tests
### 4.1 Transient Contact Forces
- **Maximum Measured**: X N
- **Body Region**: [Region]
- **Limit**: Y N (ISO/TS 15066 Annex A)
- **Result**: PASS/FAIL

## 5. ISO 13482 Compliance
### 5.1 Checklist
- [ ] Emergency stop (§5.2.2): PASS/FAIL
- [ ] Contact safety (§5.8): PASS/FAIL
- [ ] Motion safety (§5.9): PASS/FAIL
- [ ] Stability (§5.10): PASS/FAIL

## 6. Risk Assessment Summary
- **Identified Hazards**: X
- **High Risk**: X (all mitigated)
- **Residual Risk**: Acceptable/Unacceptable

## 7. Failures and Non-Conformities
- [List any failures]
- [Corrective actions taken]

## 8. Test Evidence
- Video recordings: [Links]
- Data logs: [File paths]
- Force measurements: [Data files]

## 9. Conclusion
[Summary of safety validation status]

## 10. Approvals
- Test Engineer: __________________ Date: _______
- Safety Manager: _________________ Date: _______
- Quality Assurance: ______________ Date: _______
```

## Best Practices

### Safety Testing Mindset
1. **Assume** nothing is safe until proven through testing
2. **Test** for both expected and unexpected scenarios
3. **Document** every test with evidence (video, data logs)
4. **Verify** safety measures work under worst-case conditions
5. **Maintain** safety even when systems fail

### Test Environment
1. **Use** physical barriers and safety equipment during tests
2. **Have** trained safety personnel present
3. **Use** anthropomorphic test dummies for contact testing
4. **Calibrate** measurement equipment regularly
5. **Control** environmental conditions

### Regulatory Compliance
1. **Engage** with certification bodies early in development
2. **Maintain** detailed documentation throughout
3. **Perform** internal audits before official certification
4. **Stay** updated on standard revisions
5. **Plan** for periodic recertification

## Common Issues and Solutions

### Issue: Emergency stop response time too slow
**Solution**: Review circuit design, check for relay delays, optimize firmware interrupt handling

### Issue: Collision detection false positives
**Solution**: Improve sensor fusion, filter high-frequency noise, tune detection thresholds

### Issue: Forces exceed ISO/TS 15066 limits
**Solution**: Reduce velocity, increase compliance, add padding to contact surfaces

## References

- ISO 13482:2014 - Robots and robotic devices - Safety requirements for personal care robots
- ISO 10218-1:2011 - Robots and robotic devices - Safety requirements for industrial robots
- ISO/TS 15066:2016 - Robots and robotic devices - Collaborative robots
- ISO 13849-1:2015 - Safety of machinery - Safety-related parts of control systems
- ISO 12100:2010 - Safety of machinery - General principles for design - Risk assessment
- IEC 61508 - Functional safety of electrical/electronic/programmable electronic safety-related systems

## Changelog

- **2025-12-27**: Initial skill creation for Phase 1/2 humanoid robotics safety testing

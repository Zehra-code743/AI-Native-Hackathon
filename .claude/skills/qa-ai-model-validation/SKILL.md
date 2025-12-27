# Skill: AI Model Testing and Validation for Robotic Systems

**Created**: 2025-12-27
**Context**: This skill provides comprehensive testing and validation methodologies for AI/ML models deployed in humanoid robotics systems, covering vision models, motion planning networks, reinforcement learning policies, sensor fusion models, and edge AI deployment for Phase 1 and Phase 2 development.

## Overview

AI model testing ensures that machine learning components perform reliably, safely, and accurately in real-world robotic applications. This skill covers:
- Computer vision model validation (object detection, pose estimation, semantic segmentation)
- Motion planning neural network testing
- Reinforcement learning policy evaluation
- Sensor fusion model validation
- Model robustness testing (adversarial, edge cases)
- Performance benchmarking (latency, throughput, accuracy)
- Model deployment validation (quantization, optimization)
- Continuous learning and adaptation testing
- Safety-critical AI validation
- Explainability and interpretability testing

## Architecture Pattern

### AI Testing Hierarchy

1. **Model-Level Testing**
   - Accuracy metrics (precision, recall, F1, mAP)
   - Robustness to noise and perturbations
   - Inference latency and throughput
   - Memory footprint
   - Edge case handling

2. **Integration Testing**
   - Model pipeline validation
   - Sensor-to-model data flow
   - Model-to-control interface
   - Multi-model coordination
   - Real-time constraint validation

3. **System-Level Testing**
   - End-to-end task performance
   - Safety validation in physical system
   - Failure mode analysis
   - Long-term reliability
   - Adaptation and learning verification

## Testing Framework Structure

```
tests/
├── ai_models/
│   ├── vision/
│   │   ├── test_object_detection.py
│   │   ├── test_pose_estimation.py
│   │   ├── test_semantic_segmentation.py
│   │   ├── test_depth_estimation.py
│   │   └── test_hand_tracking.py
│   ├── planning/
│   │   ├── test_trajectory_networks.py
│   │   ├── test_motion_primitives.py
│   │   └── test_grasping_networks.py
│   ├── control/
│   │   ├── test_balance_controller.py
│   │   ├── test_walking_policy.py
│   │   └── test_manipulation_policy.py
│   ├── sensor_fusion/
│   │   ├── test_multimodal_fusion.py
│   │   ├── test_state_estimation.py
│   │   └── test_localization.py
│   ├── robustness/
│   │   ├── test_adversarial_robustness.py
│   │   ├── test_distribution_shift.py
│   │   ├── test_edge_cases.py
│   │   └── test_failure_modes.py
│   ├── performance/
│   │   ├── test_inference_latency.py
│   │   ├── test_throughput.py
│   │   ├── test_memory_usage.py
│   │   └── test_quantization.py
│   └── safety/
│       ├── test_safety_constraints.py
│       ├── test_uncertainty_estimation.py
│       └── test_safe_fallback.py
├── datasets/
│   ├── test_data/
│   ├── validation_data/
│   └── edge_cases/
├── benchmarks/
│   ├── vision_benchmarks.yaml
│   ├── planning_benchmarks.yaml
│   └── control_benchmarks.yaml
└── reports/
    └── ai_test_results/
```

## Core Testing Components

### 1. Computer Vision Model Testing

```python
# tests/ai_models/vision/test_object_detection.py
import pytest
import torch
import numpy as np
from PIL import Image
import torchvision
from torchmetrics.detection import MeanAveragePrecision

from robot_vision import ObjectDetector
from test_fixtures import VisionTestDataset, ImageAugmentation

class TestObjectDetection:
    """Test object detection models for robotic perception."""

    @pytest.fixture
    def detector(self):
        """Initialize object detection model."""
        return ObjectDetector(
            model_name="yolov8n",
            confidence_threshold=0.5,
            iou_threshold=0.45,
            device="cuda" if torch.cuda.is_available() else "cpu"
        )

    @pytest.fixture
    def test_dataset(self):
        """Load test dataset with ground truth annotations."""
        return VisionTestDataset(
            dataset_path="datasets/test_data/object_detection/",
            annotation_format="coco",
            num_samples=1000
        )

    def test_model_accuracy_on_test_set(self, detector, test_dataset):
        """Validate model accuracy on held-out test set."""
        predictions = []
        ground_truths = []

        for image, target in test_dataset:
            # Run inference
            pred = detector.detect(image)
            predictions.append(pred)
            ground_truths.append(target)

        # Calculate mAP (mean Average Precision)
        metric = MeanAveragePrecision()
        metric.update(predictions, ground_truths)
        results = metric.compute()

        # Model should achieve minimum performance thresholds
        assert results['map'] >= 0.50, f"mAP too low: {results['map']:.3f}"
        assert results['map_50'] >= 0.70, f"mAP@0.5 too low: {results['map_50']:.3f}"
        assert results['map_75'] >= 0.55, f"mAP@0.75 too low: {results['map_75']:.3f}"

        print(f"✓ Object Detection Accuracy - mAP: {results['map']:.3f}")

    def test_per_class_accuracy(self, detector, test_dataset):
        """Verify accuracy for each object class separately."""
        # Classes critical for humanoid robotics
        critical_classes = [
            "person", "chair", "table", "door", "cup",
            "bottle", "book", "laptop", "keyboard", "mouse"
        ]

        class_metrics = {}

        for class_name in critical_classes:
            # Filter dataset for this class
            class_dataset = test_dataset.filter_by_class(class_name)

            # Calculate per-class metrics
            tp = 0  # True positives
            fp = 0  # False positives
            fn = 0  # False negatives

            for image, target in class_dataset:
                pred = detector.detect(image)

                # Count detections
                tp += count_true_positives(pred, target, iou_threshold=0.5)
                fp += count_false_positives(pred, target, iou_threshold=0.5)
                fn += count_false_negatives(pred, target, iou_threshold=0.5)

            # Calculate metrics
            precision = tp / (tp + fp) if (tp + fp) > 0 else 0
            recall = tp / (tp + fn) if (tp + fn) > 0 else 0
            f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0

            class_metrics[class_name] = {
                "precision": precision,
                "recall": recall,
                "f1": f1
            }

            # Critical classes should meet minimum thresholds
            assert f1 >= 0.60, \
                f"F1 score too low for '{class_name}': {f1:.3f}"

        print("✓ Per-class accuracy validated")

    def test_inference_latency(self, detector):
        """Verify inference meets real-time requirements."""
        # Generate test images
        test_images = [
            torch.randn(3, 640, 480) for _ in range(100)
        ]

        # Warm-up
        for _ in range(10):
            detector.detect(test_images[0])

        # Measure latency
        latencies = []

        for image in test_images:
            start_time = time.perf_counter()
            detector.detect(image)
            latency = time.perf_counter() - start_time
            latencies.append(latency)

        # Calculate statistics
        mean_latency = np.mean(latencies)
        p95_latency = np.percentile(latencies, 95)
        p99_latency = np.percentile(latencies, 99)

        # Real-time requirement: < 33ms for 30 FPS
        assert mean_latency < 0.033, \
            f"Mean latency too high: {mean_latency*1000:.1f}ms"
        assert p95_latency < 0.050, \
            f"P95 latency too high: {p95_latency*1000:.1f}ms"

        print(f"✓ Inference Latency - Mean: {mean_latency*1000:.1f}ms, P95: {p95_latency*1000:.1f}ms")

    def test_robustness_to_lighting_conditions(self, detector, test_dataset):
        """Test model performance under various lighting conditions."""
        augmentor = ImageAugmentation()

        lighting_conditions = [
            ("normal", lambda x: x),
            ("dark", lambda x: augmentor.adjust_brightness(x, factor=0.3)),
            ("bright", lambda x: augmentor.adjust_brightness(x, factor=1.5)),
            ("high_contrast", lambda x: augmentor.adjust_contrast(x, factor=2.0)),
            ("low_contrast", lambda x: augmentor.adjust_contrast(x, factor=0.5)),
        ]

        results = {}

        for condition_name, transform in lighting_conditions:
            predictions = []
            ground_truths = []

            for image, target in test_dataset.sample(100):
                # Apply lighting transformation
                transformed_image = transform(image)

                # Run inference
                pred = detector.detect(transformed_image)
                predictions.append(pred)
                ground_truths.append(target)

            # Calculate mAP for this condition
            metric = MeanAveragePrecision()
            metric.update(predictions, ground_truths)
            map_score = metric.compute()['map']

            results[condition_name] = map_score

            # Should maintain reasonable performance
            # (allow some degradation but not catastrophic failure)
            assert map_score >= 0.35, \
                f"Performance too low in {condition_name} lighting: {map_score:.3f}"

        print(f"✓ Lighting robustness validated: {results}")

    def test_robustness_to_occlusion(self, detector, test_dataset):
        """Test detection with partially occluded objects."""
        augmentor = ImageAugmentation()

        occlusion_levels = [0.2, 0.4, 0.6]  # 20%, 40%, 60% occlusion

        for occlusion_ratio in occlusion_levels:
            correct_detections = 0
            total_objects = 0

            for image, target in test_dataset.sample(100):
                # Add random occlusions
                occluded_image = augmentor.add_random_occlusion(
                    image,
                    occlusion_ratio=occlusion_ratio
                )

                # Run inference
                pred = detector.detect(occluded_image)

                # Count correct detections (IoU > 0.5)
                tp = count_true_positives(pred, target, iou_threshold=0.5)
                total_objects += len(target['boxes'])
                correct_detections += tp

            # Calculate detection rate
            detection_rate = correct_detections / total_objects if total_objects > 0 else 0

            # Minimum acceptable detection rates
            min_rates = {0.2: 0.70, 0.4: 0.50, 0.6: 0.30}

            assert detection_rate >= min_rates[occlusion_ratio], \
                f"Detection rate too low with {occlusion_ratio*100}% occlusion: {detection_rate:.3f}"

        print("✓ Occlusion robustness validated")

    def test_false_positive_rate(self, detector):
        """Verify false positive rate on images without target objects."""
        # Load images with no relevant objects
        empty_scenes = VisionTestDataset(
            dataset_path="datasets/test_data/empty_scenes/",
            num_samples=200
        )

        false_positives = 0
        total_images = 0

        for image, _ in empty_scenes:
            pred = detector.detect(image)

            # Count detections above confidence threshold
            if len(pred['boxes']) > 0:
                false_positives += len(pred['boxes'])

            total_images += 1

        # False positive rate per image
        fp_rate = false_positives / total_images

        # Should have low false positive rate (< 0.5 per image)
        assert fp_rate < 0.5, f"False positive rate too high: {fp_rate:.3f}"

        print(f"✓ False positive rate: {fp_rate:.3f} per image")

    def test_edge_cases(self, detector):
        """Test model on challenging edge cases."""
        edge_cases = VisionTestDataset(
            dataset_path="datasets/test_data/edge_cases/",
            cases=[
                "extreme_angles",
                "extreme_distances",
                "unusual_object_poses",
                "cluttered_scenes",
                "motion_blur",
                "reflections",
                "shadows"
            ]
        )

        for case_name, case_data in edge_cases.iter_by_case():
            success_count = 0

            for image, target in case_data:
                pred = detector.detect(image)

                # Check if at least one ground truth object was detected
                if count_true_positives(pred, target, iou_threshold=0.3) > 0:
                    success_count += 1

            success_rate = success_count / len(case_data)

            # Should handle edge cases reasonably (> 40% success)
            assert success_rate >= 0.40, \
                f"Edge case '{case_name}' success rate too low: {success_rate:.3f}"

        print("✓ Edge case handling validated")
```

### 2. Motion Planning Network Testing

```python
# tests/ai_models/planning/test_trajectory_networks.py
import pytest
import torch
import numpy as np
from robot_planning import TrajectoryNet
from robot_control import RobotKinematics
from test_fixtures import TrajectoryDataset, CollisionChecker

class TestTrajectoryNetworks:
    """Test neural network-based trajectory planning."""

    @pytest.fixture
    def trajectory_net(self):
        """Initialize trajectory planning network."""
        return TrajectoryNet(
            input_dim=12,  # Current state (6 DOF) + goal (6 DOF)
            hidden_dim=256,
            output_dim=100,  # 100 waypoints
            device="cuda" if torch.cuda.is_available() else "cpu"
        )

    def test_trajectory_feasibility(self, trajectory_net):
        """Verify generated trajectories are kinematically feasible."""
        kinematics = RobotKinematics()

        test_cases = 1000

        for _ in range(test_cases):
            # Generate random start and goal
            start_state = torch.rand(6) * 2 - 1  # [-1, 1] range
            goal_state = torch.rand(6) * 2 - 1

            # Generate trajectory
            trajectory = trajectory_net.plan(start_state, goal_state)

            # Check kinematic feasibility
            for i in range(len(trajectory) - 1):
                current = trajectory[i]
                next_pos = trajectory[i + 1]

                # Check joint limits
                assert kinematics.check_joint_limits(current), \
                    f"Trajectory violates joint limits at waypoint {i}"

                # Check velocity limits
                velocity = (next_pos - current) / 0.01  # Assuming 100 Hz
                assert kinematics.check_velocity_limits(velocity), \
                    f"Trajectory violates velocity limits between waypoints {i} and {i+1}"

                # Check acceleration limits
                if i > 0:
                    prev = trajectory[i - 1]
                    acceleration = ((next_pos - current) - (current - prev)) / (0.01 ** 2)
                    assert kinematics.check_acceleration_limits(acceleration), \
                        f"Trajectory violates acceleration limits at waypoint {i}"

        print("✓ Trajectory feasibility validated")

    def test_collision_avoidance(self, trajectory_net):
        """Verify trajectories avoid obstacles."""
        collision_checker = CollisionChecker()

        # Load test scenarios with obstacles
        test_scenarios = TrajectoryDataset(
            dataset_path="datasets/planning/collision_scenarios/",
            num_samples=500
        )

        collision_count = 0

        for start, goal, obstacles in test_scenarios:
            # Set up obstacle environment
            collision_checker.set_obstacles(obstacles)

            # Generate trajectory
            trajectory = trajectory_net.plan(start, goal)

            # Check each waypoint for collisions
            has_collision = False
            for waypoint in trajectory:
                if collision_checker.check_collision(waypoint):
                    has_collision = True
                    break

            if has_collision:
                collision_count += 1

        # Collision rate should be very low (< 1%)
        collision_rate = collision_count / len(test_scenarios)
        assert collision_rate < 0.01, \
            f"Collision rate too high: {collision_rate*100:.1f}%"

        print(f"✓ Collision avoidance - Collision rate: {collision_rate*100:.2f}%")

    def test_goal_reaching_accuracy(self, trajectory_net):
        """Verify trajectories reach the specified goal."""
        test_cases = 1000
        goal_errors = []

        for _ in range(test_cases):
            start_state = torch.rand(6) * 2 - 1
            goal_state = torch.rand(6) * 2 - 1

            # Generate trajectory
            trajectory = trajectory_net.plan(start_state, goal_state)

            # Check final position
            final_position = trajectory[-1]
            goal_error = torch.norm(final_position - goal_state).item()
            goal_errors.append(goal_error)

        # Statistics
        mean_error = np.mean(goal_errors)
        max_error = np.max(goal_errors)
        p95_error = np.percentile(goal_errors, 95)

        # Should reach goal within tolerance
        assert mean_error < 0.05, f"Mean goal error too high: {mean_error:.4f}"
        assert p95_error < 0.10, f"P95 goal error too high: {p95_error:.4f}"

        print(f"✓ Goal reaching - Mean error: {mean_error:.4f}, P95: {p95_error:.4f}")

    def test_inference_speed(self, trajectory_net):
        """Verify planning is fast enough for real-time control."""
        # Real-time planning should complete in < 100ms
        test_cases = 100
        planning_times = []

        for _ in range(test_cases):
            start_state = torch.rand(6) * 2 - 1
            goal_state = torch.rand(6) * 2 - 1

            # Measure planning time
            start_time = time.perf_counter()
            trajectory = trajectory_net.plan(start_state, goal_state)
            planning_time = time.perf_counter() - start_time

            planning_times.append(planning_time)

        mean_time = np.mean(planning_times)
        p95_time = np.percentile(planning_times, 95)

        # Real-time requirement: < 100ms
        assert mean_time < 0.1, f"Mean planning time too high: {mean_time*1000:.1f}ms"
        assert p95_time < 0.15, f"P95 planning time too high: {p95_time*1000:.1f}ms"

        print(f"✓ Planning speed - Mean: {mean_time*1000:.1f}ms, P95: {p95_time*1000:.1f}ms")

    def test_smoothness(self, trajectory_net):
        """Verify generated trajectories are smooth."""
        test_cases = 100

        for _ in range(test_cases):
            start_state = torch.rand(6) * 2 - 1
            goal_state = torch.rand(6) * 2 - 1

            trajectory = trajectory_net.plan(start_state, goal_state)

            # Calculate jerk (rate of change of acceleration)
            positions = trajectory.cpu().numpy()
            velocities = np.diff(positions, axis=0)
            accelerations = np.diff(velocities, axis=0)
            jerks = np.diff(accelerations, axis=0)

            # Maximum jerk should be bounded
            max_jerk = np.max(np.abs(jerks))
            assert max_jerk < 10.0, f"Trajectory jerk too high: {max_jerk:.2f}"

        print("✓ Trajectory smoothness validated")
```

### 3. Reinforcement Learning Policy Testing

```python
# tests/ai_models/control/test_walking_policy.py
import pytest
import torch
import numpy as np
from robot_control import WalkingPolicy
from simulation import HumanoidSimulator
from test_fixtures import TerrainGenerator

class TestWalkingPolicy:
    """Test reinforcement learning-based walking controller."""

    @pytest.fixture
    def policy(self):
        """Load trained walking policy."""
        return WalkingPolicy.load_from_checkpoint(
            "models/walking_policy_v2.pth"
        )

    @pytest.fixture
    def simulator(self):
        """Initialize physics simulator."""
        return HumanoidSimulator(
            physics_engine="mujoco",
            timestep=0.001,
            render=False
        )

    def test_policy_stability(self, policy, simulator):
        """Verify robot can walk stably without falling."""
        num_trials = 100
        success_count = 0

        for trial in range(num_trials):
            # Reset simulator
            obs = simulator.reset()

            # Run episode (10 seconds)
            episode_length = 10000  # 10 sec at 1ms timestep
            fallen = False

            for step in range(episode_length):
                # Get action from policy
                action = policy.predict(obs)

                # Step simulation
                obs, reward, done, info = simulator.step(action)

                # Check if robot fell
                if info['fallen']:
                    fallen = True
                    break

            if not fallen:
                success_count += 1

        # Success rate should be high (> 95%)
        success_rate = success_count / num_trials
        assert success_rate >= 0.95, \
            f"Walking stability too low: {success_rate*100:.1f}%"

        print(f"✓ Walking stability - Success rate: {success_rate*100:.1f}%")

    def test_forward_velocity_tracking(self, policy, simulator):
        """Test ability to track commanded forward velocity."""
        target_velocities = [0.2, 0.5, 1.0, 1.5]  # m/s

        for target_vel in target_velocities:
            obs = simulator.reset()

            # Set velocity command
            policy.set_velocity_command(target_vel, 0.0, 0.0)  # (vx, vy, omega)

            # Allow time to reach steady state
            for _ in range(2000):  # 2 seconds
                action = policy.predict(obs)
                obs, _, _, _ = simulator.step(action)

            # Measure actual velocity over 3 seconds
            velocities = []
            for _ in range(3000):
                action = policy.predict(obs)
                obs, _, _, info = simulator.step(action)
                velocities.append(info['base_velocity'][0])  # forward velocity

            # Calculate mean velocity
            mean_velocity = np.mean(velocities)
            velocity_error = abs(mean_velocity - target_vel)

            # Should track within 10% error
            assert velocity_error < 0.1 * target_vel, \
                f"Velocity tracking error too high: {velocity_error:.3f} m/s (target: {target_vel})"

        print("✓ Velocity tracking validated")

    def test_terrain_robustness(self, policy, simulator):
        """Test walking on various terrain types."""
        terrain_generator = TerrainGenerator()

        terrains = [
            "flat",
            "rough",
            "stairs_up",
            "stairs_down",
            "ramp_up",
            "ramp_down",
            "gaps",
            "obstacles"
        ]

        results = {}

        for terrain_type in terrains:
            # Generate terrain
            terrain = terrain_generator.generate(terrain_type)
            simulator.set_terrain(terrain)

            # Test walking
            success_count = 0
            num_trials = 20

            for trial in range(num_trials):
                obs = simulator.reset()
                policy.set_velocity_command(0.5, 0.0, 0.0)  # Walk forward

                fallen = False
                for step in range(5000):  # 5 seconds
                    action = policy.predict(obs)
                    obs, _, _, info = simulator.step(action)

                    if info['fallen']:
                        fallen = True
                        break

                if not fallen:
                    success_count += 1

            success_rate = success_count / num_trials
            results[terrain_type] = success_rate

            # Minimum success rates for different terrains
            min_rates = {
                "flat": 0.95,
                "rough": 0.70,
                "stairs_up": 0.60,
                "stairs_down": 0.60,
                "ramp_up": 0.80,
                "ramp_down": 0.80,
                "gaps": 0.50,
                "obstacles": 0.50
            }

            assert success_rate >= min_rates[terrain_type], \
                f"Success rate on {terrain_type} terrain too low: {success_rate*100:.1f}%"

        print(f"✓ Terrain robustness: {results}")

    def test_external_disturbance_rejection(self, policy, simulator):
        """Test recovery from external pushes."""
        disturbance_magnitudes = [50, 100, 150, 200]  # Newtons

        for magnitude in disturbance_magnitudes:
            success_count = 0
            num_trials = 50

            for trial in range(num_trials):
                obs = simulator.reset()
                policy.set_velocity_command(0.5, 0.0, 0.0)

                # Let robot reach steady walking
                for _ in range(2000):
                    action = policy.predict(obs)
                    obs, _, _, _ = simulator.step(action)

                # Apply random push
                direction = np.random.uniform(-np.pi, np.pi)
                force = magnitude * np.array([np.cos(direction), np.sin(direction), 0])
                simulator.apply_external_force(force, duration=0.1)

                # Check recovery over 3 seconds
                recovered = True
                for step in range(3000):
                    action = policy.predict(obs)
                    obs, _, _, info = simulator.step(action)

                    if info['fallen']:
                        recovered = False
                        break

                if recovered:
                    success_count += 1

            recovery_rate = success_count / num_trials

            # Recovery rate thresholds
            min_rates = {50: 0.95, 100: 0.85, 150: 0.70, 200: 0.50}

            assert recovery_rate >= min_rates[magnitude], \
                f"Recovery rate from {magnitude}N push too low: {recovery_rate*100:.1f}%"

        print("✓ Disturbance rejection validated")

    def test_energy_efficiency(self, policy, simulator):
        """Measure energy consumption during walking."""
        obs = simulator.reset()
        policy.set_velocity_command(1.0, 0.0, 0.0)  # 1 m/s forward

        # Walk for 10 seconds and measure energy
        total_energy = 0.0
        distance_traveled = 0.0

        for step in range(10000):
            action = policy.predict(obs)
            obs, _, _, info = simulator.step(action)

            # Calculate power = sum(torque * velocity)
            power = np.sum(np.abs(info['joint_torques'] * info['joint_velocities']))
            total_energy += power * 0.001  # Integrate over timestep

            distance_traveled = info['distance_traveled']

        # Cost of transport (dimensionless efficiency metric)
        robot_mass = simulator.get_robot_mass()
        gravity = 9.81
        cost_of_transport = total_energy / (robot_mass * gravity * distance_traveled)

        # Biological CoT for human walking is ~0.2
        # Robot should achieve CoT < 1.0 (5x worse than human is acceptable)
        assert cost_of_transport < 1.0, \
            f"Cost of transport too high: {cost_of_transport:.3f}"

        print(f"✓ Energy efficiency - CoT: {cost_of_transport:.3f}")
```

### 4. Model Robustness Testing

```python
# tests/ai_models/robustness/test_adversarial_robustness.py
import pytest
import torch
import numpy as np
from robot_vision import ObjectDetector
from adversarial import FGSMAttack, PGDAttack, PatchAttack
from test_fixtures import VisionTestDataset

class TestAdversarialRobustness:
    """Test model robustness against adversarial perturbations."""

    @pytest.fixture
    def detector(self):
        """Initialize detection model."""
        return ObjectDetector(model_name="yolov8n")

    def test_fgsm_robustness(self, detector):
        """Test robustness to Fast Gradient Sign Method attacks."""
        test_dataset = VisionTestDataset(num_samples=100)
        attacker = FGSMAttack(epsilon=0.03)  # Small perturbation

        robust_count = 0

        for image, target in test_dataset:
            # Generate adversarial example
            adv_image = attacker.attack(detector.model, image, target)

            # Run detection on adversarial image
            pred = detector.detect(adv_image)

            # Check if detection is still correct
            if count_true_positives(pred, target, iou_threshold=0.5) >= len(target['boxes']) * 0.8:
                robust_count += 1

        # Should maintain reasonable accuracy under attack
        robustness_rate = robust_count / len(test_dataset)
        assert robustness_rate >= 0.70, \
            f"FGSM robustness too low: {robustness_rate*100:.1f}%"

        print(f"✓ FGSM robustness: {robustness_rate*100:.1f}%")

    def test_physical_patch_attack(self, detector):
        """Test robustness to physical adversarial patches."""
        test_dataset = VisionTestDataset(num_samples=100)
        patch_attacker = PatchAttack(patch_size=(50, 50))

        detection_failures = 0

        for image, target in test_dataset:
            # Add adversarial patch to image
            patched_image = patch_attacker.add_patch(image, location="random")

            # Run detection
            pred = detector.detect(patched_image)

            # Check if important objects are still detected
            tp = count_true_positives(pred, target, iou_threshold=0.5)

            if tp < len(target['boxes']) * 0.5:  # Missed > 50% of objects
                detection_failures += 1

        # Failure rate should be low
        failure_rate = detection_failures / len(test_dataset)
        assert failure_rate < 0.10, \
            f"Physical patch attack failure rate too high: {failure_rate*100:.1f}%"

        print(f"✓ Physical patch robustness - Failure rate: {failure_rate*100:.1f}%")

    def test_distribution_shift_robustness(self, detector):
        """Test performance under dataset distribution shift."""
        # Train distribution
        train_dataset = VisionTestDataset(dataset="train")

        # Shifted distributions
        shifted_datasets = {
            "different_camera": VisionTestDataset(dataset="test_different_camera"),
            "different_lighting": VisionTestDataset(dataset="test_different_lighting"),
            "different_environment": VisionTestDataset(dataset="test_different_env")
        }

        # Baseline performance on train distribution
        baseline_map = calculate_map(detector, train_dataset)

        for shift_name, shifted_data in shifted_datasets.items():
            shifted_map = calculate_map(detector, shifted_data)

            # Performance should not degrade catastrophically (> 20% drop)
            performance_drop = (baseline_map - shifted_map) / baseline_map

            assert performance_drop < 0.20, \
                f"Performance dropped too much on {shift_name}: {performance_drop*100:.1f}%"

        print("✓ Distribution shift robustness validated")
```

### 5. Model Deployment Testing

```python
# tests/ai_models/performance/test_quantization.py
import pytest
import torch
from robot_vision import ObjectDetector
from optimization import ModelQuantizer
from test_fixtures import VisionTestDataset

class TestModelQuantization:
    """Test quantized model performance."""

    def test_int8_quantization_accuracy(self):
        """Verify INT8 quantization maintains accuracy."""
        # Load full precision model
        fp32_model = ObjectDetector(model_name="yolov8n", precision="fp32")

        # Quantize to INT8
        quantizer = ModelQuantizer()
        int8_model = quantizer.quantize_to_int8(fp32_model)

        # Test both models
        test_dataset = VisionTestDataset(num_samples=500)

        fp32_map = calculate_map(fp32_model, test_dataset)
        int8_map = calculate_map(int8_model, test_dataset)

        # Accuracy drop should be minimal (< 3%)
        accuracy_drop = (fp32_map - int8_map) / fp32_map
        assert accuracy_drop < 0.03, \
            f"Quantization accuracy drop too high: {accuracy_drop*100:.1f}%"

        print(f"✓ INT8 Quantization - FP32 mAP: {fp32_map:.3f}, INT8 mAP: {int8_map:.3f}")

    def test_quantized_inference_speed(self):
        """Verify quantization improves inference speed."""
        fp32_model = ObjectDetector(precision="fp32")
        int8_model = ObjectDetector(precision="int8")

        test_image = torch.randn(3, 640, 480)

        # Measure FP32 latency
        fp32_times = []
        for _ in range(100):
            start = time.perf_counter()
            fp32_model.detect(test_image)
            fp32_times.append(time.perf_counter() - start)

        # Measure INT8 latency
        int8_times = []
        for _ in range(100):
            start = time.perf_counter()
            int8_model.detect(test_image)
            int8_times.append(time.perf_counter() - start)

        fp32_mean = np.mean(fp32_times)
        int8_mean = np.mean(int8_times)

        speedup = fp32_mean / int8_mean

        # Should achieve at least 1.5x speedup
        assert speedup >= 1.5, f"Quantization speedup insufficient: {speedup:.2f}x"

        print(f"✓ Quantization speedup: {speedup:.2f}x")

    def test_model_size_reduction(self):
        """Verify quantization reduces model size."""
        fp32_model = ObjectDetector(precision="fp32")
        int8_model = ObjectDetector(precision="int8")

        fp32_size = fp32_model.get_model_size_mb()
        int8_size = int8_model.get_model_size_mb()

        size_reduction = (fp32_size - int8_size) / fp32_size

        # Should achieve ~75% size reduction (32-bit to 8-bit)
        assert size_reduction >= 0.70, \
            f"Model size reduction insufficient: {size_reduction*100:.1f}%"

        print(f"✓ Model size reduction: {size_reduction*100:.1f}%")
```

## Best Practices

### Model Versioning and Tracking
1. **Use** MLflow or Weights & Biases for experiment tracking
2. **Version** all models with semantic versioning
3. **Track** model performance metrics over time
4. **Document** training hyperparameters and datasets
5. **Maintain** model registry with deployment status

### Test Data Management
1. **Separate** train, validation, and test sets strictly
2. **Collect** diverse, representative test data
3. **Include** edge cases and failure modes
4. **Update** test sets as new scenarios are discovered
5. **Version** datasets with checksums

### Safety-Critical AI
1. **Validate** uncertainty estimates are calibrated
2. **Test** safe fallback behaviors
3. **Monitor** model predictions in production
4. **Implement** anomaly detection
5. **Have** human oversight for critical decisions

## Common Issues and Solutions

### Issue: Model performs well in simulation but fails on real robot
**Solution**: Sim-to-real transfer - use domain randomization, collect real-world data, fine-tune on robot

### Issue: Model latency too high for real-time control
**Solution**: Model optimization - quantization, pruning, architecture search, edge deployment

### Issue: Model fails on edge cases not in training data
**Solution**: Active learning - identify failure modes, collect targeted data, retrain

## References

- MLPerf Inference Benchmark: https://mlcommons.org/en/inference-edge/
- Adversarial Robustness Toolbox: https://github.com/Trusted-AI/adversarial-robustness-toolbox
- TensorRT Model Optimization: https://developer.nvidia.com/tensorrt
- ONNX Runtime: https://onnxruntime.ai/

## Changelog

- **2025-12-27**: Initial skill creation for Phase 1/2 humanoid robotics AI model testing

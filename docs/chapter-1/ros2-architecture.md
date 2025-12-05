---
title: ROS 2 Architecture & Communication Model
sidebar_position: 2
description: How ROS 2 uses DDS to connect nodes, topics, services, actions, and parameters for modular robotics.
---

ROS 2 is built on a distributed, graph-based design powered by DDS. Nodes publish and subscribe to topics, expose services for synchronous work, provide actions for long-running tasks, and share parameters for runtime tuning. This decoupled model scales from single robots to fleets while keeping components reusable.

### What this covers

- The ROS 2 graph (nodes, topics, services, actions, parameters) and how DDS transports data.
- Reliability and durability options that shape how messages survive network volatility.
- Package layout and launch patterns that keep complex systems modular.

### Key takeaways from the research corpus

- DDS-backed transport is central to ROS 2 performance and interoperability, enabling deterministic pub/sub needed by real-time robots (Sources 1, 4, 7).
- Formal architectural clarity—separating interfaces from implementations—reduces integration risk when adding AI or simulation tooling (Sources 1, 3).

### Implementation checklist

- Model your system as nodes with clear message contracts; document message schemas alongside topics.
- Choose QoS early: reliability (`reliable` vs `best effort`), durability (`transient local` for latched data), and history (`keep last` vs `keep all`) per topic.
- Use namespaces and remapping to compose subsystems (e.g., `/perception/camera` vs `/navigation/odometry`).
- Keep launch files declarative: pass parameters via YAML, set remappings, and define lifecycles for components that need managed startup/shutdown.
- Add interface tests (msg/service/action) before integrating new compute nodes to catch schema drift.


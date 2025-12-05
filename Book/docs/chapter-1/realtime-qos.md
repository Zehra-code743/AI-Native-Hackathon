---
title: Real-Time QoS, Executors, and Task Regulation
sidebar_position: 3
description: Configure QoS, executors, and scheduling to keep ROS 2 robots predictable under load.
---

Robots need predictable timing to stay safe. Research on adaptive task execution (e.g., ATER) and ROS 2 QoS shows that most latency spikes come from misaligned executor settings, unbounded histories, or contention on shared resources.

### Core practices

- **Pick QoS per data type:** Use `reliable` + `transient local` for low-rate state (maps, calibration) and `best effort` + small history for high-rate sensors where freshness matters more than completeness (Sources 4, 6).
- **Match publishers/subscribers:** QoS profiles must be compatible; a strict subscriber will drop data from a lax publisher.
- **Use multi-threaded executors judiciously:** Separate high-rate sensing from planning/execution so long callbacks do not block control loops.
- **Regulate task rates:** Apply adaptive rate control for nodes that degrade under load; ATER-style regulation keeps deadlines while avoiding CPU thrash (Source 6).
- **Pin critical threads:** On real-time OSes, pin control nodes and set RT priorities to protect them from background tasks.

### Observability

- Enable tracing (`ros2_tracing`, LTTng) around executors to spot callback jitter.
- Monitor dropped messages and queue depths; rising depths often precede missed deadlines.
- Record baseline latency over wired and wireless links to catch regressions after QoS changes.


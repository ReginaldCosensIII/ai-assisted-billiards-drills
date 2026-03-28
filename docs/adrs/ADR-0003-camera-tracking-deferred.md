# ADR-0003: Camera and Sensor Tracking Deferred from Version 1

**Date:** 2026-03-27
**Status:** Accepted

## Context

Automatic real-world tracking of billiards ball positions and shot outcomes via computer vision or physical sensors (cameras, LiDAR, accelerometers) would significantly expand the technical surface area of Version 1 and introduce hardware dependencies that increase setup friction for most users.

The Version 1 coaching loop is designed to operate from user-reported outcomes rather than machine-observed results. This model is still commercially credible and provides substantially more value than unassisted practice, while avoiding the engineering cost and hardware risk of an automated vision system.

## Decision

All camera-based shot tracking, computer vision, automatic ball motion detection, and sensor-assisted table tracking are explicitly deferred out of Version 1. The coaching loop will rely entirely on the drill definition and user-reported outcomes.

## Consequences

- **Positive**: Eliminates the most complex and high-risk technical dependency from Version 1. Allows the architecture to be built cleanly without coupling it to a vision layer that does not yet exist.
- **Negative**: The system cannot automatically detect shot outcomes. Users must self-report results, which relies on honesty and reasonable self-assessment.
- **Neutral**: The data model and AI coaching context should be designed with a future automated result intake in mind, so that when computer vision is introduced in a later phase it can plug in without rewriting the core architecture.

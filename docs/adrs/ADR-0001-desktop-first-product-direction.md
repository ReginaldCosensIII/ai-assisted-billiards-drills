# ADR-0001: Desktop-First Product Direction

**Date:** 2026-03-27
**Status:** Accepted

## Context

The platform must output projection-grade visuals to a secondary display (projector or second monitor) while maintaining a primary control interface for the user. This dual-display model requires a runtime environment that has stable, direct control over native window management and multi-screen rendering. Achieving this reliably is significantly more complex in a browser-only or mobile-first architecture.

Additionally, the target user — a dedicated home player or in-person instructor — is operating at a fixed table setup with power and desktop or laptop access, not on a handheld device at the table.

## Decision

Version 1 will be built as a desktop-first application. The primary control interface and the projection output surface will both be managed from the user's desktop or laptop machine. Mobile and tablet support is fully out of scope for Version 1.

## Consequences

- **Positive**: Stable multi-window and multi-display management available natively. Reduced complexity for projection calibration and local state management. Enables offline-capable core drill workflows.
- **Negative**: Mobile users cannot access the platform without a desktop device. A mobile companion experience (e.g., for voice input or status display) is possible in a future phase but adds architectural surface area.
- **Neutral**: The desktop-first constraint aligns directly with the hardware-first projection workflow and the target user profile.

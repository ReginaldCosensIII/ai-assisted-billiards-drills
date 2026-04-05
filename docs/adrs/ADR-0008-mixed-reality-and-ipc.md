# ADR-0008: Mixed Reality Projection & IPC Architecture

**Date:** 2026-04-05
**Status:** Accepted

## Context

The transition from a standard 2D UI to an AI-assisted projection system requires a "Mixed Reality" harness. This involves two distinct display contexts:
1.  **Control UI**: The primary operator interface (laptop/tablet).
2.  **Projector UI**: The overlay projected onto the billiards table.

To maintain performance and simplify state management, we explored the trade-offs between two separate React applications versus a single application with contextual routing.

## Decision

We will use a **Single React Bundle** with **URL-based Routing** and an **IPC Context Bridge** for inter-window communication.

### 1. Single Bundle Routing
The application determines its role (Control vs. Projector) based on the URL query parameter `?mode=projector`.
- **Default**: Renders the standard sidebar, drill selection, and session controls.
- **mode=projector**: Renders a full-screen, black-background overlay optimized for projection.

### 2. IPC Context Bridge
Inter-window communication is handled via the Electron Main process relay:
- **`CalibrationCorners`**: Sent from the Projector window (ui-state) to the Control UI for persisted storage.
- **`DrillLayout`**: Sent from the Control UI to the Projector window for rendering.
- **`UI Commands`**: Toggle visibility and fullscreen status.

### 3. Coordinate Math & Keystone Correction
To correct for projector tilt and lens distortion, we use **8x8 Matrix Math** for CSS `matrix3d` transforms.
- **Aspect Ratio**: The system enforces a strict **2:1 aspect ratio** (Billiards standard) for all internal coordinate calculations.
- **Mapping**: Dynamic mapping of normalized `(0,0)` to `(1,1)` coordinates into screen-space pixel coordinates based on the keystone corrected projection surface.

## Consequences

- **Positive**: Single codebase reduces deployment complexity and ensures type safety across both views.
- **Positive**: IPC relay allows for a decoupled "Remote Control" feel for the table overlay.
- **Positive**: CSS `matrix3d` provides hardware-accelerated keystone correction without complex GLSL shaders.
- **Negative**: Increased complexity in `App.tsx` logic to manage two distinct rendering paths.
- **Negative**: High dependency on Electron's IPC performance for real-time calibration updates.

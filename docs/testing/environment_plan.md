# Development and Testing Environment Plan

## Introduction
This document defines the progressive development and testing ladder for the `ai-assisted-billiards-drills` project. It establishes how features progress from software-only logic up through real-world physical projection validation, reducing risk and accelerating the iteration cycle.

> **Note on Testing Frameworks**: Exact tool and framework selections are intentionally deferred to the architecture phase via Architecture Decision Records (ADRs). This document refers only to testing categories (e.g., logic and unit testing, component testing, visual regression testing, end-to-end workflow testing, physical environment validation).

## Environment Layers

### 1. Software-Only Workstation Environment
- **Purpose**: A local development setup running solely on a developer's primary machine, verifying core data models, UI components, and integrations in a standard desktop window.
- **Validates**: Core application logic, layout responsiveness, application state management, basic drill configurations, and unit tests.
- **Does Not Validate**: Real-world visual scale, projection optical distortion, physical hardware integration, or camera-based AI tracking nuances.
- **Exit Criteria**: All unit, component, and standard layout logic tests pass. Core flows function without errors in a single desktop window.
- **Testing Types**: Logic and unit testing, component testing, visual regression testing.
- **Risks and Limitations**: UI elements may look balanced on a backlit 27-inch monitor at normal viewing distances but scale poorly when projected over a 9-foot dark green table.

### 2. Virtual Projection Environment
- **Purpose**: Simulating output targeting by using a secondary monitor assigned as the "projection" display, while the primary monitor acts as the user control interface.
- **Validates**: Multi-window management, full-screen vs windowed behaviors, rough visual contrast, aspect ratio scaling, and cross-window coordination.
- **Does Not Validate**: Surface color distortion (pool cloth), ambient lighting conditions in a billiards room, projection throw distances, and physical keystone correction quirks.
- **Exit Criteria**: Multi-display UI flows seamlessly; no aspect ratio clipping on the secondary monitor; end-to-end software simulation pathways are stable.
- **Testing Types**: End-to-end workflow testing, visual regression testing.
- **Risks and Limitations**: Lacks the physical constraints of an actual projector setup.

### 3. Cheap Physical Projection Environment
- **Purpose**: A low-cost or used mini-projector shining down onto a scaled mock table surface (e.g., kitchen table, floor layout, board, taped rectangle, or green felt on a desk). This environment is intentionally an intermediate proxy, not production hardware.
- **Validates**: Projection workflow, geometry, scaling, throw-distance issues, keystone correction logic, basic projector calibration flows, and basic visibility/contrast checks against dark/green felt.
- **Does Not Validate**: Final production brightness, final image quality under real billiards lighting, final mounting design, or final full-table physical realism.
- **Exit Criteria**: Setup can successfully calibrate over a mock shape; UI is legible on a scaled surface; keystone logic works at various generic angles.
- **Testing Types**: Physical environment validation (proxy), visual regression testing.
- **Risks and Limitations**: This environment is intentionally lower quality than production. Resolution and brightness caps on cheap hardware may hide optical flaws or introduce artifacts that don't exist in high-end final hardware.

### 4. Real Pool Table Environment
- **Purpose**: The final production-equivalent setup mapping the platform directly to a standard billiards table in a real room environment.
- **Validates**: End-to-end system viability, real user ergonomics, true visual scaling, exact physical rendering, and eventual computer vision/AI accuracy on raw table data.
- **Does Not Validate**: Initial developmental layout bugs, logical edge cases, or simple test regressions (these MUST be fully caught in earlier progression layers before wasting physical table time).
- **Exit Criteria**: The application feels intuitive continuously over a real session; visual projections correctly map to physical cushions and pockets; beta testers successfully run real drills.
- **Testing Types**: Physical environment validation (final), end-to-end workflow testing.
- **Risks and Limitations**: High barrier to entry, very slow feedback loop if relied upon for daily primary development, and hardware downtime completely blocks iteration.

## Recommended Progression Order
Development should strictly follow the ladder to ensure a stable, fast iteration loop:
1. **Develop** in the Software-Only Workstation.
2. **Verify Layout** in the Virtual Projection Environment (Second Monitor).
3. **Calibrate and Contrast Check** in the Cheap Physical Projection array.
4. **Final Field Validation** on the Real Pool Table.

## Workflow Integration

### Simulator-First Development Workflow
By standardizing these distinct layers, developers and AI agents can work hyper-efficiently without requiring immediate access to physical pool tables. This isolates hardware bottlenecks and allows the bulk of application logic, UI components, and state architecture to mature purely in software before handling the complexities of physics and optics.

### Cost Reduction and Iteration Speed
Pushing the feedback loop leftward means 80-90% of bugs are caught and fixed in seconds (via hot-reloading in the software-only environment) rather than requiring a human to walk over to a physical table, reset the projection array, and test manually. It protects the physical hardware setup time for strictly physical validation.

### Agent-Assisted Development
Agentic workflows thrive when they can verify code autonomously. A software-first and virtual-projection simulator model allows AI agents to write and execute tests that run headlessly or in virtual browsers, giving them robust validation signals without physical hardware intervention. Agents can confidently build UI or logic, knowing human review can handle the physical optical edge cases later.

## Hardware Milestones (Optional vs Required)
- **Early Stage**: Standard workstation (Required), secondary monitor (Recommended/Required). Projector is *Optional*.
- **Mid Stage**: Low-cost projector and mock surface (Required for calibration logic development). Full 9-foot table setup is *Optional*.
- **Late Stage**: Real Pool Table and production projection array (Required for alpha/beta validation and tracking logic refinement).

## Immediate Practical Setup Plan
For the near-term execution of this project, the immediate setup path is:
1. **Local Workstation Development**: Continue building the foundation and core architecture fully in software, isolating components that don't require external screens.
2. **Second-Monitor Projection Simulation**: Once the baseline UI application is scaffolded, establish the multi-window/view logic spanning a control UI and a computationally mocked secondary target.
3. **Cheap Projector Testing on a Mock Surface**: Introduce a cheap/used projector casting onto a floor layout or kitchen table to validate throw-distance, keystone math, and rough geometry without needing physical billiards space.
4. **Later Real-Table Testing**: Deferred entirely until the UI, calibration pipelines, and backend hooks are incredibly robust on the mock surface.

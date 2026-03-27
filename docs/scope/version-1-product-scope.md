# Version 1 Product Scope

## 1. Document Purpose
This document formally defines the functional boundaries, success criteria, and explicit omissions for Version 1 (V1) of the `ai-assisted-billiards-drills` platform. It serves as the primary source of truth for all subsequent architecture, design, and implementation decisions.

## 2. Product Summary
Version 1 is a desktop-first billiards training application designed to project interactive drills directly onto a pool table or simulated surface. It pairs these projected layouts with a drill-aware AI coaching chatbot that relies on drill context and user-reported outcomes to provide instructional feedback.

## 3. Primary Product Goal
Deliver a stable, end-to-end interactive projection experience where users can load, view, and manually interact with structured billiards drills, augmented by conversational AI coaching based on those drills.

## 4. Secondary Goals
- Establish a robust developer workflow enabling rapid iteration via software simulation.
- Build a generic underlying data and content foundation that structurally supports future automation capabilities in post-V1 phases, rather than locking the architecture into V1-only manual processes.

## 5. Target Users for Version 1
- **Primary**: Dedicated amateur billiards players seeking structured, solo practice sessions with intelligent feedback. Version 1 is strictly consumer-first in its product focus and go-to-market strategy.
- **Secondary**: Billiards instructors looking to project standardized drills during in-person lessons, provided they operate within the consumer-first workflow constraints.

## 6. Product Positioning for Version 1
An accessible training multiplier that bridges the gap between static paper diagrams and highly expensive, sensor-heavy bespoke hardware setups. It leverages the user's existing desktop/laptop paired with an affordable consumer projector to deliver a robust interactive experience.

## 7. Core User Journey
1. User launches the desktop application and connects a secondary projector display.
2. User calibrates the projection to the table surface (or a mock simulator surface).
3. User browses the drill library and selects a drill.
4. Application projects the drill diagram (cue ball starting position, target balls, target zones) onto the table.
5. User reads the instructions, attempts the drill, and manually inputs the outcome (pass/fail/score).
6. User converses with the drill-aware AI coach via text or voice for adjustments and tips.
7. Next drill state is loaded based on the outcome or user command.

## 8. Version 1 Structure
Version 1 is segmented into two sequential delivery layers: Core Prototype and Launch-Ready V1.

### Core Prototype Scope
- Desktop-first application shell.
- Drill library with basic browsing and loading functionality.
- Virtual table renderer for simulator-first development.
- Projector-style secondary display mode.
- Basic calibration mode or calibration harness.
- Drill detail view with instructions and objectives.
- Support for demo media (images/videos of the drill).
- Manual outcome input system (user manually records their success/failure).
- Drill-aware AI chatbot featuring text input and text output.
- A small, high-quality, hand-curated seed drill set for testing and validation.

### Launch-Ready Version 1 Scope
*Everything in the Core Prototype, plus:*
- Automatic text-to-speech (TTS) read-aloud of AI responses.
- Speech-to-text (STT) input for user prompts.
- Voice-friendly drill interaction and session management.
- Drill loading by name or numeric ID via text and voice commands.
- A polished conversational coaching loop capturing before/after attempt dynamics.
- Improved content quality and a larger, fully validated drill set.
- A usable, stable projector calibration workflow for home users.
- A stable simulated testing mode for demonstrations and internal validation.

## 9. In Scope for Version 1
- **Core Desktop Application**: Delivery of a stable, dual-window local application capable of housing user controls on the primary screen and rendering drill layouts to a secondary projection screen.
- **Manual Input & Tracking**: UI mechanisms allowing players to manually report their success, failure, or scores for individual attempts, mapped to relational database records.
- **Conversational AI Integrations**: A text and voice-enabled chatbot system aware of the loaded drill, providing coaching logic based on the manual outcome reports.
- **Simple Voice Interactions**: A reliable, push-to-talk or tap-to-talk voice model where users issue requests and wait for the AI to finish speaking before responding.
- **Simulation Environment**: A fully functional virtual table renderer serving as both an end-user headless preview and a developer testing simulator.

## 10. Out of Scope for Version 1
- Camera-based shot tracking or computer vision.
- Automatic ball motion detection.
- Machine-vision results interpretation.
- Sensor-assisted table tracking (laser, LiDAR, accelerometer).
- All-in-one custom hardware packaging (turnkey hardware product).
- Advanced coach marketplace workflows or monetization ledgers.
- Full remote real-time lesson platform features (video streaming).
- Automated content creation without human review.
- Deep performance optimization for large-scale enterprise deployment.
- Highly advanced real-time duplex voice interruption handling (perfect mid-sentence AI cutoffs). Basic stop/cancel playback controls are permissible but not explicitly mandated for V1.
- Complex multi-user live session features.

## 11. Version 1 Success Criteria
- The application can project a drill accurately scaled onto a table (or mock proxy surface).
- A user *has the capability* to interact with the coaching loop via basic voice commands, though falling back to physical clicks/taps for navigation remains a valid, acceptable workflow in V1.
- The AI context successfully isolates its advice to the specific drill currently active on the table.
- A developer can run the entire core application loop purely in a software simulation.

## 12. Content Scope for Version 1
- A structured relational drill format (title, layout coordinates, success criteria, metadata).
- Initial seed content must be human-reviewed.
- The content ecosystem should explicitly be designed to support future automation pipelines, even though V1 content will be hand-validated.

## 13. AI Scope for Version 1
- Large Language Model (LLM) integration acting as a conversational coach.
- Strict system-prompting to maintain awareness of the current loaded drill format, physical physics limits, and the user's latest manual outcome.
- AI must not hallucinate ball positions—it relies purely on the defined drill boundaries and user feedback.

## 14. Voice Scope for Version 1
Voice interaction is required for Launch-Ready V1 but is implemented in progressive stages:
1. Base text chat.
2. Auto read-aloud for assistant output (TTS).
3. Speech-to-text input (STT).
4. Smoother conversational drill instructor session mode (connecting TTS and STT seamlessly).

## 15. Platform Scope for Version 1
- **Primary Form Factor**: Desktop-first application.
- **Display Topology**: Dual-screen architecture (Primary Control UI + Secondary Projection UI).
- **Mobile/Tablet**: Fully deferred. Mobile support is out of scope for V1.

## 16. Data and Infrastructure Scope for Version 1
- Traditional structured relational database model logically backing the core entities.
- A standardized API abstraction bridging the desktop client to the backend datastore and third-party LLM gateways. The exact API style (e.g., REST vs. RPC vs. GraphQL) is left open for resolution in the architecture phase.

## 17. Key Product Principles
- **Documentation First**: Features aren't built until they are designed.
- **Simulator First**: Software validation must predate physical hardware validation.
- **Human-in-the-Loop Content**: AI can augment coaching, but foundational V1 drills must be accurate and human-validated.
- **Progressive Enhancement**: Start with text, elevate to voice; start with manual tracking, leave architecture open for future vision tracking.

## 18. Major Risks Within Version 1
- **Calibration Friction**: Users may find manually aligning a projector to a table frustrating if the UI is not perfectly intuitive.
- **Voice Latency**: The round-trip time between STT, LLM inference, and TTS generation may break the illusion of real-time coaching.
- **Optical Limitations**: Standard consumer projectors may struggle with brightness against dark green felt in well-lit rooms.

## 19. Dependencies for Version 1
- A managed third-party LLM API provider for conversational intelligence.
- Managed third-party speech-to-text (STT) and text-to-speech (TTS) services.
- A stable desktop framework ecosystem capable of robust multi-window or dual-display management.

## 20. Version 1 Decision Status Snapshot
- **Desktop Framework**: DEFERRED TO ADR
- **Backend/API Stack**: DEFERRED TO ADR
- **Database Engine**: ACCEPTED (Relational/PostgreSQL-backed model)
- **Computer Vision**: ACCEPTED AS OUT OF SCOPE
- **Voice/AI Provider Stack**: DEFERRED TO ADR

## 21. Next Documents That Depend on This Scope
- `docs/architecture/system_design.md` (High-level system topology based on dual-screen/AI requirements)
- Core `docs/adrs/` defining the primary desktop framework.
- Core `docs/adrs/` establishing the backend API stack.
- Core `docs/adrs/` selecting the external LLM, STT, and TTS provider pipelines.

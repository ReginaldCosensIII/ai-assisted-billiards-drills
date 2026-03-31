# Simulator-First Implementation Roadmap

**Status:** Draft / Baseline
**Date:** 2026-03-31

## 1. Purpose

This document defines the strict chronological sequence for implementing Version 1 features. The overarching philosophy is "Simulator-First": every piece of application logic, data fetching, and visual rendering must be fully verifiable in a pure software environment (the developer's secondary monitor) before physical hardware and optical testing are introduced.

## 2. Core Testing Mandate

Unit testing is not a later phase; it is foundational. From Phase 1, the implementation must prioritize testability:
*   **Domain Logic**: The `shared/` package must have near-complete test coverage for data schemas and pure mathematical functions (e.g., coordinate scaling).
*   **API Layer**: Backend routes must be tested via integration suites using mock databases.
*   **State Machines**: Desktop application UI state (Drill Selection -> Session Active -> Coaching Pending) must be verifiable via unit/component tests.

## 3. Implementation Sequence

### Phase 1: Shared Core & Testing Setup
1.  Initialize standard `pnpm` workspaces for `app/`, `backend/`, and `shared/`.
2.  Establish the global test harnesses (Jest/Vitest) in all three zones.
3.  Define the `DrillSchema` and validation payloads (Zod/TypeBox) in `shared/`.
4.  Write initial unit tests proving schema validation works cleanly.

### Phase 2: Drill Loading Pipeline
1.  Initialize Fastify backend and Prisma ORM logic.
2.  Build database seed scripts mapping static JSON drafts in the repo to PostgreSQL.
3.  Expose `GET /api/drills` endpoints.
4.  Write integration tests ensuring the backend correctly queries and shapes the Drill schema for the frontend.

### Phase 3: Simulator Renderer (Primary App)
1.  Initialize the Electron/React application.
2.  Implement the "Control UI" responsible for listing available drills from the backend.
3.  Implement a 2D "Virtual Table Canvas" in the Control UI that can visually interpret the normalized `(0.0 - 1.0)` drill layouts.
4.  Ensure visual coordinate scaling functions have robust pure-function unit tests.

### Phase 4: Projector Window Workflow
1.  Introduce Electron IPC (Inter-Process Communication).
2.  Spawn the secondary "Projector Window" rendering context.
3.  Pass the active `layout_data` payload from the Control UI to the Projector Window.
4.  *Validation*: The developer's secondary computer monitor now acts as the projector.

### Phase 5: Calibration Harness
1.  Implement the UI layer for manual four-point projection alignment.
2.  Build the mathematical keystone warp matrix in `app/`.
3.  Ensure pure-function unit tests exhaustively cover the keystone math algorithms.
4.  *Validation*: The mock table projector window should be configurable to "warp" visually on the secondary monitor setup.

### Phase 6: Manual Outcome Input
1.  Expand the database schema to track `practice_sessions` and `session_attempts`.
2.  Add UI controls permitting the user to log "Pass / Fail" or scores on the Control Window.
3.  Verify outcome data correctly persists via the API to the backend database.

### Phase 7: AI Context Assembly Layer
1.  Introduce the AI tracking schema (`ai_conversations`).
2.  Build the pure-function "Context Assembly Engine" linking drill notes, recent scores, and the current shot outcome. **(High Testing Priority)**
3.  Integrate generic provider gateways for LLM requests.
4.  Integrate generic provider gateways for Text-to-Speech (TTS) readout of the responses to the application UI.

## 4. Hardware Transition

Only after Phase 7 is functionally stable in a completely software-based dual-monitor workstation environment does hardware validation (cheap projector shining onto a scaled table approximation) formally begin.

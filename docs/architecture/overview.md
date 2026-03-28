# Architecture Overview

**Status:** Working Baseline
**Date:** 2026-03-28

## 1. Document Purpose
This document provides a high-level map of the `ai-assisted-billiards-drills` system architecture. It serves to align developers and stakeholders on the structural boundaries, component responsibilities, and primary data flows for Version 1 and beyond.

## 2. System Summary
The platform is a desktop-first, AI-assisted projection system for billiards training. It uses a dual-window application (Electron) to provide a primary control interface for the user and a secondary scaled output for a projector. Real-time coaching is delivered via a conversational AI layer that interprets player-reported outcomes.

## 3. Major System Components

### 3.1. Frontend (Desktop App Shell)
- **Framework**: Electron (Node.js/Chromium)
- **Language**: TypeScript
- **Responsibility**: Window management, UI rendering, local coordination, and projection mapping.

### 3.2. Backend (Service Layer)
- **Framework**: Fastify (Node.js)
- **Language**: TypeScript
- **ORM**: Prisma
- **Responsibility**: Business logic orchestration, database access, and third-party AI gateway management.

### 3.3. Database
- **Engine**: PostgreSQL
- **Responsibility**: Permanent storage of relational entities (Drills, Users, Sessions, Attempt Outcomes).

### 3.4. AI & Voice Services (Third-Party)
- **LLM**: Conversational intelligence and coaching logic.
- **STT**: User voice command interpretation.
- **TTS**: AI response vocalization.

## 4. Component Responsibilities

### 4.1. Desktop Application
- Rendering the user control dashboard.
- Managing the secondary "Projector Window" (borderless fullscreen).
- Coordinate table calibration (mapping virtual coordinates to physical projector space).
- Handling local simulation/preview mode (Rendering a virtual table when no projector is present).

### 4.2. Backend/Service Layer
- Standardized REST API for the frontend.
- Securely storing and retrieving drill library data.
- Managing user session recording and history tracking.
- Orchestrating requests to AI providers.

### 4.3. Database
- Enforcing schema integrity for structured drill metadata.
- Storing time-series outcome data for progress analytics.

### 4.4. AI Orchestration
- Assembling context (Current Drill + Player History + Recent Outcome).
- Managing turn-based coaching conversation state.
- Filtering/Post-processing AI suggestions to ensure billiards-specific accuracy.

### 4.5. Projection and Simulation Workflow
- Applying keystone and scaling transforms to drill graphics.
- Providing a "Simulator-First" environment where all logic can be validated visually in a headless or multi-window workstation setup.

## 5. Local versus Cloud Responsibilities
- **Local (Workstation)**: Real-time UI, window placement, projection rendering, calibration state, local video/media playback.
- **Cloud (Managed Services)**: User accounts, global drill library updates, AI inference (LLM/STT/TTS), and long-term data backup.

## 6. Major Data Flows
1. **Selection**: User selects Drill -> App requests Drill Data from Backend -> Backend Fetches from DB.
2. **Projection**: App calculates Scaling/Keystone -> Renders to Projector Window.
3. **Outcome**: User reports Shot Result (Voice/Click) -> App sends to Backend -> Backend forwards to AI with context.
4. **Coaching**: AI returns Advice -> Backend forwards to App -> App Displays/Speaks Advice.

## 7. Boundaries and Deferred Architecture Areas
- **Computer Vision (Phase 4)**: No machine-vision components are present in V1. The interface for "Outcome Reporting" will be designed to accept automated inputs in the future.
- **Mobile Support**: Explicitly deferred. All V1 logic resides in the Desktop/Server layers.
- **Hardware Integration**: No custom hardware control (e.g., projector power/settings via software) is in V1 scope.

## 8. Related Source Documents and ADR References
- [Master Project Brief](../master-brief/master-project-brief.md)
- [Version 1 Product Scope](../scope/version-1-product-scope.md)
- [Development and Testing Environment Plan](../testing/environment_plan.md)
- [ADR Index](../adrs/index.md)
- [ADR-0001: Desktop-First Direction](../adrs/ADR-0001-desktop-first-product-direction.md)
- [ADR-0005: Electron Selection](../adrs/ADR-0005-desktop-shell-selection.md)
- [ADR-0006: Backend Stack Selection](../adrs/ADR-0006-backend-api-stack.md)

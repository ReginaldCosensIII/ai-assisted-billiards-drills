# System Interaction Diagrams

**Status:** Draft / Baseline
**Date:** 2026-03-31

## 1. Purpose

This document provides visual mapping for the primary data and control flows within Version 1 of the platform. These interaction diagrams serve as the architectural contract between the Electron desktop shell, the Fastify backend service, and external AI providers.

## 2. Overall System Architecture

This high-level architecture maps the physical deployment boundaries.

```mermaid
flowchart TD
    subgraph Desktop Workstation
        A[Electron App Shell]
        B[Primary Control Window UI]
        C[Projector Render Window UI]
        D[Local IPC Broker]
        A --> B
        A --> C
        B <--> D
        C <--> D
    end

    subgraph Service Environment
        E[Fastify Backend API]
        F[(PostgreSQL Database)]
        G[Content Seeds / Migrations]
        E <--> F
        G -.->|Seeding| F
    end

    subgraph Cloud Providers
        H[Managed AI Services LLM]
        I[Managed Speech Services TTS/STT]
    end

    D <==>|REST / HTTP| E
    E <==>|API Gateway / HTTPS| H
    E <==>|API Gateway / HTTPS| I
```

## 3. Drill Selection to Rendering Flow

This sequence diagrams the process from a user selecting a drill to the graphics appearing on the physical table (or simulator screen).

```mermaid
sequenceDiagram
    actor User
    participant UI as Control UI (App)
    participant Backend as Fastify Service
    participant DB as Database
    participant Projector as Projector Window (App)
    
    User->>UI: Clicks "Load Drill X"
    UI->>Backend: GET /api/drills/:id
    Backend->>DB: Query Drill Record
    DB-->>Backend: Return JSON `layout_data`
    Backend-->>UI: Drill Payload
    
    UI->>UI: Update Local State (Active Session)
    UI->>Projector: IPC Emit: RENDERING_PAYLOAD (layout_data)
    Projector->>Projector: Apply Calibration Keystone
    Projector->>Projector: Render Abs. Pixel Coordinates
    Projector-->>User: Visual projection appears on table
```

## 4. Projector/Simulator Rendering Flow

This flowchart details how the standardized `(0.0 - 1.0)` drill layout is mathematically transformed into physical pixels. *Note: this pure-function mathematical pipeline must be exhaustively unit tested during implementation.*

```mermaid
flowchart LR
    A[Normalized Drill Coordinates <br> `0.0` to `1.0`] --> B{Environment Router}
    
    B -->|Simulator Mode| C[Apply Mock Table Bounds]
    C --> D[Render to Screen Pixels]
    
    B -->|Physical Projection| E[Fetch Calibration State <br> `warp_matrix`]
    E --> F[Apply Keystone Math]
    F --> G[Projector Output Pixels]
```

## 5. AI Context Assembly Flow

When a user finishes a recorded attempt, the system must synthesize static instruction, past history, and the new outcome into a single, cohesive LLM prompt.

```mermaid
flowchart TD
    A[Drill Schema Context <br> `coaching_notes`, `success_criteria`] --> D(Context Assembly Engine)
    B[Current Attempt Outcome <br> `user_reported_score`] --> D
    C[Recent Session History <br> `last 3 outcomes`] --> D
    
    D --> E[Inject into System Prompt Template]
    E --> F[Send to LLM API]
```

## 6. User Outcome to Coaching Response Flow

This full round-trip sequence shows how manual user input maps to eventual AI voice playback.

```mermaid
sequenceDiagram
    actor User
    participant UI as Control UI
    participant Backend as AI Orchestrator
    participant DB as Persistence
    participant LLM as AI Provider
    participant TTS as Voice Provider
    
    User->>UI: Clicks "Attempt Failed - Missed Cut"
    UI->>Backend: POST /api/session/outcome <br> {"status": "fail", "reason": "missed_cut"}
    Backend->>DB: Save Outcome Record
    
    Backend->>Backend: Assemble Context (Drill + Outcome + History)
    Backend->>LLM: POST Inference Request
    LLM-->>Backend: Coaching Advice Text (e.g., "Check stance...")
    
    Backend->>DB: Log conversation exchange
    
    Backend->>TTS: Request Audio (Advice Text)
    TTS-->>Backend: Audio Buffer / Stream
    
    Backend-->>UI: Return Audio + Text UI Payload
    UI->>User: Display text & Play synthesized audio
```

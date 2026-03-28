# ADR-0006: Backend and API Stack Selection

**Date:** 2026-03-28
**Status:** Accepted

## Context

Version 1 requires a backend service layer that:
- Manages API communication between the desktop client and the PostgreSQL database (Accepted in ADR-0002).
- Routes requests to and from third-party LLM, STT, and TTS providers.
- Provides a clean API abstraction decoupling the desktop shell from the data and inference layers.
- Supports a **simulator-first workflow** and is maintainable for an agent-assisted development process.

The ecosystem selection for this backend must be maintainable, performant for local-first use, and extensible for future cloud features.

## Decision

The following stack is selected for the Version 1 backend:
- **Runtime**: **Node.js** (must use an **LTS line** for production stability) with **TypeScript**.
- **Framework**: **Fastify** for high-performance, modern async-first architecture.
- **ORM**: **Prisma** for type-safe, declarative database interaction.
- **API Style**: **REST** is selected for simplicity, clarity, and ease of documentation in Version 1.

## Rationale

This decision prioritizes **Developer Experience (DX) and Agentic Workflow Efficiency**. By using Node.js and TypeScript, we maintain language uniformity across the entire project (Frontend, Main Process, and Backend). This allows for shared types and utility logic, significantly reducing the overhead of context switching for both humans and AI agents.

**Fastify** provides a more efficient and modern foundation than Express, with built-in schema validation that ensures robust API contracts. **Prisma** is selected for its superior TypeScript integration, which is particularly beneficial in an agentic workflow where type-safety acts as a critical guardrail against regressions.

**REST** is chosen for the API layer to keep the Version 1 implementation straightforward and well-documented. While other protocols (like GraphQL or tRPC) were considered, REST provides the most universal and predictable interface for the initial prototype and launch-ready build.

Python or other language additions (e.g., Go) are explicitly deferred. They may be revisited in later phases if future requirements for advanced computer vision (Phase 4) or complex analytics justify the introduction of a second language runtime and its associated packaging complexity.

## Consequences

- **Positive**: Single-language stack (TypeScript) across the repository. High reliability for agentic code generation. Fastify and Prisma provide a modern, performant, and type-safe foundation.
- **Negative**: Not as native to the AI/ML ecosystem as Python (mitigated by using managed API providers for V1).
- **Neutral**: The backend will be architected as a separate service layer, allowing it to be bundled either as an internal Electron module or a standalone sidecar process.

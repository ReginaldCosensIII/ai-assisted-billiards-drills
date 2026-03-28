# ADR-0007: AI, STT, and TTS Provider Selection

**Date:** —
**Status:** Pending

## Context

Version 1 depends on the following third-party managed services:
- **Large Language Model (LLM)**: Powers the drill-aware coaching chatbot.
- **Speech-to-Text (STT)**: Converts user voice input to text for the coaching loop (required by ADR-0004, Stage 3).
- **Text-to-Speech (TTS)**: Converts AI coaching output to audio playback (required by ADR-0004, Stage 2).

These services may be sourced from a single provider or multiple providers. Evaluation criteria should include response quality, latency, cost at expected usage volumes, API stability, and privacy/data handling policies.

The choice of provider(s) directly affects coaching quality, voice interaction latency, and per-session operating cost. This decision must be made before any voice or AI pipeline implementation begins.

## Decision

Not yet made. Provider candidates, evaluation criteria, and trade-offs should be documented here before the decision is recorded.

## Consequences

*(To be completed when the decision is made.)*

# ADR-0004: Staged Voice Rollout for Launch-Ready Version 1

**Date:** 2026-03-27
**Status:** Accepted

## Context

Voice interaction is a product requirement for Launch-Ready Version 1 and a meaningful part of the drill coaching experience. However, voice is composed of multiple distinct capabilities (read-aloud, user speech input, conversational session management) that carry different technical risks and development cost.

Delivering all voice capabilities simultaneously increases integration risk and complicates early testing. A staged rollout isolates concerns, allows the text-only experience to stabilize first, and ensures each voice layer is independently testable.

## Decision

Voice capabilities will be delivered in four progressive stages within Version 1:

1. **Text Chat Only**: The coaching assistant operates entirely through text input and text output. This is the functional baseline of the Core Prototype.
2. **Read-Aloud (TTS)**: Automatic text-to-speech playback of AI responses when the user has TTS enabled. Users may wait for playback to complete before responding.
3. **Speech-to-Text Input (STT)**: Users may speak their prompts instead of typing. Push-to-talk or tap-to-talk interaction models are acceptable. Real-time duplex interruption is not required.
4. **Conversational Drill Instructor Mode**: A smoother session-level coaching loop that connects TTS and STT in a more natural turn-based voice flow.

Highly advanced real-time duplex interruption (cutting off AI mid-sentence) is explicitly out of scope for Version 1.

## Consequences

- **Positive**: Each stage can be shipped and validated independently. Stage 1 can be delivered without any voice infrastructure. Reduces integration risk.
- **Negative**: Users in early access receive a text-only experience that may feel less polished than the eventual voice-enabled product.
- **Neutral**: The specific STT and TTS service providers are not decided by this ADR. Provider selection is deferred to ADR-0007.

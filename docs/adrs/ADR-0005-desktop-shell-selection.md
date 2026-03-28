# ADR-0005: Desktop Shell Framework Selection

**Date:** 2026-03-28
**Status:** Accepted

## Context

Version 1 requires a desktop application shell that supports:

- A **primary control UI window** for drill browsing, session control, and coaching interaction.
- A **secondary projection window** that can be independently positioned on the projector or second display.
- Modern web-technology UI rendering (HTML/CSS/JS) for layout, animation, and future AI chat integration.
- Integration with backend services and third-party APIs (LLM, STT, TTS).
- A **simulator-first workflow** so software development can proceed without physical hardware.
- An efficient **agent-assisted development workflow** — the framework should have broad documentation and ecosystem support so AI agents can reliably navigate its patterns.
- Stable cross-platform packaging and deployment.

### Candidates Evaluated

#### Electron
Electron embeds Chromium and Node.js, giving every application a consistent rendering environment and full filesystem/OS access through Node. It is the most widely adopted desktop application framework in the web-technology ecosystem, powering VS Code, Slack, Figma, and hundreds of other professional tools.

**Relevant strengths for this project:**
- Multi-window management is mature, extensively documented, and straightforward. Opening, positioning, and communicating between a control window and a borderless fullscreen projection window is a solved, common pattern.
- The Node.js main process provides direct OS integration without a separate backend language.
- Chromium rendering is consistent across platforms — no cross-platform WebView inconsistency risk.
- The ecosystem is enormous. ipcMain/ipcRenderer patterns are widely understood and have abundant documentation, tutorials, and agent training data.
- Packaging solutions (Electron Forge, electron-builder) are mature and well-tested.
- All UI code is TypeScript/JavaScript, maintaining a single language across the full desktop layer.

**Relevant weaknesses:**
- Ships with a full Chromium runtime → binary sizes of 150–200 MB. This is a real tradeoff, but not a meaningful constraint for a local desktop training platform.
- Higher memory baseline than a native WebView solution (each renderer process is a Chromium instance).

#### Tauri
Tauri uses the host OS's native WebView (WebView2/Chromium Edge on Windows, WebKit on macOS, WebKitGTK on Linux) with a Rust process as the system backend, resulting in significantly smaller bundle sizes and a lower memory footprint.

**Relevant strengths for this project:**
- Smaller bundle size (5–15 MB typical).
- Lower memory usage.
- Faster startup time.

**Relevant weaknesses for this project:**
- The backend process is written in Rust. This introduces a second language into the stack, adding complexity for both human and agent-assisted development. Most of this project's non-Python surface area is expected to be TypeScript, and adding Rust increases the cognitive surface area without a proportional benefit at V1 scale.
- Multi-window support was significantly improved in Tauri 2.0 but remains less mature and less documented than Electron's. The specific dual-window projection use case (independent window placement, borderless fullscreen on a secondary display) has substantially fewer examples and community resources.
- Cross-platform WebView inconsistencies (especially between WebKit on macOS and WebKitGTK on Linux) can surface layout and behavior differences that Electron's uniform Chromium rendering avoids entirely.
- Far less agent-usable ecosystem documentation compared to Electron. AI agents working on Tauri-specific patterns (particularly its Rust IPC layer) have a shallower training data foundation.

## Decision

**Electron** is selected as the desktop shell framework for Version 1.

## Rationale

The critical requirements for this project — reliable multi-window projection control, a web-technology UI layer, and an agent-friendly development workflow — are all more strongly served by Electron at this stage.

The bundle size and memory tradeoffs of Electron are real but not disqualifying. The target deployment context is a local desktop machine connected to a projector. Users are not installing this on mobile devices or bandwidth-constrained systems. A 180 MB Electron binary is acceptable and expected for this category of desktop tool.

Tauri's Rust backend and its less mature multi-window ecosystem would slow implementation — both for human developers and for AI agents. The projection-specific multi-window patterns this project needs are a first-class, well-documented problem space in Electron. In Tauri, they require working closer to the metal and navigating a less established set of resources.

## Consequences

- **Positive**: The dual-window projection workflow has extensive Electron precedent to draw from. Agent-assisted implementation will operate in the most-documented desktop framework in the JavaScript ecosystem. A single language (TypeScript/JavaScript) spans the UI and the main process.
- **Negative**: Electron binaries are large by default. Memory usage is higher than a native WebView approach. These are accepted tradeoffs for V1.
- **Neutral**: If performance or binary size become meaningful concerns in a future phase, a migration evaluation (or hybrid approach) can be documented as a separate ADR at that time. This decision is scoped to Version 1.

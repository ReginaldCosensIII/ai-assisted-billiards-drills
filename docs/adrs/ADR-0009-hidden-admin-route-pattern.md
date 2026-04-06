# ADR-0009: Hidden Admin Route Pattern for Internal Tooling

**Date:** 2026-04-05
**Status:** Accepted
**Deciders:** Reginald Cosens III

---

## Context

The project requires an internal "Drill Creator Sandbox" — a visual, click-to-place tool for generating drill content. This tool is intended exclusively for developers and content authors; it must **not** appear in the public-facing Control UI navigation that a player would encounter during a practice session.

We needed a routing pattern that:
1. Hides the internal view from default navigation without a separate Electron window.
2. Is automatically accessible during development without extra steps.
3. Can be explicitly activated in a production/staging build if needed.

## Decision

We adopt a **dual-trigger Hidden Admin Route** pattern implemented in `App.tsx`:

```typescript
const isAdmin = import.meta.env.DEV || window.location.search.includes('mode=admin');
```

This single boolean flag gates the rendering of all internal admin UI elements (buttons, views, routes). It evaluates to `true` under two conditions:

| Trigger | When Active |
|---|---|
| `import.meta.env.DEV` | Automatically `true` when running `pnpm dev` via Vite in development mode. |
| `?mode=admin` query param | Manually appended to the app URL in any environment (e.g., `http://localhost:5173/?mode=admin`). |

## Consequences

**Positive:**
- Zero friction for developers: the Creator tab is always visible during local development.
- Production builds (`pnpm build`) will compile `import.meta.env.DEV` to `false`, so the gated UI is completely tree-shaken and invisible by default.
- The `?mode=admin` escape hatch allows content authors to access the tool on a staging build without requiring a code change or a separate build.

**Negative / Trade-offs:**
- The `?mode=admin` URL pattern offers no authentication. This is intentional for V1; the tool is intended for operator use only and the app is not publicly hosted.
- If true authentication is needed in a future phase, this ADR should be superseded by a session-based auth token check.

## Affected Files

- `app/src/renderer/src/App.tsx` — primary gating logic.
- `app/src/renderer/src/components/CreatorView.tsx` — the gated internal view.

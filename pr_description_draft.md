## Pull Request Overview

**Description:**
Resolves critical local environment machine port conflicts by explicitly migrating the backend Fastify server and all React API fetch configurations/fallbacks from `3001` to `3030`. Additionally, patches a subtle "click bleed" UX bug via React Refs where concluding a ball-drag interaction inadvertently bubbled an event to the playing surface's new-ball-placement click handler.

**Related Issues / Tasks:** Drag "Click Bleed" Patch & Port 3030 Migration
---

## Scope of Work
*Check all workspaces that apply:*
- [x] `app/` (Electron / React / Vite / UI)
- [x] `backend/` (Fastify / Prisma / API)
- [ ] `shared/` (Schemas / Math / Domain Logic)
- [ ] `docs/` (Architecture / ADRs / Playbooks)
- [ ] `root/` (Tooling / CI / Workspace Config)

## Type of Change
- [ ] ✨ New Feature
- [x] 🐛 Bug Fix
- [ ] ♻️ Refactor / Tech Debt
- [ ] 🏗️ Architecture / Infrastructure
- [ ] 📝 Documentation Update

---

## Testing & Verification
- **Automated Tests:** Verified TypeScript endpoints pass.
- **Manual UI/App Verification:** Confirmed that clicking and dropping a ball purely moves its coordinates and correctly intercepts/aborts the click-propagation to the table layout hook. Validated HTTP traffic targets `http://localhost:3030`.
- **Backend/DB Verification:** Backend `.env` configuration correctly initialized on `3030`.
---

## Pre-Merge Checklist
*Review the [Definition of Done](docs/workflow/definition_of_done.md) before submitting.*
- [x] I have run `pnpm -r typecheck` (or build equivalents) and no errors exist across the workspace.
- [x] I have run `pnpm -r test` and all unit/integration tests pass.
- [x] Code follows the current phase constraints (no out-of-bounds feature work).
- [ ] Any new architectural decisions are documented in a new ADR in `docs/adrs/`.
- [ ] Existing documentation (Architecture diagrams, Data Models) has been updated to reflect these changes.
- [x] Commits are clean, descriptive, and follow the imperative style guidelines.

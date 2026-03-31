# Engineering Workflow and Agent Operations Playbook

**Status:** Living Document
**Date:** 2026-03-28

## 1. Roles and Responsibilities

### 1.1. Project/Product Manager Hub (PM Hub)
- **Primary**: The main chat session or coordinating agent.
- **Responsibility**: Maintains the Master Brief and Product Scope. Decides "What" we are building and "Why". Manages the high-level roadmap and task allocation.

### 1.2. Architect / System Design Agent
- **Responsibility**: Translates requirements into technical designs. Owns the ADR process and the Architecture Overview. Defines "How" components interact. Validates implementation plans against the approved architecture.

### 1.3. Implementation Agent
- **Responsibility**: Executes specific coding tasks, writes tests, and performs refactors. Works within the boundaries of an approved Implementation Plan. Reports completion using the `phase_completion_template.md`.

### 1.4. Human Reviewer / Decision Owner
- **Responsibility**: Final sign-off on ADRs, Scope, and Implementation Plans. Performs physical environment testing (Real Table / Projector). Provides qualitative feedback on UI and Voice interactions.

## 2. The Development Lifecycle

### 2.1. Discovery & Planning
1. PM Hub identifies a task from the Roadmap.
2. Architect Agent creates/updates necessary ADRs or documentation.
3. Human reviews and approves the direction.

### 2.2. Implementation Planning
1. Implementation Agent creates an `implementation_plan.md` artifact.
2. Plan must include: Affected files, Logic changes, and a **Verification Plan**.
3. Verification must include specific commands or steps for an agent to run.

### 2.3. Execution
1. Agent moves to **EXECUTION** mode.
2. Code is written in small, testable chunks.
3. Agent follows the project's `.editorconfig` and `CONTRIBUTING.md` standards.

### 2.4. Verification & Reporting
1. Agent moves to **VERIFICATION** mode.
2. All tests in the plan are executed and logs captured.
3. Agent creates a `walkthrough.md` with proof of work.
4. Agent summarizes work and updates the ADR index/task list.

## 3. Communication & Prompting Standards
- **Templates**: Always use the templates in `docs/prompts/` and `docs/workflow/`.
- **Context**: When starting a new task, the agent must read the Master Brief, relevant ADRs, and the V1 Scope first.
- **Conventional Commits**: All git commits must follow the Conventional Commits specification (e.g., `feat:`, `fix:`, `docs:`, `test:`).

## 4. Documentation Strategy
- **Documentation-First**: No feature implementation starts until its scope and architecture are documented and approved.
- **Living Docs**: Docs like the Architecture Overview and this Playbook should be updated incrementally as the project evolves.
- **Checklists**: Use `docs/workflow/documentation_checklist.md` before finalizing any phase.

## 5. Guardrails & Quality Control
- **No Scope Drift**: Agents must not implement features outside the current approved task or ADRs.
- **Consistency**: High-level ADRs (e.g., Desktop framework, DB choice) are binding. Deviations require a new ADR.
- **Review**: Human review is mandatory for all architectural changes and major implementation milestones.
- **Low-Quality Prevention**: If an agent hits repeated failures, it must stop, document the blocker, and ask for human clarification rather than guessing.

### 5.1. Blocker Escalation Rules
- If an implementation agent encounters a normal coding issue, bug, or test failure within the approved task boundary, it should continue working and resolve it.
- If an implementation agent encounters a blocker that would require changing approved scope, an accepted ADR, a cross-system interface, the data model direction, or the expected user workflow, it must stop and escalate.

### 5.2. Edge-Case Design Deviation Handling
- If an implementation agent identifies a small local improvement that does not change approved architecture, it may propose it in the task report, but should not silently broaden scope.
- If a deviation affects API boundaries, database schema direction, desktop window model, AI workflow, voice workflow, or core drill behavior, it must be escalated before implementation continues.

### 5.3. Testing Expectations From the Beginning of the Lifecycle
- Unit testing should be expected from the beginning of implementation, especially for logic with high regression risk such as coordinate transforms, drill rendering rules, calibration math, AI context assembly, and stateful workflow logic.

## 6. Repository Hygiene
- **Branches**: Multi-agent work should happen on specific feature or task branches (e.g., `feat/auth`, `task/calibration`).
- **Commits**: Atomic commits with clear descriptions.
- **Cleanup**: Remove temporary scratch files (in `/tmp/`) or diagnostic logs before marking a task complete.

# Codebase Initialization Plan

**Status:** Draft / Baseline
**Date:** 2026-03-31

## 1. Purpose

This document provides the exact order of operations for establishing the physical repository structure using `pnpm` workspaces. It defines how to scaffold the baseline environments for the desktop shell, the backend service, and the shared typing library, while reinforcing a testing-first posture.

## 2. Workspace and Package Manager Strategy

To ensure seamless code-sharing (particularly TypeScript definition boundaries between the API and the client UI), this repository is structured as a monorepo.

*   **Manager**: `pnpm` (Highly recommended for strict dependency resolution and fast symlinking).
*   *Note: Standard `npm` workspaces remain functionally viable if environment constraints strictly prohibit `pnpm`, but the primary build pipelines and tooling configuration documented below assume `pnpm`.*

## 3. Directory Structure Guarantee

The root will strictly adhere to the previously approved top-level layout. No generic `apps/` or `packages/` container directories will be injected:

```text
/
├── app/               # Electron + React Application
├── backend/           # Fastify + Prisma Node.js Service
├── shared/            # Cross-boundary domain models and schemas
├── docs/              # Current architecture planning context
├── pnpm-workspace.yaml
└── package.json       # Root orchestrator
```

## 4. Initialization Order

Agents and human orchestrators must execute initialization in the following strict order to avoid unresolved dependency loops:

### Step 1: Root Initialization
1.  Initialize standard root `package.json` (`pnpm init`).
2.  Create `pnpm-workspace.yaml` explicitly defining `app`, `backend`, and `shared` as valid workspace members.
3.  Configure root repository settings (Prettier, ESLint, EditorConfig).

### Step 2: Shared Package Scaffold
1.  Create `/shared` and initialize an internal package (`pnpm init`).
2.  Add minimal TypeScript configurations (`tsconfig.json` set to generate declarations).
3.  Add baseline unit testing dependencies (e.g., `vitest` or `jest`).
4.  Define early domain type interfaces (`DrillSchema.ts`) based on `docs/architecture/drill-schema.md`.
5.  *Gate*: Run early unit tests proving `shared/` builds cleanly.

### Step 3: Backend Package Scaffold
1.  Create `/backend` and initialize an internal package.
2.  Add Fastify, TypeScript, and Prisma ORM dependencies.
3.  Add testing frameworks (e.g., `vitest`) explicitly to the backend module.
4.  Link the `shared` workspace dependency (`pnpm add shared@workspace:*`).
5.  Initialize Prisma against a local provisioned PostgreSQL database. (Note: While temporary in-memory databases like SQLite may be used strictly for isolated test suites, PostgreSQL serves as the mandatory default for all scaffolding, local development, and migrations).
6.  *Gate*: Backend tests and type-checks must pass against the models imported from `shared`.

### Step 4: Electron App Scaffold
1.  Create `/app` and initialize an internal package.
2.  Configure a Vite + React + TypeScript + Electron boilerplate (e.g., via `electron-vite` or a similarly hardened template).
3.  Add unit testing frameworks specific to UI/Math validation.
4.  Link the `shared` workspace dependency.
5.  Ensure `.gitignore` specifically isolates heavy UI build assets (like `dist-electron/`).
6.  *Gate*: The desktop application successfully boots a "Hello World" window and passes local scaffolding component tests.

## 5. Testing Expectations at Scaffold

A properly initialized boundary is a tested boundary. During Step 2, Step 3, and Step 4, dummy test files (e.g., `math.spec.ts` or `app.test.ts`) must be installed and verified before marking the project as successfully "scaffolded." The root package must provide a command (e.g., `pnpm run test:all`) that sequences and executes all test suites across `shared/`, `backend/`, and `app/`.

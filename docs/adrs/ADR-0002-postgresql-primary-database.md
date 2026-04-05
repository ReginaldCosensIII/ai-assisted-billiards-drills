# ADR-0002: PostgreSQL as Primary Database

**Date:** 2026-03-27 (Updated: 2026-04-05)
**Status:** Accepted

## Context

Version 1 requires a relational data model to map structured entities including users, drills, drill attempts, session histories, and progress records. The drill taxonomy, outcome records, and coaching context all have well-defined relational relationships that benefit from a structured schema with enforced integrity.

A document-store or key-value backend would add unnecessary flexibility overhead for what is inherently structured, predictable, relational data. The team has no requirement in Version 1 for a non-relational storage model.

## Decision

PostgreSQL will serve as the primary data store for Version 1. The schema will map the core relational entities (users, drills, sessions, attempt outcomes).

**Local Development Environment**: To ensure maximum compatibility with Windows host machines that may already have native PostgreSQL services running on the default port `5432`, the Docker container will be mapped to host port **5433**. Prisma connection strings in the local environment must use this remapped port.

## Consequences

- **Positive**: Strong schema enforcement for structured drill and session data. Mature ecosystem with broad support. Aligns with future expansion to analytics, reporting, and instructor workflows.
- **Positive**: Port remapping (5433) resolves "P1000 Authentication Failed" errors caused by collisions with existing host-level database services.
- **Negative**: Requires a managed or self-hosted database service in production. Slightly higher local setup overhead than embedded solutions (e.g., SQLite) during early development.
- **Neutral**: SQLite may be considered as a local development convenience substitute, provided the production PostgreSQL schema remains the source of truth. Any such substitution would require its own ADR or documented decision.

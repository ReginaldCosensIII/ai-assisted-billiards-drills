# ADR-0002: PostgreSQL as Primary Database

**Date:** 2026-03-27
**Status:** Accepted

## Context

Version 1 requires a relational data model to map structured entities including users, drills, drill attempts, session histories, and progress records. The drill taxonomy, outcome records, and coaching context all have well-defined relational relationships that benefit from a structured schema with enforced integrity.

A document-store or key-value backend would add unnecessary flexibility overhead for what is inherently structured, predictable, relational data. The team has no requirement in Version 1 for a non-relational storage model.

## Decision

PostgreSQL will serve as the primary data store for Version 1. The schema will map the core relational entities (users, drills, sessions, attempt outcomes). The specific ORM or query layer used to interact with PostgreSQL is left open for the backend stack ADR.

## Consequences

- **Positive**: Strong schema enforcement for structured drill and session data. Mature ecosystem with broad support. Aligns with future expansion to analytics, reporting, and instructor workflows.
- **Negative**: Requires a managed or self-hosted database service in production. Slightly higher local setup overhead than embedded solutions (e.g., SQLite) during early development.
- **Neutral**: SQLite may be considered as a local development convenience substitute, provided the production PostgreSQL schema remains the source of truth. Any such substitution would require its own ADR or documented decision.

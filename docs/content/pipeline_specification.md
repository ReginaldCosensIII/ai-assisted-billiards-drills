# Drill Content Pipeline Specification

**Status:** Draft / Baseline
**Date:** 2026-03-31

## 1. Purpose

This document outlines the lifecycle of a single drill from conceptual draft to published content. Because Version 1 relies on physical accuracy and human-validated coaching contexts, the pipeline is designed to be highly structured. It ensures that content delivered to the application is tested, accurate, and optimized for both the UI and the AI assistant.

## 2. Stages of Drill Creation

The content pipeline flows through five distinct stages:

### Stage 1: Drafting (Layout Generation)
*   **Action**: Creating the raw schema definition (Metadata, Core Rules, `(x, y)` ball boundaries).
*   **Actor**: In Early V1, this is done manually via code/JSON by developers or human annotators.
*   **Output**: A raw `draft` schema file.

### Stage 2: Enrichment (Instruction & Logic)
*   **Action**: Supplementing the raw coordinates with instructional data (`instructions`, `coaching_notes`, `common_mistakes`, `success_criteria`). 
*   **Actor**: A subject matter expert (SME) or an AI agent prompted via a developer.
*   **Output**: A fully populated schema JSON object.

### Stage 3: Media Attachment
*   **Action**: Creating and linking supporting visual materials (`demo_media_refs`).
*   **Actor**: Content editors. This step can run in parallel with Stage 2.
*   **Output**: Exported images/videos placed in appropriate storage buckets or local assets folders.

### Stage 4: Review and Approval
*   **Action**: Validation. A drill must be loaded into the local Software Simulator to verify the JSON renders correctly. Optionally, it should be projected onto a physical table to verify scale and playability.
*   **Actor**: Human QA or automated unit-tests acting on simulator headless rendering.
*   **Output**: The drill state is changed from `draft` to `approved`.

### Stage 5: Publication
*   **Action**: The drill is packaged and deployed.
*   **Actor**: CI/CD pipeline or direct database seeding scripts.
*   **Output**: The drill becomes available in the app's Drill Library with an immutable `version`.

## 3. Versioning and Revisions

To preserve user history, drills are treated as immutable once published.
*   If a minor typo in `instructions` is fixed, it can be patched in place.
*   If the physical `layout` (e.g., starting cue ball position) or `success_criteria` is meaningfully changed, the drill `version` must be incremented (e.g., `v1` to `v2`).
*   User Session Attempts are bound to a specific drill ID and version combination to prevent retroactive data corruption (e.g., a "Pass" on an easy version of the drill should not be compared against a heavily modified harder version under the same ID).

## 4. Future Automation Integration (Deferred)

This pipeline is designed to gracefully accept automation in future phases—such as prompt-based AI drafting or camera-based coordinate ingestion—without breaking the underlying V1 assumptions. All such automation is explicitly out of scope for early V1.

## 5. Implementation Implications

*   **Source of Truth & Database Seeding**: Early V1 draft drill content lives natively as statically managed files within the source repository. This centralizes version control and pull-request review. Approved content is then strictly synced or seeded downstream into the database, making the database a reflection of the source repo.
*   **Entity State**: The database models will need a `status` field (e.g., `draft`, `published`, `archived`) to support staging unapproved content.
*   **Simulator-First Validation**: The pipeline emphasizes simulator validation. The V1 Desktop Application must include a "Developer/Preview Mode" to rapidly load local draft schemas from disk before they are published to a database.

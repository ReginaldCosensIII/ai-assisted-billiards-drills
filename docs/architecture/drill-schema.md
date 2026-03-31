# Drill Schema Specification

**Status:** Draft / Baseline
**Date:** 2026-03-31

## 1. Purpose

This document defines the structured data schema for a Billiards Drill within Version 1 of the platform. The schema acts as the single source of truth for rendering the drill physically (via projection/simulator) and for providing contextual constraints to the AI coaching loop. It is designed to be highly structured to support unit testing and simulator-first rendering logic.

## 2. Field Classifications

To maintain a practical Version 1 scope while enabling future capabilities, fields are explicitly categorized as Required, Optional, or Reserved for Future Use.

### 2.1. Required V1 Fields

These fields must be present for a drill to successfully render on the virtual simulator or the physical projector, and to generate the minimum context required by the AI.

*   **`id`** (`string` / UUID): Unique identifier for the drill.
*   **`title`** (`string`): Human-readable drill name.
*   **`category`** (`string` / Enum): Primary classification (e.g., `cut_shot`, `position_play`, `safety`, `bank`).
*   **`difficulty`** (`integer` or Enum): Assessed difficulty level (e.g., `1-5`).
*   **`table_compatibility`** (`array[string]`): List of supported table sizes (e.g., `["7ft", "8ft", "9ft"]`).
*   **`layout`** (`object`):
    *   **`cue_ball`** (`object`): Coordinates `(x, y)`. Coordinates should be normalized (relative `0.0` to `1.0`) relative to the playing surface to support scaling across different table bounds in the simulator-first model.
    *   **`object_balls`** (`array[object]`): Array of target balls with `id`, `number` (optional), and `(x, y)` coordinates.
*   **`success_criteria`** (`string` or `object`): The primary goal of the drill (e.g., "Pocket the 1-ball in the corner pocket and stop the cue ball within Target Zone A").
*   **`coaching_notes`** (`array[string]`): High-level context injected directly into the system prompt for the AI assistant when this drill is active.
*   **`version`** (`string`): Semantic version or integer tracking revisions to the physical layout.
*   **`author_id`** (`string`): Identifier of the creator or system that approved the draft.

### 2.2. Optional V1 Fields

These fields enrich the V1 experience but are not strictly required for the platform to function without breaking.

*   **`description`** (`string`): A longer summary of the drill's purpose.
*   **`tags`** (`array[string]`): Additional metadata for searching (e.g., `["draw_control", "rail_first"]`).
*   **`layout.target_zones`** (`array[object]`): Designated "landing zones" for the cue ball, defined as polygons or circles arrayed with normalized `(x, y)` vertices.
*   **`layout.obstacles`** (`array[object]`): Additional balls or props that are not targets but must be avoided.
*   **`instructions`** (`string`): Step-by-step written guidance displayed in the UI prior to the attempt.
*   **`common_mistakes`** (`array[string]`): Known failure patterns to feed to the AI context to better interpret user-reported outcomes.
*   **`demo_media_refs`** (`array[string]`): Identifiers or URLs linking to reference image diagrams or video demonstrations of the drill.

### 2.3. Reserved Future Fields

These fields are documented here for architectural awareness but **must not** be implemented as dependencies in Version 1. They anticipate the eventual integration of camera tracking and automated feedback.

*   *(Deferred)* **`vision_validation_profile`**: Strict bounds and tolerance values (`mm` or `pixels`) for allowable ball drift during automated setup verification.
*   *(Deferred)* **`expected_path`**: A set of vector splines defining the optimal cue ball/object ball paths used for auto-generating ghost paths or evaluating shot tracking.
*   *(Deferred)* **`spin_constraints`**: Expected RPM or english (left/right/top/bottom) required, intended for future sensor validation.
*   *(Deferred)* **`dynamic_progression_id`**: Associated drill ID to automatically load if the user succeeds/fails X times in a row.

### 2.4. Data Modeling Separation Note

To maintain alignment with the database architecture, this schema clearly bounds two separate data forms:
*   **Top-Level Relational Metadata**: Fields such as `id`, `title`, `category`, `difficulty`, `table_compatibility`, `version`, and `author_id` are treated as stable, queryable relational data.
*   **Nested Physical Layout Payload**: The remaining fields, notably the complex physical `layout` object, `target_zones`, and instructional arrays, are treated collectively as a complex document payload. We explicitly avoid normalizing individual ball coordinates into separate relational sets.

## 3. Implementation Implications

*   **TypeScript Domains:** This document directly specifies the `DrillSchema` TypeScript interface that will be defined in the `shared/` core library.
*   **Data Storage:** As noted above, the implementation strictly limits normalization. The database maps only the stable top-level metadata to relational columns, storing the entire complex physical drill layout payload in a `jsonb` field.
*   **Unit Testing:** The distinction between Normalized Coordinates `(0.0 - 1.0)` and Absolute Pixels will require pure-function coordinate transformation algorithms. These functions must be exhaustively unit-tested within the UI/Projector layer.
*   **AI Context Assembly:** The `coaching_notes` and `common_mistakes` fields will be directly serialized into the system prompt when building the AI Context.

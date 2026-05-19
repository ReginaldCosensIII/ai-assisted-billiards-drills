# BILLIARDS-INTELLIGENCE: TECHNICAL SPECIFICATION & IMPLEMENTATION STANDARDS

**Document-ID:** `billiards-intelligence-core`
**Target-Audience:** Implementation-Agent (React/TypeScript Frontend)
**System-Domain:** `Billiards-Control-UI`
**Architectural-Goal:** Establish foundational physics, UX, schema, and visual constraints for a projector-based billiards training interface.

---

## 1. CORE-PHYSICS-RULES
To move beyond static diagrams, the `physics-calculation-engine` must dynamically render paths based on continuous variable input.

* **Ghost-Ball Positioning:** * Calculated dynamically by establishing a vector from the center of the `target-pocket` (or `shape-zone`) through the center of the `object-ball`. 
  * The `ghost-ball` coordinate is locked exactly one ball-diameter behind the `object-ball` along this vector.
* **Tangent-Line (90-Degree Stun):**
  * The baseline reference path post-collision. Assuming a pure stun-shot, the `cue-ball` deflects exactly 90 degrees away from the impact-axis.
* **Natural-Roll (30-Degree Deviation):**
  * If top-spin (follow) is applied, the trajectory bends forward from the `tangent-line` culminating in a ~30-degree deflection angle from the initial aim-line.
* **Draw and Spin-Deflection:**
  * Bottom-spin (draw) must curve the trajectory backward from the `tangent-line`.
  * Left/Right English must visualize Collision-Induced-Throw (CIT) on the `object-ball` and post-rail trajectory changes.

---

## 2. HIGH-FIDELITY-UX-STANDARDS
The interface must bridge the gap between digital precision and physical table interaction. Minimize input friction.

* **Sub-Pixel Dragging:**
  * Positional coordinates must update in real-time (60fps) using smooth React-state management. 
  * Strictly prohibit default grid-snapping. Implement `modifier-key-snapping` (e.g., holding Shift) only for precise alignments.
* **Ghost-Hover Visualization:**
  * Before a ball is placed, a translucent `ghost-hover` element must follow the cursor.
  * **Collision:** If the hover-position overlaps an existing ball, the ghost turns "High-Vis Red" and snapping is disabled.
* **Event-Deconfliction:**
  * Implement strict z-index and hitbox management. 
  * Dragging a ball to change its location must be distinctly managed via state so it does not accidentally trigger trajectory drawing.

---

## 3. DRILL-SCHEMA-REQUIREMENTS
Every payload handed off to the backend must adhere to this extended metadata structure for eventual AI training.

```json
{
  "drill-metadata": {
    "version": "2.0",
    "difficulty-rating": 1,
    "cloth-type": "simonis-860"
  },
  "ball-positions": [
    {
      "id": "cb",
      "type": "cue-ball",
      "coords": { "x": 0.25, "y": 0.5 },
      "applied-english": { "x-offset": 0.0, "y-offset": 0.0 },
      "shot-speed": 5.0
    },
    {
      "id": "ob1",
      "type": "object-ball",
      "coords": { "x": 0.75, "y": 0.5 },
      "is-blocker": false
    }
  ],
  "trajectories": []
}
```

---

## 4. PROJECTOR-UI-SPECIFICATIONS
Standard web-UI styling washes out on tournament felt. 

* **High-Contrast Color-Palette:**
  * Primary Action/Cue-Path: `Neon-Cyan` (#00FFFF)
  * Target/Object-Path: `High-Vis-Magenta` (#FF00FF)
  * Safe/Shape-Zones: `Electric-Green` (#39FF14)
  * Avoid dark blues, blacks, and standard reds.
* **Line-Thickness:**
  * Vector lines must be rendered with a stroke-width of 4px to 6px to ensure projector visibility.
* **Impact-Animations:**
  * Implement slow, rhythmic CSS/SVG pulsing-rings at key interaction nodes (ghost-ball contact, rail-impact).
import { describe, it, expect } from 'vitest';
import { scaleNormalizedCoordinate, checkBallCollision, calculateGhostBall } from './coordinate-math';

describe('scaleNormalizedCoordinate', () => {
  it('scales 0,0 correctly to bounds', () => {
    expect(scaleNormalizedCoordinate({ x: 0, y: 0 }, 1000, 500)).toEqual({ x: 0, y: 0 });
  });

  it('scales 1,1 perfectly to canvas limits', () => {
    expect(scaleNormalizedCoordinate({ x: 1, y: 1 }, 1000, 500)).toEqual({ x: 1000, y: 500 });
  });

  it('scales exactly at center (0.5, 0.5)', () => {
    expect(scaleNormalizedCoordinate({ x: 0.5, y: 0.5 }, 1000, 500)).toEqual({ x: 500, y: 250 });
  });

  it('handles rounding explicitly (0.33, 0.66)', () => {
    expect(scaleNormalizedCoordinate({ x: 0.333, y: 0.666 }, 1000, 500)).toEqual({ x: 333, y: 333 });
  });

  it('clamps out of bounds negative coordinates to 0', () => {
    expect(scaleNormalizedCoordinate({ x: -0.5, y: -2.0 }, 1000, 500)).toEqual({ x: 0, y: 0 });
  });

  it('clamps out of bounds large positive coordinates to width/height limits', () => {
    expect(scaleNormalizedCoordinate({ x: 1.5, y: 9.0 }, 1000, 500)).toEqual({ x: 1000, y: 500 });
  });
});

describe('checkBallCollision', () => {
  const layout = {
    cue_ball: { x: 0.25, y: 0.5 },
    object_balls: [
      { id: 'ob1', number: 1, position: { x: 0.75, y: 0.5 } }
    ]
  };

  it('detects no collision when hover is far away', () => {
    expect(checkBallCollision({ x: 0.5, y: 0.5 }, layout, 'cue_ball', 600, 300)).toBe(false);
  });

  it('detects collision when hover is directly on top of object ball in cue_ball mode', () => {
    expect(checkBallCollision({ x: 0.75, y: 0.5 }, layout, 'cue_ball', 600, 300)).toBe(true);
  });

  it('detects collision when hover is close (overlapping) to object ball', () => {
    expect(checkBallCollision({ x: 458 / 600, y: 150 / 300 }, layout, 'cue_ball', 600, 300)).toBe(true);
  });

  it('detects collision with cue_ball when placing object_ball', () => {
    expect(checkBallCollision({ x: 0.25, y: 0.5 }, layout, 'object_ball', 600, 300)).toBe(true);
  });

  it('does not collide with cue_ball when placing cue_ball itself', () => {
    expect(checkBallCollision({ x: 0.25, y: 0.5 }, layout, 'cue_ball', 600, 300)).toBe(false);
  });
});

describe('calculateGhostBall', () => {
  it('calculates straight shot ghost ball correctly in pixel space', () => {
    // OB at 0.5, 0.5 (scaled 300, 150)
    // Target at 0.8, 0.5 (scaled 480, 150)
    // Vector target -> OB: dx = -180, dy = 0.
    // Unit vector: ux = -1, uy = 0.
    // GB center: OB + diameter * ux = (300 - 16, 150) = (284, 150).
    // Normalized back: 284/600 = 0.47333333333333333, 150/300 = 0.5.
    const ob = { x: 0.5, y: 0.5 };
    const target = { x: 0.8, y: 0.5 };
    const gb = calculateGhostBall(ob, target, 8, 600, 300);
    expect(gb.x).toBeCloseTo(284 / 600, 5);
    expect(gb.y).toBeCloseTo(0.5, 5);
  });

  it('calculates angled shot ghost ball correctly', () => {
    // OB at 0.5, 0.5 (300, 150)
    // Target at 0.5, 0.9 (300, 270)
    // Vector target -> OB: dx = 0, dy = -120.
    // Unit vector: ux = 0, uy = -1.
    // GB center: OB + 16 * uy = (300, 150 - 16) = (300, 134).
    // Normalized back: 300/600 = 0.5, 134/300 = 0.44666666666666666
    const ob = { x: 0.5, y: 0.5 };
    const target = { x: 0.5, y: 0.9 };
    const gb = calculateGhostBall(ob, target, 8, 600, 300);
    expect(gb.x).toBeCloseTo(0.5, 5);
    expect(gb.y).toBeCloseTo(134 / 300, 5);
  });
});


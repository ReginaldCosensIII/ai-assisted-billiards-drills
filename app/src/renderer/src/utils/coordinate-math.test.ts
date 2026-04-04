import { describe, it, expect } from 'vitest';
import { scaleNormalizedCoordinate } from './coordinate-math';

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

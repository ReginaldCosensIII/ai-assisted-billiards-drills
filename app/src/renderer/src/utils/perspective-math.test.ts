import { describe, it, expect } from 'vitest';
import { calculatePerspectiveTransform } from './perspective-math';
import { Point2D } from '@billiards/shared';

describe('calculatePerspectiveTransform', () => {
  const IDENTITY = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

  it('returns identity matrix when dimensions are 0', () => {
    const targets: Point2D[] = [
      { x: 0, y: 0 }, { x: 100, y: 0 },
      { x: 100, y: 100 }, { x: 0, y: 100 }
    ];
    expect(calculatePerspectiveTransform(0, 0, targets)).toEqual(IDENTITY);
  });

  it('returns identity matrix for degenerate points (collinear/same coords)', () => {
    // All points at origin -> zero area
    const targets: Point2D[] = [
      { x: 0, y: 0 }, { x: 0, y: 0 },
      { x: 0, y: 0 }, { x: 0, y: 0 }
    ];
    expect(calculatePerspectiveTransform(100, 100, targets)).toEqual(IDENTITY);
  });

  it('calculates correct transform for a 1:1 identity map', () => {
    const width = 100;
    const height = 100;
    const targets: Point2D[] = [
      { x: 0, y: 0 },       // Top Left
      { x: 100, y: 0 },     // Top Right
      { x: 100, y: 100 },   // Bottom Right
      { x: 0, y: 100 }      // Bottom Left
    ];
    
    const matrix = calculatePerspectiveTransform(width, height, targets);
    expect(matrix).toEqual(IDENTITY);
  });

  it('calculates correct translation', () => {
    const width = 100;
    const height = 100;
    const targets: Point2D[] = [
      { x: 50, y: 50 },
      { x: 150, y: 50 },
      { x: 150, y: 150 },
      { x: 50, y: 150 }
    ];
    
    const matrix = calculatePerspectiveTransform(width, height, targets);
    
    // Translation matrix3d should be:
    // [1, 0, 0, 0,
    //  0, 1, 0, 0,
    //  0, 0, 1, 0,
    //  tx, ty, 0, 1]
    expect(matrix[12]).toBeCloseTo(50); // tx (c)
    expect(matrix[13]).toBeCloseTo(50); // ty (f)
    expect(matrix[0]).toBeCloseTo(1);   // scaleX
    expect(matrix[5]).toBeCloseTo(1);   // scaleY
  });

  it('calculates correct scaling', () => {
    const width = 100;
    const height = 100;
    const targets: Point2D[] = [
      { x: 0, y: 0 },
      { x: 200, y: 0 },
      { x: 200, y: 200 },
      { x: 0, y: 200 }
    ];
    
    const matrix = calculatePerspectiveTransform(width, height, targets);
    
    expect(matrix[0]).toBeCloseTo(2);   // sx
    expect(matrix[5]).toBeCloseTo(2);   // sy
    expect(matrix[12]).toBeCloseTo(0);  // tx
    expect(matrix[13]).toBeCloseTo(0);  // ty
  });
});

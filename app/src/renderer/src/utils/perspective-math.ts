import { Point2D } from '@billiards/shared';

/**
 * Calculates a CSS matrix3d array to transform an element of size (width, height)
 * so that its 4 corners map exactly to the provided target points.
 * Target points must be ordered: TopLeft, TopRight, BottomRight, BottomLeft.
 * 
 * If the points are degenerate (collinear or zero-area), it returns an Identity Matrix.
 */
export function calculatePerspectiveTransform(width: number, height: number, targets: Point2D[]): number[] {
  const IDENTITY = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  
  if (targets.length !== 4) return IDENTITY;
  if (width <= 0 || height <= 0) return IDENTITY;

  const [p0, p1, p2, p3] = targets;
  
  const dx1 = p1.x - p2.x;
  const dx2 = p3.x - p2.x;
  const dy1 = p1.y - p2.y;
  const dy2 = p3.y - p2.y;

  const sumX = p0.x - p1.x + p2.x - p3.x;
  const sumY = p0.y - p1.y + p2.y - p3.y;

  const denominator = dx1 * dy2 - dy1 * dx2;
  
  // Degenerate checks
  if (Math.abs(denominator) < 1e-10) return IDENTITY;

  let g = 0;
  let h = 0;

  if (Math.abs(sumX) > 1e-10 || Math.abs(sumY) > 1e-10) {
    g = (sumX * dy2 - sumY * dx2) / denominator;
    h = (dx1 * sumY - dy1 * sumX) / denominator;
  }

  const a = p1.x - p0.x + g * p1.x;
  const b = p3.x - p0.x + h * p3.x;
  const c = p0.x;
  const d = p1.y - p0.y + g * p1.y;
  const e = p3.y - p0.y + h * p3.y;
  const f = p0.y;

  // Scale column 1 by 1/width and column 2 by 1/height to map (width, height) space to unit square input
  const aPrime = a / width;
  const dPrime = d / width;
  const gPrime = g / width;

  const bPrime = b / height;
  const ePrime = e / height;
  const hPrime = h / height;

  // CSS matrix3d uses column-major order:
  // [m11, m12, m13, m14] -> aPrime, dPrime, 0, gPrime
  // [m21, m22, m23, m24] -> bPrime, ePrime, 0, hPrime
  // [m31, m32, m33, m34] -> 0,      0,      1, 0
  // [m41, m42, m43, m44] -> c,      f,      0, 1
  return [
    aPrime, dPrime, 0, gPrime,
    bPrime, ePrime, 0, hPrime,
    0,      0,      1, 0,
    c,      f,      0, 1
  ];
}

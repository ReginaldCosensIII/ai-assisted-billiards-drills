import { NormalizedCoordinate } from '@billiards/shared';

export function scaleNormalizedCoordinate(
  coord: NormalizedCoordinate, 
  width: number, 
  height: number
): { x: number, y: number } {
  // Pure function: clamps normalized values roughly between 0 and 1 before scaling
  const normX = Math.max(0, Math.min(1, coord.x));
  const normY = Math.max(0, Math.min(1, coord.y));
  
  return {
    x: Math.round(normX * width),
    y: Math.round(normY * height)
  };
}

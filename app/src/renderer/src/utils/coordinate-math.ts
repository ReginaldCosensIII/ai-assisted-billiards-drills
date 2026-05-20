import { NormalizedCoordinate, DrillLayout } from '@billiards/shared';

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

/**
 * Checks if the hover coordinate overlaps any existing ball on the table.
 * Ball diameter is assumed to be 16px.
 */
export function checkBallCollision(
  hover: NormalizedCoordinate,
  layout: DrillLayout,
  mode: 'cue_ball' | 'object_ball',
  width: number,
  height: number
): boolean {
  const hoverPx = { x: hover.x * width, y: hover.y * height };
  const ballDiameter = 16; // pixels

  const isOverlapping = (bx: number, by: number) => {
    const dx = hoverPx.x - bx * width;
    const dy = hoverPx.y - by * height;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < ballDiameter;
  };

  // Cue ball mode: collides with object balls
  if (mode === 'cue_ball') {
    for (const ob of layout.object_balls) {
      if (isOverlapping(ob.position.x, ob.position.y)) {
        return true;
      }
    }
  }

  // Object ball mode: collides with cue ball and other object balls
  if (mode === 'object_ball') {
    if (layout.cue_ball && layout.cue_ball.x !== -1) {
      if (isOverlapping(layout.cue_ball.x, layout.cue_ball.y)) {
        return true;
      }
    }
    for (const ob of layout.object_balls) {
      if (isOverlapping(ob.position.x, ob.position.y)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Calculates the exact mathematical Ghost Ball coordinate.
 * The Ghost Ball is placed at a distance of 2 * ballRadius (one ball diameter)
 * from the Object Ball center, along the line pointing from the Target Center
 * through the Object Ball Center.
 */
export function calculateGhostBall(
  obCoords: NormalizedCoordinate,
  targetCoords: NormalizedCoordinate,
  ballRadius: number,
  width: number,
  height: number
): NormalizedCoordinate {
  const obPx = { x: obCoords.x * width, y: obCoords.y * height };
  const targetPx = { x: targetCoords.x * width, y: targetCoords.y * height };

  const dx = obPx.x - targetPx.x;
  const dy = obPx.y - targetPx.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) {
    return { x: obCoords.x, y: obCoords.y };
  }

  const ux = dx / distance;
  const uy = dy / distance;

  // Extend past OB by one ball diameter (2 * ballRadius)
  const diameter = 2 * ballRadius;
  const gbPx = {
    x: obPx.x + ux * diameter,
    y: obPx.y + uy * diameter
  };

  return {
    x: gbPx.x / width,
    y: gbPx.y / height
  };
}


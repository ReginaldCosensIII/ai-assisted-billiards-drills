import React from 'react';
import { DrillLayout } from '@billiards/shared';
import { scaleNormalizedCoordinate } from '../utils/coordinate-math';

interface Props {
  layout: DrillLayout;
  width: number;
  height: number;
}

export default function VirtualTable({ layout, width, height }: Props) {
  // Ensure we use the 2:1 ratio for coordinate scaling
  // even if the passed props aren't perfectly 2:1.
  const tableWidth = width;
  const tableHeight = width / 2;

  const cueScaled = scaleNormalizedCoordinate(layout.cue_ball, tableWidth, tableHeight);

  return (
    <div style={{ 
      width: `${tableWidth}px`, 
      height: `${tableHeight}px`, 
      backgroundColor: '#2e7d32', 
      position: 'relative',
      boxSizing: 'border-box',
      // Using an inset shadow for the border to keep the coordinate system 
      // exactly matching the container edges.
      boxShadow: 'inset 0 0 0 4px #1a1a1a',
      borderRadius: '2px',
      overflow: 'hidden'
    }}>
      {/* Cue Ball */}
      <div style={{
        position: 'absolute',
        width: '16px',
        height: '16px',
        backgroundColor: 'white',
        borderRadius: '50%',
        left: cueScaled.x - 8,
        top: cueScaled.y - 8,
        border: '1px solid #ccc',
        boxShadow: '1px 1px 3px rgba(0,0,0,0.5)',
        zIndex: 10
      }} />

      {/* Object Balls */}
      {layout.object_balls?.map((ob, idx) => {
        const scaled = scaleNormalizedCoordinate(ob.position, tableWidth, tableHeight);
        return (
          <div key={ob.id || idx} style={{
            position: 'absolute',
            width: '16px',
            height: '16px',
            backgroundColor: ob.number === 8 ? 'black' : 'red',
            borderRadius: '50%',
            left: scaled.x - 8,
            top: scaled.y - 8,
            color: 'white',
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '1px 1px 3px rgba(0,0,0,0.5)',
            zIndex: 5
          }}>
            {ob.number || ''}
          </div>
        );
      })}
    </div>
  );
}

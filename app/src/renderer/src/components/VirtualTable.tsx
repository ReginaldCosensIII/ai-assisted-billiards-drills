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
  // The table should always be twice as wide as it is high
  const cueScaled = scaleNormalizedCoordinate(layout.cue_ball, width, height);

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      backgroundColor: '#2e7d32', 
      position: 'relative',
      boxSizing: 'border-box',
      border: '4px solid #1a1a1a', // Subtle dark rim for the table
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
        const scaled = scaleNormalizedCoordinate(ob.position, width, height);
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

import React from 'react';
import { DrillLayout } from '@billiards/shared';
import { scaleNormalizedCoordinate } from '../utils/coordinate-math';

interface Props {
  layout: DrillLayout;
  width: number;
  height: number;
}

export default function VirtualTable({ layout, width, height }: Props) {
  const cueScaled = scaleNormalizedCoordinate(layout.cue_ball, width, height);

  return (
    <div style={{ 
      width, 
      height, 
      backgroundColor: '#2e7d32', 
      position: 'relative',
      border: '10px solid saddlebrown',
      borderRadius: '5px',
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

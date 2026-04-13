import React from 'react';
import { DrillLayout } from '@billiards/shared';
import { scaleNormalizedCoordinate } from '../utils/coordinate-math';

interface Props {
  layout: DrillLayout;
  width: number;
  height: number;
  displayMode?: 'ui' | 'projector';
  surfaceRef?: React.Ref<HTMLDivElement>;
  onSurfaceClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onSurfaceMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onSurfaceMouseUp?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onBallMouseDown?: (e: React.MouseEvent, type: 'cue_ball' | 'object_ball', id?: string) => void;
}

export default function VirtualTable({ 
  layout, 
  width, 
  height, 
  displayMode = 'ui', 
  surfaceRef, 
  onSurfaceClick,
  onSurfaceMouseMove,
  onSurfaceMouseUp,
  onBallMouseDown
}: Props) {
  // Ensure we use the 2:1 ratio for coordinate scaling
  // even if the passed props aren't perfectly 2:1.
  const tableWidth = width;
  const tableHeight = width / 2;

  const cueScaled = scaleNormalizedCoordinate(layout.cue_ball, tableWidth, tableHeight);

  const playingSurface = (
    <div 
      ref={surfaceRef}
      onClick={onSurfaceClick}
      onMouseMove={onSurfaceMouseMove}
      onMouseUp={onSurfaceMouseUp}
      style={{ 
        width: `${tableWidth}px`, 
        height: `${tableHeight}px`, 
        backgroundColor: displayMode === 'ui' ? '#2e7d32' : 'transparent', 
        position: 'relative',
        boxSizing: 'border-box',
        // Using an inset shadow for the border to keep the coordinate system 
        // exactly matching the container edges.
        boxShadow: displayMode === 'ui' ? 'inset 0 0 0 4px #1a1a1a' : 'none',
        borderRadius: '2px',
        overflow: 'visible', // CRITICAL: changed from hidden to allow balls to overlap cushions
        pointerEvents: 'auto'
      }}>
      
      {/* Markings */}
      {displayMode === 'ui' && (
        <>
          {/* Head String */}
          <div style={{ position: 'absolute', left: '25%', top: 0, bottom: 0, borderLeft: '1px solid rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
          {/* Foot Spot */}
          <div style={{ position: 'absolute', left: '75%', top: '50%', width: '4px', height: '4px', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />
        </>
      )}

      {/* Trajectories */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}>
        {layout.trajectories?.map((traj, idx) => {
          const points = traj.path.map(p => {
             const scaled = scaleNormalizedCoordinate(p, tableWidth, tableHeight);
             return `${scaled.x},${scaled.y}`;
          }).join(' ');
          
          let stroke = '#ffffff';
          let strokeDasharray = 'none';
          
          if (traj.type === 'cue_ball') {
             stroke = 'white';
             strokeDasharray = '5, 5';
          } else if (traj.type === 'object_ball') {
             stroke = 'rgba(255, 0, 0, 0.8)';
          } else if (traj.type === 'ghost_ball') {
             stroke = 'rgba(255, 255, 255, 0.5)';
             strokeDasharray = '2, 2';
          }

          return (
             <polyline
               key={traj.id || idx}
               points={points}
               fill="none"
               stroke={stroke}
               strokeWidth="2"
               strokeDasharray={strokeDasharray}
             />
          );
        })}
      </svg>

      {/* Cue Ball */}
      <div 
        onMouseDown={(e) => { e.stopPropagation(); onBallMouseDown?.(e, 'cue_ball'); }}
        style={{
        position: 'absolute',
        width: '16px',
        height: '16px',
        backgroundColor: 'white',
        borderRadius: '50%',
        left: cueScaled.x - 8,
        top: cueScaled.y - 8,
        border: '1px solid #ccc',
        boxShadow: '1px 1px 3px rgba(0,0,0,0.5)',
        zIndex: 10,
        cursor: 'grab'
      }} />

      {/* Object Balls */}
      {layout.object_balls?.map((ob, idx) => {
        const scaled = scaleNormalizedCoordinate(ob.position, tableWidth, tableHeight);
        return (
          <div 
            key={ob.id || idx} 
            onMouseDown={(e) => { e.stopPropagation(); onBallMouseDown?.(e, 'object_ball', ob.id); }}
            style={{
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
            zIndex: 5,
            cursor: 'grab'
          }}>
            {ob.number || ''}
          </div>
        );
      })}

      {/* Target Zones */}
      {layout.target_zones?.map((zone, idx) => {
        const scaled = scaleNormalizedCoordinate({ x: zone.x, y: zone.y }, tableWidth, tableHeight);
        const radiusPx = zone.radius * tableWidth;
        return (
          <div 
            key={zone.id || idx}
            style={{
              position: 'absolute',
              width: `${radiusPx * 2}px`,
              height: `${radiusPx * 2}px`,
              backgroundColor: 'rgba(0, 0, 255, 0.2)',
              border: '2px dashed rgba(0, 0, 255, 0.5)',
              borderRadius: '50%',
              left: scaled.x - radiusPx,
              top: scaled.y - radiusPx,
              pointerEvents: 'none',
              zIndex: 1
            }}
          />
        );
      })}
    </div>
  );

  if (displayMode === 'projector') {
    return playingSurface;
  }

  // Draw rails and labels for UI mode
  return (
    <div style={{
      position: 'relative',
      padding: '30px',
      backgroundColor: '#5c4033', // Dark wood color for rails
      borderRadius: '8px',
      display: 'inline-block',
      boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
      userSelect: 'none',
      pointerEvents: 'none'
    }}>
      {playingSurface}

      {/* Head Rail Label */}
      <div style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translate(-50%, -50%) rotate(-90deg)', color: '#d2b48c', fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px', opacity: 0.8, zIndex: 20 }}>
        HEAD RAIL
      </div>
      {/* Foot Rail Label */}
      <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translate(50%, -50%) rotate(90deg)', color: '#d2b48c', fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px', opacity: 0.8, zIndex: 20 }}>
        FOOT RAIL
      </div>

      {/* 6 Pockets */}
      {[
        { top: 12, left: 12 }, // Top-Left
        { top: 12, left: 30 + tableWidth / 2 }, // Top-Middle
        { top: 12, right: 12 }, // Top-Right
        { bottom: 12, left: 12 }, // Bottom-Left
        { bottom: 12, left: 30 + tableWidth / 2 }, // Bottom-Middle
        { bottom: 12, right: 12 }, // Bottom-Right
      ].map((pos, idx) => (
        <div key={idx} style={{
          position: 'absolute',
          width: '36px',
          height: '36px',
          backgroundColor: '#0a0a0a',
          borderRadius: '50%',
          boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.9)',
          ...pos,
          transform: pos.left === 30 + tableWidth / 2 ? 'translateX(-50%)' : 'none'
        }} />
      ))}
    </div>
  );
}

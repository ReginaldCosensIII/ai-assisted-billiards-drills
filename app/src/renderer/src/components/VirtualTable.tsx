import React from 'react';
import { DrillLayout } from '@billiards/shared';
import { scaleNormalizedCoordinate, calculateGhostBall } from '../utils/coordinate-math';

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
  onSurfaceMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
  activeEntity?: { type: 'cue_ball' } | { type: 'object_ball', id: string } | null;
  hoverCoords?: { x: number; y: number } | null;
  hoverMode?: 'cue_ball' | 'object_ball' | null;
  hoverCollision?: boolean;
  onBallClick?: (type: 'cue_ball' | 'object_ball', id?: string) => void;
  onZoneClick?: (zoneId: string) => void;
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
  onBallMouseDown,
  onSurfaceMouseLeave,
  activeEntity = null,
  hoverCoords = null,
  hoverMode = null,
  hoverCollision = false,
  onBallClick,
  onZoneClick
}: Props) {
  // Ensure we use the 2:1 ratio for coordinate scaling
  // even if the passed props aren't perfectly 2:1.
  const tableWidth = width;
  const tableHeight = width / 2;

  const cueScaled = scaleNormalizedCoordinate(layout.cue_ball, tableWidth, tableHeight);

  // Get active ball position for selection ring rendering
  const activeScaled = activeEntity ? (
    activeEntity.type === 'cue_ball' 
      ? cueScaled 
      : (() => {
          const activeOb = layout.object_balls.find(ob => ob.id === activeEntity.id);
          return activeOb ? scaleNormalizedCoordinate(activeOb.position, tableWidth, tableHeight) : null;
        })()
  ) : null;

  // Find linked ghost balls
  const ghostBalls = (layout.object_balls || [])
    .map(ob => {
      if (!ob.targetId) return null;
      const targetZone = (layout.target_zones || []).find(tz => tz.id === ob.targetId);
      if (!targetZone) return null;
      
      // Calculate normalized GB coordinate
      const gbCoords = calculateGhostBall(ob.position, { x: targetZone.x, y: targetZone.y }, 8, tableWidth, tableHeight);
      const scaledGb = scaleNormalizedCoordinate(gbCoords, tableWidth, tableHeight);
      
      return {
        id: `gb-${ob.id}`,
        x: scaledGb.x,
        y: scaledGb.y
      };
    })
    .filter((gb): gb is { id: string; x: number; y: number } => gb !== null);

  const selectionPulseStyle = `
    @keyframes selection-pulse {
      0% {
        r: 10px;
        opacity: 0.6;
        stroke-width: 3px;
      }
      50% {
        r: 12px;
        opacity: 1;
        stroke-width: 5.5px;
      }
      100% {
        r: 10px;
        opacity: 0.6;
        stroke-width: 3px;
      }
    }
    .selection-ring-active {
      animation: selection-pulse 1.5s infinite ease-in-out;
    }

    @keyframes ghost-pulse {
      0% {
        r: 8px;
        opacity: 0.4;
        stroke-width: 2px;
      }
      50% {
        r: 11px;
        opacity: 0.8;
        stroke-width: 3px;
      }
      100% {
        r: 8px;
        opacity: 0.4;
        stroke-width: 2px;
      }
    }
    .ghost-ring-pulse {
      animation: ghost-pulse 2s infinite ease-in-out;
    }
  `;

  const playingSurface = (
    <div 
      ref={surfaceRef}
      onClick={onSurfaceClick}
      onMouseMove={onSurfaceMouseMove}
      onMouseUp={onSurfaceMouseUp}
      onMouseLeave={onSurfaceMouseLeave}
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
      <style dangerouslySetInnerHTML={{ __html: selectionPulseStyle }} />
      
      {/* Markings */}
      {displayMode === 'ui' && (
        <>
          {/* Head String */}
          <div style={{ position: 'absolute', left: '25%', top: 0, bottom: 0, borderLeft: '1px solid rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
          {/* Foot Spot */}
          <div style={{ position: 'absolute', left: '75%', top: '50%', width: '4px', height: '4px', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />
        </>
      )}

      {/* Trajectories and Overlays */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 12 }}>
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

        {/* Ghost Balls */}
        {ghostBalls.map(gb => (
          <g key={gb.id}>
            {/* The ghost ball physical shape (dashed/translucent white) */}
            <circle
              cx={gb.x}
              cy={gb.y}
              r={8}
              fill="rgba(255, 255, 255, 0.12)"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="1.5"
              strokeDasharray="3, 3"
            />
            {/* The slow rhythmic pulsing outer impact ring (neon cyan) */}
            <circle
              cx={gb.x}
              cy={gb.y}
              r={8}
              fill="none"
              stroke="#00FFFF"
              className="ghost-ring-pulse"
            />
          </g>
        ))}

        {/* Selection Ring Overlay - rendered on top of balls inside zIndex 12 SVG */}
        {activeScaled && (
          <circle
            cx={activeScaled.x}
            cy={activeScaled.y}
            r={10}
            fill="none"
            stroke="#39FF14"
            strokeWidth={4}
            className="selection-ring-active"
          />
        )}
      </svg>

      {/* Cue Ball */}
      <div 
        onMouseDown={(e) => { e.stopPropagation(); onBallMouseDown?.(e, 'cue_ball'); }}
        onClick={(e) => { e.stopPropagation(); onBallClick?.('cue_ball'); }}
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
            onClick={(e) => { e.stopPropagation(); onBallClick?.('object_ball', ob.id); }}
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

      {/* Ghost Hover Preview */}
      {hoverCoords && hoverMode && (() => {
        const hoverScaled = scaleNormalizedCoordinate(hoverCoords, tableWidth, tableHeight);
        const isCueBall = hoverMode === 'cue_ball';
        const nextNumber = layout.object_balls.length + 1;
        return (
          <div style={{
            position: 'absolute',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            left: hoverScaled.x - 8,
            top: hoverScaled.y - 8,
            backgroundColor: hoverCollision ? '#FF1744' : (isCueBall ? '#ffffff' : 'red'),
            border: hoverCollision ? '2px solid #FF1744' : '1px dashed #ccc',
            boxShadow: hoverCollision ? '0 0 12px #FF1744' : '0 0 4px rgba(255,255,255,0.3)',
            opacity: 0.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isCueBall ? 'black' : 'white',
            fontSize: '10px',
            pointerEvents: 'none',
            zIndex: 15
          }}>
            {!isCueBall && nextNumber}
          </div>
        );
      })()}

      {/* Target Zones */}
      {layout.target_zones?.map((zone, idx) => {
        const scaled = scaleNormalizedCoordinate({ x: zone.x, y: zone.y }, tableWidth, tableHeight);
        const radiusPx = zone.radius * tableWidth;
        return (
          <div 
            key={zone.id || idx}
            onClick={(e) => { e.stopPropagation(); onZoneClick?.(zone.id); }}
            style={{
              position: 'absolute',
              width: `${radiusPx * 2}px`,
              height: `${radiusPx * 2}px`,
              backgroundColor: 'rgba(255, 191, 0, 0.2)',
              border: '2px dashed #FFBF00',
              borderRadius: '50%',
              left: scaled.x - radiusPx,
              top: scaled.y - radiusPx,
              pointerEvents: 'auto',
              cursor: 'pointer',
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

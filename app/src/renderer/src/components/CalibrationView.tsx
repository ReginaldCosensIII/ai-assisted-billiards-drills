import React, { useEffect, useRef, useState } from 'react';
import { CalibrationCorners } from '@billiards/shared';
import { useSessionStore } from '../context/SessionContext';

export default function CalibrationView() {
  const { calibration, setCalibration } = useSessionStore();
  const [activeCorner, setActiveCorner] = useState<keyof CalibrationCorners | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent, corner: keyof CalibrationCorners) => {
    e.preventDefault();
    setActiveCorner(corner);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activeCorner || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate normalized percentage (0 to 100)
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;

    // Clamp values between 0 and 100
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));

    setCalibration({
      ...calibration,
      [activeCorner]: { x, y }
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setActiveCorner(null);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Helper to render draggable handles
  const renderHandle = (corner: keyof CalibrationCorners, label: string) => {
    const point = calibration[corner];
    return (
      <div
        onPointerDown={(e) => handlePointerDown(e, corner)}
        style={{
          position: 'absolute',
          left: `${point.x}%`,
          top: `${point.y}%`,
          width: '24px',
          height: '24px',
          backgroundColor: '#ff5722',
          border: '2px solid white',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          cursor: activeCorner === corner ? 'grabbing' : 'grab',
          touchAction: 'none',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '10px',
          fontWeight: 'bold',
          userSelect: 'none'
        }}
      >
        {label}
      </div>
    );
  };

  return (
    <div>
      <h2>Calibration Mode</h2>
      <p>Drag the corners below to mirror the projection mapping onto the physical table.</p>
      
      <div 
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          position: 'relative',
          width: '600px',
          height: '300px',
          backgroundColor: '#222',
          border: '2px dashed #666',
          marginTop: '20px',
          overflow: 'hidden'
        }}
      >
        {/* Render a faint grid or guide to help visualize */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        {/* The polygon visualizing the warped area */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <polygon 
            points={`${calibration.topLeft.x}%,${calibration.topLeft.y}% ${calibration.topRight.x}%,${calibration.topRight.y}% ${calibration.bottomRight.x}%,${calibration.bottomRight.y}% ${calibration.bottomLeft.x}%,${calibration.bottomLeft.y}%`}
            fill="rgba(0, 150, 136, 0.2)"
            stroke="#009688"
            strokeWidth="2"
          />
        </svg>

        {renderHandle('topLeft', 'TL')}
        {renderHandle('topRight', 'TR')}
        {renderHandle('bottomRight', 'BR')}
        {renderHandle('bottomLeft', 'BL')}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setCalibration({
          topLeft: { x: 0, y: 0 },
          topRight: { x: 100, y: 0 },
          bottomRight: { x: 100, y: 100 },
          bottomLeft: { x: 0, y: 100 },
        })}>
          Reset Calibration
        </button>
      </div>
    </div>
  );
}

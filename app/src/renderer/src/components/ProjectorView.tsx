import React, { useEffect, useState } from 'react';
import { Drill, CalibrationCorners } from '@billiards/shared';
import VirtualTable from './VirtualTable';
import { calculatePerspectiveTransform } from '../utils/perspective-math';

export default function ProjectorView() {
  const [layout, setLayout] = useState<Drill['layout'] | null>(null);
  const [corners, setCorners] = useState<CalibrationCorners | null>(null);
  const [feedback, setFeedback] = useState<'pass' | 'fail' | null>(null);

  useEffect(() => {
    // Subscribe to layout updates from the Main process
    const unsubscribeLayout = window.api.onDrillLayoutUpdate((updatedLayout: Drill['layout']) => {
      setLayout(updatedLayout);
    });

    const unsubscribeCorners = window.api.onCalibrationCornersUpdate((updatedCorners: CalibrationCorners) => {
      setCorners(updatedCorners);
    });

    const unsubscribeFeedback = window.api.onAttemptFeedback((outcome: 'pass' | 'fail') => {
      setFeedback(outcome);
      // Clear feedback after 1.2 seconds for a concise experience
      setTimeout(() => setFeedback(null), 1200);
    });

    return () => {
      unsubscribeLayout();
      unsubscribeCorners();
      unsubscribeFeedback();
    };
  }, []);

  if (!layout) {
    return (
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        backgroundColor: '#000', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#333'
      }}>
        <p>Waiting for Drill Layout...</p>
      </div>
    );
  }

  // Calculate table dimensions strictly 2:1 to fit the window
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  let tableWidth = windowWidth;
  let tableHeight = windowWidth / 2;

  if (tableHeight > windowHeight) {
    tableHeight = windowHeight;
    tableWidth = windowHeight * 2;
  }

  // Calculate the offsets to center the 2:1 table within the arbitrary window dimensions
  const offsetX = (windowWidth - tableWidth) / 2;
  const offsetY = (windowHeight - tableHeight) / 2;

  let transformStyle: React.CSSProperties = {};

  if (corners) {
    const isDefaultCalibration = 
      corners.topLeft.x === 0 && corners.topLeft.y === 0 &&
      corners.topRight.x === 100 && corners.topRight.y === 0 &&
      corners.bottomRight.x === 100 && corners.bottomRight.y === 100 &&
      corners.bottomLeft.x === 0 && corners.bottomLeft.y === 100;

    if (!isDefaultCalibration) {
      // Map percentages to the *centered* 2:1 mapping bounds, NOT the raw window bounds.
      const targets = [
        { x: offsetX + (corners.topLeft.x / 100) * tableWidth, y: offsetY + (corners.topLeft.y / 100) * tableHeight },
        { x: offsetX + (corners.topRight.x / 100) * tableWidth, y: offsetY + (corners.topRight.y / 100) * tableHeight },
        { x: offsetX + (corners.bottomRight.x / 100) * tableWidth, y: offsetY + (corners.bottomRight.y / 100) * tableHeight },
        { x: offsetX + (corners.bottomLeft.x / 100) * tableWidth, y: offsetY + (corners.bottomLeft.y / 100) * tableHeight },
      ];

      const matrix = calculatePerspectiveTransform(tableWidth, tableHeight, targets);
      
      transformStyle = {
        transform: `matrix3d(${matrix.join(',')})`,
        transformOrigin: '0 0',
        position: 'absolute',
        left: 0,
        top: 0
      };
    }
  }

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: '#000', 
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ 
        width: tableWidth, 
        height: tableHeight, 
        position: 'relative',
        ...transformStyle 
      }}>
        {/* The Pool Table Representation */}
        <VirtualTable layout={layout} width={tableWidth} height={tableHeight} displayMode="projector" />
        
        {/* Outcome Feedback Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          boxShadow: feedback === 'pass' 
            ? 'inset 0 0 100px 40px rgba(76, 175, 80, 0.6)' 
            : feedback === 'fail' 
            ? 'inset 0 0 100px 40px rgba(244, 67, 54, 0.6)' 
            : 'none',
          opacity: feedback ? 1 : 0,
          transition: 'opacity 0.2s ease-in, box-shadow 0.2s ease-in, opacity 0.8s ease-out 0.2s',
          zIndex: 100
        }} />
      </div>
    </div>
  );
}

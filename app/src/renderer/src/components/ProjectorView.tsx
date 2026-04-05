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
      // Clear feedback after 1.5 seconds
      setTimeout(() => setFeedback(null), 1500);
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

  let transformStyle: React.CSSProperties = {};

  if (corners) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Convert percentages to absolute pixel targets based on the projector's viewport
    const targets = [
      { x: (corners.topLeft.x / 100) * width, y: (corners.topLeft.y / 100) * height },
      { x: (corners.topRight.x / 100) * width, y: (corners.topRight.y / 100) * height },
      { x: (corners.bottomRight.x / 100) * width, y: (corners.bottomRight.y / 100) * height },
      { x: (corners.bottomLeft.x / 100) * width, y: (corners.bottomLeft.y / 100) * height },
    ];

    const matrix = calculatePerspectiveTransform(width, height, targets);
    
    transformStyle = {
      transform: `matrix3d(${matrix.join(',')})`,
      // REQUIRED: CSS matrix3d for keystone mapping must origin from 0 0
      transformOrigin: '0 0'
    };
  }

  const feedbackStyle: React.CSSProperties = feedback 
    ? {
        boxShadow: `inset 0 0 100px 50px ${feedback === 'pass' ? 'rgba(76, 175, 80, 0.4)' : 'rgba(244, 67, 54, 0.4)'}`,
        transition: 'box-shadow 0.2s ease-in-out'
      } 
    : {
        boxShadow: 'inset 0 0 0px 0px transparent',
        transition: 'box-shadow 1s ease-out'
      };

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: '#000', 
      overflow: 'hidden' 
    }}>
      <div style={{ width: '100%', height: '100%', ...transformStyle, ...feedbackStyle }}>
        <VirtualTable layout={layout} width={window.innerWidth} height={window.innerHeight} />
      </div>
    </div>
  );
}

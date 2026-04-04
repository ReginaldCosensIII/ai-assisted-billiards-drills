import React, { useEffect, useState } from 'react';
import { Drill } from '@billiards/shared';
import VirtualTable from './VirtualTable';

export default function ProjectorView() {
  const [layout, setLayout] = useState<Drill['layout'] | null>(null);

  useEffect(() => {
    // Subscribe to layout updates from the Main process
    const unsubscribe = window.api.onDrillLayoutUpdate((updatedLayout: Drill['layout']) => {
      setLayout(updatedLayout);
    });

    return () => {
      unsubscribe();
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

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: '#000', 
      overflow: 'hidden' 
    }}>
      <VirtualTable layout={layout} width={window.innerWidth} height={window.innerHeight} />
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Drill } from '@billiards/shared';
import VirtualTable from './components/VirtualTable';
import ProjectorView from './components/ProjectorView';
import CalibrationView from './components/CalibrationView';
import DashboardView from './components/DashboardView';
import CreatorView from './components/CreatorView';
import ScoringPanel from './components/ScoringPanel';
import { SessionProvider } from './context/SessionContext';

function ControlApp() {
  const [drills, setDrills] = useState<Drill[]>([]);
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);
  const [error, setError] = useState('');
  const [uiMode, setUiMode] = useState<'drills' | 'calibration' | 'dashboard' | 'creator'>('drills');

  // Admin access for Creator Sandbox
  const isAdmin = import.meta.env.DEV || window.location.search.includes('mode=admin');

  // Check if we are in projector mode based on URL query parameters
  const isProjector = window.location.search.includes('mode=projector');

  useEffect(() => {
    // Explicitly use VITE_API_URL or fallback to localhost:3030
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3030';
    
    fetch(`${apiUrl}/api/drills`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setDrills(data);
        if (data.length > 0) setSelectedDrill(data[0]);
      })
      .catch((err) => setError(err.message));
  }, []);

  // Synchronize selection to the Projector Window via IPC
  useEffect(() => {
    if (!isProjector && selectedDrill) {
      window.api.sendDrillLayout(selectedDrill.layout);
    }
  }, [selectedDrill, isProjector]);

  // Render the specialized Projector View if the mode matches
  if (isProjector) {
    return <ProjectorView />;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Billiards Control UI</h1>
        <div>
          <button 
            onClick={() => setUiMode('drills')} 
            style={{ fontWeight: uiMode === 'drills' ? 'bold' : 'normal', marginRight: '10px' }}
          >
            Drills
          </button>
          <button 
            onClick={() => setUiMode('calibration')}
            style={{ fontWeight: uiMode === 'calibration' ? 'bold' : 'normal', marginRight: '10px' }}
          >
            Calibration
          </button>
          <button 
            onClick={() => setUiMode('dashboard')}
            style={{ fontWeight: uiMode === 'dashboard' ? 'bold' : 'normal' }}
          >
            Dashboard
          </button>
          {isAdmin && (
            <button 
              onClick={() => setUiMode('creator')}
              style={{ fontWeight: uiMode === 'creator' ? 'bold' : 'normal', marginLeft: '10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px' }}
            >
              Creator
            </button>
          )}
        </div>
      </div>
      
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      {uiMode === 'drills' ? (
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <div style={{ width: '250px', borderRight: '1px solid #ccc', paddingRight: '20px' }}>
            <h2>Available Drills</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {drills.map((drill) => (
                <li 
                  key={drill.id} 
                  onClick={() => setSelectedDrill(drill)}
                  style={{ 
                    cursor: 'pointer', 
                    padding: '10px',
                    backgroundColor: selectedDrill?.id === drill.id ? '#e0f7fa' : 'transparent',
                    fontWeight: selectedDrill?.id === drill.id ? 'bold' : 'normal',
                    borderBottom: '1px solid #eee'
                  }}
                >
                  {drill.title}
                </li>
              ))}
              {drills.length === 0 && !error && <li>Loading drills...</li>}
            </ul>
          </div>
          
          <div style={{ flex: 1 }}>
            {selectedDrill ? (
              <div style={{ display: 'flex', gap: '40px' }}>
                <div style={{ flex: 2 }}>
                  <h2>{selectedDrill.title}</h2>
                  <p><strong>Category:</strong> {selectedDrill.category}</p>
                  <p><strong>Success Criteria:</strong> {selectedDrill.success_criteria as string}</p>
                  
                  <div style={{ marginTop: '30px' }}>
                    <VirtualTable layout={selectedDrill.layout} width={600} height={300} />
                  </div>
                </div>
                
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <ScoringPanel drillId={selectedDrill.id} />
                </div>
              </div>
            ) : (
              <p>Please select a drill.</p>
            )}
          </div>
        </div>
      ) : uiMode === 'calibration' ? (
        <CalibrationView />
      ) : uiMode === 'dashboard' ? (
        <DashboardView />
      ) : (
        <CreatorView />
      )}
    </div>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <ControlApp />
    </SessionProvider>
  );
}

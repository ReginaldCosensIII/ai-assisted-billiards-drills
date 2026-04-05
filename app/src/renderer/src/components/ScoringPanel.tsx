import React from 'react';
import { useSessionStore } from '../context/SessionContext';

interface ScoringPanelProps {
  drillId: string;
}

export default function ScoringPanel({ drillId }: ScoringPanelProps) {
  const { logAttempt, getSessionStats, clearSession, lifetimeStats } = useSessionStore();
  const stats = getSessionStats(drillId);

  // Find lifetime stats for this specific drill
  const drillLifetime = lifetimeStats.find(s => s.drillId === drillId);

  return (
    <div style={{ 
      marginTop: '20px', 
      padding: '15px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0 }}>Active Session Scoring</h3>
        {drillLifetime && (
          <div style={{ 
            fontSize: '11px', 
            backgroundColor: '#eee', 
            padding: '4px 8px', 
            borderRadius: '12px',
            color: '#666',
            fontWeight: 'bold'
          }}>
            Lifetime: {drillLifetime.passRate.toFixed(1)}% ({drillLifetime.totalAttempts} total)
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <button
          onClick={() => logAttempt(drillId, 'pass')}
          style={{
            flex: 1,
            padding: '15px',
            fontSize: '18px',
            fontWeight: 'bold',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ✓ PASS
        </button>
        
        <button
          onClick={() => logAttempt(drillId, 'fail')}
          style={{
            flex: 1,
            padding: '15px',
            fontSize: '18px',
            fontWeight: 'bold',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ✗ FAIL
        </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '10px',
        textAlign: 'center',
        padding: '10px',
        backgroundColor: 'white',
        borderRadius: '5px',
        border: '1px solid #eee'
      }}>
        <div>
          <div style={{ fontSize: '12px', color: '#666' }}>Attempts</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{stats.total}</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#666' }}>Passes</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4caf50' }}>{stats.passes}</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#666' }}>Fails</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f44336' }}>{stats.fails}</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#666' }}>Pass Rate</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{stats.passRate}%</div>
        </div>
      </div>

      <button 
        onClick={() => clearSession(drillId)}
        style={{ 
          marginTop: '15px', 
          fontSize: '11px', 
          background: 'none', 
          border: 'none', 
          color: '#999', 
          cursor: 'pointer',
          textDecoration: 'underline'
        }}
      >
        Clear Session History
      </button>
    </div>
  );
}

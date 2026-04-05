import React, { useEffect, useState } from 'react';

export interface DrillStat {
  drillId: string;
  drillTitle: string;
  totalAttempts: number;
  passRate: number;
}

export interface DashboardStats {
  totalDrillsPlayed: number;
  totalAttempts: number;
  overallAccuracy: number;
  performanceByDrill: DrillStat[];
}

export default function DashboardView() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    fetch(`${apiUrl}/api/stats`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.json();
      })
      .then((data: DashboardStats) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading stats...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!stats) return <p>No data available.</p>;

  return (
    <div>
      <h2>Session History Dashboard</h2>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px', minWidth: '150px' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: '#555' }}>Total Attempts</h3>
          <p style={{ margin: '10px 0 0 0', fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalAttempts}</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px', minWidth: '150px' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: '#555' }}>Overall Accuracy</h3>
          <p style={{ margin: '10px 0 0 0', fontSize: '2rem', fontWeight: 'bold', color: stats.overallAccuracy >= 70 ? 'green' : 'black' }}>
            {stats.overallAccuracy.toFixed(1)}%
          </p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px', minWidth: '150px' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: '#555' }}>Drills Played</h3>
          <p style={{ margin: '10px 0 0 0', fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalDrillsPlayed}</p>
        </div>
      </div>

      <h3>Performance by Drill</h3>
      {stats.performanceByDrill.length === 0 ? (
        <p>No attempts recorded yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '800px' }}>
          {stats.performanceByDrill.map(stat => (
            <div key={stat.drillId} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold' }}>{stat.drillTitle}</span>
                <span>{stat.passRate.toFixed(1)}% ({stat.totalAttempts} attempts)</span>
              </div>
              <div style={{ width: '100%', backgroundColor: '#eee', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${stat.passRate}%`, 
                    backgroundColor: stat.passRate >= 80 ? '#4caf50' : stat.passRate >= 50 ? '#ff9800' : '#f44336',
                    transition: 'width 0.5s ease-in-out'
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

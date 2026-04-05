import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { CalibrationCorners } from '@billiards/shared';

export type Outcome = 'pass' | 'fail';

export interface Attempt {
  timestamp: number;
  outcome: Outcome;
}

export interface SessionStats {
  total: number;
  passes: number;
  fails: number;
  passRate: number;
}

export interface LifetimeStats {
  drillId: string;
  drillTitle: string;
  totalAttempts: number;
  passRate: number;
}

interface SessionContextType {
  attempts: Record<string, Attempt[]>;
  calibration: CalibrationCorners;
  lifetimeStats: LifetimeStats[];
  logAttempt: (drillId: string, outcome: Outcome) => void;
  getSessionStats: (drillId: string) => SessionStats;
  setCalibration: (corners: CalibrationCorners) => void;
  clearSession: (drillId: string) => void;
  refreshLifetimeStats: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const DEFAULT_CALIBRATION: CalibrationCorners = {
  topLeft: { x: 0, y: 0 },
  topRight: { x: 100, y: 0 },
  bottomRight: { x: 100, y: 100 },
  bottomLeft: { x: 0, y: 100 },
};

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [attempts, setAttempts] = useState<Record<string, Attempt[]>>({});
  const [calibration, setCalibrationState] = useState<CalibrationCorners>(DEFAULT_CALIBRATION);
  const [lifetimeStats, setLifetimeStats] = useState<LifetimeStats[]>([]);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const refreshLifetimeStats = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/api/stats`);
      if (res.ok) {
        const data = await res.json();
        setLifetimeStats(data.performanceByDrill);
      }
    } catch (err) {
      console.error('Failed to fetch lifetime stats:', err);
    }
  }, [apiUrl]);

  // Initial fetch of lifetime stats
  useEffect(() => {
    refreshLifetimeStats();
  }, [refreshLifetimeStats]);

  const setCalibration = useCallback((corners: CalibrationCorners) => {
    setCalibrationState(corners);
    // Sync to main process
    if (window.api?.sendCalibrationCorners) {
      window.api.sendCalibrationCorners(corners);
    }
  }, []);

  const logAttempt = useCallback(async (drillId: string, outcome: Outcome) => {
    // Optimistically update the UI memory (Active Session)
    setAttempts((prev) => {
      const drillAttempts = prev[drillId] || [];
      return {
        ...prev,
        [drillId]: [...drillAttempts, { timestamp: Date.now(), outcome }],
      };
    });
    
    // Trigger IPC feedback for the projector window immediately
    if (window.api?.sendAttemptFeedback) {
      window.api.sendAttemptFeedback(outcome);
    }

    try {
      // persist to DB
      const res = await fetch(`${apiUrl}/api/attempts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drillId, outcome })
      });

      if (res.ok) {
        // Refresh lifetime stats to keep everything in sync
        refreshLifetimeStats();
      }
    } catch (err) {
      console.error('Failed to log attempt to database:', err);
    }
  }, [apiUrl, refreshLifetimeStats]);

  const getSessionStats = useCallback((drillId: string): SessionStats => {
    const drillAttempts = attempts[drillId] || [];
    const total = drillAttempts.length;
    const passes = drillAttempts.filter((a) => a.outcome === 'pass').length;
    const fails = total - passes;
    const passRate = total === 0 ? 0 : Math.round((passes / total) * 100);

    return { total, passes, fails, passRate };
  }, [attempts]);

  const clearSession = useCallback((drillId: string) => {
    setAttempts((prev) => {
      const next = { ...prev };
      delete next[drillId];
      return next;
    });
  }, []);

  return (
    <SessionContext.Provider value={{ 
      attempts, 
      calibration, 
      lifetimeStats,
      logAttempt, 
      getSessionStats, 
      setCalibration,
      clearSession,
      refreshLifetimeStats
    }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionStore = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessionStore must be used within a SessionProvider');
  }
  return context;
};

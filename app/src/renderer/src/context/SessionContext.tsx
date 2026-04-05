import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

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

interface SessionContextType {
  attempts: Record<string, Attempt[]>;
  logAttempt: (drillId: string, outcome: Outcome) => void;
  getSessionStats: (drillId: string) => SessionStats;
  clearSession: (drillId: string) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [attempts, setAttempts] = useState<Record<string, Attempt[]>>({});

  const logAttempt = useCallback((drillId: string, outcome: Outcome) => {
    setAttempts((prev) => {
      const drillAttempts = prev[drillId] || [];
      return {
        ...prev,
        [drillId]: [...drillAttempts, { timestamp: Date.now(), outcome }],
      };
    });
    
    // Trigger IPC feedback for the projector window
    if (window.api?.sendAttemptFeedback) {
      window.api.sendAttemptFeedback(outcome);
    }
  }, []);

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
    <SessionContext.Provider value={{ attempts, logAttempt, getSessionStats, clearSession }}>
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

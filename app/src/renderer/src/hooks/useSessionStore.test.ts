import { describe, it, expect } from 'vitest';

// Pure logic for testing pass-rate math
function calculateStats(drillAttempts: { outcome: 'pass' | 'fail' }[]) {
  const total = drillAttempts.length;
  const passes = drillAttempts.filter((a) => a.outcome === 'pass').length;
  const fails = total - passes;
  const passRate = total === 0 ? 0 : Math.round((passes / total) * 100);

  return { total, passes, fails, passRate };
}

describe('Session Stats Math', () => {
  it('handles zero attempts correctly (no NaN/Infinity)', () => {
    const stats = calculateStats([]);
    expect(stats.total).toBe(0);
    expect(stats.passRate).toBe(0);
  });

  it('calculates 100% pass rate correctly', () => {
    const stats = calculateStats([{ outcome: 'pass' }, { outcome: 'pass' }]);
    expect(stats.total).toBe(2);
    expect(stats.passRate).toBe(100);
  });

  it('calculates 0% pass rate correctly', () => {
    const stats = calculateStats([{ outcome: 'fail' }]);
    expect(stats.total).toBe(1);
    expect(stats.passRate).toBe(0);
  });

  it('calculates 50% pass rate correctly', () => {
    const stats = calculateStats([{ outcome: 'pass' }, { outcome: 'fail' }]);
    expect(stats.total).toBe(2);
    expect(stats.passRate).toBe(50);
  });

  it('rounds pass rate to nearest integer', () => {
    const stats = calculateStats([
      { outcome: 'pass' }, 
      { outcome: 'fail' }, 
      { outcome: 'fail' }
    ]);
    // 1/3 = 33.33% -> 33
    expect(stats.total).toBe(3);
    expect(stats.passRate).toBe(33);
  });
});

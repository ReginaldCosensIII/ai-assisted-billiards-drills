import { describe, it, expect } from 'vitest';
import { buildApp } from '../app.js';

describe('GET /api/drills', () => {
  it('should return valid drills mapped to DrillSchema', async () => {
    const app = buildApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/drills'
    });

    expect(response.statusCode).toBe(200);
    const data = response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0].title).toBe("Basic Cut Shot");
    expect(data[0].category).toBe("cut_shot");
  });
});

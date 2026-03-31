import { expect, test } from 'vitest';
import { DrillSchema } from './DrillSchema';

test('validates a correct drill schema', () => {
  const validDrill = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Basic Draw Shot',
    category: 'position_play',
    difficulty: 2,
    table_compatibility: ['9ft'],
    version: '1.0.0',
    author_id: 'system',
    success_criteria: 'Stop the cue ball within the target zone',
    coaching_notes: ['Keep your cue level', 'Follow through smoothly'],
    layout: {
      cue_ball: { x: 0.5, y: 0.25 },
      object_balls: [
        { id: 'ob1', number: 1, position: { x: 0.5, y: 0.75 } }
      ]
    }
  };

  const result = DrillSchema.safeParse(validDrill);
  expect(result.success).toBe(true);
});

test('rejects normalized coordinates out of bounds', () => {
    const invalidDrill = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Basic Draw Shot',
    category: 'position_play',
    difficulty: 2,
    table_compatibility: ['9ft'],
    version: '1.0.0',
    author_id: 'system',
    success_criteria: 'Stop the cue ball within the target zone',
    coaching_notes: ['Keep your cue level', 'Follow through smoothly'],
    layout: {
      cue_ball: { x: 1.5, y: 0.25 }, // INVALID X coordinate (> 1.0)
      object_balls: []
    }
  };

  const result = DrillSchema.safeParse(invalidDrill);
  expect(result.success).toBe(false);
});

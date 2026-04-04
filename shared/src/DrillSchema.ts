import { z } from 'zod';

export const NormalizedCoordinateSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
});

export const ObjectBallSchema = z.object({
  id: z.string(),
  number: z.number().optional(),
  position: NormalizedCoordinateSchema,
});

export const DrillLayoutSchema = z.object({
  cue_ball: NormalizedCoordinateSchema,
  object_balls: z.array(ObjectBallSchema),
  target_zones: z.array(z.any()).optional(), // Flexible mapping for early V1 layout
  obstacles: z.array(ObjectBallSchema).optional(),
});

export const DrillSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  category: z.enum(['cut_shot', 'position_play', 'safety', 'bank', 'break']),
  difficulty: z.number().int().min(1).max(5),
  table_compatibility: z.array(z.string()).min(1),
  layout: DrillLayoutSchema,
  success_criteria: z.union([z.string(), z.record(z.string(), z.any())]),
  coaching_notes: z.array(z.string()),
  version: z.string(),
  author_id: z.string(),
  
  // Optional V1 Fields
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  instructions: z.string().optional(),
  common_mistakes: z.array(z.string()).optional(),
  demo_media_refs: z.array(z.string()).optional(),
});

export type Drill = z.infer<typeof DrillSchema>;
export type DrillLayout = z.infer<typeof DrillLayoutSchema>;
export type NormalizedCoordinate = z.infer<typeof NormalizedCoordinateSchema>;

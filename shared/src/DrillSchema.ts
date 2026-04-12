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

export const TargetZoneSchema = z.object({
  id: z.string(),
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  radius: z.number().min(0.01).max(1),
});

export const DrillLayoutSchema = z.object({
  cue_ball: NormalizedCoordinateSchema,
  object_balls: z.array(ObjectBallSchema),
  target_zones: z.array(TargetZoneSchema).optional(),
  obstacles: z.array(ObjectBallSchema).optional(),
});

export const SpinSchema = z.object({
  vertical: z.number().min(-1.0).max(1.0),
  horizontal: z.number().min(-1.0).max(1.0),
});

export const ExecutionSchema = z.object({
  speed: z.number().min(1).max(10),
  spin: SpinSchema,
  elevation: z.number().min(0).max(90),
});

export const DrillSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  category: z.enum(['cut_shot', 'position_play', 'safety', 'bank', 'break']),
  difficulty: z.number().int().min(1).max(5),
  table_compatibility: z.array(z.string()).min(1),
  layout: DrillLayoutSchema,
  execution: ExecutionSchema.optional(),
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

export const Point2DSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const CalibrationCornersSchema = z.object({
  topLeft: Point2DSchema,
  topRight: Point2DSchema,
  bottomRight: Point2DSchema,
  bottomLeft: Point2DSchema,
});

export type Point2D = z.infer<typeof Point2DSchema>;
export type CalibrationCorners = z.infer<typeof CalibrationCornersSchema>;

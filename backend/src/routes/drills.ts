import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { Drill, DrillSchema } from '@billiards/shared';
import crypto from 'node:crypto';

export async function drillsRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.get('/api/drills', {
    schema: {
      response: {
        200: z.array(DrillSchema)
      }
    }
  }, async (request, reply) => {
    const drill1: Drill = {
      id: crypto.randomUUID(),
      title: "Basic Cut Shot",
      category: "cut_shot",
      difficulty: 1,
      table_compatibility: ["9ft"],
      layout: {
        cue_ball: { x: 0.5, y: 0.5 },
        object_balls: [
          { id: "ball-1", number: 1, position: { x: 0.5, y: 0.25 } }
        ]
      },
      success_criteria: "Make the shot",
      coaching_notes: ["Keep head down"],
      version: "1.0",
      author_id: crypto.randomUUID()
    };

    const drill2: Drill = {
      id: crypto.randomUUID(),
      title: "Straight In",
      category: "position_play",
      difficulty: 1,
      table_compatibility: ["9ft"],
      layout: {
        cue_ball: { x: 0.5, y: 0.75 },
        object_balls: [
          { id: "ball-2", number: 2, position: { x: 0.5, y: 0.1 } }
        ]
      },
      success_criteria: "Don't scratch",
      coaching_notes: ["Perfect center ball hit"],
      version: "1.0",
      author_id: crypto.randomUUID()
    };

    const drill3: Drill = {
      id: crypto.randomUUID(),
      title: "Safety Practice",
      category: "safety",
      difficulty: 2,
      table_compatibility: ["9ft"],
      layout: {
        cue_ball: { x: 0.2, y: 0.8 },
        object_balls: [
          { id: "ball-3", number: 9, position: { x: 0.8, y: 0.2 } }
        ]
      },
      success_criteria: "Hide the cue ball",
      coaching_notes: ["Control the speed"],
      version: "1.0",
      author_id: crypto.randomUUID()
    };
    
    return [drill1, drill2, drill3];
  });
}

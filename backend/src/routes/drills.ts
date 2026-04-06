import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { Drill, DrillSchema } from '@billiards/shared';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function drillsRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  // Fetch all drills from the database
  app.get('/api/drills', {
    schema: {
      response: {
        200: z.array(DrillSchema)
      }
    }
  }, async (request, reply) => {
    const dbDrills = await prisma.drill.findMany();

    // Map Prisma objects into the strict @billiards/shared schema
    const mapped: Drill[] = dbDrills.map((d: any) => ({
      id: d.id,
      title: d.title,
      category: d.category,
      difficulty: d.difficulty,
      table_compatibility: d.table_compatibility,
      layout: d.layout_data,
      success_criteria: d.success_criteria,
      coaching_notes: d.coaching_notes,
      version: d.version,
      author_id: d.author_id
    }));

    return mapped;
  });

  // Create a new drill
  app.post('/api/drills', {
    schema: {
      body: DrillSchema.omit({ id: true }),
      response: {
        201: DrillSchema
      }
    }
  }, async (request, reply) => {
    const { body } = request;

    const newDrill = await prisma.drill.create({
      data: {
        title: body.title,
        category: body.category,
        difficulty: body.difficulty,
        table_compatibility: body.table_compatibility,
        layout_data: body.layout as any,
        success_criteria: body.success_criteria as any,
        coaching_notes: body.coaching_notes as any,
        version: body.version,
        author_id: body.author_id,
      }
    });

    const mapped: Drill = {
      id: newDrill.id,
      title: newDrill.title,
      category: newDrill.category as any,
      difficulty: newDrill.difficulty,
      table_compatibility: newDrill.table_compatibility as any,
      layout: newDrill.layout_data as any,
      success_criteria: newDrill.success_criteria as any,
      coaching_notes: newDrill.coaching_notes as any,
      version: newDrill.version,
      author_id: newDrill.author_id
    };

    reply.code(201);
    return mapped;
  });

  // Log an attempt outcome
  app.post('/api/attempts', {
    schema: {
      body: z.object({
        drillId: z.string().uuid(),
        outcome: z.enum(['pass', 'fail'])
      }),
      response: {
        201: z.object({
          id: z.string(),
          drillId: z.string(),
          outcome: z.string(),
          createdAt: z.string()
        })
      }
    }
  }, async (request, reply) => {
    const { drillId, outcome } = request.body;

    const attempt = await prisma.attempt.create({
      data: {
        drillId,
        outcome
      }
    });

    reply.code(201);
    return {
      ...attempt,
      createdAt: attempt.createdAt.toISOString()
    };
  });
}

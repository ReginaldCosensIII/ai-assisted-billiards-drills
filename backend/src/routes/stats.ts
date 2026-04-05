import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DrillStatSchema = z.object({
  drillId: z.string(),
  drillTitle: z.string(),
  totalAttempts: z.number(),
  passRate: z.number(),
});

const StatsResponseSchema = z.object({
  totalDrillsPlayed: z.number(),
  totalAttempts: z.number(),
  overallAccuracy: z.number(),
  performanceByDrill: z.array(DrillStatSchema),
});

export async function statsRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  // Fetch performance stats
  app.get('/api/stats', {
    schema: {
      response: {
        200: StatsResponseSchema
      }
    }
  }, async (request, reply) => {
    // Get all attempts grouped by drillId and outcome
    const groupings = await prisma.attempt.groupBy({
      by: ['drillId', 'outcome'],
      _count: {
        _all: true,
      },
    });

    // We also need drill titles, let's fetch all drills
    const drills = await prisma.drill.findMany({
      select: { id: true, title: true }
    });
    const drillMap = new Map<string, string>();
    drills.forEach(d => drillMap.set(d.id, d.title));

    let totalAttempts = 0;
    let totalPasses = 0;
    const drillStatsMap = new Map<string, { pass: number, total: number }>();

    for (const group of groupings) {
      const { drillId, outcome, _count } = group;
      totalAttempts += _count._all;
      if (outcome === 'pass') {
        totalPasses += _count._all;
      }

      if (!drillStatsMap.has(drillId)) {
        drillStatsMap.set(drillId, { pass: 0, total: 0 });
      }
      const drillStat = drillStatsMap.get(drillId)!;
      drillStat.total += _count._all;
      if (outcome === 'pass') {
        drillStat.pass += _count._all;
      }
    }

    const performanceByDrill = Array.from(drillStatsMap.entries()).map(([drillId, stats]) => {
      const passRate = stats.total > 0 ? (stats.pass / stats.total) * 100 : 0;
      return {
        drillId,
        drillTitle: drillMap.get(drillId) || 'Unknown Drill',
        totalAttempts: stats.total,
        passRate,
      };
    }).sort((a, b) => b.totalAttempts - a.totalAttempts); // sort by most attempts first

    const overallAccuracy = totalAttempts > 0 ? (totalPasses / totalAttempts) * 100 : 0;
    const totalDrillsPlayed = drillStatsMap.size;

    return {
      totalDrillsPlayed,
      totalAttempts,
      overallAccuracy,
      performanceByDrill,
    };
  });
}

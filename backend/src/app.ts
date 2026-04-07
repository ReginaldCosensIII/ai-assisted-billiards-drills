import Fastify from 'fastify';
import cors from '@fastify/cors';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { drillsRoutes } from './routes/drills.js';
import { statsRoutes } from './routes/stats.js';
import { aiRoutes } from './routes/ai.js';

export function buildApp() {
  const app = Fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();

  // Register CORS to allow dev server access
  app.register(cors, {
    origin: true // In development, allowing true mirrors the Origin header
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(drillsRoutes);
  app.register(statsRoutes);
  app.register(aiRoutes);

  // Home route for basic health check
  app.get('/', async () => {
    return { status: 'ok', service: 'billiards-backend-api' };
  });

  return app;
}

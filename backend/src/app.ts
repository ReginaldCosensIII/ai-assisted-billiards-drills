import Fastify from 'fastify';
import cors from '@fastify/cors';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { drillsRoutes } from './routes/drills.js';

export function buildApp() {
  const app = Fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();

  // Register CORS to allow dev server access
  app.register(cors, {
    origin: true // In development, allowing true mirrors the Origin header
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(drillsRoutes);

  return app;
}

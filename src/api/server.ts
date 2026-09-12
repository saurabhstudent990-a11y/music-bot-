import Fastify, { FastifyInstance } from 'fastify';
import { config } from '../config/env';
import { logger } from '../logging/logger';
import { checkDatabaseHealth } from '../database/prisma';
import { checkRedisHealth } from '../redis/client';

export function createApiServer(): FastifyInstance {
  const server = Fastify({
    logger: false, // Using our shared pino logger
  });

  const startTime = Date.now();

  // Full Health Check Endpoint
  server.get('/health', async (request, reply) => {
    const [dbHealth, redisHealth] = await Promise.all([
      checkDatabaseHealth(),
      checkRedisHealth(),
    ]);

    const memoryUsage = process.memoryUsage();
    const isHealthy = dbHealth.status !== 'error';

    const response = {
      status: isHealthy ? 'ok' : 'degraded',
      service: 'sauraxt-music',
      version: '1.0.0',
      uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
      timestamp: new Date().toISOString(),
      components: {
        database: dbHealth,
        redis: redisHealth,
        memory: {
          rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
          heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        },
      },
    };

    return reply.status(isHealthy ? 200 : 503).send(response);
  });

  // Kubernetes Liveness Probe
  server.get('/health/live', async (_request, reply) => {
    return reply.status(200).send({ status: 'alive' });
  });

  // Kubernetes Readiness Probe
  server.get('/health/ready', async (_request, reply) => {
    return reply.status(200).send({ status: 'ready' });
  });

  return server;
}

export async function startApiServer(port = config.API_PORT, host = config.API_HOST): Promise<FastifyInstance> {
  const server = createApiServer();
  try {
    await server.listen({ port, host });
    logger.info({ port, host }, `REST API server listening on http://${host}:${port}`);
    return server;
  } catch (err) {
    logger.error({ err }, 'Failed to start REST API server');
    throw err;
  }
}

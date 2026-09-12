import { PrismaClient } from '@prisma/client';
import { config } from '../config/env';
import { logger } from '../logging/logger';

let prismaInstance: PrismaClient | null = null;
let isConnected = false;

export function getPrismaClient(): PrismaClient | null {
  if (!config.DATABASE_URL) {
    return null;
  }

  if (!prismaInstance) {
    try {
      prismaInstance = new PrismaClient({
        log: config.LOG_LEVEL === 'debug' ? ['query', 'error', 'warn'] : ['error'],
      });
    } catch (err) {
      logger.warn({ err }, 'Failed to instantiate Prisma client');
      return null;
    }
  }

  return prismaInstance;
}

export async function checkDatabaseHealth(): Promise<{ status: 'ok' | 'disabled' | 'error'; latencyMs?: number }> {
  if (!config.DATABASE_URL) {
    return { status: 'disabled' };
  }

  const client = getPrismaClient();
  if (!client) {
    return { status: 'error' };
  }

  const start = Date.now();
  try {
    await client.$queryRaw`SELECT 1`;
    isConnected = true;
    return { status: 'ok', latencyMs: Date.now() - start };
  } catch (error) {
    isConnected = false;
    logger.error({ error }, 'Database health check failed');
    return { status: 'error' };
  }
}

export const prisma = getPrismaClient();

import Redis from 'ioredis';
import { config } from '../config/env';
import { logger } from '../logging/logger';

let redisInstance: Redis | null = null;
let isRedisConnected = false;

// Fallback in-memory store when Redis is not configured
class InMemoryCache {
  private store = new Map<string, { value: string; expiresAt?: number }>();

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, mode?: string, duration?: number): Promise<'OK'> {
    let expiresAt: number | undefined;
    if (mode === 'PX' && duration) {
      expiresAt = Date.now() + duration;
    } else if (mode === 'EX' && duration) {
      expiresAt = Date.now() + duration * 1000;
    }
    this.store.set(key, { value, expiresAt });
    return 'OK';
  }

  async del(key: string): Promise<number> {
    const existed = this.store.delete(key);
    return existed ? 1 : 0;
  }
}

export const inMemoryFallback = new InMemoryCache();

export function getRedisClient(): Redis | null {
  if (!config.REDIS_URL) {
    return null;
  }

  if (!redisInstance) {
    try {
      redisInstance = new Redis(config.REDIS_URL, {
        lazyConnect: true,
        maxRetriesPerRequest: 2,
        retryStrategy(times) {
          if (times > 3) return null;
          return Math.min(times * 100, 1000);
        },
      });

      redisInstance.on('connect', () => {
        isRedisConnected = true;
        logger.info('Connected to Redis');
      });

      redisInstance.on('error', (err) => {
        isRedisConnected = false;
        logger.warn({ err: err.message }, 'Redis connection issue, using fallback');
      });
    } catch (error) {
      logger.warn({ error }, 'Failed to initialize Redis client');
      return null;
    }
  }

  return redisInstance;
}

export async function checkRedisHealth(): Promise<{ status: 'ok' | 'disabled' | 'fallback' | 'error'; latencyMs?: number }> {
  if (!config.REDIS_URL) {
    return { status: 'fallback' };
  }

  const client = getRedisClient();
  if (!client) {
    return { status: 'fallback' };
  }

  const start = Date.now();
  try {
    const pong = await client.ping();
    if (pong === 'PONG') {
      return { status: 'ok', latencyMs: Date.now() - start };
    }
    return { status: 'fallback' };
  } catch {
    return { status: 'fallback' };
  }
}

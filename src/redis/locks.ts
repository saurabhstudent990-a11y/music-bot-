import { getRedisClient, inMemoryFallback } from './client';
import { logger } from '../logging/logger';

export class DistributedLockManager {
  private static lockPrefix = 'music:guild:';

  /**
   * Attempts to acquire a distributed lock for a guild session.
   * Prevents multiple bot instances or workers from simultaneously running competing players in the same guild.
   */
  static async acquireSessionLock(guildId: string, workerId: string, ttlMs: number = 30000): Promise<boolean> {
    const key = `${this.lockPrefix}${guildId}`;
    const redis = getRedisClient();

    if (redis) {
      try {
        const result = await redis.set(key, workerId, 'PX', ttlMs, 'NX');
        return result === 'OK';
      } catch (err) {
        logger.warn({ err, guildId }, 'Redis lock acquisition failed, falling back to memory');
      }
    }

    // In-memory fallback
    const existing = await inMemoryFallback.get(key);
    if (existing && existing !== workerId) {
      return false;
    }

    await inMemoryFallback.set(key, workerId, 'PX', ttlMs);
    return true;
  }

  /**
   * Releases a session lock if held by the given worker.
   */
  static async releaseSessionLock(guildId: string, workerId: string): Promise<boolean> {
    const key = `${this.lockPrefix}${guildId}`;
    const redis = getRedisClient();

    if (redis) {
      try {
        // Lua script to safely release only if value matches workerId
        const script = `
          if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("del", KEYS[1])
          else
            return 0
          end
        `;
        const result = await redis.eval(script, 1, key, workerId);
        return result === 1;
      } catch (err) {
        logger.warn({ err, guildId }, 'Redis lock release error, using memory fallback');
      }
    }

    const current = await inMemoryFallback.get(key);
    if (current === workerId) {
      await inMemoryFallback.del(key);
      return true;
    }
    return false;
  }
}

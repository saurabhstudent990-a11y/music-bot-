import { describe, it, expect } from 'vitest';
import { DistributedLockManager } from '../../src/redis/locks';

describe('Distributed Session Locking', () => {
  const guildId = 'test-guild-123';
  const worker1 = 'worker-alpha';
  const worker2 = 'worker-beta';

  it('allows worker1 to acquire session lock', async () => {
    const acquired = await DistributedLockManager.acquireSessionLock(guildId, worker1, 5000);
    expect(acquired).toBe(true);
  });

  it('rejects competing worker2 from claiming the same guild session lock', async () => {
    const acquired = await DistributedLockManager.acquireSessionLock(guildId, worker2, 5000);
    expect(acquired).toBe(false);
  });

  it('allows worker1 to release the lock', async () => {
    const released = await DistributedLockManager.releaseSessionLock(guildId, worker1);
    expect(released).toBe(true);
  });

  it('allows worker2 to claim the lock after release', async () => {
    const acquired = await DistributedLockManager.acquireSessionLock(guildId, worker2, 5000);
    expect(acquired).toBe(true);
    await DistributedLockManager.releaseSessionLock(guildId, worker2);
  });
});

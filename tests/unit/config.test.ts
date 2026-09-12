import { describe, it, expect } from 'vitest';
import { config, getParsedLavalinkNodes } from '../../src/config/env';

describe('Environment Configuration', () => {
  it('should load default configuration values safely', () => {
    expect(config.PREFIX).toBe('xt');
    expect(config.BOT_TOKEN).toBeDefined();
    expect(config.BOT_TOKEN.length).toBeGreaterThan(10);
    expect(config.CLIENT_ID).toBe('1058387897352470609');
    expect(config.API_PORT).toBe(3001);
  });

  it('should parse lavalink nodes correctly', () => {
    const nodes = getParsedLavalinkNodes(config);
    expect(Array.isArray(nodes)).toBe(true);
    expect(nodes.length).toBeGreaterThanOrEqual(1);

    const firstNode = nodes[0];
    expect(firstNode.name).toBe('Node-1');
    expect(typeof firstNode.host).toBe('string');
    expect(typeof firstNode.port).toBe('number');
    expect(typeof firstNode.secure).toBe('boolean');
  });
});

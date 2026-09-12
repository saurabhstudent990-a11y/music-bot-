import { describe, it, expect } from 'vitest';
import { createApiServer } from '../../src/api/server';

describe('Fastify REST API Health Checks', () => {
  const server = createApiServer();

  it('GET /health/live returns alive status', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/health/live',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.status).toBe('alive');
  });

  it('GET /health/ready returns ready status', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/health/ready',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.status).toBe('ready');
  });

  it('GET /health returns comprehensive status object', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.service).toBe('sauraxt-music');
    expect(body.components).toBeDefined();
    expect(body.components.memory).toBeDefined();
    expect(body.components.database).toBeDefined();
    expect(body.components.redis).toBeDefined();
  });
});

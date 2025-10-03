// apps/backend/src/routes/health.ts
import { FastifyInstance } from 'fastify';
import mongoose from 'mongoose';
import fetch from 'node-fetch';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async () => {
    // DB check
    const dbStatus = mongoose.connection.readyState === 1 ? 'ok' : 'down';

    // ML check (assuming ml_service runs on port 8000)
    let mlStatus = 'down';
    try {
      const res = await fetch('http://ml_service:8000/health');
      if (res.ok) mlStatus = 'ok';
    } catch (err) {}

    return {
      api: 'ok',
      db: dbStatus,
      ml: mlStatus,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  });
}
import { defineEventHandler } from 'h3';

/**
 * GET /api/health
 * Health check endpoint for uptime monitoring
 */
export default defineEventHandler(async (event) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
});

/**
 * GET /.well-known/performance
 * Performance metrics
 */
export const getPerformanceMetrics = defineEventHandler(async (event) => {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const memory = process.memoryUsage();
    return {
      memory: {
        heapUsed: Math.round(memory.heapUsed / 1024 / 1024) + 'MB',
        heapTotal: Math.round(memory.heapTotal / 1024 / 1024) + 'MB',
        external: Math.round(memory.external / 1024 / 1024) + 'MB',
      },
      uptime: process.uptime(),
    };
  }
  return { status: 'ok' };
});

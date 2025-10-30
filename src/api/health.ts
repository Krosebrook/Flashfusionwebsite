/**
 * @fileoverview Simple health check endpoint for monitoring
 * @module api/health
 */

/**
 * Health check request handler
 * Returns the current status and environment information
 * @param {any} req - HTTP request object
 * @param {any} res - HTTP response object
 * @returns {void} Responds with JSON containing status, timestamp, and environment
 * @example
 * // GET /api/health
 * // Response: { status: 'ok', timestamp: '2025-10-30T15:00:00.000Z', environment: 'development' }
 */
export default function handler(req: any, res: any) {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: 'development'
  });
}
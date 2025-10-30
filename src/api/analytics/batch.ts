/**
 * @fileoverview Batch analytics endpoint for processing multiple events
 * @module api/analytics/batch
 */

import { isDevelopmentMode } from '../../utils/environment';

/**
 * Batch analytics event processing request handler
 * Processes multiple analytics events in a single request
 * Validates event array and logs in development mode
 * Handles CORS for development environments
 * @param {any} req - HTTP request object with events array in body
 * @param {any} res - HTTP response object
 * @returns {void} Responds with success status and count of processed events
 * @example
 * // POST /api/analytics/batch
 * // Body: { events: [{ event: 'page_view', properties: {...} }, { event: 'click', properties: {...} }] }
 * // Response: { success: true, processed: 2, message: 'Batch processed successfully' }
 */
export default function handler(req: any, res: any) {
  // Handle CORS for development
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { events } = req.body;
    
    if (!Array.isArray(events)) {
      return res.status(400).json({ error: 'Events must be an array' });
    }

    // Only log in development to avoid spam
    if (isDevelopmentMode()) {
      console.debug(`Analytics batch received: ${events.length} events`);
      events.forEach((event, index) => {
        console.debug(`  ${index + 1}. ${event.event}:`, event.properties);
      });
    }
    
    // Return success
    res.status(200).json({ 
      success: true, 
      processed: events.length,
      message: 'Batch processed successfully'
    });
  } catch (error) {
    console.error('Analytics batch endpoint error:', error);
    res.status(500).json({ error: 'Failed to process analytics batch' });
  }
}
// Simple fallback analytics endpoint for development
import { isDevelopmentMode } from '../../utils/environment';

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
    const event = req.body;
    
    // Only log in development to avoid spam
    if (isDevelopmentMode()) {
      console.debug('Analytics event received:', event.event, event.properties);
    }
    
    // Return success
    res.status(200).json({ 
      success: true, 
      eventId: `${isDevelopmentMode() ? 'dev' : 'prod'}_${Date.now()}`,
      message: 'Event processed successfully'
    });
  } catch (error) {
    console.error('Analytics endpoint error:', error);
    res.status(500).json({ error: 'Failed to process analytics event' });
  }
}
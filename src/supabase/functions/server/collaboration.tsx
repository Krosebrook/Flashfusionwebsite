import { Hono } from 'npm:hono';
import { createClient } from 'npm:@supabase/supabase-js@2';

const collaborationApp = new Hono();

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase configuration');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Types for collaboration
interface CollaborationSession {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  participants: string[];
  createdBy: string;
  createdAt: string;
  lastActivity: string;
  status: 'active' | 'paused' | 'ended';
}

interface CollaborationEvent {
  type: 'cursor_move' | 'text_change' | 'user_join' | 'user_leave' | 'chat_message';
  sessionId: string;
  userId: string;
  timestamp: string;
  data: any;
}

interface ChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
}

// Create collaboration session
collaborationApp.post('/make-server-88829a40/collaboration/sessions', async (c) => {
  try {
    const { projectId, title, description, userId } = await c.req.json();

    if (!projectId || !title || !userId) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const sessionId = crypto.randomUUID();
    const now = new Date().toISOString();

    const session: CollaborationSession = {
      id: sessionId,
      projectId,
      title,
      description,
      participants: [userId],
      createdBy: userId,
      createdAt: now,
      lastActivity: now,
      status: 'active'
    };

    // Store session in database
    const { error } = await supabase
      .from('collaboration_sessions')
      .insert(session);

    if (error) {
      throw error;
    }

    // Initialize session data
    await supabase
      .from('collaboration_data')
      .insert({
        session_id: sessionId,
        content: '',
        last_modified: now,
        version: 1
      });

    return c.json({ session });

  } catch (error) {
    console.error('Create session error:', error);
    return c.json({
      error: 'Failed to create collaboration session',
      message: error.message
    }, 500);
  }
});

// Get collaboration sessions
collaborationApp.get('/make-server-88829a40/collaboration/sessions', async (c) => {
  try {
    const userId = c.req.query('userId');
    
    if (!userId) {
      return c.json({ error: 'User ID required' }, 400);
    }

    const { data: sessions, error } = await supabase
      .from('collaboration_sessions')
      .select('*')
      .contains('participants', [userId])
      .order('last_activity', { ascending: false });

    if (error) {
      throw error;
    }

    return c.json({ sessions: sessions || [] });

  } catch (error) {
    console.error('Get sessions error:', error);
    return c.json({
      error: 'Failed to fetch collaboration sessions',
      message: error.message
    }, 500);
  }
});

// Join collaboration session
collaborationApp.post('/make-server-88829a40/collaboration/sessions/:sessionId/join', async (c) => {
  try {
    const sessionId = c.req.param('sessionId');
    const { userId, username } = await c.req.json();

    if (!userId || !username) {
      return c.json({ error: 'User ID and username required' }, 400);
    }

    // Get current session
    const { data: session, error: sessionError } = await supabase
      .from('collaboration_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return c.json({ error: 'Session not found' }, 404);
    }

    // Add user to participants if not already there
    const participants = session.participants || [];
    if (!participants.includes(userId)) {
      participants.push(userId);

      const { error: updateError } = await supabase
        .from('collaboration_sessions')
        .update({
          participants,
          last_activity: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (updateError) {
        throw updateError;
      }
    }

    // Record join event
    await supabase
      .from('collaboration_events')
      .insert({
        type: 'user_join',
        session_id: sessionId,
        user_id: userId,
        username,
        timestamp: new Date().toISOString(),
        data: { username }
      });

    // Get session data
    const { data: sessionData } = await supabase
      .from('collaboration_data')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    return c.json({
      session,
      sessionData: sessionData || { content: '', version: 1 },
      participants
    });

  } catch (error) {
    console.error('Join session error:', error);
    return c.json({
      error: 'Failed to join collaboration session',
      message: error.message
    }, 500);
  }
});

// Leave collaboration session
collaborationApp.post('/make-server-88829a40/collaboration/sessions/:sessionId/leave', async (c) => {
  try {
    const sessionId = c.req.param('sessionId');
    const { userId, username } = await c.req.json();

    if (!userId) {
      return c.json({ error: 'User ID required' }, 400);
    }

    // Get current session
    const { data: session, error: sessionError } = await supabase
      .from('collaboration_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return c.json({ error: 'Session not found' }, 404);
    }

    // Remove user from participants
    const participants = (session.participants || []).filter(id => id !== userId);

    const { error: updateError } = await supabase
      .from('collaboration_sessions')
      .update({
        participants,
        last_activity: new Date().toISOString(),
        status: participants.length === 0 ? 'ended' : session.status
      })
      .eq('id', sessionId);

    if (updateError) {
      throw updateError;
    }

    // Record leave event
    await supabase
      .from('collaboration_events')
      .insert({
        type: 'user_leave',
        session_id: sessionId,
        user_id: userId,
        username: username || 'Unknown',
        timestamp: new Date().toISOString(),
        data: { username }
      });

    return c.json({ success: true, participants });

  } catch (error) {
    console.error('Leave session error:', error);
    return c.json({
      error: 'Failed to leave collaboration session',
      message: error.message
    }, 500);
  }
});

// Update collaboration content
collaborationApp.post('/make-server-88829a40/collaboration/sessions/:sessionId/content', async (c) => {
  try {
    const sessionId = c.req.param('sessionId');
    const { content, userId, username, operation } = await c.req.json();

    if (!content && !operation) {
      return c.json({ error: 'Content or operation required' }, 400);
    }

    // Get current data
    const { data: currentData, error: fetchError } = await supabase
      .from('collaboration_data')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // Not found is ok for new sessions
      throw fetchError;
    }

    const newVersion = (currentData?.version || 0) + 1;
    const now = new Date().toISOString();

    // Update content
    const { error: updateError } = await supabase
      .from('collaboration_data')
      .upsert({
        session_id: sessionId,
        content: content || currentData?.content || '',
        last_modified: now,
        version: newVersion,
        last_modified_by: userId
      });

    if (updateError) {
      throw updateError;
    }

    // Record change event
    await supabase
      .from('collaboration_events')
      .insert({
        type: 'text_change',
        session_id: sessionId,
        user_id: userId,
        username: username || 'Unknown',
        timestamp: now,
        data: {
          operation: operation || 'full_update',
          contentLength: content?.length || 0,
          version: newVersion
        }
      });

    // Update session last activity
    await supabase
      .from('collaboration_sessions')
      .update({ last_activity: now })
      .eq('id', sessionId);

    return c.json({
      success: true,
      version: newVersion,
      timestamp: now
    });

  } catch (error) {
    console.error('Update content error:', error);
    return c.json({
      error: 'Failed to update collaboration content',
      message: error.message
    }, 500);
  }
});

// Send chat message
collaborationApp.post('/make-server-88829a40/collaboration/sessions/:sessionId/chat', async (c) => {
  try {
    const sessionId = c.req.param('sessionId');
    const { message, userId, username } = await c.req.json();

    if (!message || !userId || !username) {
      return c.json({ error: 'Message, user ID, and username required' }, 400);
    }

    const messageId = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    // Store chat message
    const chatMessage: ChatMessage = {
      id: messageId,
      sessionId,
      userId,
      username,
      message,
      timestamp
    };

    const { error } = await supabase
      .from('collaboration_chat')
      .insert(chatMessage);

    if (error) {
      throw error;
    }

    // Record chat event
    await supabase
      .from('collaboration_events')
      .insert({
        type: 'chat_message',
        session_id: sessionId,
        user_id: userId,
        username,
        timestamp,
        data: { message }
      });

    return c.json({ chatMessage });

  } catch (error) {
    console.error('Send chat message error:', error);
    return c.json({
      error: 'Failed to send chat message',
      message: error.message
    }, 500);
  }
});

// Get chat messages
collaborationApp.get('/make-server-88829a40/collaboration/sessions/:sessionId/chat', async (c) => {
  try {
    const sessionId = c.req.param('sessionId');
    const limit = parseInt(c.req.query('limit') || '50');

    const { data: messages, error } = await supabase
      .from('collaboration_chat')
      .select('*')
      .eq('sessionId', sessionId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return c.json({ messages: (messages || []).reverse() });

  } catch (error) {
    console.error('Get chat messages error:', error);
    return c.json({
      error: 'Failed to fetch chat messages',
      message: error.message
    }, 500);
  }
});

// Get collaboration analytics
collaborationApp.get('/make-server-88829a40/collaboration/analytics', async (c) => {
  try {
    const userId = c.req.query('userId');
    
    // Get session stats
    const { data: sessions, error: sessionsError } = await supabase
      .from('collaboration_sessions')
      .select('*')
      .contains('participants', userId ? [userId] : []);

    if (sessionsError) {
      throw sessionsError;
    }

    // Get event stats
    const { data: events, error: eventsError } = await supabase
      .from('collaboration_events')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1000);

    if (eventsError) {
      throw eventsError;
    }

    const analytics = {
      totalSessions: sessions?.length || 0,
      activeSessions: sessions?.filter(s => s.status === 'active').length || 0,
      totalEvents: events?.length || 0,
      eventsByType: events?.reduce((acc, event) => {
        acc[event.type] = (acc[event.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {},
      recentActivity: events?.slice(0, 10) || []
    };

    return c.json({ analytics });

  } catch (error) {
    console.error('Get analytics error:', error);
    return c.json({
      error: 'Failed to fetch collaboration analytics',
      message: error.message
    }, 500);
  }
});

export default collaborationApp;
// Real-time features for FlashFusion
import { createClient } from 'npm:@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Real-time collaboration types
export interface CollaborationMessage {
  type: 'cursor' | 'selection' | 'edit' | 'comment' | 'presence';
  user_id: string;
  user_name: string;
  project_id: string;
  data: any;
  timestamp: string;
}

export interface PresenceData {
  user_id: string;
  user_name: string;
  avatar_url?: string;
  cursor_position?: { x: number; y: number };
  selected_element?: string;
  status: 'active' | 'idle' | 'away';
  last_seen: string;
}

// In-memory store for real-time data
const activeConnections = new Map<string, WebSocket[]>();
const userPresence = new Map<string, Map<string, PresenceData>>();
const projectCollaborations = new Map<string, Set<string>>();

export function handleWebSocketConnection(ws: WebSocket, url: URL) {
  const projectId = url.searchParams.get('project_id');
  const userId = url.searchParams.get('user_id');
  const userToken = url.searchParams.get('token');

  if (!projectId || !userId || !userToken) {
    ws.close(1008, 'Missing required parameters');
    return;
  }

  // Verify user token
  verifyUserToken(userToken, userId).then(isValid => {
    if (!isValid) {
      ws.close(1008, 'Invalid token');
      return;
    }

    // Add connection to project
    if (!activeConnections.has(projectId)) {
      activeConnections.set(projectId, []);
    }
    activeConnections.get(projectId)!.push(ws);

    // Add user to project collaboration
    if (!projectCollaborations.has(projectId)) {
      projectCollaborations.set(projectId, new Set());
    }
    projectCollaborations.get(projectId)!.add(userId);

    // Initialize user presence
    if (!userPresence.has(projectId)) {
      userPresence.set(projectId, new Map());
    }

    const presence: PresenceData = {
      user_id: userId,
      user_name: 'User', // This would be fetched from DB in real implementation
      status: 'active',
      last_seen: new Date().toISOString()
    };

    userPresence.get(projectId)!.set(userId, presence);

    // Broadcast user joined
    broadcastToProject(projectId, {
      type: 'presence',
      user_id: userId,
      user_name: presence.user_name,
      project_id: projectId,
      data: { action: 'joined', presence },
      timestamp: new Date().toISOString()
    }, userId);

    // Send current collaborators to new user
    const currentCollaborators = Array.from(userPresence.get(projectId)!.values());
    ws.send(JSON.stringify({
      type: 'presence_sync',
      collaborators: currentCollaborators
    }));

    // Handle incoming messages
    ws.onmessage = (event) => {
      try {
        const message: CollaborationMessage = JSON.parse(event.data);
        handleCollaborationMessage(message, projectId, userId);
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    // Handle connection close
    ws.onclose = () => {
      handleUserDisconnect(projectId, userId, ws);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      handleUserDisconnect(projectId, userId, ws);
    };

  }).catch(error => {
    console.error('Token verification error:', error);
    ws.close(1008, 'Authentication failed');
  });
}

async function verifyUserToken(token: string, userId: string): Promise<boolean> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    return !error && user?.id === userId;
  } catch {
    return false;
  }
}

function handleCollaborationMessage(message: CollaborationMessage, projectId: string, senderId: string) {
  // Update user presence if applicable
  const projectPresence = userPresence.get(projectId);
  if (projectPresence && projectPresence.has(senderId)) {
    const presence = projectPresence.get(senderId)!;
    
    switch (message.type) {
      case 'cursor':
        presence.cursor_position = message.data.position;
        break;
      case 'selection':
        presence.selected_element = message.data.element_id;
        break;
      case 'presence':
        presence.status = message.data.status || 'active';
        break;
    }
    
    presence.last_seen = new Date().toISOString();
    projectPresence.set(senderId, presence);
  }

  // Store message for persistence if needed
  if (message.type === 'comment' || message.type === 'edit') {
    storeCollaborationMessage(message).catch(console.error);
  }

  // Broadcast message to all other users in the project
  broadcastToProject(projectId, message, senderId);
}

function broadcastToProject(projectId: string, message: CollaborationMessage, excludeUserId?: string) {
  const connections = activeConnections.get(projectId);
  if (!connections) return;

  const messageStr = JSON.stringify(message);
  
  connections.forEach((ws, index) => {
    if (ws.readyState === WebSocket.OPEN) {
      // In a real implementation, you'd track which connection belongs to which user
      // For now, we broadcast to all connections
      try {
        ws.send(messageStr);
      } catch (error) {
        console.error('Broadcast error:', error);
        // Remove dead connection
        connections.splice(index, 1);
      }
    } else {
      // Remove closed connection
      connections.splice(index, 1);
    }
  });
}

function handleUserDisconnect(projectId: string, userId: string, ws: WebSocket) {
  // Remove connection
  const connections = activeConnections.get(projectId);
  if (connections) {
    const index = connections.indexOf(ws);
    if (index > -1) {
      connections.splice(index, 1);
    }
  }

  // Remove from collaboration
  const collaboration = projectCollaborations.get(projectId);
  if (collaboration) {
    collaboration.delete(userId);
  }

  // Update presence
  const projectPresence = userPresence.get(projectId);
  if (projectPresence) {
    projectPresence.delete(userId);
  }

  // Broadcast user left
  broadcastToProject(projectId, {
    type: 'presence',
    user_id: userId,
    user_name: 'User',
    project_id: projectId,
    data: { action: 'left' },
    timestamp: new Date().toISOString()
  });
}

async function storeCollaborationMessage(message: CollaborationMessage) {
  try {
    await supabase
      .from('collaboration_messages')
      .insert([{
        project_id: message.project_id,
        user_id: message.user_id,
        message_type: message.type,
        content: message.data,
        created_at: message.timestamp
      }]);
  } catch (error) {
    console.error('Store collaboration message error:', error);
  }
}

// Notification system
export async function sendRealtimeNotification(userId: string, notification: any) {
  try {
    // Store notification in database
    const { data: notificationRecord } = await supabase
      .from('notifications')
      .insert([{
        user_id: userId,
        title: notification.title,
        message: notification.message,
        type: notification.type || 'info',
        category: notification.category,
        action_url: notification.action_url,
        action_text: notification.action_text,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    // Send real-time notification via Supabase Realtime
    await supabase
      .channel('notifications')
      .send({
        type: 'broadcast',
        event: 'new_notification',
        payload: {
          user_id: userId,
          notification: notificationRecord
        }
      });

    return notificationRecord;
  } catch (error) {
    console.error('Send realtime notification error:', error);
    throw error;
  }
}

// Project activity tracking
export async function trackProjectActivity(projectId: string, userId: string, activity: any) {
  try {
    await supabase
      .from('project_activities')
      .insert([{
        project_id: projectId,
        user_id: userId,
        activity_type: activity.type,
        activity_data: activity.data,
        created_at: new Date().toISOString()
      }]);

    // Broadcast activity to project collaborators
    const message: CollaborationMessage = {
      type: 'activity',
      user_id: userId,
      user_name: activity.user_name || 'User',
      project_id: projectId,
      data: activity,
      timestamp: new Date().toISOString()
    };

    broadcastToProject(projectId, message);
  } catch (error) {
    console.error('Track project activity error:', error);
  }
}

// Live generation updates
export async function broadcastGenerationUpdate(generationId: string, update: any) {
  try {
    const { data: generation } = await supabase
      .from('generations')
      .select('project_id, user_id')
      .eq('id', generationId)
      .single();

    if (!generation) return;

    const message: CollaborationMessage = {
      type: 'generation_update',
      user_id: generation.user_id,
      user_name: 'System',
      project_id: generation.project_id,
      data: {
        generation_id: generationId,
        ...update
      },
      timestamp: new Date().toISOString()
    };

    broadcastToProject(generation.project_id, message);
  } catch (error) {
    console.error('Broadcast generation update error:', error);
  }
}

// System-wide announcements
export async function broadcastSystemAnnouncement(announcement: any) {
  try {
    // Store announcement
    await supabase
      .from('system_announcements')
      .insert([{
        title: announcement.title,
        message: announcement.message,
        type: announcement.type || 'info',
        target_audience: announcement.target_audience || 'all',
        expires_at: announcement.expires_at,
        created_at: new Date().toISOString()
      }]);

    // Broadcast via Supabase Realtime
    await supabase
      .channel('system')
      .send({
        type: 'broadcast',
        event: 'announcement',
        payload: announcement
      });

  } catch (error) {
    console.error('Broadcast system announcement error:', error);
  }
}

// Cleanup inactive connections (run periodically)
export function cleanupInactiveConnections() {
  const now = Date.now();
  const inactiveThreshold = 5 * 60 * 1000; // 5 minutes

  for (const [projectId, projectPresence] of userPresence.entries()) {
    for (const [userId, presence] of projectPresence.entries()) {
      const lastSeen = new Date(presence.last_seen).getTime();
      
      if (now - lastSeen > inactiveThreshold) {
        // Remove inactive user
        projectPresence.delete(userId);
        
        const collaboration = projectCollaborations.get(projectId);
        if (collaboration) {
          collaboration.delete(userId);
        }

        // Broadcast user left
        broadcastToProject(projectId, {
          type: 'presence',
          user_id: userId,
          user_name: presence.user_name,
          project_id: projectId,
          data: { action: 'timeout' },
          timestamp: new Date().toISOString()
        });
      }
    }
  }
}

// Export functions for use in main server
export {
  activeConnections,
  userPresence,
  projectCollaborations,
  broadcastToProject
};
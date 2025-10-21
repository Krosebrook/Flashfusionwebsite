import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { verify } from 'npm:@octokit/webhooks-methods';
import * as kv from './kv_store.tsx';

/**
 * Repository Webhooks Handler for FlashFusion
 * 
 * Handles GitHub webhooks for real-time repository updates including:
 * - Push events for code changes
 * - Pull request events
 * - Repository updates (stars, forks, etc.)
 * - Branch creation/deletion
 * - Issue events
 * - Release events
 * 
 * Provides real-time notifications to connected FlashFusion users
 */

const app = new Hono();

// CORS setup for webhook endpoints
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization', 'X-GitHub-Event', 'X-GitHub-Delivery', 'X-Hub-Signature-256'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Supabase client for database operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
);

// GitHub webhook secret for verification
const WEBHOOK_SECRET = Deno.env.get('GITHUB_WEBHOOK_SECRET') || 'fallback-secret-for-dev';

interface WebhookEvent {
  id: string;
  type: string;
  repository: {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    clone_url: string;
    default_branch: string;
    private: boolean;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    language: string;
    updated_at: string;
  };
  sender: {
    login: string;
    avatar_url: string;
  };
  pusher?: {
    name: string;
    email: string;
  };
  commits?: Array<{
    id: string;
    message: string;
    author: {
      name: string;
      email: string;
    };
    url: string;
    added: string[];
    removed: string[];
    modified: string[];
  }>;
  pull_request?: {
    number: number;
    title: string;
    state: string;
    html_url: string;
    user: {
      login: string;
    };
  };
  issue?: {
    number: number;
    title: string;
    state: string;
    html_url: string;
    user: {
      login: string;
    };
  };
  release?: {
    tag_name: string;
    name: string;
    html_url: string;
    published_at: string;
  };
}

interface ConnectedRepository {
  id: string;
  name: string;
  url: string;
  github_id?: number;
  users: string[];
  webhook_id?: string;
  last_activity: string;
}

interface RealtimeUpdate {
  event_type: string;
  repository_url: string;
  repository_name: string;
  summary: string;
  details: any;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
  users: string[];
}

/**
 * Verify GitHub webhook signature
 */
async function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    return await verify(secret, payload, signature);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return false;
  }
}

/**
 * Get connected repositories for a GitHub repository
 */
async function getConnectedRepositories(githubRepoUrl: string): Promise<ConnectedRepository[]> {
  try {
    const connectedRepos = await kv.getByPrefix('connected_repository_');
    return connectedRepos
      .map(item => {
        try {
          const repo = JSON.parse(item.value) as ConnectedRepository;
          return repo.url === githubRepoUrl || repo.url.includes(githubRepoUrl.split('/').slice(-2).join('/')) ? repo : null;
        } catch {
          return null;
        }
      })
      .filter(Boolean) as ConnectedRepository[];
  } catch (error) {
    console.error('Error getting connected repositories:', error);
    return [];
  }
}

/**
 * Send real-time update to users
 */
async function sendRealtimeUpdate(update: RealtimeUpdate) {
  try {
    // Store the update in the database for persistence
    await kv.set(
      `webhook_event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      JSON.stringify(update)
    );

    // Send real-time notification via Supabase realtime
    const { error } = await supabase
      .channel('repository-updates')
      .send({
        type: 'broadcast',
        event: 'repository_update',
        payload: update
      });

    if (error) {
      console.error('Error sending realtime update:', error);
    }

    console.log(`Sent realtime update for ${update.repository_name} to ${update.users.length} users`);
  } catch (error) {
    console.error('Error in sendRealtimeUpdate:', error);
  }
}

/**
 * Process push event
 */
async function processPushEvent(event: WebhookEvent): Promise<RealtimeUpdate> {
  const commits = event.commits || [];
  const branch = event.repository.default_branch;
  
  const filesChanged = commits.reduce((acc, commit) => {
    return acc + commit.added.length + commit.modified.length + commit.removed.length;
  }, 0);

  return {
    event_type: 'push',
    repository_url: event.repository.html_url,
    repository_name: event.repository.name,
    summary: `${commits.length} new commit${commits.length !== 1 ? 's' : ''} pushed to ${branch}`,
    details: {
      branch,
      commits: commits.map(c => ({
        id: c.id.substring(0, 7),
        message: c.message,
        author: c.author.name,
        url: c.url,
        files_changed: c.added.length + c.modified.length + c.removed.length
      })),
      total_files_changed: filesChanged,
      pusher: event.pusher
    },
    timestamp: new Date().toISOString(),
    priority: commits.length > 5 ? 'high' : commits.length > 2 ? 'medium' : 'low',
    users: []
  };
}

/**
 * Process pull request event
 */
async function processPullRequestEvent(event: WebhookEvent): Promise<RealtimeUpdate> {
  const pr = event.pull_request!;
  
  return {
    event_type: 'pull_request',
    repository_url: event.repository.html_url,
    repository_name: event.repository.name,
    summary: `Pull request #${pr.number} ${pr.state}: ${pr.title}`,
    details: {
      number: pr.number,
      title: pr.title,
      state: pr.state,
      author: pr.user.login,
      url: pr.html_url
    },
    timestamp: new Date().toISOString(),
    priority: pr.state === 'closed' ? 'high' : 'medium',
    users: []
  };
}

/**
 * Process issue event
 */
async function processIssueEvent(event: WebhookEvent): Promise<RealtimeUpdate> {
  const issue = event.issue!;
  
  return {
    event_type: 'issues',
    repository_url: event.repository.html_url,
    repository_name: event.repository.name,
    summary: `Issue #${issue.number} ${issue.state}: ${issue.title}`,
    details: {
      number: issue.number,
      title: issue.title,
      state: issue.state,
      author: issue.user.login,
      url: issue.html_url
    },
    timestamp: new Date().toISOString(),
    priority: 'low',
    users: []
  };
}

/**
 * Process release event
 */
async function processReleaseEvent(event: WebhookEvent): Promise<RealtimeUpdate> {
  const release = event.release!;
  
  return {
    event_type: 'release',
    repository_url: event.repository.html_url,
    repository_name: event.repository.name,
    summary: `New release ${release.tag_name}: ${release.name}`,
    details: {
      tag_name: release.tag_name,
      name: release.name,
      url: release.html_url,
      published_at: release.published_at
    },
    timestamp: new Date().toISOString(),
    priority: 'high',
    users: []
  };
}

/**
 * Process repository update event (stars, forks, etc.)
 */
async function processRepositoryEvent(event: WebhookEvent): Promise<RealtimeUpdate> {
  return {
    event_type: 'repository',
    repository_url: event.repository.html_url,
    repository_name: event.repository.name,
    summary: `Repository updated: ${event.repository.name}`,
    details: {
      stars: event.repository.stargazers_count,
      forks: event.repository.forks_count,
      issues: event.repository.open_issues_count,
      language: event.repository.language,
      updated_at: event.repository.updated_at
    },
    timestamp: new Date().toISOString(),
    priority: 'low',
    users: []
  };
}

/**
 * Main webhook endpoint
 */
app.post('/make-server-88829a40/webhooks/github', async (c) => {
  try {
    const signature = c.req.header('X-Hub-Signature-256');
    const event = c.req.header('X-GitHub-Event');
    const delivery = c.req.header('X-GitHub-Delivery');
    
    if (!signature || !event) {
      return c.json({ error: 'Missing required headers' }, 400);
    }

    const payload = await c.req.text();
    
    // Verify webhook signature in production
    if (Deno.env.get('ENVIRONMENT') === 'production') {
      const isValid = await verifyWebhookSignature(payload, signature, WEBHOOK_SECRET);
      if (!isValid) {
        return c.json({ error: 'Invalid signature' }, 401);
      }
    }

    const webhookEvent: WebhookEvent = JSON.parse(payload);
    
    console.log(`Received webhook event: ${event} for repository: ${webhookEvent.repository?.name}`);

    // Get connected repositories that match this GitHub repository
    const connectedRepos = await getConnectedRepositories(webhookEvent.repository.html_url);
    
    if (connectedRepos.length === 0) {
      console.log(`No connected repositories found for ${webhookEvent.repository.html_url}`);
      return c.json({ message: 'No connected repositories found' });
    }

    // Process different event types
    let update: RealtimeUpdate;
    
    switch (event) {
      case 'push':
        update = await processPushEvent(webhookEvent);
        break;
      case 'pull_request':
        update = await processPullRequestEvent(webhookEvent);
        break;
      case 'issues':
        update = await processIssueEvent(webhookEvent);
        break;
      case 'release':
        update = await processReleaseEvent(webhookEvent);
        break;
      case 'repository':
        update = await processRepositoryEvent(webhookEvent);
        break;
      default:
        console.log(`Unhandled event type: ${event}`);
        return c.json({ message: 'Event type not handled' });
    }

    // Collect all users from connected repositories
    const allUsers = connectedRepos.reduce((acc, repo) => {
      return [...acc, ...repo.users];
    }, [] as string[]);
    
    update.users = [...new Set(allUsers)]; // Remove duplicates

    // Send real-time update to connected users
    await sendRealtimeUpdate(update);

    // Update repository activity timestamp
    for (const repo of connectedRepos) {
      repo.last_activity = new Date().toISOString();
      await kv.set(`connected_repository_${repo.id}`, JSON.stringify(repo));
    }

    return c.json({ 
      message: 'Webhook processed successfully',
      event_type: event,
      repository: webhookEvent.repository.name,
      users_notified: update.users.length
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return c.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * Register webhook for a repository
 */
app.post('/make-server-88829a40/webhooks/register', async (c) => {
  try {
    const { repository_url, access_token, user_id } = await c.req.json();
    
    if (!repository_url || !access_token || !user_id) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Extract owner and repo from URL
    const urlParts = repository_url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!urlParts) {
      return c.json({ error: 'Invalid GitHub repository URL' }, 400);
    }

    const [, owner, repo] = urlParts;

    // Create webhook using GitHub API
    const webhookUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/make-server-88829a40/webhooks/github`;
    
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/hooks`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${access_token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'web',
        active: true,
        events: ['push', 'pull_request', 'issues', 'release', 'repository'],
        config: {
          url: webhookUrl,
          content_type: 'json',
          secret: WEBHOOK_SECRET,
          insecure_ssl: '0'
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return c.json({ 
        error: 'Failed to create webhook',
        details: error.message || 'Unknown GitHub API error'
      }, response.status);
    }

    const webhook = await response.json();

    // Store webhook registration
    const registration = {
      webhook_id: webhook.id,
      repository_url,
      owner,
      repo,
      user_id,
      created_at: new Date().toISOString(),
      active: true
    };

    await kv.set(`webhook_registration_${webhook.id}`, JSON.stringify(registration));

    return c.json({
      message: 'Webhook registered successfully',
      webhook_id: webhook.id,
      url: webhookUrl,
      events: webhook.events
    });

  } catch (error) {
    console.error('Webhook registration error:', error);
    return c.json({
      error: 'Failed to register webhook',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * Unregister webhook for a repository
 */
app.delete('/make-server-88829a40/webhooks/:webhook_id', async (c) => {
  try {
    const webhookId = c.req.param('webhook_id');
    const { access_token } = await c.req.json();
    
    if (!access_token) {
      return c.json({ error: 'Access token required' }, 400);
    }

    // Get webhook registration
    const registration = await kv.get(`webhook_registration_${webhookId}`);
    if (!registration) {
      return c.json({ error: 'Webhook not found' }, 404);
    }

    const webhookData = JSON.parse(registration.value);

    // Delete webhook using GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${webhookData.owner}/${webhookData.repo}/hooks/${webhookId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `token ${access_token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    if (!response.ok && response.status !== 404) {
      return c.json({ error: 'Failed to delete webhook from GitHub' }, response.status);
    }

    // Remove webhook registration
    await kv.del(`webhook_registration_${webhookId}`);

    return c.json({ message: 'Webhook unregistered successfully' });

  } catch (error) {
    console.error('Webhook unregistration error:', error);
    return c.json({
      error: 'Failed to unregister webhook',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * Get webhook events for a user
 */
app.get('/make-server-88829a40/webhooks/events/:user_id', async (c) => {
  try {
    const userId = c.req.param('user_id');
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');

    // Get all webhook events
    const events = await kv.getByPrefix('webhook_event_');
    
    // Filter events for this user and sort by timestamp
    const userEvents = events
      .map(item => {
        try {
          const event = JSON.parse(item.value) as RealtimeUpdate;
          return event.users.includes(userId) ? event : null;
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b!.timestamp).getTime() - new Date(a!.timestamp).getTime())
      .slice(offset, offset + limit);

    return c.json({
      events: userEvents,
      total: userEvents.length,
      limit,
      offset
    });

  } catch (error) {
    console.error('Error fetching webhook events:', error);
    return c.json({
      error: 'Failed to fetch webhook events',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * Health check endpoint
 */
app.get('/make-server-88829a40/webhooks/health', async (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

export default app;
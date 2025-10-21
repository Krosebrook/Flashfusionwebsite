import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { 
  Webhook, 
  Activity, 
  GitBranch, 
  Settings, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  Zap,
  Bell,
  Shield,
  Globe
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  lastTriggered?: string;
  deliveryCount: number;
  failureCount: number;
  repository?: string;
  description: string;
}

interface WebhookEvent {
  id: string;
  type: string;
  timestamp: string;
  status: 'success' | 'failed' | 'pending';
  payload: any;
  endpoint: string;
  retryCount: number;
  processingTime: number;
  response?: {
    status: number;
    body: string;
  };
}

const WEBHOOK_EVENT_TYPES = [
  { id: 'push', label: 'Push Events', description: 'Repository pushes and commits' },
  { id: 'pull_request', label: 'Pull Requests', description: 'PR creation, updates, merges' },
  { id: 'issues', label: 'Issues', description: 'Issue creation and updates' },
  { id: 'release', label: 'Releases', description: 'Release creation and publication' },
  { id: 'repository', label: 'Repository', description: 'Repository settings changes' },
  { id: 'deployment', label: 'Deployments', description: 'Deployment status updates' },
  { id: 'workflow_run', label: 'Workflow Runs', description: 'GitHub Actions workflow events' },
  { id: 'project_analysis', label: 'AI Analysis', description: 'FlashFusion project analysis events' },
  { id: 'export_complete', label: 'Export Complete', description: 'Project export completion events' },
  { id: 'collaboration', label: 'Collaboration', description: 'Team collaboration events' }
];

export function WebhookManager() {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<string | null>(null);
  
  const [newWebhook, setNewWebhook] = useState({
    url: '',
    events: [] as string[],
    secret: '',
    description: '',
    active: true
  });

  useEffect(() => {
    loadWebhooks();
    loadRecentEvents();
  }, []);

  const loadWebhooks = () => {
    const saved = localStorage.getItem('ff_webhooks');
    if (saved) {
      try {
        setWebhooks(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load webhooks:', error);
      }
    }
  };

  const loadRecentEvents = () => {
    const saved = localStorage.getItem('ff_webhook_events');
    if (saved) {
      try {
        const allEvents = JSON.parse(saved);
        setEvents(allEvents.slice(0, 50)); // Show last 50 events
      } catch (error) {
        console.error('Failed to load events:', error);
      }
    }
  };

  const saveWebhooks = (updatedWebhooks: WebhookEndpoint[]) => {
    localStorage.setItem('ff_webhooks', JSON.stringify(updatedWebhooks));
    setWebhooks(updatedWebhooks);
  };

  const generateWebhookSecret = () => {
    const secret = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    setNewWebhook(prev => ({ ...prev, secret }));
  };

  const createWebhook = async () => {
    if (!newWebhook.url || newWebhook.events.length === 0) {
      toast.error('Please provide URL and select at least one event type');
      return;
    }

    setIsLoading(true);
    
    try {
      const webhook: WebhookEndpoint = {
        id: `webhook_${Date.now()}`,
        url: newWebhook.url,
        events: newWebhook.events,
        secret: newWebhook.secret || crypto.randomUUID(),
        active: newWebhook.active,
        description: newWebhook.description,
        deliveryCount: 0,
        failureCount: 0
      };

      // Register webhook with GitHub if it's a GitHub repository webhook
      if (newWebhook.url.includes('github.com') || newWebhook.events.includes('push')) {
        await registerGitHubWebhook(webhook);
      }

      const updatedWebhooks = [...webhooks, webhook];
      saveWebhooks(updatedWebhooks);

      setNewWebhook({
        url: '',
        events: [],
        secret: '',
        description: '',
        active: true
      });
      setShowCreateForm(false);

      toast.success('Webhook created successfully!');
    } catch (error) {
      console.error('Failed to create webhook:', error);
      toast.error('Failed to create webhook');
    } finally {
      setIsLoading(false);
    }
  };

  const registerGitHubWebhook = async (webhook: WebhookEndpoint) => {
    // This would register the webhook with GitHub API
    // For demo purposes, we'll simulate this
    console.log('Registering GitHub webhook:', webhook);
    
    // In production, this would make an API call like:
    /*
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/hooks`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        name: 'web',
        active: true,
        events: webhook.events,
        config: {
          url: webhook.url,
          content_type: 'json',
          secret: webhook.secret,
          insecure_ssl: '0'
        }
      })
    });
    */
  };

  const deleteWebhook = async (webhookId: string) => {
    const webhook = webhooks.find(w => w.id === webhookId);
    if (!webhook) return;

    try {
      // Unregister from GitHub if applicable
      if (webhook.repository) {
        await unregisterGitHubWebhook(webhook);
      }

      const updatedWebhooks = webhooks.filter(w => w.id !== webhookId);
      saveWebhooks(updatedWebhooks);
      toast.success('Webhook deleted successfully');
    } catch (error) {
      console.error('Failed to delete webhook:', error);
      toast.error('Failed to delete webhook');
    }
  };

  const unregisterGitHubWebhook = async (webhook: WebhookEndpoint) => {
    console.log('Unregistering GitHub webhook:', webhook);
    // Implementation would make API call to GitHub
  };

  const toggleWebhook = async (webhookId: string) => {
    const updatedWebhooks = webhooks.map(webhook => 
      webhook.id === webhookId 
        ? { ...webhook, active: !webhook.active }
        : webhook
    );
    saveWebhooks(updatedWebhooks);
    toast.success('Webhook status updated');
  };

  const testWebhook = async (webhookId: string) => {
    const webhook = webhooks.find(w => w.id === webhookId);
    if (!webhook) return;

    setIsLoading(true);
    
    try {
      // Simulate webhook test
      const testPayload = {
        test: true,
        timestamp: new Date().toISOString(),
        event_type: 'ping',
        source: 'FlashFusion'
      };

      // In production, this would make an actual HTTP request
      console.log('Testing webhook:', webhook.url, testPayload);
      
      // Simulate success
      const event: WebhookEvent = {
        id: `event_${Date.now()}`,
        type: 'ping',
        timestamp: new Date().toISOString(),
        status: 'success',
        payload: testPayload,
        endpoint: webhook.url,
        retryCount: 0,
        processingTime: Math.floor(Math.random() * 500) + 100,
        response: {
          status: 200,
          body: 'OK'
        }
      };

      const savedEvents = localStorage.getItem('ff_webhook_events');
      const allEvents = savedEvents ? JSON.parse(savedEvents) : [];
      const updatedEvents = [event, ...allEvents];
      localStorage.setItem('ff_webhook_events', JSON.stringify(updatedEvents));
      
      loadRecentEvents();
      toast.success('Webhook test completed successfully');
    } catch (error) {
      console.error('Webhook test failed:', error);
      toast.error('Webhook test failed');
    } finally {
      setIsLoading(false);
    }
  };

  const copyWebhookURL = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Webhook URL copied to clipboard');
  };

  const getStatusIcon = (status: WebhookEvent['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-ff-success" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-ff-error" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-ff-warning" />;
      default:
        return null;
    }
  };

  const getWebhookHealthScore = (webhook: WebhookEndpoint) => {
    if (webhook.deliveryCount === 0) return 100;
    const successRate = ((webhook.deliveryCount - webhook.failureCount) / webhook.deliveryCount) * 100;
    return Math.round(successRate);
  };

  return (
    <div className="space-y-6 ff-stagger-fade">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="ff-text-gradient mb-2">Webhook Management</h2>
          <p className="text-ff-text-secondary">
            Configure real-time webhooks for repository updates, deployment notifications, and collaboration events.
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="ff-btn-primary ff-hover-glow"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Webhook
        </Button>
      </div>

      <Tabs defaultValue="endpoints" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="endpoints" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            Endpoints
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Recent Events
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-6">
          {/* Create Webhook Form */}
          {showCreateForm && (
            <Card className="ff-card-interactive ff-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 ff-text-gradient">
                  <Plus className="h-5 w-5" />
                  Create New Webhook
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input
                      id="webhook-url"
                      placeholder="https://your-service.com/webhooks/github"
                      value={newWebhook.url}
                      onChange={(e) => setNewWebhook(prev => ({ ...prev, url: e.target.value }))}
                      className="ff-focus-ring"
                    />
                  </div>

                  <div>
                    <Label htmlFor="webhook-description">Description</Label>
                    <Input
                      id="webhook-description"
                      placeholder="GitHub repository updates for main project"
                      value={newWebhook.description}
                      onChange={(e) => setNewWebhook(prev => ({ ...prev, description: e.target.value }))}
                      className="ff-focus-ring"
                    />
                  </div>

                  <div>
                    <Label>Event Types</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {WEBHOOK_EVENT_TYPES.map((eventType) => (
                        <div key={eventType.id} className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id={`event-${eventType.id}`}
                            checked={newWebhook.events.includes(eventType.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewWebhook(prev => ({
                                  ...prev,
                                  events: [...prev.events, eventType.id]
                                }));
                              } else {
                                setNewWebhook(prev => ({
                                  ...prev,
                                  events: prev.events.filter(event => event !== eventType.id)
                                }));
                              }
                            }}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <Label htmlFor={`event-${eventType.id}`} className="text-sm font-medium">
                              {eventType.label}
                            </Label>
                            <p className="text-xs text-ff-text-muted">
                              {eventType.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="webhook-secret">Secret (Optional)</Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={generateWebhookSecret}
                        className="text-xs"
                      >
                        Generate
                      </Button>
                    </div>
                    <Input
                      id="webhook-secret"
                      type="password"
                      placeholder="Leave empty to auto-generate"
                      value={newWebhook.secret}
                      onChange={(e) => setNewWebhook(prev => ({ ...prev, secret: e.target.value }))}
                      className="ff-focus-ring"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="webhook-active"
                      checked={newWebhook.active}
                      onCheckedChange={(checked) => setNewWebhook(prev => ({ ...prev, active: checked }))}
                    />
                    <Label htmlFor="webhook-active">Active</Label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={createWebhook}
                    disabled={isLoading}
                    className="ff-btn-primary"
                  >
                    {isLoading ? 'Creating...' : 'Create Webhook'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Webhooks List */}
          <div className="grid gap-4">
            {webhooks.length === 0 ? (
              <Card className="ff-card-interactive text-center p-12">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-ff-surface rounded-full flex items-center justify-center">
                    <Webhook className="h-8 w-8 text-ff-text-muted" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ff-text-primary mb-2">No webhooks configured</h3>
                    <p className="text-ff-text-muted mb-4">
                      Create your first webhook to receive real-time updates from repositories and services
                    </p>
                    <Button 
                      onClick={() => setShowCreateForm(true)}
                      className="ff-btn-primary"
                    >
                      Create Webhook
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              webhooks.map((webhook) => (
                <Card key={webhook.id} className="ff-card-interactive">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${webhook.active ? 'bg-ff-success/20' : 'bg-ff-surface'}`}>
                          <Webhook className={`h-4 w-4 ${webhook.active ? 'text-ff-success' : 'text-ff-text-muted'}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-ff-text-primary">
                            {webhook.description || 'Webhook Endpoint'}
                          </CardTitle>
                          <p className="text-sm text-ff-text-muted">{webhook.url}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={webhook.active ? 'default' : 'secondary'}>
                          {webhook.active ? 'Active' : 'Disabled'}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-ff-text-muted">
                          <div className={`w-2 h-2 rounded-full ${
                            getWebhookHealthScore(webhook) >= 95 ? 'bg-ff-success' :
                            getWebhookHealthScore(webhook) >= 80 ? 'bg-ff-warning' : 'bg-ff-error'
                          }`} />
                          {getWebhookHealthScore(webhook)}% uptime
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-6">
                        <div>
                          <span className="text-ff-text-muted">Events: </span>
                          <span className="text-ff-text-primary">{webhook.events.length}</span>
                        </div>
                        <div>
                          <span className="text-ff-text-muted">Deliveries: </span>
                          <span className="text-ff-text-primary">{webhook.deliveryCount}</span>
                        </div>
                        <div>
                          <span className="text-ff-text-muted">Failures: </span>
                          <span className="text-ff-error">{webhook.failureCount}</span>
                        </div>
                        {webhook.lastTriggered && (
                          <div>
                            <span className="text-ff-text-muted">Last: </span>
                            <span className="text-ff-text-primary">
                              {new Date(webhook.lastTriggered).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyWebhookURL(webhook.url)}
                          className="ff-hover-scale"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => testWebhook(webhook.id)}
                          disabled={isLoading}
                          className="ff-hover-scale"
                        >
                          <Zap className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toggleWebhook(webhook.id)}
                          className="ff-hover-scale"
                        >
                          {webhook.active ? <Eye className="h-3 w-3" /> : <RefreshCw className="h-3 w-3" />}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => deleteWebhook(webhook.id)}
                          className="ff-hover-scale"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Subscribed Events</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {webhook.events.map((eventType) => {
                          const event = WEBHOOK_EVENT_TYPES.find(e => e.id === eventType);
                          return (
                            <Badge key={eventType} variant="secondary" className="text-xs">
                              {event?.label || eventType}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    {getWebhookHealthScore(webhook) < 95 && (
                      <Alert>
                        <Shield className="h-4 w-4" />
                        <AlertDescription>
                          This webhook has a {getWebhookHealthScore(webhook)}% success rate. 
                          Consider checking the endpoint or reviewing recent failures.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card className="ff-card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-ff-primary" />
                Recent Webhook Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 mx-auto text-ff-text-muted mb-4" />
                    <p className="text-ff-text-muted">No webhook events yet</p>
                  </div>
                ) : (
                  events.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 border border-ff-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(event.status)}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-ff-text-primary">{event.type}</span>
                            <Badge variant="outline" className="text-xs">
                              {event.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-ff-text-muted">{event.endpoint}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-ff-text-primary">{event.processingTime}ms</p>
                        <p className="text-xs text-ff-text-muted">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="ff-card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-ff-primary" />
                Webhook Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Globe className="h-4 w-4" />
                <AlertDescription>
                  <strong>Webhook Endpoint URL:</strong> Configure this URL in your GitHub repository settings to receive webhooks.
                  <br />
                  <code className="bg-ff-surface px-2 py-1 rounded mt-2 inline-block">
                    https://your-flashfusion-instance.com/api/webhooks/github
                  </code>
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h4 className="font-semibold text-ff-text-primary">Security Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Verify SSL Certificates</Label>
                      <p className="text-sm text-ff-text-muted">Ensure secure webhook delivery</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Signature Verification</Label>
                      <p className="text-sm text-ff-text-muted">Verify webhook authenticity</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-ff-text-primary">Delivery Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-retry Failed Deliveries</Label>
                      <p className="text-sm text-ff-text-muted">Retry failed webhook deliveries</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Event Filtering</Label>
                      <p className="text-sm text-ff-text-muted">Filter events before delivery</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default WebhookManager;
import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Zap,
  Plus,
  Settings,
  Play,
  Pause,
  Save,
  Copy,
  Trash2,
  ArrowRight,
  Timer,
  Calendar,
  Mail,
  MessageSquare,
  Upload,
  Download,
  Database,
  Globe,
  Code,
  Image,
  FileText,
  Video,
  Music,
  Users,
  ShoppingCart,
  BarChart3,
  Bell,
  GitBranch,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  X,
  Edit3,
  Eye,
  Share2
} from 'lucide-react';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay' | 'webhook';
  position: { x: number; y: number };
  data: {
    title: string;
    description: string;
    config: Record<string, any>;
    platform?: string;
    icon?: React.ComponentType<{ className?: string }>;
    color?: string;
    status?: 'idle' | 'running' | 'success' | 'error';
    lastRun?: Date;
    executionCount?: number;
  };
}

interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
  conditions?: {
    field: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
    value: string;
  }[];
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'social-media' | 'content-creation' | 'e-commerce' | 'productivity' | 'marketing';
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  usageCount: number;
  rating: number;
  popular?: boolean;
}

const PLATFORM_INTEGRATIONS = [
  { id: 'youtube', name: 'YouTube', icon: Video, color: '#FF0000' },
  { id: 'tiktok', name: 'TikTok', icon: Music, color: '#000000' },
  { id: 'instagram', name: 'Instagram', icon: Image, color: '#E4405F' },
  { id: 'twitter', name: 'Twitter', icon: MessageSquare, color: '#1DA1F2' },
  { id: 'linkedin', name: 'LinkedIn', icon: Users, color: '#0077B5' },
  { id: 'shopify', name: 'Shopify', icon: ShoppingCart, color: '#96BF48' },
  { id: 'wordpress', name: 'WordPress', icon: Globe, color: '#21759B' },
  { id: 'mailchimp', name: 'Mailchimp', icon: Mail, color: '#FFE01B' },
  { id: 'slack', name: 'Slack', icon: MessageSquare, color: '#4A154B' },
  { id: 'discord', name: 'Discord', icon: MessageSquare, color: '#5865F2' },
  { id: 'notion', name: 'Notion', icon: FileText, color: '#000000' },
  { id: 'airtable', name: 'Airtable', icon: Database, color: '#18BFFF' }
];

const TRIGGER_TYPES = [
  { id: 'schedule', name: 'Schedule', icon: Timer, description: 'Run on a specific schedule' },
  { id: 'webhook', name: 'Webhook', icon: Globe, description: 'Triggered by external events' },
  { id: 'file-upload', name: 'File Upload', icon: Upload, description: 'When files are uploaded' },
  { id: 'form-submit', name: 'Form Submit', icon: FileText, description: 'When forms are submitted' },
  { id: 'new-content', name: 'New Content', icon: Plus, description: 'When new content is created' },
  { id: 'engagement', name: 'Engagement', icon: Users, description: 'Based on user engagement' }
];

const ACTION_TYPES = [
  { id: 'post-content', name: 'Post Content', icon: Upload, description: 'Share content on platforms' },
  { id: 'send-email', name: 'Send Email', icon: Mail, description: 'Send email notifications' },
  { id: 'generate-content', name: 'Generate Content', icon: Zap, description: 'AI content generation' },
  { id: 'process-image', name: 'Process Image', icon: Image, description: 'Edit or optimize images' },
  { id: 'analyze-data', name: 'Analyze Data', icon: BarChart3, description: 'Data analysis and insights' },
  { id: 'update-database', name: 'Update Database', icon: Database, description: 'Store or update data' },
  { id: 'send-notification', name: 'Send Notification', icon: Bell, description: 'Push notifications' },
  { id: 'create-task', name: 'Create Task', icon: CheckCircle2, description: 'Add tasks to project' }
];

const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'youtube-tiktok-repurpose',
    name: 'YouTube to TikTok Auto-Repurpose',
    description: 'Automatically convert YouTube videos to TikTok format and post',
    category: 'social-media',
    usageCount: 1247,
    rating: 4.8,
    popular: true,
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: {
          title: 'New YouTube Video',
          description: 'Triggered when you upload a new YouTube video',
          config: { platform: 'youtube', event: 'video_published' },
          platform: 'youtube',
          icon: Video,
          color: '#FF0000'
        }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 350, y: 100 },
        data: {
          title: 'Extract Short Clips',
          description: 'AI-powered clip extraction for TikTok format',
          config: { duration: 60, format: 'vertical', segments: 3 },
          icon: Video,
          color: '#FF7B00'
        }
      },
      {
        id: 'action-2',
        type: 'action',
        position: { x: 600, y: 100 },
        data: {
          title: 'Post to TikTok',
          description: 'Auto-post clips to TikTok with optimized captions',
          config: { platform: 'tiktok', schedule: 'immediate', hashtags: 'auto' },
          platform: 'tiktok',
          icon: Music,
          color: '#000000'
        }
      }
    ],
    connections: [
      { id: 'conn-1', source: 'trigger-1', target: 'action-1' },
      { id: 'conn-2', source: 'action-1', target: 'action-2' }
    ]
  },
  {
    id: 'content-scheduler',
    name: 'Multi-Platform Content Scheduler',
    description: 'Schedule and post content across multiple social platforms',
    category: 'content-creation',
    usageCount: 892,
    rating: 4.6,
    nodes: [
      {
        id: 'trigger-2',
        type: 'trigger',
        position: { x: 100, y: 150 },
        data: {
          title: 'Schedule Trigger',
          description: 'Daily content posting schedule',
          config: { time: '09:00', timezone: 'UTC', days: ['mon', 'wed', 'fri'] },
          icon: Timer,
          color: '#10B981'
        }
      },
      {
        id: 'action-3',
        type: 'action',
        position: { x: 350, y: 100 },
        data: {
          title: 'Post to Instagram',
          description: 'Share to Instagram feed and stories',
          config: { post_type: 'feed', story: true },
          platform: 'instagram',
          icon: Image,
          color: '#E4405F'
        }
      },
      {
        id: 'action-4',
        type: 'action',
        position: { x: 350, y: 200 },
        data: {
          title: 'Post to Twitter',
          description: 'Share as Twitter thread with hashtags',
          config: { thread: true, hashtags: '#content #ai' },
          platform: 'twitter',
          icon: MessageSquare,
          color: '#1DA1F2'
        }
      }
    ],
    connections: [
      { id: 'conn-3', source: 'trigger-2', target: 'action-3' },
      { id: 'conn-4', source: 'trigger-2', target: 'action-4' }
    ]
  }
];

export function NoCodeWorkflowBuilder() {
  const [workflows, setWorkflows] = useState<WorkflowTemplate[]>(WORKFLOW_TEMPLATES);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowTemplate | null>(null);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'templates' | 'builder' | 'integrations' | 'analytics'>('templates');
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleNodeDrag = useCallback((event: React.MouseEvent) => {
    if (!isDragging || !selectedNode || !selectedWorkflow || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = event.clientX - canvasRect.left - dragOffset.x;
    const newY = event.clientY - canvasRect.top - dragOffset.y;

    const updatedNodes = selectedWorkflow.nodes.map(node =>
      node.id === selectedNode.id
        ? { ...node, position: { x: Math.max(0, newX), y: Math.max(0, newY) } }
        : node
    );

    const updatedWorkflow = { ...selectedWorkflow, nodes: updatedNodes };
    setSelectedWorkflow(updatedWorkflow);
    setWorkflows(prev => prev.map(w => w.id === updatedWorkflow.id ? updatedWorkflow : w));
  }, [isDragging, selectedNode, selectedWorkflow, dragOffset]);

  const handleNodeDragStart = (node: WorkflowNode, event: React.MouseEvent) => {
    setSelectedNode(node);
    setIsDragging(true);
    const rect = event.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  };

  const addNode = (type: WorkflowNode['type'], nodeType: any) => {
    if (!selectedWorkflow) return;

    const newNode: WorkflowNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 300, y: 200 },
      data: {
        title: nodeType.name,
        description: nodeType.description,
        config: {},
        icon: nodeType.icon,
        color: nodeType.color || '#6B7280'
      }
    };

    const updatedWorkflow = {
      ...selectedWorkflow,
      nodes: [...selectedWorkflow.nodes, newNode]
    };

    setSelectedWorkflow(updatedWorkflow);
    setWorkflows(prev => prev.map(w => w.id === updatedWorkflow.id ? updatedWorkflow : w));
  };

  const deleteNode = (nodeId: string) => {
    if (!selectedWorkflow) return;

    const updatedWorkflow = {
      ...selectedWorkflow,
      nodes: selectedWorkflow.nodes.filter(n => n.id !== nodeId),
      connections: selectedWorkflow.connections.filter(c => c.source !== nodeId && c.target !== nodeId)
    };

    setSelectedWorkflow(updatedWorkflow);
    setWorkflows(prev => prev.map(w => w.id === updatedWorkflow.id ? updatedWorkflow : w));
    setSelectedNode(null);
  };

  const createNewWorkflow = () => {
    const newWorkflow: WorkflowTemplate = {
      id: `workflow-${Date.now()}`,
      name: 'New Workflow',
      description: 'Custom workflow',
      category: 'productivity',
      nodes: [],
      connections: [],
      usageCount: 0,
      rating: 0
    };

    setWorkflows(prev => [...prev, newWorkflow]);
    setSelectedWorkflow(newWorkflow);
    setActiveTab('builder');
    setIsCreating(true);
  };

  const WorkflowNodeComponent = ({ node, isSelected }: { node: WorkflowNode; isSelected: boolean }) => {
    const NodeIcon = node.data.icon || Zap;
    const platform = PLATFORM_INTEGRATIONS.find(p => p.id === node.data.platform);

    return (
      <motion.div
        style={{
          position: 'absolute',
          left: node.position.x,
          top: node.position.y,
          zIndex: isSelected ? 10 : 1
        }}
        whileHover={{ scale: 1.05 }}
        whileDrag={{ scale: 1.1 }}
        onMouseDown={(e) => handleNodeDrag(e.nativeEvent)}
        className="cursor-move"
      >
        <Card 
          className={`w-48 transition-all duration-300 ${
            isSelected ? 'ring-2 shadow-lg' : 'hover:shadow-md'
          }`}
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: node.data.color 
              ? `2px solid ${node.data.color}30`
              : '1px solid rgba(255, 255, 255, 0.2)',
            ringColor: node.data.color || '#3B82F6'
          }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedNode(selectedNode?.id === node.id ? null : node);
          }}
        >
          <div className="p-4">
            {/* Node Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${node.data.color || '#6B7280'}15` }}
                >
                  <NodeIcon className="h-4 w-4" style={{ color: node.data.color || '#6B7280' }} />
                </div>
                {platform && (
                  <div 
                    className="w-6 h-6 rounded flex items-center justify-center"
                    style={{ backgroundColor: `${platform.color}15` }}
                  >
                    <platform.icon className="h-3 w-3" style={{ color: platform.color }} />
                  </div>
                )}
              </div>
              
              <Badge 
                className="text-xs capitalize"
                style={{
                  backgroundColor: node.type === 'trigger' ? '#10B98115' : 
                                 node.type === 'action' ? '#FF7B0015' : '#6B728015',
                  color: node.type === 'trigger' ? '#10B981' : 
                         node.type === 'action' ? '#FF7B00' : '#6B7280'
                }}
              >
                {node.type}
              </Badge>
            </div>

            {/* Node Content */}
            <div className="mb-3">
              <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">
                {node.data.title}
              </h4>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                {node.data.description}
              </p>
            </div>

            {/* Node Status */}
            {node.data.status && (
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1">
                  {node.data.status === 'success' && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                  {node.data.status === 'error' && <AlertTriangle className="h-3 w-3 text-red-500" />}
                  {node.data.status === 'running' && <RefreshCw className="h-3 w-3 text-blue-500 animate-spin" />}
                  <span className="capitalize">{node.data.status}</span>
                </div>
                {node.data.executionCount && (
                  <span>{node.data.executionCount} runs</span>
                )}
              </div>
            )}

            {/* Connection Points */}
            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-300 hover:border-blue-500 cursor-pointer" />
            </div>
            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-300 hover:border-blue-500 cursor-pointer" />
            </div>
          </div>

          {/* Delete Button */}
          {isSelected && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                deleteNode(node.id);
              }}
            >
              <X className="h-3 w-3" />
            </motion.button>
          )}
        </Card>
      </motion.div>
    );
  };

  const ConnectionLine = ({ connection, nodes }: { connection: WorkflowConnection; nodes: WorkflowNode[] }) => {
    const sourceNode = nodes.find(n => n.id === connection.source);
    const targetNode = nodes.find(n => n.id === connection.target);
    
    if (!sourceNode || !targetNode) return null;

    const startX = sourceNode.position.x + 192; // Node width
    const startY = sourceNode.position.y + 60;  // Node height / 2
    const endX = targetNode.position.x;
    const endY = targetNode.position.y + 60;

    const midX = (startX + endX) / 2;

    return (
      <svg 
        className="absolute top-0 left-0 pointer-events-none"
        style={{ zIndex: 0 }}
        width="100%"
        height="100%"
      >
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF7B00" />
            <stop offset="50%" stopColor="#00B4D8" />
            <stop offset="100%" stopColor="#E91E63" />
          </linearGradient>
        </defs>
        
        <path
          d={`M ${startX} ${startY} Q ${midX} ${startY} ${endX} ${endY}`}
          stroke="url(#connectionGradient)"
          strokeWidth="3"
          fill="none"
          opacity={0.8}
        />
        
        {/* Arrow */}
        <polygon
          points={`${endX-8},${endY-4} ${endX},${endY} ${endX-8},${endY+4}`}
          fill="#00B4D8"
        />
      </svg>
    );
  };

  const TemplateCard = ({ template }: { template: WorkflowTemplate }) => (
    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {
      setSelectedWorkflow(template);
      setActiveTab('builder');
    }}>
      {template.popular && (
        <Badge className="absolute top-4 right-4 bg-ff-primary text-white">
          Popular
        </Badge>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{template.description}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{template.usageCount.toLocaleString()} uses</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{template.rating}</span>
            </div>
          </div>
        </div>
        
        <Badge className="capitalize" style={{
          backgroundColor: template.category === 'social-media' ? '#E91E6315' :
                         template.category === 'content-creation' ? '#FF7B0015' :
                         template.category === 'e-commerce' ? '#10B98115' :
                         template.category === 'marketing' ? '#00B4D815' : '#6B728015',
          color: template.category === 'social-media' ? '#E91E63' :
                 template.category === 'content-creation' ? '#FF7B00' :
                 template.category === 'e-commerce' ? '#10B981' :
                 template.category === 'marketing' ? '#00B4D8' : '#6B7280'
        }}>
          {template.category.replace('-', ' ')}
        </Badge>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">{template.nodes.length} steps</span>
          <div className="flex -space-x-1">
            {template.nodes.slice(0, 3).map((node, index) => {
              const NodeIcon = node.data.icon || Zap;
              return (
                <div 
                  key={index}
                  className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center"
                  style={{ backgroundColor: `${node.data.color || '#6B7280'}15` }}
                >
                  <NodeIcon className="h-3 w-3" style={{ color: node.data.color || '#6B7280' }} />
                </div>
              );
            })}
            {template.nodes.length > 3 && (
              <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
                <span className="text-xs text-gray-600">+{template.nodes.length - 3}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" className="ff-btn-primary">
            <Copy className="h-4 w-4 mr-1" />
            Use
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              No-Code Workflow Builder
            </h1>
            <p className="text-muted-foreground mt-2">
              Create powerful automations without coding - drag, drop, and deploy
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            
            <Button 
              onClick={createNewWorkflow}
              className="ff-btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Workflow
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <div className="flex">
          {/* Sidebar */}
          <div className="w-80 bg-white border-r p-6 overflow-y-auto">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="builder">Builder</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Workflow Templates</h3>
                <Button size="sm" variant="outline">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {workflows.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                       onClick={() => {
                         setSelectedWorkflow(template);
                         setActiveTab('builder');
                       }}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{template.name}</h4>
                      {template.popular && (
                        <Badge className="text-xs bg-ff-primary text-white">Hot</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-3">{template.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{template.nodes.length} steps</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs">{template.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="builder" className="space-y-4">
              {/* Trigger Nodes */}
              <div>
                <h4 className="font-semibold mb-3">Triggers</h4>
                <div className="space-y-2">
                  {TRIGGER_TYPES.map((trigger) => (
                    <Button
                      key={trigger.id}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => addNode('trigger', trigger)}
                    >
                      <trigger.icon className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm">{trigger.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Action Nodes */}
              <div>
                <h4 className="font-semibold mb-3">Actions</h4>
                <div className="space-y-2">
                  {ACTION_TYPES.map((action) => (
                    <Button
                      key={action.id}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => addNode('action', action)}
                    >
                      <action.icon className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="text-sm">{action.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Platform Integrations */}
              <div>
                <h4 className="font-semibold mb-3">Platforms</h4>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORM_INTEGRATIONS.slice(0, 8).map((platform) => (
                    <Button
                      key={platform.id}
                      variant="outline"
                      size="sm"
                      className="flex flex-col items-center justify-center h-16"
                    >
                      <platform.icon className="h-4 w-4 mb-1" style={{ color: platform.color }} />
                      <span className="text-xs">{platform.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative overflow-auto">
            <div 
              ref={canvasRef}
              className="relative min-h-full min-w-full"
              style={{ 
                width: '2000px', 
                height: '1500px',
                background: `
                  radial-gradient(circle at 20px 20px, rgba(255, 123, 0, 0.1) 1px, transparent 1px),
                  radial-gradient(circle at 60px 60px, rgba(0, 180, 216, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '80px 80px'
              }}
              onMouseMove={handleNodeDrag}
              onMouseUp={() => setIsDragging(false)}
              onClick={() => setSelectedNode(null)}
            >
              {selectedWorkflow && (
                <>
                  {/* Connections */}
                  {selectedWorkflow.connections.map((connection) => (
                    <ConnectionLine 
                      key={connection.id} 
                      connection={connection} 
                      nodes={selectedWorkflow.nodes}
                    />
                  ))}

                  {/* Nodes */}
                  <AnimatePresence>
                    {selectedWorkflow.nodes.map((node) => (
                      <WorkflowNodeComponent 
                        key={node.id} 
                        node={node}
                        isSelected={selectedNode?.id === node.id}
                      />
                    ))}
                  </AnimatePresence>
                </>
              )}

              {/* Empty State */}
              {!selectedWorkflow && (
                <div className="flex items-center justify-center h-full">
                  <Card className="p-12 text-center max-w-md">
                    <Zap className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Start Building
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Select a template or create a new workflow to begin automating your processes.
                    </p>
                    <Button 
                      onClick={createNewWorkflow}
                      className="ff-btn-primary"
                    >
                      Create New Workflow
                    </Button>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </Tabs>

      {/* Control Panel */}
      {selectedWorkflow && (
        <div className="fixed bottom-6 right-6 flex space-x-3">
          <Button variant="outline" size="lg">
            <Save className="h-5 w-5 mr-2" />
            Save
          </Button>
          
          <Button
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Play className="h-5 w-5 mr-2" />
            Test Workflow
          </Button>
        </div>
      )}
    </div>
  );
}
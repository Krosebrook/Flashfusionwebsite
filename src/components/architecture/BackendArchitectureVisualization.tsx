/**
 * @fileoverview FlashFusion Backend Architecture Visualization
 * @chunk architecture
 * @category backend
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Interactive visualization of FlashFusion backend architecture showing Supabase edge functions,
 * Hono web server, key-value data store, real-time data channels, and API rate-limiting modules.
 * 
 * Features:
 * - Interactive architecture diagram
 * - Data flow visualization
 * - Microservice interaction mapping
 * - Performance metrics display
 * - Real-time status monitoring
 * - Component scaling visualization
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Server, 
  Database, 
  Zap, 
  Shield, 
  Activity, 
  Globe, 
  ArrowRight, 
  ArrowDown,
  ArrowUp,
  Cloud,
  Lock,
  Timer,
  BarChart3,
  Settings,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Play,
  Pause,
  Users,
  Cpu,
  HardDrive,
  Network,
  Eye,
  Code,
  GitBranch,
  Layers,
  Box,
  Workflow,
  TrendingUp,
  Clock,
  Filter,
  MonitorSpeaker
} from 'lucide-react';

// Architecture component data
const architectureComponents = {
  client: {
    id: 'client',
    name: 'Client Applications',
    type: 'frontend',
    description: 'React/Next.js applications, Mobile apps, Third-party integrations',
    status: 'active',
    connections: ['edge-functions'],
    metrics: { requests: 15420, responseTime: 120, errors: 0.2 }
  },
  edgeFunctions: {
    id: 'edge-functions',
    name: 'Supabase Edge Functions',
    type: 'serverless',
    description: 'TypeScript/Deno runtime for serverless functions',
    status: 'active',
    connections: ['hono-server', 'auth', 'storage'],
    metrics: { invocations: 8934, coldStarts: 23, avgDuration: 85 }
  },
  honoServer: {
    id: 'hono-server',
    name: 'Hono Web Server',
    type: 'api',
    description: 'Lightweight web framework handling HTTP routing and middleware',
    status: 'active',
    connections: ['kv-store', 'realtime', 'rate-limiter'],
    metrics: { requests: 12450, latency: 45, throughput: 1200 }
  },
  kvStore: {
    id: 'kv-store',
    name: 'Key-Value Data Store',
    type: 'database',
    description: 'High-performance KV storage for application data and caching',
    status: 'active',
    connections: ['postgres'],
    metrics: { operations: 25600, hitRate: 94.2, storage: 2.1 }
  },
  postgres: {
    id: 'postgres',
    name: 'PostgreSQL Database',
    type: 'database',
    description: 'Primary relational database with real-time capabilities',
    status: 'active',
    connections: ['realtime'],
    metrics: { connections: 45, queries: 8934, cacheHit: 89.3 }
  },
  realtime: {
    id: 'realtime',
    name: 'Real-time Channels',
    type: 'websocket',
    description: 'WebSocket connections for live data synchronization',
    status: 'active',
    connections: ['client'],
    metrics: { connections: 234, messages: 5670, latency: 12 }
  },
  rateLimiter: {
    id: 'rate-limiter',
    name: 'API Rate Limiting',
    type: 'middleware',
    description: 'Request throttling and abuse prevention system',
    status: 'active',
    connections: [],
    metrics: { requests: 12450, blocked: 89, efficiency: 99.3 }
  },
  auth: {
    id: 'auth',
    name: 'Authentication Service',
    type: 'security',
    description: 'JWT tokens, session management, and user authentication',
    status: 'active',
    connections: ['postgres'],
    metrics: { sessions: 1890, logins: 456, security: 100 }
  },
  storage: {
    id: 'storage',
    name: 'Object Storage',
    type: 'storage',
    description: 'File uploads, media storage, and CDN distribution',
    status: 'active',
    connections: [],
    metrics: { files: 15670, bandwidth: 450, requests: 8934 }
  }
};

// Data flow patterns
const dataFlows = [
  {
    id: 'user-request',
    name: 'User API Request',
    path: ['client', 'edge-functions', 'hono-server', 'kv-store'],
    color: 'var(--ff-primary)',
    description: 'Standard API request flow with caching'
  },
  {
    id: 'realtime-sync',
    name: 'Real-time Data Sync',
    path: ['postgres', 'realtime', 'client'],
    color: 'var(--ff-secondary)',
    description: 'Live data synchronization via WebSockets'
  },
  {
    id: 'auth-flow',
    name: 'Authentication Flow',
    path: ['client', 'edge-functions', 'auth', 'postgres'],
    color: 'var(--ff-accent)',
    description: 'User authentication and session management'
  },
  {
    id: 'rate-limiting',
    name: 'Rate Limiting Check',
    path: ['hono-server', 'rate-limiter'],
    color: 'var(--ff-warning)',
    description: 'Request throttling and abuse prevention'
  }
];

interface BackendArchitectureVisualizationProps {
  // Optional props for customization
}

/**
 * FlashFusion Backend Architecture Visualization Component
 */
export function BackendArchitectureVisualization({}: BackendArchitectureVisualizationProps) {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [activeFlow, setActiveFlow] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [metricsUpdateInterval, setMetricsUpdateInterval] = useState<NodeJS.Timeout | null>(null);

  // Simulate real-time metrics updates
  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        // Simulate metric updates
        Object.keys(architectureComponents).forEach(key => {
          const component = architectureComponents[key as keyof typeof architectureComponents];
          // Add small random variations to simulate real activity
          if (component.metrics.requests !== undefined) {
            component.metrics.requests += Math.floor(Math.random() * 10);
          }
        });
      }, 2000);
      
      setMetricsUpdateInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [isAnimating]);

  // Get component icon based on type
  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'frontend': return Globe;
      case 'serverless': return Zap;
      case 'api': return Server;
      case 'database': return Database;
      case 'websocket': return Activity;
      case 'middleware': return Shield;
      case 'security': return Lock;
      case 'storage': return HardDrive;
      default: return Box;
    }
  };

  // Get component color based on type
  const getComponentColor = (type: string, status: string) => {
    if (status !== 'active') return 'var(--ff-text-muted)';
    
    switch (type) {
      case 'frontend': return 'var(--ff-secondary)';
      case 'serverless': return 'var(--ff-primary)';
      case 'api': return 'var(--ff-accent)';
      case 'database': return 'var(--ff-success)';
      case 'websocket': return 'var(--ff-warning)';
      case 'middleware': return 'var(--ff-error)';
      case 'security': return 'var(--ff-info)';
      case 'storage': return 'var(--ff-neutral-400)';
      default: return 'var(--ff-text-muted)';
    }
  };

  // Architecture diagram component
  const ArchitectureDiagram = () => (
    <div className="relative w-full h-[800px] bg-[var(--ff-surface)] rounded-lg border border-[var(--border)] overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 1200 800" className="absolute inset-0">
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(203, 213, 225, 0.1)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Connection lines */}
        {Object.values(architectureComponents).map(component => 
          component.connections.map(targetId => {
            const target = Object.values(architectureComponents).find(c => c.id === targetId);
            if (!target) return null;
            
            const sourcePos = getComponentPosition(component.id);
            const targetPos = getComponentPosition(targetId);
            
            return (
              <line
                key={`${component.id}-${targetId}`}
                x1={sourcePos.x}
                y1={sourcePos.y}
                x2={targetPos.x}
                y2={targetPos.y}
                stroke="rgba(203, 213, 225, 0.3)"
                strokeWidth="2"
                strokeDasharray={activeFlow ? "5,5" : "none"}
                className={`transition-all duration-500 ${
                  activeFlow && isFlowPath(component.id, targetId, activeFlow) 
                    ? 'stroke-[var(--ff-primary)] opacity-100' 
                    : ''
                }`}
              />
            );
          })
        )}
        
        {/* Component nodes */}
        {Object.values(architectureComponents).map(component => {
          const position = getComponentPosition(component.id);
          const Icon = getComponentIcon(component.type);
          const color = getComponentColor(component.type, component.status);
          const isSelected = selectedComponent === component.id;
          
          return (
            <g key={component.id} className="cursor-pointer" onClick={() => setSelectedComponent(component.id)}>
              {/* Component circle */}
              <circle
                cx={position.x}
                cy={position.y}
                r={isSelected ? 45 : 35}
                fill={color}
                fillOpacity={0.1}
                stroke={color}
                strokeWidth={isSelected ? 3 : 2}
                className="transition-all duration-300"
              />
              
              {/* Status indicator */}
              <circle
                cx={position.x + 25}
                cy={position.y - 25}
                r={6}
                fill={component.status === 'active' ? 'var(--ff-success)' : 'var(--ff-error)'}
                className={isAnimating ? 'animate-pulse' : ''}
              />
              
              {/* Component label */}
              <text
                x={position.x}
                y={position.y + 55}
                textAnchor="middle"
                className="fill-current text-[var(--ff-text-primary)] ff-text-sm font-medium"
              >
                {component.name}
              </text>
              
              {/* Metrics display */}
              {isSelected && (
                <foreignObject
                  x={position.x - 80}
                  y={position.y + 70}
                  width="160"
                  height="80"
                >
                  <div className="bg-[var(--ff-surface-light)] border border-[var(--border)] rounded-lg p-3 text-xs">
                    {Object.entries(component.metrics).map(([key, value]) => (
                      <div key={key} className="flex justify-between mb-1">
                        <span className="text-[var(--ff-text-muted)]">{key}:</span>
                        <span className="text-[var(--ff-text-primary)]">{value}{getMetricUnit(key)}</span>
                      </div>
                    ))}
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
        
        {/* Data flow animation */}
        {activeFlow && isAnimating && (
          <g>
            {getFlowPath(activeFlow).map((segment, index) => (
              <circle
                key={index}
                r="4"
                fill={getFlowColor(activeFlow)}
                className="animate-pulse"
              >
                <animateMotion
                  dur="2s"
                  repeatCount="indefinite"
                  begin={`${index * 0.3}s`}
                >
                  <mpath href={`#flow-path-${activeFlow}-${index}`} />
                </animateMotion>
              </circle>
            ))}
          </g>
        )}
      </svg>
      
      {/* Flow controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          size="sm"
          variant={isAnimating ? "default" : "outline"}
          onClick={() => setIsAnimating(!isAnimating)}
          className="ff-btn-primary"
        >
          {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isAnimating ? 'Pause' : 'Animate'}
        </Button>
      </div>
    </div>
  );

  // Helper functions for positioning
  const getComponentPosition = (componentId: string) => {
    const positions: Record<string, { x: number; y: number }> = {
      'client': { x: 150, y: 100 },
      'edge-functions': { x: 400, y: 150 },
      'hono-server': { x: 600, y: 300 },
      'kv-store': { x: 850, y: 250 },
      'postgres': { x: 850, y: 450 },
      'realtime': { x: 400, y: 500 },
      'rate-limiter': { x: 600, y: 500 },
      'auth': { x: 400, y: 350 },
      'storage': { x: 150, y: 400 }
    };
    return positions[componentId] || { x: 0, y: 0 };
  };

  const isFlowPath = (sourceId: string, targetId: string, flowId: string) => {
    const flow = dataFlows.find(f => f.id === flowId);
    if (!flow) return false;
    
    const sourceIndex = flow.path.indexOf(sourceId);
    const targetIndex = flow.path.indexOf(targetId);
    
    return sourceIndex !== -1 && targetIndex !== -1 && Math.abs(sourceIndex - targetIndex) === 1;
  };

  const getFlowPath = (flowId: string) => {
    const flow = dataFlows.find(f => f.id === flowId);
    return flow ? flow.path : [];
  };

  const getFlowColor = (flowId: string) => {
    const flow = dataFlows.find(f => f.id === flowId);
    return flow ? flow.color : 'var(--ff-primary)';
  };

  const getMetricUnit = (metric: string) => {
    switch (metric) {
      case 'responseTime':
      case 'latency':
      case 'avgDuration': return 'ms';
      case 'hitRate':
      case 'cacheHit':
      case 'efficiency':
      case 'errors':
      case 'security': return '%';
      case 'storage': return 'GB';
      case 'bandwidth': return 'MB/s';
      case 'throughput': return '/s';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)]" style={{ fontFamily: 'var(--ff-font-secondary)' }}>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 ff-fade-in-up">
          <Badge className="ff-badge-secondary mb-4">
            <Server className="w-4 h-4 mr-2" />
            Backend Architecture
          </Badge>
          
          <h1 className="ff-text-display">
            FlashFusion
            <span className="ff-text-gradient"> Backend Infrastructure</span>
          </h1>
          
          <p className="ff-text-body max-w-3xl mx-auto">
            Interactive visualization of our scalable backend architecture featuring Supabase edge functions,
            Hono web server, real-time data channels, and intelligent microservice orchestration.
          </p>
        </div>

        {/* Architecture Diagram */}
        <Card className="ff-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="ff-text-title">System Architecture Overview</CardTitle>
                <p className="ff-text-sm text-[var(--ff-text-muted)]">Interactive diagram showing data flow and component relationships</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`ff-badge-${isAnimating ? 'success' : 'secondary'}`}>
                  {isAnimating ? 'Live' : 'Static'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ArchitectureDiagram />
          </CardContent>
        </Card>

        {/* Component Details and Flow Controls */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Data Flow Controls */}
          <Card className="ff-card">
            <CardHeader>
              <CardTitle className="ff-text-base">Data Flow Patterns</CardTitle>
              <p className="ff-text-sm text-[var(--ff-text-muted)]">Visualize different request flows</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {dataFlows.map(flow => (
                <button
                  key={flow.id}
                  onClick={() => setActiveFlow(activeFlow === flow.id ? null : flow.id)}
                  className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                    activeFlow === flow.id
                      ? 'border-[var(--ff-primary)] bg-[var(--ff-primary)]/10'
                      : 'border-[var(--border)] hover:border-[var(--ff-primary)]/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: flow.color }}
                    />
                    <span className="ff-text-sm text-[var(--ff-text-primary)]">{flow.name}</span>
                  </div>
                  <p className="ff-text-xs text-[var(--ff-text-muted)]">{flow.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {flow.path.map((step, index) => (
                      <React.Fragment key={step}>
                        <Badge variant="outline" className="ff-text-xs">
                          {architectureComponents[step as keyof typeof architectureComponents]?.name.split(' ')[0]}
                        </Badge>
                        {index < flow.path.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-[var(--ff-text-muted)] self-center" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Component Details */}
          <Card className="ff-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="ff-text-base">
                {selectedComponent 
                  ? architectureComponents[selectedComponent as keyof typeof architectureComponents]?.name
                  : 'Component Details'
                }
              </CardTitle>
              <p className="ff-text-sm text-[var(--ff-text-muted)]">
                {selectedComponent 
                  ? 'Real-time metrics and configuration details'
                  : 'Select a component in the diagram to view details'
                }
              </p>
            </CardHeader>
            <CardContent>
              {selectedComponent ? (
                (() => {
                  const component = architectureComponents[selectedComponent as keyof typeof architectureComponents];
                  const Icon = getComponentIcon(component.type);
                  
                  return (
                    <div className="space-y-6">
                      {/* Component Overview */}
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${getComponentColor(component.type, component.status)}20` }}
                        >
                          <Icon 
                            className="w-6 h-6"
                            style={{ color: getComponentColor(component.type, component.status) }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="ff-text-lg text-[var(--ff-text-primary)]">{component.name}</h3>
                            <Badge 
                              className={component.status === 'active' ? 'ff-badge-success' : 'ff-badge-error'}
                            >
                              {component.status}
                            </Badge>
                          </div>
                          <p className="ff-text-sm text-[var(--ff-text-secondary)]">{component.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="ff-text-xs">
                              Type: {component.type}
                            </Badge>
                            <Badge variant="outline" className="ff-text-xs">
                              Connections: {component.connections.length}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Metrics Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(component.metrics).map(([key, value]) => (
                          <div key={key} className="bg-[var(--ff-surface)] p-4 rounded-lg">
                            <div className="ff-text-xs text-[var(--ff-text-muted)] mb-1">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </div>
                            <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                              {typeof value === 'number' ? value.toLocaleString() : value}
                              {getMetricUnit(key)}
                            </div>
                            {key.includes('rate') || key.includes('efficiency') ? (
                              <Progress value={typeof value === 'number' ? value : 0} className="h-1 mt-2" />
                            ) : null}
                          </div>
                        ))}
                      </div>

                      {/* Connected Components */}
                      {component.connections.length > 0 && (
                        <div>
                          <h4 className="ff-text-sm text-[var(--ff-text-primary)] mb-3">Connected Components</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {component.connections.map(connId => {
                              const connectedComponent = architectureComponents[connId as keyof typeof architectureComponents];
                              const ConnIcon = getComponentIcon(connectedComponent.type);
                              
                              return (
                                <button
                                  key={connId}
                                  onClick={() => setSelectedComponent(connId)}
                                  className="flex items-center gap-3 p-3 bg-[var(--ff-surface)] hover:bg-[var(--ff-surface-light)] rounded-lg transition-colors text-left"
                                >
                                  <div 
                                    className="w-8 h-8 rounded-md flex items-center justify-center"
                                    style={{ backgroundColor: `${getComponentColor(connectedComponent.type, connectedComponent.status)}20` }}
                                  >
                                    <ConnIcon 
                                      className="w-4 h-4"
                                      style={{ color: getComponentColor(connectedComponent.type, connectedComponent.status) }}
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <div className="ff-text-sm text-[var(--ff-text-primary)]">{connectedComponent.name}</div>
                                    <div className="ff-text-xs text-[var(--ff-text-muted)]">{connectedComponent.type}</div>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-[var(--ff-text-muted)]" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-12">
                  <Eye className="w-12 h-12 text-[var(--ff-text-muted)] mx-auto mb-4" />
                  <p className="ff-text-base text-[var(--ff-text-muted)]">
                    Click on any component in the architecture diagram to view detailed metrics and connections.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Technical Specifications */}
        <Card className="ff-card">
          <CardHeader>
            <CardTitle className="ff-text-title">Technical Specifications</CardTitle>
            <p className="ff-text-body">Detailed breakdown of backend architecture components and capabilities</p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="microservices" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-[var(--ff-surface)]">
                <TabsTrigger value="microservices">Microservices</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="scaling">Scaling</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              <TabsContent value="microservices" className="space-y-6 mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.values(architectureComponents).map(component => {
                    const Icon = getComponentIcon(component.type);
                    
                    return (
                      <Card key={component.id} className="ff-card">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${getComponentColor(component.type, component.status)}20` }}
                            >
                              <Icon 
                                className="w-5 h-5"
                                style={{ color: getComponentColor(component.type, component.status) }}
                              />
                            </div>
                            <div>
                              <CardTitle className="ff-text-sm">{component.name}</CardTitle>
                              <Badge variant="outline" className="ff-text-xs mt-1">
                                {component.type}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="ff-text-sm text-[var(--ff-text-secondary)] mb-4">
                            {component.description}
                          </p>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="ff-text-xs text-[var(--ff-text-muted)]">Status</span>
                              <Badge className={component.status === 'active' ? 'ff-badge-success' : 'ff-badge-error'}>
                                {component.status}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="ff-text-xs text-[var(--ff-text-muted)]">Connections</span>
                              <span className="ff-text-xs text-[var(--ff-text-primary)]">
                                {component.connections.length} services
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
              
              <TabsContent value="performance" className="space-y-6 mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">Response Times</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { service: 'Edge Functions', time: 85, target: 100 },
                        { service: 'Hono Server', time: 45, target: 50 },
                        { service: 'KV Store', time: 12, target: 20 },
                        { service: 'Real-time Channels', time: 12, target: 15 }
                      ].map((metric, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="ff-text-sm text-[var(--ff-text-primary)]">{metric.service}</span>
                            <span className="ff-text-sm text-[var(--ff-text-secondary)]">{metric.time}ms</span>
                          </div>
                          <Progress value={(metric.time / metric.target) * 100} className="h-2" />
                          <div className="ff-text-xs text-[var(--ff-text-muted)]">
                            Target: {metric.target}ms
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">Throughput Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { metric: 'API Requests/sec', value: 1200, unit: '/s' },
                        { metric: 'Database Queries/sec', value: 450, unit: '/s' },
                        { metric: 'WebSocket Messages/sec', value: 2834, unit: '/s' },
                        { metric: 'Cache Hit Rate', value: 94.2, unit: '%' }
                      ].map((metric, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="ff-text-sm text-[var(--ff-text-primary)]">{metric.metric}</span>
                          <div className="text-right">
                            <div className="ff-text-sm text-[var(--ff-text-secondary)]">
                              {metric.value.toLocaleString()}{metric.unit}
                            </div>
                            <TrendingUp className="w-3 h-3 text-[var(--ff-success)] inline ml-1" />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="scaling" className="space-y-6 mt-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">Auto-scaling Policies</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        'CPU usage > 70% → Scale up',
                        'Memory usage > 80% → Scale up',
                        'Request rate > 1000/s → Scale up',
                        'Error rate > 5% → Alert + Scale',
                        'Response time > 200ms → Scale up'
                      ].map((policy, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Settings className="w-4 h-4 text-[var(--ff-primary)] mt-0.5 flex-shrink-0" />
                          <span className="ff-text-sm text-[var(--ff-text-secondary)]">{policy}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">Current Scale</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { component: 'Edge Functions', instances: 8, max: 20 },
                        { component: 'API Servers', instances: 4, max: 12 },
                        { component: 'WebSocket Nodes', instances: 3, max: 8 },
                        { component: 'Database Replicas', instances: 2, max: 5 }
                      ].map((scale, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="ff-text-sm text-[var(--ff-text-primary)]">{scale.component}</span>
                            <span className="ff-text-sm text-[var(--ff-text-secondary)]">
                              {scale.instances}/{scale.max}
                            </span>
                          </div>
                          <Progress value={(scale.instances / scale.max) * 100} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">Capacity Planning</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { metric: 'Peak Concurrent Users', current: '2.5K', capacity: '10K' },
                        { metric: 'Database Connections', current: '45', capacity: '500' },
                        { metric: 'Storage Usage', current: '2.1GB', capacity: '100GB' },
                        { metric: 'Bandwidth', current: '450MB/s', capacity: '2GB/s' }
                      ].map((capacity, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="ff-text-sm text-[var(--ff-text-primary)]">{capacity.metric}</span>
                          <div className="text-right">
                            <div className="ff-text-sm text-[var(--ff-text-secondary)]">
                              {capacity.current} / {capacity.capacity}
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-6 mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">Security Measures</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { measure: 'JWT Token Authentication', status: 'active' },
                        { measure: 'API Rate Limiting', status: 'active' },
                        { measure: 'CORS Protection', status: 'active' },
                        { measure: 'SQL Injection Prevention', status: 'active' },
                        { measure: 'Encryption at Rest', status: 'active' },
                        { measure: 'TLS 1.3 Encryption', status: 'active' },
                        { measure: 'DDoS Protection', status: 'active' },
                        { measure: 'Intrusion Detection', status: 'active' }
                      ].map((security, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="ff-text-sm text-[var(--ff-text-primary)]">{security.measure}</span>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[var(--ff-success)]" />
                            <Badge className="ff-badge-success">Active</Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">Security Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { metric: 'Failed Auth Attempts', value: 12, trend: 'down' },
                        { metric: 'Blocked Requests', value: 89, trend: 'stable' },
                        { metric: 'Security Score', value: 98.5, trend: 'up' },
                        { metric: 'Vulnerability Scans', value: 0, trend: 'stable' }
                      ].map((metric, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="ff-text-sm text-[var(--ff-text-primary)]">{metric.metric}</span>
                          <div className="flex items-center gap-2">
                            <span className="ff-text-sm text-[var(--ff-text-secondary)]">
                              {metric.value}{metric.metric.includes('Score') ? '%' : ''}
                            </span>
                            {metric.trend === 'up' && <ArrowUp className="w-3 h-3 text-[var(--ff-success)]" />}
                            {metric.trend === 'down' && <ArrowDown className="w-3 h-3 text-[var(--ff-success)]" />}
                            {metric.trend === 'stable' && <Activity className="w-3 h-3 text-[var(--ff-warning)]" />}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

export default BackendArchitectureVisualization;
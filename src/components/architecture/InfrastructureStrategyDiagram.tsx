/**
 * @fileoverview FlashFusion Infrastructure Strategy Diagram
 * @chunk architecture
 * @category infrastructure
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * High-level system architecture diagram illustrating multi-region deployment,
 * CDN nodes, load balancers, auto-scaling application servers, centralized database cluster,
 * monitoring tools (DataDog/New Relic), and error tracking (Sentry).
 * 
 * Features:
 * - Interactive multi-region deployment visualization
 * - Real-time infrastructure monitoring
 * - Auto-scaling demonstration
 * - CDN and load balancer topology
 * - Database cluster visualization
 * - Monitoring and alerting systems
 * - Performance metrics dashboard
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Globe, 
  Server, 
  Database, 
  Shield, 
  Zap, 
  Activity, 
  BarChart3,
  Eye,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Clock,
  Cpu,
  HardDrive,
  Network,
  Cloud,
  MapPin,
  Users,
  RefreshCw,
  Settings,
  MonitorSpeaker,
  Layers,
  Box,
  Triangle,
  Circle,
  Square,
  Hexagon,
  Play,
  Pause,
  Info,
  Target,
  Wifi,
  Router,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

// Infrastructure regions and data centers
const regions = {
  'us-east-1': {
    name: 'US East (Virginia)',
    coordinates: { x: 300, y: 200 },
    status: 'healthy',
    load: 65,
    servers: 12,
    connections: 4521,
    latency: 23,
    primary: true
  },
  'us-west-2': {
    name: 'US West (Oregon)',
    coordinates: { x: 150, y: 180 },
    status: 'healthy',
    load: 45,
    servers: 8,
    connections: 2890,
    latency: 18,
    primary: false
  },
  'eu-west-1': {
    name: 'EU West (Ireland)',
    coordinates: { x: 500, y: 150 },
    status: 'healthy',
    load: 72,
    servers: 10,
    connections: 3456,
    latency: 28,
    primary: false
  },
  'ap-southeast-1': {
    name: 'Asia Pacific (Singapore)',
    coordinates: { x: 700, y: 250 },
    status: 'warning',
    load: 89,
    servers: 6,
    connections: 1890,
    latency: 45,
    primary: false
  },
  'ap-northeast-1': {
    name: 'Asia Pacific (Tokyo)',
    coordinates: { x: 750, y: 200 },
    status: 'healthy',
    load: 56,
    servers: 9,
    connections: 2234,
    latency: 32,
    primary: false
  }
};

// CDN edge locations
const cdnNodes = [
  { id: 'cdn-1', region: 'us-east-1', type: 'primary', traffic: 45, status: 'healthy' },
  { id: 'cdn-2', region: 'us-west-2', type: 'edge', traffic: 32, status: 'healthy' },
  { id: 'cdn-3', region: 'eu-west-1', type: 'edge', traffic: 38, status: 'healthy' },
  { id: 'cdn-4', region: 'ap-southeast-1', type: 'edge', traffic: 28, status: 'warning' },
  { id: 'cdn-5', region: 'ap-northeast-1', type: 'edge', traffic: 35, status: 'healthy' }
];

// Infrastructure components
const infrastructureComponents = {
  loadBalancer: {
    name: 'Global Load Balancer',
    type: 'networking',
    status: 'healthy',
    metrics: { requests: 15420, distribution: 'round-robin', healthChecks: 100 }
  },
  autoscaler: {
    name: 'Auto-scaling Manager',
    type: 'orchestration',
    status: 'healthy',
    metrics: { instances: 45, scaling: 'enabled', triggers: 3 }
  },
  database: {
    name: 'Database Cluster',
    type: 'storage',
    status: 'healthy',
    metrics: { connections: 234, replicas: 5, shards: 8 }
  },
  monitoring: {
    name: 'Monitoring Stack',
    type: 'observability',
    status: 'healthy',
    metrics: { alerts: 2, uptime: 99.98, coverage: 100 }
  },
  cdn: {
    name: 'Content Delivery Network',
    type: 'edge',
    status: 'healthy',
    metrics: { nodes: 150, cacheHit: 94.2, bandwidth: 2.1 }
  }
};

// Monitoring tools configuration
const monitoringTools = [
  {
    name: 'DataDog',
    type: 'metrics',
    status: 'active',
    coverage: ['Infrastructure', 'Application', 'Logs', 'Traces'],
    alerts: 2,
    dashboards: 15
  },
  {
    name: 'New Relic',
    type: 'apm',
    status: 'active',
    coverage: ['Performance', 'Errors', 'Browser', 'Mobile'],
    alerts: 0,
    dashboards: 8
  },
  {
    name: 'Sentry',
    type: 'errors',
    status: 'active',
    coverage: ['Error Tracking', 'Performance', 'Releases', 'Issues'],
    alerts: 1,
    dashboards: 4
  }
];

interface InfrastructureStrategyDiagramProps {
  // Optional props for customization
}

/**
 * FlashFusion Infrastructure Strategy Diagram Component
 */
export function InfrastructureStrategyDiagram({}: InfrastructureStrategyDiagramProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentView, setCurrentView] = useState<'global' | 'regional' | 'monitoring'>('global');

  // Simulate real-time metrics updates
  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        // Simulate metric updates
        Object.keys(regions).forEach(regionKey => {
          const region = regions[regionKey as keyof typeof regions];
          region.load += (Math.random() - 0.5) * 5;
          region.load = Math.max(0, Math.min(100, region.load));
          region.connections += Math.floor((Math.random() - 0.5) * 100);
          region.connections = Math.max(0, region.connections);
        });
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  // Global infrastructure diagram
  const GlobalInfrastructureDiagram = () => (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-[var(--ff-surface)] to-[var(--ff-surface-light)] rounded-lg border border-[var(--border)] overflow-hidden">
      
      {/* World map background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 900 600">
          {/* Simplified world map outline */}
          <path
            d="M100,200 Q200,180 300,200 Q400,190 500,200 Q600,185 700,200 Q800,195 850,200 
               L850,300 Q800,310 700,300 Q600,305 500,300 Q400,295 300,300 Q200,305 100,300 Z
               M150,350 Q250,340 350,350 Q450,345 550,350 Q650,355 750,350 
               L750,400 Q650,410 550,400 Q450,395 350,400 Q250,405 150,400 Z"
            fill="currentColor"
            opacity="0.1"
          />
        </svg>
      </div>

      <svg width="100%" height="100%" viewBox="0 0 900 600" className="absolute inset-0">
        {/* Connection lines between regions */}
        {Object.entries(regions).map(([sourceKey, source]) =>
          Object.entries(regions).filter(([targetKey]) => targetKey !== sourceKey).map(([targetKey, target]) => (
            <line
              key={`${sourceKey}-${targetKey}`}
              x1={source.coordinates.x}
              y1={source.coordinates.y}
              x2={target.coordinates.x}
              y2={target.coordinates.y}
              stroke="rgba(255, 123, 0, 0.2)"
              strokeWidth="1"
              strokeDasharray="5,5"
              className={isAnimating ? 'animate-pulse' : ''}
            />
          ))
        )}

        {/* Region nodes */}
        {Object.entries(regions).map(([regionKey, region]) => (
          <g key={regionKey} className="cursor-pointer" onClick={() => setSelectedRegion(regionKey)}>
            {/* Region circle */}
            <circle
              cx={region.coordinates.x}
              cy={region.coordinates.y}
              r={region.primary ? 25 : 20}
              fill={region.status === 'healthy' ? 'var(--ff-success)' : 'var(--ff-warning)'}
              fillOpacity={0.2}
              stroke={region.status === 'healthy' ? 'var(--ff-success)' : 'var(--ff-warning)'}
              strokeWidth={selectedRegion === regionKey ? 3 : 2}
              className="transition-all duration-300"
            />
            
            {/* Load indicator */}
            <circle
              cx={region.coordinates.x}
              cy={region.coordinates.y}
              r={region.primary ? 15 : 12}
              fill="none"
              stroke={region.status === 'healthy' ? 'var(--ff-success)' : 'var(--ff-warning)'}
              strokeWidth="3"
              strokeDasharray={`${(region.load / 100) * (2 * Math.PI * (region.primary ? 15 : 12))} ${2 * Math.PI * (region.primary ? 15 : 12)}`}
              transform={`rotate(-90 ${region.coordinates.x} ${region.coordinates.y})`}
              className={isAnimating ? 'animate-pulse' : ''}
            />

            {/* Primary indicator */}
            {region.primary && (
              <circle
                cx={region.coordinates.x}
                cy={region.coordinates.y - 35}
                r="4"
                fill="var(--ff-primary)"
                className={isAnimating ? 'animate-pulse' : ''}
              />
            )}

            {/* Region label */}
            <text
              x={region.coordinates.x}
              y={region.coordinates.y + 45}
              textAnchor="middle"
              className="fill-current text-[var(--ff-text-primary)] ff-text-xs font-medium"
            >
              {region.name.split(' ')[0]}
            </text>

            {/* Metrics tooltip */}
            {selectedRegion === regionKey && (
              <foreignObject
                x={region.coordinates.x - 70}
                y={region.coordinates.y + 60}
                width="140"
                height="100"
              >
                <div className="bg-[var(--ff-surface-light)] border border-[var(--border)] rounded-lg p-3 text-xs">
                  <div className="ff-text-sm font-medium mb-2">{region.name}</div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Load:</span>
                      <span>{Math.round(region.load)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Servers:</span>
                      <span>{region.servers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Latency:</span>
                      <span>{region.latency}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Connections:</span>
                      <span>{region.connections}</span>
                    </div>
                  </div>
                </div>
              </foreignObject>
            )}
          </g>
        ))}

        {/* CDN edge locations */}
        {cdnNodes.map(node => {
          const region = regions[node.region as keyof typeof regions];
          return (
            <g key={node.id}>
              <circle
                cx={region.coordinates.x + (Math.random() - 0.5) * 60}
                cy={region.coordinates.y + (Math.random() - 0.5) * 60}
                r="8"
                fill="var(--ff-secondary)"
                fillOpacity={0.3}
                stroke="var(--ff-secondary)"
                strokeWidth="1"
                className={isAnimating ? 'animate-pulse' : ''}
              />
            </g>
          );
        })}

        {/* Global load balancer */}
        <g>
          <circle
            cx="450"
            cy="100"
            r="15"
            fill="var(--ff-primary)"
            fillOpacity={0.2}
            stroke="var(--ff-primary)"
            strokeWidth="2"
          />
          <text
            x="450"
            y="80"
            textAnchor="middle"
            className="fill-current text-[var(--ff-text-primary)] ff-text-xs font-medium"
          >
            Global LB
          </text>
        </g>
      </svg>

      {/* Controls */}
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

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-[var(--ff-surface-light)] border border-[var(--border)] rounded-lg p-3">
        <div className="ff-text-xs font-medium mb-2">Legend</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[var(--ff-success)]"></div>
            <span className="ff-text-xs">Healthy Region</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[var(--ff-warning)]"></div>
            <span className="ff-text-xs">Warning Region</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--ff-secondary)]"></div>
            <span className="ff-text-xs">CDN Edge</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--ff-primary)]"></div>
            <span className="ff-text-xs">Load Balancer</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)]" style={{ fontFamily: 'var(--ff-font-secondary)' }}>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 ff-fade-in-up">
          <Badge className="ff-badge-accent mb-4">
            <Globe className="w-4 h-4 mr-2" />
            Infrastructure Strategy
          </Badge>
          
          <h1 className="ff-text-display">
            Global
            <span className="ff-text-gradient"> Infrastructure</span>
          </h1>
          
          <p className="ff-text-body max-w-3xl mx-auto">
            Multi-region deployment strategy with CDN nodes, load balancers, auto-scaling application servers,
            centralized database clusters, and comprehensive monitoring across all infrastructure layers.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 p-1 bg-[var(--ff-surface)] rounded-lg">
            {[
              { key: 'global', label: 'Global View', icon: Globe },
              { key: 'regional', label: 'Regional', icon: MapPin },
              { key: 'monitoring', label: 'Monitoring', icon: Eye }
            ].map((view) => (
              <button
                key={view.key}
                onClick={() => setCurrentView(view.key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  currentView === view.key
                    ? 'bg-[var(--ff-primary)] text-white'
                    : 'text-[var(--ff-text-muted)] hover:text-[var(--ff-text-primary)]'
                }`}
              >
                <view.icon className="w-4 h-4" />
                <span className="ff-text-sm font-medium">{view.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Infrastructure Diagram */}
        <Card className="ff-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="ff-text-title">
                  {currentView === 'global' && 'Global Infrastructure Topology'}
                  {currentView === 'regional' && 'Regional Architecture Details'}
                  {currentView === 'monitoring' && 'Monitoring & Observability Stack'}
                </CardTitle>
                <p className="ff-text-sm text-[var(--ff-text-muted)]">
                  Interactive visualization of FlashFusion's distributed infrastructure
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`ff-badge-${isAnimating ? 'success' : 'secondary'}`}>
                  {isAnimating ? 'Live' : 'Static'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {currentView === 'global' && <GlobalInfrastructureDiagram />}
            
            {currentView === 'regional' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(regions).map(([regionKey, region]) => (
                    <Card key={regionKey} className="ff-card">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="ff-text-sm">{region.name}</CardTitle>
                            <Badge 
                              className={region.status === 'healthy' ? 'ff-badge-success' : 'ff-badge-warning'}
                            >
                              {region.status}
                            </Badge>
                          </div>
                          {region.primary && (
                            <Badge className="ff-badge-primary">Primary</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <div className="ff-text-xs text-[var(--ff-text-muted)]">Load</div>
                            <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                              {Math.round(region.load)}%
                            </div>
                            <Progress value={region.load} className="h-1" />
                          </div>
                          <div className="space-y-1">
                            <div className="ff-text-xs text-[var(--ff-text-muted)]">Servers</div>
                            <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                              {region.servers}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="ff-text-xs text-[var(--ff-text-muted)]">Connections</div>
                            <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                              {region.connections.toLocaleString()}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="ff-text-xs text-[var(--ff-text-muted)]">Latency</div>
                            <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                              {region.latency}ms
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {currentView === 'monitoring' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {monitoringTools.map((tool, index) => (
                    <Card key={index} className="ff-card">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="ff-text-base">{tool.name}</CardTitle>
                          <Badge className={tool.status === 'active' ? 'ff-badge-success' : 'ff-badge-secondary'}>
                            {tool.status}
                          </Badge>
                        </div>
                        <p className="ff-text-sm text-[var(--ff-text-muted)]">{tool.type.toUpperCase()}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center">
                            <div className="ff-text-xs text-[var(--ff-text-muted)]">Active Alerts</div>
                            <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                              {tool.alerts}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="ff-text-xs text-[var(--ff-text-muted)]">Dashboards</div>
                            <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                              {tool.dashboards}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="ff-text-xs text-[var(--ff-text-muted)] mb-2">Coverage Areas</div>
                          <div className="flex flex-wrap gap-1">
                            {tool.coverage.map((area, idx) => (
                              <Badge key={idx} variant="outline" className="ff-text-xs">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Infrastructure Components Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {Object.entries(infrastructureComponents).map(([key, component]) => {
            const getIcon = (type: string) => {
              switch (type) {
                case 'networking': return Network;
                case 'orchestration': return Settings;
                case 'storage': return Database;
                case 'observability': return Eye;
                case 'edge': return Globe;
                default: return Box;
              }
            };
            
            const Icon = getIcon(component.type);
            
            return (
              <Card key={key} className="ff-card">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--ff-primary)]/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[var(--ff-primary)]" />
                    </div>
                    <div>
                      <CardTitle className="ff-text-sm">{component.name}</CardTitle>
                      <Badge className={component.status === 'healthy' ? 'ff-badge-success' : 'ff-badge-warning'}>
                        {component.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(component.metrics).map(([metricKey, value]) => (
                      <div key={metricKey} className="flex justify-between items-center">
                        <span className="ff-text-xs text-[var(--ff-text-muted)]">
                          {metricKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <span className="ff-text-xs text-[var(--ff-text-primary)]">
                          {typeof value === 'number' ? value.toLocaleString() : value}
                          {metricKey.includes('rate') || metricKey.includes('uptime') ? '%' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Technical Specifications */}
        <Card className="ff-card">
          <CardHeader>
            <CardTitle className="ff-text-title">Infrastructure Specifications</CardTitle>
            <p className="ff-text-body">Detailed technical breakdown of infrastructure capabilities and scaling policies</p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="scaling" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-[var(--ff-surface)]">
                <TabsTrigger value="scaling">Auto-scaling</TabsTrigger>
                <TabsTrigger value="networking">Networking</TabsTrigger>
                <TabsTrigger value="storage">Storage</TabsTrigger>
                <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
              </TabsList>
              
              <TabsContent value="scaling" className="space-y-6 mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">Scaling Policies</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { trigger: 'CPU > 70%', action: 'Scale up +2 instances', cooldown: '5 min' },
                        { trigger: 'Memory > 80%', action: 'Scale up +1 instance', cooldown: '3 min' },
                        { trigger: 'Requests > 1000/s', action: 'Scale up +3 instances', cooldown: '2 min' },
                        { trigger: 'Error rate > 5%', action: 'Alert + Scale up', cooldown: '1 min' }
                      ].map((policy, index) => (
                        <div key={index} className="p-3 bg-[var(--ff-surface)] rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <span className="ff-text-sm text-[var(--ff-text-primary)]">{policy.trigger}</span>
                            <Badge variant="outline" className="ff-text-xs">
                              {policy.cooldown}
                            </Badge>
                          </div>
                          <div className="ff-text-xs text-[var(--ff-text-muted)]">{policy.action}</div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">Current Capacity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { resource: 'Application Servers', current: 45, max: 100, usage: 45 },
                        { resource: 'Database Replicas', current: 5, max: 20, usage: 25 },
                        { resource: 'Load Balancers', current: 3, max: 10, usage: 30 },
                        { resource: 'CDN Nodes', current: 150, max: 500, usage: 30 }
                      ].map((capacity, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="ff-text-sm text-[var(--ff-text-primary)]">{capacity.resource}</span>
                            <span className="ff-text-sm text-[var(--ff-text-secondary)]">
                              {capacity.current}/{capacity.max}
                            </span>
                          </div>
                          <Progress value={capacity.usage} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="networking" className="space-y-6 mt-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">Load Balancing</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { metric: 'Algorithm', value: 'Round Robin' },
                        { metric: 'Health Checks', value: 'Every 30s' },
                        { metric: 'Failover Time', value: '< 2s' },
                        { metric: 'SSL Termination', value: 'Enabled' },
                        { metric: 'Sticky Sessions', value: 'Disabled' }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="ff-text-sm text-[var(--ff-text-primary)]">{item.metric}</span>
                          <span className="ff-text-sm text-[var(--ff-text-secondary)]">{item.value}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">CDN Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { metric: 'Edge Locations', value: '150+' },
                        { metric: 'Cache Hit Rate', value: '94.2%' },
                        { metric: 'Origin Shield', value: 'Enabled' },
                        { metric: 'Compression', value: 'Gzip + Brotli' },
                        { metric: 'TTL Default', value: '24h' }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="ff-text-sm text-[var(--ff-text-primary)]">{item.metric}</span>
                          <span className="ff-text-sm text-[var(--ff-text-secondary)]">{item.value}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">Security</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { metric: 'DDoS Protection', value: 'Active' },
                        { metric: 'WAF Rules', value: '125 Active' },
                        { metric: 'Rate Limiting', value: '1000/min' },
                        { metric: 'IP Whitelist', value: 'Configured' },
                        { metric: 'SSL/TLS', value: 'v1.3' }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="ff-text-sm text-[var(--ff-text-primary)]">{item.metric}</span>
                          <span className="ff-text-sm text-[var(--ff-text-secondary)]">{item.value}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="storage" className="space-y-6 mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">Database Cluster</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { cluster: 'Primary (Write)', region: 'us-east-1', status: 'healthy', load: 65 },
                        { cluster: 'Read Replica 1', region: 'us-west-2', status: 'healthy', load: 45 },
                        { cluster: 'Read Replica 2', region: 'eu-west-1', status: 'healthy', load: 72 },
                        { cluster: 'Read Replica 3', region: 'ap-southeast-1', status: 'warning', load: 89 }
                      ].map((db, index) => (
                        <div key={index} className="p-3 bg-[var(--ff-surface)] rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="ff-text-sm text-[var(--ff-text-primary)]">{db.cluster}</span>
                            <Badge className={db.status === 'healthy' ? 'ff-badge-success' : 'ff-badge-warning'}>
                              {db.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="ff-text-xs text-[var(--ff-text-muted)]">{db.region}</span>
                            <span className="ff-text-xs text-[var(--ff-text-secondary)]">{db.load}% load</span>
                          </div>
                          <Progress value={db.load} className="h-1" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">Backup Strategy</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { type: 'Continuous Backup', frequency: 'Real-time', retention: '30 days' },
                        { type: 'Daily Snapshots', frequency: 'Daily', retention: '90 days' },
                        { type: 'Weekly Archives', frequency: 'Weekly', retention: '1 year' },
                        { type: 'Monthly Long-term', frequency: 'Monthly', retention: '7 years' }
                      ].map((backup, index) => (
                        <div key={index} className="p-3 bg-[var(--ff-surface)] rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="ff-text-sm text-[var(--ff-text-primary)]">{backup.type}</span>
                            <CheckCircle className="w-4 h-4 text-[var(--ff-success)]" />
                          </div>
                          <div className="flex justify-between">
                            <span className="ff-text-xs text-[var(--ff-text-muted)]">{backup.frequency}</span>
                            <span className="ff-text-xs text-[var(--ff-text-secondary)]">{backup.retention}</span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="monitoring" className="space-y-6 mt-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {monitoringTools.map((tool, index) => (
                    <Card key={index} className="ff-card">
                      <CardHeader>
                        <CardTitle className="ff-text-base">{tool.name} Configuration</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center p-3 bg-[var(--ff-surface)] rounded-lg">
                            <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                              {tool.alerts}
                            </div>
                            <div className="ff-text-xs text-[var(--ff-text-muted)]">Active Alerts</div>
                          </div>
                          <div className="text-center p-3 bg-[var(--ff-surface)] rounded-lg">
                            <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                              {tool.dashboards}
                            </div>
                            <div className="ff-text-xs text-[var(--ff-text-muted)]">Dashboards</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="ff-text-xs text-[var(--ff-text-muted)] mb-2">Monitoring Coverage</div>
                          <div className="space-y-1">
                            {tool.coverage.map((area, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-[var(--ff-success)]" />
                                <span className="ff-text-xs text-[var(--ff-text-secondary)]">{area}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

export default InfrastructureStrategyDiagram;
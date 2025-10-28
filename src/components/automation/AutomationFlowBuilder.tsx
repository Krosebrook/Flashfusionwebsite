import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Plus,
  Play,
  Pause,
  Save,
  Download,
  Upload,
  Settings,
  Trash2,
  Copy,
  Link,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  Brain,
  Palette,
  TrendingUp,
  Cog,
  BarChart3,
  Network,
  GitBranch,
  Timer,
  Database,
  Globe
} from 'lucide-react';

interface FlowNode {
  id: string;
  type: 'agent' | 'trigger' | 'action' | 'condition' | 'delay';
  position: { x: number; y: number };
  data: {
    label: string;
    agentType?: string;
    agentColor?: string;
    agentIcon?: React.ComponentType<{ className?: string }>;
    description?: string;
    config?: Record<string, any>;
    status?: 'idle' | 'running' | 'completed' | 'error';
    executionTime?: number;
  };
}

interface FlowConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  animated?: boolean;
  style?: React.CSSProperties;
}

interface AutomationFlow {
  id: string;
  name: string;
  description: string;
  nodes: FlowNode[];
  connections: FlowConnection[];
  isActive: boolean;
  lastRun?: Date;
  runCount: number;
  successRate: number;
}

const AGENT_TYPES = {
  researcher: { name: 'Researcher', color: '#61dafb', icon: Brain },
  creator: { name: 'Creator', color: '#d14d21', icon: Palette },
  optimizer: { name: 'Optimizer', color: '#10b981', icon: TrendingUp },
  automator: { name: 'Automator', color: '#764ba2', icon: Cog },
  analyzer: { name: 'Analyzer', color: '#667eea', icon: BarChart3 },
  orchestrator: { name: 'Orchestrator', color: '#2a5298', icon: Network }
};

const SAMPLE_FLOWS: AutomationFlow[] = [
  {
    id: 'flow-1',
    name: 'Content Creation Pipeline',
    description: 'Automated workflow for creating, optimizing, and publishing content across multiple platforms',
    isActive: true,
    lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
    runCount: 47,
    successRate: 94.7,
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: {
          label: 'Content Request',
          description: 'Triggered when new content is requested',
          status: 'idle'
        }
      },
      {
        id: 'researcher-1',
        type: 'agent',
        position: { x: 300, y: 100 },
        data: {
          label: 'Market Research',
          agentType: 'researcher',
          agentColor: '#61dafb',
          agentIcon: Brain,
          description: 'Analyze market trends and audience preferences',
          status: 'completed',
          executionTime: 45
        }
      },
      {
        id: 'creator-1',
        type: 'agent',
        position: { x: 500, y: 100 },
        data: {
          label: 'Content Generation',
          agentType: 'creator',
          agentColor: '#d14d21',
          agentIcon: Palette,
          description: 'Generate content based on research insights',
          status: 'running',
          executionTime: 120
        }
      },
      {
        id: 'optimizer-1',
        type: 'agent',
        position: { x: 700, y: 100 },
        data: {
          label: 'Content Optimization',
          agentType: 'optimizer',
          agentColor: '#10b981',
          agentIcon: TrendingUp,
          description: 'Optimize content for different platforms',
          status: 'idle'
        }
      }
    ],
    connections: [
      {
        id: 'conn-1',
        source: 'trigger-1',
        target: 'researcher-1',
        animated: true
      },
      {
        id: 'conn-2',
        source: 'researcher-1',
        target: 'creator-1',
        animated: true
      },
      {
        id: 'conn-3',
        source: 'creator-1',
        target: 'optimizer-1',
        animated: false
      }
    ]
  }
];

export function AutomationFlowBuilder() {
  const [flows, setFlows] = useState<AutomationFlow[]>(SAMPLE_FLOWS);
  const [selectedFlow, setSelectedFlow] = useState<AutomationFlow | null>(flows[0]);
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleNodeDragStart = (node: FlowNode, event: React.MouseEvent) => {
    setSelectedNode(node);
    setIsDragging(true);
    const rect = event.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  };

  const handleNodeDrag = useCallback((event: React.MouseEvent) => {
    if (!isDragging || !selectedNode || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = event.clientX - canvasRect.left - dragOffset.x;
    const newY = event.clientY - canvasRect.top - dragOffset.y;

    if (selectedFlow) {
      const updatedNodes = selectedFlow.nodes.map(node =>
        node.id === selectedNode.id
          ? { ...node, position: { x: Math.max(0, newX), y: Math.max(0, newY) } }
          : node
      );
      
      const updatedFlow = { ...selectedFlow, nodes: updatedNodes };
      setSelectedFlow(updatedFlow);
      setFlows(prev => prev.map(f => f.id === updatedFlow.id ? updatedFlow : f));
    }
  }, [isDragging, selectedNode, selectedFlow, dragOffset]);

  const handleNodeDragEnd = () => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const addNode = (type: FlowNode['type'], agentType?: string) => {
    if (!selectedFlow) return;

    const newNode: FlowNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 200, y: 200 },
      data: {
        label: agentType ? AGENT_TYPES[agentType as keyof typeof AGENT_TYPES].name : `New ${type}`,
        agentType,
        agentColor: agentType ? AGENT_TYPES[agentType as keyof typeof AGENT_TYPES].color : undefined,
        agentIcon: agentType ? AGENT_TYPES[agentType as keyof typeof AGENT_TYPES].icon : undefined,
        description: `${type} node description`,
        status: 'idle'
      }
    };

    const updatedFlow = {
      ...selectedFlow,
      nodes: [...selectedFlow.nodes, newNode]
    };

    setSelectedFlow(updatedFlow);
    setFlows(prev => prev.map(f => f.id === updatedFlow.id ? updatedFlow : f));
  };

  const deleteNode = (nodeId: string) => {
    if (!selectedFlow) return;

    const updatedFlow = {
      ...selectedFlow,
      nodes: selectedFlow.nodes.filter(n => n.id !== nodeId),
      connections: selectedFlow.connections.filter(c => c.source !== nodeId && c.target !== nodeId)
    };

    setSelectedFlow(updatedFlow);
    setFlows(prev => prev.map(f => f.id === updatedFlow.id ? updatedFlow : f));
    setSelectedNode(null);
  };

  const getStatusIcon = (status: FlowNode['data']['status']) => {
    switch (status) {
      case 'running':
        return Play;
      case 'completed':
        return CheckCircle;
      case 'error':
        return AlertCircle;
      default:
        return Pause;
    }
  };

  const getStatusColor = (status: FlowNode['data']['status']) => {
    switch (status) {
      case 'running':
        return '#3B82F6';
      case 'completed':
        return '#10B981';
      case 'error':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const FlowNodeComponent = ({ node }: { node: FlowNode }) => {
    const StatusIcon = getStatusIcon(node.data.status);
    const statusColor = getStatusColor(node.data.status);
    const isSelected = selectedNode?.id === node.id;

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
        dragMomentum={false}
        onMouseDown={(e) => handleNodeDragStart(node, e.nativeEvent)}
      >
        <Card 
          className={`cursor-move transition-all duration-300 w-48 ${
            isSelected ? 'ring-2 shadow-lg' : 'hover:shadow-md'
          }`}
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: node.data.agentColor 
              ? `2px solid ${node.data.agentColor}30`
              : '1px solid rgba(255, 255, 255, 0.2)',
            ringColor: node.data.agentColor || '#3B82F6',
            boxShadow: isSelected 
              ? `0 8px 32px rgba(0, 0, 0, 0.15), 0 0 20px ${node.data.agentColor || '#3B82F6'}30`
              : '0 4px 16px rgba(0, 0, 0, 0.1)'
          }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedNode(node);
          }}
        >
          {/* Node type indicator */}
          <div 
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              background: node.data.agentColor 
                ? `linear-gradient(90deg, ${node.data.agentColor}, ${node.data.agentColor}80)`
                : 'linear-gradient(90deg, #FF7B00, #00B4D8)'
            }}
          />

          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                {node.data.agentIcon ? (
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${node.data.agentColor}15` }}
                  >
                    <node.data.agentIcon 
                      className="h-4 w-4" 
                      style={{ color: node.data.agentColor }}
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    {node.type === 'trigger' ? <Zap className="h-4 w-4 text-yellow-600" /> :
                     node.type === 'action' ? <Settings className="h-4 w-4 text-blue-600" /> :
                     node.type === 'condition' ? <GitBranch className="h-4 w-4 text-purple-600" /> :
                     node.type === 'delay' ? <Timer className="h-4 w-4 text-orange-600" /> :
                     <Database className="h-4 w-4 text-gray-600" />}
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold text-sm text-gray-900 truncate">
                    {node.data.label}
                  </h4>
                  <Badge 
                    className="text-xs mt-1"
                    style={{
                      backgroundColor: `${statusColor}15`,
                      color: statusColor,
                      border: `1px solid ${statusColor}30`
                    }}
                  >
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {node.data.status}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNode(node.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              {node.data.description}
            </p>

            {node.data.executionTime && (
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{node.data.executionTime}s</span>
                </div>
                
                {node.data.status === 'running' && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span>Running...</span>
                  </div>
                )}
              </div>
            )}

            {/* Connection points */}
            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-300 hover:border-blue-500 cursor-pointer" />
            </div>
            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-300 hover:border-blue-500 cursor-pointer" />
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  const ConnectionLine = ({ connection, nodes }: { connection: FlowConnection; nodes: FlowNode[] }) => {
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
          
          {connection.animated && (
            <animate>
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="translate"
                values={`${startX},${startY};${endX},${endY}`}
                dur="2s"
                repeatCount="indefinite"
              />
            </animate>
          )}
        </defs>
        
        <path
          d={`M ${startX} ${startY} Q ${midX} ${startY} ${endX} ${endY}`}
          stroke="url(#connectionGradient)"
          strokeWidth="3"
          fill="none"
          opacity={connection.animated ? 0.8 : 0.6}
        />
        
        {connection.animated && (
          <motion.circle
            r="4"
            fill="#FF7B00"
            animate={{
              offsetDistance: ['0%', '100%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              offsetPath: `path('M ${startX} ${startY} Q ${midX} ${startY} ${endX} ${endY}')`
            }}
          />
        )}
        
        {/* Arrow */}
        <polygon
          points={`${endX-8},${endY-4} ${endX},${endY} ${endX-8},${endY+4}`}
          fill="#00B4D8"
        />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Automation Flow Builder
            </h1>
            <p className="text-muted-foreground mt-2">
              Design and manage automated workflows with AI agents
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Select value={selectedFlow?.id || ''} onValueChange={(id) => {
              const flow = flows.find(f => f.id === id);
              setSelectedFlow(flow || null);
            }}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select a flow" />
              </SelectTrigger>
              <SelectContent>
                {flows.map((flow) => (
                  <SelectItem key={flow.id} value={flow.id}>
                    {flow.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <Button className="bg-gradient-to-r from-primary to-secondary">
              <Save className="h-4 w-4 mr-2" />
              Save Flow
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Node Palette */}
        <div className="w-80 bg-white border-r p-6 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Add Nodes</h3>
          
          {/* AI Agents */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">AI Agents</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(AGENT_TYPES).map(([type, config]) => (
                <Button
                  key={type}
                  variant="outline"
                  size="sm"
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => addNode('agent', type)}
                  style={{
                    borderColor: `${config.color}30`,
                    backgroundColor: `${config.color}05`
                  }}
                >
                  <config.icon className="h-5 w-5 mb-1" style={{ color: config.color }} />
                  <span className="text-xs">{config.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Other Node Types */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Other Nodes</h4>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => addNode('trigger')}
            >
              <Zap className="h-4 w-4 mr-2 text-yellow-600" />
              Trigger
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => addNode('action')}
            >
              <Settings className="h-4 w-4 mr-2 text-blue-600" />
              Action
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => addNode('condition')}
            >
              <GitBranch className="h-4 w-4 mr-2 text-purple-600" />
              Condition
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => addNode('delay')}
            >
              <Timer className="h-4 w-4 mr-2 text-orange-600" />
              Delay
            </Button>
          </div>

          {/* Flow Stats */}
          {selectedFlow && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Flow Statistics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Runs:</span>
                  <span className="font-medium">{selectedFlow.runCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Success Rate:</span>
                  <span className="font-medium text-green-600">{selectedFlow.successRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge className={selectedFlow.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                    {selectedFlow.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {selectedFlow.lastRun && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Run:</span>
                    <span className="font-medium">{selectedFlow.lastRun.toLocaleTimeString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Canvas */}
        <div 
          className="flex-1 relative overflow-auto"
          style={{
            background: `
              radial-gradient(circle at 20px 20px, rgba(255, 123, 0, 0.1) 1px, transparent 1px),
              radial-gradient(circle at 60px 60px, rgba(0, 180, 216, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
        >
          <div 
            ref={canvasRef}
            className="relative min-h-full min-w-full"
            style={{ width: '2000px', height: '1500px' }}
            onMouseMove={handleNodeDrag}
            onMouseUp={handleNodeDragEnd}
            onClick={() => setSelectedNode(null)}
          >
            {selectedFlow && (
              <>
                {/* Connections */}
                {selectedFlow.connections.map((connection) => (
                  <ConnectionLine 
                    key={connection.id} 
                    connection={connection} 
                    nodes={selectedFlow.nodes}
                  />
                ))}

                {/* Nodes */}
                <AnimatePresence>
                  {selectedFlow.nodes.map((node) => (
                    <FlowNodeComponent key={node.id} node={node} />
                  ))}
                </AnimatePresence>
              </>
            )}

            {/* Empty State */}
            {!selectedFlow && (
              <div className="flex items-center justify-center h-full">
                <Card className="p-12 text-center max-w-md">
                  <Network className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Flow Selected
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Select a flow from the dropdown to start building your automation workflow.
                  </p>
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    Create New Flow
                  </Button>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="fixed bottom-6 right-6 flex space-x-3">
        {selectedFlow?.isActive ? (
          <Button
            size="lg"
            className="bg-red-500 hover:bg-red-600"
          >
            <Pause className="h-5 w-5 mr-2" />
            Stop Flow
          </Button>
        ) : (
          <Button
            size="lg"
            className="bg-green-500 hover:bg-green-600"
          >
            <Play className="h-5 w-5 mr-2" />
            Run Flow
          </Button>
        )}
      </div>
    </div>
  );
}
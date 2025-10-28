import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Brain,
  Palette,
  TrendingUp,
  Cog,
  BarChart3,
  Network,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Settings,
  Star,
  Zap,
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface MobileAgent {
  id: string;
  name: string;
  type: 'researcher' | 'creator' | 'optimizer' | 'automator' | 'analyzer' | 'orchestrator';
  description: string;
  shortDescription: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  status: 'idle' | 'working' | 'completed';
  progress?: number;
  tasksCompleted: number;
  efficiency: number;
  capabilities: string[];
  recentActivity: string;
}

const MOBILE_AGENTS: MobileAgent[] = [
  {
    id: 'researcher',
    name: 'Researcher',
    type: 'researcher',
    description: 'Analyzes trends, markets, and user behavior to provide data-driven insights for strategic decisions',
    shortDescription: 'Market analysis & insights',
    icon: Brain,
    accentColor: '#61dafb',
    status: 'idle',
    tasksCompleted: 847,
    efficiency: 94,
    capabilities: ['Market Analysis', 'User Research', 'Trend Forecasting', 'Competitive Intelligence'],
    recentActivity: 'Completed market research for Q4 strategy'
  },
  {
    id: 'creator',
    name: 'Creator',
    type: 'creator',
    description: 'Generates high-quality content, designs, and creative assets across multiple formats and platforms',
    shortDescription: 'Content & design creation',
    icon: Palette,
    accentColor: '#d14d21',
    status: 'working',
    progress: 68,
    tasksCompleted: 1203,
    efficiency: 96,
    capabilities: ['Content Generation', 'Design Creation', 'Brand Assets', 'Visual Content'],
    recentActivity: 'Creating social media campaign assets'
  },
  {
    id: 'optimizer',
    name: 'Optimizer',
    type: 'optimizer',
    description: 'Enhances performance, conversions, and operational efficiency through data-driven optimization',
    shortDescription: 'Performance optimization',
    icon: TrendingUp,
    accentColor: '#10b981',
    status: 'completed',
    tasksCompleted: 623,
    efficiency: 91,
    capabilities: ['Performance Tuning', 'A/B Testing', 'Conversion Optimization', 'Process Improvement'],
    recentActivity: 'Optimized checkout flow - 12% improvement'
  },
  {
    id: 'automator',
    name: 'Automator',
    type: 'automator',
    description: 'Streamlines workflows and automates repetitive business processes for maximum efficiency',
    shortDescription: 'Workflow automation',
    icon: Cog,
    accentColor: '#764ba2',
    status: 'idle',
    tasksCompleted: 756,
    efficiency: 89,
    capabilities: ['Workflow Automation', 'Task Scheduling', 'Integration Setup', 'Process Optimization'],
    recentActivity: 'Set up automated email sequences'
  },
  {
    id: 'analyzer',
    name: 'Analyzer',
    type: 'analyzer',
    description: 'Processes complex data and generates actionable business intelligence with detailed insights',
    shortDescription: 'Data analysis & reports',
    icon: BarChart3,
    accentColor: '#667eea',
    status: 'working',
    progress: 34,
    tasksCompleted: 934,
    efficiency: 93,
    capabilities: ['Data Analysis', 'Report Generation', 'KPI Tracking', 'Predictive Analytics'],
    recentActivity: 'Analyzing user behavior patterns'
  },
  {
    id: 'orchestrator',
    name: 'Orchestrator',
    type: 'orchestrator',
    description: 'Coordinates multi-agent workflows and manages complex operations across the entire platform',
    shortDescription: 'Workflow coordination',
    icon: Network,
    accentColor: '#2a5298',
    status: 'idle',
    tasksCompleted: 542,
    efficiency: 97,
    capabilities: ['Agent Coordination', 'Workflow Management', 'Resource Allocation', 'Quality Control'],
    recentActivity: 'Coordinated product launch workflow'
  }
];

interface MobileAgentSelectorProps {
  onAgentSelect: (agentId: string) => void;
  selectedAgent?: string;
  onWorkflowStart?: (agentId: string) => void;
}

export function MobileAgentSelector({ onAgentSelect, selectedAgent, onWorkflowStart }: MobileAgentSelectorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentAgent = MOBILE_AGENTS[currentIndex];

  const handleSwipe = (info: PanInfo) => {
    const swipeThreshold = 50;
    
    if (info.offset.x > swipeThreshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (info.offset.x < -swipeThreshold && currentIndex < MOBILE_AGENTS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const getStatusColor = (status: MobileAgent['status']) => {
    switch (status) {
      case 'working':
        return '#F59E0B';
      case 'completed':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: MobileAgent['status']) => {
    switch (status) {
      case 'working':
        return Play;
      case 'completed':
        return CheckCircle;
      default:
        return Pause;
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (event.key === 'ArrowRight' && currentIndex < MOBILE_AGENTS.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (event.key === 'Enter') {
        onAgentSelect(currentAgent.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentAgent.id, onAgentSelect]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-2">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            AI Agents
          </h1>
          <p className="text-slate-300 text-sm">
            {currentIndex + 1} of {MOBILE_AGENTS.length}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge 
            className="text-white"
            style={{ backgroundColor: `${currentAgent.accentColor}20`, border: `1px solid ${currentAgent.accentColor}` }}
          >
            {currentAgent.type}
          </Badge>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center space-x-2 mb-6">
        {MOBILE_AGENTS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="w-3 h-3 rounded-full transition-all duration-300"
            style={{
              backgroundColor: index === currentIndex 
                ? currentAgent.accentColor 
                : 'rgba(255, 255, 255, 0.3)',
              transform: index === currentIndex ? 'scale(1.2)' : 'scale(1)'
            }}
          />
        ))}
      </div>

      {/* Main Agent Card */}
      <div ref={containerRef} className="relative overflow-hidden">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => handleSwipe(info)}
          className="cursor-grab active:cursor-grabbing"
        >
          <Card 
            className="relative overflow-hidden mx-auto max-w-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: selectedAgent === currentAgent.id 
                ? `2px solid ${currentAgent.accentColor}` 
                : '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px ${currentAgent.accentColor}20`,
              minHeight: '500px'
            }}
          >
            {/* Status Indicator Bar */}
            <div 
              className="absolute top-0 left-0 right-0 h-1"
              style={{ backgroundColor: getStatusColor(currentAgent.status) }}
            />

            <div className="p-6">
              {/* Agent Icon and Status */}
              <div className="flex items-center justify-between mb-6">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: `${currentAgent.accentColor}15` }}
                >
                  <currentAgent.icon 
                    className="h-8 w-8" 
                    style={{ color: currentAgent.accentColor }}
                  />
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <div 
                    className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium"
                    style={{ 
                      backgroundColor: `${getStatusColor(currentAgent.status)}15`,
                      color: getStatusColor(currentAgent.status)
                    }}
                  >
                    {React.createElement(getStatusIcon(currentAgent.status), { className: "h-4 w-4" })}
                    <span className="capitalize">{currentAgent.status}</span>
                  </div>
                  
                  {currentAgent.status === 'working' && currentAgent.progress && (
                    <div className="w-20">
                      <div className="text-xs text-gray-500 mb-1">{currentAgent.progress}%</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="h-2 rounded-full"
                          style={{ backgroundColor: currentAgent.accentColor }}
                          initial={{ width: 0 }}
                          animate={{ width: `${currentAgent.progress}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Agent Name and Description */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentAgent.name}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {isExpanded ? currentAgent.description : currentAgent.shortDescription}
                </p>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs mt-2 font-medium"
                  style={{ color: currentAgent.accentColor }}
                >
                  {isExpanded ? 'Show less' : 'Show more'}
                </button>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-xl font-bold text-gray-900">
                    {currentAgent.tasksCompleted.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Tasks Completed</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div 
                    className="text-xl font-bold"
                    style={{ color: currentAgent.accentColor }}
                  >
                    {currentAgent.efficiency}%
                  </div>
                  <div className="text-xs text-gray-500">Efficiency</div>
                </div>
              </div>

              {/* Capabilities */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Key Capabilities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {currentAgent.capabilities.slice(0, 4).map((capability) => (
                    <Badge 
                      key={capability}
                      variant="outline" 
                      className="text-xs justify-center py-2 border-gray-200 text-gray-600"
                    >
                      {capability}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="mb-6 p-3 bg-blue-50 rounded-xl">
                <div className="flex items-start space-x-2">
                  <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-blue-700">Recent Activity</div>
                    <div className="text-xs text-blue-600 mt-1">
                      {currentAgent.recentActivity}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  className="w-full h-12 text-base font-semibold"
                  style={{ backgroundColor: currentAgent.accentColor }}
                  onClick={() => {
                    onAgentSelect(currentAgent.id);
                    onWorkflowStart?.(currentAgent.id);
                  }}
                >
                  Deploy {currentAgent.name}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-12"
                    style={{ 
                      borderColor: currentAgent.accentColor,
                      color: currentAgent.accentColor 
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-12"
                    style={{ 
                      borderColor: currentAgent.accentColor,
                      color: currentAgent.accentColor 
                    }}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Favorite
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center space-x-6 mt-6">
        <Button
          variant="outline"
          size="lg"
          className="w-12 h-12 rounded-full border-white/20 text-white hover:bg-white/10"
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <div className="text-white text-sm font-medium px-4 py-2 bg-white/10 rounded-full backdrop-blur">
          Swipe to browse
        </div>

        <Button
          variant="outline"
          size="lg"
          className="w-12 h-12 rounded-full border-white/20 text-white hover:bg-white/10"
          onClick={() => setCurrentIndex(Math.min(MOBILE_AGENTS.length - 1, currentIndex + 1))}
          disabled={currentIndex === MOBILE_AGENTS.length - 1}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="fixed bottom-4 left-4 right-4">
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            size="sm"
            className="h-11 bg-white/10 backdrop-blur border-white/20 text-white"
          >
            <Zap className="h-4 w-4 mr-1" />
            Quick Start
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-11 bg-white/10 backdrop-blur border-white/20 text-white"
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            Analytics
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-11 bg-white/10 backdrop-blur border-white/20 text-white"
          >
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
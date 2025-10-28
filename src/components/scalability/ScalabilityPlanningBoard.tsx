/**
 * @fileoverview FlashFusion Scalability Planning Board
 * @chunk scalability
 * @category performance-scalability
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Comprehensive scalability planning board for database optimization, CDN configuration,
 * auto-scaling policies, performance monitoring, and capacity planning with team
 * assignment and task tracking capabilities.
 * 
 * Features:
 * - Database optimization tracking
 * - CDN configuration management
 * - Auto-scaling policy monitoring
 * - Performance monitoring setup
 * - Capacity planning dashboard
 * - Team member assignment
 * - Task progress tracking
 * - Resource utilization monitoring
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Database, 
  Globe, 
  TrendingUp, 
  Activity,
  Users,
  Server,
  Cloud,
  Zap,
  Target,
  Settings,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Plus,
  Edit,
  Filter,
  Search,
  Download,
  Upload,
  RefreshCw,
  BarChart3,
  LineChart,
  PieChart,
  Monitor,
  HardDrive,
  Cpu,
  MemoryStick,
  Wifi,
  Shield,
  Lock,
  Key,
  Eye,
  Calendar,
  User,
  UserPlus,
  MessageSquare,
  FileText,
  Bookmark,
  Flag,
  ArrowUp,
  ArrowDown,
  Gauge,
  Layers,
  Network,
  Timer,
  Maximize,
  Minimize,
  RotateCcw,
  Play,
  Pause,
  Square
} from 'lucide-react';

// Scalability planning data
const scalabilityTasks = {
  databaseOptimization: {
    name: 'Database Optimization',
    description: 'Optimize database performance, indexing, and query efficiency',
    progress: 72,
    priority: 'high',
    estimatedCompletion: '2025-01-15',
    tasks: [
      {
        id: 'db-1',
        name: 'Query optimization analysis',
        description: 'Analyze slow queries and optimize performance',
        status: 'completed',
        priority: 'high',
        assignee: { name: 'Sarah Chen', avatar: 'SC', role: 'Database Engineer' },
        estimatedHours: 16,
        actualHours: 14,
        dueDate: '2024-12-15',
        completedDate: '2024-12-14',
        tags: ['performance', 'sql', 'optimization']
      },
      {
        id: 'db-2',
        name: 'Index optimization',
        description: 'Review and optimize database indexes for better performance',
        status: 'in-progress',
        priority: 'high',
        assignee: { name: 'Marcus Rodriguez', avatar: 'MR', role: 'Senior DBA' },
        estimatedHours: 24,
        actualHours: 18,
        dueDate: '2024-12-22',
        completedDate: null,
        tags: ['indexing', 'performance', 'database']
      },
      {
        id: 'db-3',
        name: 'Connection pool optimization',
        description: 'Configure and optimize database connection pooling',
        status: 'pending',
        priority: 'medium',
        assignee: { name: 'Aisha Patel', avatar: 'AP', role: 'DevOps Engineer' },
        estimatedHours: 12,
        actualHours: 0,
        dueDate: '2024-12-28',
        completedDate: null,
        tags: ['connections', 'pooling', 'infrastructure']
      },
      {
        id: 'db-4',
        name: 'Database sharding strategy',
        description: 'Design and implement database sharding for horizontal scaling',
        status: 'pending',
        priority: 'high',
        assignee: { name: 'David Kim', avatar: 'DK', role: 'Solutions Architect' },
        estimatedHours: 40,
        actualHours: 0,
        dueDate: '2025-01-15',
        completedDate: null,
        tags: ['sharding', 'scaling', 'architecture']
      },
      {
        id: 'db-5',
        name: 'Read replica setup',
        description: 'Configure read replicas for improved read performance',
        status: 'in-progress',
        priority: 'medium',
        assignee: { name: 'Sarah Chen', avatar: 'SC', role: 'Database Engineer' },
        estimatedHours: 20,
        actualHours: 8,
        dueDate: '2025-01-05',
        completedDate: null,
        tags: ['replicas', 'scaling', 'reads']
      }
    ]
  },
  cdnConfiguration: {
    name: 'CDN Configuration',
    description: 'Configure and optimize Content Delivery Network for global performance',
    progress: 85,
    priority: 'medium',
    estimatedCompletion: '2024-12-30',
    tasks: [
      {
        id: 'cdn-1',
        name: 'Global CDN deployment',
        description: 'Deploy CDN endpoints across major regions',
        status: 'completed',
        priority: 'high',
        assignee: { name: 'Elena Vasquez', avatar: 'EV', role: 'Infrastructure Engineer' },
        estimatedHours: 16,
        actualHours: 14,
        dueDate: '2024-12-10',
        completedDate: '2024-12-09',
        tags: ['cdn', 'global', 'deployment']
      },
      {
        id: 'cdn-2',
        name: 'Cache optimization strategies',
        description: 'Implement intelligent caching strategies for different content types',
        status: 'completed',
        priority: 'high',
        assignee: { name: 'James Wilson', avatar: 'JW', role: 'Performance Engineer' },
        estimatedHours: 20,
        actualHours: 22,
        dueDate: '2024-12-18',
        completedDate: '2024-12-17',
        tags: ['caching', 'optimization', 'performance']
      },
      {
        id: 'cdn-3',
        name: 'Edge computing setup',
        description: 'Configure edge computing for dynamic content processing',
        status: 'in-progress',
        priority: 'medium',
        assignee: { name: 'Maria Garcia', avatar: 'MG', role: 'Cloud Engineer' },
        estimatedHours: 32,
        actualHours: 24,
        dueDate: '2024-12-30',
        completedDate: null,
        tags: ['edge', 'computing', 'cdn']
      },
      {
        id: 'cdn-4',
        name: 'CDN analytics integration',
        description: 'Integrate CDN analytics and monitoring tools',
        status: 'pending',
        priority: 'low',
        assignee: { name: 'Robert Johnson', avatar: 'RJ', role: 'Monitoring Specialist' },
        estimatedHours: 12,
        actualHours: 0,
        dueDate: '2025-01-10',
        completedDate: null,
        tags: ['analytics', 'monitoring', 'cdn']
      }
    ]
  },
  autoScalingPolicies: {
    name: 'Auto-scaling Policies',
    description: 'Implement and configure auto-scaling policies for dynamic resource management',
    progress: 60,
    priority: 'high',
    estimatedCompletion: '2025-01-20',
    tasks: [
      {
        id: 'scale-1',
        name: 'Horizontal scaling policies',
        description: 'Configure horizontal auto-scaling based on CPU and memory metrics',
        status: 'completed',
        priority: 'high',
        assignee: { name: 'Ahmed Hassan', avatar: 'AH', role: 'Cloud Architect' },
        estimatedHours: 24,
        actualHours: 26,
        dueDate: '2024-12-12',
        completedDate: '2024-12-11',
        tags: ['horizontal', 'scaling', 'metrics']
      },
      {
        id: 'scale-2',
        name: 'Vertical scaling automation',
        description: 'Implement vertical scaling for compute-intensive workloads',
        status: 'in-progress',
        priority: 'medium',
        assignee: { name: 'Lisa Chen', avatar: 'LC', role: 'SRE' },
        estimatedHours: 20,
        actualHours: 12,
        dueDate: '2024-12-25',
        completedDate: null,
        tags: ['vertical', 'scaling', 'automation']
      },
      {
        id: 'scale-3',
        name: 'Load balancer configuration',
        description: 'Configure intelligent load balancing with health checks',
        status: 'pending',
        priority: 'high',
        assignee: { name: 'Michael Brown', avatar: 'MB', role: 'Network Engineer' },
        estimatedHours: 18,
        actualHours: 0,
        dueDate: '2025-01-05',
        completedDate: null,
        tags: ['load-balancer', 'health-checks', 'networking']
      },
      {
        id: 'scale-4',
        name: 'Cost optimization rules',
        description: 'Implement cost-aware scaling policies to optimize resource usage',
        status: 'pending',
        priority: 'medium',
        assignee: { name: 'Jennifer Wang', avatar: 'JW', role: 'FinOps Engineer' },
        estimatedHours: 16,
        actualHours: 0,
        dueDate: '2025-01-15',
        completedDate: null,
        tags: ['cost', 'optimization', 'finops']
      },
      {
        id: 'scale-5',
        name: 'Predictive scaling algorithms',
        description: 'Implement ML-based predictive scaling for proactive resource management',
        status: 'pending',
        priority: 'low',
        assignee: { name: 'Alex Thompson', avatar: 'AT', role: 'ML Engineer' },
        estimatedHours: 40,
        actualHours: 0,
        dueDate: '2025-01-20',
        completedDate: null,
        tags: ['ml', 'predictive', 'algorithms']
      }
    ]
  },
  performanceMonitoring: {
    name: 'Performance Monitoring',
    description: 'Set up comprehensive performance monitoring and alerting systems',
    progress: 78,
    priority: 'high',
    estimatedCompletion: '2024-12-28',
    tasks: [
      {
        id: 'perf-1',
        name: 'APM tool integration',
        description: 'Integrate Application Performance Monitoring tools',
        status: 'completed',
        priority: 'high',
        assignee: { name: 'Kevin Liu', avatar: 'KL', role: 'Monitoring Engineer' },
        estimatedHours: 16,
        actualHours: 18,
        dueDate: '2024-12-08',
        completedDate: '2024-12-08',
        tags: ['apm', 'monitoring', 'performance']
      },
      {
        id: 'perf-2',
        name: 'Custom metrics dashboard',
        description: 'Create custom dashboards for business-specific metrics',
        status: 'completed',
        priority: 'medium',
        assignee: { name: 'Sophie Martin', avatar: 'SM', role: 'Data Visualization Specialist' },
        estimatedHours: 24,
        actualHours: 20,
        dueDate: '2024-12-15',
        completedDate: '2024-12-14',
        tags: ['dashboard', 'metrics', 'visualization']
      },
      {
        id: 'perf-3',
        name: 'Alerting system setup',
        description: 'Configure intelligent alerting based on performance thresholds',
        status: 'in-progress',
        priority: 'high',
        assignee: { name: 'Daniel Rodriguez', avatar: 'DR', role: 'SRE' },
        estimatedHours: 20,
        actualHours: 14,
        dueDate: '2024-12-22',
        completedDate: null,
        tags: ['alerting', 'thresholds', 'notifications']
      },
      {
        id: 'perf-4',
        name: 'Real-time analytics',
        description: 'Implement real-time performance analytics and streaming',
        status: 'pending',
        priority: 'medium',
        assignee: { name: 'Isabella Torres', avatar: 'IT', role: 'Analytics Engineer' },
        estimatedHours: 28,
        actualHours: 0,
        dueDate: '2024-12-28',
        completedDate: null,
        tags: ['real-time', 'analytics', 'streaming']
      }
    ]
  },
  capacityPlanning: {
    name: 'Capacity Planning',
    description: 'Implement comprehensive capacity planning and resource forecasting',
    progress: 45,
    priority: 'medium',
    estimatedCompletion: '2025-02-15',
    tasks: [
      {
        id: 'cap-1',
        name: 'Usage pattern analysis',
        description: 'Analyze historical usage patterns for capacity forecasting',
        status: 'completed',
        priority: 'high',
        assignee: { name: 'Noah Anderson', avatar: 'NA', role: 'Data Analyst' },
        estimatedHours: 32,
        actualHours: 35,
        dueDate: '2024-12-20',
        completedDate: '2024-12-19',
        tags: ['analysis', 'patterns', 'forecasting']
      },
      {
        id: 'cap-2',
        name: 'Growth projection models',
        description: 'Develop predictive models for resource growth projections',
        status: 'in-progress',
        priority: 'medium',
        assignee: { name: 'Emma Wilson', avatar: 'EW', role: 'Capacity Planner' },
        estimatedHours: 40,
        actualHours: 16,
        dueDate: '2025-01-10',
        completedDate: null,
        tags: ['modeling', 'projections', 'growth']
      },
      {
        id: 'cap-3',
        name: 'Resource allocation optimizer',
        description: 'Build automated resource allocation optimization system',
        status: 'pending',
        priority: 'medium',
        assignee: { name: 'Liam Johnson', avatar: 'LJ', role: 'Operations Engineer' },
        estimatedHours: 36,
        actualHours: 0,
        dueDate: '2025-01-25',
        completedDate: null,
        tags: ['allocation', 'optimization', 'automation']
      },
      {
        id: 'cap-4',
        name: 'Cost forecasting model',
        description: 'Develop cost forecasting models based on usage projections',
        status: 'pending',
        priority: 'low',
        assignee: { name: 'Olivia Davis', avatar: 'OD', role: 'Financial Analyst' },
        estimatedHours: 24,
        actualHours: 0,
        dueDate: '2025-02-05',
        completedDate: null,
        tags: ['cost', 'forecasting', 'finance']
      },
      {
        id: 'cap-5',
        name: 'Capacity alerts system',
        description: 'Implement proactive capacity threshold alerting',
        status: 'pending',
        priority: 'high',
        assignee: { name: 'Ethan Miller', avatar: 'EM', role: 'Infrastructure Engineer' },
        estimatedHours: 20,
        actualHours: 0,
        dueDate: '2025-02-15',
        completedDate: null,
        tags: ['alerts', 'thresholds', 'capacity']
      }
    ]
  }
};

// Team members
const teamMembers = [
  { id: '1', name: 'Sarah Chen', role: 'Database Engineer', avatar: 'SC', workload: 85, skills: ['PostgreSQL', 'MySQL', 'Redis'] },
  { id: '2', name: 'Marcus Rodriguez', role: 'Senior DBA', avatar: 'MR', workload: 90, skills: ['Oracle', 'MongoDB', 'Cassandra'] },
  { id: '3', name: 'Aisha Patel', role: 'DevOps Engineer', avatar: 'AP', workload: 75, skills: ['Docker', 'Kubernetes', 'Terraform'] },
  { id: '4', name: 'David Kim', role: 'Solutions Architect', avatar: 'DK', workload: 70, skills: ['AWS', 'Architecture', 'Microservices'] },
  { id: '5', name: 'Elena Vasquez', role: 'Infrastructure Engineer', avatar: 'EV', workload: 80, skills: ['CDN', 'Networking', 'Security'] },
  { id: '6', name: 'James Wilson', role: 'Performance Engineer', avatar: 'JW', workload: 88, skills: ['Optimization', 'Caching', 'Monitoring'] }
];

// Resource utilization data
const resourceUtilization = {
  cpu: { current: 68, average: 65, peak: 89, threshold: 80 },
  memory: { current: 73, average: 70, peak: 92, threshold: 85 },
  storage: { current: 56, average: 52, peak: 78, threshold: 90 },
  network: { current: 42, average: 38, peak: 67, threshold: 75 },
  database: { current: 71, average: 68, peak: 94, threshold: 80 }
};

interface ScalabilityPlanningBoardProps {
  // Optional props for customization
}

/**
 * FlashFusion Scalability Planning Board Component
 */
export function ScalabilityPlanningBoard({}: ScalabilityPlanningBoardProps) {
  const [selectedCategory, setSelectedCategory] = useState('databaseOptimization');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState('all');

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    const categories = Object.values(scalabilityTasks);
    return categories.reduce((sum, category) => sum + category.progress, 0) / categories.length;
  }, []);

  // Calculate task statistics
  const taskStats = useMemo(() => {
    const allTasks = Object.values(scalabilityTasks).flatMap(category => category.tasks);
    return {
      total: allTasks.length,
      completed: allTasks.filter(task => task.status === 'completed').length,
      inProgress: allTasks.filter(task => task.status === 'in-progress').length,
      pending: allTasks.filter(task => task.status === 'pending').length
    };
  }, []);

  // Filter tasks based on current selection
  const filteredTasks = useMemo(() => {
    const category = scalabilityTasks[selectedCategory as keyof typeof scalabilityTasks];
    if (!category) return [];

    return category.tasks.filter(task => {
      const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      const matchesAssignee = selectedAssignee === 'all' || task.assignee.name === selectedAssignee;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
    });
  }, [selectedCategory, searchTerm, filterStatus, filterPriority, selectedAssignee]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'var(--ff-success)';
      case 'in-progress': return 'var(--ff-warning)';
      case 'pending': return 'var(--ff-text-muted)';
      default: return 'var(--ff-text-muted)';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Clock;
      case 'pending': return AlertTriangle;
      default: return XCircle;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'var(--ff-error)';
      case 'medium': return 'var(--ff-warning)';
      case 'low': return 'var(--ff-secondary)';
      default: return 'var(--ff-text-muted)';
    }
  };

  const getUtilizationColor = (current: number, threshold: number) => {
    if (current >= threshold) return 'var(--ff-error)';
    if (current >= threshold * 0.8) return 'var(--ff-warning)';
    return 'var(--ff-success)';
  };

  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)]" style={{ fontFamily: 'var(--ff-font-secondary)' }}>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 ff-fade-in-up">
          <Badge className="ff-badge-primary mb-4">
            <TrendingUp className="w-4 h-4 mr-2" />
            Performance & Scalability
          </Badge>
          
          <h1 className="ff-text-display">
            Scalability
            <span className="ff-text-gradient"> Planning</span>
          </h1>
          
          <p className="ff-text-body max-w-3xl mx-auto">
            Comprehensive scalability planning board for database optimization, CDN configuration,
            auto-scaling policies, performance monitoring, and capacity planning with team assignment.
          </p>
        </div>

        {/* Overview Dashboard */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 ff-stagger-fade">
          <Card className="ff-card text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-[var(--ff-primary)]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-[var(--ff-primary)]" />
              </div>
              <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                {overallProgress.toFixed(1)}%
              </div>
              <div className="ff-text-sm text-[var(--ff-text-muted)]">Overall Progress</div>
              <Progress value={overallProgress} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="ff-card text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-[var(--ff-success)]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-[var(--ff-success)]" />
              </div>
              <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                {taskStats.completed}/{taskStats.total}
              </div>
              <div className="ff-text-sm text-[var(--ff-text-muted)]">Tasks Completed</div>
              <Progress value={(taskStats.completed / taskStats.total) * 100} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="ff-card text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-[var(--ff-warning)]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-[var(--ff-warning)]" />
              </div>
              <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                {taskStats.inProgress}
              </div>
              <div className="ff-text-sm text-[var(--ff-text-muted)]">In Progress</div>
              <div className="ff-text-xs text-[var(--ff-text-muted)] mt-1">
                {taskStats.pending} pending
              </div>
            </CardContent>
          </Card>

          <Card className="ff-card text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-[var(--ff-secondary)]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-[var(--ff-secondary)]" />
              </div>
              <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                {teamMembers.length}
              </div>
              <div className="ff-text-sm text-[var(--ff-text-muted)]">Team Members</div>
              <div className="ff-text-xs text-[var(--ff-text-muted)] mt-1">
                {Math.round(teamMembers.reduce((sum, member) => sum + member.workload, 0) / teamMembers.length)}% avg workload
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resource Utilization */}
        <Card className="ff-card">
          <CardHeader>
            <CardTitle className="ff-text-title flex items-center gap-2">
              <Gauge className="w-5 h-5 text-[var(--ff-primary)]" />
              Resource Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-6">
              {Object.entries(resourceUtilization).map(([resource, data]) => (
                <div key={resource} className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-3">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="45"
                        fill="none"
                        stroke="var(--ff-surface-light)"
                        strokeWidth="8"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="45"
                        fill="none"
                        stroke={getUtilizationColor(data.current, data.threshold)}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(data.current / 100) * 283} 283`}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                          {data.current}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ff-text-sm text-[var(--ff-text-primary)] capitalize" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                    {resource}
                  </div>
                  <div className="ff-text-xs text-[var(--ff-text-muted)]">
                    Peak: {data.peak}% | Avg: {data.average}%
                  </div>
                  <div className="ff-text-xs text-[var(--ff-text-muted)]">
                    Threshold: {data.threshold}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scalability Planning Board */}
        <Card className="ff-card">
          <CardContent className="p-0">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
              <div className="border-b border-[var(--border)]">
                <TabsList className="grid w-full grid-cols-5 bg-[var(--ff-surface)] rounded-none">
                  <TabsTrigger value="databaseOptimization" className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Database
                  </TabsTrigger>
                  <TabsTrigger value="cdnConfiguration" className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    CDN
                  </TabsTrigger>
                  <TabsTrigger value="autoScalingPolicies" className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Auto-scaling
                  </TabsTrigger>
                  <TabsTrigger value="performanceMonitoring" className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Monitoring
                  </TabsTrigger>
                  <TabsTrigger value="capacityPlanning" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Capacity
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* Filters and Controls */}
              <div className="p-6 border-b border-[var(--border)]">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-64">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--ff-text-muted)]" />
                      <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-[var(--ff-surface)] border border-[var(--border)] rounded-lg text-[var(--ff-text-primary)] placeholder-[var(--ff-text-muted)] focus:outline-none focus:border-[var(--ff-primary)]"
                      />
                    </div>
                  </div>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 bg-[var(--ff-surface)] border border-[var(--border)] rounded-lg text-[var(--ff-text-primary)] focus:outline-none focus:border-[var(--ff-primary)]"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="pending">Pending</option>
                  </select>
                  
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="px-3 py-2 bg-[var(--ff-surface)] border border-[var(--border)] rounded-lg text-[var(--ff-text-primary)] focus:outline-none focus:border-[var(--ff-primary)]"
                  >
                    <option value="all">All Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  
                  <select
                    value={selectedAssignee}
                    onChange={(e) => setSelectedAssignee(e.target.value)}
                    className="px-3 py-2 bg-[var(--ff-surface)] border border-[var(--border)] rounded-lg text-[var(--ff-text-primary)] focus:outline-none focus:border-[var(--ff-primary)]"
                  >
                    <option value="all">All Assignees</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                  
                  <Button className="ff-btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </div>

              {/* Task Lists for each category */}
              {Object.entries(scalabilityTasks).map(([categoryKey, category]) => (
                <TabsContent key={categoryKey} value={categoryKey} className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="ff-text-title">{category.name}</h3>
                      <p className="ff-text-sm text-[var(--ff-text-muted)] mt-1">{category.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                          {category.progress}%
                        </div>
                        <div className="ff-text-xs text-[var(--ff-text-muted)]">Complete</div>
                      </div>
                      <Progress value={category.progress} className="w-24 h-2" />
                      <Badge className={`ff-badge-${category.priority === 'high' ? 'error' : category.priority === 'medium' ? 'warning' : 'secondary'}`}>
                        {category.priority} priority
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {(categoryKey === selectedCategory ? filteredTasks : category.tasks).map((task) => {
                      const StatusIcon = getStatusIcon(task.status);
                      
                      return (
                        <Card key={task.id} className="ff-card border border-[var(--border)] hover:border-[var(--ff-primary)]/30 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0">
                                <StatusIcon 
                                  className="w-5 h-5 mt-1" 
                                  style={{ color: getStatusColor(task.status) }}
                                />
                              </div>
                              
                              <div className="flex-1 space-y-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                      {task.name}
                                    </h4>
                                    <p className="ff-text-sm text-[var(--ff-text-muted)] mt-1">
                                      {task.description}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge 
                                      className={`ff-badge-${task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'secondary'}`}
                                    >
                                      {task.priority}
                                    </Badge>
                                    <Badge 
                                      className={`ff-badge-${task.status === 'completed' ? 'success' : task.status === 'in-progress' ? 'warning' : 'secondary'}`}
                                    >
                                      {task.status.replace('-', ' ')}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 bg-[var(--ff-primary)] rounded-full flex items-center justify-center text-white text-sm" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                        {task.assignee.avatar}
                                      </div>
                                      <div>
                                        <div className="ff-text-sm text-[var(--ff-text-primary)]">{task.assignee.name}</div>
                                        <div className="ff-text-xs text-[var(--ff-text-muted)]">{task.assignee.role}</div>
                                      </div>
                                    </div>
                                    
                                    <div className="text-center">
                                      <div className="ff-text-sm text-[var(--ff-text-primary)]">
                                        {task.actualHours}h / {task.estimatedHours}h
                                      </div>
                                      <div className="ff-text-xs text-[var(--ff-text-muted)]">Hours</div>
                                    </div>
                                    
                                    <div className="text-center">
                                      <div className="ff-text-sm text-[var(--ff-text-primary)]">
                                        {new Date(task.dueDate).toLocaleDateString()}
                                      </div>
                                      <div className="ff-text-xs text-[var(--ff-text-muted)]">Due Date</div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <Progress 
                                      value={task.status === 'completed' ? 100 : task.status === 'in-progress' ? (task.actualHours / task.estimatedHours) * 100 : 0} 
                                      className="w-20 h-2" 
                                    />
                                    <Button size="sm" className="ff-btn-outline">
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                                
                                {task.tags.length > 0 && (
                                  <div className="flex items-center gap-2">
                                    {task.tags.map((tag, index) => (
                                      <Badge key={index} className="ff-badge-secondary text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Team Workload */}
        <Card className="ff-card">
          <CardHeader>
            <CardTitle className="ff-text-title flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--ff-secondary)]" />
              Team Workload Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <Card key={member.id} className="ff-card">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-[var(--ff-primary)] rounded-full flex items-center justify-center text-white" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                        {member.avatar}
                      </div>
                      <div>
                        <div className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                          {member.name}
                        </div>
                        <div className="ff-text-xs text-[var(--ff-text-muted)]">{member.role}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="ff-text-sm text-[var(--ff-text-secondary)]">Workload</span>
                        <span className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                          {member.workload}%
                        </span>
                      </div>
                      <Progress 
                        value={member.workload} 
                        className="h-2"
                        style={{
                          '--progress-background': member.workload > 90 ? 'var(--ff-error)' : 
                                                member.workload > 80 ? 'var(--ff-warning)' : 
                                                'var(--ff-success)'
                        } as React.CSSProperties}
                      />
                      
                      <div className="flex flex-wrap gap-1">
                        {member.skills.map((skill, index) => (
                          <Badge key={index} className="ff-badge-secondary text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ScalabilityPlanningBoard;
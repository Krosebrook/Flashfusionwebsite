/**
 * @fileoverview FlashFusion Development Workflow Sprint Board
 * @chunk coordination
 * @category workflow
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Two-week sprint board with comprehensive task management across all development phases
 * from design review through production deployment.
 * 
 * Features:
 * - Kanban-style sprint board
 * - Drag-and-drop task management
 * - Real-time progress tracking
 * - Team assignment and notifications
 * - Performance benchmarking
 * - Security review integration
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  Calendar, 
  Clock, 
  User, 
  Users, 
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  MoreHorizontal,
  Plus,
  Filter,
  Search,
  ArrowRight,
  Flag,
  Target,
  Code,
  Eye,
  Shield,
  Zap,
  TrendingUp,
  Database,
  Cloud,
  Settings,
  FileText,
  GitBranch,
  Package,
  Rocket,
  Activity,
  Bell,
  MessageSquare,
  Edit,
  Archive,
  Download,
  Upload
} from 'lucide-react';

// Task interfaces
interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  reporter: string;
  labels: string[];
  estimate: number; // hours
  spent: number; // hours
  dueDate: string;
  createdAt: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  column: 'design-review' | 'implementation' | 'testing' | 'qa' | 'deployment' | 'done';
  dependencies: string[];
  comments: number;
  attachments: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  capacity: number; // hours per sprint
  allocated: number; // currently allocated hours
}

// Sprint data
const sprintData = {
  sprintNumber: 24,
  startDate: '2024-12-16',
  endDate: '2024-12-27',
  totalCapacity: 320, // total team hours
  allocatedHours: 285,
  completedHours: 142,
  burndownRate: 0.68
};

const teamMembers: TeamMember[] = [
  { id: 'alex', name: 'Alex Chen', role: 'Lead Developer', avatar: 'AC', capacity: 80, allocated: 75 },
  { id: 'sarah', name: 'Sarah Kim', role: 'UI/UX Designer', avatar: 'SK', capacity: 80, allocated: 68 },
  { id: 'mike', name: 'Mike Rodriguez', role: 'Backend Engineer', avatar: 'MR', capacity: 80, allocated: 72 },
  { id: 'emma', name: 'Emma Watson', role: 'QA Engineer', avatar: 'EW', capacity: 80, allocated: 70 }
];

const sprintTasks: Task[] = [
  // Design Review Column
  {
    id: 'DR-001',
    title: 'Design System Token Review',
    description: 'Review and approve updated color tokens and typography scale for Q1 2025',
    priority: 'high',
    assignee: 'sarah',
    reporter: 'alex',
    labels: ['design-system', 'tokens', 'review'],
    estimate: 8,
    spent: 3,
    dueDate: '2024-12-20',
    createdAt: '2024-12-16',
    status: 'in-progress',
    column: 'design-review',
    dependencies: [],
    comments: 5,
    attachments: 3
  },
  {
    id: 'DR-002',
    title: 'Mobile Navigation UX Approval',
    description: 'Final approval for mobile navigation patterns and gesture interactions',
    priority: 'medium',
    assignee: 'sarah',
    reporter: 'alex',
    labels: ['mobile', 'navigation', 'ux'],
    estimate: 6,
    spent: 2,
    dueDate: '2024-12-21',
    createdAt: '2024-12-17',
    status: 'todo',
    column: 'design-review',
    dependencies: ['DR-001'],
    comments: 2,
    attachments: 4
  },
  
  // Implementation Column
  {
    id: 'IMP-001',
    title: 'API Rate Limiting Implementation',
    description: 'Implement comprehensive API rate limiting with Redis backend',
    priority: 'critical',
    assignee: 'mike',
    reporter: 'alex',
    labels: ['backend', 'security', 'api'],
    estimate: 16,
    spent: 8,
    dueDate: '2024-12-23',
    createdAt: '2024-12-16',
    status: 'in-progress',
    column: 'implementation',
    dependencies: [],
    comments: 8,
    attachments: 2
  },
  {
    id: 'IMP-002',
    title: 'Real-time Collaboration Features',
    description: 'Build live coding collaboration with WebSocket integration',
    priority: 'high',
    assignee: 'alex',
    reporter: 'mike',
    labels: ['frontend', 'websockets', 'collaboration'],
    estimate: 20,
    spent: 12,
    dueDate: '2024-12-24',
    createdAt: '2024-12-16',
    status: 'in-progress',
    column: 'implementation',
    dependencies: ['IMP-001'],
    comments: 15,
    attachments: 6
  },
  {
    id: 'IMP-003',
    title: 'Performance Optimization Engine',
    description: 'Implement smart performance optimization with automated suggestions',
    priority: 'high',
    assignee: 'alex',
    reporter: 'emma',
    labels: ['performance', 'optimization', 'automation'],
    estimate: 14,
    spent: 4,
    dueDate: '2024-12-25',
    createdAt: '2024-12-18',
    status: 'todo',
    column: 'implementation',
    dependencies: [],
    comments: 3,
    attachments: 1
  },
  
  // Testing Column
  {
    id: 'TEST-001',
    title: 'Integration Testing Suite',
    description: 'Comprehensive integration tests for AI service endpoints',
    priority: 'high',
    assignee: 'emma',
    reporter: 'mike',
    labels: ['testing', 'integration', 'ai'],
    estimate: 12,
    spent: 6,
    dueDate: '2024-12-22',
    createdAt: '2024-12-17',
    status: 'in-progress',
    column: 'testing',
    dependencies: ['IMP-001'],
    comments: 4,
    attachments: 2
  },
  {
    id: 'TEST-002',
    title: 'Performance Benchmarking',
    description: 'Load testing and performance benchmarks for new features',
    priority: 'medium',
    assignee: 'emma',
    reporter: 'alex',
    labels: ['performance', 'benchmarking', 'load-testing'],
    estimate: 10,
    spent: 3,
    dueDate: '2024-12-23',
    createdAt: '2024-12-18',
    status: 'todo',
    column: 'testing',
    dependencies: ['IMP-002'],
    comments: 2,
    attachments: 1
  },
  
  // QA Column
  {
    id: 'QA-001',
    title: 'Security Vulnerability Scan',
    description: 'Comprehensive security review and penetration testing',
    priority: 'critical',
    assignee: 'emma',
    reporter: 'alex',
    labels: ['security', 'penetration-testing', 'compliance'],
    estimate: 8,
    spent: 4,
    dueDate: '2024-12-24',
    createdAt: '2024-12-19',
    status: 'in-progress',
    column: 'qa',
    dependencies: ['TEST-001'],
    comments: 6,
    attachments: 3
  },
  {
    id: 'QA-002',
    title: 'Staging Environment QA',
    description: 'Full regression testing on staging environment',
    priority: 'high',
    assignee: 'emma',
    reporter: 'sarah',
    labels: ['qa', 'staging', 'regression'],
    estimate: 12,
    spent: 0,
    dueDate: '2024-12-25',
    createdAt: '2024-12-19',
    status: 'todo',
    column: 'qa',
    dependencies: ['QA-001'],
    comments: 1,
    attachments: 0
  },
  
  // Deployment Column
  {
    id: 'DEP-001',
    title: 'Production Deployment Pipeline',
    description: 'Set up automated production deployment with rollback capabilities',
    priority: 'critical',
    assignee: 'mike',
    reporter: 'alex',
    labels: ['deployment', 'cicd', 'production'],
    estimate: 6,
    spent: 2,
    dueDate: '2024-12-26',
    createdAt: '2024-12-20',
    status: 'todo',
    column: 'deployment',
    dependencies: ['QA-002'],
    comments: 3,
    attachments: 2
  },
  
  // Done Column
  {
    id: 'DONE-001',
    title: 'Database Migration Scripts',
    description: 'Create and test database migration scripts for new schema',
    priority: 'high',
    assignee: 'mike',
    reporter: 'alex',
    labels: ['database', 'migration', 'schema'],
    estimate: 8,
    spent: 8,
    dueDate: '2024-12-20',
    createdAt: '2024-12-16',
    status: 'done',
    column: 'done',
    dependencies: [],
    comments: 12,
    attachments: 4
  },
  {
    id: 'DONE-002',
    title: 'Technical Architecture Documentation',
    description: 'Complete technical architecture documentation for new microservices',
    priority: 'medium',
    assignee: 'alex',
    reporter: 'sarah',
    labels: ['documentation', 'architecture', 'microservices'],
    estimate: 6,
    spent: 6,
    dueDate: '2024-12-19',
    createdAt: '2024-12-16',
    status: 'done',
    column: 'done',
    dependencies: [],
    comments: 8,
    attachments: 5
  }
];

const columns = [
  { id: 'design-review', title: 'Design Review', color: 'var(--ff-accent)', limit: 3 },
  { id: 'implementation', title: 'Implementation', color: 'var(--ff-primary)', limit: 5 },
  { id: 'testing', title: 'Testing', color: 'var(--ff-secondary)', limit: 4 },
  { id: 'qa', title: 'QA', color: 'var(--ff-warning)', limit: 3 },
  { id: 'deployment', title: 'Deployment', color: 'var(--ff-success)', limit: 2 },
  { id: 'done', title: 'Done', color: 'var(--ff-neutral-600)', limit: null }
];

interface DevelopmentWorkflowProps {
  // Optional props for customization
}

/**
 * FlashFusion Development Workflow Component
 */
export function DevelopmentWorkflow({}: DevelopmentWorkflowProps) {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');

  // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    return sprintTasks.filter(task => {
      if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
      if (filterAssignee !== 'all' && task.assignee !== filterAssignee) return false;
      return true;
    });
  }, [filterPriority, filterAssignee]);

  // Group tasks by column
  const tasksByColumn = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    columns.forEach(column => {
      grouped[column.id] = filteredTasks.filter(task => task.column === column.id);
    });
    return grouped;
  }, [filteredTasks]);

  // Get team member by ID
  const getTeamMember = (id: string) => {
    return teamMembers.find(member => member.id === id);
  };

  // Calculate sprint progress
  const sprintProgress = useMemo(() => {
    const totalTasks = sprintTasks.length;
    const completedTasks = sprintTasks.filter(task => task.column === 'done').length;
    const inProgressTasks = sprintTasks.filter(task => task.status === 'in-progress').length;
    
    return {
      completed: Math.round((completedTasks / totalTasks) * 100),
      inProgress: Math.round((inProgressTasks / totalTasks) * 100),
      remaining: Math.round(((totalTasks - completedTasks - inProgressTasks) / totalTasks) * 100)
    };
  }, []);

  // Priority color mapping
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'var(--ff-error)';
      case 'high': return 'var(--ff-warning)';
      case 'medium': return 'var(--ff-secondary)';
      case 'low': return 'var(--ff-neutral-400)';
      default: return 'var(--ff-neutral-400)';
    }
  };

  // Task Card Component
  const TaskCard = ({ task }: { task: Task }) => {
    const assignee = getTeamMember(task.assignee);
    const isSelected = selectedTask === task.id;
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';
    
    return (
      <Card 
        className={`ff-card-interactive cursor-pointer transition-all duration-200 ${
          isSelected ? 'border-[var(--ff-primary)] ring-2 ring-[var(--ff-primary)]/20' : ''
        } ${isOverdue ? 'border-[var(--ff-error)]/50' : ''}`}
        onClick={() => setSelectedTask(isSelected ? null : task.id)}
      >
        <CardContent className="p-4 space-y-3">
          {/* Task Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="ff-text-xs text-[var(--ff-text-muted)]" style={{ fontFamily: 'var(--ff-font-mono)' }}>
                  {task.id}
                </span>
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                />
              </div>
              <h4 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                {task.title}
              </h4>
            </div>
            <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </div>
          
          {/* Task Description */}
          <p className="ff-text-xs text-[var(--ff-text-muted)] line-clamp-2">
            {task.description}
          </p>
          
          {/* Labels */}
          {task.labels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.labels.slice(0, 2).map(label => (
                <Badge key={label} variant="outline" className="ff-text-xs px-1 py-0">
                  {label}
                </Badge>
              ))}
              {task.labels.length > 2 && (
                <Badge variant="outline" className="ff-text-xs px-1 py-0">
                  +{task.labels.length - 2}
                </Badge>
              )}
            </div>
          )}
          
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="ff-text-xs text-[var(--ff-text-muted)]">Progress</span>
              <span className="ff-text-xs text-[var(--ff-text-muted)]">
                {task.spent}h / {task.estimate}h
              </span>
            </div>
            <Progress 
              value={(task.spent / task.estimate) * 100} 
              className="h-1"
            />
          </div>
          
          {/* Task Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {assignee && (
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="ff-text-xs">
                    {assignee.avatar}
                  </AvatarFallback>
                </Avatar>
              )}
              <span className="ff-text-xs text-[var(--ff-text-muted)]">
                Due {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              {task.comments > 0 && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-[var(--ff-text-muted)]" />
                  <span className="ff-text-xs text-[var(--ff-text-muted)]">{task.comments}</span>
                </div>
              )}
              {task.attachments > 0 && (
                <div className="flex items-center gap-1">
                  <FileText className="w-3 h-3 text-[var(--ff-text-muted)]" />
                  <span className="ff-text-xs text-[var(--ff-text-muted)]">{task.attachments}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Dependencies */}
          {task.dependencies.length > 0 && (
            <div className="border-t border-[var(--border)] pt-2">
              <div className="flex items-center gap-1">
                <GitBranch className="w-3 h-3 text-[var(--ff-text-muted)]" />
                <span className="ff-text-xs text-[var(--ff-text-muted)]">
                  Depends on {task.dependencies.length} task{task.dependencies.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)]" style={{ fontFamily: 'var(--ff-font-secondary)' }}>
      <div className="max-w-full mx-auto p-6 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4 ff-fade-in-up">
          <Badge className="ff-badge-secondary mb-4">
            <Activity className="w-4 h-4 mr-2" />
            Development Workflow
          </Badge>
          
          <h1 className="ff-text-display">
            Sprint
            <span className="ff-text-gradient"> {sprintData.sprintNumber}</span>
          </h1>
          
          <p className="ff-text-body max-w-3xl mx-auto">
            Two-week sprint board managing development workflow from design review 
            through production deployment with real-time progress tracking.
          </p>
        </div>

        {/* Sprint Overview */}
        <Card className="ff-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="ff-text-title flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[var(--ff-primary)]" />
                Sprint Overview
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="ff-badge-success">
                  {new Date(sprintData.startDate).toLocaleDateString()} - {new Date(sprintData.endDate).toLocaleDateString()}
                </Badge>
                <Button variant="outline" size="sm" className="ff-btn-outline">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              {/* Progress Stats */}
              <div className="space-y-4">
                <h4 className="ff-text-sm text-[var(--ff-text-muted)]">Progress</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="ff-text-sm text-[var(--ff-text-secondary)]">Completed</span>
                    <span className="ff-text-sm text-[var(--ff-success)]">{sprintProgress.completed}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="ff-text-sm text-[var(--ff-text-secondary)]">In Progress</span>
                    <span className="ff-text-sm text-[var(--ff-primary)]">{sprintProgress.inProgress}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="ff-text-sm text-[var(--ff-text-secondary)]">Remaining</span>
                    <span className="ff-text-sm text-[var(--ff-text-muted)]">{sprintProgress.remaining}%</span>
                  </div>
                </div>
                <Progress value={sprintProgress.completed} className="h-2" />
              </div>
              
              {/* Capacity */}
              <div className="space-y-4">
                <h4 className="ff-text-sm text-[var(--ff-text-muted)]">Capacity</h4>
                <div className="space-y-2">
                  <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                    {sprintData.allocatedHours}h
                  </div>
                  <div className="ff-text-sm text-[var(--ff-text-muted)]">
                    of {sprintData.totalCapacity}h allocated
                  </div>
                  <Progress value={(sprintData.allocatedHours / sprintData.totalCapacity) * 100} className="h-2" />
                </div>
              </div>
              
              {/* Burndown */}
              <div className="space-y-4">
                <h4 className="ff-text-sm text-[var(--ff-text-muted)]">Burndown Rate</h4>
                <div className="space-y-2">
                  <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                    {Math.round(sprintData.burndownRate * 100)}%
                  </div>
                  <div className="ff-text-sm text-[var(--ff-text-muted)]">
                    {sprintData.completedHours}h completed
                  </div>
                  <Progress value={sprintData.burndownRate * 100} className="h-2" />
                </div>
              </div>
              
              {/* Team */}
              <div className="space-y-4">
                <h4 className="ff-text-sm text-[var(--ff-text-muted)]">Team</h4>
                <div className="flex -space-x-2">
                  {teamMembers.map(member => (
                    <Avatar key={member.id} className="w-8 h-8 border-2 border-[var(--ff-surface)]">
                      <AvatarFallback className="ff-text-xs">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">
                  {teamMembers.length} team members
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[var(--ff-text-muted)]" />
              <select 
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="ff-input bg-[var(--ff-surface)] border border-[var(--border)] rounded px-3 py-1 text-sm"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[var(--ff-text-muted)]" />
              <select 
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
                className="ff-input bg-[var(--ff-surface)] border border-[var(--border)] rounded px-3 py-1 text-sm"
              >
                <option value="all">All Assignees</option>
                {teamMembers.map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="ff-btn-outline">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button size="sm" className="ff-btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Sprint Board */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {columns.map(column => {
            const tasks = tasksByColumn[column.id] || [];
            const isAtLimit = column.limit && tasks.length >= column.limit;
            
            return (
              <div key={column.id} className="space-y-4">
                {/* Column Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: column.color }}
                    />
                    <h3 className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                      {column.title}
                    </h3>
                    <Badge variant="outline" className="ff-text-xs">
                      {tasks.length}
                      {column.limit && `/${column.limit}`}
                    </Badge>
                  </div>
                  
                  {isAtLimit && (
                    <AlertTriangle className="w-4 h-4 text-[var(--ff-warning)]" />
                  )}
                </div>
                
                {/* Column Content */}
                <div className={`space-y-3 min-h-[200px] p-3 rounded-lg border-2 border-dashed transition-colors ${
                  isAtLimit 
                    ? 'border-[var(--ff-warning)]/30 bg-[var(--ff-warning)]/5' 
                    : 'border-[var(--border)] bg-[var(--ff-surface)]/30'
                }`}>
                  {tasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  
                  {tasks.length === 0 && (
                    <div className="flex items-center justify-center h-32 text-[var(--ff-text-muted)]">
                      <div className="text-center">
                        <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <div className="ff-text-sm">No tasks</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Team Capacity Overview */}
        <Card className="ff-card">
          <CardHeader>
            <CardTitle className="ff-text-title flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--ff-secondary)]" />
              Team Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map(member => (
                <div key={member.id} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="ff-text-sm">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                        {member.name}
                      </div>
                      <div className="ff-text-xs text-[var(--ff-text-muted)]">{member.role}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="ff-text-sm text-[var(--ff-text-muted)]">Allocated</span>
                      <span className="ff-text-sm text-[var(--ff-text-primary)]">
                        {member.allocated}h / {member.capacity}h
                      </span>
                    </div>
                    <Progress 
                      value={(member.allocated / member.capacity) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="ff-text-xs text-[var(--ff-text-muted)]">
                    {Math.round(((member.capacity - member.allocated) / member.capacity) * 100)}% available
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DevelopmentWorkflow;
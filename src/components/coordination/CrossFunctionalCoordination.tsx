/**
 * @fileoverview FlashFusion Cross-Functional Coordination
 * @chunk coordination
 * @category cross-functional-coordination
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Comprehensive schedule and calendar view for cross-functional team coordination
 * including daily stand-ups, weekly cross-team sync meetings, bi-weekly sprint
 * planning and retrospectives, monthly all-hands meetings, and quarterly OKR planning.
 * 
 * Features:
 * - Interactive calendar with meeting scheduling
 * - Color-coded meeting types and priorities
 * - Team availability and conflict detection
 * - Meeting templates and automated scheduling
 * - Cross-team dependency tracking
 * - Performance metrics and attendance tracking
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Calendar, 
  Clock, 
  Users, 
  Target,
  MessageSquare,
  BarChart3,
  ArrowLeft,
  ArrowRight,
  Plus,
  Settings,
  Filter,
  Search,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Edit,
  Star,
  Flag,
  Bell,
  Repeat,
  MapPin,
  Video,
  Phone,
  Mail,
  FileText,
  Briefcase,
  Award,
  TrendingUp,
  Activity,
  Zap,
  Shield,
  Code,
  Palette,
  Database,
  Cloud,
  Bug,
  PieChart,
  LineChart,
  Globe,
  Smartphone
} from 'lucide-react';

// Meeting types and configurations
const meetingTypes = {
  'daily-standup': {
    name: 'Daily Stand-up',
    color: 'var(--ff-primary)',
    duration: 15,
    frequency: 'daily',
    participants: ['Engineering Team', 'Product Manager', 'UI/UX Designer'],
    template: {
      agenda: ['Yesterday\'s progress', 'Today\'s plan', 'Blockers/impediments'],
      format: 'Round-robin updates',
      tools: ['Slack', 'Jira', 'GitHub']
    }
  },
  'weekly-sync': {
    name: 'Weekly Cross-Team Sync',
    color: 'var(--ff-secondary)',
    duration: 60,
    frequency: 'weekly',
    participants: ['All Department Leads', 'Product Manager', 'CEO'],
    template: {
      agenda: ['Department updates', 'Cross-team dependencies', 'Risk assessment', 'Resource allocation'],
      format: 'Structured discussion',
      tools: ['Zoom', 'Miro', 'Notion']
    }
  },
  'sprint-planning': {
    name: 'Sprint Planning',
    color: 'var(--ff-accent)',
    duration: 120,
    frequency: 'bi-weekly',
    participants: ['Engineering Team', 'Product Manager', 'UI/UX Designer', 'QA Engineer'],
    template: {
      agenda: ['Sprint goal setting', 'Story estimation', 'Task breakdown', 'Capacity planning'],
      format: 'Planning poker & discussion',
      tools: ['Jira', 'Miro', 'Figma']
    }
  },
  'sprint-retro': {
    name: 'Sprint Retrospective',
    color: 'var(--ff-success)',
    duration: 90,
    frequency: 'bi-weekly',
    participants: ['Engineering Team', 'Product Manager', 'UI/UX Designer'],
    template: {
      agenda: ['What went well', 'What didn\'t work', 'Action items', 'Process improvements'],
      format: 'Start-Stop-Continue',
      tools: ['Miro', 'FunRetro', 'Slack']
    }
  },
  'all-hands': {
    name: 'All-Hands Meeting',
    color: 'var(--ff-warning)',
    duration: 60,
    frequency: 'monthly',
    participants: ['Entire Team', 'Leadership', 'Extended Team'],
    template: {
      agenda: ['Company updates', 'Product roadmap', 'Team achievements', 'Q&A session'],
      format: 'Presentation & discussion',
      tools: ['Zoom', 'Slides', 'Slack']
    }
  },
  'okr-planning': {
    name: 'OKR Planning',
    color: 'var(--ff-error)',
    duration: 180,
    frequency: 'quarterly',
    participants: ['Leadership Team', 'Department Leads', 'Key Contributors'],
    template: {
      agenda: ['Quarterly review', 'OKR setting', 'Resource planning', 'Alignment check'],
      format: 'Strategic planning session',
      tools: ['Lattice', 'Miro', 'Google Sheets']
    }
  }
};

// Sample calendar data
const sampleCalendar = {
  '2024-12-16': [
    { id: '1', type: 'daily-standup', time: '09:00', title: 'Engineering Daily Standup', attendees: 6, status: 'scheduled' },
    { id: '2', type: 'weekly-sync', time: '14:00', title: 'Cross-Team Weekly Sync', attendees: 8, status: 'scheduled' }
  ],
  '2024-12-17': [
    { id: '3', type: 'daily-standup', time: '09:00', title: 'Engineering Daily Standup', attendees: 6, status: 'scheduled' },
    { id: '4', type: 'sprint-planning', time: '10:00', title: 'Sprint 15 Planning', attendees: 7, status: 'scheduled' }
  ],
  '2024-12-18': [
    { id: '5', type: 'daily-standup', time: '09:00', title: 'Engineering Daily Standup', attendees: 6, status: 'scheduled' },
    { id: '6', type: 'all-hands', time: '15:00', title: 'December All-Hands', attendees: 15, status: 'scheduled' }
  ],
  '2024-12-19': [
    { id: '7', type: 'daily-standup', time: '09:00', title: 'Engineering Daily Standup', attendees: 6, status: 'scheduled' },
    { id: '8', type: 'sprint-retro', time: '13:00', title: 'Sprint 14 Retrospective', attendees: 7, status: 'scheduled' }
  ],
  '2024-12-20': [
    { id: '9', type: 'daily-standup', time: '09:00', title: 'Engineering Daily Standup', attendees: 6, status: 'scheduled' },
    { id: '10', type: 'okr-planning', time: '10:00', title: 'Q1 2025 OKR Planning', attendees: 12, status: 'scheduled' }
  ]
};

// Team availability and metrics
const teamMetrics = {
  totalMeetings: 142,
  averageAttendance: 87.3,
  meetingEfficiency: 78.5,
  crossTeamCollaboration: 92.1,
  weeklyHours: {
    'Engineering': 4.5,
    'Product': 6.2,
    'Design': 3.8,
    'QA': 2.1,
    'DevOps': 1.9,
    'Leadership': 8.7
  },
  meetingDistribution: {
    'daily-standup': 35,
    'weekly-sync': 20,
    'sprint-planning': 15,
    'sprint-retro': 10,
    'all-hands': 8,
    'okr-planning': 12
  }
};

// Meeting templates and best practices
const meetingBestPractices = [
  {
    category: 'Preparation',
    practices: [
      'Send agenda 24 hours in advance',
      'Include relevant documents and context',
      'Set clear objectives and expected outcomes',
      'Invite only necessary participants'
    ]
  },
  {
    category: 'Execution',
    practices: [
      'Start and end on time',
      'Follow the agenda structure',
      'Encourage active participation',
      'Document decisions and action items'
    ]
  },
  {
    category: 'Follow-up',
    practices: [
      'Send meeting notes within 2 hours',
      'Track action items and ownership',
      'Schedule follow-up meetings if needed',
      'Collect feedback for improvement'
    ]
  }
];

// Cross-team dependencies
const crossTeamDependencies = [
  {
    id: 'dep-1',
    from: 'Engineering',
    to: 'Design',
    description: 'UI mockups for new dashboard features',
    priority: 'high',
    dueDate: '2024-12-22',
    status: 'in-progress'
  },
  {
    id: 'dep-2',
    from: 'Product',
    to: 'Engineering',
    description: 'Feature requirements for user onboarding',
    priority: 'critical',
    dueDate: '2024-12-20',
    status: 'completed'
  },
  {
    id: 'dep-3',
    from: 'QA',
    to: 'DevOps',
    description: 'Test environment configuration',
    priority: 'medium',
    dueDate: '2024-12-25',
    status: 'pending'
  },
  {
    id: 'dep-4',
    from: 'Marketing',
    to: 'Product',
    description: 'Feature launch timeline coordination',
    priority: 'high',
    dueDate: '2024-12-30',
    status: 'in-progress'
  }
];

interface CrossFunctionalCoordinationProps {
  // Optional props for customization
}

/**
 * FlashFusion Cross-Functional Coordination Component
 */
export function CrossFunctionalCoordination({}: CrossFunctionalCoordinationProps) {
  const [selectedDate, setSelectedDate] = useState('2024-12-19');
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'metrics' | 'dependencies'>('calendar');
  const [filterType, setFilterType] = useState<string>('all');

  // Get current week dates
  const currentWeek = useMemo(() => {
    const dates = [];
    const startDate = new Date('2024-12-16');
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  }, []);

  // Filter meetings by type
  const filteredCalendar = useMemo(() => {
    if (filterType === 'all') return sampleCalendar;
    
    const filtered: typeof sampleCalendar = {};
    Object.entries(sampleCalendar).forEach(([date, meetings]) => {
      const filteredMeetings = meetings.filter(meeting => meeting.type === filterType);
      if (filteredMeetings.length > 0) {
        filtered[date] = filteredMeetings;
      }
    });
    return filtered;
  }, [filterType]);

  // Get meetings for selected date
  const selectedDateMeetings = useMemo(() => {
    return filteredCalendar[selectedDate] || [];
  }, [selectedDate, filteredCalendar]);

  const getMeetingTypeColor = (type: string) => {
    return meetingTypes[type as keyof typeof meetingTypes]?.color || 'var(--ff-text-muted)';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'var(--ff-success)';
      case 'in-progress': return 'var(--ff-warning)';
      case 'pending': return 'var(--ff-text-muted)';
      case 'scheduled': return 'var(--ff-secondary)';
      default: return 'var(--ff-text-muted)';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Clock;
      case 'pending': return AlertTriangle;
      case 'scheduled': return Calendar;
      default: return XCircle;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'var(--ff-error)';
      case 'high': return 'var(--ff-warning)';
      case 'medium': return 'var(--ff-secondary)';
      case 'low': return 'var(--ff-success)';
      default: return 'var(--ff-text-muted)';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)]" style={{ fontFamily: 'var(--ff-font-secondary)' }}>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 ff-fade-in-up">
          <Badge className="ff-badge-secondary mb-4">
            <MessageSquare className="w-4 h-4 mr-2" />
            Cross-Functional Coordination
          </Badge>
          
          <h1 className="ff-text-display">
            Team
            <span className="ff-text-gradient"> Coordination</span>
          </h1>
          
          <p className="ff-text-body max-w-3xl mx-auto">
            Comprehensive scheduling and coordination system for daily stand-ups, weekly syncs,
            sprint planning, retrospectives, all-hands meetings, and quarterly OKR planning with
            color-coded meeting types and cross-team dependency tracking.
          </p>
        </div>

        {/* Coordination Control Panel */}
        <Card className="ff-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="ff-text-title flex items-center gap-2">
                <Activity className="w-5 h-5 text-[var(--ff-secondary)]" />
                Coordination Dashboard
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[var(--ff-text-muted)]" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-1 bg-[var(--ff-surface)] border border-[var(--border)] rounded text-sm text-[var(--ff-text-primary)] focus:outline-none focus:border-[var(--ff-primary)]"
                  >
                    <option value="all">All Meetings</option>
                    {Object.entries(meetingTypes).map(([key, type]) => (
                      <option key={key} value={key}>{type.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setViewMode('calendar')}
                    size="sm"
                    className={viewMode === 'calendar' ? 'ff-btn-secondary' : 'ff-btn-outline'}
                  >
                    Calendar
                  </Button>
                  <Button
                    onClick={() => setViewMode('metrics')}
                    size="sm"
                    className={viewMode === 'metrics' ? 'ff-btn-secondary' : 'ff-btn-outline'}
                  >
                    Metrics
                  </Button>
                  <Button
                    onClick={() => setViewMode('dependencies')}
                    size="sm"
                    className={viewMode === 'dependencies' ? 'ff-btn-secondary' : 'ff-btn-outline'}
                  >
                    Dependencies
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--ff-primary)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Calendar className="w-6 h-6 text-[var(--ff-primary)]" />
                </div>
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  {teamMetrics.totalMeetings}
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Total Meetings</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--ff-success)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-[var(--ff-success)]" />
                </div>
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  {teamMetrics.averageAttendance}%
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Avg Attendance</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--ff-warning)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Target className="w-6 h-6 text-[var(--ff-warning)]" />
                </div>
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  {teamMetrics.meetingEfficiency}%
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Efficiency Score</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--ff-secondary)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <MessageSquare className="w-6 h-6 text-[var(--ff-secondary)]" />
                </div>
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  {teamMetrics.crossTeamCollaboration}%
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Collaboration</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Switching */}
        {viewMode === 'calendar' && (
          <div className="grid lg:grid-cols-3 gap-6 ff-stagger-fade">
            {/* Calendar View */}
            <div className="lg:col-span-2 space-y-6">
              {/* Week Navigation */}
              <Card className="ff-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="ff-text-base">Week of December 16, 2024</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="ff-btn-outline">
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      <Button size="sm" className="ff-btn-outline">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {currentWeek.map((date) => {
                      const dayMeetings = filteredCalendar[date] || [];
                      const isSelected = date === selectedDate;
                      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
                      const dayNumber = new Date(date).getDate();
                      
                      return (
                        <div
                          key={date}
                          className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? 'bg-[var(--ff-primary)]/20 border border-[var(--ff-primary)]' 
                              : 'bg-[var(--ff-surface)] hover:bg-[var(--ff-surface-light)]'
                          }`}
                          onClick={() => setSelectedDate(date)}
                        >
                          <div className="text-center">
                            <div className="ff-text-xs text-[var(--ff-text-muted)]">{dayName}</div>
                            <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                              {dayNumber}
                            </div>
                            <div className="mt-2 space-y-1">
                              {dayMeetings.slice(0, 2).map((meeting) => (
                                <div
                                  key={meeting.id}
                                  className="w-full h-2 rounded-full"
                                  style={{ backgroundColor: getMeetingTypeColor(meeting.type) }}
                                />
                              ))}
                              {dayMeetings.length > 2 && (
                                <div className="ff-text-xs text-[var(--ff-text-muted)]">
                                  +{dayMeetings.length - 2} more
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Daily Meetings */}
              <Card className="ff-card">
                <CardHeader>
                  <CardTitle className="ff-text-base">
                    {new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDateMeetings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-[var(--ff-text-muted)] mx-auto mb-4" />
                      <p className="ff-text-sm text-[var(--ff-text-muted)]">No meetings scheduled for this day</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedDateMeetings.map((meeting) => {
                        const meetingType = meetingTypes[meeting.type as keyof typeof meetingTypes];
                        
                        return (
                          <Card 
                            key={meeting.id} 
                            className={`ff-card cursor-pointer transition-all duration-200 ${
                              selectedMeeting === meeting.id 
                                ? 'border-[var(--ff-primary)] bg-[var(--ff-surface-light)]' 
                                : 'hover:border-[var(--ff-primary)]/30'
                            }`}
                            onClick={() => setSelectedMeeting(selectedMeeting === meeting.id ? null : meeting.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: getMeetingTypeColor(meeting.type) }}
                                  />
                                  <div>
                                    <h3 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                      {meeting.title}
                                    </h3>
                                    <p className="ff-text-xs text-[var(--ff-text-muted)]">
                                      {meeting.time} • {meetingType?.duration}min • {meeting.attendees} attendees
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className="ff-badge-secondary text-xs">
                                    {meetingType?.name}
                                  </Badge>
                                  {React.createElement(getStatusIcon(meeting.status), {
                                    className: "w-4 h-4",
                                    style: { color: getStatusColor(meeting.status) }
                                  })}
                                </div>
                              </div>
                              
                              {selectedMeeting === meeting.id && meetingType && (
                                <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-3">
                                  <div>
                                    <h4 className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                      Participants
                                    </h4>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {meetingType.participants.map((participant, index) => (
                                        <Badge key={index} className="ff-badge-secondary text-xs">
                                          {participant}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                      Agenda
                                    </h4>
                                    <ul className="mt-1 space-y-1">
                                      {meetingType.template.agenda.slice(0, 3).map((item, index) => (
                                        <li key={index} className="ff-text-xs text-[var(--ff-text-muted)] flex items-start gap-1">
                                          <span className="w-1 h-1 bg-[var(--ff-primary)] rounded-full mt-1.5 flex-shrink-0"></span>
                                          {item}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <Button size="sm" className="ff-btn-primary">
                                      <Video className="w-3 h-3 mr-1" />
                                      Join
                                    </Button>
                                    <Button size="sm" className="ff-btn-outline">
                                      <Edit className="w-3 h-3 mr-1" />
                                      Edit
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Meeting Types Legend */}
            <div className="space-y-6">
              <Card className="ff-card">
                <CardHeader>
                  <CardTitle className="ff-text-base">Meeting Types</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(meetingTypes).map(([key, type]) => (
                    <div key={key} className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: type.color }}
                      />
                      <div className="flex-1">
                        <div className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                          {type.name}
                        </div>
                        <div className="ff-text-xs text-[var(--ff-text-muted)]">
                          {type.duration}min • {type.frequency}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="ff-card">
                <CardHeader>
                  <CardTitle className="ff-text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full ff-btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Meeting
                  </Button>
                  <Button className="w-full ff-btn-secondary">
                    <Settings className="w-4 h-4 mr-2" />
                    Meeting Settings
                  </Button>
                  <Button className="w-full ff-btn-outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Calendar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {viewMode === 'metrics' && (
          <div className="space-y-6 ff-stagger-fade">
            {/* Meeting Metrics */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="ff-card">
                <CardHeader>
                  <CardTitle className="ff-text-base">Weekly Meeting Hours by Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(teamMetrics.weeklyHours).map(([team, hours]) => (
                      <div key={team} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="ff-text-sm text-[var(--ff-text-primary)]">{team}</span>
                          <span className="ff-text-sm text-[var(--ff-text-secondary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                            {hours}h
                          </span>
                        </div>
                        <Progress value={(hours / 10) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="ff-card">
                <CardHeader>
                  <CardTitle className="ff-text-base">Meeting Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(teamMetrics.meetingDistribution).map(([type, percentage]) => {
                      const meetingType = meetingTypes[type as keyof typeof meetingTypes];
                      
                      return (
                        <div key={type} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: meetingType?.color }}
                              />
                              <span className="ff-text-sm text-[var(--ff-text-primary)]">
                                {meetingType?.name}
                              </span>
                            </div>
                            <span className="ff-text-sm text-[var(--ff-text-secondary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                              {percentage}%
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Best Practices */}
            <Card className="ff-card">
              <CardHeader>
                <CardTitle className="ff-text-base">Meeting Best Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {meetingBestPractices.map((category, index) => (
                    <div key={index} className="space-y-3">
                      <h3 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                        {category.category}
                      </h3>
                      <ul className="space-y-2">
                        {category.practices.map((practice, i) => (
                          <li key={i} className="ff-text-xs text-[var(--ff-text-muted)] flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 text-[var(--ff-success)] mt-0.5 flex-shrink-0" />
                            {practice}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {viewMode === 'dependencies' && (
          <div className="space-y-6 ff-stagger-fade">
            {/* Cross-Team Dependencies */}
            <Card className="ff-card">
              <CardHeader>
                <CardTitle className="ff-text-base">Cross-Team Dependencies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {crossTeamDependencies.map((dependency) => {
                    const StatusIcon = getStatusIcon(dependency.status);
                    
                    return (
                      <Card key={dependency.id} className="ff-card">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="flex items-center gap-2">
                                  <Badge className="ff-badge-primary text-xs">{dependency.from}</Badge>
                                  <ArrowRight className="w-3 h-3 text-[var(--ff-text-muted)]" />
                                  <Badge className="ff-badge-secondary text-xs">{dependency.to}</Badge>
                                </div>
                                <Badge 
                                  className={`ff-badge-${dependency.priority === 'critical' ? 'error' : dependency.priority === 'high' ? 'warning' : 'secondary'} text-xs`}
                                >
                                  {dependency.priority}
                                </Badge>
                              </div>
                              
                              <p className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                {dependency.description}
                              </p>
                              
                              <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-[var(--ff-text-muted)]" />
                                  <span className="ff-text-xs text-[var(--ff-text-muted)]">
                                    Due: {new Date(dependency.dueDate).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <StatusIcon className="w-3 h-3" style={{ color: getStatusColor(dependency.status) }} />
                                  <span className="ff-text-xs text-[var(--ff-text-muted)] capitalize">
                                    {dependency.status.replace('-', ' ')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default CrossFunctionalCoordination;
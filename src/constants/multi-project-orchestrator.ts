export const PROJECT_STATUS_COLORS = {
  active: 'text-green-600 bg-green-100',
  planning: 'text-blue-600 bg-blue-100',
  completed: 'text-purple-600 bg-purple-100',
  'on-hold': 'text-yellow-600 bg-yellow-100'
} as const;

export const PRIORITY_COLORS = {
  high: 'border-red-500 text-red-700',
  medium: 'border-yellow-500 text-yellow-700',
  low: 'border-green-500 text-green-700'
} as const;

export const IMPLEMENTATION_EFFORT_COLORS = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
  completed: 'bg-purple-100 text-purple-800'
} as const;

export const BOTTLENECK_RISK_COLORS = {
  high: 'border-red-500 text-red-700',
  medium: 'border-yellow-500 text-yellow-700',
  low: 'border-green-500 text-green-700'
} as const;

export const PERFORMANCE_GRADE_CONFIG = [
  { threshold: 90, grade: 'A+', color: 'text-green-600', bg: 'bg-green-100' },
  { threshold: 85, grade: 'A', color: 'text-green-600', bg: 'bg-green-100' },
  { threshold: 80, grade: 'B+', color: 'text-blue-600', bg: 'bg-blue-100' },
  { threshold: 75, grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' },
  { threshold: 70, grade: 'C+', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { threshold: 0, grade: 'C', color: 'text-orange-600', bg: 'bg-orange-100' }
];

export const SAMPLE_PROJECTS = [
  {
    id: 'proj-1',
    name: 'E-commerce Platform',
    status: 'active' as const,
    progress: 78,
    priority: 'high' as const,
    agentsAssigned: 6,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    type: 'web-app'
  },
  {
    id: 'proj-2', 
    name: 'Mobile Banking App',
    status: 'active' as const,
    progress: 45,
    priority: 'medium' as const,
    agentsAssigned: 4,
    deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    type: 'mobile-app'
  },
  {
    id: 'proj-3',
    name: 'AI Analytics Dashboard',
    status: 'planning' as const,
    progress: 15,
    priority: 'medium' as const,
    agentsAssigned: 2,
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    type: 'web-app'
  }
];

export const SAMPLE_SYNERGIES = [
  {
    projectIds: ['proj-1', 'proj-2'],
    synergyType: 'component_reuse' as const,
    opportunity: 'Authentication system components can be reused between e-commerce and banking projects',
    impactScore: 85,
    implementationEffort: 'low' as const,
    timeline: '2-3 days',
    benefitDescription: 'Reduce development time by 40% and ensure consistent security standards'
  },
  {
    projectIds: ['proj-2', 'proj-3'],
    synergyType: 'knowledge_transfer' as const,
    opportunity: 'Mobile app UI/UX insights can inform analytics dashboard design',
    impactScore: 70,
    implementationEffort: 'medium' as const,
    timeline: '1 week',
    benefitDescription: 'Improved user experience consistency and faster design iterations'
  },
  {
    projectIds: ['proj-1', 'proj-3'],
    synergyType: 'resource_sharing' as const,
    opportunity: 'Backend developer can work on both projects during overlapping phases',
    impactScore: 92,
    implementationEffort: 'low' as const,
    timeline: 'Immediate',
    benefitDescription: 'Optimize developer utilization and accelerate both projects'
  }
];
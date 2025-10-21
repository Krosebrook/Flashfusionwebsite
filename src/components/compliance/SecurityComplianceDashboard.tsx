/**
 * @fileoverview FlashFusion Security & Compliance Dashboard
 * @chunk compliance
 * @category security-compliance
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Comprehensive compliance checklist interface for SOC 2 Type II, GDPR/HIPAA/CCPA 
 * requirements, data encryption, user consent management, audit log retention,
 * and incident response planning.
 * 
 * Features:
 * - SOC 2 Type II compliance tracking
 * - GDPR/HIPAA/CCPA requirements management
 * - Data encryption monitoring (at rest & in transit)
 * - User consent management system
 * - Audit log retention policies
 * - Incident response planning
 * - Real-time compliance scoring
 * - Automated compliance reports
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import { 
  Shield, 
  Lock, 
  FileText, 
  Users, 
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Key,
  Database,
  Globe,
  Settings,
  Download,
  Upload,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  BookOpen,
  Zap,
  Target,
  Award,
  Activity,
  Server,
  Cloud,
  Smartphone,
  Monitor,
  Bell,
  Archive,
  FileCheck,
  UserCheck,
  ShieldCheck,
  Fingerprint,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Building,
  Scale,
  Gavel,
  ClipboardCheck,
  HardDrive,
  Wifi,
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

// Compliance frameworks data
const complianceFrameworks = {
  soc2: {
    name: 'SOC 2 Type II',
    description: 'System and Organization Controls for security, availability, processing integrity, confidentiality, and privacy',
    score: 87.5,
    status: 'in-progress',
    lastAudit: '2024-11-15',
    nextAudit: '2025-05-15',
    categories: {
      security: {
        name: 'Security',
        progress: 92,
        tasks: [
          { id: 'sec-1', name: 'Multi-factor authentication implementation', completed: true, priority: 'high', assignee: 'Security Team' },
          { id: 'sec-2', name: 'Access control policy documentation', completed: true, priority: 'high', assignee: 'Compliance Team' },
          { id: 'sec-3', name: 'Network security monitoring', completed: true, priority: 'medium', assignee: 'DevOps Team' },
          { id: 'sec-4', name: 'Vulnerability management program', completed: false, priority: 'high', assignee: 'Security Team' },
          { id: 'sec-5', name: 'Security incident response testing', completed: true, priority: 'medium', assignee: 'Security Team' },
          { id: 'sec-6', name: 'Data classification and handling', completed: true, priority: 'high', assignee: 'Data Team' }
        ]
      },
      availability: {
        name: 'Availability',
        progress: 85,
        tasks: [
          { id: 'avail-1', name: 'Business continuity plan', completed: true, priority: 'high', assignee: 'Operations Team' },
          { id: 'avail-2', name: 'Disaster recovery procedures', completed: true, priority: 'high', assignee: 'DevOps Team' },
          { id: 'avail-3', name: 'System monitoring and alerting', completed: true, priority: 'medium', assignee: 'SRE Team' },
          { id: 'avail-4', name: 'Capacity planning documentation', completed: false, priority: 'medium', assignee: 'Architecture Team' },
          { id: 'avail-5', name: 'Performance monitoring setup', completed: true, priority: 'medium', assignee: 'DevOps Team' }
        ]
      },
      processingIntegrity: {
        name: 'Processing Integrity',
        progress: 80,
        tasks: [
          { id: 'pi-1', name: 'Data validation procedures', completed: true, priority: 'high', assignee: 'Development Team' },
          { id: 'pi-2', name: 'Error handling documentation', completed: false, priority: 'medium', assignee: 'Development Team' },
          { id: 'pi-3', name: 'Data processing controls', completed: true, priority: 'high', assignee: 'Data Team' },
          { id: 'pi-4', name: 'System change management', completed: true, priority: 'medium', assignee: 'DevOps Team' },
          { id: 'pi-5', name: 'Quality assurance procedures', completed: false, priority: 'medium', assignee: 'QA Team' }
        ]
      },
      confidentiality: {
        name: 'Confidentiality',
        progress: 95,
        tasks: [
          { id: 'conf-1', name: 'Data encryption at rest', completed: true, priority: 'high', assignee: 'Security Team' },
          { id: 'conf-2', name: 'Data encryption in transit', completed: true, priority: 'high', assignee: 'Security Team' },
          { id: 'conf-3', name: 'Access logging and monitoring', completed: true, priority: 'medium', assignee: 'Security Team' },
          { id: 'conf-4', name: 'Data retention policies', completed: true, priority: 'medium', assignee: 'Legal Team' },
          { id: 'conf-5', name: 'Secure data disposal', completed: false, priority: 'medium', assignee: 'IT Team' }
        ]
      },
      privacy: {
        name: 'Privacy',
        progress: 88,
        tasks: [
          { id: 'priv-1', name: 'Privacy policy documentation', completed: true, priority: 'high', assignee: 'Legal Team' },
          { id: 'priv-2', name: 'Data subject rights procedures', completed: true, priority: 'high', assignee: 'Legal Team' },
          { id: 'priv-3', name: 'Consent management system', completed: true, priority: 'medium', assignee: 'Development Team' },
          { id: 'priv-4', name: 'Privacy impact assessments', completed: false, priority: 'medium', assignee: 'Legal Team' },
          { id: 'priv-5', name: 'Third-party privacy agreements', completed: true, priority: 'medium', assignee: 'Legal Team' }
        ]
      }
    }
  },
  gdpr: {
    name: 'GDPR',
    description: 'General Data Protection Regulation compliance for EU data protection',
    score: 91.2,
    status: 'compliant',
    lastReview: '2024-12-01',
    nextReview: '2025-06-01',
    requirements: [
      { id: 'gdpr-1', name: 'Lawful basis for processing', completed: true, priority: 'critical', category: 'Legal Basis' },
      { id: 'gdpr-2', name: 'Data subject consent mechanisms', completed: true, priority: 'critical', category: 'Consent' },
      { id: 'gdpr-3', name: 'Right to access implementation', completed: true, priority: 'high', category: 'Rights' },
      { id: 'gdpr-4', name: 'Right to rectification procedures', completed: true, priority: 'high', category: 'Rights' },
      { id: 'gdpr-5', name: 'Right to erasure (right to be forgotten)', completed: true, priority: 'high', category: 'Rights' },
      { id: 'gdpr-6', name: 'Right to data portability', completed: false, priority: 'medium', category: 'Rights' },
      { id: 'gdpr-7', name: 'Right to object mechanisms', completed: true, priority: 'medium', category: 'Rights' },
      { id: 'gdpr-8', name: 'Data breach notification procedures', completed: true, priority: 'critical', category: 'Breach' },
      { id: 'gdpr-9', name: 'Privacy by design implementation', completed: true, priority: 'high', category: 'Design' },
      { id: 'gdpr-10', name: 'Data protection impact assessments', completed: false, priority: 'medium', category: 'Assessment' },
      { id: 'gdpr-11', name: 'Records of processing activities', completed: true, priority: 'high', category: 'Documentation' },
      { id: 'gdpr-12', name: 'Data processing agreements', completed: true, priority: 'high', category: 'Contracts' }
    ]
  },
  hipaa: {
    name: 'HIPAA',
    description: 'Health Insurance Portability and Accountability Act compliance for healthcare data',
    score: 85.7,
    status: 'in-progress',
    lastAssessment: '2024-10-15',
    nextAssessment: '2025-04-15',
    safeguards: {
      administrative: {
        name: 'Administrative Safeguards',
        progress: 88,
        requirements: [
          { id: 'hipaa-admin-1', name: 'Security officer designation', completed: true, priority: 'required' },
          { id: 'hipaa-admin-2', name: 'Workforce training program', completed: true, priority: 'required' },
          { id: 'hipaa-admin-3', name: 'Access management procedures', completed: true, priority: 'required' },
          { id: 'hipaa-admin-4', name: 'Security incident procedures', completed: false, priority: 'required' },
          { id: 'hipaa-admin-5', name: 'Business associate agreements', completed: true, priority: 'required' }
        ]
      },
      physical: {
        name: 'Physical Safeguards',
        progress: 82,
        requirements: [
          { id: 'hipaa-phys-1', name: 'Facility access controls', completed: true, priority: 'required' },
          { id: 'hipaa-phys-2', name: 'Workstation use restrictions', completed: true, priority: 'required' },
          { id: 'hipaa-phys-3', name: 'Device and media controls', completed: false, priority: 'required' },
          { id: 'hipaa-phys-4', name: 'Equipment disposal procedures', completed: true, priority: 'addressable' }
        ]
      },
      technical: {
        name: 'Technical Safeguards',
        progress: 87,
        requirements: [
          { id: 'hipaa-tech-1', name: 'Access control systems', completed: true, priority: 'required' },
          { id: 'hipaa-tech-2', name: 'Audit controls implementation', completed: true, priority: 'required' },
          { id: 'hipaa-tech-3', name: 'Data integrity controls', completed: true, priority: 'required' },
          { id: 'hipaa-tech-4', name: 'Transmission security', completed: false, priority: 'required' },
          { id: 'hipaa-tech-5', name: 'Encryption at rest', completed: true, priority: 'addressable' }
        ]
      }
    }
  },
  ccpa: {
    name: 'CCPA',
    description: 'California Consumer Privacy Act compliance for California residents',
    score: 89.3,
    status: 'compliant',
    lastReview: '2024-11-20',
    nextReview: '2025-05-20',
    consumerRights: [
      { id: 'ccpa-1', name: 'Right to know about personal information', completed: true, priority: 'required' },
      { id: 'ccpa-2', name: 'Right to delete personal information', completed: true, priority: 'required' },
      { id: 'ccpa-3', name: 'Right to opt-out of sale', completed: true, priority: 'required' },
      { id: 'ccpa-4', name: 'Right to non-discrimination', completed: true, priority: 'required' },
      { id: 'ccpa-5', name: 'Authorized agent procedures', completed: false, priority: 'required' },
      { id: 'ccpa-6', name: 'Verifiable consumer requests', completed: true, priority: 'required' },
      { id: 'ccpa-7', name: 'Privacy policy disclosures', completed: true, priority: 'required' },
      { id: 'ccpa-8', name: 'Data collection notifications', completed: true, priority: 'required' }
    ]
  }
};

// Data encryption and security measures
const encryptionStatus = {
  atRest: {
    status: 'active',
    method: 'AES-256',
    coverage: 98.5,
    lastVerified: '2024-12-19T10:30:00Z',
    systems: [
      { name: 'Primary Database', encrypted: true, method: 'AES-256', status: 'active' },
      { name: 'File Storage', encrypted: true, method: 'AES-256', status: 'active' },
      { name: 'Backup Systems', encrypted: true, method: 'AES-256', status: 'active' },
      { name: 'Log Storage', encrypted: false, method: 'none', status: 'pending' },
      { name: 'Cache Layer', encrypted: true, method: 'AES-128', status: 'active' }
    ]
  },
  inTransit: {
    status: 'active',
    method: 'TLS 1.3',
    coverage: 100,
    lastVerified: '2024-12-19T11:00:00Z',
    endpoints: [
      { name: 'API Endpoints', encrypted: true, method: 'TLS 1.3', status: 'active' },
      { name: 'Web Application', encrypted: true, method: 'TLS 1.3', status: 'active' },
      { name: 'Database Connections', encrypted: true, method: 'TLS 1.2', status: 'active' },
      { name: 'Internal Services', encrypted: true, method: 'TLS 1.3', status: 'active' },
      { name: 'Third-party APIs', encrypted: true, method: 'TLS 1.3', status: 'active' }
    ]
  }
};

// User consent management
const consentManagement = {
  totalUsers: 45892,
  consentedUsers: 44128,
  consentRate: 96.2,
  lastUpdated: '2024-12-19T09:15:00Z',
  consentTypes: [
    { type: 'Essential', consented: 45892, required: true, rate: 100 },
    { type: 'Analytics', consented: 41203, required: false, rate: 89.8 },
    { type: 'Marketing', consented: 38745, required: false, rate: 84.4 },
    { type: 'Personalization', consented: 42156, required: false, rate: 91.9 },
    { type: 'Third-party', consented: 35672, required: false, rate: 77.8 }
  ],
  recentActivity: [
    { action: 'Consent granted', type: 'Marketing', count: 156, timestamp: '2024-12-19T11:30:00Z' },
    { action: 'Consent withdrawn', type: 'Analytics', count: 23, timestamp: '2024-12-19T10:45:00Z' },
    { action: 'Consent updated', type: 'Personalization', count: 89, timestamp: '2024-12-19T09:20:00Z' }
  ]
};

// Audit log retention
const auditLogRetention = {
  totalLogs: 2847392,
  retentionPeriod: '7 years',
  storageUsed: '2.3 TB',
  lastArchived: '2024-12-15T00:00:00Z',
  categories: [
    { category: 'Access Logs', count: 1248392, retention: '7 years', status: 'active' },
    { category: 'Data Changes', count: 785643, retention: '10 years', status: 'active' },
    { category: 'System Events', count: 456789, retention: '5 years', status: 'active' },
    { category: 'Security Events', count: 189456, retention: '10 years', status: 'active' },
    { category: 'Admin Actions', count: 167112, retention: '7 years', status: 'active' }
  ],
  archivalSchedule: [
    { period: 'Daily', time: '02:00 UTC', status: 'active', lastRun: '2024-12-19T02:00:00Z' },
    { period: 'Weekly', time: 'Sunday 03:00 UTC', status: 'active', lastRun: '2024-12-15T03:00:00Z' },
    { period: 'Monthly', time: '1st 04:00 UTC', status: 'active', lastRun: '2024-12-01T04:00:00Z' }
  ]
};

// Incident response plan
const incidentResponse = {
  currentThreatLevel: 'low',
  incidentsThisMonth: 3,
  averageResponseTime: '12 minutes',
  lastIncident: '2024-12-10T15:30:00Z',
  responseTeam: [
    { role: 'Incident Commander', name: 'Sarah Chen', contact: 'sarah.chen@flashfusion.ai', status: 'available' },
    { role: 'Security Lead', name: 'Marcus Rodriguez', contact: 'marcus.r@flashfusion.ai', status: 'available' },
    { role: 'Technical Lead', name: 'Aisha Patel', contact: 'aisha.patel@flashfusion.ai', status: 'on-call' },
    { role: 'Communications Lead', name: 'David Kim', contact: 'david.kim@flashfusion.ai', status: 'available' }
  ],
  procedures: [
    { phase: 'Detection', duration: '0-5 minutes', status: 'automated', description: 'Automated monitoring and alerting' },
    { phase: 'Analysis', duration: '5-15 minutes', status: 'manual', description: 'Incident classification and assessment' },
    { phase: 'Containment', duration: '15-30 minutes', status: 'manual', description: 'Immediate threat containment' },
    { phase: 'Investigation', duration: '30+ minutes', status: 'manual', description: 'Root cause analysis' },
    { phase: 'Recovery', duration: 'Variable', status: 'manual', description: 'Service restoration' },
    { phase: 'Lessons Learned', duration: '24-48 hours', status: 'manual', description: 'Post-incident review' }
  ],
  recentIncidents: [
    { 
      id: 'INC-2024-087', 
      type: 'Suspicious Login Activity', 
      severity: 'medium', 
      status: 'resolved', 
      detectedAt: '2024-12-10T15:30:00Z',
      resolvedAt: '2024-12-10T16:15:00Z',
      responseTime: '45 minutes'
    },
    { 
      id: 'INC-2024-086', 
      type: 'Failed Login Attempts', 
      severity: 'low', 
      status: 'resolved', 
      detectedAt: '2024-12-08T09:22:00Z',
      resolvedAt: '2024-12-08T09:35:00Z',
      responseTime: '13 minutes'
    },
    { 
      id: 'INC-2024-085', 
      type: 'API Rate Limit Exceeded', 
      severity: 'low', 
      status: 'resolved', 
      detectedAt: '2024-12-05T14:18:00Z',
      resolvedAt: '2024-12-05T14:25:00Z',
      responseTime: '7 minutes'
    }
  ]
};

interface SecurityComplianceDashboardProps {
  // Optional props for customization
}

/**
 * FlashFusion Security & Compliance Dashboard Component
 */
export function SecurityComplianceDashboard({}: SecurityComplianceDashboardProps) {
  const [selectedFramework, setSelectedFramework] = useState('soc2');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);

  // Calculate overall compliance score
  const overallScore = useMemo(() => {
    const scores = Object.values(complianceFrameworks).map(framework => framework.score);
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }, []);

  // Filter tasks based on search and status
  const filteredTasks = useMemo(() => {
    const framework = complianceFrameworks[selectedFramework as keyof typeof complianceFrameworks];
    if (!framework) return [];

    let tasks: any[] = [];
    
    if (selectedFramework === 'soc2') {
      tasks = Object.values(framework.categories).flatMap(category => 
        category.tasks.map(task => ({ ...task, category: category.name }))
      );
    } else if (selectedFramework === 'gdpr') {
      tasks = framework.requirements.map(req => ({ ...req, category: req.category }));
    } else if (selectedFramework === 'hipaa') {
      tasks = Object.values(framework.safeguards).flatMap(safeguard =>
        safeguard.requirements.map(req => ({ ...req, category: safeguard.name }))
      );
    } else if (selectedFramework === 'ccpa') {
      tasks = framework.consumerRights.map(right => ({ ...right, category: 'Consumer Rights' }));
    }

    return tasks.filter(task => {
      const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'completed' && task.completed) ||
        (filterStatus === 'pending' && !task.completed);
      return matchesSearch && matchesStatus;
    });
  }, [selectedFramework, searchTerm, filterStatus]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshCount(prev => prev + 1);
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': case 'active': return 'var(--ff-success)';
      case 'in-progress': case 'pending': return 'var(--ff-warning)';
      case 'non-compliant': case 'failed': return 'var(--ff-error)';
      default: return 'var(--ff-text-muted)';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': case 'active': return CheckCircle;
      case 'in-progress': case 'pending': return Clock;
      case 'non-compliant': case 'failed': return XCircle;
      default: return AlertTriangle;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': case 'required': return 'var(--ff-error)';
      case 'high': return 'var(--ff-warning)';
      case 'medium': return 'var(--ff-secondary)';
      case 'low': case 'addressable': return 'var(--ff-text-muted)';
      default: return 'var(--ff-text-muted)';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)]" style={{ fontFamily: 'var(--ff-font-secondary)' }}>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 ff-fade-in-up">
          <Badge className="ff-badge-error mb-4">
            <Shield className="w-4 h-4 mr-2" />
            Security & Compliance
          </Badge>
          
          <h1 className="ff-text-display">
            Critical Risk
            <span className="ff-text-gradient"> Mitigation</span>
          </h1>
          
          <p className="ff-text-body max-w-3xl mx-auto">
            Comprehensive compliance management for SOC 2 Type II, GDPR/HIPAA/CCPA requirements,
            data encryption monitoring, user consent management, and incident response planning.
          </p>
        </div>

        {/* Compliance Overview */}
        <Card className="ff-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="ff-text-title flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[var(--ff-success)]" />
                Compliance Overview
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="ff-badge-success">
                  {overallScore.toFixed(1)}% Overall Score
                </Badge>
                <Button size="sm" className="ff-btn-secondary">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Object.entries(complianceFrameworks).map(([key, framework]) => {
                const StatusIcon = getStatusIcon(framework.status);
                
                return (
                  <Card key={key} className="ff-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                          {framework.name}
                        </h3>
                        <StatusIcon className="w-5 h-5" style={{ color: getStatusColor(framework.status) }} />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="text-center">
                          <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                            {framework.score.toFixed(1)}%
                          </div>
                          <div className="ff-text-xs text-[var(--ff-text-muted)]">Compliance Score</div>
                        </div>
                        
                        <Progress value={framework.score} className="h-2" />
                        
                        <div className="ff-text-xs text-[var(--ff-text-muted)]">
                          {framework.description}
                        </div>
                        
                        <Badge className={`ff-badge-${framework.status === 'compliant' ? 'success' : framework.status === 'in-progress' ? 'warning' : 'error'} w-full justify-center`}>
                          {framework.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Compliance Framework Details */}
        <Card className="ff-card">
          <CardContent className="p-0">
            <Tabs value={selectedFramework} onValueChange={setSelectedFramework} className="w-full">
              <div className="border-b border-[var(--border)]">
                <TabsList className="grid w-full grid-cols-4 bg-[var(--ff-surface)] rounded-none">
                  <TabsTrigger value="soc2" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    SOC 2
                  </TabsTrigger>
                  <TabsTrigger value="gdpr" className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    GDPR
                  </TabsTrigger>
                  <TabsTrigger value="hipaa" className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4" />
                    HIPAA
                  </TabsTrigger>
                  <TabsTrigger value="ccpa" className="flex items-center gap-2">
                    <Scale className="w-4 h-4" />
                    CCPA
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* Controls and Filters */}
              <div className="p-6 border-b border-[var(--border)]">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--ff-text-muted)]" />
                      <input
                        type="text"
                        placeholder="Search compliance tasks..."
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
                    <option value="all">All Tasks</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                  
                  <Button className="ff-btn-primary">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>

              {/* SOC 2 Tab */}
              <TabsContent value="soc2" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="ff-text-title">SOC 2 Type II Controls</h3>
                  <Badge className="ff-badge-warning">
                    87.5% Complete
                  </Badge>
                </div>
                
                <div className="space-y-6">
                  {Object.entries(complianceFrameworks.soc2.categories).map(([key, category]) => (
                    <Card key={key} className="ff-card">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="ff-text-base">{category.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <span className="ff-text-sm text-[var(--ff-text-secondary)]">{category.progress}%</span>
                            <Progress value={category.progress} className="w-20 h-2" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {category.tasks.map((task) => (
                          <div key={task.id} className="flex items-center gap-3 p-3 bg-[var(--ff-surface-light)] rounded-lg">
                            <Checkbox 
                              checked={task.completed}
                              className="flex-shrink-0"
                            />
                            <div className="flex-1">
                              <div className="ff-text-sm text-[var(--ff-text-primary)]">{task.name}</div>
                              <div className="ff-text-xs text-[var(--ff-text-muted)] mt-1">
                                Assigned to: {task.assignee}
                              </div>
                            </div>
                            <Badge 
                              className={`ff-badge-${task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'secondary'}`}
                            >
                              {task.priority}
                            </Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* GDPR Tab */}
              <TabsContent value="gdpr" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="ff-text-title">GDPR Requirements</h3>
                  <Badge className="ff-badge-success">
                    91.2% Compliant
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {complianceFrameworks.gdpr.requirements.map((requirement) => (
                    <div key={requirement.id} className="flex items-center gap-3 p-4 bg-[var(--ff-surface)] rounded-lg border border-[var(--border)]">
                      <Checkbox 
                        checked={requirement.completed}
                        className="flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                          {requirement.name}
                        </div>
                        <div className="ff-text-xs text-[var(--ff-text-muted)] mt-1">
                          Category: {requirement.category}
                        </div>
                      </div>
                      <Badge 
                        className={`ff-badge-${requirement.priority === 'critical' ? 'error' : requirement.priority === 'high' ? 'warning' : 'secondary'}`}
                      >
                        {requirement.priority}
                      </Badge>
                      {requirement.completed ? (
                        <CheckCircle className="w-5 h-5 text-[var(--ff-success)]" />
                      ) : (
                        <Clock className="w-5 h-5 text-[var(--ff-warning)]" />
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              {/* HIPAA Tab */}
              <TabsContent value="hipaa" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="ff-text-title">HIPAA Safeguards</h3>
                  <Badge className="ff-badge-warning">
                    85.7% Complete
                  </Badge>
                </div>
                
                <div className="space-y-6">
                  {Object.entries(complianceFrameworks.hipaa.safeguards).map(([key, safeguard]) => (
                    <Card key={key} className="ff-card">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="ff-text-base">{safeguard.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <span className="ff-text-sm text-[var(--ff-text-secondary)]">{safeguard.progress}%</span>
                            <Progress value={safeguard.progress} className="w-20 h-2" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {safeguard.requirements.map((requirement) => (
                          <div key={requirement.id} className="flex items-center gap-3 p-3 bg-[var(--ff-surface-light)] rounded-lg">
                            <Checkbox 
                              checked={requirement.completed}
                              className="flex-shrink-0"
                            />
                            <div className="flex-1">
                              <div className="ff-text-sm text-[var(--ff-text-primary)]">{requirement.name}</div>
                            </div>
                            <Badge 
                              className={`ff-badge-${requirement.priority === 'required' ? 'error' : 'secondary'}`}
                            >
                              {requirement.priority}
                            </Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* CCPA Tab */}
              <TabsContent value="ccpa" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="ff-text-title">CCPA Consumer Rights</h3>
                  <Badge className="ff-badge-success">
                    89.3% Compliant
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {complianceFrameworks.ccpa.consumerRights.map((right) => (
                    <div key={right.id} className="flex items-center gap-3 p-4 bg-[var(--ff-surface)] rounded-lg border border-[var(--border)]">
                      <Checkbox 
                        checked={right.completed}
                        className="flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                          {right.name}
                        </div>
                      </div>
                      <Badge className="ff-badge-error">
                        {right.priority}
                      </Badge>
                      {right.completed ? (
                        <CheckCircle className="w-5 h-5 text-[var(--ff-success)]" />
                      ) : (
                        <Clock className="w-5 h-5 text-[var(--ff-warning)]" />
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Data Encryption Status */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="ff-card">
            <CardHeader>
              <CardTitle className="ff-text-title flex items-center gap-2">
                <Lock className="w-5 h-5 text-[var(--ff-secondary)]" />
                Data Encryption at Rest
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="ff-text-sm text-[var(--ff-text-secondary)]">Coverage</span>
                <span className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                  {encryptionStatus.atRest.coverage}%
                </span>
              </div>
              <Progress value={encryptionStatus.atRest.coverage} className="h-2" />
              
              <div className="space-y-3">
                {encryptionStatus.atRest.systems.map((system, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-[var(--ff-surface-light)] rounded-lg">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-[var(--ff-text-muted)]" />
                      <span className="ff-text-sm text-[var(--ff-text-primary)]">{system.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`ff-badge-${system.encrypted ? 'success' : 'error'}`}>
                        {system.method}
                      </Badge>
                      {system.encrypted ? (
                        <CheckCircle className="w-4 h-4 text-[var(--ff-success)]" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[var(--ff-error)]" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="ff-card">
            <CardHeader>
              <CardTitle className="ff-text-title flex items-center gap-2">
                <Wifi className="w-5 h-5 text-[var(--ff-primary)]" />
                Data Encryption in Transit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="ff-text-sm text-[var(--ff-text-secondary)]">Coverage</span>
                <span className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                  {encryptionStatus.inTransit.coverage}%
                </span>
              </div>
              <Progress value={encryptionStatus.inTransit.coverage} className="h-2" />
              
              <div className="space-y-3">
                {encryptionStatus.inTransit.endpoints.map((endpoint, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-[var(--ff-surface-light)] rounded-lg">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[var(--ff-text-muted)]" />
                      <span className="ff-text-sm text-[var(--ff-text-primary)]">{endpoint.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="ff-badge-success">
                        {endpoint.method}
                      </Badge>
                      <CheckCircle className="w-4 h-4 text-[var(--ff-success)]" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Consent Management */}
        <Card className="ff-card">
          <CardHeader>
            <CardTitle className="ff-text-title flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[var(--ff-accent)]" />
              User Consent Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  {consentManagement.totalUsers.toLocaleString()}
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Total Users</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="ff-text-2xl text-[var(--ff-success)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  {consentManagement.consentedUsers.toLocaleString()}
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Consented Users</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="ff-text-2xl text-[var(--ff-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  {consentManagement.consentRate}%
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Consent Rate</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="ff-text-2xl text-[var(--ff-secondary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  {consentManagement.consentTypes.length}
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Consent Types</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                Consent Breakdown by Type
              </h4>
              {consentManagement.consentTypes.map((type, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[var(--ff-surface-light)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${type.required ? 'bg-[var(--ff-error)]' : 'bg-[var(--ff-success)]'}`}></div>
                    <span className="ff-text-sm text-[var(--ff-text-primary)]">{type.type}</span>
                    {type.required && <Badge className="ff-badge-error text-xs">Required</Badge>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="ff-text-sm text-[var(--ff-text-secondary)]">
                      {type.consented.toLocaleString()} ({type.rate}%)
                    </span>
                    <div className="w-20">
                      <Progress value={type.rate} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Retention & Incident Response */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="ff-card">
            <CardHeader>
              <CardTitle className="ff-text-title flex items-center gap-2">
                <Archive className="w-5 h-5 text-[var(--ff-warning)]" />
                Audit Log Retention
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-[var(--ff-surface)] rounded-lg">
                  <div className="ff-text-xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                    {auditLogRetention.totalLogs.toLocaleString()}
                  </div>
                  <div className="ff-text-xs text-[var(--ff-text-muted)]">Total Logs</div>
                </div>
                
                <div className="text-center p-3 bg-[var(--ff-surface)] rounded-lg">
                  <div className="ff-text-xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                    {auditLogRetention.storageUsed}
                  </div>
                  <div className="ff-text-xs text-[var(--ff-text-muted)]">Storage Used</div>
                </div>
              </div>
              
              <div className="space-y-2">
                {auditLogRetention.categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-[var(--ff-surface-light)] rounded">
                    <span className="ff-text-sm text-[var(--ff-text-primary)]">{category.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="ff-text-xs text-[var(--ff-text-muted)]">{category.retention}</span>
                      <CheckCircle className="w-4 h-4 text-[var(--ff-success)]" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="ff-card">
            <CardHeader>
              <CardTitle className="ff-text-title flex items-center gap-2">
                <Bell className="w-5 h-5 text-[var(--ff-error)]" />
                Incident Response
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-[var(--ff-surface)] rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-[var(--ff-success)] rounded-full"></div>
                    <span className="ff-text-sm text-[var(--ff-success)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                      {incidentResponse.currentThreatLevel.toUpperCase()}
                    </span>
                  </div>
                  <div className="ff-text-xs text-[var(--ff-text-muted)]">Threat Level</div>
                </div>
                
                <div className="text-center p-3 bg-[var(--ff-surface)] rounded-lg">
                  <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                    {incidentResponse.averageResponseTime}
                  </div>
                  <div className="ff-text-xs text-[var(--ff-text-muted)]">Avg Response</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h5 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                  Recent Incidents
                </h5>
                {incidentResponse.recentIncidents.slice(0, 3).map((incident, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-[var(--ff-surface-light)] rounded">
                    <div>
                      <div className="ff-text-xs text-[var(--ff-text-primary)]">{incident.type}</div>
                      <div className="ff-text-xs text-[var(--ff-text-muted)]">{incident.id}</div>
                    </div>
                    <div className="text-right">
                      <Badge className={`ff-badge-${incident.severity === 'high' ? 'error' : incident.severity === 'medium' ? 'warning' : 'secondary'} text-xs`}>
                        {incident.severity}
                      </Badge>
                      <div className="ff-text-xs text-[var(--ff-text-muted)] mt-1">{incident.responseTime}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default SecurityComplianceDashboard;
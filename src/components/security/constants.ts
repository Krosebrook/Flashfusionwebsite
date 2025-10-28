import { SecurityMetric, SecurityThreat, ComplianceFramework, AccessToken } from './types';

export const SECURITY_METRICS: SecurityMetric[] = [
  {
    id: 'auth-mfa',
    name: 'Multi-Factor Authentication',
    category: 'authentication',
    score: 95,
    status: 'secure',
    lastChecked: new Date(Date.now() - 30 * 60 * 1000),
    details: 'MFA enabled for 95% of user accounts',
    recommendations: ['Enable MFA for remaining 5% of accounts', 'Consider hardware security keys'],
    trend: 'up'
  },
  {
    id: 'data-encryption',
    name: 'Data Encryption',
    category: 'data-protection',
    score: 88,
    status: 'secure',
    lastChecked: new Date(Date.now() - 60 * 60 * 1000),
    details: 'All data encrypted at rest and in transit',
    recommendations: ['Update encryption algorithms to latest standards'],
    trend: 'stable'
  },
  {
    id: 'network-security',
    name: 'Network Security',
    category: 'network',
    score: 72,
    status: 'warning',
    lastChecked: new Date(Date.now() - 2 * 60 * 60 * 1000),
    details: 'Some network endpoints not using latest TLS version',
    recommendations: ['Upgrade to TLS 1.3', 'Implement WAF rules', 'Review firewall configurations'],
    trend: 'down'
  },
  {
    id: 'access-control',
    name: 'Access Control',
    category: 'authentication',
    score: 91,
    status: 'secure',
    lastChecked: new Date(Date.now() - 45 * 60 * 1000),
    details: 'RBAC implemented with regular access reviews',
    recommendations: ['Implement zero-trust architecture'],
    trend: 'up'
  },
  {
    id: 'vulnerability-scanning',
    name: 'Vulnerability Management',
    category: 'monitoring',
    score: 84,
    status: 'secure',
    lastChecked: new Date(Date.now() - 3 * 60 * 60 * 1000),
    details: 'Regular security scans with automated patching',
    recommendations: ['Increase scan frequency for critical systems'],
    trend: 'stable'
  },
  {
    id: 'incident-response',
    name: 'Incident Response',
    category: 'monitoring',
    score: 78,
    status: 'warning',
    lastChecked: new Date(Date.now() - 4 * 60 * 60 * 1000),
    details: 'Response procedures defined but need testing',
    recommendations: ['Conduct quarterly incident response drills', 'Update response playbooks'],
    trend: 'stable'
  }
];

export const SECURITY_THREATS: SecurityThreat[] = [
  {
    id: 'threat-1',
    type: 'intrusion-attempt',
    severity: 'high',
    title: 'Suspicious Login Attempts',
    description: 'Multiple failed login attempts from unusual geographic locations detected',
    source: '192.168.1.45',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    status: 'investigating',
    affectedAssets: ['User Authentication System', 'Admin Portal'],
    responseTime: 8
  },
  {
    id: 'threat-2',
    type: 'malware',
    severity: 'medium',
    title: 'Potential Malware in Email Attachment',
    description: 'Email security system flagged suspicious attachment in user mailbox',
    source: 'Email Gateway',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    status: 'mitigated',
    affectedAssets: ['Email System'],
    responseTime: 12
  },
  {
    id: 'threat-3',
    type: 'phishing',
    severity: 'low',
    title: 'Phishing Email Detected',
    description: 'Automated system detected and quarantined phishing email',
    source: 'Email Security Scanner',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'resolved',
    affectedAssets: ['Email System'],
    responseTime: 3
  },
  {
    id: 'threat-4',
    type: 'ddos',
    severity: 'critical',
    title: 'DDoS Attack Detected',
    description: 'Unusual traffic patterns suggesting distributed denial of service attack',
    source: 'Network Monitoring',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: 'resolved',
    affectedAssets: ['Web Infrastructure', 'API Gateway'],
    responseTime: 25
  }
];

export const COMPLIANCE_FRAMEWORKS: ComplianceFramework[] = [
  {
    id: 'soc2',
    name: 'SOC 2 Type II',
    description: 'Security, Availability, and Confidentiality controls',
    overallCompliance: 94,
    certification: {
      status: 'certified',
      validUntil: new Date('2024-12-31'),
      certifier: 'Independent Auditor LLC'
    },
    requirements: [
      {
        id: 'cc6.1',
        title: 'Logical and Physical Access Controls',
        status: 'compliant',
        lastAudit: new Date('2024-01-15'),
        evidence: ['Access logs', 'Badge records', 'VPN logs']
      },
      {
        id: 'cc6.2',
        title: 'System Access Controls',
        status: 'compliant',
        lastAudit: new Date('2024-01-15'),
        evidence: ['RBAC documentation', 'User access reviews']
      },
      {
        id: 'cc6.3',
        title: 'Data Classification',
        status: 'partial',
        lastAudit: new Date('2024-01-15'),
        evidence: ['Data inventory', 'Classification schema']
      }
    ]
  },
  {
    id: 'gdpr',
    name: 'GDPR Compliance',
    description: 'General Data Protection Regulation requirements',
    overallCompliance: 89,
    requirements: [
      {
        id: 'art32',
        title: 'Security of Processing',
        status: 'compliant',
        lastAudit: new Date('2024-02-01'),
        evidence: ['Encryption policies', 'Security controls documentation']
      },
      {
        id: 'art33',
        title: 'Breach Notification',
        status: 'compliant',
        lastAudit: new Date('2024-02-01'),
        evidence: ['Incident response procedures', 'Notification templates']
      },
      {
        id: 'art35',
        title: 'Data Protection Impact Assessment',
        status: 'partial',
        lastAudit: new Date('2024-02-01'),
        evidence: ['DPIA templates', 'Risk assessments']
      }
    ]
  },
  {
    id: 'iso27001',
    name: 'ISO 27001',
    description: 'Information Security Management System',
    overallCompliance: 76,
    certification: {
      status: 'pending',
      certifier: 'ISO Certification Body'
    },
    requirements: [
      {
        id: 'a5.1',
        title: 'Information Security Policies',
        status: 'compliant',
        lastAudit: new Date('2024-01-30'),
        evidence: ['Security policies', 'Management approval records']
      },
      {
        id: 'a8.1',
        title: 'Asset Management',
        status: 'partial',
        lastAudit: new Date('2024-01-30'),
        evidence: ['Asset inventory', 'Ownership documentation']
      },
      {
        id: 'a12.1',
        title: 'Operational Security',
        status: 'non-compliant',
        lastAudit: new Date('2024-01-30'),
        evidence: []
      }
    ]
  }
];

export const ACCESS_TOKENS: AccessToken[] = [
  {
    id: 'token-1',
    name: 'Production API Key',
    type: 'api-key',
    scope: ['read', 'write', 'admin'],
    createdAt: new Date('2024-01-01'),
    lastUsed: new Date(Date.now() - 30 * 60 * 1000),
    expiresAt: new Date('2024-12-31'),
    status: 'active',
    permissions: ['user.read', 'user.write', 'admin.all'],
    riskLevel: 'high',
    usageCount: 15420
  },
  {
    id: 'token-2',
    name: 'Analytics Service Token',
    type: 'service-account',
    scope: ['read'],
    createdAt: new Date('2024-02-15'),
    lastUsed: new Date(Date.now() - 5 * 60 * 1000),
    expiresAt: new Date('2025-02-15'),
    status: 'active',
    permissions: ['analytics.read', 'metrics.read'],
    riskLevel: 'low',
    usageCount: 8934
  },
  {
    id: 'token-3',
    name: 'Legacy Integration Key',
    type: 'api-key',
    scope: ['read'],
    createdAt: new Date('2023-06-01'),
    lastUsed: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    expiresAt: new Date('2024-06-01'),
    status: 'expired',
    permissions: ['legacy.read'],
    riskLevel: 'medium',
    usageCount: 234
  },
  {
    id: 'token-4',
    name: 'Mobile App Token',
    type: 'oauth-token',
    scope: ['read', 'write'],
    createdAt: new Date('2024-03-01'),
    lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'active',
    permissions: ['app.read', 'app.write', 'profile.read'],
    riskLevel: 'medium',
    usageCount: 2156
  }
];

export const SECURITY_CATEGORIES = {
  authentication: { name: 'Authentication', color: '#10B981', icon: 'UserCheck' },
  'data-protection': { name: 'Data Protection', color: '#3B82F6', icon: 'Shield' },
  network: { name: 'Network Security', color: '#F59E0B', icon: 'Wifi' },
  compliance: { name: 'Compliance', color: '#8B5CF6', icon: 'FileText' },
  monitoring: { name: 'Monitoring', color: '#EF4444', icon: 'Activity' }
};

export const THREAT_TYPES = {
  'intrusion-attempt': { name: 'Intrusion Attempt', color: '#EF4444' },
  'data-breach': { name: 'Data Breach', color: '#DC2626' },
  malware: { name: 'Malware', color: '#B91C1C' },
  phishing: { name: 'Phishing', color: '#F59E0B' },
  ddos: { name: 'DDoS Attack', color: '#7C2D12' },
  'insider-threat': { name: 'Insider Threat', color: '#8B5CF6' }
};

export const SEVERITY_COLORS = {
  low: '#10B981',
  medium: '#F59E0B', 
  high: '#EF4444',
  critical: '#DC2626'
};

export const STATUS_COLORS = {
  secure: '#10B981',
  warning: '#F59E0B',
  critical: '#EF4444',
  unknown: '#6B7280'
};
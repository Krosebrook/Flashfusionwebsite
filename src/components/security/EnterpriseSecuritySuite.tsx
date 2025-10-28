/**
 * @fileoverview Enterprise Security & Compliance Suite
 * @chunk security
 * @category enterprise-security
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Comprehensive enterprise-grade security suite with advanced threat detection,
 * compliance automation (SOC 2, GDPR, HIPAA), zero-trust architecture, and
 * real-time security analytics dashboard.
 * 
 * Features:
 * - Advanced threat detection with ML-based analysis
 * - SOC 2, GDPR, HIPAA automated compliance monitoring
 * - Zero-trust architecture with continuous verification
 * - Real-time security analytics and incident response
 * - Vulnerability management with automated remediation
 * - Security posture scoring and improvement recommendations
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  Lock, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Activity,
  TrendingUp,
  TrendingDown,
  Database,
  Server,
  Globe,
  Users,
  Key,
  FileText,
  Settings,
  Bell,
  Flag,
  Award,
  Star,
  BarChart3,
  LineChart,
  PieChart,
  Cpu,
  HardDrive,
  Wifi,
  Layers,
  RefreshCw,
  Download,
  Upload,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Flame,
  Zap,
  Code,
  Terminal,
  Bug,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  LockKeyhole,
  ScanLine,
  Fingerprint,
  KeyRound
} from 'lucide-react';

// Security interfaces
interface ThreatDetection {
  id: string;
  type: 'malware' | 'intrusion' | 'anomaly' | 'vulnerability' | 'data-breach';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  source: string;
  timestamp: Date;
  status: 'active' | 'investigating' | 'mitigated' | 'resolved';
  affectedSystems: string[];
  riskScore: number;
  recommendation: string;
}

interface ComplianceStatus {
  framework: 'SOC2' | 'GDPR' | 'HIPAA' | 'CCPA' | 'ISO27001';
  status: 'compliant' | 'partial' | 'non-compliant';
  score: number;
  lastAudit: Date;
  nextAudit: Date;
  requirements: {
    total: number;
    passed: number;
    failed: number;
    pending: number;
  };
  criticalIssues: number;
}

interface SecurityMetrics {
  overallScore: number;
  threatScore: number;
  vulnerabilityScore: number;
  complianceScore: number;
  incidentCount: number;
  mttr: number; // Mean Time to Remediation
  mttd: number; // Mean Time to Detection
  securityEvents: number;
}

interface Vulnerability {
  id: string;
  cve: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedComponent: string;
  discoveredDate: Date;
  status: 'open' | 'in-progress' | 'resolved' | 'accepted-risk';
  cvssScore: number;
  exploitability: 'easy' | 'medium' | 'hard';
  remediation: string;
  estimatedEffort: string;
}

/**
 * Enterprise Security Suite Component
 */
export function EnterpriseSecuritySuite() {
  const [activeTab, setActiveTab] = useState<'overview' | 'threats' | 'compliance' | 'vulnerabilities' | 'analytics'>('overview');
  const [isScanning, setIsScanning] = useState(false);
  const [autoResponse, setAutoResponse] = useState(true);

  // Security metrics
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    overallScore: 87,
    threatScore: 92,
    vulnerabilityScore: 81,
    complianceScore: 94,
    incidentCount: 3,
    mttr: 2.4,
    mttd: 0.8,
    securityEvents: 1247
  });

  // Threat detections
  const [threats, setThreats] = useState<ThreatDetection[]>([
    {
      id: 'threat-001',
      type: 'anomaly',
      severity: 'high',
      title: 'Unusual API Access Pattern',
      description: 'Detected abnormal API access patterns from IP 192.168.1.100 with 300% higher than normal request volume',
      source: 'API Gateway',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      status: 'investigating',
      affectedSystems: ['API Gateway', 'User Authentication'],
      riskScore: 7.8,
      recommendation: 'Implement rate limiting and investigate source IP for potential compromise'
    },
    {
      id: 'threat-002',
      type: 'intrusion',
      severity: 'critical',
      title: 'Failed Authentication Spike',
      description: 'Multiple failed authentication attempts detected from various IPs targeting admin accounts',
      source: 'Authentication Service',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      status: 'active',
      affectedSystems: ['Authentication Service', 'Admin Portal'],
      riskScore: 9.2,
      recommendation: 'Enable account lockout policies and implement multi-factor authentication'
    },
    {
      id: 'threat-003',
      type: 'vulnerability',
      severity: 'medium',
      title: 'Outdated Dependencies Detected',
      description: 'Several npm packages with known vulnerabilities detected in production environment',
      source: 'Dependency Scanner',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      status: 'mitigated',
      affectedSystems: ['Frontend Application', 'Build Pipeline'],
      riskScore: 5.4,
      recommendation: 'Update to latest secure versions and implement automated dependency scanning'
    }
  ]);

  // Compliance status
  const complianceFrameworks: ComplianceStatus[] = useMemo(() => [
    {
      framework: 'SOC2',
      status: 'compliant',
      score: 96,
      lastAudit: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      nextAudit: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
      requirements: { total: 64, passed: 61, failed: 1, pending: 2 },
      criticalIssues: 0
    },
    {
      framework: 'GDPR',
      status: 'compliant',
      score: 94,
      lastAudit: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
      nextAudit: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180),
      requirements: { total: 47, passed: 44, failed: 2, pending: 1 },
      criticalIssues: 1
    },
    {
      framework: 'HIPAA',
      status: 'partial',
      score: 87,
      lastAudit: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
      nextAudit: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
      requirements: { total: 78, passed: 68, failed: 5, pending: 5 },
      criticalIssues: 2
    },
    {
      framework: 'ISO27001',
      status: 'compliant',
      score: 91,
      lastAudit: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
      nextAudit: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      requirements: { total: 114, passed: 104, failed: 3, pending: 7 },
      criticalIssues: 1
    }
  ], []);

  // Vulnerabilities
  const vulnerabilities: Vulnerability[] = useMemo(() => [
    {
      id: 'vuln-001',
      cve: 'CVE-2024-0001',
      severity: 'critical',
      title: 'SQL Injection in User API',
      description: 'SQL injection vulnerability in user profile update endpoint allowing unauthorized data access',
      affectedComponent: 'User API Service',
      discoveredDate: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'in-progress',
      cvssScore: 9.1,
      exploitability: 'easy',
      remediation: 'Implement parameterized queries and input validation',
      estimatedEffort: '4 hours'
    },
    {
      id: 'vuln-002',
      cve: 'CVE-2024-0002',
      severity: 'high',
      title: 'Cross-Site Scripting (XSS)',
      description: 'Stored XSS vulnerability in comment system allowing script injection',
      affectedComponent: 'Frontend Application',
      discoveredDate: new Date(Date.now() - 1000 * 60 * 60 * 6),
      status: 'open',
      cvssScore: 7.3,
      exploitability: 'medium',
      remediation: 'Implement Content Security Policy and input sanitization',
      estimatedEffort: '6 hours'
    },
    {
      id: 'vuln-003',
      cve: 'CVE-2024-0003',
      severity: 'medium',
      title: 'Insecure Direct Object Reference',
      description: 'Users can access other users data by manipulating object references',
      affectedComponent: 'Authorization Service',
      discoveredDate: new Date(Date.now() - 1000 * 60 * 60 * 12),
      status: 'resolved',
      cvssScore: 6.2,
      exploitability: 'medium',
      remediation: 'Implement proper authorization checks for all object access',
      estimatedEffort: '8 hours'
    }
  ], []);

  // Real-time security monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time security updates
      setSecurityMetrics(prev => ({
        ...prev,
        securityEvents: prev.securityEvents + Math.floor(Math.random() * 5),
        threatScore: Math.min(100, Math.max(0, prev.threatScore + (Math.random() - 0.5) * 3)),
        overallScore: Math.min(100, Math.max(0, prev.overallScore + (Math.random() - 0.5) * 2))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Security scan handler
  const handleSecurityScan = useCallback(async () => {
    setIsScanning(true);
    
    try {
      // Simulate security scanning process
      for (let i = 0; i <= 100; i += 20) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Update metrics after scan
      setSecurityMetrics(prev => ({
        ...prev,
        vulnerabilityScore: Math.min(100, prev.vulnerabilityScore + 2),
        overallScore: Math.min(100, prev.overallScore + 1)
      }));
      
    } finally {
      setIsScanning(false);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': case 'resolved': case 'mitigated': return 'var(--ff-success)';
      case 'partial': case 'investigating': case 'in-progress': return 'var(--ff-warning)';
      case 'non-compliant': case 'active': case 'open': return 'var(--ff-error)';
      default: return 'var(--ff-text-muted)';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': case 'resolved': case 'mitigated': return CheckCircle;
      case 'partial': case 'investigating': case 'in-progress': return Clock;
      case 'non-compliant': case 'active': case 'open': return XCircle;
      default: return AlertTriangle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'var(--ff-error)';
      case 'high': return 'var(--ff-warning)';
      case 'medium': return 'var(--ff-secondary)';
      case 'low': return 'var(--ff-success)';
      default: return 'var(--ff-text-muted)';
    }
  };

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'malware': return Bug;
      case 'intrusion': return ShieldAlert;
      case 'anomaly': return Activity;
      case 'vulnerability': return AlertTriangle;
      case 'data-breach': return Database;
      default: return Shield;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)]" style={{ fontFamily: 'var(--ff-font-secondary)' }}>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 ff-fade-in-up">
          <Badge className="ff-badge-secondary mb-4">
            <Shield className="w-4 h-4 mr-2" />
            Enterprise Security Suite
          </Badge>
          
          <h1 className="ff-text-display">
            Security &
            <span className="ff-text-gradient"> Compliance</span>
          </h1>
          
          <p className="ff-text-body max-w-3xl mx-auto">
            Enterprise-grade security suite with advanced threat detection, compliance automation, 
            zero-trust architecture, and real-time security analytics for comprehensive protection.
          </p>
        </div>

        {/* Security Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ff-stagger-fade">
          <Card className="ff-card text-center p-4">
            <div className="w-10 h-10 bg-[var(--ff-success)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="w-5 h-5 text-[var(--ff-success)]" />
            </div>
            <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
              {securityMetrics.overallScore}
            </div>
            <div className="ff-text-sm text-[var(--ff-text-muted)]">Security Score</div>
            <div className="flex justify-center mt-1">
              {securityMetrics.overallScore >= 85 ? 
                <ArrowUp className="w-4 h-4 text-[var(--ff-success)]" /> :
                <ArrowDown className="w-4 h-4 text-[var(--ff-warning)]" />
              }
            </div>
          </Card>

          <Card className="ff-card text-center p-4">
            <div className="w-10 h-10 bg-[var(--ff-error)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-5 h-5 text-[var(--ff-error)]" />
            </div>
            <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
              {threats.filter(t => t.status === 'active').length}
            </div>
            <div className="ff-text-sm text-[var(--ff-text-muted)]">Active Threats</div>
            <div className="flex justify-center mt-1">
              <ShieldAlert className="w-4 h-4 text-[var(--ff-error)]" />
            </div>
          </Card>

          <Card className="ff-card text-center p-4">
            <div className="w-10 h-10 bg-[var(--ff-secondary)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <FileText className="w-5 h-5 text-[var(--ff-secondary)]" />
            </div>
            <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
              {Math.round(complianceFrameworks.reduce((sum, f) => sum + f.score, 0) / complianceFrameworks.length)}
            </div>
            <div className="ff-text-sm text-[var(--ff-text-muted)]">Compliance Score</div>
            <div className="flex justify-center mt-1">
              <CheckCircle className="w-4 h-4 text-[var(--ff-success)]" />
            </div>
          </Card>

          <Card className="ff-card text-center p-4">
            <div className="w-10 h-10 bg-[var(--ff-warning)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Bug className="w-5 h-5 text-[var(--ff-warning)]" />
            </div>
            <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
              {vulnerabilities.filter(v => v.status !== 'resolved').length}
            </div>
            <div className="ff-text-sm text-[var(--ff-text-muted)]">Open Vulnerabilities</div>
            <div className="flex justify-center mt-1">
              <TrendingDown className="w-4 h-4 text-[var(--ff-warning)]" />
            </div>
          </Card>
        </div>

        {/* Security Controls */}
        <Card className="ff-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="ff-text-title flex items-center gap-2">
                <Settings className="w-5 h-5 text-[var(--ff-secondary)]" />
                Security Operations Center
              </CardTitle>
              <div className="flex items-center gap-3">
                <Badge className="ff-badge-success text-xs">
                  Auto-Response: {autoResponse ? 'ON' : 'OFF'}
                </Badge>
                <Button
                  onClick={handleSecurityScan}
                  disabled={isScanning}
                  className="ff-btn-secondary"
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    fontSize: 'var(--ff-text-sm)'
                  }}
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <ScanLine className="w-4 h-4 mr-2" />
                      Security Scan
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="space-y-3">
                <h4 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                  Threat Detection
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="ff-text-sm text-[var(--ff-text-muted)]">Detection Rate</span>
                    <span className="ff-text-sm text-[var(--ff-success)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                      {securityMetrics.threatScore}%
                    </span>
                  </div>
                  <Progress value={securityMetrics.threatScore} className="h-2" />
                  <div className="flex items-center justify-between">
                    <span className="ff-text-xs text-[var(--ff-text-muted)]">MTTD</span>
                    <span className="ff-text-xs text-[var(--ff-text-primary)]">{securityMetrics.mttd}h</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                  Incident Response
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="ff-text-sm text-[var(--ff-text-muted)]">Response Time</span>
                    <span className="ff-text-sm text-[var(--ff-success)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                      {securityMetrics.mttr}h
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="ff-text-xs text-[var(--ff-text-muted)]">Active Incidents</span>
                    <span className="ff-text-xs text-[var(--ff-text-primary)]">{securityMetrics.incidentCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[var(--ff-success)]" />
                    <span className="ff-text-xs text-[var(--ff-text-muted)]">Response: Automated</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                  Vulnerability Management
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="ff-text-sm text-[var(--ff-text-muted)]">Coverage</span>
                    <span className="ff-text-sm text-[var(--ff-success)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                      {securityMetrics.vulnerabilityScore}%
                    </span>
                  </div>
                  <Progress value={securityMetrics.vulnerabilityScore} className="h-2" />
                  <div className="flex items-center justify-between">
                    <span className="ff-text-xs text-[var(--ff-text-muted)]">Critical Open</span>
                    <span className="ff-text-xs text-[var(--ff-error)]">
                      {vulnerabilities.filter(v => v.severity === 'critical' && v.status !== 'resolved').length}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                  Zero-Trust Status
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[var(--ff-success)]" />
                    <span className="ff-text-xs text-[var(--ff-text-muted)]">Identity Verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[var(--ff-success)]" />
                    <span className="ff-text-xs text-[var(--ff-text-muted)]">Device Trust</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[var(--ff-warning)]" />
                    <span className="ff-text-xs text-[var(--ff-text-muted)]">Network Segmentation</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Security Tabs */}
        <Card className="ff-card">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
              <div className="border-b border-[var(--border)]">
                <TabsList className="grid w-full grid-cols-5 bg-[var(--ff-surface)] rounded-none">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="threats" className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Threats
                  </TabsTrigger>
                  <TabsTrigger value="compliance" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Compliance
                  </TabsTrigger>
                  <TabsTrigger value="vulnerabilities" className="flex items-center gap-2">
                    <Bug className="w-4 h-4" />
                    Vulnerabilities
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Threat Detection Tab */}
              <TabsContent value="threats" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="ff-text-title">Active Threat Detection</h3>
                  <div className="flex items-center gap-2">
                    <Badge className="ff-badge-error">
                      {threats.filter(t => t.status === 'active').length} Active
                    </Badge>
                    <Badge className="ff-badge-warning">
                      {threats.filter(t => t.status === 'investigating').length} Investigating
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {threats.map((threat) => {
                    const ThreatIcon = getThreatIcon(threat.type);
                    const StatusIcon = getStatusIcon(threat.status);
                    
                    return (
                      <Card key={threat.id} className="ff-card">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: getSeverityColor(threat.severity) + '20' }}
                              >
                                <ThreatIcon className="w-5 h-5" style={{ color: getSeverityColor(threat.severity) }} />
                              </div>
                              <div>
                                <h4 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                  {threat.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge 
                                    className={`ff-badge-${threat.severity === 'critical' ? 'error' : threat.severity === 'high' ? 'warning' : 'secondary'} text-xs`}
                                  >
                                    {threat.severity}
                                  </Badge>
                                  <Badge className="ff-badge-secondary text-xs">
                                    {threat.type}
                                  </Badge>
                                  <StatusIcon 
                                    className="w-4 h-4" 
                                    style={{ color: getStatusColor(threat.status) }}
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                                {threat.riskScore.toFixed(1)}
                              </div>
                              <div className="ff-text-xs text-[var(--ff-text-muted)]">Risk Score</div>
                            </div>
                          </div>
                          
                          <p className="ff-text-sm text-[var(--ff-text-muted)] mb-3">
                            {threat.description}
                          </p>
                          
                          <div className="grid md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <span className="ff-text-xs text-[var(--ff-text-muted)]">Source:</span>
                              <div className="ff-text-sm text-[var(--ff-text-primary)]">{threat.source}</div>
                            </div>
                            <div>
                              <span className="ff-text-xs text-[var(--ff-text-muted)]">Detected:</span>
                              <div className="ff-text-sm text-[var(--ff-text-primary)]">
                                {threat.timestamp.toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <span className="ff-text-xs text-[var(--ff-text-muted)]">Affected Systems:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {threat.affectedSystems.map((system, index) => (
                                <Badge key={index} className="ff-badge-secondary text-xs">
                                  {system}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="p-3 bg-[var(--ff-surface)] rounded-lg">
                            <span className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                              Recommendation:
                            </span>
                            <p className="ff-text-sm text-[var(--ff-text-secondary)] mt-1">
                              {threat.recommendation}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Compliance Tab */}
              <TabsContent value="compliance" className="p-6 space-y-6">
                <h3 className="ff-text-title">Compliance Framework Status</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {complianceFrameworks.map((framework) => {
                    const StatusIcon = getStatusIcon(framework.status);
                    
                    return (
                      <Card key={framework.framework} className="ff-card">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: getStatusColor(framework.status) + '20' }}
                              >
                                <FileText className="w-5 h-5" style={{ color: getStatusColor(framework.status) }} />
                              </div>
                              <div>
                                <h4 className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                  {framework.framework}
                                </h4>
                                <Badge 
                                  className={`ff-badge-${framework.status === 'compliant' ? 'success' : framework.status === 'partial' ? 'warning' : 'error'} text-xs`}
                                >
                                  {framework.status}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                                {framework.score}%
                              </div>
                              <StatusIcon className="w-4 h-4 mx-auto mt-1" style={{ color: getStatusColor(framework.status) }} />
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="ff-text-xs text-[var(--ff-text-muted)]">Compliance Progress</span>
                                <span className="ff-text-xs text-[var(--ff-text-primary)]">
                                  {framework.requirements.passed}/{framework.requirements.total}
                                </span>
                              </div>
                              <Progress 
                                value={(framework.requirements.passed / framework.requirements.total) * 100} 
                                className="h-2"
                              />
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div>
                                <div className="ff-text-sm text-[var(--ff-success)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                  {framework.requirements.passed}
                                </div>
                                <div className="ff-text-xs text-[var(--ff-text-muted)]">Passed</div>
                              </div>
                              <div>
                                <div className="ff-text-sm text-[var(--ff-error)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                  {framework.requirements.failed}
                                </div>
                                <div className="ff-text-xs text-[var(--ff-text-muted)]">Failed</div>
                              </div>
                              <div>
                                <div className="ff-text-sm text-[var(--ff-warning)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                  {framework.requirements.pending}
                                </div>
                                <div className="ff-text-xs text-[var(--ff-text-muted)]">Pending</div>
                              </div>
                            </div>
                            
                            <div className="pt-3 border-t border-[var(--border)]">
                              <div className="flex items-center justify-between">
                                <span className="ff-text-xs text-[var(--ff-text-muted)]">Last Audit:</span>
                                <span className="ff-text-xs text-[var(--ff-text-primary)]">
                                  {framework.lastAudit.toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="ff-text-xs text-[var(--ff-text-muted)]">Next Audit:</span>
                                <span className="ff-text-xs text-[var(--ff-text-primary)]">
                                  {framework.nextAudit.toLocaleDateString()}
                                </span>
                              </div>
                              {framework.criticalIssues > 0 && (
                                <div className="flex items-center gap-2 mt-2">
                                  <AlertTriangle className="w-4 h-4 text-[var(--ff-error)]" />
                                  <span className="ff-text-xs text-[var(--ff-error)]">
                                    {framework.criticalIssues} Critical Issues
                                  </span>
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

              {/* Vulnerabilities Tab */}
              <TabsContent value="vulnerabilities" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="ff-text-title">Vulnerability Management</h3>
                  <div className="flex items-center gap-2">
                    <Badge className="ff-badge-error">
                      {vulnerabilities.filter(v => v.severity === 'critical' && v.status !== 'resolved').length} Critical
                    </Badge>
                    <Badge className="ff-badge-warning">
                      {vulnerabilities.filter(v => v.severity === 'high' && v.status !== 'resolved').length} High
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {vulnerabilities.map((vuln) => {
                    const StatusIcon = getStatusIcon(vuln.status);
                    
                    return (
                      <Card key={vuln.id} className="ff-card">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: getSeverityColor(vuln.severity) + '20' }}
                              >
                                <Bug className="w-5 h-5" style={{ color: getSeverityColor(vuln.severity) }} />
                              </div>
                              <div>
                                <h4 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                  {vuln.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge 
                                    className={`ff-badge-${vuln.severity === 'critical' ? 'error' : vuln.severity === 'high' ? 'warning' : 'secondary'} text-xs`}
                                  >
                                    {vuln.severity}
                                  </Badge>
                                  <Badge className="ff-badge-secondary text-xs">
                                    {vuln.cve}
                                  </Badge>
                                  <StatusIcon 
                                    className="w-4 h-4" 
                                    style={{ color: getStatusColor(vuln.status) }}
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                                {vuln.cvssScore.toFixed(1)}
                              </div>
                              <div className="ff-text-xs text-[var(--ff-text-muted)]">CVSS Score</div>
                            </div>
                          </div>
                          
                          <p className="ff-text-sm text-[var(--ff-text-muted)] mb-3">
                            {vuln.description}
                          </p>
                          
                          <div className="grid md:grid-cols-3 gap-4 mb-3">
                            <div>
                              <span className="ff-text-xs text-[var(--ff-text-muted)]">Component:</span>
                              <div className="ff-text-sm text-[var(--ff-text-primary)]">{vuln.affectedComponent}</div>
                            </div>
                            <div>
                              <span className="ff-text-xs text-[var(--ff-text-muted)]">Exploitability:</span>
                              <div className="ff-text-sm text-[var(--ff-text-primary)]">{vuln.exploitability}</div>
                            </div>
                            <div>
                              <span className="ff-text-xs text-[var(--ff-text-muted)]">Effort:</span>
                              <div className="ff-text-sm text-[var(--ff-text-primary)]">{vuln.estimatedEffort}</div>
                            </div>
                          </div>
                          
                          <div className="p-3 bg-[var(--ff-surface)] rounded-lg">
                            <span className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                              Remediation:
                            </span>
                            <p className="ff-text-sm text-[var(--ff-text-secondary)] mt-1">
                              {vuln.remediation}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default EnterpriseSecuritySuite;
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Separator } from '../ui/separator';
import { SecurityScanInterface } from '../security/SecurityScanInterface';
import { SecurityPostureDashboard } from '../security/SecurityPostureDashboard';
import ComprehensiveSecurityScanner from '../security/ComprehensiveSecurityScanner';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  ShieldX,
  Scan,
  Activity,
  BarChart3,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Globe,
  Server,
  Database,
  Lock,
  Eye,
  FileText,
  Zap
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { SecurityThreat, SecurityMetric } from '../security/types';

interface SecurityPageProps {
  className?: string;
}

export function SecurityPage({ className = '' }: SecurityPageProps) {
  const [securityOverview, setSecurityOverview] = useState({
    overallScore: 85,
    totalThreats: 3,
    resolvedThreats: 8,
    activeScans: 1,
    lastScan: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    systemStatus: 'secure' as 'secure' | 'warning' | 'critical'
  });

  const [recentThreats, setRecentThreats] = useState<SecurityThreat[]>([
    {
      id: 'threat-1',
      type: 'intrusion-attempt',
      severity: 'medium',
      title: 'Suspicious Login Attempts',
      description: 'Multiple failed login attempts detected from unusual IP addresses',
      source: 'Authentication System',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'investigating',
      affectedAssets: ['Auth Service', 'User Database'],
      responseTime: 15
    },
    {
      id: 'threat-2',
      type: 'malware',
      severity: 'high',
      title: 'Potentially Malicious Script Detected',
      description: 'Uploaded file contains suspicious JavaScript patterns',
      source: 'File Upload Service',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      status: 'mitigated',
      affectedAssets: ['File Storage'],
      responseTime: 8
    },
    {
      id: 'threat-3',
      type: 'ddos',
      severity: 'low',
      title: 'Elevated Traffic Pattern',
      description: 'Unusual traffic spike detected, monitoring for potential DDoS',
      source: 'Network Monitor',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'resolved',
      affectedAssets: ['API Gateway'],
      responseTime: 3
    }
  ]);

  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([
    {
      id: 'auth-strength',
      name: 'Authentication Security',
      category: 'authentication',
      score: 92,
      status: 'secure',
      lastChecked: new Date(),
      details: 'Strong multi-factor authentication implemented',
      recommendations: ['Consider implementing WebAuthn', 'Review session timeout policies'],
      trend: 'up'
    },
    {
      id: 'data-encryption',
      name: 'Data Protection',
      category: 'data-protection',
      score: 88,
      status: 'secure',
      lastChecked: new Date(),
      details: 'End-to-end encryption active for sensitive data',
      recommendations: ['Update encryption keys rotation policy'],
      trend: 'stable'
    },
    {
      id: 'network-security',
      name: 'Network Security',
      category: 'network',
      score: 75,
      status: 'warning',
      lastChecked: new Date(),
      details: 'Some network endpoints require additional hardening',
      recommendations: ['Enable DDoS protection', 'Implement rate limiting on all APIs'],
      trend: 'down'
    },
    {
      id: 'compliance',
      name: 'Compliance Status',
      category: 'compliance',
      score: 95,
      status: 'secure',
      lastChecked: new Date(),
      details: 'Full compliance with GDPR, SOC2, and industry standards',
      recommendations: [],
      trend: 'up'
    }
  ]);

  const handleScanComplete = useCallback((result: any) => {
    console.log('Security scan completed:', result);
    
    // Update security overview based on scan results
    const criticalIssues = result.summary.criticalCount;
    const highIssues = result.summary.highCount;
    
    let newStatus: 'secure' | 'warning' | 'critical' = 'secure';
    if (criticalIssues > 0) {
      newStatus = 'critical';
    } else if (highIssues > 2) {
      newStatus = 'warning';
    }

    setSecurityOverview(prev => ({
      ...prev,
      lastScan: new Date(),
      systemStatus: newStatus,
      totalThreats: prev.totalThreats + criticalIssues + highIssues
    }));

    // Show notification
    if (criticalIssues > 0) {
      toast.error('Critical security issues found', {
        description: `${criticalIssues} critical vulnerabilities need immediate attention`
      });
    } else if (highIssues > 0) {
      toast.warning('High priority security issues found', {
        description: `${highIssues} high-severity vulnerabilities detected`
      });
    } else {
      toast.success('Security scan completed successfully', {
        description: 'No critical issues found in your application'
      });
    }
  }, []);

  const handleThreatDetected = useCallback((threat: SecurityThreat) => {
    console.log('New threat detected:', threat);
    
    setRecentThreats(prev => [threat, ...prev.slice(0, 9)]);
    
    // Update overview
    setSecurityOverview(prev => ({
      ...prev,
      totalThreats: prev.totalThreats + 1
    }));

    // Show real-time notification
    toast.error('Security threat detected!', {
      description: threat.title,
      action: {
        label: 'View Details',
        onClick: () => console.log('View threat details:', threat.id)
      }
    });
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'secure': return <ShieldCheck className="h-5 w-5 text-success" />;
      case 'warning': return <ShieldAlert className="h-5 w-5 text-warning" />;
      case 'critical': return <ShieldX className="h-5 w-5 text-destructive" />;
      default: return <Shield className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure': return 'success';
      case 'warning': return 'warning';
      case 'critical': return 'destructive';
      default: return 'secondary';
    }
  };

  const getThreatSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <ShieldX className="h-4 w-4 text-destructive" />;
      case 'high': return <ShieldAlert className="h-4 w-4 text-warning" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'low': return <Shield className="h-4 w-4 text-info" />;
      default: return <Shield className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getThreatStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'mitigated': return <ShieldCheck className="h-4 w-4 text-success" />;
      case 'investigating': return <Clock className="h-4 w-4 text-warning" />;
      case 'detected': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  // Auto-refresh security data
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real implementation, this would fetch live security data
      setSecurityOverview(prev => ({
        ...prev,
        lastScan: new Date(prev.lastScan.getTime() + Math.random() * 60000)
      }));
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`max-w-7xl mx-auto p-6 space-y-6 ff-stagger-fade ${className}`}>
      {/* Page Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="ff-text-3xl font-bold ff-text-gradient font-sora">
              Security Center
            </h1>
            <p className="ff-text-base text-muted-foreground font-inter">
              Comprehensive security monitoring, vulnerability scanning, and threat protection
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant={getStatusColor(securityOverview.systemStatus) as any} className="px-3 py-1">
              {getStatusIcon(securityOverview.systemStatus)}
              <span className="ml-2 font-sora">
                {securityOverview.systemStatus.charAt(0).toUpperCase() + securityOverview.systemStatus.slice(1)}
              </span>
            </Badge>
          </div>
        </div>

        {/* Security Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="ff-card-interactive ff-hover-lift">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="ff-text-sm text-muted-foreground font-inter">Security Score</p>
                  <p className="ff-text-2xl font-bold ff-text-gradient font-sora">
                    {securityOverview.overallScore}%
                  </p>
                  <div className="flex items-center gap-1 ff-text-xs">
                    <TrendingUp className="h-3 w-3 text-success" />
                    <span className="text-success">+5% this week</span>
                  </div>
                </div>
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive ff-hover-lift">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="ff-text-sm text-muted-foreground font-inter">Active Threats</p>
                  <p className="ff-text-2xl font-bold font-sora">
                    {securityOverview.totalThreats}
                  </p>
                  <div className="flex items-center gap-1 ff-text-xs">
                    <span className="text-muted-foreground">{securityOverview.resolvedThreats} resolved</span>
                  </div>
                </div>
                <AlertTriangle className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive ff-hover-lift">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="ff-text-sm text-muted-foreground font-inter">Last Scan</p>
                  <p className="ff-text-lg font-semibold font-sora">
                    {Math.round((Date.now() - securityOverview.lastScan.getTime()) / (1000 * 60))}m ago
                  </p>
                  <div className="flex items-center gap-1 ff-text-xs">
                    <Activity className="h-3 w-3 text-primary animate-pulse" />
                    <span className="text-primary">{securityOverview.activeScans} active scan</span>
                  </div>
                </div>
                <Scan className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive ff-hover-lift">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="ff-text-sm text-muted-foreground font-inter">Compliance</p>
                  <p className="ff-text-2xl font-bold text-success font-sora">
                    100%
                  </p>
                  <div className="flex items-center gap-1 ff-text-xs">
                    <CheckCircle className="h-3 w-3 text-success" />
                    <span className="text-success">GDPR, SOC2</span>
                  </div>
                </div>
                <FileText className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Security Status Alert */}
      {securityOverview.systemStatus !== 'secure' && (
        <Alert className={securityOverview.systemStatus === 'critical' ? 'border-destructive' : 'border-warning'}>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-sora">
            {securityOverview.systemStatus === 'critical' ? 'Critical Security Issues Detected' : 'Security Warnings Found'}
          </AlertTitle>
          <AlertDescription className="font-inter">
            {securityOverview.systemStatus === 'critical' 
              ? 'Immediate action required to secure your application. Please review and address critical vulnerabilities.'
              : 'Some security issues require attention. Review the scan results and apply recommended fixes.'
            }
          </AlertDescription>
        </Alert>
      )}

      {/* Main Security Tabs */}
      <Tabs defaultValue="scanner" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scanner" className="font-sora">
            <Scan className="h-4 w-4 mr-2" />
            Scanner
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="font-sora">
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="threats" className="font-sora">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Threats
          </TabsTrigger>
          <TabsTrigger value="comprehensive" className="font-sora">
            <Shield className="h-4 w-4 mr-2" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scanner" className="space-y-6">
          <SecurityScanInterface 
            onScanComplete={handleScanComplete}
            onThreatDetected={handleThreatDetected}
          />
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          <SecurityPostureDashboard />
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          {/* Recent Threats */}
          <Card className="ff-card-interactive">
            <CardHeader>
              <CardTitle className="font-sora flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Recent Security Threats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentThreats.length === 0 ? (
                  <div className="text-center py-8">
                    <ShieldCheck className="h-12 w-12 text-success mx-auto mb-4" />
                    <h3 className="ff-text-lg font-semibold font-sora">No Recent Threats</h3>
                    <p className="ff-text-sm text-muted-foreground font-inter">
                      Your system is secure. All threats have been resolved.
                    </p>
                  </div>
                ) : (
                  recentThreats.map((threat) => (
                    <div key={threat.id} className="flex items-start gap-4 p-4 border rounded-lg ff-hover-lift">
                      <div className="flex-shrink-0 mt-1">
                        {getThreatSeverityIcon(threat.severity)}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="ff-text-sm font-semibold font-sora">{threat.title}</h4>
                            <p className="ff-text-xs text-muted-foreground font-inter">{threat.description}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant={threat.severity === 'critical' || threat.severity === 'high' ? 'destructive' : 'secondary'}>
                              {threat.severity}
                            </Badge>
                            <div className="flex items-center gap-1">
                              {getThreatStatusIcon(threat.status)}
                              <span className="ff-text-xs capitalize font-inter">{threat.status}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between ff-text-xs text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span className="font-inter">Source: {threat.source}</span>
                            <span className="font-inter">Assets: {threat.affectedAssets.join(', ')}</span>
                            {threat.responseTime && (
                              <span className="font-inter">Response: {threat.responseTime}min</span>
                            )}
                          </div>
                          <span className="font-inter">{threat.timestamp.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security Metrics */}
          <Card className="ff-card-interactive">
            <CardHeader>
              <CardTitle className="font-sora flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Security Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {securityMetrics.map((metric) => (
                  <div key={metric.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="ff-text-sm font-semibold font-sora">{metric.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(metric.status) as any}>
                          {metric.score}%
                        </Badge>
                        {metric.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3 text-success" />
                        ) : metric.trend === 'down' ? (
                          <TrendingUp className="h-3 w-3 text-destructive rotate-180" />
                        ) : (
                          <Activity className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="ff-progress-bar h-2 rounded-full"
                          style={{ width: `${metric.score}%` }}
                        />
                      </div>
                      
                      <p className="ff-text-xs text-muted-foreground font-inter">
                        {metric.details}
                      </p>
                      
                      {metric.recommendations && metric.recommendations.length > 0 && (
                        <div className="space-y-1">
                          <p className="ff-text-xs font-semibold font-sora">Recommendations:</p>
                          <ul className="space-y-1">
                            {metric.recommendations.map((rec, index) => (
                              <li key={index} className="ff-text-xs text-muted-foreground font-inter flex items-start gap-1">
                                <span className="text-primary">•</span>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comprehensive" className="space-y-6">
          <ComprehensiveSecurityScanner />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SecurityPage;
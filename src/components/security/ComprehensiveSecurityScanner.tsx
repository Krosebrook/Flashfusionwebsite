import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Key,
  Fingerprint,
  Network,
  Database,
  Globe,
  Server,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Scan,
  Bug,
  FileText,
  Settings,
  Download,
  RefreshCw,
  Zap,
  TrendingUp,
  Users,
  Activity,
  Cpu,
  HardDrive
} from 'lucide-react';

interface SecurityThreat {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'authentication' | 'authorization' | 'data' | 'network' | 'application' | 'infrastructure';
  status: 'active' | 'mitigated' | 'investigating';
  detectedAt: Date;
  affectedComponents: string[];
  recommendedActions: string[];
  cveId?: string;
  impact: string;
}

interface SecurityMetric {
  id: string;
  name: string;
  value: number;
  max: number;
  status: 'secure' | 'warning' | 'vulnerable';
  trend: 'improving' | 'stable' | 'declining';
  description: string;
}

interface ComplianceCheck {
  id: string;
  standard: string;
  requirement: string;
  status: 'compliant' | 'non-compliant' | 'partial';
  score: number;
  details: string;
  lastChecked: Date;
}

interface VulnerabilityScore {
  overall: number;
  authentication: number;
  authorization: number;
  dataProtection: number;
  networkSecurity: number;
  applicationSecurity: number;
  infrastructure: number;
}

const ComprehensiveSecurityScanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState(new Date());
  const [scanProgress, setScanProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetric[]>([]);
  const [compliance, setCompliance] = useState<ComplianceCheck[]>([]);
  const [vulnerabilityScore, setVulnerabilityScore] = useState<VulnerabilityScore>({
    overall: 87,
    authentication: 92,
    authorization: 89,
    dataProtection: 95,
    networkSecurity: 84,
    applicationSecurity: 83,
    infrastructure: 88
  });

  // Initialize security data
  const initializeSecurityData = useCallback(() => {
    const sampleThreats: SecurityThreat[] = [
      {
        id: 'threat-001',
        title: 'Potential SQL Injection Vulnerability',
        description: 'Detected unsanitized user input in database queries',
        severity: 'high',
        category: 'application',
        status: 'investigating',
        detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        affectedComponents: ['User Authentication', 'Data Query API'],
        recommendedActions: [
          'Implement parameterized queries',
          'Add input validation',
          'Review database permissions'
        ],
        cveId: 'CVE-2024-0123',
        impact: 'Potential unauthorized data access'
      },
      {
        id: 'threat-002',
        title: 'Outdated Dependency Detected',
        description: 'Security vulnerability found in third-party library',
        severity: 'medium',
        category: 'application',
        status: 'active',
        detectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        affectedComponents: ['Frontend Bundle', 'Authentication Service'],
        recommendedActions: [
          'Update to latest secure version',
          'Review dependency security advisories',
          'Implement dependency scanning in CI/CD'
        ],
        impact: 'Potential code execution vulnerability'
      },
      {
        id: 'threat-003',
        title: 'Weak SSL/TLS Configuration',
        description: 'SSL certificate configuration allows weak cipher suites',
        severity: 'medium',
        category: 'network',
        status: 'mitigated',
        detectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        affectedComponents: ['Web Server', 'API Gateway'],
        recommendedActions: [
          'Update SSL configuration',
          'Disable weak cipher suites',
          'Implement HSTS headers'
        ],
        impact: 'Potential man-in-the-middle attacks'
      }
    ];

    const sampleMetrics: SecurityMetric[] = [
      {
        id: 'failed-logins',
        name: 'Failed Login Attempts',
        value: 23,
        max: 100,
        status: 'secure',
        trend: 'stable',
        description: 'Number of failed authentication attempts in the last hour'
      },
      {
        id: 'api-rate-limit',
        name: 'API Rate Limit Violations',
        value: 7,
        max: 50,
        status: 'secure',
        trend: 'improving',
        description: 'Number of rate limit violations in the last hour'
      },
      {
        id: 'suspicious-activities',
        name: 'Suspicious Activities',
        value: 2,
        max: 10,
        status: 'secure',
        trend: 'stable',
        description: 'Number of flagged suspicious activities'
      },
      {
        id: 'data-access-violations',
        name: 'Data Access Violations',
        value: 0,
        max: 5,
        status: 'secure',
        trend: 'stable',
        description: 'Unauthorized data access attempts'
      }
    ];

    const sampleCompliance: ComplianceCheck[] = [
      {
        id: 'gdpr-001',
        standard: 'GDPR',
        requirement: 'Data Encryption at Rest',
        status: 'compliant',
        score: 95,
        details: 'All sensitive data is encrypted using AES-256',
        lastChecked: new Date()
      },
      {
        id: 'gdpr-002',
        standard: 'GDPR',
        requirement: 'Right to Data Portability',
        status: 'compliant',
        score: 88,
        details: 'Data export functionality implemented',
        lastChecked: new Date()
      },
      {
        id: 'soc2-001',
        standard: 'SOC 2',
        requirement: 'Access Control Management',
        status: 'partial',
        score: 72,
        details: 'Multi-factor authentication partially implemented',
        lastChecked: new Date()
      },
      {
        id: 'iso27001-001',
        standard: 'ISO 27001',
        requirement: 'Security Incident Management',
        status: 'compliant',
        score: 91,
        details: 'Incident response procedures documented and tested',
        lastChecked: new Date()
      }
    ];

    setThreats(sampleThreats);
    setMetrics(sampleMetrics);
    setCompliance(sampleCompliance);
  }, []);

  // Simulate security scan
  const performSecurityScan = useCallback(async () => {
    setIsScanning(true);
    setScanProgress(0);

    // Simulate scan progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setScanProgress(i);
    }

    // Update vulnerability scores with slight variations
    setVulnerabilityScore(prev => ({
      overall: Math.max(75, Math.min(95, prev.overall + (Math.random() - 0.5) * 4)),
      authentication: Math.max(85, Math.min(98, prev.authentication + (Math.random() - 0.5) * 3)),
      authorization: Math.max(80, Math.min(95, prev.authorization + (Math.random() - 0.5) * 3)),
      dataProtection: Math.max(90, Math.min(98, prev.dataProtection + (Math.random() - 0.5) * 2)),
      networkSecurity: Math.max(75, Math.min(90, prev.networkSecurity + (Math.random() - 0.5) * 4)),
      applicationSecurity: Math.max(70, Math.min(90, prev.applicationSecurity + (Math.random() - 0.5) * 5)),
      infrastructure: Math.max(80, Math.min(95, prev.infrastructure + (Math.random() - 0.5) * 3))
    }));

    setLastScanTime(new Date());
    setIsScanning(false);
    setScanProgress(0);
  }, []);

  // Initialize data on mount
  useEffect(() => {
    initializeSecurityData();
  }, [initializeSecurityData]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-50 border-red-200';
      case 'high': return 'text-orange-500 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-500 bg-blue-50 border-blue-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure':
      case 'compliant':
      case 'mitigated':
        return 'text-green-500';
      case 'warning':
      case 'partial':
        return 'text-yellow-500';
      case 'vulnerable':
      case 'non-compliant':
      case 'active':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const criticalThreats = useMemo(() => threats.filter(t => t.severity === 'critical').length, [threats]);
  const highThreats = useMemo(() => threats.filter(t => t.severity === 'high').length, [threats]);
  const activeThreats = useMemo(() => threats.filter(t => t.status === 'active').length, [threats]);

  return (
    <div className="space-y-6 ff-stagger-fade">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Shield className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h1 className="ff-text-2xl font-bold ff-text-gradient font-sora">
                Security Command Center
              </h1>
              <p className="ff-text-sm text-muted-foreground font-inter">
                Comprehensive security monitoring and threat detection
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge 
            variant={vulnerabilityScore.overall >= 85 ? "default" : "destructive"} 
            className="ff-badge-glow"
          >
            <Shield className="h-3 w-3 mr-1" />
            Security Score: {Math.round(vulnerabilityScore.overall)}%
          </Badge>
          
          <Button
            onClick={performSecurityScan}
            disabled={isScanning}
            className="ff-btn-primary ff-hover-glow"
          >
            {isScanning ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Scan className="h-4 w-4 mr-2" />
                Run Security Scan
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Scan Progress */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="ff-text-sm font-medium font-sora">
                      Security Scan in Progress
                    </span>
                    <span className="ff-text-sm text-muted-foreground">
                      {scanProgress}%
                    </span>
                  </div>
                  <Progress value={scanProgress} className="h-2" />
                  <p className="ff-text-xs text-muted-foreground font-inter">
                    Analyzing vulnerabilities, compliance status, and security threats...
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Critical Security Alerts */}
      <AnimatePresence>
        {(criticalThreats > 0 || activeThreats > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            {criticalThreats > 0 && (
              <Alert className="border-red-500/20 bg-red-500/5">
                <ShieldAlert className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-700 dark:text-red-300">
                  <strong>{criticalThreats} critical security threat{criticalThreats > 1 ? 's' : ''}</strong> require immediate attention
                </AlertDescription>
              </Alert>
            )}
            
            {activeThreats > 0 && (
              <Alert className="border-orange-500/20 bg-orange-500/5">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <AlertDescription className="text-orange-700 dark:text-orange-300">
                  <strong>{activeThreats} active threat{activeThreats > 1 ? 's' : ''}</strong> detected and being monitored
                </AlertDescription>
              </Alert>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security Score Overview */}
      <Card className="ff-card-interactive">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 font-sora">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              Security Posture Analysis
            </CardTitle>
            <div className="flex items-center gap-2 ff-text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Last scan: {lastScanTime.toLocaleTimeString()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {Object.entries(vulnerabilityScore).map(([key, score]) => {
              const icons = {
                overall: Shield,
                authentication: Fingerprint,
                authorization: Key,
                dataProtection: Lock,
                networkSecurity: Network,
                applicationSecurity: Bug,
                infrastructure: Server
              };
              const Icon = icons[key as keyof typeof icons];
              
              return (
                <motion.div
                  key={key}
                  className="text-center p-4 rounded-lg bg-muted/30 ff-hover-lift"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${getScoreColor(score)}`} />
                  <div className={`ff-text-2xl font-bold ${getScoreColor(score)} font-sora`}>
                    {Math.round(score)}%
                  </div>
                  <div className="ff-text-xs text-muted-foreground capitalize font-inter">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="mt-2">
                    <Progress value={score} className="h-1" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Security Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="threats">Threats</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="ff-card-interactive">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="ff-text-sm font-medium font-sora">Active Threats</p>
                    <p className="ff-text-2xl font-bold text-red-500 font-sora">
                      {activeThreats}
                    </p>
                  </div>
                  <ShieldAlert className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="ff-card-interactive">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="ff-text-sm font-medium font-sora">Critical Issues</p>
                    <p className="ff-text-2xl font-bold text-orange-500 font-sora">
                      {criticalThreats}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="ff-card-interactive">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="ff-text-sm font-medium font-sora">Compliance Score</p>
                    <p className="ff-text-2xl font-bold text-green-500 font-sora">
                      {Math.round(compliance.reduce((acc, c) => acc + c.score, 0) / compliance.length)}%
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="ff-card-interactive">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="ff-text-sm font-medium font-sora">Security Events</p>
                    <p className="ff-text-2xl font-bold text-blue-500 font-sora">
                      {metrics.reduce((acc, m) => acc + m.value, 0)}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-4">
          <div className="space-y-4">
            {threats.map((threat, index) => (
              <motion.div
                key={threat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="ff-card-interactive">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold font-sora">{threat.title}</h3>
                            <Badge className={getSeverityColor(threat.severity)}>
                              {threat.severity}
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(threat.status)}>
                              {threat.status}
                            </Badge>
                          </div>
                          <p className="ff-text-sm text-muted-foreground font-inter">
                            {threat.description}
                          </p>
                          {threat.cveId && (
                            <p className="ff-text-xs text-muted-foreground font-mono">
                              CVE ID: {threat.cveId}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="ff-hover-scale">
                            <Eye className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                          <Button size="sm" className="ff-btn-primary ff-hover-glow">
                            Mitigate
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <h4 className="ff-text-sm font-semibold mb-2 font-sora">Affected Components</h4>
                          <ul className="space-y-1">
                            {threat.affectedComponents.map((component, idx) => (
                              <li key={idx} className="ff-text-sm text-muted-foreground font-inter">
                                • {component}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="ff-text-sm font-semibold mb-2 font-sora">Recommended Actions</h4>
                          <ul className="space-y-1">
                            {threat.recommendedActions.map((action, idx) => (
                              <li key={idx} className="ff-text-sm text-muted-foreground font-inter">
                                • {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="ff-card-interactive">
                  <CardHeader className="pb-3">
                    <CardTitle className="ff-text-base font-semibold font-sora">
                      {metric.name}
                    </CardTitle>
                    <p className="ff-text-sm text-muted-foreground font-inter">
                      {metric.description}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className={`ff-text-3xl font-bold ${getStatusColor(metric.status)} font-sora`}>
                          {metric.value}
                        </span>
                        <Badge className={getStatusColor(metric.status)}>
                          {metric.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between ff-text-sm text-muted-foreground">
                          <span>Threshold: {metric.max}</span>
                          <span className="capitalize">{metric.trend}</span>
                        </div>
                        <Progress 
                          value={(metric.value / metric.max) * 100} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="space-y-4">
            {compliance.map((check, index) => (
              <motion.div
                key={check.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="ff-card-interactive">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold font-sora">{check.standard}</h3>
                          <Badge className={getStatusColor(check.status)}>
                            {check.status.replace('-', ' ')}
                          </Badge>
                          <span className={`ff-text-sm font-medium ${getScoreColor(check.score)} font-sora`}>
                            {check.score}%
                          </span>
                        </div>
                        <p className="ff-text-sm font-medium font-sora">{check.requirement}</p>
                        <p className="ff-text-sm text-muted-foreground font-inter">
                          {check.details}
                        </p>
                        <p className="ff-text-xs text-muted-foreground">
                          Last checked: {check.lastChecked.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="ff-hover-scale">
                          <FileText className="h-4 w-4 mr-2" />
                          Report
                        </Button>
                        {check.status !== 'compliant' && (
                          <Button size="sm" className="ff-btn-primary ff-hover-glow">
                            Fix Issues
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="ff-card-interactive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-sora">
            <Zap className="h-5 w-5 text-yellow-500" />
            Quick Security Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="ff-btn-secondary ff-hover-glow">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" className="ff-btn-secondary ff-hover-glow">
              <Settings className="h-4 w-4 mr-2" />
              Security Settings
            </Button>
            <Button variant="outline" className="ff-btn-secondary ff-hover-glow">
              <Users className="h-4 w-4 mr-2" />
              Team Access
            </Button>
            <Button variant="outline" className="ff-btn-secondary ff-hover-glow">
              <Activity className="h-4 w-4 mr-2" />
              Event Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Named export
export { ComprehensiveSecurityScanner };

// Default export
export default ComprehensiveSecurityScanner;
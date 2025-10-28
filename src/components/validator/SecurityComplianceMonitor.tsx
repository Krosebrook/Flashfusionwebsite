import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Shield, 
  Lock, 
  Key, 
  UserCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  FileX,
  Download,
  Clock,
  Globe,
  Database,
  Server,
  Smartphone,
  Fingerprint,
  Settings,
  RefreshCw,
  Zap,
  AlertCircle,
  Award,
  Calendar,
  Users,
  Activity,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SecurityCheck {
  id: string;
  name: string;
  category: 'encryption' | 'auth' | 'compliance' | 'privacy' | 'access';
  status: 'secure' | 'warning' | 'vulnerable' | 'checking';
  score: number;
  description: string;
  lastCheck: string;
  recommendation?: string;
  critical: boolean;
}

interface ComplianceStatus {
  regulation: string;
  status: 'compliant' | 'partial' | 'non-compliant';
  score: number;
  lastAudit: string;
  requirements: {
    met: number;
    total: number;
  };
  nextDeadline?: string;
}

interface AuthMetrics {
  totalUsers: number;
  activeUsers: number;
  mfaEnabled: number;
  suspiciousLogins: number;
  failedAttempts: number;
  passwordStrength: number;
}

export function SecurityComplianceMonitor() {
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [securityChecks, setSecurityChecks] = useState<SecurityCheck[]>([]);
  const [complianceStatus, setComplianceStatus] = useState<ComplianceStatus[]>([]);
  const [authMetrics, setAuthMetrics] = useState<AuthMetrics>({
    totalUsers: 12847,
    activeUsers: 8932,
    mfaEnabled: 7245,
    suspiciousLogins: 12,
    failedAttempts: 127,
    passwordStrength: 87
  });

  // Initialize data
  useEffect(() => {
    const initialChecks: SecurityCheck[] = [
      {
        id: 'data-encryption',
        name: 'Data Encryption at Rest',
        category: 'encryption',
        status: 'secure',
        score: 98,
        description: 'All sensitive data encrypted with AES-256',
        lastCheck: '5 minutes ago',
        critical: true
      },
      {
        id: 'transport-security',
        name: 'Transport Layer Security',
        category: 'encryption',
        status: 'secure',
        score: 96,
        description: 'TLS 1.3 enforced across all endpoints',
        lastCheck: '2 minutes ago',
        critical: true
      },
      {
        id: 'key-rotation',
        name: 'Encryption Key Rotation',
        category: 'encryption',
        status: 'warning',
        score: 82,
        description: 'Some keys approaching rotation schedule',
        lastCheck: '15 minutes ago',
        recommendation: 'Schedule immediate key rotation for 3 services',
        critical: false
      },
      {
        id: 'mfa-enforcement',
        name: 'Multi-Factor Authentication',
        category: 'auth',
        status: 'warning',
        score: 78,
        description: 'MFA enabled for 81% of users',
        lastCheck: '10 minutes ago',
        recommendation: 'Enforce MFA for all admin accounts',
        critical: true
      },
      {
        id: 'session-management',
        name: 'Session Security',
        category: 'auth',
        status: 'secure',
        score: 94,
        description: 'Secure session handling and timeout policies',
        lastCheck: '3 minutes ago',
        critical: false
      },
      {
        id: 'oauth-security',
        name: 'OAuth Implementation',
        category: 'auth',
        status: 'secure',
        score: 91,
        description: 'OAuth 2.0 with PKCE properly implemented',
        lastCheck: '8 minutes ago',
        critical: true
      },
      {
        id: 'gdpr-compliance',
        name: 'GDPR Data Handling',
        category: 'compliance',
        status: 'warning',
        score: 85,
        description: 'Data deletion workflows need optimization',
        lastCheck: '20 minutes ago',
        recommendation: 'Improve data deletion response time',
        critical: false
      },
      {
        id: 'data-retention',
        name: 'Data Retention Policies',
        category: 'compliance',
        status: 'secure',
        score: 92,
        description: 'Automated data retention and purging',
        lastCheck: '12 minutes ago',
        critical: false
      },
      {
        id: 'privacy-controls',
        name: 'User Privacy Controls',
        category: 'privacy',
        status: 'secure',
        score: 89,
        description: 'Comprehensive privacy settings available',
        lastCheck: '6 minutes ago',
        critical: false
      },
      {
        id: 'data-anonymization',
        name: 'Data Anonymization',
        category: 'privacy',
        status: 'warning',
        score: 76,
        description: 'Some PII not properly anonymized in analytics',
        lastCheck: '25 minutes ago',
        recommendation: 'Implement stronger anonymization for analytics data',
        critical: true
      },
      {
        id: 'rbac-system',
        name: 'Role-Based Access Control',
        category: 'access',
        status: 'secure',
        score: 93,
        description: 'Granular permissions properly configured',
        lastCheck: '4 minutes ago',
        critical: true
      },
      {
        id: 'api-security',
        name: 'API Access Control',
        category: 'access',
        status: 'vulnerable',
        score: 67,
        description: 'Some API endpoints lack proper rate limiting',
        lastCheck: '18 minutes ago',
        recommendation: 'Implement rate limiting on all public APIs',
        critical: true
      }
    ];

    const initialCompliance: ComplianceStatus[] = [
      {
        regulation: 'GDPR',
        status: 'partial',
        score: 87,
        lastAudit: '1 week ago',
        requirements: { met: 26, total: 30 },
        nextDeadline: '2024-05-25'
      },
      {
        regulation: 'CCPA',
        status: 'compliant',
        score: 94,
        lastAudit: '2 weeks ago',
        requirements: { met: 15, total: 16 }
      },
      {
        regulation: 'SOC 2 Type II',
        status: 'compliant',
        score: 91,
        lastAudit: '3 months ago',
        requirements: { met: 44, total: 47 }
      },
      {
        regulation: 'ISO 27001',
        status: 'partial',
        score: 82,
        lastAudit: '6 months ago',
        requirements: { met: 89, total: 114 },
        nextDeadline: '2024-08-15'
      },
      {
        regulation: 'HIPAA',
        status: 'non-compliant',
        score: 45,
        lastAudit: '8 months ago',
        requirements: { met: 12, total: 34 },
        nextDeadline: '2024-06-30'
      }
    ];

    setSecurityChecks(initialChecks);
    setComplianceStatus(initialCompliance);
  }, []);

  const runSecurityAudit = async () => {
    setIsRunningAudit(true);
    setAuditProgress(0);

    // Simulate audit process
    for (let i = 0; i <= 100; i += 3) {
      await new Promise(resolve => setTimeout(resolve, 150));
      setAuditProgress(i);
    }

    // Update some results after audit
    setSecurityChecks(prev => prev.map(check => ({
      ...check,
      lastCheck: 'just now',
      score: Math.min(100, check.score + Math.floor(Math.random() * 8) - 2)
    })));

    setIsRunningAudit(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'secure':
      case 'compliant':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
      case 'partial':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'vulnerable':
      case 'non-compliant':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'checking':
        return <Activity className="w-4 h-4 text-blue-500 animate-pulse" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'encryption':
        return <Lock className="w-5 h-5" />;
      case 'auth':
        return <UserCheck className="w-5 h-5" />;
      case 'compliance':
        return <FileX className="w-5 h-5" />;
      case 'privacy':
        return <EyeOff className="w-5 h-5" />;
      case 'access':
        return <Key className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 80) return 'text-yellow-500';
    if (score >= 70) return 'text-orange-500';
    return 'text-red-500';
  };

  const overallSecurityScore = securityChecks.reduce((sum, check) => sum + check.score, 0) / securityChecks.length;
  const criticalIssues = securityChecks.filter(check => check.critical && (check.status === 'vulnerable' || check.status === 'warning')).length;
  const secureChecks = securityChecks.filter(check => check.status === 'secure').length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-2">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="ff-text-gradient">Security Compliance Monitor</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Comprehensive security monitoring with GDPR compliance, encryption validation, and authentication auditing for enterprise-grade protection.
        </p>
      </motion.div>

      {/* Security Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-6"
      >
        <Card className="ff-card-interactive col-span-1 md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center">
                  <span className={`text-2xl font-bold ${getScoreColor(overallSecurityScore)}`}>
                    {Math.round(overallSecurityScore)}
                  </span>
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-primary" 
                     style={{ 
                       background: `conic-gradient(from 0deg, var(--ff-primary) 0deg, var(--ff-primary) ${overallSecurityScore * 3.6}deg, transparent ${overallSecurityScore * 3.6}deg)`
                     }}
                />
              </div>
              <div>
                <h3 className="font-medium">Security Score</h3>
                <p className="text-sm text-muted-foreground">Overall security posture</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    Enterprise Grade
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Issues</p>
                <p className="text-2xl font-bold text-red-500">{criticalIssues}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <div className="mt-2">
              <Badge variant={criticalIssues === 0 ? "outline" : "destructive"}>
                {criticalIssues === 0 ? 'All Clear' : 'Action Required'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Secure Checks</p>
                <p className="text-2xl font-bold text-green-500">{secureChecks}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-green-500 border-green-500">
                Protected
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">MFA Coverage</p>
                <p className="text-2xl font-bold text-secondary">{Math.round((authMetrics.mfaEnabled / authMetrics.totalUsers) * 100)}%</p>
              </div>
              <Fingerprint className="w-8 h-8 text-secondary" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-blue-500 border-blue-500">
                {authMetrics.mfaEnabled.toLocaleString()} users
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-4"
      >
        <Button 
          onClick={runSecurityAudit} 
          disabled={isRunningAudit}
          className="ff-btn-primary"
          size="lg"
        >
          {isRunningAudit ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Auditing... {auditProgress}%
            </>
          ) : (
            <>
              <Shield className="w-5 h-5 mr-2" />
              Run Security Audit
            </>
          )}
        </Button>

        <Button variant="outline" size="lg">
          <Zap className="w-5 h-5 mr-2" />
          Auto-Fix Issues
        </Button>

        <Button variant="outline" size="lg">
          <Download className="w-5 h-5 mr-2" />
          Compliance Report
        </Button>

        <Button variant="outline" size="lg">
          <Settings className="w-5 h-5 mr-2" />
          Security Settings
        </Button>
      </motion.div>

      {/* Audit Progress */}
      <AnimatePresence>
        {isRunningAudit && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-primary/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-primary animate-pulse" />
                    <span className="font-medium">Running Comprehensive Security Audit</span>
                  </div>
                  <Progress value={auditProgress} className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    Scanning encryption, authentication, compliance, and access controls...
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Security Checks</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="encryption">Encryption</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          {/* Security Checks Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="space-y-4">
              {securityChecks.map((check, index) => (
                <motion.div
                  key={check.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`ff-card-interactive ${
                    check.status === 'vulnerable' ? 'border-red-500/20 bg-red-500/5' :
                    check.status === 'warning' ? 'border-yellow-500/20 bg-yellow-500/5' :
                    'border-green-500/20 bg-green-500/5'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            {getCategoryIcon(check.category)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              {getStatusIcon(check.status)}
                              <h4 className="font-medium">{check.name}</h4>
                              {check.critical && (
                                <Badge variant="destructive" className="text-xs">
                                  CRITICAL
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{check.description}</p>
                            {check.recommendation && (
                              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-3">
                                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                                  <strong>Recommendation:</strong> {check.recommendation}
                                </p>
                              </div>
                            )}
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>Score: <span className={getScoreColor(check.score)}>{check.score}</span></span>
                              <span>Last check: {check.lastCheck}</span>
                              <span className="capitalize">{check.category}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            Details
                          </Button>
                          {(check.status === 'warning' || check.status === 'vulnerable') && (
                            <Button size="sm" className="ff-btn-primary">
                              <Zap className="w-3 h-3 mr-1" />
                              Fix
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

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {complianceStatus.map((compliance, index) => (
                <motion.div
                  key={compliance.regulation}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="ff-card-interactive">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{compliance.regulation}</h4>
                        {getStatusIcon(compliance.status)}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Compliance Score:</span>
                          <span className={`font-medium ${getScoreColor(compliance.score)}`}>
                            {compliance.score}%
                          </span>
                        </div>
                        <Progress value={compliance.score} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Requirements Met:</span>
                          <p className="font-medium">
                            {compliance.requirements.met}/{compliance.requirements.total}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Last Audit:</span>
                          <p className="font-medium">{compliance.lastAudit}</p>
                        </div>
                      </div>

                      {compliance.nextDeadline && (
                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                              Next deadline: {compliance.nextDeadline}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          View Report
                        </Button>
                        <Button size="sm" className="ff-btn-secondary flex-1">
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Re-audit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Authentication Tab */}
          <TabsContent value="auth" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="ff-card-interactive">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                      <p className="text-2xl font-bold">{authMetrics.totalUsers.toLocaleString()}</p>
                    </div>
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="ff-card-interactive">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                      <p className="text-2xl font-bold text-green-500">{authMetrics.activeUsers.toLocaleString()}</p>
                    </div>
                    <Activity className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-green-500 border-green-500">
                      {Math.round((authMetrics.activeUsers / authMetrics.totalUsers) * 100)}% active
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="ff-card-interactive">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">MFA Enabled</p>
                      <p className="text-2xl font-bold text-secondary">{authMetrics.mfaEnabled.toLocaleString()}</p>
                    </div>
                    <Fingerprint className="w-8 h-8 text-secondary" />
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-blue-500 border-blue-500">
                      {Math.round((authMetrics.mfaEnabled / authMetrics.totalUsers) * 100)}% coverage
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="ff-card-interactive">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Failed Attempts</p>
                      <p className="text-2xl font-bold text-red-500">{authMetrics.failedAttempts}</p>
                    </div>
                    <XCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-red-500 border-red-500">
                      Last 24h
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Authentication Trends</CardTitle>
                <CardDescription>Login patterns and security metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                  <div className="text-center space-y-2">
                    <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Authentication analytics visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Encryption Tab */}
          <TabsContent value="encryption" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {securityChecks.filter(check => check.category === 'encryption').map((check, index) => (
                <motion.div
                  key={check.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="ff-card-interactive">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Lock className="w-5 h-5 text-primary" />
                          <h4 className="font-medium">{check.name}</h4>
                        </div>
                        {getStatusIcon(check.status)}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{check.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Security Score:</span>
                          <span className={`font-medium ${getScoreColor(check.score)}`}>
                            {check.score}
                          </span>
                        </div>
                        <Progress value={check.score} className="h-2" />
                      </div>

                      {check.recommendation && (
                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                          <p className="text-sm text-yellow-600 dark:text-yellow-400">
                            {check.recommendation}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Last check: {check.lastCheck}</span>
                        {check.critical && (
                          <Badge variant="destructive" className="text-xs">
                            CRITICAL
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {securityChecks.filter(check => check.category === 'privacy').map((check, index) => (
                <motion.div
                  key={check.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="ff-card-interactive">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <EyeOff className="w-5 h-5 text-primary" />
                          <h4 className="font-medium">{check.name}</h4>
                        </div>
                        {getStatusIcon(check.status)}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{check.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Privacy Score:</span>
                          <span className={`font-medium ${getScoreColor(check.score)}`}>
                            {check.score}
                          </span>
                        </div>
                        <Progress value={check.score} className="h-2" />
                      </div>

                      {check.recommendation && (
                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                          <p className="text-sm text-yellow-600 dark:text-yellow-400">
                            {check.recommendation}
                          </p>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          Audit
                        </Button>
                        {check.status !== 'secure' && (
                          <Button size="sm" className="ff-btn-primary flex-1">
                            <Zap className="w-3 h-3 mr-1" />
                            Fix
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
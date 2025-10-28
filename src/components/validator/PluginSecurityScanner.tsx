import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Plug, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  RefreshCw,
  Shield,
  Eye,
  Zap,
  Settings,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Download,
  Upload,
  Clock,
  Globe,
  Database,
  Code,
  Key,
  Lock,
  Activity,
  FileText,
  Search,
  Filter,
  Archive,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PluginInfo {
  id: string;
  name: string;
  version: string;
  developer: string;
  category: 'integration' | 'ai' | 'analytics' | 'productivity' | 'security';
  status: 'active' | 'inactive' | 'sandboxed' | 'blocked';
  securityScore: number;
  lastScan: string;
  installDate: string;
  permissions: string[];
  apiCalls: number;
  dataAccess: string[];
  vulnerabilities: SecurityVulnerability[];
  rateLimit: {
    current: number;
    limit: number;
    period: string;
  };
}

interface SecurityVulnerability {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  recommendation: string;
  cve?: string;
}

interface SandboxConfig {
  id: string;
  pluginId: string;
  permissions: string[];
  dataRestrictions: string[];
  networkAccess: boolean;
  fileSystemAccess: boolean;
  storageQuota: number;
  executionTimeout: number;
}

export function PluginSecurityScanner() {
  const [isRunningSecurityScan, setIsRunningSecurityScan] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [plugins, setPlugins] = useState<PluginInfo[]>([]);
  const [sandboxConfigs, setSandboxConfigs] = useState<SandboxConfig[]>([]);
  const [securityMetrics, setSecurityMetrics] = useState({
    totalPlugins: 24,
    securePlugins: 19,
    vulnerablePlugins: 3,
    blockedPlugins: 2,
    overallSecurityScore: 84,
    criticalVulnerabilities: 1
  });

  // Initialize data
  useEffect(() => {
    const initialPlugins: PluginInfo[] = [
      {
        id: 'plugin-stripe',
        name: 'Stripe Payment Gateway',
        version: '2.1.4',
        developer: 'Stripe Inc.',
        category: 'integration',
        status: 'active',
        securityScore: 96,
        lastScan: '2 hours ago',
        installDate: '2024-01-15',
        permissions: ['payment.process', 'user.read', 'order.create'],
        apiCalls: 2847,
        dataAccess: ['Payment Info', 'Customer Data'],
        vulnerabilities: [],
        rateLimit: { current: 2847, limit: 10000, period: 'daily' }
      },
      {
        id: 'plugin-zapier',
        name: 'Zapier Integration',
        version: '1.8.2',
        developer: 'Zapier Inc.',
        category: 'integration',
        status: 'active',
        securityScore: 89,
        lastScan: '1 hour ago',
        installDate: '2024-02-01',
        permissions: ['webhook.send', 'data.read', 'automation.trigger'],
        apiCalls: 1523,
        dataAccess: ['User Events', 'Workflow Data'],
        vulnerabilities: [
          {
            id: 'vuln-1',
            severity: 'medium',
            type: 'Data Exposure',
            description: 'Webhook URLs logged in plain text',
            recommendation: 'Enable webhook URL encryption in logs'
          }
        ],
        rateLimit: { current: 1523, limit: 5000, period: 'daily' }
      },
      {
        id: 'plugin-analytics',
        name: 'Advanced Analytics Pro',
        version: '3.2.1',
        developer: 'AnalyticsPro Ltd.',
        category: 'analytics',
        status: 'sandboxed',
        securityScore: 72,
        lastScan: '30 minutes ago',
        installDate: '2024-03-10',
        permissions: ['analytics.read', 'user.track', 'data.export'],
        apiCalls: 4621,
        dataAccess: ['User Behavior', 'Performance Metrics'],
        vulnerabilities: [
          {
            id: 'vuln-2',
            severity: 'high',
            type: 'Privilege Escalation',
            description: 'Plugin attempts to access admin-level functions',
            recommendation: 'Restrict to read-only analytics permissions'
          },
          {
            id: 'vuln-3',
            severity: 'medium',
            type: 'Data Leakage',
            description: 'User data transmitted without encryption',
            recommendation: 'Enforce HTTPS for all data transmission'
          }
        ],
        rateLimit: { current: 4621, limit: 8000, period: 'daily' }
      },
      {
        id: 'plugin-malicious',
        name: 'QuickTools Helper',
        version: '1.0.0',
        developer: 'Unknown Developer',
        category: 'productivity',
        status: 'blocked',
        securityScore: 23,
        lastScan: '15 minutes ago',
        installDate: '2024-03-15',
        permissions: ['system.admin', 'file.write', 'network.access'],
        apiCalls: 0,
        dataAccess: ['System Files', 'User Data', 'Network'],
        vulnerabilities: [
          {
            id: 'vuln-4',
            severity: 'critical',
            type: 'Malicious Code',
            description: 'Plugin contains obfuscated code that attempts system compromise',
            recommendation: 'Immediately block and remove plugin',
            cve: 'CVE-2024-1234'
          }
        ],
        rateLimit: { current: 0, limit: 0, period: 'blocked' }
      }
    ];

    const initialSandboxConfigs: SandboxConfig[] = [
      {
        id: 'sandbox-analytics',
        pluginId: 'plugin-analytics',
        permissions: ['analytics.read'],
        dataRestrictions: ['no-pii', 'aggregated-only'],
        networkAccess: true,
        fileSystemAccess: false,
        storageQuota: 100, // MB
        executionTimeout: 30000 // ms
      }
    ];

    setPlugins(initialPlugins);
    setSandboxConfigs(initialSandboxConfigs);
  }, []);

  const runSecurityScan = async () => {
    setIsRunningSecurityScan(true);
    setScanProgress(0);

    // Simulate security scan process
    for (let i = 0; i <= 100; i += 4) {
      await new Promise(resolve => setTimeout(resolve, 150));
      setScanProgress(i);
    }

    // Update some results after scan
    setPlugins(prev => prev.map(plugin => ({
      ...plugin,
      lastScan: 'just now',
      securityScore: plugin.status === 'blocked' ? plugin.securityScore : 
        Math.min(100, plugin.securityScore + Math.floor(Math.random() * 6) - 2)
    })));

    setSecurityMetrics(prev => ({
      ...prev,
      overallSecurityScore: Math.min(100, prev.overallSecurityScore + Math.floor(Math.random() * 4) - 1)
    }));

    setIsRunningSecurityScan(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'sandboxed':
        return <Shield className="w-4 h-4 text-yellow-500" />;
      case 'inactive':
        return <Clock className="w-4 h-4 text-gray-500" />;
      case 'blocked':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'integration':
        return <Globe className="w-4 h-4" />;
      case 'ai':
        return <Code className="w-4 h-4" />;
      case 'analytics':
        return <BarChart3 className="w-4 h-4" />;
      case 'productivity':
        return <FileText className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
      default:
        return <Plug className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'high':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 80) return 'text-yellow-500';
    if (score >= 70) return 'text-orange-500';
    return 'text-red-500';
  };

  const activePlugins = plugins.filter(plugin => plugin.status === 'active').length;
  const vulnerablePlugins = plugins.filter(plugin => plugin.vulnerabilities.length > 0).length;
  const sandboxedPlugins = plugins.filter(plugin => plugin.status === 'sandboxed').length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-2">
          <Plug className="w-8 h-8 text-primary" />
          <h1 className="ff-text-gradient">Plugin Security Scanner</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Advanced security validation for third-party integrations with automated sandboxing, vulnerability detection, and API rate limiting.
        </p>
      </motion.div>

      {/* Security Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6"
      >
        <Card className="ff-card-interactive col-span-1 md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center">
                  <span className={`text-2xl font-bold ${getScoreColor(securityMetrics.overallSecurityScore)}`}>
                    {securityMetrics.overallSecurityScore}
                  </span>
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-primary" 
                     style={{ 
                       background: `conic-gradient(from 0deg, var(--ff-primary) 0deg, var(--ff-primary) ${securityMetrics.overallSecurityScore * 3.6}deg, transparent ${securityMetrics.overallSecurityScore * 3.6}deg)`
                     }}
                />
              </div>
              <div>
                <h3 className="font-medium">Security Score</h3>
                <p className="text-sm text-muted-foreground">Plugin ecosystem safety</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    Protected
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
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-500">{activePlugins}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-green-500 border-green-500">
                Verified
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vulnerable</p>
                <p className="text-2xl font-bold text-yellow-500">{vulnerablePlugins}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                Needs Review
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sandboxed</p>
                <p className="text-2xl font-bold text-secondary">{sandboxedPlugins}</p>
              </div>
              <Shield className="w-8 h-8 text-secondary" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-blue-500 border-blue-500">
                Isolated
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-500">{securityMetrics.criticalVulnerabilities}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <div className="mt-2">
              <Badge variant={securityMetrics.criticalVulnerabilities === 0 ? "outline" : "destructive"}>
                {securityMetrics.criticalVulnerabilities === 0 ? 'None' : 'Urgent'}
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
          onClick={runSecurityScan} 
          disabled={isRunningSecurityScan}
          className="ff-btn-primary"
          size="lg"
        >
          {isRunningSecurityScan ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Scanning... {scanProgress}%
            </>
          ) : (
            <>
              <Shield className="w-5 h-5 mr-2" />
              Scan All Plugins
            </>
          )}
        </Button>

        <Button variant="outline" size="lg">
          <Zap className="w-5 h-5 mr-2" />
          Auto-Sandbox Risky
        </Button>

        <Button variant="outline" size="lg">
          <Settings className="w-5 h-5 mr-2" />
          Security Policies
        </Button>

        <Button variant="outline" size="lg">
          <Download className="w-5 h-5 mr-2" />
          Security Report
        </Button>
      </motion.div>

      {/* Scan Progress */}
      <AnimatePresence>
        {isRunningSecurityScan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-primary/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Plug className="w-5 h-5 text-primary animate-pulse" />
                    <span className="font-medium">Scanning Plugin Security</span>
                  </div>
                  <Progress value={scanProgress} className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    Analyzing permissions, vulnerabilities, and API usage patterns...
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Plugin Security</TabsTrigger>
            <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
            <TabsTrigger value="sandbox">Sandbox Config</TabsTrigger>
            <TabsTrigger value="analytics">Usage Analytics</TabsTrigger>
          </TabsList>

          {/* Plugin Security Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="space-y-4">
              {plugins.map((plugin, index) => (
                <motion.div
                  key={plugin.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="ff-card-interactive">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            {getCategoryIcon(plugin.category)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              {getStatusIcon(plugin.status)}
                              <h4 className="font-medium">{plugin.name}</h4>
                              <Badge variant="outline">v{plugin.version}</Badge>
                              <Badge className={
                                plugin.securityScore >= 90 ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                plugin.securityScore >= 80 ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                'bg-red-500/10 text-red-500 border-red-500/20'
                              }>
                                Security: {plugin.securityScore}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              By {plugin.developer} • Installed {plugin.installDate} • Last scan: {plugin.lastScan}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">API Usage</p>
                                <div className="flex items-center space-x-2">
                                  <Progress value={(plugin.rateLimit.current / plugin.rateLimit.limit) * 100} className="h-2 flex-1" />
                                  <span className="text-sm font-medium">
                                    {plugin.rateLimit.current}/{plugin.rateLimit.limit}
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Permissions</p>
                                <div className="flex flex-wrap gap-1">
                                  {plugin.permissions.slice(0, 2).map((perm, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {perm}
                                    </Badge>
                                  ))}
                                  {plugin.permissions.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{plugin.permissions.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Vulnerabilities</p>
                                <div className="flex items-center space-x-1">
                                  {plugin.vulnerabilities.length === 0 ? (
                                    <Badge variant="outline" className="text-xs text-green-500 border-green-500">
                                      None Found
                                    </Badge>
                                  ) : (
                                    <Badge variant="destructive" className="text-xs">
                                      {plugin.vulnerabilities.length} Found
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            Details
                          </Button>
                          {plugin.status === 'blocked' ? (
                            <Button size="sm" variant="destructive">
                              <Trash2 className="w-3 h-3 mr-1" />
                              Remove
                            </Button>
                          ) : plugin.vulnerabilities.length > 0 ? (
                            <Button size="sm" className="ff-btn-secondary">
                              <Shield className="w-3 h-3 mr-1" />
                              Sandbox
                            </Button>
                          ) : (
                            <Button size="sm" className="ff-btn-primary">
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Rescan
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

          {/* Vulnerabilities Tab */}
          <TabsContent value="vulnerabilities" className="space-y-6">
            <div className="space-y-4">
              {plugins.flatMap(plugin => 
                plugin.vulnerabilities.map(vuln => ({ ...vuln, pluginName: plugin.name }))
              ).map((vuln, index) => (
                <motion.div
                  key={vuln.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`ff-card-interactive ${
                    vuln.severity === 'critical' ? 'border-red-500/20 bg-red-500/5' :
                    vuln.severity === 'high' ? 'border-orange-500/20 bg-orange-500/5' :
                    vuln.severity === 'medium' ? 'border-yellow-500/20 bg-yellow-500/5' :
                    'border-blue-500/20 bg-blue-500/5'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium">{vuln.type}</h4>
                            <Badge className={getSeverityColor(vuln.severity)}>
                              {vuln.severity.toUpperCase()}
                            </Badge>
                            {vuln.cve && (
                              <Badge variant="outline">
                                {vuln.cve}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            Plugin: {vuln.pluginName}
                          </p>
                          <p className="text-sm mb-3">{vuln.description}</p>
                          
                          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                              <strong>Recommendation:</strong> {vuln.recommendation}
                            </p>
                          </div>
                        </div>
                        
                        <Button size="sm" className="ff-btn-primary">
                          <Zap className="w-3 h-3 mr-1" />
                          Fix
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {plugins.every(plugin => plugin.vulnerabilities.length === 0) && (
                <div className="text-center py-12">
                  <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No Vulnerabilities Found</h3>
                  <p className="text-muted-foreground">All plugins are secure and up to date</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Sandbox Config Tab */}
          <TabsContent value="sandbox" className="space-y-6">
            <div className="space-y-4">
              {sandboxConfigs.map((config, index) => {
                const plugin = plugins.find(p => p.id === config.pluginId);
                return (
                  <motion.div
                    key={config.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="ff-card-interactive">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{plugin?.name} Sandbox</h4>
                          <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                            SANDBOXED
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium mb-2">Allowed Permissions:</p>
                              <div className="flex flex-wrap gap-1">
                                {config.permissions.map((perm, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs text-green-500 border-green-500">
                                    {perm}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-2">Data Restrictions:</p>
                              <div className="flex flex-wrap gap-1">
                                {config.dataRestrictions.map((restriction, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs text-red-500 border-red-500">
                                    {restriction}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Network:</span>
                                <p className="font-medium">{config.networkAccess ? 'Allowed' : 'Blocked'}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">File System:</span>
                                <p className="font-medium">{config.fileSystemAccess ? 'Allowed' : 'Blocked'}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Storage:</span>
                                <p className="font-medium">{config.storageQuota}MB</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Timeout:</span>
                                <p className="font-medium">{config.executionTimeout}ms</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Settings className="w-3 h-3 mr-1" />
                            Configure
                          </Button>
                          <Button size="sm" className="ff-btn-secondary flex-1">
                            <Archive className="w-3 h-3 mr-1" />
                            Remove Sandbox
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Usage Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Usage Trends</CardTitle>
                  <CardDescription>Plugin API consumption over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                    <div className="text-center space-y-2">
                      <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">API usage visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Events</CardTitle>
                  <CardDescription>Plugin security incidents and responses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                    <div className="text-center space-y-2">
                      <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">Security events tracking</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
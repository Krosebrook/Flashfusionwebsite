import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Database, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  RefreshCw,
  Link,
  GitMerge,
  Users,
  ShoppingBag,
  Target,
  FileText,
  Calendar,
  DollarSign,
  Layers,
  Network,
  Eye,
  Settings,
  Zap,
  AlertCircle,
  Info,
  TrendingUp,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';

interface DataIntegrityCheck {
  id: string;
  name: string;
  description: string;
  sourceApp: string;
  targetApp: string;
  status: 'synced' | 'mismatch' | 'missing' | 'conflict';
  lastSync: string;
  recordCount: number;
  errorCount: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface AppConnection {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  status: 'connected' | 'degraded' | 'disconnected';
  lastSync: string;
  dataTypes: string[];
  syncHealth: number;
}

export function CrossAppDataValidator() {
  const [isRunningSync, setIsRunningSync] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [integrityChecks, setIntegrityChecks] = useState<DataIntegrityCheck[]>([]);
  const [appConnections, setAppConnections] = useState<AppConnection[]>([]);

  // Initialize data
  useEffect(() => {
    const initialConnections: AppConnection[] = [
      {
        id: 'creator-commerce',
        name: 'Creator Commerce',
        icon: ShoppingBag,
        status: 'connected',
        lastSync: '2 minutes ago',
        dataTypes: ['Products', 'Orders', 'Analytics', 'Brand Kits'],
        syncHealth: 95
      },
      {
        id: 'validation-nexus',
        name: 'Validation Nexus',
        icon: Target,
        status: 'connected',
        lastSync: '1 minute ago',
        dataTypes: ['Ideas', 'Analyses', 'Reports', 'Benchmarks'],
        syncHealth: 88
      },
      {
        id: 'project-manager',
        name: 'Project Manager',
        icon: FileText,
        status: 'degraded',
        lastSync: '15 minutes ago',
        dataTypes: ['Projects', 'Tasks', 'Teams', 'Resources'],
        syncHealth: 72
      },
      {
        id: 'collaboration-hub',
        name: 'Collaboration Hub',
        icon: Users,
        status: 'connected',
        lastSync: '30 seconds ago',
        dataTypes: ['Users', 'Permissions', 'Comments', 'Revisions'],
        syncHealth: 92
      },
      {
        id: 'analytics-dashboard',
        name: 'Analytics Dashboard',
        icon: TrendingUp,
        status: 'connected',
        lastSync: '5 minutes ago',
        dataTypes: ['Events', 'Metrics', 'Reports', 'KPIs'],
        syncHealth: 89
      },
      {
        id: 'subscription-system',
        name: 'Subscription System',
        icon: DollarSign,
        status: 'connected',
        lastSync: '3 minutes ago',
        dataTypes: ['Subscriptions', 'Payments', 'Usage', 'Billing'],
        syncHealth: 97
      }
    ];

    const initialChecks: DataIntegrityCheck[] = [
      {
        id: 'user-profiles',
        name: 'User Profile Consistency',
        description: 'User data synchronized across all applications',
        sourceApp: 'Auth System',
        targetApp: 'All Apps',
        status: 'synced',
        lastSync: '1 minute ago',
        recordCount: 12847,
        errorCount: 0,
        severity: 'critical'
      },
      {
        id: 'creator-products',
        name: 'Creator Product Data',
        description: 'Product information between Creator Commerce and Analytics',
        sourceApp: 'Creator Commerce',
        targetApp: 'Analytics Dashboard',
        status: 'mismatch',
        lastSync: '10 minutes ago',
        recordCount: 486,
        errorCount: 23,
        severity: 'medium'
      },
      {
        id: 'project-tasks',
        name: 'Project Task Assignments',
        description: 'Task assignments between Project Manager and Collaboration Hub',
        sourceApp: 'Project Manager',
        targetApp: 'Collaboration Hub',
        status: 'conflict',
        lastSync: '25 minutes ago',
        recordCount: 1203,
        errorCount: 45,
        severity: 'high'
      },
      {
        id: 'validation-reports',
        name: 'Validation Report References',
        description: 'Report data consistency across Validation Nexus and file storage',
        sourceApp: 'Validation Nexus',
        targetApp: 'File Storage',
        status: 'synced',
        lastSync: '3 minutes ago',
        recordCount: 189,
        errorCount: 0,
        severity: 'medium'
      },
      {
        id: 'subscription-usage',
        name: 'Usage Tracking Alignment',
        description: 'Usage data between individual apps and billing system',
        sourceApp: 'All Apps',
        targetApp: 'Subscription System',
        status: 'missing',
        lastSync: '45 minutes ago',
        recordCount: 8954,
        errorCount: 127,
        severity: 'high'
      },
      {
        id: 'brand-assets',
        name: 'Brand Asset References',
        description: 'Brand kit assets between Creator Commerce and file storage',
        sourceApp: 'Creator Commerce',
        targetApp: 'File Storage',
        status: 'synced',
        lastSync: '8 minutes ago',
        recordCount: 342,
        errorCount: 2,
        severity: 'low'
      }
    ];

    setAppConnections(initialConnections);
    setIntegrityChecks(initialChecks);
  }, []);

  const runDataSync = async () => {
    setIsRunningSync(true);
    setSyncProgress(0);

    // Simulate sync process
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setSyncProgress(i);
    }

    // Update some results after sync
    setIntegrityChecks(prev => prev.map(check => ({
      ...check,
      lastSync: 'just now',
      errorCount: Math.max(0, check.errorCount - Math.floor(Math.random() * 10)),
      status: check.status === 'conflict' ? 'mismatch' : check.status === 'missing' ? 'synced' : check.status
    })));

    setAppConnections(prev => prev.map(conn => ({
      ...conn,
      lastSync: 'just now',
      syncHealth: Math.min(100, conn.syncHealth + Math.floor(Math.random() * 10))
    })));

    setIsRunningSync(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'synced':
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'mismatch':
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'conflict':
      case 'missing':
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
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

  const totalErrors = integrityChecks.reduce((sum, check) => sum + check.errorCount, 0);
  const syncedCount = integrityChecks.filter(check => check.status === 'synced').length;
  const issueCount = integrityChecks.filter(check => check.status !== 'synced').length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-2">
          <Database className="w-8 h-8 text-primary" />
          <h1 className="ff-text-gradient">Cross-App Data Validator</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Ensure data consistency and integrity across all FlashFusion applications with real-time synchronization monitoring and conflict resolution.
        </p>
      </motion.div>

      {/* Data Health Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Data Streams</p>
                <p className="text-2xl font-bold text-primary">{appConnections.length}</p>
              </div>
              <Network className="w-8 h-8 text-primary" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-blue-500 border-blue-500">
                All Connected
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Synced Checks</p>
                <p className="text-2xl font-bold text-green-500">{syncedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-green-500 border-green-500">
                Healthy
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Issues Found</p>
                <p className="text-2xl font-bold text-yellow-500">{issueCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                Needs Attention
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Errors</p>
                <p className="text-2xl font-bold text-red-500">{totalErrors}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <div className="mt-2">
              <Badge variant={totalErrors === 0 ? "outline" : "destructive"}>
                {totalErrors === 0 ? 'Clean' : 'Action Required'}
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
          onClick={runDataSync} 
          disabled={isRunningSync}
          className="ff-btn-primary"
          size="lg"
        >
          {isRunningSync ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Syncing... {syncProgress}%
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5 mr-2" />
              Force Data Sync
            </>
          )}
        </Button>

        <Button variant="outline" size="lg">
          <Zap className="w-5 h-5 mr-2" />
          Auto-Resolve Conflicts
        </Button>

        <Button variant="outline" size="lg">
          <Settings className="w-5 h-5 mr-2" />
          Sync Settings
        </Button>

        <Button variant="outline" size="lg">
          <Eye className="w-5 h-5 mr-2" />
          View Data Map
        </Button>
      </motion.div>

      {/* Sync Progress */}
      {isRunningSync && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-5 h-5 text-primary animate-spin" />
                  <span className="font-medium">Synchronizing Data Across Applications</span>
                </div>
                <Progress value={syncProgress} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  Processing integrity checks and resolving conflicts...
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">App Connections</TabsTrigger>
            <TabsTrigger value="integrity">Integrity Checks</TabsTrigger>
            <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
            <TabsTrigger value="schema">Schema Map</TabsTrigger>
          </TabsList>

          {/* App Connections Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appConnections.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="ff-card-interactive">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <app.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{app.name}</h4>
                            <p className="text-sm text-muted-foreground">Last sync: {app.lastSync}</p>
                          </div>
                        </div>
                        {getStatusIcon(app.status)}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Sync Health:</span>
                          <span className="font-medium">{app.syncHealth}%</span>
                        </div>
                        <Progress value={app.syncHealth} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Data Types:</p>
                        <div className="flex flex-wrap gap-1">
                          {app.dataTypes.map((type, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                        <Button size="sm" className="ff-btn-secondary flex-1">
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Sync Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Integrity Checks Tab */}
          <TabsContent value="integrity" className="space-y-6">
            <div className="space-y-4">
              {integrityChecks.map((check, index) => (
                <motion.div
                  key={check.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="ff-card-interactive">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          {getStatusIcon(check.status)}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium">{check.name}</h4>
                              <Badge className={getSeverityColor(check.severity)}>
                                {check.severity.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{check.description}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Source:</span>
                                <p className="font-medium">{check.sourceApp}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Target:</span>
                                <p className="font-medium">{check.targetApp}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Records:</span>
                                <p className="font-medium">{check.recordCount.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Errors:</span>
                                <p className={`font-medium ${check.errorCount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                  {check.errorCount}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            Details
                          </Button>
                          {check.status !== 'synced' && (
                            <Button size="sm" className="ff-btn-primary">
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Fix
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-muted-foreground">
                        <span>Last checked: {check.lastSync}</span>
                        <div className="flex items-center space-x-2">
                          <Link className="w-3 h-3" />
                          <span>{check.sourceApp} ↔ {check.targetApp}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Conflicts Tab */}
          <TabsContent value="conflicts" className="space-y-6">
            <div className="space-y-4">
              {integrityChecks.filter(check => check.status === 'conflict' || check.status === 'mismatch').map((conflict, index) => (
                <motion.div
                  key={conflict.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-yellow-500/20 bg-yellow-500/5">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="w-6 h-6 text-yellow-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-yellow-500">{conflict.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{conflict.description}</p>
                          </div>
                        </div>
                        <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                          {conflict.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium mb-1">Affected Records</p>
                          <p className="text-lg font-bold">{conflict.errorCount}</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium mb-1">Total Records</p>
                          <p className="text-lg font-bold">{conflict.recordCount.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium mb-1">Error Rate</p>
                          <p className="text-lg font-bold">
                            {((conflict.errorCount / conflict.recordCount) * 100).toFixed(2)}%
                          </p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" className="ff-btn-primary">
                          <GitMerge className="w-3 h-3 mr-1" />
                          Auto-Resolve
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          Manual Review
                        </Button>
                        <Button size="sm" variant="outline">
                          <Info className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {integrityChecks.every(check => check.status !== 'conflict' && check.status !== 'mismatch') && (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No Data Conflicts</h3>
                  <p className="text-muted-foreground">All data streams are synchronized and consistent</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Schema Map Tab */}
          <TabsContent value="schema" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-primary" />
                  <span>Data Schema Relationships</span>
                </CardTitle>
                <CardDescription>
                  Visual representation of data relationships across applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                  <div className="text-center space-y-2">
                    <Network className="w-16 h-16 text-muted-foreground mx-auto" />
                    <h3 className="font-medium">Schema Relationship Map</h3>
                    <p className="text-muted-foreground">Interactive data flow visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
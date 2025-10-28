import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Shield,
  Eye,
  Zap,
  Settings,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Cloud,
  CloudOff,
  Wifi,
  WifiOff,
  GitMerge,
  Clock,
  Database,
  Smartphone,
  Monitor,
  Globe,
  Activity,
  FileText,
  Download,
  Upload,
  Layers,
  CheckSquare,
  Square,
  Minus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SyncStatus {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'server';
  lastSync: string;
  status: 'synced' | 'syncing' | 'conflict' | 'offline' | 'failed';
  dataTypes: string[];
  pendingChanges: number;
  conflictCount: number;
  connectionQuality: number;
  storageUsed: number;
  storageCapacity: number;
}

interface DataConflict {
  id: string;
  resourceType: string;
  resourceId: string;
  resourceName: string;
  conflictType: 'version' | 'content' | 'metadata' | 'permission';
  localVersion: string;
  cloudVersion: string;
  lastModified: string;
  modifiedBy: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  autoResolvable: boolean;
  description: string;
}

interface SyncOperation {
  id: string;
  operationType: 'upload' | 'download' | 'merge' | 'resolve';
  resourceType: string;
  resourceName: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  startTime: string;
  estimatedCompletion?: string;
  dataSize: number;
  retryCount: number;
}

interface NetworkMetrics {
  connectionType: 'wifi' | 'cellular' | 'ethernet' | 'offline';
  signalStrength: number;
  bandwidth: number;
  latency: number;
  stability: number;
  dataUsage: number;
}

export function SyncIntegrityChecker() {
  const [isRunningSyncCheck, setIsRunningSyncCheck] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [syncStatuses, setSyncStatuses] = useState<SyncStatus[]>([]);
  const [dataConflicts, setDataConflicts] = useState<DataConflict[]>([]);
  const [syncOperations, setSyncOperations] = useState<SyncOperation[]>([]);
  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetrics>({
    connectionType: 'wifi',
    signalStrength: 95,
    bandwidth: 1200,
    latency: 15,
    stability: 98,
    dataUsage: 45.7
  });
  const [syncMetrics, setSyncMetrics] = useState({
    overallSyncHealth: 91,
    activeDevices: 8,
    pendingConflicts: 3,
    syncedRecords: 24891,
    lastFullSync: '2 hours ago',
    offlineDevices: 1
  });

  // Initialize data
  useEffect(() => {
    const initialSyncStatuses: SyncStatus[] = [
      {
        id: 'device-1',
        deviceId: 'desktop-main',
        deviceName: 'MacBook Pro - Sarah',
        deviceType: 'desktop',
        lastSync: '2 minutes ago',
        status: 'synced',
        dataTypes: ['Projects', 'Documents', 'Settings'],
        pendingChanges: 0,
        conflictCount: 0,
        connectionQuality: 98,
        storageUsed: 2.4,
        storageCapacity: 8.0
      },
      {
        id: 'device-2',
        deviceId: 'mobile-ios',
        deviceName: 'iPhone 15 Pro - Mike',
        deviceType: 'mobile',
        lastSync: '5 minutes ago',
        status: 'conflict',
        dataTypes: ['Notes', 'Tasks', 'Media'],
        pendingChanges: 3,
        conflictCount: 2,
        connectionQuality: 76,
        storageUsed: 1.8,
        storageCapacity: 4.0
      },
      {
        id: 'device-3',
        deviceId: 'tablet-android',
        deviceName: 'Galaxy Tab - Emma',
        deviceType: 'tablet',
        lastSync: '15 minutes ago',
        status: 'syncing',
        dataTypes: ['Designs', 'Assets', 'Prototypes'],
        pendingChanges: 7,
        conflictCount: 0,
        connectionQuality: 89,
        storageUsed: 3.2,
        storageCapacity: 6.0
      },
      {
        id: 'device-4',
        deviceId: 'server-backup',
        deviceName: 'Backup Server',
        deviceType: 'server',
        lastSync: '1 hour ago',
        status: 'offline',
        dataTypes: ['Backups', 'Archives', 'Logs'],
        pendingChanges: 0,
        conflictCount: 0,
        connectionQuality: 0,
        storageUsed: 12.5,
        storageCapacity: 50.0
      }
    ];

    const initialConflicts: DataConflict[] = [
      {
        id: 'conflict-1',
        resourceType: 'Document',
        resourceId: 'doc-123',
        resourceName: 'Project Requirements.md',
        conflictType: 'content',
        localVersion: '1.2.3',
        cloudVersion: '1.2.4',
        lastModified: '8 minutes ago',
        modifiedBy: ['Sarah Chen', 'Mike Rodriguez'],
        severity: 'medium',
        autoResolvable: false,
        description: 'Simultaneous edits to requirements section with overlapping changes'
      },
      {
        id: 'conflict-2',
        resourceType: 'Task',
        resourceId: 'task-456',
        resourceName: 'UI Design Review',
        conflictType: 'metadata',
        localVersion: '2.1.0',
        cloudVersion: '2.0.9',
        lastModified: '12 minutes ago',
        modifiedBy: ['Emma Thompson'],
        severity: 'low',
        autoResolvable: true,
        description: 'Status field mismatch between local and cloud versions'
      },
      {
        id: 'conflict-3',
        resourceType: 'Project',
        resourceId: 'proj-789',
        resourceName: 'Creator Commerce Platform',
        conflictType: 'version',
        localVersion: '3.0.1',
        cloudVersion: '3.0.0',
        lastModified: '25 minutes ago',
        modifiedBy: ['Alex Kim', 'Jordan Liu'],
        severity: 'high',
        autoResolvable: false,
        description: 'Version rollback conflict detected with critical changes'
      }
    ];

    const initialOperations: SyncOperation[] = [
      {
        id: 'op-1',
        operationType: 'upload',
        resourceType: 'Images',
        resourceName: 'Brand Assets Collection',
        status: 'in_progress',
        progress: 67,
        startTime: '3 minutes ago',
        estimatedCompletion: '2 minutes',
        dataSize: 45.2,
        retryCount: 0
      },
      {
        id: 'op-2',
        operationType: 'merge',
        resourceType: 'Document',
        resourceName: 'API Documentation',
        status: 'pending',
        progress: 0,
        startTime: '1 minute ago',
        dataSize: 2.8,
        retryCount: 1
      },
      {
        id: 'op-3',
        operationType: 'download',
        resourceType: 'Templates',
        resourceName: 'Design System Components',
        status: 'completed',
        progress: 100,
        startTime: '15 minutes ago',
        dataSize: 18.9,
        retryCount: 0
      }
    ];

    setSyncStatuses(initialSyncStatuses);
    setDataConflicts(initialConflicts);
    setSyncOperations(initialOperations);
  }, []);

  const runSyncIntegrityCheck = async () => {
    setIsRunningSyncCheck(true);
    setSyncProgress(0);

    // Simulate sync check process
    for (let i = 0; i <= 100; i += 4) {
      await new Promise(resolve => setTimeout(resolve, 120));
      setSyncProgress(i);
    }

    // Update some results after check
    setSyncStatuses(prev => prev.map(status => ({
      ...status,
      lastSync: status.status === 'offline' ? status.lastSync : 'just now',
      connectionQuality: status.status === 'offline' ? 0 : Math.min(100, status.connectionQuality + Math.floor(Math.random() * 8) - 2)
    })));

    setSyncMetrics(prev => ({
      ...prev,
      overallSyncHealth: Math.min(100, prev.overallSyncHealth + Math.floor(Math.random() * 6) - 1)
    }));

    setIsRunningSyncCheck(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'synced':
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'syncing':
      case 'in_progress':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'conflict':
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'offline':
        return <WifiOff className="w-4 h-4 text-gray-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'desktop':
        return <Monitor className="w-4 h-4" />;
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Smartphone className="w-4 h-4" />;
      case 'server':
        return <Database className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getConnectionIcon = (type: string) => {
    switch (type) {
      case 'wifi':
        return <Wifi className="w-4 h-4 text-green-500" />;
      case 'cellular':
        return <Smartphone className="w-4 h-4 text-blue-500" />;
      case 'ethernet':
        return <Globe className="w-4 h-4 text-green-500" />;
      case 'offline':
        return <WifiOff className="w-4 h-4 text-gray-500" />;
      default:
        return <Wifi className="w-4 h-4" />;
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

  const syncedDevices = syncStatuses.filter(status => status.status === 'synced').length;
  const conflictDevices = syncStatuses.filter(status => status.status === 'conflict').length;
  const totalPendingChanges = syncStatuses.reduce((sum, status) => sum + status.pendingChanges, 0);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-2">
          <RefreshCw className="w-8 h-8 text-primary" />
          <h1 className="ff-text-gradient">Sync Integrity Checker</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Comprehensive offline/online data consistency validation with real-time conflict resolution and intelligent merge strategies.
        </p>
      </motion.div>

      {/* Sync Health Overview */}
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
                  <span className="text-2xl font-bold text-primary">
                    {syncMetrics.overallSyncHealth}
                  </span>
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-primary" 
                     style={{ 
                       background: `conic-gradient(from 0deg, var(--ff-primary) 0deg, var(--ff-primary) ${syncMetrics.overallSyncHealth * 3.6}deg, transparent ${syncMetrics.overallSyncHealth * 3.6}deg)`
                     }}
                />
              </div>
              <div>
                <h3 className="font-medium">Sync Health</h3>
                <p className="text-sm text-muted-foreground">Overall synchronization status</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    {networkMetrics.connectionType === 'offline' ? 'Offline Ready' : 'Online'}
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
                <p className="text-sm text-muted-foreground">Synced Devices</p>
                <p className="text-2xl font-bold text-green-500">{syncedDevices}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-green-500 border-green-500">
                Up to Date
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conflicts</p>
                <p className="text-2xl font-bold text-yellow-500">{dataConflicts.length}</p>
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
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-secondary">{totalPendingChanges}</p>
              </div>
              <Clock className="w-8 h-8 text-secondary" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-blue-500 border-blue-500">
                Changes
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Network</p>
                <p className="text-2xl font-bold text-primary">{networkMetrics.signalStrength}%</p>
              </div>
              {getConnectionIcon(networkMetrics.connectionType)}
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-green-500 border-green-500">
                Strong Signal
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
          onClick={runSyncIntegrityCheck} 
          disabled={isRunningSyncCheck}
          className="ff-btn-primary"
          size="lg"
        >
          {isRunningSyncCheck ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Checking... {syncProgress}%
            </>
          ) : (
            <>
              <Shield className="w-5 h-5 mr-2" />
              Check Sync Integrity
            </>
          )}
        </Button>

        <Button variant="outline" size="lg">
          <Zap className="w-5 h-5 mr-2" />
          Force Sync All
        </Button>

        <Button variant="outline" size="lg">
          <GitMerge className="w-5 h-5 mr-2" />
          Auto-Resolve Conflicts
        </Button>

        <Button variant="outline" size="lg">
          <Settings className="w-5 h-5 mr-2" />
          Sync Settings
        </Button>
      </motion.div>

      {/* Sync Check Progress */}
      <AnimatePresence>
        {isRunningSyncCheck && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-primary/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-5 h-5 text-primary animate-spin" />
                    <span className="font-medium">Checking Sync Integrity Across All Devices</span>
                  </div>
                  <Progress value={syncProgress} className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    Validating data consistency, detecting conflicts, and analyzing network status...
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
            <TabsTrigger value="overview">Device Status</TabsTrigger>
            <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
            <TabsTrigger value="operations">Sync Operations</TabsTrigger>
            <TabsTrigger value="network">Network Health</TabsTrigger>
          </TabsList>

          {/* Device Status Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="space-y-4">
              {syncStatuses.map((status, index) => (
                <motion.div
                  key={status.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="ff-card-interactive">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            {getDeviceIcon(status.deviceType)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              {getStatusIcon(status.status)}
                              <h4 className="font-medium">{status.deviceName}</h4>
                              <Badge variant="outline">
                                {status.deviceType.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              Last sync: {status.lastSync} • {status.pendingChanges} pending • {status.conflictCount} conflicts
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Connection Quality</p>
                                <div className="flex items-center space-x-2">
                                  <Progress value={status.connectionQuality} className="h-2 flex-1" />
                                  <span className="text-sm font-medium">
                                    {status.connectionQuality}%
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Storage Used</p>
                                <div className="flex items-center space-x-2">
                                  <Progress value={(status.storageUsed / status.storageCapacity) * 100} className="h-2 flex-1" />
                                  <span className="text-sm font-medium">
                                    {status.storageUsed}GB / {status.storageCapacity}GB
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Data Types</p>
                                <div className="flex flex-wrap gap-1">
                                  {status.dataTypes.slice(0, 2).map((type, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {type}
                                    </Badge>
                                  ))}
                                  {status.dataTypes.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{status.dataTypes.length - 2}
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
                          {status.status === 'conflict' && (
                            <Button size="sm" className="ff-btn-primary">
                              <GitMerge className="w-3 h-3 mr-1" />
                              Resolve
                            </Button>
                          )}
                          {status.status === 'offline' && (
                            <Button size="sm" className="ff-btn-secondary">
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Reconnect
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <span>Device ID: {status.deviceId}</span>
                          <span>Pending: {status.pendingChanges}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Shield className="w-3 h-3" />
                          <span>Encrypted Sync</span>
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
              {dataConflicts.map((conflict, index) => (
                <motion.div
                  key={conflict.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="ff-card-interactive border-yellow-500/20 bg-yellow-500/5">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="w-6 h-6 text-yellow-500 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-medium">{conflict.resourceName}</h4>
                              <Badge className={getSeverityColor(conflict.severity)}>
                                {conflict.severity.toUpperCase()}
                              </Badge>
                              {conflict.autoResolvable && (
                                <Badge variant="outline" className="text-green-500 border-green-500">
                                  AUTO-RESOLVABLE
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{conflict.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-sm font-medium mb-1">Local Version</p>
                                <p className="text-sm">{conflict.localVersion}</p>
                              </div>
                              <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-sm font-medium mb-1">Cloud Version</p>
                                <p className="text-sm">{conflict.cloudVersion}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>Modified by: {conflict.modifiedBy.join(', ')}</span>
                              <span>{conflict.lastModified}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            Compare
                          </Button>
                          <Button size="sm" className="ff-btn-primary">
                            <GitMerge className="w-3 h-3 mr-1" />
                            {conflict.autoResolvable ? 'Auto-Resolve' : 'Manual Resolve'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {dataConflicts.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No Data Conflicts</h3>
                  <p className="text-muted-foreground">All devices are synchronized without conflicts</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Sync Operations Tab */}
          <TabsContent value="operations" className="space-y-6">
            <div className="space-y-4">
              {syncOperations.map((operation, index) => (
                <motion.div
                  key={operation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="ff-card-interactive">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            {operation.operationType === 'upload' ? <Upload className="w-4 h-4" /> :
                             operation.operationType === 'download' ? <Download className="w-4 h-4" /> :
                             operation.operationType === 'merge' ? <GitMerge className="w-4 h-4" /> :
                             <RefreshCw className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              {getStatusIcon(operation.status)}
                              <h4 className="font-medium">{operation.resourceName}</h4>
                              <Badge variant="outline">
                                {operation.operationType.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {operation.resourceType} • {operation.dataSize}MB • Started {operation.startTime}
                            </p>
                            
                            {operation.status === 'in_progress' && (
                              <div className="space-y-2 mb-3">
                                <div className="flex justify-between text-sm">
                                  <span>Progress</span>
                                  <span>{operation.progress}%</span>
                                </div>
                                <Progress value={operation.progress} className="h-2" />
                                {operation.estimatedCompletion && (
                                  <p className="text-xs text-muted-foreground">
                                    Estimated completion: {operation.estimatedCompletion}
                                  </p>
                                )}
                              </div>
                            )}

                            {operation.retryCount > 0 && (
                              <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-3">
                                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                                  Retry attempt: {operation.retryCount}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            Details
                          </Button>
                          {operation.status === 'failed' && (
                            <Button size="sm" className="ff-btn-primary">
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Retry
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

          {/* Network Health Tab */}
          <TabsContent value="network" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {getConnectionIcon(networkMetrics.connectionType)}
                    <span>Network Status</span>
                  </CardTitle>
                  <CardDescription>Current connection metrics and performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Connection Type</p>
                      <p className="font-medium capitalize">{networkMetrics.connectionType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Signal Strength</p>
                      <p className="font-medium">{networkMetrics.signalStrength}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bandwidth</p>
                      <p className="font-medium">{networkMetrics.bandwidth} Mbps</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Latency</p>
                      <p className="font-medium">{networkMetrics.latency}ms</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Network Stability</span>
                      <span>{networkMetrics.stability}%</span>
                    </div>
                    <Progress value={networkMetrics.stability} className="h-2" />
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium mb-1">Data Usage Today</p>
                    <p className="text-sm">{networkMetrics.dataUsage}MB used</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sync Performance</CardTitle>
                  <CardDescription>Historical sync metrics and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                    <div className="text-center space-y-2">
                      <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">Sync performance visualization</p>
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
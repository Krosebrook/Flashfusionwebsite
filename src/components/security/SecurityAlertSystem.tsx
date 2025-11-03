import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  ShieldX,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Eye,
  Bell,
  BellRing,
  Mute,
  Volume2,
  Settings,
  Filter,
  Trash2,
  Archive,
  Play,
  Pause,
  RotateCcw,
  ExternalLink,
  Download
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { SecurityThreat } from './types';

interface SecurityAlert extends SecurityThreat {
  dismissed: boolean;
  escalated: boolean;
  autoResolved: boolean;
  notificationSent: boolean;
}

interface AlertFilter {
  severity: string[];
  type: string[];
  status: string[];
  timeRange: 'all' | '1h' | '24h' | '7d' | '30d';
}

interface SecurityAlertSystemProps {
  alerts?: SecurityAlert[];
  onAlertAction?: (alertId: string, action: string) => void;
  onFilterChange?: (filter: AlertFilter) => void;
  className?: string;
}

const defaultAlerts: SecurityAlert[] = [
  {
    id: 'alert-1',
    type: 'intrusion-attempt',
    severity: 'high',
    title: 'Repeated Authentication Failures',
    description: 'Multiple failed login attempts from IP 192.168.1.100 within 5 minutes',
    source: 'Authentication Monitor',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    status: 'detected',
    affectedAssets: ['Login System', 'User Database'],
    responseTime: 2,
    dismissed: false,
    escalated: false,
    autoResolved: false,
    notificationSent: true
  },
  {
    id: 'alert-2',
    type: 'malware',
    severity: 'critical',
    title: 'Suspicious File Upload Detected',
    description: 'File "script.js" contains potential malicious code patterns',
    source: 'File Scanner',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    status: 'investigating',
    affectedAssets: ['File Storage', 'Upload Service'],
    responseTime: 15,
    dismissed: false,
    escalated: true,
    autoResolved: false,
    notificationSent: true
  },
  {
    id: 'alert-3',
    type: 'data-breach',
    severity: 'medium',
    title: 'Unusual Data Access Pattern',
    description: 'Large amount of user data accessed outside normal business hours',
    source: 'Data Access Monitor',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'mitigated',
    affectedAssets: ['User Database', 'API Gateway'],
    responseTime: 45,
    dismissed: false,
    escalated: false,
    autoResolved: true,
    notificationSent: true
  },
  {
    id: 'alert-4',
    type: 'ddos',
    severity: 'low',
    title: 'Traffic Spike Detected',
    description: 'Elevated request volume from multiple IP addresses',
    source: 'Network Monitor',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    status: 'resolved',
    affectedAssets: ['Load Balancer', 'API Gateway'],
    responseTime: 8,
    dismissed: false,
    escalated: false,
    autoResolved: true,
    notificationSent: false
  }
];

const defaultFilter: AlertFilter = {
  severity: [],
  type: [],
  status: [],
  timeRange: '24h'
};

export function SecurityAlertSystem({ 
  alerts = defaultAlerts, 
  onAlertAction,
  onFilterChange,
  className = '' 
}: SecurityAlertSystemProps) {
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>(alerts);
  const [filter, setFilter] = useState<AlertFilter>(defaultFilter);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set());
  const [showDismissed, setShowDismissed] = useState(false);

  // Auto-refresh alerts
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Simulate new alerts in a real implementation
      const now = new Date();
      const randomAlert: SecurityAlert = {
        id: `alert-${Date.now()}`,
        type: ['intrusion-attempt', 'malware', 'ddos'][Math.floor(Math.random() * 3)] as any,
        severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
        title: 'Real-time Security Event',
        description: 'Automated security detection triggered',
        source: 'Real-time Monitor',
        timestamp: now,
        status: 'detected',
        affectedAssets: ['System'],
        responseTime: 0,
        dismissed: false,
        escalated: false,
        autoResolved: false,
        notificationSent: false
      };

      // Only add new alerts occasionally
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        setSecurityAlerts(prev => [randomAlert, ...prev.slice(0, 19)]);
        
        if (soundEnabled) {
          // Play notification sound (in a real app)
          console.log('🔊 Security alert sound');
        }

        toast.error('New security alert!', {
          description: randomAlert.title
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, soundEnabled]);

  const handleAlertAction = useCallback((alertId: string, action: string) => {
    console.log(`Alert action: ${action} on ${alertId}`);
    
    setSecurityAlerts(prev => 
      prev.map(alert => {
        if (alert.id === alertId) {
          switch (action) {
            case 'dismiss':
              return { ...alert, dismissed: true };
            case 'escalate':
              return { ...alert, escalated: true };
            case 'resolve':
              return { ...alert, status: 'resolved' as any };
            case 'investigate':
              return { ...alert, status: 'investigating' as any };
            default:
              return alert;
          }
        }
        return alert;
      })
    );

    onAlertAction?.(alertId, action);

    toast.success('Alert updated', {
      description: `${action.charAt(0).toUpperCase() + action.slice(1)} action completed`
    });
  }, [onAlertAction]);

  const handleBulkAction = useCallback((action: string) => {
    if (selectedAlerts.size === 0) return;

    selectedAlerts.forEach(alertId => {
      handleAlertAction(alertId, action);
    });

    setSelectedAlerts(new Set());
    
    toast.success(`Bulk ${action} completed`, {
      description: `Applied to ${selectedAlerts.size} alerts`
    });
  }, [selectedAlerts, handleAlertAction]);

  const handleFilterChange = useCallback((newFilter: Partial<AlertFilter>) => {
    const updatedFilter = { ...filter, ...newFilter };
    setFilter(updatedFilter);
    onFilterChange?.(updatedFilter);
  }, [filter, onFilterChange]);

  const filteredAlerts = securityAlerts.filter(alert => {
    // Filter by dismissed status
    if (!showDismissed && alert.dismissed) return false;

    // Filter by severity
    if (filter.severity.length > 0 && !filter.severity.includes(alert.severity)) return false;

    // Filter by type
    if (filter.type.length > 0 && !filter.type.includes(alert.type)) return false;

    // Filter by status
    if (filter.status.length > 0 && !filter.status.includes(alert.status)) return false;

    // Filter by time range
    const now = Date.now();
    const alertTime = alert.timestamp.getTime();
    switch (filter.timeRange) {
      case '1h':
        if (now - alertTime > 60 * 60 * 1000) return false;
        break;
      case '24h':
        if (now - alertTime > 24 * 60 * 60 * 1000) return false;
        break;
      case '7d':
        if (now - alertTime > 7 * 24 * 60 * 60 * 1000) return false;
        break;
      case '30d':
        if (now - alertTime > 30 * 24 * 60 * 60 * 1000) return false;
        break;
    }

    return true;
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <ShieldX className="h-4 w-4 text-destructive" />;
      case 'high': return <ShieldAlert className="h-4 w-4 text-warning" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'low': return <Shield className="h-4 w-4 text-info" />;
      default: return <Shield className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'mitigated': return <ShieldCheck className="h-4 w-4 text-success" />;
      case 'investigating': return <Clock className="h-4 w-4 text-warning" />;
      case 'detected': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const severityCount = {
    critical: filteredAlerts.filter(a => a.severity === 'critical').length,
    high: filteredAlerts.filter(a => a.severity === 'high').length,
    medium: filteredAlerts.filter(a => a.severity === 'medium').length,
    low: filteredAlerts.filter(a => a.severity === 'low').length
  };

  return (
    <div className={`space-y-6 ff-stagger-fade ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="ff-text-2xl font-bold text-foreground font-sora">
            Security Alert System
          </h2>
          <p className="ff-text-base text-muted-foreground font-inter">
            Real-time security monitoring and incident response
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="ff-focus-ring"
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 mr-2" />
            ) : (
              <Mute className="h-4 w-4 mr-2" />
            )}
            Sound {soundEnabled ? 'On' : 'Off'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="ff-focus-ring"
          >
            {autoRefresh ? (
              <Pause className="h-4 w-4 mr-2" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Auto-refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="ff-focus-ring"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="ff-hover-lift">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <ShieldX className="h-8 w-8 text-destructive" />
              <div>
                <p className="ff-text-lg font-bold font-sora">{severityCount.critical}</p>
                <p className="ff-text-xs text-muted-foreground font-inter">Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-hover-lift">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-8 w-8 text-warning" />
              <div>
                <p className="ff-text-lg font-bold font-sora">{severityCount.high}</p>
                <p className="ff-text-xs text-muted-foreground font-inter">High</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-hover-lift">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-warning" />
              <div>
                <p className="ff-text-lg font-bold font-sora">{severityCount.medium}</p>
                <p className="ff-text-xs text-muted-foreground font-inter">Medium</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-hover-lift">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-info" />
              <div>
                <p className="ff-text-lg font-bold font-sora">{severityCount.low}</p>
                <p className="ff-text-xs text-muted-foreground font-inter">Low</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card className="ff-card-interactive">
        <CardHeader>
          <CardTitle className="font-sora flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Filters & Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="ff-text-sm font-semibold font-sora">Time Range:</label>
              <select 
                value={filter.timeRange}
                onChange={(e) => handleFilterChange({ timeRange: e.target.value as any })}
                className="px-3 py-1 border rounded ff-focus-ring bg-background"
              >
                <option value="all">All Time</option>
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="show-dismissed"
                checked={showDismissed}
                onChange={(e) => setShowDismissed(e.target.checked)}
                className="ff-focus-ring"
              />
              <label htmlFor="show-dismissed" className="ff-text-sm font-inter">
                Show Dismissed
              </label>
            </div>

            {selectedAlerts.size > 0 && (
              <div className="flex items-center gap-2 ml-auto">
                <span className="ff-text-sm text-muted-foreground font-inter">
                  {selectedAlerts.size} selected
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('dismiss')}
                  className="ff-text-xs"
                >
                  Dismiss All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('resolve')}
                  className="ff-text-xs"
                >
                  Resolve All
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Alert List */}
      <Card className="ff-card-interactive">
        <CardHeader>
          <CardTitle className="font-sora flex items-center gap-2">
            <BellRing className="h-5 w-5 text-primary" />
            Active Alerts ({filteredAlerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-8">
              <ShieldCheck className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="ff-text-lg font-semibold font-sora">No Active Alerts</h3>
              <p className="ff-text-sm text-muted-foreground font-inter">
                Your system is secure. All alerts have been addressed.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 border rounded-lg ff-hover-lift transition-all ${
                    alert.dismissed ? 'opacity-60' : ''
                  } ${selectedAlerts.has(alert.id) ? 'ring-2 ring-primary' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedAlerts.has(alert.id)}
                      onChange={(e) => {
                        const newSelected = new Set(selectedAlerts);
                        if (e.target.checked) {
                          newSelected.add(alert.id);
                        } else {
                          newSelected.delete(alert.id);
                        }
                        setSelectedAlerts(newSelected);
                      }}
                      className="mt-1 ff-focus-ring"
                    />

                    <div className="flex-shrink-0 mt-1">
                      {getSeverityIcon(alert.severity)}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h4 className="ff-text-sm font-semibold font-sora flex items-center gap-2">
                            {alert.title}
                            {alert.escalated && (
                              <Badge variant="destructive" className="ff-text-xs">
                                Escalated
                              </Badge>
                            )}
                            {alert.autoResolved && (
                              <Badge variant="outline" className="ff-text-xs">
                                Auto-resolved
                              </Badge>
                            )}
                          </h4>
                          <p className="ff-text-xs text-muted-foreground font-inter">
                            {alert.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant={getSeverityColor(alert.severity) as any}>
                            {alert.severity}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(alert.status)}
                            <span className="ff-text-xs capitalize font-inter">
                              {alert.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between ff-text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="font-inter">Source: {alert.source}</span>
                          <span className="font-inter">
                            Assets: {alert.affectedAssets.join(', ')}
                          </span>
                          <span className="font-inter">
                            Response: {alert.responseTime}min
                          </span>
                        </div>
                        <span className="font-inter">
                          {alert.timestamp.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        {!alert.dismissed && alert.status !== 'resolved' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAlertAction(alert.id, 'investigate')}
                              className="ff-text-xs ff-hover-scale"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Investigate
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAlertAction(alert.id, 'resolve')}
                              className="ff-text-xs ff-hover-scale"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Resolve
                            </Button>

                            {!alert.escalated && alert.severity !== 'low' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAlertAction(alert.id, 'escalate')}
                                className="ff-text-xs ff-hover-scale"
                              >
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Escalate
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAlertAction(alert.id, 'dismiss')}
                              className="ff-text-xs ff-hover-scale"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Dismiss
                            </Button>
                          </>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          className="ff-text-xs ff-hover-scale ml-auto"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default SecurityAlertSystem;
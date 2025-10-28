import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Eye, Zap, RefreshCw, CheckCircle, TrendingUp, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';
import type { SystemMetric, ErrorLog, PerformanceMetric, Incident } from './types';
import { 
  getStatusIcon, 
  getCategoryIcon, 
  getTrendIcon, 
  getStatusIconProps, 
  getCategoryIconProps, 
  getTrendIconProps 
} from './utils';

interface MetricCardProps {
  metric: SystemMetric;
  index: number;
}

export function MetricCard({ metric, index }: MetricCardProps) {
  const StatusIcon = getStatusIcon(metric.status);
  const CategoryIcon = getCategoryIcon(metric.category);
  const TrendIcon = getTrendIcon(metric.trend);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="ff-card-interactive">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CategoryIcon {...getCategoryIconProps(metric.category)} />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <StatusIcon {...getStatusIconProps(metric.status)} />
                  <h4 className="font-medium">{metric.name}</h4>
                  <div className="flex items-center space-x-1">
                    <TrendIcon {...getTrendIconProps(metric.trend)} />
                    <span className="text-sm font-medium">{metric.value}{metric.unit}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{metric.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Threshold: {metric.threshold.warning}{metric.unit} / {metric.threshold.critical}{metric.unit}</span>
                    <span>Updated: {metric.lastUpdate}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <Eye className="w-3 h-3 mr-1" />
                Monitor
              </Button>
              {metric.status !== 'healthy' && (
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
  );
}

interface ErrorLogCardProps {
  error: ErrorLog;
  index: number;
}

export function ErrorLogCard({ error, index }: ErrorLogCardProps) {
  const StatusIcon = getStatusIcon(error.resolved ? 'resolved' : error.level);
  const CategoryIcon = getCategoryIcon(error.category);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`ff-card-interactive ${
        error.level === 'error' && !error.resolved ? 'border-red-500/20 bg-red-500/5' :
        error.level === 'warning' ? 'border-yellow-500/20 bg-yellow-500/5' :
        'border-green-500/20 bg-green-500/5'
      }`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CategoryIcon {...getCategoryIconProps(error.category)} />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <StatusIcon {...getStatusIconProps(error.resolved ? 'resolved' : error.level)} />
                  <h4 className="font-medium">{error.service}</h4>
                  <Badge variant={error.resolved ? "outline" : "destructive"}>
                    {error.level.toUpperCase()}
                  </Badge>
                  {error.count > 1 && (
                    <Badge variant="secondary">
                      {error.count}x
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{error.message}</p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{error.timestamp}</span>
                  {error.userId && <span>User: {error.userId}</span>}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <Eye className="w-3 h-3 mr-1" />
                Details
              </Button>
              {!error.resolved && (
                <Button size="sm" className="ff-btn-primary">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Resolve
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface PerformanceCardProps {
  metric: PerformanceMetric;
  index: number;
}

export function PerformanceCard({ metric, index }: PerformanceCardProps) {
  const StatusIcon = getStatusIcon(metric.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="ff-card-interactive">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <StatusIcon {...getStatusIconProps(metric.status)} />
              <h4 className="font-medium">{metric.name}</h4>
            </div>
            <Badge className={
              metric.status === 'excellent' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
              metric.status === 'good' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
              'bg-red-500/10 text-red-500 border-red-500/20'
            }>
              {metric.status.toUpperCase()}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Current: {metric.value}{metric.unit}</span>
              <span>Benchmark: {metric.benchmark}{metric.unit}</span>
            </div>
            <Progress value={(metric.benchmark - metric.value) / metric.benchmark * 100} className="h-2" />
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Suggestions:</p>
            <ul className="text-sm space-y-1">
              {metric.suggestions.map((suggestion, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface IncidentCardProps {
  incident: Incident;
  index: number;
}

export function IncidentCard({ incident, index }: IncidentCardProps) {
  const StatusIcon = getStatusIcon(incident.status);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`ff-card-interactive ${
        incident.severity === 'critical' ? 'border-red-500/20 bg-red-500/5' :
        incident.severity === 'high' ? 'border-orange-500/20 bg-orange-500/5' :
        incident.severity === 'medium' ? 'border-yellow-500/20 bg-yellow-500/5' :
        'border-blue-500/20 bg-blue-500/5'
      }`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <StatusIcon {...getStatusIconProps(incident.status)} />
                <h4 className="font-medium">{incident.title}</h4>
                <Badge className={
                  incident.severity === 'critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                  incident.severity === 'high' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                  incident.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                  'bg-blue-500/10 text-blue-500 border-blue-500/20'
                }>
                  {incident.severity.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{incident.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium mb-1">Affected Services:</p>
                  <div className="flex flex-wrap gap-1">
                    {incident.affectedServices.map((service, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Timeline:</p>
                  <p className="text-sm">Started: {incident.startTime}</p>
                  {incident.resolvedTime && (
                    <p className="text-sm">Resolved: {incident.resolvedTime}</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Recent Updates:</p>
                <div className="space-y-2">
                  {incident.updates.slice(0, 2).map((update) => (
                    <div key={update.id} className="p-2 bg-muted/50 rounded-lg">
                      <p className="text-sm">{update.message}</p>
                      <p className="text-xs text-muted-foreground">{update.timestamp}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
              {incident.status !== 'resolved' && (
                <Button size="sm" className="ff-btn-primary">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Update
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function TrendsPlaceholder() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>System Performance Trends</CardTitle>
          <CardDescription>Performance metrics over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
            <div className="text-center space-y-2">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">Performance trends visualization</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Error Rate Analysis</CardTitle>
          <CardDescription>Error patterns and resolution metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
            <div className="text-center space-y-2">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">Error analytics visualization</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
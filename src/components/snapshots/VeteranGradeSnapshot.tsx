/**
 * @fileoverview Veteran Grade Snapshot Component
 * @category components
 * @version 1.0.0
 * @author FlashFusion Team
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert } from '../ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Download, 
  RefreshCw,
  Award,
  Target,
  Shield,
  Zap,
  Users,
  Rocket
} from 'lucide-react';
import { VeteranGradeSnapshotService } from '../../services/VeteranGradeSnapshotService';
import type { 
  VeteranGradeSnapshot, 
  MetricData,
  GradeLevel,
  MetricStatus,
  MetricCategory 
} from '../../types/veteranGrade';

interface VeteranGradeSnapshotProps {
  userId: string;
  autoLoad?: boolean;
}

export function VeteranGradeSnapshotComponent({ userId, autoLoad = true }: VeteranGradeSnapshotProps) {
  const [snapshot, setSnapshot] = useState<VeteranGradeSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (autoLoad) {
      loadSnapshot();
    }
  }, [userId, autoLoad]);

  const loadSnapshot = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Try to get latest snapshot first
      const latest = await VeteranGradeSnapshotService.getLatestSnapshot(userId);
      
      if (latest) {
        setSnapshot(latest);
      } else {
        // If no snapshot exists, create one
        await createNewSnapshot();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load snapshot');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewSnapshot = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await VeteranGradeSnapshotService.createSnapshot({
        userId,
        experienceLevel: 'veteran',
        includeHistory: true,
        source: 'manual'
      });

      if (response.success && response.snapshot) {
        setSnapshot(response.snapshot);
      } else {
        setError(response.error || 'Failed to create snapshot');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create snapshot');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadSnapshot = () => {
    if (!snapshot) return;

    const dataStr = JSON.stringify(snapshot, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `veteran-grade-snapshot-${snapshot.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getGradeColor = (grade: GradeLevel): string => {
    const colors: Record<GradeLevel, string> = {
      'A+': 'from-green-500 to-emerald-500',
      'A': 'from-green-500 to-green-600',
      'B+': 'from-blue-500 to-cyan-500',
      'B': 'from-blue-500 to-blue-600',
      'C': 'from-yellow-500 to-orange-500',
      'D': 'from-orange-500 to-red-500',
      'F': 'from-red-500 to-red-600'
    };
    return colors[grade];
  };

  const getStatusBadgeClass = (status: MetricStatus): string => {
    const classes: Record<MetricStatus, string> = {
      'excellent': 'bg-green-500 text-white',
      'very-good': 'bg-green-400 text-white',
      'good': 'bg-blue-500 text-white',
      'fair': 'bg-yellow-500 text-white',
      'needs-improvement': 'bg-orange-500 text-white',
      'poor': 'bg-red-500 text-white'
    };
    return classes[status];
  };

  const getCategoryIcon = (category: MetricCategory) => {
    const icons: Record<MetricCategory, React.ElementType> = {
      'performance': Zap,
      'optimization': Target,
      'code-quality': Award,
      'deployment': Rocket,
      'collaboration': Users,
      'security': Shield
    };
    return icons[category];
  };

  const getTrendIcon = (trend?: 'improving' | 'stable' | 'declining') => {
    if (!trend) return null;
    
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <p>{error}</p>
        <Button onClick={loadSnapshot} className="mt-2">
          Retry
        </Button>
      </Alert>
    );
  }

  if (isLoading && !snapshot) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading veteran grade snapshot...</span>
      </div>
    );
  }

  if (!snapshot) {
    return (
      <div className="text-center p-8">
        <p className="mb-4">No veteran grade snapshot available</p>
        <Button onClick={createNewSnapshot}>
          Create Snapshot
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Overall Grade */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              Veteran Grade Snapshot
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadSnapshot}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={createNewSnapshot}
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            {/* Overall Grade Display */}
            <div className={`w-32 h-32 bg-gradient-to-br ${getGradeColor(snapshot.overallGrade)} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
              <div className="text-center">
                <div className="text-4xl font-bold">{snapshot.overallGrade}</div>
                <div className="text-sm">{snapshot.overallScore}/100</div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Overall Status</p>
                <p className="text-lg font-semibold capitalize">{snapshot.overallStatus.replace('-', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Experience Level</p>
                <p className="text-lg font-semibold capitalize">{snapshot.experienceLevel}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Metrics</p>
                <p className="text-lg font-semibold">{snapshot.summary.totalMetrics}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Snapshot Date</p>
                <p className="text-lg font-semibold">
                  {snapshot.timestamp.toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Trend Indicator */}
            {snapshot.comparison && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Trend</p>
                <div className="flex items-center gap-2">
                  {getTrendIcon(snapshot.comparison.trend)}
                  <span className={`text-lg font-semibold ${
                    snapshot.comparison.scoreDelta! > 0 ? 'text-green-500' :
                    snapshot.comparison.scoreDelta! < 0 ? 'text-red-500' :
                    'text-gray-500'
                  }`}>
                    {snapshot.comparison.scoreDelta! > 0 ? '+' : ''}
                    {snapshot.comparison.scoreDelta}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Metrics Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Metrics Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {snapshot.metrics.map((metric) => {
              const IconComponent = getCategoryIcon(metric.category);
              
              return (
                <div
                  key={metric.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold">{metric.name}</h4>
                    </div>
                    <Badge className={getStatusBadgeClass(metric.status)}>
                      {metric.grade}
                    </Badge>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Score</span>
                      <span className="font-semibold">{metric.score}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${getGradeColor(metric.grade)}`}
                        style={{ width: `${metric.score}%` }}
                      />
                    </div>
                  </div>
                  
                  {metric.details && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {metric.details}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Summary Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {snapshot.summary.excellentCount}
              </p>
              <p className="text-sm text-muted-foreground">Excellent/Very Good</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {snapshot.summary.goodCount}
              </p>
              <p className="text-sm text-muted-foreground">Good/Fair</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">
                {snapshot.summary.needsImprovementCount}
              </p>
              <p className="text-sm text-muted-foreground">Needs Improvement</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {snapshot.summary.averageScore}
              </p>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default VeteranGradeSnapshotComponent;

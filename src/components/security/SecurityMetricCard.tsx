import React from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  RefreshCw
} from 'lucide-react';
import { SecurityMetric } from './types';
import { getScoreColor, formatTimeAgo } from './utils';

interface SecurityMetricCardProps {
  metric: SecurityMetric;
  onRefresh?: (metricId: string) => void;
}

export function SecurityMetricCard({ metric, onRefresh }: SecurityMetricCardProps) {
  const scoreColor = getScoreColor(metric.score);
  
  const getTrendIcon = () => {
    switch (metric.trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Minus;
    }
  };

  const getStatusIcon = () => {
    switch (metric.status) {
      case 'secure': return CheckCircle2;
      case 'warning': return AlertTriangle;
      case 'critical': return XCircle;
      default: return AlertTriangle;
    }
  };

  const TrendIcon = getTrendIcon();
  const StatusIcon = getStatusIcon();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="relative overflow-hidden transition-all duration-300 hover:shadow-lg"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${scoreColor}20`
        }}
      >
        {/* Score indicator bar */}
        <div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: scoreColor }}
        />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${scoreColor}15` }}
              >
                <StatusIcon className="h-5 w-5" style={{ color: scoreColor }} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{metric.name}</h3>
                <Badge 
                  className="text-xs mt-1 capitalize"
                  style={{
                    backgroundColor: `${scoreColor}15`,
                    color: scoreColor,
                    border: `1px solid ${scoreColor}30`
                  }}
                >
                  {metric.status}
                </Badge>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: scoreColor }}>
                {metric.score}
              </div>
              <div className="text-xs text-gray-500">Score</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <Progress 
              value={metric.score} 
              className="h-2"
              style={{ 
                backgroundColor: `${scoreColor}20`,
              }}
            />
          </div>

          {/* Details */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              {metric.details}
            </p>
          </div>

          {/* Trend and Last Checked */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendIcon 
                className="h-4 w-4" 
                style={{ 
                  color: metric.trend === 'up' ? '#10B981' : 
                         metric.trend === 'down' ? '#EF4444' : '#6B7280' 
                }}
              />
              <span className="text-sm text-gray-600 capitalize">
                {metric.trend === 'stable' ? 'Stable' : `Trending ${metric.trend}`}
              </span>
            </div>

            <div className="text-xs text-gray-500">
              {formatTimeAgo(metric.lastChecked)}
            </div>
          </div>

          {/* Recommendations */}
          {metric.recommendations && metric.recommendations.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendations</h4>
              <ul className="list-disc list-inside space-y-1">
                {metric.recommendations.slice(0, 2).map((rec, index) => (
                  <li key={index} className="text-xs text-gray-600">{rec}</li>
                ))}
                {metric.recommendations.length > 2 && (
                  <li className="text-xs text-gray-500">
                    +{metric.recommendations.length - 2} more...
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => onRefresh?.(metric.id)}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
            <Button size="sm" variant="outline">
              Details
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
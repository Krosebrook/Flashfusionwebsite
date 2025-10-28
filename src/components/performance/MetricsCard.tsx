import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { PerformanceMetric } from './types';
import { getMetricScore, getTrendIcon, getStatusColor } from './utils';

interface MetricsCardProps {
  metrics: PerformanceMetric[];
}

export function MetricsCard({ metrics }: MetricsCardProps) {
  const getTrendIconComponent = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />;
      case 'stable': return <Minus className="h-4 w-4 text-gray-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => {
        const score = getMetricScore(metric);
        return (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 ff-card-interactive">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{metric.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {metric.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIconComponent(metric.trend)}
                    <Badge 
                      variant={metric.status === 'good' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {metric.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                        {metric.value}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">
                        {metric.unit}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Target</div>
                      <div className="text-sm font-medium">
                        {metric.target}{metric.unit}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Performance Score</span>
                      <span className={getStatusColor(metric.status)}>
                        {Math.round(score)}/100
                      </span>
                    </div>
                    <Progress 
                      value={score} 
                      className={`h-2 ${
                        metric.status === 'good' ? '[&>div]:bg-green-500' :
                        metric.status === 'needs-improvement' ? '[&>div]:bg-yellow-500' :
                        '[&>div]:bg-red-500'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
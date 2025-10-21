import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { 
  Zap, Gauge, Brain, AlertTriangle, CheckCircle,
  TrendingUp, BarChart3, Settings
} from 'lucide-react';

// Import our modular components and utilities
import { MetricsCard } from './MetricsCard';
import { OptimizationSuggestions } from './OptimizationSuggestions';
import { PerformanceMetric, OptimizationSuggestion, BundleAnalysis, OptimizationSettings } from './types';
import { 
  MOCK_PERFORMANCE_METRICS, 
  MOCK_OPTIMIZATION_SUGGESTIONS, 
  MOCK_BUNDLE_ANALYSIS 
} from './constants';
import { getOverallScore, formatBytes, calculatePotentialSavings } from './utils';

interface PerformanceOptimizerProps {
  projectId: string;
}

export function PerformanceOptimizer({ projectId }: PerformanceOptimizerProps) {
  const [activeTab, setActiveTab] = useState('metrics');
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [bundleAnalysis, setBundleAnalysis] = useState<BundleAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [optimizationSettings, setOptimizationSettings] = useState<OptimizationSettings>({
    codeSplitting: true,
    imageOptimization: true,
    caching: true,
    compression: true,
    prefetching: false,
    serviceWorker: false
  });

  useEffect(() => {
    loadPerformanceData();
  }, [projectId]);

  const loadPerformanceData = async () => {
    setIsAnalyzing(true);
    try {
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMetrics(MOCK_PERFORMANCE_METRICS);
      setSuggestions(MOCK_OPTIMIZATION_SUGGESTIONS);
      setBundleAnalysis(MOCK_BUNDLE_ANALYSIS);
    } catch (error) {
      console.error('Error loading performance data:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImplementSuggestion = (suggestionId: string) => {
    setSuggestions(prev => 
      prev.map(suggestion => 
        suggestion.id === suggestionId 
          ? { ...suggestion, isImplemented: true }
          : suggestion
      )
    );
  };

  const handleRunAudit = async () => {
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      await loadPerformanceData();
    } catch (error) {
      console.error('Error running audit:', error);
    }
  };

  const overallScore = getOverallScore(metrics);
  const potentialSavings = calculatePotentialSavings(suggestions);

  if (isAnalyzing) {
    return (
      <Card className="p-8">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="h-12 w-12 text-primary mx-auto" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Performance Analysis in Progress</h3>
            <p className="text-muted-foreground mb-4">
              Analyzing your application's performance metrics and identifying optimization opportunities...
            </p>
            <Progress value={65} className="w-64 mx-auto" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Gauge className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${
                overallScore >= 90 ? 'text-green-500' :
                overallScore >= 70 ? 'text-yellow-500' :
                'text-red-500'
              }`}>
                {overallScore}
              </p>
              <p className="text-sm text-muted-foreground">Overall Score</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{suggestions.filter(s => !s.isImplemented).length}</p>
              <p className="text-sm text-muted-foreground">Issues Found</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{suggestions.filter(s => s.autoImplementable && !s.isImplemented).length}</p>
              <p className="text-sm text-muted-foreground">Auto-fixable</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{potentialSavings.loadTime}%</p>
              <p className="text-sm text-muted-foreground">Potential Improvement</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Analysis Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
            <TabsTrigger value="suggestions">Optimizations</TabsTrigger>
            <TabsTrigger value="bundle">Bundle Analysis</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <Button onClick={handleRunAudit} className="ff-btn-primary">
            <BarChart3 className="h-4 w-4 mr-2" />
            Run New Audit
          </Button>
        </div>

        <TabsContent value="metrics" className="space-y-6">
          <MetricsCard metrics={metrics} />
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-6">
          <OptimizationSuggestions 
            suggestions={suggestions}
            onImplement={handleImplementSuggestion}
          />
        </TabsContent>

        <TabsContent value="bundle" className="space-y-6">
          {bundleAnalysis && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bundle Overview */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Bundle Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Size</span>
                    <span className="font-medium">{formatBytes(bundleAnalysis.totalSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gzipped</span>
                    <span className="font-medium">{formatBytes(bundleAnalysis.gzippedSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compression Ratio</span>
                    <span className="font-medium">
                      {Math.round((bundleAnalysis.gzippedSize / bundleAnalysis.totalSize) * 100)}%
                    </span>
                  </div>
                </div>
              </Card>

              {/* Chunk Analysis */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Chunk Breakdown</h3>
                <div className="space-y-3">
                  {bundleAnalysis.chunks.map((chunk) => (
                    <div key={chunk.name} className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{chunk.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({chunk.modules} modules)
                        </span>
                      </div>
                      <span className="text-sm">{formatBytes(chunk.size)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Optimization Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(optimizationSettings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {key === 'codeSplitting' && 'Split code into smaller chunks for faster loading'}
                      {key === 'imageOptimization' && 'Automatically optimize and compress images'}
                      {key === 'caching' && 'Enable aggressive caching strategies'}
                      {key === 'compression' && 'Enable gzip/brotli compression'}
                      {key === 'prefetching' && 'Prefetch resources for faster navigation'}
                      {key === 'serviceWorker' && 'Use service worker for offline caching'}
                    </p>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => 
                      setOptimizationSettings(prev => ({ ...prev, [key]: checked }))
                    }
                  />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
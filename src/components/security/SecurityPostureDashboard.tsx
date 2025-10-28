import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { 
  Shield,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  FileText,
  Settings,
  Download,
  RefreshCw,
  BarChart3,
  Activity,
  Key,
  Eye
} from 'lucide-react';

// Import our modular components and utilities
import { SecurityMetricCard } from './SecurityMetricCard';
import { SecurityThreatCard } from './SecurityThreatCard';
import { 
  SECURITY_METRICS, 
  SECURITY_THREATS, 
  COMPLIANCE_FRAMEWORKS, 
  ACCESS_TOKENS 
} from './constants';
import { 
  getSecurityOverview, 
  getScoreColor, 
  sortThreatsBySeverity,
  categorizeTokensByRisk,
  generateSecurityRecommendations
} from './utils';

export function SecurityPostureDashboard() {
  const [metrics, setMetrics] = useState(SECURITY_METRICS);
  const [threats, setThreats] = useState(SECURITY_THREATS);
  const [frameworks] = useState(COMPLIANCE_FRAMEWORKS);
  const [tokens] = useState(ACCESS_TOKENS);
  const [activeTab, setActiveTab] = useState<'overview' | 'threats' | 'compliance' | 'tokens'>('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const overview = getSecurityOverview(metrics, threats, frameworks, tokens);
  const sortedThreats = sortThreatsBySeverity(threats);
  const tokensByRisk = categorizeTokensByRisk(tokens);
  const recommendations = generateSecurityRecommendations(metrics);

  const handleRefreshMetric = (metricId: string) => {
    // Simulate refresh - in real app this would call API
    setMetrics(prev => prev.map(m => 
      m.id === metricId 
        ? { ...m, lastChecked: new Date(), score: Math.min(100, m.score + Math.random() * 5) }
        : m
    ));
  };

  const handleInvestigateThreat = (threatId: string) => {
    setThreats(prev => prev.map(t => 
      t.id === threatId ? { ...t, status: 'investigating' as const } : t
    ));
  };

  const handleResolveThreat = (threatId: string) => {
    setThreats(prev => prev.map(t => 
      t.id === threatId ? { ...t, status: 'resolved' as const } : t
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Security Posture Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor security metrics, threats, and compliance across your infrastructure
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            <span className="text-sm text-gray-600">Auto-refresh</span>
          </div>
          
          <Badge 
            className="text-lg px-4 py-2"
            style={{
              backgroundColor: `${getScoreColor(overview.overallScore)}15`,
              color: getScoreColor(overview.overallScore),
              border: `1px solid ${getScoreColor(overview.overallScore)}30`
            }}
          >
            <Shield className="h-5 w-5 mr-2" />
            {overview.overallScore}% Secure
          </Badge>
        </div>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{overview.overallScore}%</div>
          <div className="text-sm text-gray-600">Security Score</div>
          <Progress value={overview.overallScore} className="mt-2" />
        </Card>
        
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-red-600">{overview.totalThreats}</div>
          <div className="text-sm text-gray-600">Active Threats</div>
          <div className="text-xs text-gray-500 mt-1">
            {overview.resolvedThreats} resolved
          </div>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{overview.complianceScore}%</div>
          <div className="text-sm text-gray-600">Compliance</div>
          <div className="text-xs text-gray-500 mt-1">
            {frameworks.length} frameworks
          </div>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">{overview.activeTokens}</div>
          <div className="text-sm text-gray-600">Active Tokens</div>
          <div className="text-xs text-gray-500 mt-1">
            {tokensByRisk.high.length} high risk
          </div>
        </Card>
      </div>

      {/* Quick Recommendations */}
      {recommendations.length > 0 && (
        <Card className="p-6" style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-500 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Security Recommendations</h3>
              <ul className="list-disc list-inside space-y-1">
                {recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-700">{rec}</li>
                ))}
              </ul>
            </div>
            <Button size="sm" className="ff-btn-primary">
              View All
            </Button>
          </div>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="threats">Threats</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="tokens">Access Tokens</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {metrics.map((metric) => (
              <SecurityMetricCard 
                key={metric.id} 
                metric={metric} 
                onRefresh={handleRefreshMetric}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Security Threats</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {sortedThreats.map((threat) => (
              <SecurityThreatCard 
                key={threat.id} 
                threat={threat}
                onInvestigate={handleInvestigateThreat}
                onResolve={handleResolveThreat}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {frameworks.map((framework) => (
              <Card key={framework.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{framework.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{framework.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ 
                      color: getScoreColor(framework.overallCompliance) 
                    }}>
                      {framework.overallCompliance}%
                    </div>
                    <div className="text-xs text-gray-500">Compliant</div>
                  </div>
                </div>

                <Progress value={framework.overallCompliance} className="mb-4" />

                {framework.certification && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Certification Status</span>
                      <Badge className={
                        framework.certification.status === 'certified' ? 'bg-green-100 text-green-700' :
                        framework.certification.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }>
                        {framework.certification.status}
                      </Badge>
                    </div>
                    {framework.certification.validUntil && (
                      <div className="text-xs text-gray-500 mt-1">
                        Valid until: {framework.certification.validUntil.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  {framework.requirements.slice(0, 3).map((req) => (
                    <div key={req.id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{req.title}</span>
                      <Badge className={
                        req.status === 'compliant' ? 'bg-green-100 text-green-700' :
                        req.status === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                        req.status === 'non-compliant' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }>
                        {req.status}
                      </Badge>
                    </div>
                  ))}
                  {framework.requirements.length > 3 && (
                    <div className="text-center">
                      <Button variant="ghost" size="sm" className="text-xs">
                        +{framework.requirements.length - 3} more requirements
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Object.entries(tokensByRisk).map(([riskLevel, tokenList]) => (
              <Card key={riskLevel} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold capitalize">{riskLevel} Risk</h3>
                  <Badge className={
                    riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                    riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }>
                    {tokenList.length} tokens
                  </Badge>
                </div>

                <div className="space-y-3">
                  {tokenList.map((token) => (
                    <div key={token.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium text-sm">{token.name}</div>
                          <div className="text-xs text-gray-500 capitalize">{token.type}</div>
                        </div>
                        <Badge className={
                          token.status === 'active' ? 'bg-green-100 text-green-700' :
                          token.status === 'expired' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }>
                          {token.status}
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        {token.lastUsed ? `Used ${new Date(token.lastUsed).toLocaleDateString()}` : 'Never used'}
                      </div>
                      
                      <div className="flex space-x-2 mt-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
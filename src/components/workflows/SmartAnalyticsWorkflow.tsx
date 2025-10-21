import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { CheckCircle, BarChart3, TrendingUp, Users, DollarSign, Eye, Zap, Target, Brain, ArrowRight, Activity, PieChart } from 'lucide-react';

interface SmartAnalyticsWorkflowProps {
  onComplete?: () => void;
}

export function SmartAnalyticsWorkflow({ onComplete }: SmartAnalyticsWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [analyticsSetup, setAnalyticsSetup] = useState<any>({});
  const [setupProgress, setSetupProgress] = useState(0);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [analyticsResults, setAnalyticsResults] = useState<any>(null);

  const analyticsMetrics = [
    {
      id: 'performance',
      name: 'Performance Analytics',
      description: 'Track user experience and technical performance metrics',
      icon: Activity,
      category: 'technical',
      priority: 'critical',
      features: ['Core Web Vitals', 'Loading times', 'Error tracking', 'Performance scores'],
      kpis: ['Page load time', 'First contentful paint', 'Cumulative layout shift', 'Error rate'],
      recommended: true
    },
    {
      id: 'user-behavior',
      name: 'User Behavior Analytics',
      description: 'Understand how users interact with your platform',
      icon: Users,
      category: 'behavioral',
      priority: 'critical',
      features: ['User journeys', 'Heatmaps', 'Session recordings', 'Conversion funnels'],
      kpis: ['Session duration', 'Bounce rate', 'Page views', 'User engagement'],
      recommended: true
    },
    {
      id: 'revenue',
      name: 'Revenue Analytics',
      description: 'Monitor financial performance and revenue optimization',
      icon: DollarSign,
      category: 'business',
      priority: 'high',
      features: ['Revenue tracking', 'Customer LTV', 'Conversion rates', 'Revenue attribution'],
      kpis: ['Monthly recurring revenue', 'Customer acquisition cost', 'Conversion rate', 'Average order value']
    },
    {
      id: 'audience',
      name: 'Audience Insights',
      description: 'Deep demographic and psychographic audience analysis',
      icon: Target,
      category: 'marketing',
      priority: 'high',
      features: ['Demographics', 'Geographic data', 'Device analytics', 'Channel attribution'],
      kpis: ['User demographics', 'Geographic distribution', 'Device usage', 'Traffic sources']
    },
    {
      id: 'predictive',
      name: 'Predictive Analytics',
      description: 'AI-powered forecasting and predictive insights',
      icon: Brain,
      category: 'ai',
      priority: 'medium',
      features: ['Trend forecasting', 'Churn prediction', 'Demand forecasting', 'Risk analysis'],
      kpis: ['Predicted growth', 'Churn probability', 'Forecast accuracy', 'Risk scores']
    },
    {
      id: 'competitive',
      name: 'Competitive Intelligence',
      description: 'Monitor market position and competitive landscape',
      icon: Eye,
      category: 'market',
      priority: 'medium',
      features: ['Market share', 'Competitor tracking', 'Pricing analysis', 'Feature comparison'],
      kpis: ['Market position', 'Competitive advantage', 'Price competitiveness', 'Feature gaps']
    }
  ];

  const dashboardTypes = [
    {
      id: 'executive',
      name: 'Executive Dashboard',
      description: 'High-level KPIs and business metrics for leadership',
      audience: 'C-Suite, Executives',
      updateFrequency: 'Daily',
      widgets: ['Revenue trends', 'User growth', 'Key metrics', 'Goal progress']
    },
    {
      id: 'operational',
      name: 'Operational Dashboard',
      description: 'Day-to-day operational metrics and performance indicators',
      audience: 'Operations, Managers',
      updateFrequency: 'Real-time',
      widgets: ['System health', 'User activity', 'Support metrics', 'Performance alerts']
    },
    {
      id: 'marketing',
      name: 'Marketing Dashboard',
      description: 'Campaign performance and marketing attribution analytics',
      audience: 'Marketing team',
      updateFrequency: 'Hourly',
      widgets: ['Campaign ROI', 'Channel performance', 'Lead generation', 'Conversion funnels']
    },
    {
      id: 'product',
      name: 'Product Dashboard',
      description: 'Product usage, feature adoption, and user experience metrics',
      audience: 'Product team',
      updateFrequency: 'Real-time',
      widgets: ['Feature usage', 'User feedback', 'Product metrics', 'A/B test results']
    }
  ];

  const handleMetricToggle = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const handleSetupAnalytics = async () => {
    setIsSettingUp(true);
    setCurrentStep(3);
    
    // Simulate analytics setup
    for (let i = 0; i <= 100; i += 3) {
      setSetupProgress(i);
      await new Promise(resolve => setTimeout(resolve, 60));
    }
    
    // Generate analytics results with realistic data
    setAnalyticsResults({
      metrics: selectedMetrics.map(metricId => {
        const metric = analyticsMetrics.find(m => m.id === metricId);
        return {
          id: metricId,
          name: metric?.name,
          status: 'active',
          dataPoints: generateMetricData(metricId),
          insights: generateInsights(metricId)
        };
      }),
      dashboards: [
        {
          id: 'executive',
          name: 'Executive Dashboard',
          status: 'active',
          widgets: 8,
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'operational',
          name: 'Operational Dashboard',
          status: 'active',
          widgets: 12,
          lastUpdated: new Date().toISOString()
        }
      ],
      realTimeData: {
        activeUsers: Math.floor(Math.random() * 500) + 200,
        pageViews: Math.floor(Math.random() * 10000) + 5000,
        revenue: Math.floor(Math.random() * 50000) + 25000,
        conversionRate: (Math.random() * 5 + 2).toFixed(2) + '%'
      },
      alerts: generateAlerts()
    });
    
    setIsSettingUp(false);
    setCurrentStep(4);
  };

  const generateMetricData = (metricId: string) => {
    const baseData = {
      performance: {
        pageLoadTime: (Math.random() * 2 + 1).toFixed(2) + 's',
        errorRate: (Math.random() * 2).toFixed(2) + '%',
        uptime: '99.9%',
        coreWebVitals: 'Good'
      },
      'user-behavior': {
        averageSession: (Math.random() * 5 + 3).toFixed(1) + ' min',
        bounceRate: (Math.random() * 20 + 30).toFixed(1) + '%',
        pagesPerSession: (Math.random() * 3 + 2).toFixed(1),
        engagement: (Math.random() * 30 + 60).toFixed(0) + '%'
      },
      revenue: {
        mrr: '$' + (Math.random() * 50000 + 25000).toFixed(0),
        arpu: '$' + (Math.random() * 200 + 100).toFixed(0),
        cac: '$' + (Math.random() * 100 + 50).toFixed(0),
        ltv: '$' + (Math.random() * 2000 + 1000).toFixed(0)
      },
      audience: {
        totalUsers: Math.floor(Math.random() * 10000) + 5000,
        newUsers: Math.floor(Math.random() * 1000) + 500,
        returningUsers: Math.floor(Math.random() * 5000) + 2500,
        demographics: 'Primary: 25-34 years'
      }
    };

    return baseData[metricId as keyof typeof baseData] || {};
  };

  const generateInsights = (metricId: string) => {
    const insights = {
      performance: [
        'Page load time improved by 23% this week',
        'Core Web Vitals score is in the "Good" range',
        'Error rate decreased by 40% after recent updates'
      ],
      'user-behavior': [
        'User engagement increased by 15% this month',
        'Mobile users spend 20% more time on the platform',
        'Feature adoption rate is above industry average'
      ],
      revenue: [
        'Revenue growth is trending 12% above forecast',
        'Customer acquisition cost decreased by 8%',
        'Monthly recurring revenue hit a new high'
      ],
      audience: [
        'Primary audience is 25-34 years old professionals',
        '60% of users access from mobile devices',
        'North American market shows strongest growth'
      ]
    };

    return insights[metricId as keyof typeof insights] || [];
  };

  const generateAlerts = () => [
    {
      type: 'success',
      message: 'Revenue exceeded monthly target by 15%',
      timestamp: new Date().toISOString(),
      metric: 'Revenue'
    },
    {
      type: 'warning',
      message: 'Page load time increased by 0.3s - investigate',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      metric: 'Performance'
    },
    {
      type: 'info',
      message: 'New user acquisition up 25% this week',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      metric: 'User Behavior'
    }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="ff-text-headline">Smart Analytics</h2>
                <p className="ff-text-body">Track performance, audience insights, and revenue optimization in real-time</p>
              </div>
            </div>

            <Card className="ff-card">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="text-blue-500 font-semibold mb-1">Real-Time Data</div>
                    <div className="text-sm text-gray-300">Live analytics dashboard</div>
                  </div>
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="text-green-500 font-semibold mb-1">AI Insights</div>
                    <div className="text-sm text-gray-300">Predictive analytics</div>
                  </div>
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <div className="text-purple-500 font-semibold mb-1">Custom Dashboards</div>
                    <div className="text-sm text-gray-300">Tailored for your needs</div>
                  </div>
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <div className="text-orange-500 font-semibold mb-1">Smart Alerts</div>
                    <div className="text-sm text-gray-300">Automated notifications</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="ff-text-title">Select Analytics Metrics</h3>
              
              {['critical', 'high', 'medium'].map(priority => {
                const priorityMetrics = analyticsMetrics.filter(m => m.priority === priority);
                const priorityLabels = {
                  critical: { name: 'Essential Analytics', color: 'text-red-500', icon: '🔴' },
                  high: { name: 'Business Intelligence', color: 'text-orange-500', icon: '🟠' },
                  medium: { name: 'Advanced Insights', color: 'text-yellow-500', icon: '🟡' }
                };
                const label = priorityLabels[priority as keyof typeof priorityLabels];
                
                return (
                  <div key={priority} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{label.icon}</span>
                      <h4 className={`ff-text-title text-base ${label.color}`}>{label.name}</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {priorityMetrics.map(metric => {
                        const Icon = metric.icon;
                        return (
                          <Card 
                            key={metric.id}
                            className={`ff-card-interactive cursor-pointer transition-all duration-200 ${
                              selectedMetrics.includes(metric.id) 
                                ? 'ring-2 ring-purple-500 bg-purple-500/10' 
                                : 'hover:bg-white/5'
                            }`}
                            onClick={() => handleMetricToggle(metric.id)}
                          >
                            <CardContent className="p-6">
                              <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                                      <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                      <h5 className="font-semibold">{metric.name}</h5>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <Badge variant="secondary" className="text-xs">{metric.category}</Badge>
                                        {metric.recommended && (
                                          <Badge className="ff-badge-primary text-xs">Recommended</Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {selectedMetrics.includes(metric.id) && (
                                    <CheckCircle className="w-5 h-5 text-purple-500" />
                                  )}
                                </div>
                                
                                <p className="text-sm text-gray-400">{metric.description}</p>
                                
                                <div className="space-y-2">
                                  <div className="text-xs text-gray-500 font-medium">Features:</div>
                                  <div className="flex flex-wrap gap-1">
                                    {metric.features.slice(0, 3).map(feature => (
                                      <Badge key={feature} variant="outline" className="text-xs">
                                        {feature}
                                      </Badge>
                                    ))}
                                    {metric.features.length > 3 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{metric.features.length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="space-y-1">
                                  <div className="text-xs text-gray-500 font-medium">Key Metrics:</div>
                                  <div className="flex flex-wrap gap-1">
                                    {metric.kpis.slice(0, 2).map(kpi => (
                                      <Badge key={kpi} variant="secondary" className="text-xs">
                                        {kpi}
                                      </Badge>
                                    ))}
                                    {metric.kpis.length > 2 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{metric.kpis.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={() => setCurrentStep(2)}
                disabled={selectedMetrics.length === 0}
                className="ff-btn-primary ff-btn-lg"
              >
                Configure Analytics ({selectedMetrics.length} metric{selectedMetrics.length !== 1 ? 's' : ''})
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="ff-text-headline">Analytics Configuration</h2>
              <p className="ff-text-body">Customize dashboards, alerts, and reporting settings</p>
            </div>

            <Card className="ff-card">
              <CardHeader>
                <CardTitle>Selected Analytics ({selectedMetrics.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedMetrics.map(metricId => {
                    const metric = analyticsMetrics.find(m => m.id === metricId);
                    const Icon = metric?.icon || BarChart3;
                    return (
                      <div key={metricId} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded bg-gradient-to-r from-purple-500 to-pink-500">
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">{metric?.name}</span>
                        </div>
                        <Badge variant="secondary">{metric?.category}</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="dashboards" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboards" className="space-y-4">
                <Card className="ff-card">
                  <CardContent className="p-6 space-y-4">
                    <h4 className="ff-text-title">Dashboard Configuration</h4>
                    
                    <div className="space-y-4">
                      {dashboardTypes.map(dashboard => (
                        <div key={dashboard.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <h5 className="font-semibold">{dashboard.name}</h5>
                              <Badge variant="secondary" className="text-xs">{dashboard.updateFrequency}</Badge>
                            </div>
                            <p className="text-sm text-gray-400">{dashboard.description}</p>
                            <div className="text-xs text-gray-500">For: {dashboard.audience}</div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {dashboard.widgets.map(widget => (
                                <Badge key={widget} variant="outline" className="text-xs">
                                  {widget}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Switch defaultChecked={dashboard.id === 'executive' || dashboard.id === 'operational'} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="alerts" className="space-y-4">
                <Card className="ff-card">
                  <CardContent className="p-6 space-y-4">
                    <h4 className="ff-text-title">Smart Alerts Configuration</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Performance Alerts</div>
                          <div className="text-xs text-gray-400">Page load time, errors, uptime</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Revenue Alerts</div>
                          <div className="text-xs text-gray-400">Revenue goals, conversion drops</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">User Behavior Alerts</div>
                          <div className="text-xs text-gray-400">Engagement drops, churn risks</div>
                        </div>
                        <Switch />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Predictive Alerts</div>
                          <div className="text-xs text-gray-400">AI-powered forecasting alerts</div>
                        </div>
                        <Switch />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="ff-text-title text-sm">Alert Frequency</label>
                      <Select defaultValue="immediate">
                        <SelectTrigger className="ff-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate</SelectItem>
                          <SelectItem value="hourly">Hourly Digest</SelectItem>
                          <SelectItem value="daily">Daily Summary</SelectItem>
                          <SelectItem value="weekly">Weekly Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reports" className="space-y-4">
                <Card className="ff-card">
                  <CardContent className="p-6 space-y-4">
                    <h4 className="ff-text-title">Automated Reporting</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Executive Reports</div>
                          <div className="text-xs text-gray-400">Weekly business summary</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Performance Reports</div>
                          <div className="text-xs text-gray-400">Daily technical metrics</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Marketing Reports</div>
                          <div className="text-xs text-gray-400">Campaign performance</div>
                        </div>
                        <Switch />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Custom Reports</div>
                          <div className="text-xs text-gray-400">User-defined metrics</div>
                        </div>
                        <Switch />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="ff-text-title text-sm">Report Format</label>
                        <Select defaultValue="pdf">
                          <SelectTrigger className="ff-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF Report</SelectItem>
                            <SelectItem value="email">Email Summary</SelectItem>
                            <SelectItem value="dashboard">Dashboard Link</SelectItem>
                            <SelectItem value="csv">CSV Data Export</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="ff-text-title text-sm">Delivery Schedule</label>
                        <Select defaultValue="weekly">
                          <SelectTrigger className="ff-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="integrations" className="space-y-4">
                <Card className="ff-card">
                  <CardContent className="p-6 space-y-4">
                    <h4 className="ff-text-title">Analytics Integrations</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center text-white text-sm font-bold">GA</div>
                          <div>
                            <h5 className="font-semibold">Google Analytics 4</h5>
                            <p className="text-sm text-gray-400">Web analytics and reporting</p>
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded bg-purple-500 flex items-center justify-center text-white text-sm font-bold">MI</div>
                          <div>
                            <h5 className="font-semibold">Mixpanel</h5>
                            <p className="text-sm text-gray-400">Product analytics and user tracking</p>
                          </div>
                        </div>
                        <Switch />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded bg-green-500 flex items-center justify-center text-white text-sm font-bold">HS</div>
                          <div>
                            <h5 className="font-semibold">HubSpot</h5>
                            <p className="text-sm text-gray-400">CRM and marketing analytics</p>
                          </div>
                        </div>
                        <Switch />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded bg-red-500 flex items-center justify-center text-white text-sm font-bold">SE</div>
                          <div>
                            <h5 className="font-semibold">Sentry</h5>
                            <p className="text-sm text-gray-400">Error tracking and performance monitoring</p>
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(1)}
                className="ff-btn-outline"
              >
                Back to Metrics
              </Button>
              <Button 
                onClick={handleSetupAnalytics}
                className="ff-btn-primary ff-btn-lg"
              >
                Deploy Analytics System
                <BarChart3 className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="ff-text-headline">Setting Up Analytics</h2>
                <p className="ff-text-body">Configuring tracking, dashboards, and intelligent insights</p>
              </div>
            </div>

            <Card className="ff-card">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="ff-text-title text-sm">Analytics Setup Progress</span>
                    <span className="ff-text-title text-sm">{Math.round(setupProgress)}%</span>
                  </div>
                  <Progress value={setupProgress} className="h-3" />
                </div>

                <div className="space-y-4">
                  {selectedMetrics.map((metricId, index) => {
                    const metric = analyticsMetrics.find(m => m.id === metricId);
                    const Icon = metric?.icon || BarChart3;
                    const progress = Math.min(setupProgress * (Math.random() * 0.3 + 0.8), 100);
                    
                    return (
                      <div key={metricId} className="p-4 bg-gray-800 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="p-2 rounded bg-gradient-to-r from-purple-500 to-pink-500">
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium text-sm">{metric?.name}</span>
                          </div>
                          {progress >= 100 ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                          )}
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="mt-2 text-xs text-gray-400">
                          {progress >= 100 ? 'Tracking active' : 'Setting up tracking...'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="flex items-center space-x-2 text-purple-400 mb-2">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-medium">Analytics Infrastructure Setup</span>
                  </div>
                  <ul className="text-sm text-purple-300 space-y-1">
                    <li>• Initializing data collection endpoints</li>
                    <li>• Configuring real-time analytics pipeline</li>
                    <li>• Setting up AI-powered insights engine</li>
                    <li>• Creating custom dashboards and alerts</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="ff-text-headline">Analytics System Live!</h2>
                <p className="ff-text-body">Smart analytics are now tracking your platform performance</p>
              </div>
            </div>

            {analyticsResults && (
              <div className="space-y-6">
                <Card className="ff-card">
                  <CardHeader>
                    <CardTitle>Real-Time Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-500">{analyticsResults.realTimeData.activeUsers}</div>
                        <div className="text-sm text-gray-400">Active Users</div>
                      </div>
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-500">
                          ${analyticsResults.realTimeData.revenue.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">Monthly Revenue</div>
                      </div>
                      <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-500">
                          {analyticsResults.realTimeData.pageViews.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">Page Views</div>
                      </div>
                      <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-orange-500">
                          {analyticsResults.realTimeData.conversionRate}
                        </div>
                        <div className="text-sm text-gray-400">Conversion Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card">
                  <CardHeader>
                    <CardTitle>Active Analytics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analyticsResults.metrics.map((metric: any) => (
                      <div key={metric.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{metric.name}</h4>
                            <p className="text-sm text-gray-400">Data collection active</p>
                          </div>
                        </div>
                        <Badge className="ff-badge-success">Live</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Tabs defaultValue="insights" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="insights">AI Insights</TabsTrigger>
                    <TabsTrigger value="alerts">Smart Alerts</TabsTrigger>
                    <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="insights" className="space-y-4">
                    <Card className="ff-card">
                      <CardContent className="p-6">
                        <h4 className="ff-text-title mb-4">AI-Powered Insights</h4>
                        <div className="space-y-4">
                          {analyticsResults.metrics.slice(0, 3).map((metric: any) => (
                            <div key={metric.id} className="space-y-2">
                              <h5 className="font-semibold text-sm">{metric.name}</h5>
                              <div className="space-y-1">
                                {metric.insights.map((insight: string, index: number) => (
                                  <div key={index} className="flex items-start space-x-2 p-3 bg-gray-800 rounded-lg">
                                    <Brain className="w-4 h-4 text-purple-500 mt-0.5" />
                                    <span className="text-sm text-gray-300">{insight}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="alerts" className="space-y-4">
                    <Card className="ff-card">
                      <CardContent className="p-6">
                        <h4 className="ff-text-title mb-4">Recent Alerts</h4>
                        <div className="space-y-3">
                          {analyticsResults.alerts.map((alert: any, index: number) => (
                            <div key={index} className={`p-3 rounded-lg border ${
                              alert.type === 'success' ? 'bg-green-500/10 border-green-500/20' :
                              alert.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' :
                              'bg-blue-500/10 border-blue-500/20'
                            }`}>
                              <div className="flex items-start space-x-3">
                                <div className={`w-2 h-2 rounded-full mt-2 ${
                                  alert.type === 'success' ? 'bg-green-500' :
                                  alert.type === 'warning' ? 'bg-yellow-500' :
                                  'bg-blue-500'
                                }`} />
                                <div className="flex-1">
                                  <p className="text-sm text-gray-200">{alert.message}</p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Badge variant="outline" className="text-xs">{alert.metric}</Badge>
                                    <span className="text-xs text-gray-500">
                                      {new Date(alert.timestamp).toLocaleTimeString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="dashboards" className="space-y-4">
                    <Card className="ff-card">
                      <CardContent className="p-6">
                        <h4 className="ff-text-title mb-4">Live Dashboards</h4>
                        <div className="space-y-3">
                          {analyticsResults.dashboards.map((dashboard: any) => (
                            <div key={dashboard.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border">
                              <div className="flex items-center space-x-4">
                                <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                                  <PieChart className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-semibold">{dashboard.name}</h4>
                                  <p className="text-sm text-gray-400">
                                    {dashboard.widgets} widgets • Updated {new Date(dashboard.lastUpdated).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className="ff-badge-success">Live</Badge>
                                <Button size="sm" variant="outline">View</Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedMetrics([]);
                  setSetupProgress(0);
                  setAnalyticsResults(null);
                }}
                className="ff-btn-outline"
              >
                Setup Another
              </Button>
              <Button 
                onClick={onComplete}
                className="ff-btn-primary ff-btn-lg"
              >
                Continue to Quality Assurance
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Progress indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step <= currentStep 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-700 text-gray-400'
            }`}>
              {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
            </div>
            {step < 4 && (
              <div className={`w-16 h-1 mx-2 ${
                step < currentStep ? 'bg-purple-500' : 'bg-gray-700'
              }`} />
            )}
          </div>
        ))}
      </div>

      {renderStepContent()}
    </div>
  );
}
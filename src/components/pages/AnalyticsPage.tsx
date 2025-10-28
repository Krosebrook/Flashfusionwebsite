import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [metrics, setMetrics] = useState({
    totalProjects: 0,
    activeUsers: 0,
    deployments: 0,
    codeGenerated: 0,
    performance: 0,
    uptime: 0
  });

  useEffect(() => {
    // Simulate loading metrics
    const timer = setTimeout(() => {
      setMetrics({
        totalProjects: 1247,
        activeUsers: 89,
        deployments: 3456,
        codeGenerated: 2.3,
        performance: 94.2,
        uptime: 99.9
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [timeRange]);

  const chartData = [
    { name: 'Mon', projects: 12, deployments: 45, users: 23 },
    { name: 'Tue', projects: 18, deployments: 52, users: 31 },
    { name: 'Wed', projects: 15, deployments: 38, users: 28 },
    { name: 'Thu', projects: 22, deployments: 61, users: 35 },
    { name: 'Fri', projects: 28, deployments: 73, users: 42 },
    { name: 'Sat', projects: 16, deployments: 34, users: 19 },
    { name: 'Sun', projects: 14, deployments: 29, users: 16 }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold mb-2 font-sora">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your development metrics and track platform performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex border rounded-lg p-1 bg-muted/30">
            {[
              { id: '24h', label: '24H' },
              { id: '7d', label: '7D' },
              { id: '30d', label: '30D' },
              { id: '90d', label: '90D' }
            ].map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  timeRange === range.id ? 'bg-background shadow-sm' : ''
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary mb-1">{metrics.totalProjects.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total Projects</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-secondary mb-1">{metrics.activeUsers}</div>
            <div className="text-xs text-muted-foreground">Active Users</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-accent mb-1">{metrics.deployments.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Deployments</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success mb-1">{metrics.codeGenerated}M</div>
            <div className="text-xs text-muted-foreground">Lines Generated</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning mb-1">{metrics.performance}%</div>
            <div className="text-xs text-muted-foreground">Performance</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary mb-1">{metrics.uptime}%</div>
            <div className="text-xs text-muted-foreground">Uptime</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📈</span>
              <span>Development Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData.map((day, index) => (
                <div key={day.name} className="flex items-center space-x-4">
                  <div className="w-8 text-sm font-medium">{day.name}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(day.projects / 30) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground w-8">{day.projects}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Usage Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🎯</span>
              <span>Tool Usage</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { tool: 'Full-Stack Builder', usage: 85, color: 'from-primary to-orange-500' },
                { tool: 'Code Generator', usage: 72, color: 'from-secondary to-blue-500' },
                { tool: 'Deploy Assistant', usage: 68, color: 'from-accent to-pink-500' },
                { tool: 'Code Review AI', usage: 54, color: 'from-success to-green-500' },
                { tool: 'Performance Optimizer', usage: 41, color: 'from-warning to-yellow-500' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r bg-primary"></div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{item.tool}</span>
                      <span className="text-muted-foreground">{item.usage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${item.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${item.usage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights and Recommendations */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>💡</span>
              <span>AI Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mt-1">
                    <span className="text-primary text-sm">🎯</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Performance Optimization Opportunity</h4>
                    <p className="text-sm text-muted-foreground">
                      Your React projects could benefit from code splitting. This could reduce initial bundle size by ~40%.
                    </p>
                    <Button size="sm" variant="outline" className="mt-2">
                      Apply Optimization
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center mt-1">
                    <span className="text-secondary text-sm">🚀</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Deployment Efficiency</h4>
                    <p className="text-sm text-muted-foreground">
                      Consider setting up automated deployments for your active projects to save 2+ hours weekly.
                    </p>
                    <Button size="sm" variant="outline" className="mt-2">
                      Setup Auto-Deploy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>👥</span>
              <span>Team Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">94.2%</div>
                <div className="text-sm text-muted-foreground">Team Productivity</div>
                <div className="text-xs text-success">↗ +12% this week</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Code Quality</span>
                  <span className="font-semibold">8.7/10</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Deployment Success</span>
                  <span className="font-semibold">98.5%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Bug Resolution</span>
                  <span className="font-semibold">&lt; 2 hours</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="w-full">
                View Detailed Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
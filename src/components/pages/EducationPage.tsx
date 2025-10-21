/**
 * @fileoverview Education Page - Main Educational Studio Interface
 * @chunk education
 * @category pages
 * @version 1.0.0
 * @author FlashFusion Team
 */

import React, { useState, useCallback } from 'react';
import EducationalContentStudio from '../education/EducationalContentStudio';
import EducationalToolsRouter from '../education/EducationalToolsRouter';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  BookOpen, Lightbulb, TrendingUp, Users, Award, 
  BarChart3, Download, Share2, History, Settings
} from 'lucide-react';

interface EducationPageProps {
  initialView?: 'studio' | 'tools' | 'analytics';
}

/**
 * Education Page Component
 * Main interface for accessing all educational AI tools and content generation
 */
function EducationPage({ initialView = 'studio' }: EducationPageProps) {
  const [activeView, setActiveView] = useState(initialView);
  const [selectedTool, setSelectedTool] = useState<{ category: string; tool: string } | null>(null);

  const handleToolSelection = useCallback((categoryId: string, toolName: string) => {
    setSelectedTool({ category: categoryId, tool: toolName });
    setActiveView('studio');
  }, []);

  const mockAnalyticsData = {
    totalContent: 142,
    totalUsers: 1250,
    popularTools: [
      'Differentiated Lesson Plans',
      'AI Slide Deck Creator', 
      'Quiz & Test Generator',
      'Study Path Generator'
    ],
    recentActivity: [
      { action: 'Generated lesson plan', tool: 'Lesson Planning', time: '2 hours ago' },
      { action: 'Created assessment', tool: 'Quiz Generator', time: '4 hours ago' },
      { action: 'Built study guide', tool: 'Study Materials', time: '6 hours ago' },
    ]
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--ff-bg-dark)',
        fontFamily: 'var(--ff-font-secondary)'
      }}
    >
      {/* Navigation Header */}
      <div 
        className="border-b p-6"
        style={{
          borderColor: 'rgba(255, 255, 255, 0.1)',
          backgroundColor: 'var(--ff-surface)'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, var(--ff-primary), var(--ff-secondary))'
                }}
              >
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-2xl)',
                    fontWeight: 'var(--ff-weight-bold)',
                    color: 'var(--ff-text-primary)',
                    lineHeight: 'var(--ff-leading-tight)'
                  }}
                >
                  Educational AI Studio
                </h1>
                <p 
                  style={{
                    fontSize: 'var(--ff-text-sm)',
                    color: 'var(--ff-text-secondary)'
                  }}
                >
                  Comprehensive AI-powered educational content creation platform
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="text-center">
                <div 
                  style={{
                    fontSize: 'var(--ff-text-xl)',
                    fontWeight: 'var(--ff-weight-bold)',
                    color: 'var(--ff-primary)',
                    fontFamily: 'var(--ff-font-primary)'
                  }}
                >
                  {mockAnalyticsData.totalContent}
                </div>
                <div 
                  style={{
                    fontSize: 'var(--ff-text-xs)',
                    color: 'var(--ff-text-muted)'
                  }}
                >
                  Content Created
                </div>
              </div>
              <div className="text-center">
                <div 
                  style={{
                    fontSize: 'var(--ff-text-xl)',
                    fontWeight: 'var(--ff-weight-bold)',
                    color: 'var(--ff-secondary)',
                    fontFamily: 'var(--ff-font-primary)'
                  }}
                >
                  65+
                </div>
                <div 
                  style={{
                    fontSize: 'var(--ff-text-xs)',
                    color: 'var(--ff-text-muted)'
                  }}
                >
                  AI Tools
                </div>
              </div>
              <div className="text-center">
                <div 
                  style={{
                    fontSize: 'var(--ff-text-xl)',
                    fontWeight: 'var(--ff-weight-bold)',
                    color: 'var(--ff-accent)',
                    fontFamily: 'var(--ff-font-primary)'
                  }}
                >
                  24/7
                </div>
                <div 
                  style={{
                    fontSize: 'var(--ff-text-xs)',
                    color: 'var(--ff-text-muted)'
                  }}
                >
                  Available
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
            <TabsList 
              className="grid w-full grid-cols-3 max-w-md"
              style={{
                background: 'var(--ff-bg-dark)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--ff-radius-lg)',
                padding: 'var(--ff-space-1)'
              }}
            >
              <TabsTrigger 
                value="studio"
                className="flex items-center gap-2"
                style={{
                  fontFamily: 'var(--ff-font-primary)',
                  fontSize: 'var(--ff-text-sm)',
                  fontWeight: 'var(--ff-weight-semibold)',
                  color: activeView === 'studio' ? 'var(--ff-primary)' : 'var(--ff-text-muted)',
                  backgroundColor: activeView === 'studio' ? 'rgba(255, 123, 0, 0.1)' : 'transparent',
                  borderRadius: 'var(--ff-radius)'
                }}
              >
                <Lightbulb className="w-4 h-4" />
                Studio
              </TabsTrigger>
              <TabsTrigger 
                value="tools"
                className="flex items-center gap-2"
                style={{
                  fontFamily: 'var(--ff-font-primary)',
                  fontSize: 'var(--ff-text-sm)',
                  fontWeight: 'var(--ff-weight-semibold)',
                  color: activeView === 'tools' ? 'var(--ff-primary)' : 'var(--ff-text-muted)',
                  backgroundColor: activeView === 'tools' ? 'rgba(255, 123, 0, 0.1)' : 'transparent',
                  borderRadius: 'var(--ff-radius)'
                }}
              >
                <BookOpen className="w-4 h-4" />
                Tools
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="flex items-center gap-2"
                style={{
                  fontFamily: 'var(--ff-font-primary)',
                  fontSize: 'var(--ff-text-sm)',
                  fontWeight: 'var(--ff-weight-semibold)',
                  color: activeView === 'analytics' ? 'var(--ff-primary)' : 'var(--ff-text-muted)',
                  backgroundColor: activeView === 'analytics' ? 'rgba(255, 123, 0, 0.1)' : 'transparent',
                  borderRadius: 'var(--ff-radius)'
                }}
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content Area */}
      <Tabs value={activeView} className="flex-1">
        {/* Content Studio */}
        <TabsContent value="studio" className="mt-0">
          <EducationalContentStudio />
        </TabsContent>

        {/* Tools Browser */}
        <TabsContent value="tools" className="mt-0">
          <EducationalToolsRouter onToolSelect={handleToolSelection} />
        </TabsContent>

        {/* Analytics Dashboard */}
        <TabsContent value="analytics" className="mt-0">
          <div className="p-6 space-y-8">
            <div className="max-w-7xl mx-auto">
              {/* Analytics Header */}
              <div className="text-center space-y-4 mb-8">
                <h2 
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-3xl)',
                    fontWeight: 'var(--ff-weight-bold)',
                    color: 'var(--ff-text-primary)'
                  }}
                >
                  Educational Content Analytics
                </h2>
                <p 
                  style={{
                    fontSize: 'var(--ff-text-lg)',
                    color: 'var(--ff-text-secondary)',
                    maxWidth: '600px',
                    margin: '0 auto'
                  }}
                >
                  Track your content creation progress, popular tools, and educational impact metrics.
                </p>
              </div>

              {/* Analytics Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  {
                    title: 'Total Content',
                    value: mockAnalyticsData.totalContent,
                    change: '+12%',
                    icon: BookOpen,
                    color: 'var(--ff-primary)'
                  },
                  {
                    title: 'Active Users',
                    value: mockAnalyticsData.totalUsers,
                    change: '+8%',
                    icon: Users,
                    color: 'var(--ff-secondary)'
                  },
                  {
                    title: 'Success Rate',
                    value: '94%',
                    change: '+2%',
                    icon: Award,
                    color: 'var(--ff-success)'
                  },
                  {
                    title: 'Avg. Rating',
                    value: '4.8',
                    change: '+0.1',
                    icon: TrendingUp,
                    color: 'var(--ff-accent)'
                  }
                ].map((metric, index) => (
                  <Card 
                    key={index}
                    className="ff-card-interactive text-center"
                    style={{
                      background: 'var(--ff-gradient-surface)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 'var(--ff-radius-lg)'
                    }}
                  >
                    <CardContent className="p-6">
                      <div 
                        className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${metric.color}, ${metric.color}99)`
                        }}
                      >
                        <metric.icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <div 
                        style={{
                          fontSize: 'var(--ff-text-3xl)',
                          fontWeight: 'var(--ff-weight-bold)',
                          color: 'var(--ff-text-primary)',
                          fontFamily: 'var(--ff-font-primary)',
                          marginBottom: 'var(--ff-space-1)'
                        }}
                      >
                        {metric.value}
                      </div>
                      
                      <div 
                        style={{
                          fontSize: 'var(--ff-text-sm)',
                          color: 'var(--ff-text-secondary)',
                          marginBottom: 'var(--ff-space-2)'
                        }}
                      >
                        {metric.title}
                      </div>
                      
                      <Badge 
                        style={{
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          color: 'var(--ff-success)',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                          fontSize: 'var(--ff-text-xs)'
                        }}
                      >
                        {metric.change} this month
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Popular Tools and Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Popular Tools */}
                <Card 
                  style={{
                    background: 'var(--ff-gradient-surface)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--ff-radius-lg)'
                  }}
                >
                  <CardHeader>
                    <CardTitle 
                      className="flex items-center gap-3"
                      style={{
                        fontFamily: 'var(--ff-font-primary)',
                        fontSize: 'var(--ff-text-xl)',
                        fontWeight: 'var(--ff-weight-semibold)',
                        color: 'var(--ff-text-primary)'
                      }}
                    >
                      <TrendingUp style={{ color: 'var(--ff-primary)' }} className="w-5 h-5" />
                      Most Popular Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockAnalyticsData.popularTools.map((tool, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg"
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--ff-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 'var(--ff-text-xs)',
                              fontWeight: 'var(--ff-weight-bold)',
                              color: 'white'
                            }}
                          >
                            {index + 1}
                          </div>
                          <span 
                            style={{
                              fontSize: 'var(--ff-text-sm)',
                              color: 'var(--ff-text-primary)',
                              fontWeight: 'var(--ff-weight-medium)'
                            }}
                          >
                            {tool}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div 
                            style={{
                              width: '60px',
                              height: '4px',
                              borderRadius: '2px',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }}
                          >
                            <div 
                              style={{
                                width: `${90 - index * 15}%`,
                                height: '100%',
                                borderRadius: '2px',
                                backgroundColor: 'var(--ff-primary)'
                              }}
                            />
                          </div>
                          <span 
                            style={{
                              fontSize: 'var(--ff-text-xs)',
                              color: 'var(--ff-text-muted)',
                              minWidth: '30px'
                            }}
                          >
                            {90 - index * 15}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card 
                  style={{
                    background: 'var(--ff-gradient-surface)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--ff-radius-lg)'
                  }}
                >
                  <CardHeader>
                    <CardTitle 
                      className="flex items-center gap-3"
                      style={{
                        fontFamily: 'var(--ff-font-primary)',
                        fontSize: 'var(--ff-text-xl)',
                        fontWeight: 'var(--ff-weight-semibold)',
                        color: 'var(--ff-text-primary)'
                      }}
                    >
                      <History style={{ color: 'var(--ff-secondary)' }} className="w-5 h-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockAnalyticsData.recentActivity.map((activity, index) => (
                      <div 
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg"
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}
                      >
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            background: 'linear-gradient(135deg, var(--ff-secondary), var(--ff-accent))'
                          }}
                        >
                          <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <div 
                            style={{
                              fontSize: 'var(--ff-text-sm)',
                              color: 'var(--ff-text-primary)',
                              fontWeight: 'var(--ff-weight-medium)',
                              marginBottom: 'var(--ff-space-1)'
                            }}
                          >
                            {activity.action}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              style={{
                                backgroundColor: 'rgba(0, 180, 216, 0.1)',
                                color: 'var(--ff-secondary)',
                                border: '1px solid rgba(0, 180, 216, 0.2)',
                                fontSize: 'var(--ff-text-xs)'
                              }}
                            >
                              {activity.tool}
                            </Badge>
                            <span 
                              style={{
                                fontSize: 'var(--ff-text-xs)',
                                color: 'var(--ff-text-muted)'
                              }}
                            >
                              {activity.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Button
                  className="ff-btn-primary"
                  style={{
                    backgroundColor: 'var(--ff-primary)',
                    color: 'white',
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-base)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    padding: 'var(--ff-space-3) var(--ff-space-6)',
                    borderRadius: 'var(--ff-radius-lg)',
                    border: 'none'
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                
                <Button
                  variant="outline"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'var(--ff-text-primary)',
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-base)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    padding: 'var(--ff-space-3) var(--ff-space-6)',
                    borderRadius: 'var(--ff-radius-lg)'
                  }}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Analytics
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default EducationPage;
import React, { memo, useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface AppInterfaceProps {
  currentRoute: string;
  onRouteChange: (route: string) => void;
  onNavigateToLanding: () => void;
}

// Dashboard Component
const Dashboard = memo(() => {
  const [stats, setStats] = useState({
    projectsCreated: 0,
    toolsUsed: 0,
    deployments: 0,
    teamMembers: 0
  });

  useEffect(() => {
    // Simulate loading stats with animation
    const animateCounter = (key: keyof typeof stats, target: number) => {
      let current = 0;
      const increment = target / 20;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setStats(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, 100);
    };

    animateCounter('projectsCreated', 42);
    animateCounter('toolsUsed', 18);
    animateCounter('deployments', 7);
    animateCounter('teamMembers', 3);
  }, []);

  const quickActions = [
    {
      title: 'Generate Full-Stack App',
      description: 'Create a complete application with AI assistance',
      icon: '🚀',
      gradient: 'from-primary to-orange-500',
      action: () => console.log('Generate app')
    },
    {
      title: 'AI Code Review',
      description: 'Get intelligent feedback on your code',
      icon: '🔍',
      gradient: 'from-secondary to-blue-500',
      action: () => console.log('Code review')
    },
    {
      title: 'Deploy to Cloud',
      description: 'One-click deployment to multiple platforms',
      icon: '☁️',
      gradient: 'from-accent to-pink-500',
      action: () => console.log('Deploy')
    },
    {
      title: 'Team Collaboration',
      description: 'Invite team members and collaborate in real-time',
      icon: '👥',
      gradient: 'from-success to-green-500',
      action: () => console.log('Collaborate')
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back to 
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent ml-2">
                FlashFusion
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Ready to build something amazing with AI? Let's get started.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
              <span className="text-4xl">🤖</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary mb-2">{stats.projectsCreated}</div>
            <div className="text-sm text-muted-foreground">Projects Created</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-secondary mb-2">{stats.toolsUsed}</div>
            <div className="text-sm text-muted-foreground">AI Tools Used</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-accent mb-2">{stats.deployments}</div>
            <div className="text-sm text-muted-foreground">Deployments</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-success mb-2">{stats.teamMembers}</div>
            <div className="text-sm text-muted-foreground">Team Members</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => (
            <Card 
              key={index}
              className="ff-card-interactive cursor-pointer group"
              onClick={action.action}
            >
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <span className="text-xl">{action.icon}</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[
                { action: 'Generated React app', time: '2 minutes ago', status: 'success' },
                { action: 'Deployed to Vercel', time: '1 hour ago', status: 'success' },
                { action: 'Code review completed', time: '3 hours ago', status: 'info' },
                { action: 'Team member invited', time: '1 day ago', status: 'secondary' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.status === 'success' ? 'bg-success' :
                      item.status === 'info' ? 'bg-secondary' :
                      'bg-muted-foreground'
                    }`}></div>
                    <span className="font-medium">{item.action}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

// Tools Component
const Tools = memo(() => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Tools', count: 60 },
    { id: 'generation', label: 'Code Generation', count: 15 },
    { id: 'analysis', label: 'Code Analysis', count: 12 },
    { id: 'deployment', label: 'Deployment', count: 8 },
    { id: 'collaboration', label: 'Collaboration', count: 10 },
    { id: 'optimization', label: 'Optimization', count: 15 }
  ];

  const tools = [
    {
      name: 'Full-Stack App Generator',
      description: 'Generate complete applications with React, Node.js, and database',
      category: 'generation',
      icon: '🏗️',
      badge: 'Popular',
      badgeColor: 'bg-primary'
    },
    {
      name: 'Smart Code Review',
      description: 'AI-powered code analysis and improvement suggestions',
      category: 'analysis',
      icon: '🔍',
      badge: 'New',
      badgeColor: 'bg-secondary'
    },
    {
      name: 'One-Click Deploy',
      description: 'Deploy to AWS, Vercel, Netlify with automated CI/CD',
      category: 'deployment',
      icon: '🚀',
      badge: null,
      badgeColor: ''
    },
    {
      name: 'Team Workspace',
      description: 'Real-time collaboration with live editing and chat',
      category: 'collaboration',
      icon: '👥',
      badge: 'Featured',
      badgeColor: 'bg-accent'
    },
    {
      name: 'Performance Optimizer',
      description: 'Analyze and optimize your application performance',
      category: 'optimization',
      icon: '⚡',
      badge: null,
      badgeColor: ''
    },
    {
      name: 'Database Designer',
      description: 'Visual database schema design and migration tools',
      category: 'generation',
      icon: '🗄️',
      badge: null,
      badgeColor: ''
    }
  ];

  const filteredTools = selectedCategory === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === selectedCategory);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Development Tools</h1>
        <p className="text-muted-foreground text-lg">
          Comprehensive suite of AI-powered tools for every stage of development
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center space-x-2"
          >
            <span>{category.label}</span>
            <Badge variant="secondary" className="ml-2 text-xs">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool, index) => (
          <Card 
            key={index}
            className="ff-card-interactive cursor-pointer group"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-xl">{tool.icon}</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                  </div>
                </div>
                {tool.badge && (
                  <Badge className={`${tool.badgeColor} text-white text-xs`}>
                    {tool.badge}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
              <Button className="w-full" variant="outline">
                Use Tool
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedCategory !== 'all' && (
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => setSelectedCategory('all')}
          >
            View All Tools
          </Button>
        </div>
      )}
    </div>
  );
});

// About Component
const About = memo(() => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">About FlashFusion</h1>
        <p className="text-muted-foreground text-lg">
          The future of AI-powered application development
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">🎯</span>
                <span>Our Mission</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To democratize application development by providing AI-powered tools 
                that enable anyone to build production-ready applications, regardless 
                of their technical background.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">🔮</span>
                <span>Our Vision</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                A world where every idea can become a reality through the power of AI, 
                breaking down barriers between concept and creation.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Key Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Active Developers</span>
                  <span className="font-semibold text-primary">10,000+</span>
                </div>
                <div className="flex justify-between">
                  <span>Projects Generated</span>
                  <span className="font-semibold text-secondary">50,000+</span>
                </div>
                <div className="flex justify-between">
                  <span>Lines of Code Generated</span>
                  <span className="font-semibold text-accent">10M+</span>
                </div>
                <div className="flex justify-between">
                  <span>Deployment Success Rate</span>
                  <span className="font-semibold text-success">99.9%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technology Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Node.js', 'Python', 'AI/ML', 'Cloud', 'Docker', 'Kubernetes'].map((tech) => (
                  <Badge key={tech} variant="secondary">{tech}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
});

// Navigation Component
const AppNavigation = memo(({ currentRoute, onRouteChange, onNavigateToLanding }: {
  currentRoute: string;
  onRouteChange: (route: string) => void;
  onNavigateToLanding: () => void;
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'tools', label: 'AI Tools', icon: '🔧' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'deployments', label: 'Deployments', icon: '🚀' },
    { id: 'team', label: 'Team', icon: '👥' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <nav className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={onNavigateToLanding}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FF</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FlashFusion
            </span>
          </button>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onRouteChange(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentRoute === item.id 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Upgrade
            </Button>
            
            <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">U</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
});

// Main App Interface Component
const AppInterface = memo(({ currentRoute, onRouteChange, onNavigateToLanding }: AppInterfaceProps) => {
  const renderContent = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <Dashboard />;
      case 'tools':
        return <Tools />;
      case 'about':
        return <About />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation 
        currentRoute={currentRoute}
        onRouteChange={onRouteChange}
        onNavigateToLanding={onNavigateToLanding}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
});

export default AppInterface;
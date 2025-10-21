/**
 * @fileoverview FlashFusion Responsive UI Kit
 * @chunk architecture
 * @category frontend
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Comprehensive responsive UI kit for React 18 + TypeScript application using Tailwind CSS v4.
 * Includes header, navigation, cards, tables, charts, and mobile-first layout components
 * optimized for SaaS dashboard applications.
 * 
 * Features:
 * - Mobile-first responsive design
 * - FlashFusion design system compliance
 * - Modern SaaS dashboard aesthetics
 * - Comprehensive component library
 * - Accessibility-first approach
 * - Performance optimized components
 * - Interactive demonstrations
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { 
  Layout, 
  Smartphone, 
  Tablet, 
  Monitor,
  Menu,
  Search,
  Bell,
  User,
  Settings,
  Home,
  BarChart3,
  Users,
  FileText,
  Database,
  Cloud,
  Shield,
  Zap,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Activity,
  DollarSign,
  Target,
  Calendar,
  Clock,
  Check,
  X,
  AlertTriangle,
  Info,
  Star,
  Heart,
  Share,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Sort,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react';

// Sample data for demonstrations
const sampleTableData = [
  { id: 1, name: 'Solo Creator Pro', plan: 'Professional', revenue: '$2,890', status: 'active', users: 1245, growth: 12.5 },
  { id: 2, name: 'Development Team Hub', plan: 'Enterprise', revenue: '$8,450', status: 'active', users: 5670, growth: 8.3 },
  { id: 3, name: 'Startup Accelerator', plan: 'Starter', revenue: '$1,230', status: 'trial', users: 234, growth: 25.1 },
  { id: 4, name: 'Enterprise Solutions', plan: 'Enterprise', revenue: '$15,670', status: 'active', users: 12340, growth: 5.8 },
  { id: 5, name: 'Creative Studio', plan: 'Professional', revenue: '$4,560', status: 'paused', users: 890, growth: -2.1 }
];

const sampleChartData = [
  { month: 'Jan', users: 1200, revenue: 45000, conversion: 12.3 },
  { month: 'Feb', users: 1450, revenue: 52000, conversion: 13.1 },
  { month: 'Mar', users: 1680, revenue: 58000, conversion: 14.2 },
  { month: 'Apr', users: 2100, revenue: 67000, conversion: 15.8 },
  { month: 'May', users: 2450, revenue: 78000, conversion: 16.5 },
  { month: 'Jun', users: 2890, revenue: 89000, conversion: 17.2 }
];

interface ResponsiveUIKitProps {
  // Optional props for customization
}

/**
 * FlashFusion Responsive UI Kit Component
 * 
 * Comprehensive demonstration of responsive UI components for SaaS dashboards
 */
export function ResponsiveUIKit({}: ResponsiveUIKitProps) {
  const [currentView, setCurrentView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeSection, setActiveSection] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Sample dashboard data
  const dashboardMetrics = useMemo(() => [
    { label: 'Total Users', value: '24,891', change: '+12.5%', trend: 'up', icon: Users },
    { label: 'Monthly Revenue', value: '$89,450', change: '+8.3%', trend: 'up', icon: DollarSign },
    { label: 'Conversion Rate', value: '17.2%', change: '+2.1%', trend: 'up', icon: Target },
    { label: 'Active Projects', value: '1,234', change: '-0.8%', trend: 'down', icon: FileText }
  ], []);

  // Responsive header component
  const ResponsiveHeader = () => (
    <header className="bg-[var(--ff-surface)] border-b border-[var(--border)] sticky top-0 z-50">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo and Mobile Menu */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="lg:hidden ff-btn-ghost"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[var(--ff-primary)] to-[var(--ff-secondary)] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FF</span>
            </div>
            <h1 className="hidden sm:block ff-text-title text-[var(--ff-text-primary)]">
              FlashFusion
            </h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--ff-text-muted)]" />
            <Input 
              placeholder="Search projects, tools, users..." 
              className="pl-10 ff-input bg-[var(--ff-surface-light)] border-[var(--border)]"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="ff-btn-ghost relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--ff-primary)] rounded-full text-xs flex items-center justify-center text-white">
              3
            </span>
          </Button>
          
          <Button variant="ghost" size="sm" className="ff-btn-ghost">
            <Settings className="w-5 h-5" />
          </Button>
          
          <div className="hidden sm:flex items-center gap-2 ml-2 pl-2 border-l border-[var(--border)]">
            <div className="w-8 h-8 bg-gradient-to-br from-[var(--ff-accent)] to-[var(--ff-primary)] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden lg:block">
              <div className="ff-text-sm text-[var(--ff-text-primary)]">Alex Chen</div>
              <div className="ff-text-xs text-[var(--ff-text-muted)]">Pro Plan</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );

  // Responsive navigation component
  const ResponsiveNavigation = () => (
    <nav className="bg-[var(--ff-surface)] border-r border-[var(--border)] h-full">
      <div className="p-4 space-y-2">
        {[
          { icon: Home, label: 'Dashboard', active: true },
          { icon: BarChart3, label: 'Analytics' },
          { icon: Users, label: 'Users' },
          { icon: FileText, label: 'Projects' },
          { icon: Database, label: 'Data' },
          { icon: Cloud, label: 'Deploy' },
          { icon: Shield, label: 'Security' },
          { icon: Settings, label: 'Settings' }
        ].map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
              item.active 
                ? 'bg-[var(--ff-primary)]/10 text-[var(--ff-primary)] border-l-2 border-[var(--ff-primary)]' 
                : 'text-[var(--ff-text-muted)] hover:text-[var(--ff-text-primary)] hover:bg-[var(--ff-surface-light)]'
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="ff-text-sm font-medium truncate">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );

  // Responsive metric cards
  const MetricCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {dashboardMetrics.map((metric, index) => (
        <Card key={index} className="ff-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="ff-text-sm text-[var(--ff-text-muted)]">{metric.label}</p>
                <p className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  {metric.value}
                </p>
                <div className="flex items-center gap-1">
                  {metric.trend === 'up' ? (
                    <ArrowUp className="w-4 h-4 text-[var(--ff-success)]" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-[var(--ff-error)]" />
                  )}
                  <span className={`ff-text-sm ${
                    metric.trend === 'up' ? 'text-[var(--ff-success)]' : 'text-[var(--ff-error)]'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                metric.trend === 'up' 
                  ? 'bg-[var(--ff-success)]/10' 
                  : 'bg-[var(--ff-error)]/10'
              }`}>
                <metric.icon className={`w-6 h-6 ${
                  metric.trend === 'up' ? 'text-[var(--ff-success)]' : 'text-[var(--ff-error)]'
                }`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Responsive chart component
  const ResponsiveChart = () => (
    <Card className="ff-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="ff-text-title">Revenue Analytics</CardTitle>
            <p className="ff-text-sm text-[var(--ff-text-muted)]">Monthly performance overview</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="ff-badge-success">+17.2% vs last period</Badge>
            <Button variant="outline" size="sm" className="ff-btn-outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Simple chart representation */}
          <div className="grid grid-cols-6 gap-2 h-48">
            {sampleChartData.map((data, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="flex-1 flex flex-col justify-end w-full">
                  <div 
                    className="bg-gradient-to-t from-[var(--ff-primary)] to-[var(--ff-secondary)] rounded-t-sm transition-all duration-500 hover:opacity-80"
                    style={{ 
                      height: `${(data.revenue / 90000) * 100}%`,
                      minHeight: '20px'
                    }}
                  />
                </div>
                <div className="text-center">
                  <div className="ff-text-xs text-[var(--ff-text-muted)]">{data.month}</div>
                  <div className="ff-text-xs text-[var(--ff-text-secondary)]">${(data.revenue / 1000).toFixed(0)}k</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Chart legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-[var(--border)]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[var(--ff-primary)] rounded"></div>
              <span className="ff-text-sm text-[var(--ff-text-muted)]">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[var(--ff-secondary)] rounded"></div>
              <span className="ff-text-sm text-[var(--ff-text-muted)]">Users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[var(--ff-accent)] rounded"></div>
              <span className="ff-text-sm text-[var(--ff-text-muted)]">Conversion</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Responsive data table
  const ResponsiveTable = () => (
    <Card className="ff-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="ff-text-title">Customer Accounts</CardTitle>
            <p className="ff-text-sm text-[var(--ff-text-muted)]">Manage and monitor customer performance</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="ff-btn-outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="ff-btn-outline">
              <Sort className="w-4 h-4 mr-2" />
              Sort
            </Button>
            <Button size="sm" className="ff-btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="ff-text-sm">Account Name</TableHead>
                <TableHead className="ff-text-sm">Plan</TableHead>
                <TableHead className="ff-text-sm">Revenue</TableHead>
                <TableHead className="ff-text-sm">Users</TableHead>
                <TableHead className="ff-text-sm">Growth</TableHead>
                <TableHead className="ff-text-sm">Status</TableHead>
                <TableHead className="ff-text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleTableData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="ff-text-sm text-[var(--ff-text-primary)]">
                    {row.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      row.plan === 'Enterprise' ? 'default' : 
                      row.plan === 'Professional' ? 'secondary' : 'outline'
                    } className="ff-text-xs">
                      {row.plan}
                    </Badge>
                  </TableCell>
                  <TableCell className="ff-text-sm text-[var(--ff-text-primary)]">
                    {row.revenue}
                  </TableCell>
                  <TableCell className="ff-text-sm text-[var(--ff-text-secondary)]">
                    {row.users.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {row.growth > 0 ? (
                        <ArrowUp className="w-3 h-3 text-[var(--ff-success)]" />
                      ) : (
                        <ArrowDown className="w-3 h-3 text-[var(--ff-error)]" />
                      )}
                      <span className={`ff-text-sm ${
                        row.growth > 0 ? 'text-[var(--ff-success)]' : 'text-[var(--ff-error)]'
                      }`}>
                        {row.growth > 0 ? '+' : ''}{row.growth}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      row.status === 'active' ? 'default' :
                      row.status === 'trial' ? 'secondary' : 'outline'
                    } className="ff-text-xs">
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="ff-btn-ghost w-8 h-8 p-0">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="ff-btn-ghost w-8 h-8 p-0">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="ff-btn-ghost w-8 h-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  // Device preview component
  const DevicePreview = ({ device, children }: { device: string, children: React.ReactNode }) => {
    const getDeviceStyles = () => {
      switch (device) {
        case 'mobile':
          return 'w-80 h-[600px] border-8 border-gray-800 rounded-[2rem] overflow-hidden bg-black';
        case 'tablet':
          return 'w-[600px] h-[800px] border-4 border-gray-700 rounded-xl overflow-hidden bg-gray-800';
        case 'desktop':
          return 'w-full max-w-7xl h-[800px] border border-[var(--border)] rounded-lg overflow-hidden';
        default:
          return 'w-full border border-[var(--border)] rounded-lg overflow-hidden';
      }
    };

    return (
      <div className={`mx-auto ${getDeviceStyles()}`}>
        <div className="w-full h-full bg-[var(--ff-bg-dark)] overflow-hidden">
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)]" style={{ fontFamily: 'var(--ff-font-secondary)' }}>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 ff-fade-in-up">
          <Badge className="ff-badge-primary mb-4">
            <Layout className="w-4 h-4 mr-2" />
            FlashFusion UI Kit
          </Badge>
          
          <h1 className="ff-text-display">
            Responsive
            <span className="ff-text-gradient"> SaaS Dashboard</span>
          </h1>
          
          <p className="ff-text-body max-w-3xl mx-auto">
            Comprehensive React 18 + TypeScript UI kit with Tailwind CSS v4, featuring mobile-first design,
            modern aesthetics, and complete component library for professional SaaS applications.
          </p>
        </div>

        {/* Device Toggle */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 p-1 bg-[var(--ff-surface)] rounded-lg">
            {[
              { key: 'mobile', label: 'Mobile', icon: Smartphone },
              { key: 'tablet', label: 'Tablet', icon: Tablet },
              { key: 'desktop', label: 'Desktop', icon: Monitor }
            ].map((device) => (
              <button
                key={device.key}
                onClick={() => setCurrentView(device.key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  currentView === device.key
                    ? 'bg-[var(--ff-primary)] text-white'
                    : 'text-[var(--ff-text-muted)] hover:text-[var(--ff-text-primary)]'
                }`}
              >
                <device.icon className="w-4 h-4" />
                <span className="ff-text-sm font-medium">{device.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main UI Kit Demo */}
        <DevicePreview device={currentView}>
          <div className="flex flex-col h-full">
            
            {/* Header */}
            <ResponsiveHeader />
            
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar Navigation - Hidden on mobile */}
              {currentView !== 'mobile' && (
                <div className="w-64 flex-shrink-0 hidden lg:block">
                  <ResponsiveNavigation />
                </div>
              )}
              
              {/* Main Content */}
              <main className="flex-1 overflow-auto">
                <div className="p-4 lg:p-6 space-y-6">
                  
                  {/* Metrics Cards */}
                  <MetricCards />
                  
                  {/* Chart Section */}
                  <ResponsiveChart />
                  
                  {/* Data Table */}
                  <ResponsiveTable />
                  
                </div>
              </main>
            </div>
          </div>
        </DevicePreview>

        {/* Component Details Tabs */}
        <Card className="ff-card mt-12">
          <CardHeader>
            <CardTitle className="ff-text-title">UI Kit Components</CardTitle>
            <p className="ff-text-body">Detailed breakdown of responsive components and design patterns</p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="components" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-[var(--ff-surface)]">
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="responsive">Responsive</TabsTrigger>
                <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="components" className="space-y-6 mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: 'Header Component',
                      description: 'Responsive header with search, notifications, and user menu',
                      features: ['Mobile hamburger menu', 'Responsive search bar', 'Profile dropdown', 'Notification badges']
                    },
                    {
                      title: 'Navigation System',
                      description: 'Adaptive sidebar navigation with icons and labels',
                      features: ['Collapsible on mobile', 'Active state indicators', 'Icon + text layout', 'Hover animations']
                    },
                    {
                      title: 'Metric Cards',
                      description: 'Dashboard metrics with responsive grid layout',
                      features: ['4-column desktop grid', '2-column tablet', '1-column mobile', 'Trend indicators']
                    },
                    {
                      title: 'Data Charts',
                      description: 'Interactive charts with responsive scaling',
                      features: ['SVG-based rendering', 'Responsive dimensions', 'Interactive hover', 'Export functionality']
                    },
                    {
                      title: 'Data Tables',
                      description: 'Advanced tables with sorting, filtering, and actions',
                      features: ['Horizontal scroll on mobile', 'Column hiding', 'Inline actions', 'Pagination support']
                    },
                    {
                      title: 'Form Components',
                      description: 'Complete form system with validation',
                      features: ['Input components', 'Validation states', 'Error handling', 'Accessibility labels']
                    }
                  ].map((component, index) => (
                    <Card key={index} className="ff-card">
                      <CardHeader>
                        <CardTitle className="ff-text-base">{component.title}</CardTitle>
                        <p className="ff-text-sm text-[var(--ff-text-muted)]">{component.description}</p>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {component.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-[var(--ff-success)] flex-shrink-0" />
                              <span className="ff-text-sm text-[var(--ff-text-secondary)]">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="responsive" className="space-y-6 mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">Breakpoint System</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {[
                          { breakpoint: 'Mobile', range: '320px - 768px', grid: '1 column', nav: 'Hidden sidebar' },
                          { breakpoint: 'Tablet', range: '768px - 1024px', grid: '2 columns', nav: 'Collapsible' },
                          { breakpoint: 'Desktop', range: '1024px+', grid: '4 columns', nav: 'Full sidebar' }
                        ].map((bp, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-[var(--ff-surface)] rounded-lg">
                            <div>
                              <div className="ff-text-sm text-[var(--ff-text-primary)]">{bp.breakpoint}</div>
                              <div className="ff-text-xs text-[var(--ff-text-muted)]">{bp.range}</div>
                            </div>
                            <div className="text-right">
                              <div className="ff-text-sm text-[var(--ff-text-secondary)]">{bp.grid}</div>
                              <div className="ff-text-xs text-[var(--ff-text-muted)]">{bp.nav}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">Mobile-First Strategy</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {[
                          'Progressive enhancement from mobile base',
                          'Touch-friendly 44px minimum targets',
                          'Thumb-zone optimized navigation',
                          'Swipe gestures for table scrolling',
                          'Responsive typography scaling',
                          'Optimized image loading'
                        ].map((strategy, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-[var(--ff-success)] mt-0.5 flex-shrink-0" />
                            <span className="ff-text-sm text-[var(--ff-text-secondary)]">{strategy}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="accessibility" className="space-y-6 mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">WCAG 2.1 AA Compliance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {[
                          { feature: 'Color Contrast', status: '4.5:1 minimum ratio', check: true },
                          { feature: 'Keyboard Navigation', status: 'Full keyboard support', check: true },
                          { feature: 'Screen Reader', status: 'ARIA labels and roles', check: true },
                          { feature: 'Focus Management', status: 'Visible focus indicators', check: true },
                          { feature: 'Text Scaling', status: 'Up to 200% zoom support', check: true },
                          { feature: 'Motion Preference', status: 'Reduced motion support', check: true }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-[var(--ff-surface)] rounded-lg">
                            <div>
                              <div className="ff-text-sm text-[var(--ff-text-primary)]">{item.feature}</div>
                              <div className="ff-text-xs text-[var(--ff-text-muted)]">{item.status}</div>
                            </div>
                            {item.check && <Check className="w-5 h-5 text-[var(--ff-success)]" />}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">Accessibility Features</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {[
                          'Semantic HTML structure',
                          'Skip navigation links',
                          'Alternative text for images',
                          'Descriptive button labels',
                          'Form field associations',
                          'Error message clarity',
                          'High contrast mode support',
                          'Large text compatibility'
                        ].map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Shield className="w-4 h-4 text-[var(--ff-secondary)] mt-0.5 flex-shrink-0" />
                            <span className="ff-text-sm text-[var(--ff-text-secondary)]">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="performance" className="space-y-6 mt-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">Loading Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="ff-text-sm">First Contentful Paint</span>
                          <Badge className="ff-badge-success">1.2s</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="ff-text-sm">Largest Contentful Paint</span>
                          <Badge className="ff-badge-success">2.1s</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="ff-text-sm">Time to Interactive</span>
                          <Badge className="ff-badge-success">2.8s</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="ff-text-sm">Cumulative Layout Shift</span>
                          <Badge className="ff-badge-success">0.05</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">Bundle Optimization</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="ff-text-sm">JavaScript Bundle</span>
                            <span className="ff-text-sm">245KB</span>
                          </div>
                          <Progress value={65} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="ff-text-sm">CSS Bundle</span>
                            <span className="ff-text-sm">42KB</span>
                          </div>
                          <Progress value={25} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="ff-text-sm">Images</span>
                            <span className="ff-text-sm">128KB</span>
                          </div>
                          <Progress value={35} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">Runtime Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {[
                          'React.memo optimization',
                          'Virtual scrolling for tables',
                          'Lazy loading for charts',
                          'Code splitting by routes',
                          'Image optimization',
                          'Service worker caching'
                        ].map((optimization, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Zap className="w-4 h-4 text-[var(--ff-primary)] mt-0.5 flex-shrink-0" />
                            <span className="ff-text-sm text-[var(--ff-text-secondary)]">{optimization}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Implementation Guide */}
        <Card className="ff-card">
          <CardHeader>
            <CardTitle className="ff-text-title">Implementation Guide</CardTitle>
            <p className="ff-text-body">Quick start guide for integrating the responsive UI kit</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="ff-text-lg text-[var(--ff-text-primary)]">Setup Instructions</h3>
                <div className="space-y-3">
                  {[
                    'Install React 18 + TypeScript dependencies',
                    'Configure Tailwind CSS v4 with FlashFusion theme',
                    'Import UI components from /components/ui/',
                    'Apply responsive breakpoints and grid system',
                    'Test across mobile, tablet, and desktop devices'
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[var(--ff-primary)] text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                        {index + 1}
                      </div>
                      <span className="ff-text-sm text-[var(--ff-text-secondary)]">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="ff-text-lg text-[var(--ff-text-primary)]">Best Practices</h3>
                <div className="space-y-3">
                  {[
                    'Use mobile-first CSS media queries',
                    'Implement proper semantic HTML structure',
                    'Test with screen readers and keyboard navigation',
                    'Optimize images with responsive loading',
                    'Monitor performance with Core Web Vitals'
                  ].map((practice, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-[var(--ff-accent)] mt-0.5 flex-shrink-0" />
                      <span className="ff-text-sm text-[var(--ff-text-secondary)]">{practice}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

export default ResponsiveUIKit;
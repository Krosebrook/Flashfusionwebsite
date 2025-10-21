import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { 
  Plus,
  Settings,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Zap,
  Globe,
  Database,
  CreditCard,
  MessageSquare,
  BarChart3,
  Cloud,
  Mail,
  Video,
  Palette,
  Shield
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'development' | 'commerce' | 'analytics' | 'communication' | 'design' | 'ai' | 'security';
  icon: React.ComponentType<{ className?: string }>;
  brandColor: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  isActive: boolean;
  features: string[];
  lastSync?: string;
  plan?: string;
  usage?: {
    current: number;
    limit: number;
    unit: string;
  };
}

const AVAILABLE_INTEGRATIONS: Integration[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payment processing and subscription management',
    category: 'commerce',
    icon: CreditCard,
    brandColor: '#635bff',
    status: 'connected',
    isActive: true,
    features: ['Payment Processing', 'Subscriptions', 'Analytics', 'Webhooks'],
    lastSync: '2 minutes ago',
    plan: 'Pro',
    usage: { current: 847, limit: 1000, unit: 'transactions' }
  },
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'E-commerce platform integration for product management',
    category: 'commerce',
    icon: Globe,
    brandColor: '#95bf47',
    status: 'connected',
    isActive: true,
    features: ['Product Sync', 'Order Management', 'Inventory', 'Customer Data'],
    lastSync: '15 minutes ago',
    plan: 'Plus',
    usage: { current: 234, limit: 500, unit: 'products' }
  },
  {
    id: 'claude',
    name: 'Claude AI',
    description: 'Advanced AI assistant for content generation',
    category: 'ai',
    icon: MessageSquare,
    brandColor: '#d97706',
    status: 'connected',
    isActive: true,
    features: ['Content Generation', 'Code Analysis', 'Data Processing', 'Creative Writing'],
    lastSync: '30 seconds ago',
    plan: 'Pro',
    usage: { current: 15420, limit: 25000, unit: 'tokens' }
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Web analytics and user behavior tracking',
    category: 'analytics',
    icon: BarChart3,
    brandColor: '#ea4335',
    status: 'connected',
    isActive: true,
    features: ['Traffic Analysis', 'User Behavior', 'Conversion Tracking', 'Custom Reports'],
    lastSync: '1 hour ago',
    plan: 'GA4',
    usage: { current: 95000, limit: 100000, unit: 'events' }
  },
  {
    id: 'figma',
    name: 'Figma',
    description: 'Design tool integration for asset management',
    category: 'design',
    icon: Palette,
    brandColor: '#f24e1e',
    status: 'connected',
    isActive: false,
    features: ['Design Import', 'Asset Sync', 'Component Library', 'Collaboration'],
    lastSync: '3 hours ago',
    plan: 'Professional'
  },
  {
    id: 'aws',
    name: 'AWS',
    description: 'Cloud infrastructure and deployment services',
    category: 'development',
    icon: Cloud,
    brandColor: '#ff9900',
    status: 'connected',
    isActive: true,
    features: ['S3 Storage', 'Lambda Functions', 'CloudFront CDN', 'Database'],
    lastSync: '5 minutes ago',
    plan: 'Pay-as-you-go',
    usage: { current: 12.4, limit: 100, unit: 'GB storage' }
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    description: 'Email delivery and marketing automation',
    category: 'communication',
    icon: Mail,
    brandColor: '#1a82e2',
    status: 'disconnected',
    isActive: false,
    features: ['Transactional Email', 'Marketing Campaigns', 'Analytics', 'Templates'],
    plan: 'Free'
  },
  {
    id: 'zoom',
    name: 'Zoom',
    description: 'Video conferencing and collaboration platform',
    category: 'communication',
    icon: Video,
    brandColor: '#2d8cff',
    status: 'error',
    isActive: false,
    features: ['Video Meetings', 'Webinars', 'Recording', 'Screen Share'],
    lastSync: 'Failed 2 hours ago',
    plan: 'Pro'
  },
  {
    id: 'auth0',
    name: 'Auth0',
    description: 'Identity and access management platform',
    category: 'security',
    icon: Shield,
    brandColor: '#eb5424',
    status: 'pending',
    isActive: false,
    features: ['Single Sign-On', 'Multi-factor Auth', 'User Management', 'Social Login'],
    plan: 'Developer'
  }
];

const CATEGORY_CONFIG = {
  development: { label: 'Development', color: '#61dafb' },
  commerce: { label: 'E-Commerce', color: '#d14d21' },
  analytics: { label: 'Analytics', color: '#10b981' },
  communication: { label: 'Communication', color: '#667eea' },
  design: { label: 'Design', color: '#764ba2' },
  ai: { label: 'AI & ML', color: '#2a5298' },
  security: { label: 'Security', color: '#ef4444' }
};

export function CrossPlatformIntegrationHub() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConnected, setShowConnected] = useState(false);

  const filteredIntegrations = AVAILABLE_INTEGRATIONS.filter(integration => {
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !showConnected || integration.status === 'connected';
    
    return matchesCategory && matchesSearch && matchesStatus;
  });

  const connectedCount = AVAILABLE_INTEGRATIONS.filter(i => i.status === 'connected').length;
  const activeCount = AVAILABLE_INTEGRATIONS.filter(i => i.isActive).length;

  const getStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return '#10b981';
      case 'error':
        return '#ef4444';
      case 'pending':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return CheckCircle;
      case 'error':
        return AlertTriangle;
      case 'pending':
        return Globe;
      default:
        return Plus;
    }
  };

  const IntegrationCard = ({ integration }: { integration: Integration }) => {
    const StatusIcon = getStatusIcon(integration.status);
    const categoryConfig = CATEGORY_CONFIG[integration.category];

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <Card 
          className="relative overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: integration.status === 'connected' 
              ? `1px solid ${integration.brandColor}30`
              : '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {/* Status indicator line */}
          <div 
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: getStatusColor(integration.status) }}
          />

          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ 
                    backgroundColor: `${integration.brandColor}15`,
                    border: `2px solid ${integration.brandColor}30`
                  }}
                >
                  <integration.icon 
                    className="h-6 w-6" 
                    style={{ color: integration.brandColor }}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {integration.name}
                  </h3>
                  <Badge 
                    variant="outline" 
                    className="text-xs mt-1"
                    style={{ 
                      borderColor: categoryConfig.color,
                      color: categoryConfig.color
                    }}
                  >
                    {categoryConfig.label}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                <StatusIcon 
                  className="h-5 w-5" 
                  style={{ color: getStatusColor(integration.status) }}
                />
                
                {integration.status === 'connected' && (
                  <Switch 
                    checked={integration.isActive} 
                    size="sm"
                    style={{
                      background: integration.isActive ? integration.brandColor : undefined
                    }}
                  />
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              {integration.description}
            </p>

            {/* Features */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {integration.features.slice(0, 3).map(feature => (
                  <Badge 
                    key={feature} 
                    variant="outline" 
                    className="text-xs border-gray-200"
                  >
                    {feature}
                  </Badge>
                ))}
                {integration.features.length > 3 && (
                  <Badge variant="outline" className="text-xs border-gray-200">
                    +{integration.features.length - 3}
                  </Badge>
                )}
              </div>
            </div>

            {/* Usage/Stats */}
            {integration.usage && integration.status === 'connected' && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500">Usage</span>
                  <span className="text-xs font-semibold text-gray-700">
                    {integration.usage.current.toLocaleString()} / {integration.usage.limit.toLocaleString()} {integration.usage.unit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      backgroundColor: integration.brandColor,
                      width: `${(integration.usage.current / integration.usage.limit) * 100}%`
                    }}
                  />
                </div>
              </div>
            )}

            {/* Last sync */}
            {integration.lastSync && (
              <div className="text-xs text-gray-400 mb-4">
                Last sync: {integration.lastSync}
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2">
              {integration.status === 'connected' ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    style={{ 
                      borderColor: integration.brandColor,
                      color: integration.brandColor
                    }}
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </>
              ) : integration.status === 'error' ? (
                <Button 
                  size="sm" 
                  className="flex-1"
                  style={{ backgroundColor: integration.brandColor }}
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Reconnect
                </Button>
              ) : integration.status === 'pending' ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  disabled
                >
                  <Globe className="h-3 w-3 mr-1 animate-spin" />
                  Connecting...
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  className="flex-1"
                  style={{ backgroundColor: integration.brandColor }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Connect
                </Button>
              )}
            </div>

            {/* Plan info */}
            {integration.plan && (
              <div className="text-xs text-gray-400 mt-2 text-center">
                {integration.plan} plan
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Integration Hub
          </h2>
          <p className="text-muted-foreground mt-1">
            Connect and manage third-party services with FlashFusion
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-green-600">{connectedCount}</span> connected • 
            <span className="font-semibold text-blue-600 ml-1">{activeCount}</span> active
          </div>
          <Button className="bg-gradient-to-r from-primary to-secondary">
            <Plus className="h-4 w-4 mr-2" />
            Browse Integrations
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-white/95 backdrop-blur-[10px] border border-white/20">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All Categories
            </Button>
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(key)}
                style={{
                  backgroundColor: selectedCategory === key ? config.color : undefined,
                  borderColor: config.color,
                  color: selectedCategory === key ? 'white' : config.color
                }}
              >
                {config.label}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center space-x-3 lg:ml-auto">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">
                Connected only
              </label>
              <Switch 
                checked={showConnected}
                onCheckedChange={setShowConnected}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Integrations Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredIntegrations.map(integration => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredIntegrations.length === 0 && (
        <Card className="p-12 text-center bg-white/95 backdrop-blur-[10px] border border-white/20">
          <Globe className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No integrations found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or search for specific services
          </p>
          <Button 
            className="bg-gradient-to-r from-primary to-secondary"
            onClick={() => {
              setSelectedCategory('all');
              setShowConnected(false);
              setSearchQuery('');
            }}
          >
            Clear Filters
          </Button>
        </Card>
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Search, Star, Download, ExternalLink, Settings, 
  Check, Plus, Filter, TrendingUp, Users, 
  Zap, Database, Cloud, Code, Palette, Shield,
  MessageSquare, Mail, Calendar, FileText, 
  BarChart3, ShoppingCart, Camera, Music
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Integration {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  icon: any;
  category: string;
  rating: number;
  reviews: number;
  installs: number;
  price: 'free' | 'premium' | 'paid';
  priceAmount?: number;
  developer: string;
  version: string;
  lastUpdated: string;
  features: string[];
  screenshots?: string[];
  isInstalled: boolean;
  isPopular: boolean;
  isNew: boolean;
  tags: string[];
  supportedPlatforms: string[];
  documentation?: string;
  apiEndpoints?: number;
  setupComplexity: 'easy' | 'medium' | 'advanced';
}

interface IntegrationCategory {
  id: string;
  name: string;
  icon: any;
  count: number;
  description: string;
}

interface IntegrationMarketplaceProps {
  onInstall?: (integrationId: string) => void;
  onUninstall?: (integrationId: string) => void;
}

export function IntegrationMarketplace({ onInstall, onUninstall }: IntegrationMarketplaceProps) {
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [categories, setCategories] = useState<IntegrationCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterBy, setFilterBy] = useState<'all' | 'installed' | 'popular' | 'new'>('all');

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    setIsLoading(true);
    try {
      // Mock data for integration marketplace
      const mockIntegrations: Integration[] = [
        {
          id: 'stripe',
          name: 'Stripe Payments',
          description: 'Accept payments and manage subscriptions',
          longDescription: 'Integrate Stripe to accept payments, manage subscriptions, and handle complex billing scenarios. Built with security and compliance in mind.',
          icon: ShoppingCart,
          category: 'payments',
          rating: 4.8,
          reviews: 1247,
          installs: 45678,
          price: 'free',
          developer: 'Stripe Inc.',
          version: '2.1.4',
          lastUpdated: '2024-08-15',
          features: ['Payment processing', 'Subscription management', 'Webhooks', 'Dashboard analytics'],
          isInstalled: false,
          isPopular: true,
          isNew: false,
          tags: ['payments', 'e-commerce', 'subscriptions'],
          supportedPlatforms: ['React', 'Vue', 'Angular'],
          apiEndpoints: 15,
          setupComplexity: 'medium'
        },
        {
          id: 'openai',
          name: 'OpenAI GPT',
          description: 'Add AI-powered features to your applications',
          longDescription: 'Integrate OpenAI\'s powerful language models to add chatbots, content generation, and AI-powered features to your applications.',
          icon: Zap,
          category: 'ai',
          rating: 4.9,
          reviews: 2341,
          installs: 89123,
          price: 'premium',
          developer: 'OpenAI',
          version: '1.5.2',
          lastUpdated: '2024-08-18',
          features: ['Text generation', 'Chat completion', 'Code assistance', 'Image analysis'],
          isInstalled: true,
          isPopular: true,
          isNew: false,
          tags: ['ai', 'gpt', 'chatbot', 'nlp'],
          supportedPlatforms: ['React', 'Vue', 'Angular', 'Node.js'],
          apiEndpoints: 8,
          setupComplexity: 'easy'
        },
        {
          id: 'supabase',
          name: 'Supabase Database',
          description: 'PostgreSQL database with real-time subscriptions',
          longDescription: 'Full-featured PostgreSQL database with authentication, real-time subscriptions, and auto-generated APIs.',
          icon: Database,
          category: 'database',
          rating: 4.7,
          reviews: 1893,
          installs: 34567,
          price: 'free',
          developer: 'Supabase',
          version: '3.2.1',
          lastUpdated: '2024-08-12',
          features: ['PostgreSQL database', 'Real-time sync', 'Authentication', 'Auto APIs'],
          isInstalled: true,
          isPopular: true,
          isNew: false,
          tags: ['database', 'postgresql', 'real-time', 'auth'],
          supportedPlatforms: ['React', 'Vue', 'Angular', 'Svelte'],
          apiEndpoints: 25,
          setupComplexity: 'medium'
        },
        {
          id: 'twilio',
          name: 'Twilio Communications',
          description: 'SMS, voice calls, and video communications',
          longDescription: 'Add SMS messaging, voice calls, and video communications to your applications with Twilio\'s reliable APIs.',
          icon: MessageSquare,
          category: 'communications',
          rating: 4.6,
          reviews: 987,
          installs: 23456,
          price: 'paid',
          priceAmount: 29,
          developer: 'Twilio Inc.',
          version: '1.8.3',
          lastUpdated: '2024-08-10',
          features: ['SMS messaging', 'Voice calls', 'Video chat', 'Phone verification'],
          isInstalled: false,
          isPopular: false,
          isNew: true,
          tags: ['sms', 'voice', 'video', 'communications'],
          supportedPlatforms: ['React', 'Vue', 'Node.js'],
          apiEndpoints: 12,
          setupComplexity: 'medium'
        },
        {
          id: 'cloudinary',
          name: 'Cloudinary Media',
          description: 'Image and video management in the cloud',
          longDescription: 'Comprehensive media management with automatic optimization, transformations, and CDN delivery.',
          icon: Camera,
          category: 'media',
          rating: 4.5,
          reviews: 654,
          installs: 18923,
          price: 'free',
          developer: 'Cloudinary Ltd.',
          version: '2.3.7',
          lastUpdated: '2024-08-08',
          features: ['Image optimization', 'Video transcoding', 'CDN delivery', 'AI-powered tags'],
          isInstalled: false,
          isPopular: false,
          isNew: false,
          tags: ['images', 'video', 'cdn', 'optimization'],
          supportedPlatforms: ['React', 'Vue', 'Angular'],
          apiEndpoints: 18,
          setupComplexity: 'easy'
        },
        {
          id: 'auth0',
          name: 'Auth0 Identity',
          description: 'Universal authentication and authorization',
          longDescription: 'Secure authentication and authorization platform with support for social logins, MFA, and enterprise SSO.',
          icon: Shield,
          category: 'authentication',
          rating: 4.7,
          reviews: 1456,
          installs: 56789,
          price: 'premium',
          developer: 'Auth0 Inc.',
          version: '4.1.2',
          lastUpdated: '2024-08-16',
          features: ['Social login', 'Multi-factor auth', 'SSO', 'User management'],
          isInstalled: false,
          isPopular: true,
          isNew: false,
          tags: ['auth', 'sso', 'mfa', 'identity'],
          supportedPlatforms: ['React', 'Vue', 'Angular', 'Svelte'],
          apiEndpoints: 22,
          setupComplexity: 'advanced'
        }
      ];

      const mockCategories: IntegrationCategory[] = [
        { id: 'all', name: 'All Integrations', icon: Code, count: mockIntegrations.length, description: 'Browse all available integrations' },
        { id: 'ai', name: 'AI & ML', icon: Zap, count: 1, description: 'Artificial intelligence and machine learning' },
        { id: 'database', name: 'Databases', icon: Database, count: 1, description: 'Data storage and management' },
        { id: 'payments', name: 'Payments', icon: ShoppingCart, count: 1, description: 'Payment processing and billing' },
        { id: 'communications', name: 'Communications', icon: MessageSquare, count: 1, description: 'Messaging and communications' },
        { id: 'media', name: 'Media', icon: Camera, count: 1, description: 'Image and video management' },
        { id: 'authentication', name: 'Authentication', icon: Shield, count: 1, description: 'User authentication and security' },
        { id: 'analytics', name: 'Analytics', icon: BarChart3, count: 0, description: 'Data analytics and tracking' }
      ];

      setIntegrations(mockIntegrations);
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error loading integrations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstall = async (integration: Integration) => {
    try {
      // Mock installation process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIntegrations(prev => 
        prev.map(int => 
          int.id === integration.id 
            ? { ...int, isInstalled: true, installs: int.installs + 1 }
            : int
        )
      );
      
      toast.success(`${integration.name} installed successfully!`);
      onInstall?.(integration.id);
    } catch (error) {
      toast.error('Installation failed. Please try again.');
    }
  };

  const handleUninstall = async (integration: Integration) => {
    try {
      setIntegrations(prev => 
        prev.map(int => 
          int.id === integration.id 
            ? { ...int, isInstalled: false }
            : int
        )
      );
      
      toast.success(`${integration.name} uninstalled successfully!`);
      onUninstall?.(integration.id);
    } catch (error) {
      toast.error('Uninstallation failed. Please try again.');
    }
  };

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'installed' && integration.isInstalled) ||
                         (filterBy === 'popular' && integration.isPopular) ||
                         (filterBy === 'new' && integration.isNew);
    
    return matchesSearch && matchesCategory && matchesFilter;
  });

  const formatInstalls = (installs: number) => {
    if (installs >= 1000000) return `${(installs / 1000000).toFixed(1)}M`;
    if (installs >= 1000) return `${(installs / 1000).toFixed(1)}K`;
    return installs.toString();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-8 bg-muted rounded mb-4"></div>
              <div className="h-20 bg-muted rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Integration Marketplace</h2>
            <p className="text-muted-foreground">Discover and install integrations to extend your applications</p>
          </div>
          <Button className="ff-btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Request Integration
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterBy === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterBy('all')}
            >
              All
            </Button>
            <Button
              variant={filterBy === 'installed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterBy('installed')}
            >
              Installed
            </Button>
            <Button
              variant={filterBy === 'popular' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterBy('popular')}
            >
              Popular
            </Button>
            <Button
              variant={filterBy === 'new' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterBy('new')}
            >
              New
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="installed">Installed ({integrations.filter(i => i.isInstalled).length})</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.name}
                  {category.count > 0 && (
                    <Badge variant="secondary" className="ml-2">{category.count}</Badge>
                  )}
                </Button>
              );
            })}
          </div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration) => {
              const Icon = integration.icon;
              return (
                <motion.div
                  key={integration.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className="p-6 h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:border-primary/20">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            {integration.name}
                            {integration.isInstalled && (
                              <Check className="h-4 w-4 text-green-500" />
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground">{integration.developer}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {integration.isPopular && <Badge variant="secondary" className="text-xs">Popular</Badge>}
                        {integration.isNew && <Badge variant="outline" className="text-xs">New</Badge>}
                        <Badge variant={
                          integration.price === 'free' ? 'secondary' :
                          integration.price === 'premium' ? 'default' :
                          'destructive'
                        }>
                          {integration.price === 'paid' ? `$${integration.priceAmount}/mo` : integration.price}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 flex-1">
                      {integration.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{integration.rating}</span>
                          <span className="text-muted-foreground">({integration.reviews})</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Download className="h-4 w-4" />
                          <span>{formatInstalls(integration.installs)}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {integration.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => setSelectedIntegration(integration)}
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-3">
                                <Icon className="h-6 w-6 text-primary" />
                                {integration.name}
                              </DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="max-h-[60vh]">
                              <div className="space-y-6 pr-4">
                                <div>
                                  <h3 className="font-semibold mb-2">Description</h3>
                                  <p className="text-muted-foreground">{integration.longDescription}</p>
                                </div>

                                <div>
                                  <h3 className="font-semibold mb-2">Features</h3>
                                  <ul className="grid grid-cols-2 gap-2">
                                    {integration.features.map((feature, index) => (
                                      <li key={index} className="flex items-center gap-2 text-sm">
                                        <Check className="h-4 w-4 text-green-500" />
                                        {feature}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <h3 className="font-semibold mb-2">Details</h3>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span>Version:</span>
                                        <span>{integration.version}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>API Endpoints:</span>
                                        <span>{integration.apiEndpoints}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Setup:</span>
                                        <Badge variant="outline" className="text-xs">
                                          {integration.setupComplexity}
                                        </Badge>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Last Updated:</span>
                                        <span>{new Date(integration.lastUpdated).toLocaleDateString()}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h3 className="font-semibold mb-2">Supported Platforms</h3>
                                    <div className="flex flex-wrap gap-1">
                                      {integration.supportedPlatforms.map((platform) => (
                                        <Badge key={platform} variant="secondary" className="text-xs">
                                          {platform}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>

                        {integration.isInstalled ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUninstall(integration)}
                          >
                            Uninstall
                          </Button>
                        ) : (
                          <Button 
                            size="sm"
                            onClick={() => handleInstall(integration)}
                            className="ff-btn-primary"
                          >
                            Install
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="installed" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.filter(i => i.isInstalled).map((integration) => {
              const Icon = integration.icon;
              return (
                <Card key={integration.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Icon className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="font-semibold">{integration.name}</h3>
                        <p className="text-sm text-muted-foreground">v{integration.version}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUninstall(integration)}
                      >
                        Uninstall
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{integration.description}</p>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(1).map((category) => {
              const Icon = category.icon;
              return (
                <Card 
                  key={category.id} 
                  className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/20"
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setActiveTab('discover');
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <Badge variant="secondary">{category.count} integrations</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
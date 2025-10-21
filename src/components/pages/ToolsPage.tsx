import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Code, 
  ShoppingCart, 
  FileText, 
  Rocket, 
  Search,
  Filter,
  Download,
  Star,
  TrendingUp,
  Zap,
  Image,
  Smartphone,
  Globe,
  Database,
  Palette,
  Brain
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<any>;
  rating: number;
  downloads: string;
  isPremium: boolean;
  isNew: boolean;
  route: string;
}

const tools: Tool[] = [
  // Code Generation
  {
    id: 'code-generator',
    name: 'AI Code Generator',
    description: 'Generate production-ready applications across multiple frameworks',
    category: 'development',
    icon: Code,
    rating: 4.9,
    downloads: '12.5K',
    isPremium: false,
    isNew: false,
    route: '/tools/code-generator'
  },
  {
    id: 'react-builder',
    name: 'React App Builder',
    description: 'Build complete React applications with components and routing',
    category: 'development',
    icon: Code,
    rating: 4.8,
    downloads: '8.2K',
    isPremium: false,
    isNew: true,
    route: '/tools/react-builder'
  },
  {
    id: 'api-generator',
    name: 'API Generator',
    description: 'Create REST APIs with authentication and database integration',
    category: 'development',
    icon: Database,
    rating: 4.7,
    downloads: '6.1K',
    isPremium: true,
    isNew: false,
    route: '/tools/api-generator'
  },

  // E-commerce
  {
    id: 'ecommerce-store',
    name: 'eCommerce Store Builder',
    description: 'Create complete online stores for any platform',
    category: 'ecommerce',
    icon: ShoppingCart,
    rating: 4.9,
    downloads: '15.3K',
    isPremium: false,
    isNew: false,
    route: '/tools/ecommerce-generator'
  },
  {
    id: 'product-catalog',
    name: 'Product Catalog Generator',
    description: 'Generate product listings with descriptions and images',
    category: 'ecommerce',
    icon: ShoppingCart,
    rating: 4.6,
    downloads: '9.8K',
    isPremium: false,
    isNew: false,
    route: '/tools/product-catalog'
  },
  {
    id: 'payment-integration',
    name: 'Payment Gateway Setup',
    description: 'Integrate Stripe, PayPal, and other payment processors',
    category: 'ecommerce',
    icon: ShoppingCart,
    rating: 4.8,
    downloads: '7.4K',
    isPremium: true,
    isNew: true,
    route: '/tools/payment-setup'
  },

  // Content Creation
  {
    id: 'content-generator',
    name: 'AI Content Generator',
    description: 'Create blog posts, social media content, and marketing copy',
    category: 'content',
    icon: FileText,
    rating: 4.8,
    downloads: '22.1K',
    isPremium: false,
    isNew: false,
    route: '/tools/content-generator'
  },
  {
    id: 'blog-writer',
    name: 'Blog Post Writer',
    description: 'Generate SEO-optimized blog posts and articles',
    category: 'content',
    icon: FileText,
    rating: 4.7,
    downloads: '18.5K',
    isPremium: false,
    isNew: false,
    route: '/tools/blog-writer'
  },
  {
    id: 'social-media',
    name: 'Social Media Manager',
    description: 'Create posts for all major social media platforms',
    category: 'content',
    icon: FileText,
    rating: 4.6,
    downloads: '14.2K',
    isPremium: true,
    isNew: true,
    route: '/tools/social-media'
  },

  // Design & Visual
  {
    id: 'logo-generator',
    name: 'AI Logo Generator',
    description: 'Create professional logos and brand assets',
    category: 'design',
    icon: Palette,
    rating: 4.5,
    downloads: '11.7K',
    isPremium: false,
    isNew: false,
    route: '/tools/logo-generator'
  },
  {
    id: 'image-generator',
    name: 'AI Image Generator',
    description: 'Generate custom images for any purpose',
    category: 'design',
    icon: Image,
    rating: 4.8,
    downloads: '19.3K',
    isPremium: true,
    isNew: true,
    route: '/tools/image-generator'
  },
  {
    id: 'ui-components',
    name: 'UI Component Library',
    description: 'Generate reusable UI components and design systems',
    category: 'design',
    icon: Palette,
    rating: 4.7,
    downloads: '8.9K',
    isPremium: false,
    isNew: false,
    route: '/tools/ui-components'
  },

  // Mobile & Apps
  {
    id: 'mobile-app',
    name: 'Mobile App Builder',
    description: 'Create native mobile apps for iOS and Android',
    category: 'mobile',
    icon: Smartphone,
    rating: 4.6,
    downloads: '13.4K',
    isPremium: true,
    isNew: true,
    route: '/tools/mobile-app'
  },
  {
    id: 'pwa-generator',
    name: 'PWA Generator',
    description: 'Build Progressive Web Apps with offline support',
    category: 'mobile',
    icon: Smartphone,
    rating: 4.5,
    downloads: '7.8K',
    isPremium: false,
    isNew: false,
    route: '/tools/pwa-generator'
  },

  // Deployment & CI/CD
  {
    id: 'cicd-pipeline',
    name: 'CI/CD Pipeline Setup',
    description: 'Automate deployment to multiple platforms',
    category: 'deployment',
    icon: Rocket,
    rating: 4.9,
    downloads: '10.2K',
    isPremium: false,
    isNew: false,
    route: '/tools/cicd-pipeline'
  },
  {
    id: 'docker-setup',
    name: 'Docker Configuration',
    description: 'Generate Docker files and container setups',
    category: 'deployment',
    icon: Rocket,
    rating: 4.7,
    downloads: '6.5K',
    isPremium: true,
    isNew: false,
    route: '/tools/docker-setup'
  },

  // AI & Analytics
  {
    id: 'ai-chatbot',
    name: 'AI Chatbot Builder',
    description: 'Create intelligent chatbots for customer support',
    category: 'ai',
    icon: Brain,
    rating: 4.8,
    downloads: '9.1K',
    isPremium: true,
    isNew: true,
    route: '/tools/ai-chatbot'
  },
  {
    id: 'analytics-dashboard',
    name: 'Analytics Dashboard',
    description: 'Build custom analytics and reporting dashboards',
    category: 'ai',
    icon: TrendingUp,
    rating: 4.6,
    downloads: '12.8K',
    isPremium: false,
    isNew: false,
    route: '/tools/analytics-dashboard'
  }
];

const categories = [
  { id: 'all', name: 'All Tools', icon: Zap },
  { id: 'development', name: 'Development', icon: Code },
  { id: 'ecommerce', name: 'E-commerce', icon: ShoppingCart },
  { id: 'content', name: 'Content', icon: FileText },
  { id: 'design', name: 'Design', icon: Palette },
  { id: 'mobile', name: 'Mobile', icon: Smartphone },
  { id: 'deployment', name: 'Deployment', icon: Rocket },
  { id: 'ai', name: 'AI & Analytics', icon: Brain }
];

function ToolsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredTools, setFilteredTools] = useState(tools);

  useEffect(() => {
    const filtered = tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredTools(filtered);
  }, [searchTerm, selectedCategory]);

  const handleToolClick = (tool: Tool) => {
    // Navigate to the specific tool - in a real app this would use React Router
    console.log('Navigating to:', tool.route);
    window.location.hash = tool.route;
  };

  const popularTools = tools.filter(tool => parseFloat(tool.downloads.replace('K', '')) > 10).slice(0, 6);
  const newTools = tools.filter(tool => tool.isNew).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Compact Header */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl sm:text-3xl font-bold ff-text-gradient">AI-Powered Tools</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          60+ production-ready tools to build, deploy, and scale your applications with AI
        </p>
      </div>

      {/* Compact Search and Filter */}
      <div className="bg-muted/20 p-4 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 ff-focus-ring bg-background"
            />
          </div>
          <Badge variant="outline" className="text-xs">
            {filteredTools.length} tools available
          </Badge>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {categories.slice(0, 6).map((category) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`text-xs ${selectedCategory === category.id ? "ff-btn-primary" : ""}`}
              >
                <IconComponent className="h-3 w-3 mr-1" />
                {category.name}
              </Button>
            );
          })}
        </div>
      </div>

      <Tabs defaultValue="all-tools" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-xl bg-muted/30 p-1">
            <TabsTrigger value="all-tools" className="text-sm">All Tools</TabsTrigger>
            <TabsTrigger value="popular" className="text-sm">Popular</TabsTrigger>
            <TabsTrigger value="new" className="text-sm">New</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all-tools" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Card 
                  key={tool.id} 
                  className="ff-card-interactive cursor-pointer group hover:bg-muted/20 p-3"
                  onClick={() => handleToolClick(tool)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex gap-1">
                        {tool.isNew && (
                          <Badge variant="secondary" className="text-xs bg-success/10 text-success">
                            New
                          </Badge>
                        )}
                        {tool.isPremium && (
                          <Badge variant="secondary" className="text-xs bg-warning/10 text-warning">
                            Pro
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{tool.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Download className="h-3 w-3" />
                        <span>{tool.downloads}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="popular" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {popularTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Card 
                  key={tool.id} 
                  className="ff-card-interactive cursor-pointer group"
                  onClick={() => handleToolClick(tool)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {tool.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{tool.rating}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {tool.downloads}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {tool.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="new" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {newTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Card 
                  key={tool.id} 
                  className="ff-card-interactive cursor-pointer group"
                  onClick={() => handleToolClick(tool)}
                >
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="mx-auto p-3 bg-primary/10 rounded-lg w-fit">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {tool.description}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        New
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Named export for internal use
export { ToolsPage };

// Default export for lazy loading
export default ToolsPage;
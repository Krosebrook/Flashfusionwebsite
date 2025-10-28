import React, { useState, Suspense, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { 
  Code, 
  Image, 
  FileText, 
  Zap, 
  Search, 
  Filter,
  Wand2,
  Workflow,
  Rocket,
  Eye,
  TrendingUp,
  Users,
  Settings,
  Grid,
  Loader2
} from 'lucide-react';

// Lazy load components for better performance
const FullStackBuilderTool = React.lazy(() => import('./FullStackBuilderTool'));
const EnhancedImageGenerator = React.lazy(() => import('./generation/EnhancedImageGenerator'));
const ContentGeneratorTool = React.lazy(() => import('./ContentGeneratorTool'));
const EnhancedWorkflowBuilder = React.lazy(() => import('./EnhancedWorkflowBuilder'));
const EnhancedCodeGenerator = React.lazy(() => import('./generation/EnhancedCodeGenerator'));
const AdvancedProductionDeployment = React.lazy(() => import('../deployment/AdvancedProductionDeployment'));
const LaunchPreparationHub = React.lazy(() => import('../launch/LaunchPreparationHub'));
const LaunchOptimizationDashboard = React.lazy(() => import('../launch/LaunchOptimizationDashboard'));

// Loading component
const LoadingComponent = () => (
  <div className="flex items-center justify-center py-12">
    <div className="flex items-center gap-3">
      <Loader2 className="w-6 h-6 animate-spin text-[var(--ff-primary)]" />
      <span className="text-[var(--ff-text-primary)]">Loading tool...</span>
    </div>
  </div>
);

interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'generation' | 'workflow' | 'deployment' | 'analytics' | 'content' | 'integration';
  icon: React.ReactNode;
  component: React.ComponentType;
  featured?: boolean;
  new?: boolean;
  popularity: number;
  tags: string[];
}

const TOOLS: Tool[] = [
  {
    id: 'full-stack-builder',
    name: 'Full-Stack App Builder',
    description: 'Generate complete applications with AI-powered development',
    category: 'generation',
    icon: <Code className="w-5 h-5" />,
    component: FullStackBuilderTool,
    featured: true,
    popularity: 95,
    tags: ['react', 'nextjs', 'supabase', 'fullstack', 'ai']
  },
  {
    id: 'enhanced-image-generator',
    name: 'AI Image Generator',
    description: 'Create stunning images with multiple AI models and professional controls',
    category: 'generation',
    icon: <Image className="w-5 h-5" />,
    component: EnhancedImageGenerator,
    featured: true,
    new: true,
    popularity: 92,
    tags: ['dall-e', 'midjourney', 'stable-diffusion', 'art', 'design']
  },
  {
    id: 'enhanced-workflow-builder',
    name: 'Advanced Workflow Builder',
    description: 'Build sophisticated LangChain, Graph, Forge, and Flow workflows',
    category: 'workflow',
    icon: <Workflow className="w-5 h-5" />,
    component: EnhancedWorkflowBuilder,
    featured: true,
    new: true,
    popularity: 89,
    tags: ['langchain', 'graph', 'forge', 'flow', 'automation']
  },
  {
    id: 'enhanced-code-generator',
    name: 'Enhanced Code Generator',
    description: 'Generate production-ready code with advanced AI models',
    category: 'generation',
    icon: <Zap className="w-5 h-5" />,
    component: EnhancedCodeGenerator,
    new: true,
    popularity: 87,
    tags: ['code', 'ai', 'typescript', 'react', 'api']
  },
  {
    id: 'content-generator',
    name: 'Content Generator',
    description: 'Create marketing content, blog posts, and copy with AI',
    category: 'content',
    icon: <FileText className="w-5 h-5" />,
    component: ContentGeneratorTool,
    popularity: 84,
    tags: ['content', 'marketing', 'copywriting', 'blog', 'social']
  },
  {
    id: 'production-deployment',
    name: 'Production Deployment',
    description: 'Enterprise-grade deployment pipeline with CI/CD automation',
    category: 'deployment',
    icon: <Rocket className="w-5 h-5" />,
    component: AdvancedProductionDeployment,
    new: true,
    popularity: 91,
    tags: ['deployment', 'cicd', 'production', 'monitoring', 'security']
  },
  {
    id: 'launch-preparation',
    name: 'Launch Preparation Hub',
    description: 'Comprehensive launch preparation with documentation and marketing',
    category: 'analytics',
    icon: <Settings className="w-5 h-5" />,
    component: LaunchPreparationHub,
    new: true,
    popularity: 86,
    tags: ['launch', 'documentation', 'marketing', 'support', 'legal']
  },
  {
    id: 'launch-optimization',
    name: 'Launch Analytics & Optimization',
    description: 'Real-time analytics and post-launch optimization dashboard',
    category: 'analytics',
    icon: <TrendingUp className="w-5 h-5" />,
    component: LaunchOptimizationDashboard,
    new: true,
    popularity: 88,
    tags: ['analytics', 'optimization', 'metrics', 'feedback', 'growth']
  }
];

export function AIToolsHub() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'name' | 'category'>('popularity');

  // Filter and sort tools
  const filteredTools = TOOLS
    .filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || tool.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'popularity':
        default:
          return b.popularity - a.popularity;
      }
    });

  const categories = Array.from(new Set(TOOLS.map(tool => tool.category)));

  const handleToolSelect = useCallback((toolId: string) => {
    setSelectedTool(toolId);
  }, []);

  const selectedToolData = selectedTool ? TOOLS.find(tool => tool.id === selectedTool) : null;

  if (selectedTool && selectedToolData) {
    const ToolComponent = selectedToolData.component;
    return (
      <div className="space-y-4" style={{ fontFamily: 'var(--ff-font-secondary)' }}>
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setSelectedTool(null)}
            variant="outline" 
            className="border-[var(--border)]"
          >
            ← Back to Tools
          </Button>
          <div className="flex items-center gap-2">
            {selectedToolData.icon}
            <h2 className="text-xl font-semibold text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-primary)' }}>
              {selectedToolData.name}
            </h2>
            {selectedToolData.new && (
              <Badge className="bg-[var(--ff-primary)] text-white">New</Badge>
            )}
            {selectedToolData.featured && (
              <Badge variant="outline" className="border-[var(--ff-accent)] text-[var(--ff-accent)]">Featured</Badge>
            )}
          </div>
        </div>
        
        <Suspense fallback={<LoadingComponent />}>
          <ToolComponent />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="space-y-8" style={{ fontFamily: 'var(--ff-font-secondary)' }}>
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-primary)' }}>
            AI Tools Hub
          </h1>
          <p className="text-xl text-[var(--ff-text-secondary)] max-w-3xl mx-auto">
            Transform your development workflow with our comprehensive suite of AI-powered tools. 
            From code generation to deployment automation, everything you need to build faster and smarter.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--ff-text-muted)] h-5 w-5" />
            <Input
              placeholder="Search tools by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-[var(--input-background)] border-[var(--border)] text-[var(--ff-text-primary)]"
            />
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-[var(--input-background)] border-[var(--border)] rounded-md text-[var(--ff-text-primary)]"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option value={category} key={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'popularity' | 'name' | 'category')}
              className="px-4 py-2 bg-[var(--input-background)] border-[var(--border)] rounded-md text-[var(--ff-text-primary)]"
            >
              <option value="popularity">Sort by Popularity</option>
              <option value="name">Sort by Name</option>
              <option value="category">Sort by Category</option>
            </select>
            
            <Button variant="outline" size="sm" className="border-[var(--border)]">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Tools */}
      {categoryFilter === 'all' && !searchQuery && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-primary)' }}>
            Featured Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TOOLS.filter(tool => tool.featured).map((tool) => (
              <Card key={tool.id} className="bg-[var(--ff-surface)] border-[var(--border)] hover:shadow-lg transition-all duration-200 cursor-pointer group" onClick={() => handleToolSelect(tool.id)}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--ff-primary)]/10 rounded-lg group-hover:bg-[var(--ff-primary)]/20 transition-colors">
                          {tool.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-[var(--ff-text-primary)]">{tool.name}</h3>
                          <Badge variant="outline" className="text-xs border-[var(--ff-accent)] text-[var(--ff-accent)]">
                            Featured
                          </Badge>
                        </div>
                      </div>
                      {tool.new && (
                        <Badge className="bg-[var(--ff-primary)] text-white">New</Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-[var(--ff-text-secondary)]">{tool.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {tool.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[var(--ff-text-muted)]">
                        <Eye className="w-3 h-3" />
                        <span>{tool.popularity}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Tools Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-primary)' }}>
            {categoryFilter === 'all' ? 'All Tools' : categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1) + ' Tools'} 
            <span className="text-[var(--ff-text-muted)] font-normal ml-2">
              ({filteredTools.length} tools)
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Card 
              key={tool.id} 
              className="bg-[var(--ff-surface)] border-[var(--border)] hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => handleToolSelect(tool.id)}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[var(--ff-primary)]/10 rounded-lg group-hover:bg-[var(--ff-primary)]/20 transition-colors">
                        {tool.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--ff-text-primary)]">{tool.name}</h3>
                        <Badge variant="outline" className="text-xs mt-1">
                          {tool.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      {tool.new && (
                        <Badge className="bg-[var(--ff-primary)] text-white text-xs">New</Badge>
                      )}
                      {tool.featured && (
                        <Badge variant="outline" className="text-xs border-[var(--ff-accent)] text-[var(--ff-accent)]">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-[var(--ff-text-secondary)] line-clamp-2">{tool.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {tool.tags.slice(0, 4).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {tool.tags.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{tool.tags.length - 4}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-[var(--ff-text-muted)]">
                        <TrendingUp className="w-3 h-3" />
                        <span>{tool.popularity}% popularity</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-[var(--ff-primary)] hover:bg-[var(--ff-primary-600)] text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToolSelect(tool.id);
                        }}
                      >
                        <Wand2 className="w-3 h-3 mr-1" />
                        Use Tool
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <div className="space-y-4">
              <Search className="w-12 h-12 text-[var(--ff-text-muted)] mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-[var(--ff-text-primary)] mb-2">No tools found</h3>
                <p className="text-[var(--ff-text-secondary)] mb-4">
                  Try adjusting your search query or filters.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                    setSortBy('popularity');
                  }}
                  className="border-[var(--border)]"
                >
                  Clear all filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Section */}
      {categoryFilter === 'all' && !searchQuery && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-primary)' }}>
              Why Choose FlashFusion Tools?
            </h2>
            <p className="text-[var(--ff-text-secondary)] max-w-2xl mx-auto">
              Our AI-powered tools are designed to enhance your development workflow and accelerate your creative projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 text-[var(--ff-primary)] mx-auto mb-4" />
                <h3 className="font-semibold text-[var(--ff-text-primary)] mb-2">Lightning Fast</h3>
                <p className="text-sm text-[var(--ff-text-secondary)]">
                  Generate production-ready code, content, and designs in seconds with advanced AI models.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
              <CardContent className="p-6 text-center">
                <Settings className="w-12 h-12 text-[var(--ff-secondary)] mx-auto mb-4" />
                <h3 className="font-semibold text-[var(--ff-text-primary)] mb-2">Fully Integrated</h3>
                <p className="text-sm text-[var(--ff-text-secondary)]">
                  Seamlessly integrated tools that work together to create complete development workflows.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-[var(--ff-accent)] mx-auto mb-4" />
                <h3 className="font-semibold text-[var(--ff-text-primary)] mb-2">Team Collaboration</h3>
                <p className="text-sm text-[var(--ff-text-secondary)]">
                  Built for teams with real-time collaboration, sharing, and project management features.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIToolsHub;
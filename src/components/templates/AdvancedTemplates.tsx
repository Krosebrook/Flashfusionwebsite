import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Progress } from '../ui/progress';
import { 
  FileCode, Star, Download, Clock, Users, Zap, 
  Play, Settings, Plus, Search, Filter, 
  Layers, GitBranch, Workflow, CheckCircle,
  ArrowRight, Code, Database, Layout, Palette
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  rating: number;
  downloads: number;
  author: string;
  tags: string[];
  features: string[];
  techStack: string[];
  preview?: string;
  isPopular: boolean;
  isNew: boolean;
  isFavorited: boolean;
  workflows: WorkflowStep[];
  customizations: TemplateCustomization[];
}

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  type: 'setup' | 'install' | 'configure' | 'generate' | 'deploy';
  duration: number;
  isAutomatic: boolean;
  dependencies?: string[];
  status?: 'pending' | 'running' | 'completed' | 'failed';
}

interface TemplateCustomization {
  id: string;
  name: string;
  description: string;
  type: 'text' | 'select' | 'boolean' | 'color' | 'file';
  options?: string[];
  defaultValue: any;
  required: boolean;
}

interface AdvancedTemplatesProps {
  onCreateProject: (template: ProjectTemplate, customizations: any) => void;
  userRole?: string;
}

export function AdvancedTemplates({ onCreateProject, userRole = 'free' }: AdvancedTemplatesProps) {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [customizations, setCustomizations] = useState<any>({});
  const [isCreating, setIsCreating] = useState(false);
  const [workflowProgress, setWorkflowProgress] = useState(0);
  const [currentWorkflowStep, setCurrentWorkflowStep] = useState<WorkflowStep | null>(null);
  const [showCustomTemplate, setShowCustomTemplate] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      // Mock template data
      const mockTemplates: ProjectTemplate[] = [
        {
          id: 'react-dashboard',
          name: 'Modern React Dashboard',
          description: 'Full-featured admin dashboard with charts, tables, and authentication',
          longDescription: 'A comprehensive React dashboard template with modern UI components, real-time analytics, user management, and responsive design. Perfect for business applications and SaaS products.',
          category: 'dashboard',
          difficulty: 'intermediate',
          estimatedTime: '30 minutes',
          rating: 4.8,
          downloads: 12450,
          author: 'FlashFusion Team',
          tags: ['react', 'dashboard', 'analytics', 'charts'],
          features: ['Authentication', 'Data Visualization', 'User Management', 'Responsive Design', 'Dark Mode'],
          techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Recharts', 'React Router'],
          isPopular: true,
          isNew: false,
          isFavorited: false,
          workflows: [
            { id: '1', title: 'Project Setup', description: 'Initialize React project structure', type: 'setup', duration: 30, isAutomatic: true },
            { id: '2', title: 'Install Dependencies', description: 'Install required packages', type: 'install', duration: 60, isAutomatic: true },
            { id: '3', title: 'Configure Theme', description: 'Apply custom theme and branding', type: 'configure', duration: 45, isAutomatic: true },
            { id: '4', title: 'Generate Components', description: 'Create dashboard components', type: 'generate', duration: 120, isAutomatic: true },
            { id: '5', title: 'Setup Authentication', description: 'Configure auth system', type: 'configure', duration: 90, isAutomatic: false }
          ],
          customizations: [
            { id: 'name', name: 'Project Name', description: 'Name for your dashboard project', type: 'text', defaultValue: 'My Dashboard', required: true },
            { id: 'theme', name: 'Color Theme', description: 'Primary color theme', type: 'color', defaultValue: '#FF7B00', required: false },
            { id: 'auth', name: 'Authentication Provider', description: 'Choose auth method', type: 'select', options: ['Supabase', 'Auth0', 'Firebase'], defaultValue: 'Supabase', required: true },
            { id: 'charts', name: 'Include Charts', description: 'Add data visualization components', type: 'boolean', defaultValue: true, required: false }
          ]
        },
        {
          id: 'ecommerce-store',
          name: 'E-commerce Store',
          description: 'Complete online store with cart, payments, and product management',
          longDescription: 'A full-featured e-commerce solution with product catalog, shopping cart, payment processing, order management, and admin panel.',
          category: 'ecommerce',
          difficulty: 'advanced',
          estimatedTime: '45 minutes',
          rating: 4.9,
          downloads: 8920,
          author: 'Commerce Team',
          tags: ['ecommerce', 'payments', 'cart', 'products'],
          features: ['Product Catalog', 'Shopping Cart', 'Payment Integration', 'Order Management', 'Admin Panel'],
          techStack: ['Next.js', 'TypeScript', 'Stripe', 'Prisma', 'PostgreSQL'],
          isPopular: true,
          isNew: true,
          isFavorited: true,
          workflows: [
            { id: '1', title: 'Store Setup', description: 'Initialize e-commerce structure', type: 'setup', duration: 45, isAutomatic: true },
            { id: '2', title: 'Database Schema', description: 'Create product and order tables', type: 'configure', duration: 60, isAutomatic: true },
            { id: '3', title: 'Payment Integration', description: 'Setup Stripe payments', type: 'configure', duration: 90, isAutomatic: false },
            { id: '4', title: 'Product Management', description: 'Generate admin interfaces', type: 'generate', duration: 120, isAutomatic: true },
            { id: '5', title: 'Deploy Store', description: 'Deploy to production', type: 'deploy', duration: 180, isAutomatic: false }
          ],
          customizations: [
            { id: 'storeName', name: 'Store Name', description: 'Name for your online store', type: 'text', defaultValue: 'My Store', required: true },
            { id: 'currency', name: 'Currency', description: 'Store currency', type: 'select', options: ['USD', 'EUR', 'GBP'], defaultValue: 'USD', required: true },
            { id: 'categories', name: 'Product Categories', description: 'Comma-separated categories', type: 'text', defaultValue: 'Electronics, Clothing, Books', required: false }
          ]
        },
        {
          id: 'blog-platform',
          name: 'Blog Platform',
          description: 'Modern blog with CMS, SEO optimization, and social features',
          longDescription: 'A feature-rich blogging platform with content management, SEO optimization, social sharing, comments system, and author profiles.',
          category: 'blog',
          difficulty: 'beginner',
          estimatedTime: '20 minutes',
          rating: 4.6,
          downloads: 15670,
          author: 'Content Team',
          tags: ['blog', 'cms', 'seo', 'content'],
          features: ['Content Management', 'SEO Optimization', 'Social Sharing', 'Comments', 'Author Profiles'],
          techStack: ['Next.js', 'MDX', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
          isPopular: false,
          isNew: false,
          isFavorited: false,
          workflows: [
            { id: '1', title: 'Blog Setup', description: 'Initialize blog structure', type: 'setup', duration: 30, isAutomatic: true },
            { id: '2', title: 'CMS Configuration', description: 'Setup content management', type: 'configure', duration: 60, isAutomatic: true },
            { id: '3', title: 'SEO Optimization', description: 'Configure SEO features', type: 'configure', duration: 45, isAutomatic: true },
            { id: '4', title: 'Generate Pages', description: 'Create blog pages and components', type: 'generate', duration: 90, isAutomatic: true }
          ],
          customizations: [
            { id: 'blogName', name: 'Blog Name', description: 'Name for your blog', type: 'text', defaultValue: 'My Blog', required: true },
            { id: 'author', name: 'Author Name', description: 'Primary author name', type: 'text', defaultValue: 'John Doe', required: true },
            { id: 'categories', name: 'Categories', description: 'Blog post categories', type: 'text', defaultValue: 'Technology, Lifestyle, Travel', required: false }
          ]
        }
      ];
      
      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const categories = [
    { id: 'all', name: 'All Templates', icon: Layers },
    { id: 'dashboard', name: 'Dashboards', icon: Layout },
    { id: 'ecommerce', name: 'E-commerce', icon: GitBranch },
    { id: 'blog', name: 'Blogs & CMS', icon: FileCode },
    { id: 'portfolio', name: 'Portfolio', icon: Palette },
    { id: 'api', name: 'APIs', icon: Database }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleCreateProject = async (template: ProjectTemplate) => {
    if (userRole === 'free' && template.difficulty === 'advanced') {
      toast.error('Upgrade to Pro to use advanced templates');
      return;
    }

    setIsCreating(true);
    setWorkflowProgress(0);
    
    try {
      // Execute workflow steps
      for (let i = 0; i < template.workflows.length; i++) {
        const step = template.workflows[i];
        setCurrentWorkflowStep(step);
        
        // Simulate step execution
        await new Promise(resolve => setTimeout(resolve, step.duration * 10)); // Speed up for demo
        
        setWorkflowProgress(((i + 1) / template.workflows.length) * 100);
        
        // Update step status
        step.status = 'completed';
      }
      
      onCreateProject(template, customizations);
      toast.success(`${template.name} created successfully!`);
      setSelectedTemplate(null);
    } catch (error) {
      toast.error('Failed to create project. Please try again.');
    } finally {
      setIsCreating(false);
      setCurrentWorkflowStep(null);
      setWorkflowProgress(0);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-500';
      case 'intermediate': return 'text-yellow-500';
      case 'advanced': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : Layers;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Project Templates</h2>
          <p className="text-muted-foreground">Start with professionally designed templates and workflows</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowCustomTemplate(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
          <Button className="ff-btn-primary">
            <Workflow className="h-4 w-4 mr-2" />
            My Workflows
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
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
              </Button>
            );
          })}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="marketplace">Template Marketplace</TabsTrigger>
          <TabsTrigger value="workflows">Workflow Automation</TabsTrigger>
          <TabsTrigger value="custom">Custom Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => {
              const CategoryIcon = getCategoryIcon(template.category);
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className="p-6 h-full flex flex-col ff-card-interactive">
                    <div className="space-y-4 flex-1">
                      {/* Template Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <CategoryIcon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{template.name}</h3>
                            <p className="text-sm text-muted-foreground">by {template.author}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {template.isPopular && <Badge variant="default" className="text-xs">Popular</Badge>}
                          {template.isNew && <Badge variant="secondary" className="text-xs">New</Badge>}
                          {userRole === 'free' && template.difficulty === 'advanced' && (
                            <Badge variant="outline" className="text-xs">Pro</Badge>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground flex-1">
                        {template.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{template.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          <span>{template.downloads.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{template.estimatedTime}</span>
                        </div>
                      </div>

                      {/* Difficulty */}
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getDifficultyColor(template.difficulty)}`}
                        >
                          {template.difficulty}
                        </Badge>
                        <div className="flex gap-1">
                          {template.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </div>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-1">
                        {template.techStack.slice(0, 4).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
                        ))}
                        {template.techStack.length > 4 && (
                          <Badge variant="outline" className="text-xs">+{template.techStack.length - 4}</Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setSelectedTemplate(template)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-3">
                              <CategoryIcon className="h-6 w-6 text-primary" />
                              {template.name}
                            </DialogTitle>
                          </DialogHeader>
                          
                          {selectedTemplate && (
                            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
                              <div>
                                <h3 className="font-semibold mb-2">Description</h3>
                                <p className="text-muted-foreground">{selectedTemplate.longDescription}</p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h3 className="font-semibold mb-2">Features</h3>
                                  <ul className="space-y-1">
                                    {selectedTemplate.features.map((feature) => (
                                      <li key={feature} className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        {feature}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div>
                                  <h3 className="font-semibold mb-2">Workflow Steps</h3>
                                  <div className="space-y-2">
                                    {selectedTemplate.workflows.map((step, index) => (
                                      <div key={step.id} className="flex items-center gap-2 text-sm">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                                          {index + 1}
                                        </div>
                                        <div>
                                          <p className="font-medium">{step.title}</p>
                                          <p className="text-muted-foreground text-xs">{step.description}</p>
                                        </div>
                                        {step.isAutomatic && (
                                          <Badge variant="secondary" className="text-xs ml-auto">Auto</Badge>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Customizations */}
                              <div>
                                <h3 className="font-semibold mb-4">Customize Your Project</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {selectedTemplate.customizations.map((customization) => (
                                    <div key={customization.id} className="space-y-2">
                                      <label className="text-sm font-medium">
                                        {customization.name}
                                        {customization.required && <span className="text-red-500 ml-1">*</span>}
                                      </label>
                                      <p className="text-xs text-muted-foreground">{customization.description}</p>
                                      
                                      {customization.type === 'text' && (
                                        <Input
                                          placeholder={customization.defaultValue}
                                          value={customizations[customization.id] || customization.defaultValue}
                                          onChange={(e) => setCustomizations(prev => ({ 
                                            ...prev, 
                                            [customization.id]: e.target.value 
                                          }))}
                                        />
                                      )}
                                      
                                      {customization.type === 'select' && (
                                        <select 
                                          className="w-full p-2 rounded-md border bg-background"
                                          value={customizations[customization.id] || customization.defaultValue}
                                          onChange={(e) => setCustomizations(prev => ({ 
                                            ...prev, 
                                            [customization.id]: e.target.value 
                                          }))}
                                        >
                                          {customization.options?.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                          ))}
                                        </select>
                                      )}
                                      
                                      {customization.type === 'boolean' && (
                                        <label className="flex items-center gap-2">
                                          <input
                                            type="checkbox"
                                            checked={customizations[customization.id] ?? customization.defaultValue}
                                            onChange={(e) => setCustomizations(prev => ({ 
                                              ...prev, 
                                              [customization.id]: e.target.checked 
                                            }))}
                                          />
                                          <span className="text-sm">Enable this feature</span>
                                        </label>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleCreateProject(selectedTemplate)}
                                  disabled={isCreating || (userRole === 'free' && selectedTemplate.difficulty === 'advanced')}
                                  className="ff-btn-primary flex-1"
                                >
                                  {isCreating ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                      Creating...
                                    </>
                                  ) : (
                                    <>
                                      <Play className="h-4 w-4 mr-2" />
                                      Create Project
                                    </>
                                  )}
                                </Button>
                                <Button variant="outline">
                                  <Star className="h-4 w-4 mr-2" />
                                  Favorite
                                </Button>
                              </div>
                              
                              {/* Workflow Progress */}
                              {isCreating && currentWorkflowStep && (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span>Creating your project...</span>
                                    <span>{Math.round(workflowProgress)}%</span>
                                  </div>
                                  <Progress value={workflowProgress} className="ff-progress-bar" />
                                  <p className="text-sm text-muted-foreground">
                                    Current step: {currentWorkflowStep.title}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button 
                        size="sm"
                        onClick={() => handleCreateProject(template)}
                        disabled={userRole === 'free' && template.difficulty === 'advanced'}
                        className="ff-btn-primary"
                      >
                        Use Template
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Workflow className="h-5 w-5" />
              Workflow Automation
            </h3>
            <p className="text-muted-foreground mb-6">
              Automate your project setup with intelligent workflows that handle configuration, dependencies, and deployment.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Smart Dependencies',
                  description: 'Automatically install and configure required packages based on your selections',
                  icon: <Zap className="h-8 w-8 text-primary" />
                },
                {
                  title: 'Environment Setup',
                  description: 'Generate environment files, configuration, and setup scripts automatically',
                  icon: <Settings className="h-8 w-8 text-secondary" />
                },
                {
                  title: 'Deployment Ready',
                  description: 'Pre-configured deployment settings for popular platforms like Vercel, Netlify',
                  icon: <GitBranch className="h-8 w-8 text-accent" />
                }
              ].map((feature, index) => (
                <div key={index} className="text-center space-y-3">
                  <div className="mx-auto w-16 h-16 rounded-lg bg-muted/50 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h4 className="font-semibold">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card className="p-6 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Create Custom Template</h3>
              <p className="text-muted-foreground">
                Build your own reusable project templates with custom workflows and configurations.
              </p>
              <Button className="ff-btn-primary" onClick={() => setShowCustomTemplate(true)}>
                Start Building
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Custom Template Creation Dialog */}
      <Dialog open={showCustomTemplate} onOpenChange={setShowCustomTemplate}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Custom Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Template Name</label>
              <Input placeholder="My Custom Template" />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Describe your template..." />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <select className="w-full p-2 rounded-md border bg-background">
                <option>Dashboard</option>
                <option>E-commerce</option>
                <option>Blog</option>
                <option>Portfolio</option>
                <option>API</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowCustomTemplate(false)}>Cancel</Button>
              <Button className="ff-btn-primary">Create Template</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
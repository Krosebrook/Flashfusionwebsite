import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Users, 
  GitBranch,
  Rocket,
  Code2,
  Clock,
  Star,
  Archive,
  Settings,
  Copy,
  Share,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Project {
  id: string;
  name: string;
  description: string;
  type: 'web-app' | 'mobile-app' | 'api' | 'website' | 'ai-app';
  status: 'draft' | 'active' | 'completed' | 'archived';
  progress: number;
  techStack: string[];
  collaborators: User[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deployments: number;
  lastDeployment?: string;
  isStarred: boolean;
  visibility: 'private' | 'public' | 'team';
}

interface User {
  id: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
}

interface ProjectFormData {
  name: string;
  description: string;
  type: string;
  visibility: string;
  techStack: string[];
}

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    description: 'Modern e-commerce platform with React, Node.js, and PostgreSQL',
    type: 'web-app',
    status: 'active',
    progress: 75,
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    collaborators: [
      { id: '1', name: 'Alice Johnson', role: 'owner' },
      { id: '2', name: 'Bob Smith', role: 'editor' },
      { id: '3', name: 'Carol Davis', role: 'viewer' }
    ],
    createdBy: '1',
    createdAt: '2024-01-15',
    updatedAt: '2 hours ago',
    deployments: 12,
    lastDeployment: '1 day ago',
    isStarred: true,
    visibility: 'private'
  },
  {
    id: '2',
    name: 'Mobile Banking App',
    description: 'Secure mobile banking application with biometric authentication',
    type: 'mobile-app',
    status: 'active',
    progress: 45,
    techStack: ['React Native', 'Node.js', 'MongoDB', 'Auth0'],
    collaborators: [
      { id: '1', name: 'Alice Johnson', role: 'owner' },
      { id: '4', name: 'David Wilson', role: 'editor' }
    ],
    createdBy: '1',
    createdAt: '2024-02-01',
    updatedAt: '5 hours ago',
    deployments: 6,
    lastDeployment: '3 days ago',
    isStarred: false,
    visibility: 'team'
  },
  {
    id: '3',
    name: 'Portfolio Website',
    description: 'Personal portfolio website with modern design and animations',
    type: 'website',
    status: 'completed',
    progress: 100,
    techStack: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
    collaborators: [
      { id: '1', name: 'Alice Johnson', role: 'owner' }
    ],
    createdBy: '1',
    createdAt: '2024-01-10',
    updatedAt: '1 week ago',
    deployments: 8,
    lastDeployment: '1 week ago',
    isStarred: true,
    visibility: 'public'
  },
  {
    id: '4',
    name: 'AI Chat Assistant',
    description: 'Intelligent chat assistant with natural language processing',
    type: 'ai-app',
    status: 'draft',
    progress: 20,
    techStack: ['Python', 'FastAPI', 'OpenAI', 'React'],
    collaborators: [
      { id: '1', name: 'Alice Johnson', role: 'owner' },
      { id: '5', name: 'Eve Brown', role: 'editor' }
    ],
    createdBy: '1',
    createdAt: '2024-02-10',
    updatedAt: '1 day ago',
    deployments: 0,
    isStarred: false,
    visibility: 'private'
  }
];

const PROJECT_TYPES = [
  { value: 'web-app', label: 'Web Application', icon: '🌐' },
  { value: 'mobile-app', label: 'Mobile App', icon: '📱' },
  { value: 'api', label: 'API Service', icon: '🔌' },
  { value: 'website', label: 'Website', icon: '🖥️' },
  { value: 'ai-app', label: 'AI Application', icon: '🤖' }
];

const TECH_STACK_OPTIONS = [
  'React', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js',
  'Node.js', 'Express', 'FastAPI', 'Django', 'Flask',
  'PostgreSQL', 'MongoDB', 'MySQL', 'Redis',
  'TypeScript', 'JavaScript', 'Python', 'Java',
  'AWS', 'Vercel', 'Netlify', 'Docker',
  'Stripe', 'Auth0', 'Firebase', 'Supabase'
];

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'updated' | 'progress'>('updated');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    type: 'web-app',
    visibility: 'private',
    techStack: []
  });

  // Filter and search projects
  useEffect(() => {
    let filtered = projects;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.techStack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(project => project.type === typeFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'progress':
          return b.progress - a.progress;
        case 'updated':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    setFilteredProjects(filtered);
  }, [projects, searchQuery, statusFilter, typeFilter, sortBy]);

  // Create new project
  const createProject = async () => {
    if (!formData.name.trim()) {
      toast.error('Project name is required');
      return;
    }

    setIsCreating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newProject: Project = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        type: formData.type as Project['type'],
        status: 'draft',
        progress: 0,
        techStack: formData.techStack,
        collaborators: [{ id: '1', name: 'You', role: 'owner' }],
        createdBy: '1',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: 'just now',
        deployments: 0,
        isStarred: false,
        visibility: formData.visibility as Project['visibility']
      };

      setProjects(prev => [newProject, ...prev]);
      setShowCreateDialog(false);
      setFormData({ name: '', description: '', type: 'web-app', visibility: 'private', techStack: [] });
      
      toast.success('Project created successfully!');
    } catch (error) {
      toast.error('Failed to create project');
    } finally {
      setIsCreating(false);
    }
  };

  // Toggle project star
  const toggleStar = (projectId: string) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === projectId 
          ? { ...project, isStarred: !project.isStarred }
          : project
      )
    );
  };

  // Delete project
  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
    toast.success('Project deleted');
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-primary text-primary-foreground';
      case 'completed': return 'bg-success text-success-foreground';
      case 'draft': return 'bg-warning text-warning-foreground';
      case 'archived': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    return PROJECT_TYPES.find(t => t.value === type)?.icon || '📄';
  };

  return (
    <div className="space-y-6 ff-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="ff-text-headline">Projects</h1>
          <p className="ff-text-body">
            Manage and track your development projects
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="ff-btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Start a new development project with FlashFusion AI assistance
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="ff-text-sm font-medium mb-2 block">Project Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter project name..."
                  className="ff-input"
                />
              </div>
              
              <div>
                <label className="ff-text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your project..."
                  className="ff-input"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="ff-text-sm font-medium mb-2 block">Type</label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="ff-text-sm font-medium mb-2 block">Visibility</label>
                  <Select value={formData.visibility} onValueChange={(value) => setFormData(prev => ({ ...prev, visibility: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">🔒 Private</SelectItem>
                      <SelectItem value="team">👥 Team</SelectItem>
                      <SelectItem value="public">🌐 Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={createProject} disabled={isCreating} className="ff-btn-primary">
                {isCreating ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card className="ff-card">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="pl-10 ff-input"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {PROJECT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated">Recent</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Stats */}
      <div className="grid md:grid-cols-4 gap-6 ff-stagger-fade">
        <Card className="ff-card-interactive">
          <CardHeader className="pb-2">
            <CardTitle className="ff-text-sm">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="ff-text-2xl font-bold text-primary">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              {projects.filter(p => p.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardHeader className="pb-2">
            <CardTitle className="ff-text-sm">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="ff-text-2xl font-bold text-success">
              {projects.filter(p => p.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((projects.filter(p => p.status === 'completed').length / projects.length) * 100)}% success rate
            </p>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardHeader className="pb-2">
            <CardTitle className="ff-text-sm">Deployments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="ff-text-2xl font-bold text-secondary">
              {projects.reduce((sum, p) => sum + p.deployments, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all projects
            </p>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardHeader className="pb-2">
            <CardTitle className="ff-text-sm">Collaborators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="ff-text-2xl font-bold text-accent">
              {Array.from(new Set(projects.flatMap(p => p.collaborators.map(c => c.id)))).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Unique team members
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 ff-stagger-fade">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="ff-card-interactive hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getTypeIcon(project.type)}</span>
                  <div>
                    <CardTitle className="ff-text-base leading-tight">{project.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                      {project.visibility === 'public' && (
                        <Badge variant="outline" className="text-xs">Public</Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleStar(project.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Star 
                      className={`h-4 w-4 ${project.isStarred ? 'fill-warning text-warning' : 'text-muted-foreground'}`} 
                    />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="ff-text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>
              
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
              
              {/* Tech Stack */}
              <div className="flex flex-wrap gap-1">
                {project.techStack.slice(0, 3).map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {project.techStack.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{project.techStack.length - 3}
                  </Badge>
                )}
              </div>
              
              {/* Collaborators */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {project.collaborators.slice(0, 3).map((collaborator) => (
                      <Avatar key={collaborator.id} className="h-6 w-6 border-2 border-background">
                        <AvatarImage src={collaborator.avatar} />
                        <AvatarFallback className="text-xs">
                          {collaborator.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {project.collaborators.length > 3 && (
                      <div className="h-6 w-6 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                        <span className="text-xs font-medium">
                          +{project.collaborators.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                  {project.deployments > 0 && (
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Rocket className="h-3 w-3" />
                      <span>{project.deployments}</span>
                    </div>
                  )}
                </div>
                
                <span className="text-xs text-muted-foreground">
                  {project.updatedAt}
                </span>
              </div>
              
              {/* Actions */}
              <div className="flex items-center space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Rocket className="h-3 w-3 mr-1" />
                  Deploy
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredProjects.length === 0 && (
        <Card className="ff-card">
          <CardContent className="py-12 text-center">
            <Code2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="ff-text-lg font-medium mb-2">No Projects Found</h3>
            <p className="ff-text-sm text-muted-foreground mb-4">
              {searchQuery ? 'Try adjusting your search or filters' : 'Create your first project to get started'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowCreateDialog(true)} className="ff-btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ProjectsPage;
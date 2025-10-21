import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Download, 
  Package, 
  Filter, 
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Archive,
  FileText,
  Folder,
  GitBranch,
  Calendar,
  Users,
  Settings,
  Play,
  Pause,
  Square,
  RefreshCw,
  Eye,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { MultiFormatDownloadSelector } from '../ui/multi-format-download-selector';
import type { GeneratedApp } from '../../types/full-stack-builder';
import type { DownloadFormat, DownloadOptions } from '../../utils/multi-format-download';

interface ProjectItem {
  id: string;
  name: string;
  description: string;
  type: 'full-stack-app' | 'component' | 'template' | 'tool-output';
  framework: string;
  size: number;
  createdAt: string;
  lastModified: string;
  author: string;
  tags: string[];
  status: 'ready' | 'generating' | 'error' | 'archived';
  files: any[];
  metadata: {
    version: string;
    dependencies: string[];
    platforms: string[];
  };
}

interface BulkExportJob {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  progress: number;
  selectedProjects: string[];
  exportFormat: DownloadFormat;
  exportOptions: DownloadOptions;
  createdAt: string;
  completedAt?: string;
  totalSize: number;
  processedSize: number;
  errors: string[];
  downloadUrl?: string;
}

const PROJECT_FILTERS = {
  type: ['full-stack-app', 'component', 'template', 'tool-output'],
  framework: ['React', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'Node.js', 'Python', 'PHP'],
  status: ['ready', 'generating', 'error', 'archived'],
  dateRange: ['today', 'week', 'month', 'quarter', 'year', 'all']
};

export function BulkExportManager() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectItem[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [exportJobs, setExportJobs] = useState<BulkExportJob[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    framework: 'all',
    status: 'all',
    dateRange: 'all',
    author: 'all'
  });
  const [sortBy, setSortBy] = useState('lastModified');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentJob, setCurrentJob] = useState<BulkExportJob | null>(null);
  const [isCreatingJob, setIsCreatingJob] = useState(false);

  useEffect(() => {
    loadProjects();
    loadExportJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [projects, searchQuery, filters, sortBy, sortOrder]);

  const loadProjects = () => {
    // Load projects from various sources
    const mockProjects: ProjectItem[] = [
      {
        id: 'proj_1',
        name: 'E-commerce Dashboard',
        description: 'Full-featured e-commerce admin dashboard with real-time analytics',
        type: 'full-stack-app',
        framework: 'React',
        size: 1250000,
        createdAt: '2024-01-15T10:30:00Z',
        lastModified: '2024-01-20T14:45:00Z',
        author: 'john.doe@example.com',
        tags: ['dashboard', 'ecommerce', 'analytics'],
        status: 'ready',
        files: [],
        metadata: {
          version: '1.0.0',
          dependencies: ['react', 'typescript', 'tailwind'],
          platforms: ['vercel', 'netlify']
        }
      },
      {
        id: 'proj_2',
        name: 'Blog Platform API',
        description: 'RESTful API for blog management with authentication',
        type: 'full-stack-app',
        framework: 'Node.js',
        size: 850000,
        createdAt: '2024-01-18T09:15:00Z',
        lastModified: '2024-01-22T16:20:00Z',
        author: 'jane.smith@example.com',
        tags: ['api', 'blog', 'authentication'],
        status: 'ready',
        files: [],
        metadata: {
          version: '2.1.0',
          dependencies: ['express', 'mongodb', 'jwt'],
          platforms: ['heroku', 'aws']
        }
      }
    ];

    // Add projects from localStorage if they exist
    const savedProjects = localStorage.getItem('ff_generated_projects');
    if (savedProjects) {
      try {
        const parsed = JSON.parse(savedProjects);
        mockProjects.push(...parsed);
      } catch (error) {
        console.error('Failed to load saved projects:', error);
      }
    }

    setProjects(mockProjects);
  };

  const loadExportJobs = () => {
    const saved = localStorage.getItem('ff_bulk_export_jobs');
    if (saved) {
      try {
        setExportJobs(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load export jobs:', error);
      }
    }
  };

  const saveExportJobs = (jobs: BulkExportJob[]) => {
    localStorage.setItem('ff_bulk_export_jobs', JSON.stringify(jobs));
    setExportJobs(jobs);
  };

  const applyFilters = () => {
    let filtered = [...projects];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(project => project.type === filters.type);
    }

    // Framework filter
    if (filters.framework !== 'all') {
      filtered = filtered.filter(project => project.framework === filters.framework);
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(project => project.status === filters.status);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(project => 
        new Date(project.lastModified) >= cutoffDate
      );
    }

    // Author filter
    if (filters.author !== 'all') {
      filtered = filtered.filter(project => project.author === filters.author);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy as keyof ProjectItem];
      let bVal = b[sortBy as keyof ProjectItem];
      
      if (sortBy === 'size') {
        aVal = a.size;
        bVal = b.size;
      } else if (sortBy === 'createdAt' || sortBy === 'lastModified') {
        aVal = new Date(aVal as string).getTime();
        bVal = new Date(bVal as string).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    setFilteredProjects(filtered);
  };

  const toggleProjectSelection = (projectId: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const selectAllProjects = () => {
    setSelectedProjects(filteredProjects.map(p => p.id));
  };

  const clearSelection = () => {
    setSelectedProjects([]);
  };

  const createBulkExportJob = async (exportOptions: DownloadOptions) => {
    if (selectedProjects.length === 0) {
      toast.error('Please select at least one project to export');
      return;
    }

    setIsCreatingJob(true);

    try {
      const selectedProjectsData = projects.filter(p => selectedProjects.includes(p.id));
      const totalSize = selectedProjectsData.reduce((sum, p) => sum + p.size, 0);

      const job: BulkExportJob = {
        id: `job_${Date.now()}`,
        name: `Bulk Export - ${selectedProjects.length} Projects`,
        status: 'pending',
        progress: 0,
        selectedProjects: selectedProjects,
        exportFormat: exportOptions.format,
        exportOptions: exportOptions,
        createdAt: new Date().toISOString(),
        totalSize: totalSize,
        processedSize: 0,
        errors: []
      };

      const updatedJobs = [job, ...exportJobs];
      saveExportJobs(updatedJobs);
      
      // Start the export job
      startExportJob(job.id);
      
      setCurrentJob(job);
      clearSelection();
      toast.success('Bulk export job created and started');
    } catch (error) {
      console.error('Failed to create export job:', error);
      toast.error('Failed to create export job');
    } finally {
      setIsCreatingJob(false);
    }
  };

  const startExportJob = async (jobId: string) => {
    const job = exportJobs.find(j => j.id === jobId);
    if (!job) return;

    // Update job status to running
    const updatedJobs = exportJobs.map(j => 
      j.id === jobId 
        ? { ...j, status: 'running' as const, progress: 0 }
        : j
    );
    saveExportJobs(updatedJobs);

    // Simulate export process
    const projectsToExport = projects.filter(p => job.selectedProjects.includes(p.id));
    
    for (let i = 0; i < projectsToExport.length; i++) {
      const project = projectsToExport[i];
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const progress = ((i + 1) / projectsToExport.length) * 100;
      const processedSize = job.totalSize * (progress / 100);
      
      // Update progress
      const progressJobs = exportJobs.map(j => 
        j.id === jobId 
          ? { ...j, progress, processedSize }
          : j
      );
      saveExportJobs(progressJobs);
    }

    // Complete job
    const completedJobs = exportJobs.map(j => 
      j.id === jobId 
        ? { 
            ...j, 
            status: 'completed' as const, 
            progress: 100,
            completedAt: new Date().toISOString(),
            downloadUrl: `https://downloads.flashfusion.ai/${jobId}.zip`
          }
        : j
    );
    saveExportJobs(completedJobs);
    
    toast.success('Bulk export completed successfully!');
  };

  const pauseJob = (jobId: string) => {
    const updatedJobs = exportJobs.map(j => 
      j.id === jobId 
        ? { ...j, status: 'paused' as const }
        : j
    );
    saveExportJobs(updatedJobs);
    toast.info('Export job paused');
  };

  const resumeJob = (jobId: string) => {
    const updatedJobs = exportJobs.map(j => 
      j.id === jobId 
        ? { ...j, status: 'running' as const }
        : j
    );
    saveExportJobs(updatedJobs);
    startExportJob(jobId);
    toast.info('Export job resumed');
  };

  const cancelJob = (jobId: string) => {
    const updatedJobs = exportJobs.map(j => 
      j.id === jobId 
        ? { ...j, status: 'failed' as const }
        : j
    );
    saveExportJobs(updatedJobs);
    toast.info('Export job cancelled');
  };

  const deleteJob = (jobId: string) => {
    const updatedJobs = exportJobs.filter(j => j.id !== jobId);
    saveExportJobs(updatedJobs);
    toast.success('Export job deleted');
  };

  const downloadJobResult = (job: BulkExportJob) => {
    if (job.downloadUrl) {
      // In a real implementation, this would trigger the download
      toast.success('Download started');
    }
  };

  const getStatusIcon = (status: BulkExportJob['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-ff-success" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-ff-error" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 animate-spin text-ff-primary" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-ff-warning" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-ff-text-muted" />;
      default:
        return null;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalSelectedSize = useMemo(() => {
    return projects
      .filter(p => selectedProjects.includes(p.id))
      .reduce((sum, p) => sum + p.size, 0);
  }, [projects, selectedProjects]);

  const uniqueAuthors = useMemo(() => {
    return [...new Set(projects.map(p => p.author))];
  }, [projects]);

  return (
    <div className="space-y-6 ff-stagger-fade">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="ff-text-gradient mb-2">Bulk Export Manager</h2>
          <p className="text-ff-text-secondary">
            Select and export multiple projects simultaneously with advanced filtering and batch processing capabilities.
          </p>
        </div>
        {selectedProjects.length > 0 && (
          <Badge variant="secondary" className="ff-badge-glow">
            {selectedProjects.length} projects selected ({formatFileSize(totalSelectedSize)})
          </Badge>
        )}
      </div>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Folder className="h-4 w-4" />
            Projects ({filteredProjects.length})
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Export Options
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            Export Jobs ({exportJobs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          {/* Filters and Search */}
          <Card className="ff-card-interactive">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-ff-primary" />
                  Filter & Search Projects
                </CardTitle>
                <div className="flex gap-2">
                  {selectedProjects.length > 0 && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={clearSelection}
                      >
                        Clear Selection
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => filteredProjects.length > selectedProjects.length ? selectAllProjects() : clearSelection()}
                      >
                        {filteredProjects.length > selectedProjects.length ? 'Select All' : 'Deselect All'}
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    {showAdvancedFilters ? 'Simple' : 'Advanced'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ff-text-muted" />
                <Input
                  placeholder="Search projects by name, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 ff-focus-ring"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="type-filter">Type</Label>
                  <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="ff-focus-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {PROJECT_FILTERS.type.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="framework-filter">Framework</Label>
                  <Select value={filters.framework} onValueChange={(value) => setFilters(prev => ({ ...prev, framework: value }))}>
                    <SelectTrigger className="ff-focus-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Frameworks</SelectItem>
                      {PROJECT_FILTERS.framework.map(framework => (
                        <SelectItem key={framework} value={framework}>{framework}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status-filter">Status</Label>
                  <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="ff-focus-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {PROJECT_FILTERS.status.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date-filter">Date Range</Label>
                  <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                    <SelectTrigger className="ff-focus-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {showAdvancedFilters && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-ff-border">
                  <div>
                    <Label htmlFor="author-filter">Author</Label>
                    <Select value={filters.author} onValueChange={(value) => setFilters(prev => ({ ...prev, author: value }))}>
                      <SelectTrigger className="ff-focus-ring">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Authors</SelectItem>
                        {uniqueAuthors.map(author => (
                          <SelectItem key={author} value={author}>{author}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="sort-by">Sort By</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="ff-focus-ring">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="lastModified">Last Modified</SelectItem>
                        <SelectItem value="createdAt">Created Date</SelectItem>
                        <SelectItem value="size">Size</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="sort-order">Sort Order</Label>
                    <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                      <SelectTrigger className="ff-focus-ring">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">Descending</SelectItem>
                        <SelectItem value="asc">Ascending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Projects List */}
          <div className="grid gap-4">
            {filteredProjects.length === 0 ? (
              <Card className="ff-card-interactive text-center p-12">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-ff-surface rounded-full flex items-center justify-center">
                    <Folder className="h-8 w-8 text-ff-text-muted" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ff-text-primary mb-2">No projects found</h3>
                    <p className="text-ff-text-muted">
                      {searchQuery || Object.values(filters).some(f => f !== 'all')
                        ? 'Try adjusting your search criteria or filters'
                        : 'Create your first project to start exporting'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredProjects.map((project) => (
                <Card key={project.id} className={`ff-card-interactive cursor-pointer ${
                  selectedProjects.includes(project.id) ? 'ring-2 ring-ff-primary bg-ff-primary/5' : ''
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <Checkbox
                          checked={selectedProjects.includes(project.id)}
                          onCheckedChange={() => toggleProjectSelection(project.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-ff-text-primary text-lg">{project.name}</h3>
                            <Badge variant="outline">{project.framework}</Badge>
                            <Badge variant={
                              project.status === 'ready' ? 'default' :
                              project.status === 'generating' ? 'secondary' :
                              project.status === 'error' ? 'destructive' : 'secondary'
                            }>
                              {project.status}
                            </Badge>
                          </div>
                          
                          <p className="text-ff-text-secondary mb-3 line-clamp-2">
                            {project.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm text-ff-text-muted">
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {formatFileSize(project.size)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(project.lastModified).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {project.author.split('@')[0]}
                            </div>
                          </div>
                          
                          {project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {project.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="ff-hover-scale"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          {selectedProjects.length === 0 ? (
            <Card className="ff-card-interactive text-center p-12">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-ff-surface rounded-full flex items-center justify-center">
                  <Package className="h-8 w-8 text-ff-text-muted" />
                </div>
                <div>
                  <h3 className="font-semibold text-ff-text-primary mb-2">No projects selected</h3>
                  <p className="text-ff-text-muted mb-4">
                    Go to the Projects tab and select the projects you want to export
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <MultiFormatDownloadSelector
              app={{
                name: `Bulk Export - ${selectedProjects.length} Projects`,
                description: 'Bulk export of selected FlashFusion projects',
                stack: { frontend: 'Multiple', backend: 'Multiple', database: 'Multiple' },
                features: ['Bulk Export', 'Multiple Projects', 'Advanced Options'],
                endpoints: [],
                files: []
              } as GeneratedApp}
              onDownloadStart={() => {}}
              onDownloadComplete={() => {}}
              onDownloadError={(error) => toast.error(error)}
              className="max-w-none"
            />
          )}
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <div className="grid gap-4">
            {exportJobs.length === 0 ? (
              <Card className="ff-card-interactive text-center p-12">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-ff-surface rounded-full flex items-center justify-center">
                    <Archive className="h-8 w-8 text-ff-text-muted" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ff-text-primary mb-2">No export jobs</h3>
                    <p className="text-ff-text-muted">
                      Create your first bulk export to see job history and progress
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              exportJobs.map((job) => (
                <Card key={job.id} className="ff-card-interactive">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(job.status)}
                        <div>
                          <h3 className="font-semibold text-ff-text-primary">{job.name}</h3>
                          <p className="text-sm text-ff-text-muted">
                            {job.selectedProjects.length} projects • {formatFileSize(job.totalSize)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {job.status === 'running' && (
                          <Button size="sm" variant="outline" onClick={() => pauseJob(job.id)}>
                            <Pause className="h-3 w-3" />
                          </Button>
                        )}
                        {job.status === 'paused' && (
                          <Button size="sm" variant="outline" onClick={() => resumeJob(job.id)}>
                            <Play className="h-3 w-3" />
                          </Button>
                        )}
                        {(job.status === 'running' || job.status === 'paused') && (
                          <Button size="sm" variant="destructive" onClick={() => cancelJob(job.id)}>
                            <Square className="h-3 w-3" />
                          </Button>
                        )}
                        {job.status === 'completed' && job.downloadUrl && (
                          <Button size="sm" className="ff-btn-primary" onClick={() => downloadJobResult(job)}>
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        )}
                        {['completed', 'failed'].includes(job.status) && (
                          <Button size="sm" variant="outline" onClick={() => deleteJob(job.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {job.status === 'running' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{Math.round(job.progress)}%</span>
                        </div>
                        <Progress value={job.progress} className="ff-progress-bar" />
                        <div className="flex justify-between text-xs text-ff-text-muted">
                          <span>Processed: {formatFileSize(job.processedSize)}</span>
                          <span>Total: {formatFileSize(job.totalSize)}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-ff-text-muted mt-4">
                      <div>
                        <span>Created: {new Date(job.createdAt).toLocaleString()}</span>
                        {job.completedAt && (
                          <span className="ml-4">Completed: {new Date(job.completedAt).toLocaleString()}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{job.exportFormat}</Badge>
                        {job.errors.length > 0 && (
                          <Badge variant="destructive">{job.errors.length} errors</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Floating Action Button for Export */}
      {selectedProjects.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            size="lg"
            className="ff-btn-primary ff-hover-glow rounded-full shadow-lg"
            onClick={() => {
              // Navigate to export tab
              const exportTab = document.querySelector('[data-value="export"]') as HTMLElement;
              exportTab?.click();
            }}
          >
            <Download className="h-5 w-5 mr-2" />
            Export {selectedProjects.length} Projects
          </Button>
        </div>
      )}
    </div>
  );
}

export default BulkExportManager;
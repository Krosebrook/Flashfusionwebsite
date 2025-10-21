import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Database, Upload, Download, FileText, X, Plus
} from 'lucide-react';
import { toast } from 'sonner';

// Import types and constants
import type { 
  DataImportExportHubProps, 
  ImportJob, 
  ExportJob, 
  DataSource,
  DataTemplate 
} from '../../types/data-import-export';

import { 
  MOCK_IMPORT_JOBS, 
  MOCK_EXPORT_JOBS, 
  MOCK_DATA_SOURCES, 
  MOCK_TEMPLATES,
  JOB_STATUS_OPTIONS 
} from '../../constants/data-import-export';

import { 
  filterJobsByQuery,
  sortJobsByStatus,
  getJobStatistics
} from '../../utils/data-import-export';

// Import sub-components
import { JobCard } from './data-import-export/JobCard';
import { DataSourceCard } from './data-import-export/DataSourceCard';
import { TemplateCard } from './data-import-export/TemplateCard';

export function DataImportExportHub({ onClose }: DataImportExportHubProps) {
  const [activeTab, setActiveTab] = useState('import');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // State for jobs and data sources
  const [importJobs, setImportJobs] = useState(MOCK_IMPORT_JOBS);
  const [exportJobs, setExportJobs] = useState(MOCK_EXPORT_JOBS);
  const [dataSources, setDataSources] = useState(MOCK_DATA_SOURCES);
  const [templates] = useState(MOCK_TEMPLATES);
  
  // Modal states
  const [selectedJob, setSelectedJob] = useState<ImportJob | ExportJob | null>(null);
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<DataTemplate | null>(null);

  // Filter and sort jobs
  const filteredImportJobs = useMemo(() => {
    let filtered = importJobs;

    if (searchQuery) {
      filtered = filterJobsByQuery(filtered, searchQuery) as ImportJob[];
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(job => job.status === selectedStatus);
    }

    return sortJobsByStatus(filtered) as ImportJob[];
  }, [importJobs, searchQuery, selectedStatus]);

  const filteredExportJobs = useMemo(() => {
    let filtered = exportJobs;

    if (searchQuery) {
      filtered = filterJobsByQuery(filtered, searchQuery) as ExportJob[];
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(job => job.status === selectedStatus);
    }

    return sortJobsByStatus(filtered) as ExportJob[];
  }, [exportJobs, searchQuery, selectedStatus]);

  // Statistics
  const connectedSources = useMemo(() => dataSources.filter(s => s.connected), [dataSources]);
  const importStats = useMemo(() => getJobStatistics(importJobs), [importJobs]);
  const exportStats = useMemo(() => getJobStatistics(exportJobs), [exportJobs]);

  // Event handlers
  const handleCancelJob = useCallback((jobId: string, type: 'import' | 'export') => {
    if (type === 'import') {
      setImportJobs(prev => prev.map(job =>
        job.id === jobId ? { ...job, status: 'cancelled' as const } : job
      ));
    } else {
      setExportJobs(prev => prev.map(job =>
        job.id === jobId ? { ...job, status: 'cancelled' as const } : job
      ));
    }
    toast.success('Job cancelled successfully');
  }, []);

  const handleRetryJob = useCallback((jobId: string, type: 'import' | 'export') => {
    if (type === 'import') {
      setImportJobs(prev => prev.map(job =>
        job.id === jobId ? { 
          ...job, 
          status: 'pending' as const, 
          progress: 0,
          errors: []
        } : job
      ));
    } else {
      setExportJobs(prev => prev.map(job =>
        job.id === jobId ? { 
          ...job, 
          status: 'pending' as const, 
          progress: 0
        } : job
      ));
    }
    toast.success('Job queued for retry');
  }, []);

  const handleDownloadExport = useCallback((job: ExportJob) => {
    if (job.downloadUrl) {
      toast.success('Download started!');
    }
  }, []);

  const handleConnectSource = useCallback((sourceId: string) => {
    setDataSources(prev => prev.map(source =>
      source.id === sourceId 
        ? { ...source, connected: true, syncStatus: 'active' as const, lastSync: new Date() }
        : source
    ));
    toast.success('Data source connected successfully!');
  }, []);

  const handleDisconnectSource = useCallback((sourceId: string) => {
    setDataSources(prev => prev.map(source =>
      source.id === sourceId 
        ? { ...source, connected: false, syncStatus: 'inactive' as const }
        : source
    ));
    toast.success('Data source disconnected');
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto bg-card border border-border rounded-lg shadow-lg ff-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Database className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold ff-text-gradient">Data Import/Export Hub</h1>
            <p className="text-sm text-muted-foreground">
              Manage data flows between systems and formats
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{connectedSources.length}</div>
              <div className="text-xs text-muted-foreground">Sources</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-secondary">
                {importStats.processing + exportStats.processing}
              </div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-success">
                {importStats.completed + exportStats.completed}
              </div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
          </div>

          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="ff-hover-scale">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import Data
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </TabsTrigger>
            <TabsTrigger value="sources" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Data Sources
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Templates
            </TabsTrigger>
          </TabsList>

          {/* Import Tab */}
          <TabsContent value="import" className="mt-6 space-y-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Database className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search import jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 ff-focus-ring"
                />
              </div>

              <div className="flex gap-4">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[150px] ff-focus-ring">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_STATUS_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button className="ff-btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  New Import
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredImportJobs.length === 0 ? (
                <div className="text-center py-12">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No import jobs found</h3>
                  <p className="text-muted-foreground mb-4">Start by creating your first data import</p>
                  <Button className="ff-btn-primary">
                    <Upload className="w-4 h-4 mr-2" />
                    Create Import Job
                  </Button>
                </div>
              ) : (
                filteredImportJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    type="import"
                    onCancel={handleCancelJob}
                    onRetry={handleRetryJob}
                    onViewDetails={setSelectedJob}
                  />
                ))
              )}
            </div>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="mt-6 space-y-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Database className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search export jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 ff-focus-ring"
                />
              </div>

              <div className="flex gap-4">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[150px] ff-focus-ring">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_STATUS_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button className="ff-btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  New Export
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredExportJobs.length === 0 ? (
                <div className="text-center py-12">
                  <Download className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No export jobs found</h3>
                  <p className="text-muted-foreground mb-4">Start by creating your first data export</p>
                  <Button className="ff-btn-primary">
                    <Download className="w-4 h-4 mr-2" />
                    Create Export Job
                  </Button>
                </div>
              ) : (
                filteredExportJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    type="export"
                    onCancel={handleCancelJob}
                    onRetry={handleRetryJob}
                    onDownload={handleDownloadExport}
                    onViewDetails={setSelectedJob}
                  />
                ))
              )}
            </div>
          </TabsContent>

          {/* Data Sources Tab */}
          <TabsContent value="sources" className="mt-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Connected Data Sources</h3>
              <Button className="ff-btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Source
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {dataSources.map((source) => (
                <DataSourceCard
                  key={source.id}
                  source={source}
                  onConnect={handleConnectSource}
                  onDisconnect={handleDisconnectSource}
                  onConfigure={setSelectedSource}
                />
              ))}
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="mt-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Data Templates</h3>
              <Button className="ff-btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onUse={(template) => {
                    toast.success(`Using template: ${template.name}`);
                  }}
                  onPreview={setSelectedTemplate}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default DataImportExportHub;
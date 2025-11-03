import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  ShieldX,
  Scan,
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Eye,
  Filter,
  Search,
  FileText,
  Code,
  Database,
  Network,
  Lock,
  Unlock,
  Bug,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  Globe,
  Server
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { SecurityThreat, SecurityMetric } from './types';

interface ScanConfiguration {
  scope: 'full' | 'code-only' | 'dependencies' | 'configuration' | 'runtime';
  depth: 'surface' | 'standard' | 'deep' | 'comprehensive';
  includeThirdParty: boolean;
  includeDevDependencies: boolean;
  ignoreLowSeverity: boolean;
  customRules: string[];
  targets: string[];
}

interface VulnerabilityFinding {
  id: string;
  type: 'code-vulnerability' | 'dependency-issue' | 'config-weakness' | 'runtime-threat';
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: {
    file?: string;
    line?: number;
    column?: number;
    function?: string;
  };
  cve?: string;
  cvss?: number;
  fixAvailable: boolean;
  autoFixable: boolean;
  recommendation: string;
  references: string[];
  impact: string;
  effort: 'low' | 'medium' | 'high';
  category: string;
  tags: string[];
  foundAt: Date;
}

interface ScanResult {
  id: string;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  configuration: ScanConfiguration;
  summary: {
    totalFindings: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    infoCount: number;
    fixableCount: number;
    autoFixableCount: number;
  };
  findings: VulnerabilityFinding[];
  metrics: {
    scanDuration: number;
    filesScanned: number;
    linesAnalyzed: number;
    rulesExecuted: number;
  };
  progress: number;
  currentStage?: string;
}

interface SecurityScanInterfaceProps {
  onScanComplete?: (result: ScanResult) => void;
  onThreatDetected?: (threat: SecurityThreat) => void;
  className?: string;
}

const defaultScanConfig: ScanConfiguration = {
  scope: 'full',
  depth: 'standard',
  includeThirdParty: true,
  includeDevDependencies: false,
  ignoreLowSeverity: false,
  customRules: [],
  targets: []
};

const scanStages = [
  'Initializing scan engine',
  'Loading security rules',
  'Scanning source code',
  'Analyzing dependencies',
  'Checking configurations',
  'Runtime security analysis',
  'Generating report',
  'Finalizing results'
];

export function SecurityScanInterface({ 
  onScanComplete, 
  onThreatDetected, 
  className = '' 
}: SecurityScanInterfaceProps) {
  const [scanConfig, setScanConfig] = useState<ScanConfiguration>(defaultScanConfig);
  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedFindings, setSelectedFindings] = useState<Set<string>>(new Set());
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfigSheet, setShowConfigSheet] = useState(false);
  const [autoFixEnabled, setAutoFixEnabled] = useState(false);

  // Mock real-time security scanning
  const startScan = useCallback(async () => {
    if (isScanning) return;

    const scanId = `scan-${Date.now()}`;
    const newScan: ScanResult = {
      id: scanId,
      startTime: new Date(),
      status: 'running',
      configuration: { ...scanConfig },
      summary: {
        totalFindings: 0,
        criticalCount: 0,
        highCount: 0,
        mediumCount: 0,
        lowCount: 0,
        infoCount: 0,
        fixableCount: 0,
        autoFixableCount: 0
      },
      findings: [],
      metrics: {
        scanDuration: 0,
        filesScanned: 0,
        linesAnalyzed: 0,
        rulesExecuted: 0
      },
      progress: 0
    };

    setCurrentScan(newScan);
    setIsScanning(true);
    toast.success('Security scan started', { 
      description: `Scanning with ${scanConfig.scope} scope and ${scanConfig.depth} depth`
    });

    // Simulate progressive scan with real findings
    const mockFindings: VulnerabilityFinding[] = [
      {
        id: 'vuln-1',
        type: 'code-vulnerability',
        severity: 'high',
        title: 'Potential SQL Injection in User Input Handler',
        description: 'User input is being passed directly to SQL query without proper sanitization',
        location: { file: '/src/api/users.ts', line: 45, column: 12, function: 'getUserById' },
        cve: 'CVE-2023-1234',
        cvss: 7.5,
        fixAvailable: true,
        autoFixable: true,
        recommendation: 'Use parameterized queries or prepared statements',
        references: ['https://owasp.org/www-community/attacks/SQL_Injection'],
        impact: 'Potential unauthorized data access',
        effort: 'low',
        category: 'Input Validation',
        tags: ['sql-injection', 'input-validation', 'database'],
        foundAt: new Date()
      },
      {
        id: 'vuln-2',
        type: 'dependency-issue',
        severity: 'critical',
        title: 'Known Vulnerability in Express.js',
        description: 'Express.js version contains a critical security vulnerability',
        location: { file: 'package.json' },
        cve: 'CVE-2023-5678',
        cvss: 9.1,
        fixAvailable: true,
        autoFixable: true,
        recommendation: 'Update Express.js to version 4.18.2 or later',
        references: ['https://nvd.nist.gov/vuln/detail/CVE-2023-5678'],
        impact: 'Remote code execution possible',
        effort: 'low',
        category: 'Dependencies',
        tags: ['express', 'dependency', 'rce'],
        foundAt: new Date()
      },
      {
        id: 'vuln-3',
        type: 'config-weakness',
        severity: 'medium',
        title: 'Weak CORS Configuration',
        description: 'CORS is configured to allow all origins',
        location: { file: '/src/middleware/cors.ts', line: 8 },
        fixAvailable: true,
        autoFixable: false,
        recommendation: 'Restrict CORS to specific trusted domains',
        references: ['https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS'],
        impact: 'Potential cross-origin attacks',
        effort: 'medium',
        category: 'Configuration',
        tags: ['cors', 'configuration', 'cross-origin'],
        foundAt: new Date()
      },
      {
        id: 'vuln-4',
        type: 'code-vulnerability',
        severity: 'low',
        title: 'Missing Input Length Validation',
        description: 'User input length is not validated before processing',
        location: { file: '/src/components/forms/ContactForm.tsx', line: 23 },
        fixAvailable: true,
        autoFixable: true,
        recommendation: 'Add maximum length validation to prevent DoS attacks',
        references: [],
        impact: 'Potential denial of service',
        effort: 'low',
        category: 'Input Validation',
        tags: ['input-validation', 'dos'],
        foundAt: new Date()
      },
      {
        id: 'vuln-5',
        type: 'runtime-threat',
        severity: 'high',
        title: 'Suspicious API Request Pattern Detected',
        description: 'Detected unusual patterns in API requests that may indicate automated attacks',
        location: {},
        fixAvailable: false,
        autoFixable: false,
        recommendation: 'Implement rate limiting and request monitoring',
        references: [],
        impact: 'Potential brute force or scraping attacks',
        effort: 'high',
        category: 'Runtime Security',
        tags: ['runtime', 'api-abuse', 'rate-limiting'],
        foundAt: new Date()
      }
    ];

    // Simulate progressive scanning
    for (let i = 0; i < scanStages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
      
      const progress = ((i + 1) / scanStages.length) * 100;
      const currentStage = scanStages[i];
      
      // Add findings progressively
      const findingsToAdd = mockFindings.slice(0, Math.floor((i + 1) * mockFindings.length / scanStages.length));
      
      const summary = {
        totalFindings: findingsToAdd.length,
        criticalCount: findingsToAdd.filter(f => f.severity === 'critical').length,
        highCount: findingsToAdd.filter(f => f.severity === 'high').length,
        mediumCount: findingsToAdd.filter(f => f.severity === 'medium').length,
        lowCount: findingsToAdd.filter(f => f.severity === 'low').length,
        infoCount: findingsToAdd.filter(f => f.severity === 'info').length,
        fixableCount: findingsToAdd.filter(f => f.fixAvailable).length,
        autoFixableCount: findingsToAdd.filter(f => f.autoFixable).length
      };

      setCurrentScan(prev => prev ? {
        ...prev,
        progress,
        currentStage,
        findings: findingsToAdd,
        summary,
        metrics: {
          ...prev.metrics,
          filesScanned: Math.floor(progress * 2.5),
          linesAnalyzed: Math.floor(progress * 125),
          rulesExecuted: Math.floor(progress * 0.8)
        }
      } : null);

      // Generate threats for critical findings
      if (i === scanStages.length - 1) {
        const criticalFindings = findingsToAdd.filter(f => f.severity === 'critical');
        criticalFindings.forEach(finding => {
          const threat: SecurityThreat = {
            id: `threat-${finding.id}`,
            type: 'malware',
            severity: 'critical',
            title: `Critical Vulnerability: ${finding.title}`,
            description: finding.description,
            source: 'Security Scan',
            timestamp: new Date(),
            status: 'detected',
            affectedAssets: [finding.location.file || 'System'],
            responseTime: 0
          };
          onThreatDetected?.(threat);
        });
      }
    }

    // Complete scan
    const completedScan: ScanResult = {
      ...newScan,
      endTime: new Date(),
      status: 'completed',
      progress: 100,
      currentStage: 'Scan completed',
      findings: mockFindings,
      summary: {
        totalFindings: mockFindings.length,
        criticalCount: mockFindings.filter(f => f.severity === 'critical').length,
        highCount: mockFindings.filter(f => f.severity === 'high').length,
        mediumCount: mockFindings.filter(f => f.severity === 'medium').length,
        lowCount: mockFindings.filter(f => f.severity === 'low').length,
        infoCount: mockFindings.filter(f => f.severity === 'info').length,
        fixableCount: mockFindings.filter(f => f.fixAvailable).length,
        autoFixableCount: mockFindings.filter(f => f.autoFixable).length
      },
      metrics: {
        scanDuration: (Date.now() - newScan.startTime.getTime()) / 1000,
        filesScanned: 248,
        linesAnalyzed: 12547,
        rulesExecuted: 89
      }
    };

    setCurrentScan(completedScan);
    setScanHistory(prev => [completedScan, ...prev.slice(0, 9)]);
    setIsScanning(false);
    onScanComplete?.(completedScan);

    toast.success('Security scan completed', {
      description: `Found ${completedScan.summary.totalFindings} security issues`
    });
  }, [scanConfig, isScanning, onScanComplete, onThreatDetected]);

  const stopScan = useCallback(() => {
    if (!isScanning || !currentScan) return;

    setCurrentScan(prev => prev ? {
      ...prev,
      status: 'cancelled',
      endTime: new Date()
    } : null);
    setIsScanning(false);
    toast.info('Security scan cancelled');
  }, [isScanning, currentScan]);

  const applyAutoFixes = useCallback(async () => {
    if (!currentScan) return;

    const autoFixableFindings = currentScan.findings.filter(f => f.autoFixable);
    
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 3000)),
      {
        loading: `Applying ${autoFixableFindings.length} automatic fixes...`,
        success: `Successfully applied ${autoFixableFindings.length} fixes`,
        error: 'Failed to apply some fixes'
      }
    );

    // Simulate fixing vulnerabilities
    setTimeout(() => {
      setCurrentScan(prev => prev ? {
        ...prev,
        findings: prev.findings.map(f => 
          f.autoFixable ? { ...f, fixAvailable: false, autoFixable: false } : f
        )
      } : null);
    }, 3000);
  }, [currentScan]);

  const filteredFindings = useMemo(() => {
    if (!currentScan) return [];

    return currentScan.findings.filter(finding => {
      const matchesSeverity = filterSeverity === 'all' || finding.severity === filterSeverity;
      const matchesType = filterType === 'all' || finding.type === filterType;
      const matchesSearch = !searchTerm || 
        finding.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        finding.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        finding.category.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSeverity && matchesType && matchesSearch;
    });
  }, [currentScan, filterSeverity, filterType, searchTerm]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <ShieldX className="h-4 w-4 text-destructive" />;
      case 'high': return <ShieldAlert className="h-4 w-4 text-warning" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'low': return <AlertCircle className="h-4 w-4 text-info" />;
      default: return <Shield className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'code-vulnerability': return <Code className="h-4 w-4" />;
      case 'dependency-issue': return <Database className="h-4 w-4" />;
      case 'config-weakness': return <Settings className="h-4 w-4" />;
      case 'runtime-threat': return <Activity className="h-4 w-4" />;
      default: return <Bug className="h-4 w-4" />;
    }
  };

  return (
    <div className={`ff-stagger-fade space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="ff-text-2xl font-bold text-foreground font-sora">
            Security Scanner
          </h1>
          <p className="ff-text-base text-muted-foreground font-inter">
            Comprehensive security vulnerability detection and automated remediation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Sheet open={showConfigSheet} onOpenChange={setShowConfigSheet}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="ff-focus-ring">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </SheetTrigger>
            <SheetContent className="ff-glass">
              <SheetHeader>
                <SheetTitle className="font-sora">Scan Configuration</SheetTitle>
                <SheetDescription className="font-inter">
                  Customize security scan parameters
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="scope" className="font-sora">Scan Scope</Label>
                  <Select value={scanConfig.scope} onValueChange={(value: any) => 
                    setScanConfig(prev => ({ ...prev, scope: value }))
                  }>
                    <SelectTrigger className="ff-focus-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full System Scan</SelectItem>
                      <SelectItem value="code-only">Code Analysis Only</SelectItem>
                      <SelectItem value="dependencies">Dependencies Only</SelectItem>
                      <SelectItem value="configuration">Configuration Only</SelectItem>
                      <SelectItem value="runtime">Runtime Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="depth" className="font-sora">Analysis Depth</Label>
                  <Select value={scanConfig.depth} onValueChange={(value: any) => 
                    setScanConfig(prev => ({ ...prev, depth: value }))
                  }>
                    <SelectTrigger className="ff-focus-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="surface">Surface Scan</SelectItem>
                      <SelectItem value="standard">Standard Analysis</SelectItem>
                      <SelectItem value="deep">Deep Analysis</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive Audit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="third-party" 
                      checked={scanConfig.includeThirdParty}
                      onCheckedChange={(checked) => 
                        setScanConfig(prev => ({ ...prev, includeThirdParty: checked as boolean }))
                      }
                    />
                    <Label htmlFor="third-party" className="font-inter">Include third-party components</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="dev-deps" 
                      checked={scanConfig.includeDevDependencies}
                      onCheckedChange={(checked) => 
                        setScanConfig(prev => ({ ...prev, includeDevDependencies: checked as boolean }))
                      }
                    />
                    <Label htmlFor="dev-deps" className="font-inter">Include development dependencies</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="ignore-low" 
                      checked={scanConfig.ignoreLowSeverity}
                      onCheckedChange={(checked) => 
                        setScanConfig(prev => ({ ...prev, ignoreLowSeverity: checked as boolean }))
                      }
                    />
                    <Label htmlFor="ignore-low" className="font-inter">Ignore low severity issues</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="auto-fix" 
                      checked={autoFixEnabled}
                      onCheckedChange={(checked) => setAutoFixEnabled(checked as boolean)}
                    />
                    <Label htmlFor="auto-fix" className="font-inter">Enable automatic fixes</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-rules" className="font-sora">Custom Rules (optional)</Label>
                  <Textarea 
                    id="custom-rules"
                    placeholder="Enter custom security rules, one per line..."
                    className="ff-focus-ring font-mono"
                    value={scanConfig.customRules.join('\n')}
                    onChange={(e) => 
                      setScanConfig(prev => ({ 
                        ...prev, 
                        customRules: e.target.value.split('\n').filter(Boolean) 
                      }))
                    }
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {isScanning ? (
            <Button 
              onClick={stopScan} 
              variant="destructive" 
              size="sm"
              className="ff-btn-accent ff-hover-glow"
            >
              <Pause className="h-4 w-4 mr-2" />
              Stop Scan
            </Button>
          ) : (
            <Button 
              onClick={startScan} 
              size="sm"
              className="ff-btn-primary ff-hover-glow"
            >
              <Scan className="h-4 w-4 mr-2" />
              Start Scan
            </Button>
          )}
        </div>
      </div>

      {/* Current Scan Status */}
      {currentScan && (
        <Card className="ff-card-interactive">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-sora flex items-center gap-2">
                {isScanning ? (
                  <Activity className="h-5 w-5 text-primary animate-pulse" />
                ) : currentScan.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
                {isScanning ? 'Scanning in Progress' : 'Latest Scan Results'}
              </CardTitle>
              
              {currentScan.status === 'completed' && (
                <div className="flex items-center gap-2">
                  {currentScan.summary.autoFixableCount > 0 && (
                    <Button 
                      onClick={applyAutoFixes}
                      size="sm" 
                      variant="outline"
                      className="ff-hover-scale ff-focus-ring"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Auto-Fix ({currentScan.summary.autoFixableCount})
                    </Button>
                  )}
                  
                  <Button size="sm" variant="outline" className="ff-hover-scale ff-focus-ring">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {isScanning && (
              <div className="space-y-3">
                <div className="flex items-center justify-between ff-text-sm">
                  <span className="text-muted-foreground font-inter">
                    {currentScan.currentStage}
                  </span>
                  <span className="font-semibold font-sora">
                    {Math.round(currentScan.progress)}%
                  </span>
                </div>
                <Progress value={currentScan.progress} className="ff-progress-bar" />
                
                <div className="grid grid-cols-3 gap-4 ff-text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {currentScan.metrics.filesScanned} files
                  </div>
                  <div className="flex items-center gap-1">
                    <Code className="h-3 w-3" />
                    {currentScan.metrics.linesAnalyzed.toLocaleString()} lines
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    {currentScan.metrics.rulesExecuted} rules
                  </div>
                </div>
              </div>
            )}

            {!isScanning && currentScan.status === 'completed' && (
              <div className="space-y-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <Card className="ff-hover-lift">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="ff-text-xs text-muted-foreground font-inter">Total Issues</p>
                          <p className="ff-text-lg font-bold font-sora">
                            {currentScan.summary.totalFindings}
                          </p>
                        </div>
                        <Bug className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="ff-hover-lift">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="ff-text-xs text-muted-foreground font-inter">Critical</p>
                          <p className="ff-text-lg font-bold text-destructive font-sora">
                            {currentScan.summary.criticalCount}
                          </p>
                        </div>
                        <ShieldX className="h-4 w-4 text-destructive" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="ff-hover-lift">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="ff-text-xs text-muted-foreground font-inter">High</p>
                          <p className="ff-text-lg font-bold text-warning font-sora">
                            {currentScan.summary.highCount}
                          </p>
                        </div>
                        <ShieldAlert className="h-4 w-4 text-warning" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="ff-hover-lift">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="ff-text-xs text-muted-foreground font-inter">Auto-Fixable</p>
                          <p className="ff-text-lg font-bold text-success font-sora">
                            {currentScan.summary.autoFixableCount}
                          </p>
                        </div>
                        <Zap className="h-4 w-4 text-success" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="ff-hover-lift">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="ff-text-xs text-muted-foreground font-inter">Scan Time</p>
                          <p className="ff-text-lg font-bold font-sora">
                            {Math.round(currentScan.metrics.scanDuration)}s
                          </p>
                        </div>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search vulnerabilities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 ff-focus-ring"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                      <SelectTrigger className="w-32 ff-focus-ring">
                        <SelectValue placeholder="Severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Severity</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-40 ff-focus-ring">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="code-vulnerability">Code Issues</SelectItem>
                        <SelectItem value="dependency-issue">Dependencies</SelectItem>
                        <SelectItem value="config-weakness">Configuration</SelectItem>
                        <SelectItem value="runtime-threat">Runtime</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Findings List */}
                <div className="space-y-3">
                  {filteredFindings.length === 0 ? (
                    <Card className="ff-glass">
                      <CardContent className="flex items-center justify-center py-8">
                        <div className="text-center space-y-2">
                          <ShieldCheck className="h-12 w-12 text-success mx-auto" />
                          <h3 className="ff-text-lg font-semibold font-sora">No Issues Found</h3>
                          <p className="ff-text-sm text-muted-foreground font-inter">
                            {searchTerm || filterSeverity !== 'all' || filterType !== 'all' 
                              ? 'No vulnerabilities match your current filters'
                              : 'Your application appears to be secure!'
                            }
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <ScrollArea className="h-96">
                      <div className="space-y-3 pr-4">
                        {filteredFindings.map((finding) => (
                          <Card key={finding.id} className="ff-card-interactive ff-hover-lift">
                            <CardContent className="pt-4">
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                  {getSeverityIcon(finding.severity)}
                                </div>
                                
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                      <h4 className="ff-text-sm font-semibold font-sora">
                                        {finding.title}
                                      </h4>
                                      <p className="ff-text-xs text-muted-foreground font-inter">
                                        {finding.description}
                                      </p>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                      <Badge variant={getSeverityColor(finding.severity) as any}>
                                        {finding.severity}
                                      </Badge>
                                      {finding.autoFixable && (
                                        <Badge variant="outline" className="text-success">
                                          <Zap className="h-3 w-3 mr-1" />
                                          Auto-fix
                                        </Badge>
                                      )}
                                    </div>
                                  </div>

                                  {finding.location.file && (
                                    <div className="flex items-center gap-2 ff-text-xs text-muted-foreground">
                                      <FileText className="h-3 w-3" />
                                      <span className="font-mono">
                                        {finding.location.file}
                                        {finding.location.line && `:${finding.location.line}`}
                                      </span>
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 ff-text-xs text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        {getTypeIcon(finding.type)}
                                        <span>{finding.category}</span>
                                      </div>
                                      {finding.cvss && (
                                        <div className="flex items-center gap-1">
                                          <TrendingUp className="h-3 w-3" />
                                          <span>CVSS: {finding.cvss}</span>
                                        </div>
                                      )}
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>Effort: {finding.effort}</span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                              <Eye className="h-3 w-3" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <div className="max-w-sm space-y-2">
                                              <p className="font-semibold">Recommendation:</p>
                                              <p className="ff-text-xs">{finding.recommendation}</p>
                                              {finding.impact && (
                                                <>
                                                  <p className="font-semibold">Impact:</p>
                                                  <p className="ff-text-xs">{finding.impact}</p>
                                                </>
                                              )}
                                            </div>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>

                                      {finding.fixAvailable && (
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          className="ff-text-xs ff-hover-scale"
                                        >
                                          {finding.autoFixable ? 'Auto-Fix' : 'Guide'}
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <Card className="ff-card-interactive">
          <CardHeader>
            <CardTitle className="font-sora">Recent Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scanHistory.slice(0, 5).map((scan) => (
                <div 
                  key={scan.id} 
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 ff-hover-lift cursor-pointer"
                  onClick={() => setCurrentScan(scan)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {scan.status === 'completed' ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : scan.status === 'failed' ? (
                        <XCircle className="h-4 w-4 text-destructive" />
                      ) : (
                        <Clock className="h-4 w-4 text-warning" />
                      )}
                    </div>
                    
                    <div>
                      <p className="ff-text-sm font-semibold font-sora">
                        {scan.configuration.scope} scan - {scan.configuration.depth}
                      </p>
                      <p className="ff-text-xs text-muted-foreground font-inter">
                        {scan.startTime.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 ff-text-xs text-muted-foreground">
                    <span>{scan.summary.totalFindings} issues</span>
                    <span>{Math.round(scan.metrics.scanDuration)}s</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default SecurityScanInterface;
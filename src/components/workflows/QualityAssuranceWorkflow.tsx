import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { CheckCircle, Shield, Bug, Code, Globe, Zap, FileCheck, Settings, Target, ArrowRight, AlertTriangle, Star } from 'lucide-react';

interface QualityAssuranceWorkflowProps {
  onComplete?: () => void;
}

export function QualityAssuranceWorkflow({ onComplete }: QualityAssuranceWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedChecks, setSelectedChecks] = useState<string[]>([]);
  const [qualityScore, setQualityScore] = useState(0);
  const [setupProgress, setSetupProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [qaResults, setQAResults] = useState<any>(null);

  const qualityChecks = [
    {
      id: 'code-quality',
      name: 'Code Quality Analysis',
      description: 'Automated code review, linting, and best practices validation',
      icon: Code,
      category: 'code',
      priority: 'critical',
      impact: 25,
      checks: ['ESLint/TSLint rules', 'Code complexity analysis', 'Security vulnerabilities', 'Performance anti-patterns'],
      standards: ['Clean Code', 'SOLID Principles', 'Security Best Practices', 'Performance Guidelines'],
      recommended: true
    },
    {
      id: 'performance',
      name: 'Performance Testing',
      description: 'Comprehensive performance analysis and optimization recommendations',
      icon: Zap,
      category: 'performance',
      priority: 'critical',
      impact: 20,
      checks: ['Core Web Vitals', 'Load time analysis', 'Bundle size optimization', 'Resource optimization'],
      standards: ['Google PageSpeed', 'Lighthouse Audit', 'Web Vitals', 'Performance Budget'],
      recommended: true
    },
    {
      id: 'security',
      name: 'Security Audit',
      description: 'Security vulnerability scanning and compliance verification',
      icon: Shield,
      category: 'security',
      priority: 'critical',
      impact: 20,
      checks: ['Vulnerability scanning', 'Dependency audit', 'Authentication review', 'Data protection'],
      standards: ['OWASP Top 10', 'Security Headers', 'Encryption Standards', 'Access Controls']
    },
    {
      id: 'accessibility',
      name: 'Accessibility Compliance',
      description: 'WCAG compliance testing and accessibility improvements',
      icon: Globe,
      category: 'accessibility',
      priority: 'high',
      impact: 15,
      checks: ['WCAG 2.1 AA compliance', 'Screen reader compatibility', 'Keyboard navigation', 'Color contrast'],
      standards: ['WCAG 2.1 AA', 'Section 508', 'ADA Compliance', 'ARIA Guidelines']
    },
    {
      id: 'functionality',
      name: 'Functional Testing',
      description: 'Automated testing of core functionality and user workflows',
      icon: FileCheck,
      category: 'functional',
      priority: 'high',
      impact: 10,
      checks: ['Unit tests', 'Integration tests', 'E2E testing', 'API testing'],
      standards: ['Test Coverage', 'Testing Best Practices', 'CI/CD Integration', 'Quality Gates']
    },
    {
      id: 'compatibility',
      name: 'Cross-Browser Testing',
      description: 'Multi-browser and device compatibility verification',
      icon: Settings,
      category: 'compatibility',
      priority: 'medium',
      impact: 10,
      checks: ['Browser compatibility', 'Device responsiveness', 'Mobile optimization', 'Feature support'],
      standards: ['Progressive Enhancement', 'Mobile-First Design', 'Browser Support Matrix', 'Responsive Design']
    }
  ];

  const qualityStandards = [
    {
      id: 'web-standards',
      name: 'Web Standards Compliance',
      description: 'HTML5, CSS3, JavaScript ES6+ standards compliance',
      icon: '🌐',
      category: 'standards',
      requirements: ['Valid HTML5', 'Modern CSS', 'ES6+ JavaScript', 'Progressive Enhancement']
    },
    {
      id: 'performance-budget',
      name: 'Performance Budget',
      description: 'Defined performance thresholds and optimization targets',
      icon: '⚡',
      category: 'performance',
      requirements: ['< 3s load time', '< 500KB JS bundle', '90+ Lighthouse score', 'Optimized images']
    },
    {
      id: 'security-standards',
      name: 'Security Standards',
      description: 'Industry-standard security practices and compliance',
      icon: '🔒',
      category: 'security',
      requirements: ['HTTPS enforcement', 'CSP headers', 'Secure dependencies', 'Data encryption']
    },
    {
      id: 'accessibility-standards',
      name: 'Accessibility Standards',
      description: 'WCAG 2.1 AA compliance and inclusive design',
      icon: '♿',
      category: 'accessibility',
      requirements: ['WCAG 2.1 AA', 'Screen reader support', 'Keyboard navigation', 'Color contrast 4.5:1']
    }
  ];

  const handleCheckToggle = (checkId: string) => {
    setSelectedChecks(prev => {
      const newChecks = prev.includes(checkId) 
        ? prev.filter(id => id !== checkId)
        : [...prev, checkId];
      
      // Calculate quality score
      const score = newChecks.reduce((total, id) => {
        const check = qualityChecks.find(c => c.id === id);
        return total + (check?.impact || 0);
      }, 0);
      setQualityScore(score);
      
      return newChecks;
    });
  };

  const handleRunQualityAssurance = async () => {
    setIsRunning(true);
    setCurrentStep(3);
    
    // Simulate QA process
    for (let i = 0; i <= 100; i += 2) {
      setSetupProgress(i);
      await new Promise(resolve => setTimeout(resolve, 80));
    }
    
    // Generate QA results
    setQAResults({
      overallScore: Math.min(85 + Math.floor(Math.random() * 15), 100),
      checks: selectedChecks.map(checkId => {
        const check = qualityChecks.find(c => c.id === checkId);
        return {
          id: checkId,
          name: check?.name,
          status: Math.random() > 0.1 ? 'passed' : 'warning',
          score: Math.floor(Math.random() * 20) + 80,
          issues: generateIssues(checkId),
          recommendations: generateRecommendations(checkId)
        };
      }),
      metrics: {
        codeQuality: Math.floor(Math.random() * 15) + 85,
        performance: Math.floor(Math.random() * 10) + 90,
        security: Math.floor(Math.random() * 8) + 92,
        accessibility: Math.floor(Math.random() * 12) + 88
      },
      compliance: {
        webStandards: Math.random() > 0.2,
        performanceBudget: Math.random() > 0.3,
        securityStandards: Math.random() > 0.1,
        accessibilityStandards: Math.random() > 0.4
      },
      improvements: generateImprovements()
    });
    
    setIsRunning(false);
    setCurrentStep(4);
  };

  const generateIssues = (checkId: string) => {
    const issueTemplates = {
      'code-quality': [
        'Unused variable detected in utils/helper.ts:42',
        'Complex function exceeds cognitive complexity threshold',
        'Missing error handling in async function'
      ],
      'performance': [
        'Large JavaScript bundle detected (650KB)',
        'Unused CSS rules found (23% reduction possible)',
        'Images not optimized for web delivery'
      ],
      'security': [
        'Dependency with known vulnerability: lodash@4.17.19',
        'Missing Content Security Policy header',
        'Sensitive data logged in console'
      ],
      'accessibility': [
        'Missing alt text for decorative images',
        'Insufficient color contrast ratio (3.2:1)',
        'Form inputs missing associated labels'
      ],
      'functionality': [
        'Test coverage below threshold (78%)',
        'API endpoint timeout not handled',
        'Edge case validation missing'
      ],
      'compatibility': [
        'Feature not supported in Safari 14',
        'Layout issues on small screens (<375px)',
        'Touch target size below 44px recommendation'
      ]
    };

    const templates = issueTemplates[checkId as keyof typeof issueTemplates] || [];
    return templates.slice(0, Math.floor(Math.random() * 3) + 1);
  };

  const generateRecommendations = (checkId: string) => {
    const recommendationTemplates = {
      'code-quality': [
        'Enable strict TypeScript mode for better type safety',
        'Implement code splitting to reduce bundle size',
        'Add pre-commit hooks for automatic linting'
      ],
      'performance': [
        'Implement lazy loading for below-fold images',
        'Enable Gzip compression on server',
        'Use performance budget in CI/CD pipeline'
      ],
      'security': [
        'Update vulnerable dependencies to latest versions',
        'Implement Content Security Policy headers',
        'Enable security headers (HSTS, X-Frame-Options)'
      ],
      'accessibility': [
        'Add semantic HTML structure for screen readers',
        'Implement skip navigation links',
        'Test with actual assistive technologies'
      ],
      'functionality': [
        'Increase test coverage to 90%+ threshold',
        'Add integration tests for critical user flows',
        'Set up automated testing in CI/CD'
      ],
      'compatibility': [
        'Use progressive enhancement approach',
        'Test on actual devices, not just browser dev tools',
        'Implement polyfills for older browser support'
      ]
    };

    const templates = recommendationTemplates[checkId as keyof typeof recommendationTemplates] || [];
    return templates.slice(0, Math.floor(Math.random() * 2) + 1);
  };

  const generateImprovements = () => [
    {
      category: 'Performance',
      improvement: 'Optimize image delivery',
      impact: '+12% faster page load',
      effort: 'Low'
    },
    {
      category: 'Security',
      improvement: 'Update dependencies',
      impact: '5 vulnerabilities fixed',
      effort: 'Medium'
    },
    {
      category: 'Accessibility',
      improvement: 'Improve color contrast',
      impact: '+15% accessibility score',
      effort: 'Low'
    },
    {
      category: 'Code Quality',
      improvement: 'Refactor complex functions',
      impact: '+8% maintainability',
      effort: 'High'
    }
  ];

  const getQualityLevel = (score: number) => {
    if (score >= 90) return { level: 'Excellent', color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20' };
    if (score >= 80) return { level: 'Good', color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' };
    if (score >= 70) return { level: 'Fair', color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/20' };
    return { level: 'Needs Work', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' };
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-emerald-500 to-green-500">
                <FileCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="ff-text-headline">Quality Assurance</h2>
                <p className="ff-text-body">Automated quality checks ensure your content meets professional standards</p>
              </div>
            </div>

            <Card className="ff-card">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="text-6xl font-bold text-transparent bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text">
                    {qualityScore}%
                  </div>
                  <div>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full ${getQualityLevel(qualityScore).bg}`}>
                      <span className={`font-semibold ${getQualityLevel(qualityScore).color}`}>
                        {getQualityLevel(qualityScore).level} Quality Level
                      </span>
                    </div>
                  </div>
                  <Progress value={qualityScore} className="h-3" />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="ff-text-title">Quality Assurance Checks</h3>
              
              {['critical', 'high', 'medium'].map(priority => {
                const priorityChecks = qualityChecks.filter(c => c.priority === priority);
                const priorityLabels = {
                  critical: { name: 'Essential Quality', color: 'text-red-500', icon: '🔴' },
                  high: { name: 'Professional Standards', color: 'text-orange-500', icon: '🟠' },
                  medium: { name: 'Excellence Standards', color: 'text-yellow-500', icon: '🟡' }
                };
                const label = priorityLabels[priority as keyof typeof priorityLabels];
                
                return (
                  <div key={priority} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{label.icon}</span>
                      <h4 className={`ff-text-title text-base ${label.color}`}>{label.name}</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {priorityChecks.map(check => {
                        const Icon = check.icon;
                        return (
                          <Card 
                            key={check.id}
                            className={`ff-card-interactive cursor-pointer transition-all duration-200 ${
                              selectedChecks.includes(check.id) 
                                ? 'ring-2 ring-emerald-500 bg-emerald-500/10' 
                                : 'hover:bg-white/5'
                            }`}
                            onClick={() => handleCheckToggle(check.id)}
                          >
                            <CardContent className="p-6">
                              <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500">
                                      <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                      <h5 className="font-semibold">{check.name}</h5>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <Badge className="ff-badge-primary text-xs">+{check.impact}%</Badge>
                                        {check.recommended && (
                                          <Badge variant="secondary" className="text-xs">Recommended</Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {selectedChecks.includes(check.id) && (
                                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                                  )}
                                </div>
                                
                                <p className="text-sm text-gray-400">{check.description}</p>
                                
                                <div className="space-y-2">
                                  <div className="text-xs text-gray-500 font-medium">Quality Checks:</div>
                                  <div className="flex flex-wrap gap-1">
                                    {check.checks.slice(0, 2).map(checkItem => (
                                      <Badge key={checkItem} variant="outline" className="text-xs">
                                        {checkItem}
                                      </Badge>
                                    ))}
                                    {check.checks.length > 2 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{check.checks.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="space-y-1">
                                  <div className="text-xs text-gray-500 font-medium">Standards:</div>
                                  <div className="flex flex-wrap gap-1">
                                    {check.standards.slice(0, 2).map(standard => (
                                      <Badge key={standard} variant="secondary" className="text-xs">
                                        {standard}
                                      </Badge>
                                    ))}
                                    {check.standards.length > 2 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{check.standards.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={() => setCurrentStep(2)}
                disabled={selectedChecks.length === 0}
                className="ff-btn-primary ff-btn-lg"
              >
                Configure Quality Standards ({selectedChecks.length} check{selectedChecks.length !== 1 ? 's' : ''})
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="ff-text-headline">Quality Standards Configuration</h2>
              <p className="ff-text-body">Set thresholds, standards, and automation preferences</p>
            </div>

            <Card className="ff-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Quality Score Target: {getQualityLevel(qualityScore).level}</span>
                  <Badge className={getQualityLevel(qualityScore).bg.replace('bg-', 'ff-badge-')}>
                    {qualityScore}% Quality Score
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedChecks.map(checkId => {
                    const check = qualityChecks.find(c => c.id === checkId);
                    const Icon = check?.icon || FileCheck;
                    return (
                      <div key={checkId} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded bg-gradient-to-r from-emerald-500 to-green-500">
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">{check?.name}</span>
                        </div>
                        <Badge variant="secondary">+{check?.impact}%</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="thresholds" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
                <TabsTrigger value="standards">Standards</TabsTrigger>
                <TabsTrigger value="automation">Automation</TabsTrigger>
                <TabsTrigger value="reporting">Reporting</TabsTrigger>
              </TabsList>
              
              <TabsContent value="thresholds" className="space-y-4">
                <Card className="ff-card">
                  <CardContent className="p-6 space-y-4">
                    <h4 className="ff-text-title">Quality Thresholds</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="ff-text-title text-sm">Minimum Code Quality Score</label>
                        <Input 
                          placeholder="85" 
                          className="ff-input"
                          defaultValue="85"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="ff-text-title text-sm">Performance Score Target</label>
                        <Input 
                          placeholder="90" 
                          className="ff-input"
                          defaultValue="90"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="ff-text-title text-sm">Security Score Minimum</label>
                        <Input 
                          placeholder="95" 
                          className="ff-input"
                          defaultValue="95"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="ff-text-title text-sm">Accessibility Score Target</label>
                        <Input 
                          placeholder="88" 
                          className="ff-input"
                          defaultValue="88"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Block on Critical Issues</div>
                          <div className="text-xs text-gray-400">Prevent deployment if critical issues found</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Warn on Performance Degradation</div>
                          <div className="text-xs text-gray-400">Alert when performance drops below threshold</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="standards" className="space-y-4">
                <Card className="ff-card">
                  <CardContent className="p-6 space-y-4">
                    <h4 className="ff-text-title">Compliance Standards</h4>
                    
                    <div className="space-y-3">
                      {qualityStandards.map(standard => (
                        <div key={standard.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{standard.icon}</span>
                              <h5 className="font-semibold">{standard.name}</h5>
                              <Badge variant="secondary" className="text-xs">{standard.category}</Badge>
                            </div>
                            <p className="text-sm text-gray-400">{standard.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {standard.requirements.map(req => (
                                <Badge key={req} variant="outline" className="text-xs">
                                  {req}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="automation" className="space-y-4">
                <Card className="ff-card">
                  <CardContent className="p-6 space-y-4">
                    <h4 className="ff-text-title">Automated Quality Checks</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Pre-commit Hooks</div>
                          <div className="text-xs text-gray-400">Run quality checks before commits</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">CI/CD Integration</div>
                          <div className="text-xs text-gray-400">Quality gates in deployment pipeline</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Scheduled Audits</div>
                          <div className="text-xs text-gray-400">Weekly automated quality audits</div>
                        </div>
                        <Switch />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Auto-fix Minor Issues</div>
                          <div className="text-xs text-gray-400">Automatically fix formatting and simple issues</div>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reporting" className="space-y-4">
                <Card className="ff-card">
                  <CardContent className="p-6 space-y-4">
                    <h4 className="ff-text-title">Quality Reports</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Quality Dashboard</div>
                          <div className="text-xs text-gray-400">Real-time quality metrics</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Trend Analysis</div>
                          <div className="text-xs text-gray-400">Quality trends over time</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Compliance Reports</div>
                          <div className="text-xs text-gray-400">Standards compliance documentation</div>
                        </div>
                        <Switch />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Team Notifications</div>
                          <div className="text-xs text-gray-400">Quality alerts and updates</div>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(1)}
                className="ff-btn-outline"
              >
                Back to Quality Checks
              </Button>
              <Button 
                onClick={handleRunQualityAssurance}
                className="ff-btn-primary ff-btn-lg"
              >
                Run Quality Assurance
                <FileCheck className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-emerald-500 to-green-500 animate-pulse">
                <FileCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="ff-text-headline">Running Quality Assurance</h2>
                <p className="ff-text-body">Analyzing code quality, performance, security, and compliance</p>
              </div>
            </div>

            <Card className="ff-card">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="ff-text-title text-sm">Quality Analysis Progress</span>
                    <span className="ff-text-title text-sm">{Math.round(setupProgress)}%</span>
                  </div>
                  <Progress value={setupProgress} className="h-3" />
                </div>

                <div className="space-y-4">
                  {selectedChecks.map((checkId, index) => {
                    const check = qualityChecks.find(c => c.id === checkId);
                    const Icon = check?.icon || FileCheck;
                    const progress = Math.min(setupProgress * (Math.random() * 0.3 + 0.8), 100);
                    
                    return (
                      <div key={checkId} className="p-4 bg-gray-800 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="p-2 rounded bg-gradient-to-r from-emerald-500 to-green-500">
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium text-sm">{check?.name}</span>
                          </div>
                          {progress >= 100 ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                          )}
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="mt-2 text-xs text-gray-400">
                          {progress >= 100 ? 'Analysis complete' : 'Analyzing quality metrics...'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <div className="flex items-center space-x-2 text-emerald-400 mb-2">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-medium">Quality Assurance Analysis</span>
                  </div>
                  <ul className="text-sm text-emerald-300 space-y-1">
                    <li>• Running automated code quality checks</li>
                    <li>• Analyzing performance and optimization opportunities</li>
                    <li>• Scanning for security vulnerabilities</li>
                    <li>• Validating compliance with quality standards</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="ff-text-headline">Quality Assurance Complete!</h2>
                <p className="ff-text-body">Comprehensive quality analysis finished with recommendations</p>
              </div>
            </div>

            {qaResults && (
              <div className="space-y-6">
                <Card className="ff-card">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Overall Quality Score</span>
                      <div className="flex items-center space-x-2">
                        {qaResults.overallScore >= 90 && <Star className="w-5 h-5 text-yellow-500" />}
                        <Badge className={qaResults.overallScore >= 90 ? 'ff-badge-success' : qaResults.overallScore >= 80 ? 'ff-badge-secondary' : 'ff-badge-warning'}>
                          {qaResults.overallScore}%
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-500">{qaResults.metrics.codeQuality}</div>
                        <div className="text-sm text-gray-400">Code Quality</div>
                      </div>
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-500">{qaResults.metrics.performance}</div>
                        <div className="text-sm text-gray-400">Performance</div>
                      </div>
                      <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-500">{qaResults.metrics.security}</div>
                        <div className="text-sm text-gray-400">Security</div>
                      </div>
                      <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-orange-500">{qaResults.metrics.accessibility}</div>
                        <div className="text-sm text-gray-400">Accessibility</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card">
                  <CardHeader>
                    <CardTitle>Quality Check Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {qaResults.checks.map((check: any) => (
                      <div key={check.id} className="p-4 bg-gray-800 rounded-lg border">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-4">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              check.status === 'passed' ? 'bg-green-500' : 'bg-yellow-500'
                            }`}>
                              {check.status === 'passed' ? (
                                <CheckCircle className="w-4 h-4 text-white" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold">{check.name}</h4>
                              <p className="text-sm text-gray-400">Score: {check.score}%</p>
                            </div>
                          </div>
                          <Badge className={check.status === 'passed' ? 'ff-badge-success' : 'ff-badge-warning'}>
                            {check.status === 'passed' ? 'Passed' : 'Needs Attention'}
                          </Badge>
                        </div>
                        
                        {check.issues && check.issues.length > 0 && (
                          <div className="mb-3">
                            <h5 className="text-sm font-medium text-yellow-500 mb-2">Issues Found:</h5>
                            <div className="space-y-1">
                              {check.issues.map((issue: string, index: number) => (
                                <div key={index} className="text-sm text-gray-300 flex items-start space-x-2">
                                  <Bug className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                                  <span>{issue}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {check.recommendations && check.recommendations.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-blue-500 mb-2">Recommendations:</h5>
                            <div className="space-y-1">
                              {check.recommendations.map((rec: string, index: number) => (
                                <div key={index} className="text-sm text-gray-300 flex items-start space-x-2">
                                  <Target className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                  <span>{rec}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Tabs defaultValue="improvements" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="improvements">Improvements</TabsTrigger>
                    <TabsTrigger value="compliance">Compliance</TabsTrigger>
                    <TabsTrigger value="actions">Next Actions</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="improvements" className="space-y-4">
                    <Card className="ff-card">
                      <CardContent className="p-6">
                        <h4 className="ff-text-title mb-4">Recommended Improvements</h4>
                        <div className="space-y-3">
                          {qaResults.improvements.map((improvement: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border">
                              <div>
                                <h5 className="font-semibold text-sm">{improvement.improvement}</h5>
                                <p className="text-xs text-gray-400">{improvement.category} improvement</p>
                                <div className="mt-1">
                                  <Badge variant="outline" className="text-xs mr-2">{improvement.impact}</Badge>
                                  <Badge variant="secondary" className="text-xs">{improvement.effort} effort</Badge>
                                </div>
                              </div>
                              <Button size="sm" variant="outline">Apply</Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="compliance" className="space-y-4">
                    <Card className="ff-card">
                      <CardContent className="p-6">
                        <h4 className="ff-text-title mb-4">Standards Compliance</h4>
                        <div className="space-y-3">
                          {Object.entries(qaResults.compliance).map(([standard, compliant]) => (
                            <div key={standard} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                              <div>
                                <div className="font-medium text-sm capitalize">{standard.replace(/([A-Z])/g, ' $1').trim()}</div>
                                <div className="text-xs text-gray-400">Industry standard compliance</div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {compliant ? (
                                  <>
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <Badge className="ff-badge-success">Compliant</Badge>
                                  </>
                                ) : (
                                  <>
                                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                    <Badge className="ff-badge-warning">Needs Work</Badge>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="actions" className="space-y-4">
                    <Card className="ff-card">
                      <CardContent className="p-6">
                        <h4 className="ff-text-title mb-4">Immediate Actions</h4>
                        <div className="space-y-3">
                          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                              <span className="font-medium text-red-500">Critical Issues</span>
                            </div>
                            <p className="text-sm text-red-400">Address critical security and performance issues immediately</p>
                          </div>
                          
                          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Target className="w-4 h-4 text-yellow-500" />
                              <span className="font-medium text-yellow-500">High Priority</span>
                            </div>
                            <p className="text-sm text-yellow-400">Implement accessibility improvements and code quality fixes</p>
                          </div>
                          
                          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Settings className="w-4 h-4 text-blue-500" />
                              <span className="font-medium text-blue-500">Automation</span>
                            </div>
                            <p className="text-sm text-blue-400">Set up automated quality checks in CI/CD pipeline</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedChecks([]);
                  setQualityScore(0);
                  setSetupProgress(0);
                  setQAResults(null);
                }}
                className="ff-btn-outline"
              >
                Run Another Analysis
              </Button>
              <Button 
                onClick={onComplete}
                className="ff-btn-primary ff-btn-lg"
              >
                Complete Workflow Setup
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Progress indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step <= currentStep 
                ? 'bg-emerald-500 text-white' 
                : 'bg-gray-700 text-gray-400'
            }`}>
              {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
            </div>
            {step < 4 && (
              <div className={`w-16 h-1 mx-2 ${
                step < currentStep ? 'bg-emerald-500' : 'bg-gray-700'
              }`} />
            )}
          </div>
        ))}
      </div>

      {renderStepContent()}
    </div>
  );
}
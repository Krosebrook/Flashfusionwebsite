import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Shield,
  CheckCircle2,
  AlertTriangle,
  X,
  Search,
  ExternalLink,
  RefreshCw,
  Eye,
  Brain,
  FileText,
  Globe,
  Clock,
  TrendingUp,
  Users,
  Star,
  Zap,
  BookOpen,
  Link as LinkIcon,
  Flag,
  Download,
  Copy,
  Settings
} from 'lucide-react';

interface FactCheckResult {
  id: string;
  content: string;
  contentType: 'claim' | 'statistic' | 'quote' | 'date' | 'name' | 'location';
  verificationStatus: 'verified' | 'unverified' | 'disputed' | 'pending';
  confidence: number;
  sources: {
    title: string;
    url: string;
    domain: string;
    credibility: number;
    datePublished: Date;
  }[];
  aiModel: string;
  checkedAt: Date;
  flags?: {
    type: 'potential-hallucination' | 'outdated-info' | 'biased-source' | 'missing-context';
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[];
}

interface TrustScore {
  overall: number;
  factualAccuracy: number;
  sourceCredibility: number;
  recency: number;
  transparency: number;
  breakdown: {
    verifiedClaims: number;
    totalClaims: number;
    highCredibilitySources: number;
    totalSources: number;
    recentSources: number;
    flaggedContent: number;
  };
}

interface VerificationRequest {
  id: string;
  content: string;
  requestedAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  estimatedCompletion?: Date;
}

const SAMPLE_FACT_CHECKS: FactCheckResult[] = [
  {
    id: '1',
    content: 'Studies show that 73% of consumers prefer sustainable packaging',
    contentType: 'statistic',
    verificationStatus: 'verified',
    confidence: 92,
    sources: [
      {
        title: 'Consumer Packaging Sustainability Report 2024',
        url: 'https://sustainablepackaging.org/report-2024',
        domain: 'sustainablepackaging.org',
        credibility: 95,
        datePublished: new Date('2024-01-15')
      },
      {
        title: 'Global Consumer Trends in Sustainability',
        url: 'https://research.nielsen.com/sustainability-trends',
        domain: 'nielsen.com',
        credibility: 90,
        datePublished: new Date('2024-02-01')
      }
    ],
    aiModel: 'Claude 3.5 Sonnet',
    checkedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '2',
    content: 'The new iPhone 15 Pro has a 48MP camera with 5x optical zoom',
    contentType: 'claim',
    verificationStatus: 'disputed',
    confidence: 45,
    sources: [
      {
        title: 'iPhone 15 Pro Official Specifications',
        url: 'https://apple.com/iphone-15-pro/specs',
        domain: 'apple.com',
        credibility: 100,
        datePublished: new Date('2023-09-12')
      }
    ],
    aiModel: 'GPT-4 Turbo',
    checkedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    flags: [
      {
        type: 'potential-hallucination',
        description: 'Camera specifications may be inaccurate. Official specs show 3x optical zoom, not 5x.',
        severity: 'high'
      }
    ]
  },
  {
    id: '3',
    content: 'According to WHO, global life expectancy increased by 5.5 years between 2000 and 2019',
    contentType: 'statistic',
    verificationStatus: 'verified',
    confidence: 98,
    sources: [
      {
        title: 'World Health Statistics 2021',
        url: 'https://who.int/publications/world-health-statistics-2021',
        domain: 'who.int',
        credibility: 100,
        datePublished: new Date('2021-05-20')
      }
    ],
    aiModel: 'Claude 3.5 Sonnet',
    checkedAt: new Date(Date.now() - 30 * 60 * 1000)
  }
];

export function AITrustVerificationSystem() {
  const [factChecks, setFactChecks] = useState<FactCheckResult[]>(SAMPLE_FACT_CHECKS);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [newContent, setNewContent] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedFactCheck, setSelectedFactCheck] = useState<FactCheckResult | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'fact-check' | 'sources' | 'settings'>('overview');

  // Calculate trust score
  const calculateTrustScore = (): TrustScore => {
    const verifiedClaims = factChecks.filter(fc => fc.verificationStatus === 'verified').length;
    const totalClaims = factChecks.length;
    const highCredibilitySources = factChecks.flatMap(fc => fc.sources).filter(s => s.credibility >= 90).length;
    const totalSources = factChecks.flatMap(fc => fc.sources).length;
    const recentSources = factChecks.flatMap(fc => fc.sources)
      .filter(s => Date.now() - s.datePublished.getTime() < 365 * 24 * 60 * 60 * 1000).length;
    const flaggedContent = factChecks.filter(fc => fc.flags && fc.flags.length > 0).length;

    const factualAccuracy = totalClaims > 0 ? (verifiedClaims / totalClaims) * 100 : 100;
    const sourceCredibility = totalSources > 0 ? (highCredibilitySources / totalSources) * 100 : 100;
    const recency = totalSources > 0 ? (recentSources / totalSources) * 100 : 100;
    const transparency = totalClaims > 0 ? Math.max(0, (1 - (flaggedContent / totalClaims)) * 100) : 100;

    const overall = (factualAccuracy + sourceCredibility + recency + transparency) / 4;

    return {
      overall,
      factualAccuracy,
      sourceCredibility,
      recency,
      transparency,
      breakdown: {
        verifiedClaims,
        totalClaims,
        highCredibilitySources,
        totalSources,
        recentSources,
        flaggedContent
      }
    };
  };

  const trustScore = calculateTrustScore();

  const handleVerifyContent = async () => {
    if (!newContent.trim()) return;

    setIsVerifying(true);
    
    const request: VerificationRequest = {
      id: Date.now().toString(),
      content: newContent,
      requestedAt: new Date(),
      status: 'processing',
      progress: 0,
      estimatedCompletion: new Date(Date.now() + 2 * 60 * 1000) // 2 minutes
    };

    setVerificationRequests(prev => [...prev, request]);

    // Simulate verification process
    const progressInterval = setInterval(() => {
      setVerificationRequests(prev => prev.map(req => 
        req.id === request.id 
          ? { ...req, progress: Math.min(req.progress + 10, 90) }
          : req
      ));
    }, 200);

    // Complete verification after delay
    setTimeout(() => {
      clearInterval(progressInterval);
      
      const mockResult: FactCheckResult = {
        id: Date.now().toString(),
        content: newContent,
        contentType: 'claim',
        verificationStatus: 'verified',
        confidence: 85 + Math.random() * 10,
        sources: [
          {
            title: 'Authoritative Source Example',
            url: 'https://example.com/source',
            domain: 'example.com',
            credibility: 88,
            datePublished: new Date()
          }
        ],
        aiModel: 'Claude 3.5 Sonnet',
        checkedAt: new Date()
      };

      setFactChecks(prev => [mockResult, ...prev]);
      setVerificationRequests(prev => prev.map(req => 
        req.id === request.id 
          ? { ...req, status: 'completed', progress: 100 }
          : req
      ));
      
      setIsVerifying(false);
      setNewContent('');
    }, 2000);
  };

  const getStatusColor = (status: FactCheckResult['verificationStatus']) => {
    switch (status) {
      case 'verified':
        return '#10B981';
      case 'disputed':
        return '#EF4444';
      case 'unverified':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: FactCheckResult['verificationStatus']) => {
    switch (status) {
      case 'verified':
        return CheckCircle2;
      case 'disputed':
        return X;
      case 'unverified':
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const FactCheckCard = ({ factCheck }: { factCheck: FactCheckResult }) => {
    const StatusIcon = getStatusIcon(factCheck.verificationStatus);
    const statusColor = getStatusColor(factCheck.verificationStatus);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card 
          className="cursor-pointer transition-all duration-300 hover:shadow-lg"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: selectedFactCheck?.id === factCheck.id 
              ? `2px solid ${statusColor}` 
              : '1px solid rgba(255, 255, 255, 0.2)'
          }}
          onClick={() => setSelectedFactCheck(selectedFactCheck?.id === factCheck.id ? null : factCheck)}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${statusColor}15` }}
                >
                  <StatusIcon className="h-5 w-5" style={{ color: statusColor }} />
                </div>
                <div>
                  <Badge 
                    className="text-xs capitalize"
                    style={{
                      backgroundColor: `${statusColor}15`,
                      color: statusColor,
                      border: `1px solid ${statusColor}30`
                    }}
                  >
                    {factCheck.verificationStatus}
                  </Badge>
                  <div className="text-xs text-gray-500 mt-1">
                    {factCheck.contentType} • {factCheck.aiModel}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold" style={{ color: statusColor }}>
                  {factCheck.confidence}%
                </div>
                <div className="text-xs text-gray-500">Confidence</div>
              </div>
            </div>

            {/* Content */}
            <div className="mb-4">
              <p className="text-gray-700 leading-relaxed line-clamp-2">
                "{factCheck.content}"
              </p>
            </div>

            {/* Sources Summary */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{factCheck.sources.length} source{factCheck.sources.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(factCheck.checkedAt).toLocaleTimeString()}</span>
                </div>
              </div>

              {factCheck.flags && factCheck.flags.length > 0 && (
                <Badge variant="outline" className="text-red-600 border-red-200">
                  <Flag className="h-3 w-3 mr-1" />
                  {factCheck.flags.length} flag{factCheck.flags.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>

            {/* Sources Preview */}
            <div className="space-y-2">
              {factCheck.sources.slice(0, 2).map((source, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <Globe className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">
                        {source.title}
                      </div>
                      <div className="text-xs text-gray-500">{source.domain}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <div className="text-xs font-medium" style={{ 
                      color: source.credibility >= 90 ? '#10B981' : 
                             source.credibility >= 70 ? '#F59E0B' : '#EF4444' 
                    }}>
                      {source.credibility}%
                    </div>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {factCheck.sources.length > 2 && (
                <div className="text-center">
                  <Button variant="ghost" size="sm" className="text-xs">
                    +{factCheck.sources.length - 2} more sources
                  </Button>
                </div>
              )}
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
              {selectedFactCheck?.id === factCheck.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t space-y-4"
                >
                  {/* Flags */}
                  {factCheck.flags && factCheck.flags.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">⚠️ Verification Flags</h4>
                      <div className="space-y-2">
                        {factCheck.flags.map((flag, index) => (
                          <div key={index} className={`p-3 rounded-lg border-l-4 ${
                            flag.severity === 'high' ? 'bg-red-50 border-red-400' :
                            flag.severity === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                            'bg-blue-50 border-blue-400'
                          }`}>
                            <div className="font-medium text-sm capitalize">{flag.type.replace('-', ' ')}</div>
                            <div className="text-sm text-gray-600 mt-1">{flag.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* All Sources */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">All Sources</h4>
                    <div className="space-y-2">
                      {factCheck.sources.map((source, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-sm text-gray-900">{source.title}</div>
                              <div className="text-xs text-gray-500 mt-1">{source.domain}</div>
                              <div className="text-xs text-gray-500">
                                Published: {source.datePublished.toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <Badge 
                                className={`text-xs ${
                                  source.credibility >= 90 ? 'bg-green-100 text-green-700' :
                                  source.credibility >= 70 ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}
                              >
                                {source.credibility}% credible
                              </Badge>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => window.open(source.url, '_blank')}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Re-verify
                    </Button>
                    <Button size="sm" variant="outline">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Report
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AI Trust & Verification
          </h1>
          <p className="text-muted-foreground mt-2">
            Ensure AI-generated content accuracy with automated fact-checking and source verification
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Badge 
            className="text-lg px-4 py-2"
            style={{
              backgroundColor: trustScore.overall >= 90 ? '#10B98115' : 
                             trustScore.overall >= 70 ? '#F59E0B15' : '#EF444415',
              color: trustScore.overall >= 90 ? '#10B981' : 
                     trustScore.overall >= 70 ? '#F59E0B' : '#EF4444',
              border: `1px solid ${trustScore.overall >= 90 ? '#10B98130' : 
                                   trustScore.overall >= 70 ? '#F59E0B30' : '#EF444430'}`
            }}
          >
            <Shield className="h-5 w-5 mr-2" />
            {trustScore.overall.toFixed(0)}% Trust Score
          </Badge>
        </div>
      </div>

      {/* Trust Score Overview */}
      <Card className="p-6" style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(0, 180, 216, 0.1) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(16, 185, 129, 0.2)'
      }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{trustScore.factualAccuracy.toFixed(0)}%</div>
            <div className="text-sm text-gray-600">Factual Accuracy</div>
            <Progress value={trustScore.factualAccuracy} className="mt-2" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{trustScore.sourceCredibility.toFixed(0)}%</div>
            <div className="text-sm text-gray-600">Source Credibility</div>
            <Progress value={trustScore.sourceCredibility} className="mt-2" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{trustScore.recency.toFixed(0)}%</div>
            <div className="text-sm text-gray-600">Information Recency</div>
            <Progress value={trustScore.recency} className="mt-2" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{trustScore.transparency.toFixed(0)}%</div>
            <div className="text-sm text-gray-600">Transparency</div>
            <Progress value={trustScore.transparency} className="mt-2" />
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="fact-check">Fact Check</TabsTrigger>
          <TabsTrigger value="sources">Source Analysis</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">{trustScore.breakdown.verifiedClaims}</div>
              <div className="text-sm text-gray-600">Verified Claims</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{trustScore.breakdown.highCredibilitySources}</div>
              <div className="text-sm text-gray-600">High-Quality Sources</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-red-600">{trustScore.breakdown.flaggedContent}</div>
              <div className="text-sm text-gray-600">Flagged Items</div>
            </Card>
          </div>

          {/* Recent Verifications */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Verifications</h3>
            <div className="space-y-4">
              {factChecks.slice(0, 3).map((factCheck) => (
                <FactCheckCard key={factCheck.id} factCheck={factCheck} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fact-check" className="space-y-6">
          {/* Verification Input */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Verify New Content</h3>
            <div className="space-y-4">
              <Textarea
                placeholder="Paste content to verify for accuracy and source credibility..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={4}
              />
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  AI will fact-check claims, verify statistics, and validate sources
                </div>
                <Button 
                  onClick={handleVerifyContent}
                  disabled={!newContent.trim() || isVerifying}
                  className="ff-btn-primary"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Verify Content
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Active Verifications */}
          {verificationRequests.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Active Verifications</h3>
              <div className="space-y-3">
                {verificationRequests.map((request) => (
                  <div key={request.id} className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm text-gray-700 line-clamp-2">{request.content}</p>
                      <Badge className={`ml-2 ${
                        request.status === 'completed' ? 'bg-green-100 text-green-700' :
                        request.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {request.status}
                      </Badge>
                    </div>
                    <Progress value={request.progress} className="mb-2" />
                    <div className="text-xs text-gray-500">
                      {request.status === 'processing' && request.estimatedCompletion && (
                        `Estimated completion: ${request.estimatedCompletion.toLocaleTimeString()}`
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* All Fact Checks */}
          <div className="space-y-4">
            {factChecks.map((factCheck) => (
              <FactCheckCard key={factCheck.id} factCheck={factCheck} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Source Credibility Analysis</h3>
            <div className="space-y-4">
              {Array.from(new Set(factChecks.flatMap(fc => fc.sources.map(s => s.domain))))
                .map(domain => {
                  const domainSources = factChecks.flatMap(fc => fc.sources).filter(s => s.domain === domain);
                  const avgCredibility = domainSources.reduce((sum, s) => sum + s.credibility, 0) / domainSources.length;
                  
                  return (
                    <div key={domain} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Globe className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-medium">{domain}</div>
                          <div className="text-sm text-gray-600">{domainSources.length} sources</div>
                        </div>
                      </div>
                      <Badge className={`${
                        avgCredibility >= 90 ? 'bg-green-100 text-green-700' :
                        avgCredibility >= 70 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {avgCredibility.toFixed(0)}% credible
                      </Badge>
                    </div>
                  );
                })}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Verification Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Auto-verify AI-generated content</div>
                  <div className="text-sm text-gray-600">Automatically fact-check content from AI models</div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Real-time verification</div>
                  <div className="text-sm text-gray-600">Verify content as you type</div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">High confidence threshold</div>
                  <div className="text-sm text-gray-600">Only mark content as verified with 90%+ confidence</div>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Source diversity requirement</div>
                  <div className="text-sm text-gray-600">Require multiple independent sources for verification</div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
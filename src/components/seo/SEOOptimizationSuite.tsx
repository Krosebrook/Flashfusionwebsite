import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  TrendingUp, 
  Target, 
  Globe, 
  CheckCircle, 
  AlertTriangle,
  ExternalLink,
  Copy,
  Download,
  Eye,
  Users,
  Clock,
  Zap,
  Star,
  Link,
  Image,
  FileText,
  Share2,
  BarChart3,
  MessageSquare,
  Lightbulb,
  Award
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { analyticsService } from '../../services/AnalyticsService';

interface SEOAudit {
  id: string;
  category: 'technical' | 'content' | 'performance' | 'mobile' | 'social';
  title: string;
  description: string;
  status: 'pass' | 'warning' | 'fail' | 'pending';
  impact: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  recommendation?: string;
  implementation?: string;
}

interface KeywordData {
  keyword: string;
  volume: number;
  difficulty: number;
  opportunity: number;
  currentRank?: number;
  targetRank: number;
  traffic: number;
  competition: 'low' | 'medium' | 'high';
}

interface MetaData {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  canonicalUrl: string;
}

interface ContentOptimization {
  readabilityScore: number;
  keywordDensity: number;
  headingStructure: number;
  internalLinks: number;
  imageOptimization: number;
  contentLength: number;
  uniqueness: number;
}

interface TechnicalSEO {
  siteSpeed: number;
  mobileOptimization: number;
  crawlability: number;
  indexability: number;
  structuredData: number;
  sitemapStatus: boolean;
  robotsTxtStatus: boolean;
  sslStatus: boolean;
}

export function SEOOptimizationSuite() {
  const [seoAudit, setSeoAudit] = useState<SEOAudit[]>([]);
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [metaData, setMetaData] = useState<MetaData>({
    title: '',
    description: '',
    keywords: [],
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    canonicalUrl: ''
  });
  const [contentOptimization, setContentOptimization] = useState<ContentOptimization | null>(null);
  const [technicalSEO, setTechnicalSEO] = useState<TechnicalSEO | null>(null);
  const [overallScore, setOverallScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize SEO data
  useEffect(() => {
    const initializeSEOData = async () => {
      try {
        setCurrentUrl(window.location.href);

        // Mock SEO audit results
        const mockAudit: SEOAudit[] = [
          {
            id: 'title-tags',
            category: 'content',
            title: 'Title Tags Optimization',
            description: 'Page titles are optimized for target keywords',
            status: 'pass',
            impact: 'high',
            score: 85,
            recommendation: 'Include primary keyword within first 60 characters'
          },
          {
            id: 'meta-descriptions',
            category: 'content',
            title: 'Meta Descriptions',
            description: 'Meta descriptions are compelling and keyword-rich',
            status: 'warning',
            impact: 'medium',
            score: 72,
            recommendation: 'Optimize meta descriptions to 150-160 characters with call-to-action',
            implementation: 'Update meta description tags in HTML head section'
          },
          {
            id: 'heading-structure',
            category: 'content',
            title: 'Heading Structure',
            description: 'Proper H1-H6 hierarchy for better content organization',
            status: 'pass',
            impact: 'medium',
            score: 90
          },
          {
            id: 'page-speed',
            category: 'technical',
            title: 'Page Loading Speed',
            description: 'Fast loading times improve user experience and rankings',
            status: 'warning',
            impact: 'high',
            score: 78,
            recommendation: 'Optimize images and implement lazy loading',
            implementation: 'Compress images, minify CSS/JS, enable browser caching'
          },
          {
            id: 'mobile-friendly',
            category: 'mobile',
            title: 'Mobile Optimization',
            description: 'Mobile-responsive design and usability',
            status: 'pass',
            impact: 'critical',
            score: 92
          },
          {
            id: 'ssl-certificate',
            category: 'technical',
            title: 'SSL Certificate',
            description: 'HTTPS encryption for security and trust',
            status: 'pass',
            impact: 'critical',
            score: 100
          },
          {
            id: 'structured-data',
            category: 'technical',
            title: 'Structured Data',
            description: 'Schema markup for rich snippets',
            status: 'fail',
            impact: 'medium',
            score: 35,
            recommendation: 'Implement schema.org markup for better search visibility',
            implementation: 'Add JSON-LD structured data for products, reviews, and organization'
          },
          {
            id: 'internal-linking',
            category: 'content',
            title: 'Internal Link Structure',
            description: 'Strategic internal linking for better navigation',
            status: 'warning',
            impact: 'medium',
            score: 68,
            recommendation: 'Increase internal links with descriptive anchor text'
          },
          {
            id: 'social-meta',
            category: 'social',
            title: 'Social Media Meta Tags',
            description: 'Open Graph and Twitter Card optimization',
            status: 'warning',
            impact: 'medium',
            score: 74,
            recommendation: 'Optimize social sharing previews with compelling images and descriptions'
          },
          {
            id: 'image-optimization',
            category: 'technical',
            title: 'Image SEO',
            description: 'Alt text, file names, and image compression',
            status: 'pass',
            impact: 'medium',
            score: 86
          }
        ];

        const mockKeywords: KeywordData[] = [
          {
            keyword: 'AI development platform',
            volume: 8900,
            difficulty: 65,
            opportunity: 85,
            currentRank: 12,
            targetRank: 3,
            traffic: 1200,
            competition: 'medium'
          },
          {
            keyword: 'no-code app builder',
            volume: 12000,
            difficulty: 58,
            opportunity: 92,
            currentRank: 8,
            targetRank: 1,
            traffic: 2100,
            competition: 'high'
          },
          {
            keyword: 'AI code generator',
            volume: 5600,
            difficulty: 72,
            opportunity: 78,
            currentRank: 15,
            targetRank: 5,
            traffic: 890,
            competition: 'high'
          },
          {
            keyword: 'full stack development tools',
            volume: 3400,
            difficulty: 45,
            opportunity: 88,
            targetRank: 2,
            traffic: 650,
            competition: 'medium'
          },
          {
            keyword: 'automated deployment platform',
            volume: 2800,
            difficulty: 52,
            opportunity: 82,
            currentRank: 7,
            targetRank: 3,
            traffic: 420,
            competition: 'medium'
          }
        ];

        const mockMetaData: MetaData = {
          title: 'FlashFusion - AI Development Assistant Platform | Build Apps 10x Faster',
          description: 'Transform ideas into production-ready applications with FlashFusion\'s 60+ AI tools. Full-stack development, deployment automation, and team collaboration in one platform.',
          keywords: ['AI development', 'no-code', 'app builder', 'automated deployment', 'full-stack tools'],
          ogTitle: 'FlashFusion - AI Development Assistant Platform',
          ogDescription: 'Build production-ready apps 10x faster with AI assistance. 60+ tools for full-stack development, deployment, and collaboration.',
          ogImage: '/images/og-image-flashfusion.png',
          twitterTitle: 'FlashFusion - AI Development Assistant Platform',
          twitterDescription: 'Transform ideas into apps with AI. 60+ development tools in one platform.',
          canonicalUrl: 'https://flashfusion.dev'
        };

        const mockContentOptimization: ContentOptimization = {
          readabilityScore: 78,
          keywordDensity: 2.3,
          headingStructure: 85,
          internalLinks: 23,
          imageOptimization: 72,
          contentLength: 2400,
          uniqueness: 94
        };

        const mockTechnicalSEO: TechnicalSEO = {
          siteSpeed: 82,
          mobileOptimization: 91,
          crawlability: 88,
          indexability: 95,
          structuredData: 45,
          sitemapStatus: true,
          robotsTxtStatus: true,
          sslStatus: true
        };

        setSeoAudit(mockAudit);
        setKeywords(mockKeywords);
        setMetaData(mockMetaData);
        setContentOptimization(mockContentOptimization);
        setTechnicalSEO(mockTechnicalSEO);

        // Calculate overall score
        const avgScore = mockAudit.reduce((sum, item) => sum + item.score, 0) / mockAudit.length;
        setOverallScore(avgScore);

      } catch (error) {
        console.error('Failed to load SEO data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSEOData();
  }, []);

  const runSEOAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate SEO analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update some audit items
      setSeoAudit(prev => prev.map(item => ({
        ...item,
        score: Math.min(100, item.score + Math.random() * 10),
        status: Math.random() > 0.3 ? 'pass' : item.status
      })));
      
      toast.success('SEO analysis completed!');
      analyticsService.trackSEOAudit('full-analysis', overallScore);
      
    } catch (error) {
      toast.error('SEO analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  }, [overallScore]);

  const generateMetaTags = useCallback(() => {
    const metaTagsHtml = `
<!-- Primary Meta Tags -->
<title>${metaData.title}</title>
<meta name="title" content="${metaData.title}">
<meta name="description" content="${metaData.description}">
<meta name="keywords" content="${metaData.keywords.join(', ')}">
<link rel="canonical" href="${metaData.canonicalUrl}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${metaData.canonicalUrl}">
<meta property="og:title" content="${metaData.ogTitle}">
<meta property="og:description" content="${metaData.ogDescription}">
<meta property="og:image" content="${metaData.ogImage}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${metaData.canonicalUrl}">
<meta property="twitter:title" content="${metaData.twitterTitle}">
<meta property="twitter:description" content="${metaData.twitterDescription}">
<meta property="twitter:image" content="${metaData.ogImage}">

<!-- Additional SEO -->
<meta name="robots" content="index, follow">
<meta name="author" content="FlashFusion">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
    `;

    navigator.clipboard.writeText(metaTagsHtml.trim());
    toast.success('Meta tags copied to clipboard!');
    analyticsService.trackSEOAction('meta-tags-generated');
  }, [metaData]);

  const generateStructuredData = useCallback(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "FlashFusion",
      "description": metaData.description,
      "url": metaData.canonicalUrl,
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "creator": {
        "@type": "Organization",
        "name": "FlashFusion",
        "url": metaData.canonicalUrl
      },
      "featureList": [
        "AI-powered development tools",
        "Full-stack application builder",
        "Automated deployment",
        "Team collaboration",
        "60+ specialized AI tools"
      ]
    };

    const jsonLd = `<script type="application/ld+json">
${JSON.stringify(structuredData, null, 2)}
</script>`;

    navigator.clipboard.writeText(jsonLd);
    toast.success('Structured data copied to clipboard!');
    analyticsService.trackSEOAction('structured-data-generated');
  }, [metaData]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'fail': return 'text-red-500';
      case 'pending': return 'text-blue-500';
      default: return 'text-muted-foreground';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const criticalIssues = seoAudit.filter(item => item.status === 'fail' && item.impact === 'critical').length;
  const highImpactIssues = seoAudit.filter(item => item.status !== 'pass' && (item.impact === 'critical' || item.impact === 'high')).length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="ff-fade-in-up">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ff-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold ff-text-gradient">SEO Optimization Suite</h1>
          <p className="text-muted-foreground">
            Maximize organic reach and discoverability for launch success
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg">SEO Score</span>
            </div>
            <div className="space-y-1">
              <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore.toFixed(0)}/100
              </span>
            </div>
          </div>
          
          <Button
            onClick={runSEOAnalysis}
            disabled={isAnalyzing}
            className="ff-btn-primary"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            {isAnalyzing ? 'Analyzing...' : 'Run SEO Audit'}
          </Button>
        </div>
      </div>

      {/* Critical Issues Alert */}
      {criticalIssues > 0 && (
        <Alert className="border-destructive bg-destructive/5">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-destructive">Critical SEO Issues</AlertTitle>
          <AlertDescription>
            {criticalIssues} critical issue{criticalIssues === 1 ? '' : 's'} found that could significantly impact search rankings.
            <Button size="sm" variant="destructive" className="ml-3" onClick={runSEOAnalysis}>
              Fix Issues
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* SEO Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium">Overall Score</h3>
            </div>
            <p className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore.toFixed(0)}/100
            </p>
            <p className="text-sm text-muted-foreground">
              {seoAudit.filter(item => item.status === 'pass').length}/{seoAudit.length} checks passed
            </p>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Target className="h-5 w-5 text-secondary" />
              </div>
              <h3 className="font-medium">Target Keywords</h3>
            </div>
            <p className="text-2xl font-bold">{keywords.length}</p>
            <p className="text-sm text-muted-foreground">
              {keywords.filter(k => k.currentRank && k.currentRank <= 10).length} in top 10
            </p>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-medium">Organic Traffic</h3>
            </div>
            <p className="text-2xl font-bold">
              {keywords.reduce((sum, k) => sum + k.traffic, 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Monthly potential</p>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="font-medium">Issues</h3>
            </div>
            <p className={`text-2xl font-bold ${highImpactIssues > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {highImpactIssues}
            </p>
            <p className="text-sm text-muted-foreground">High impact issues</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="audit" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="audit" className="ff-focus-ring">
            SEO Audit
          </TabsTrigger>
          <TabsTrigger value="keywords" className="ff-focus-ring">
            Keywords ({keywords.length})
          </TabsTrigger>
          <TabsTrigger value="meta" className="ff-focus-ring">
            Meta Tags
          </TabsTrigger>
          <TabsTrigger value="content" className="ff-focus-ring">
            Content
          </TabsTrigger>
          <TabsTrigger value="technical" className="ff-focus-ring">
            Technical
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seoAudit.map((item) => (
              <Card key={item.id} className={`ff-card-interactive ${getImpactColor(item.impact)}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      item.status === 'pass' ? 'bg-green-500/10' :
                      item.status === 'warning' ? 'bg-yellow-500/10' :
                      item.status === 'fail' ? 'bg-red-500/10' :
                      'bg-blue-500/10'
                    }`}>
                      {item.status === 'pass' ? (
                        <CheckCircle className={`h-5 w-5 ${getStatusColor(item.status)}`} />
                      ) : (
                        <AlertTriangle className={`h-5 w-5 ${getStatusColor(item.status)}`} />
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{item.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs capitalize">
                              {item.category}
                            </Badge>
                            <span className={`text-sm font-medium ${getScoreColor(item.score)}`}>
                              {item.score}/100
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      
                      <Progress value={item.score} className="h-2" />
                      
                      {item.recommendation && item.status !== 'pass' && (
                        <div className="space-y-2">
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-xs font-medium mb-1">Recommendation:</p>
                            <p className="text-xs text-muted-foreground">{item.recommendation}</p>
                          </div>
                          
                          {item.implementation && (
                            <div className="p-3 bg-blue-500/5 rounded-lg">
                              <p className="text-xs font-medium mb-1">Implementation:</p>
                              <p className="text-xs text-muted-foreground">{item.implementation}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Keyword Performance</h3>
              <Button size="sm" variant="outline" className="ff-focus-ring">
                <Download className="h-4 w-4 mr-2" />
                Export Keywords
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {keywords.map((keyword, index) => (
                <Card key={index} className="ff-card-interactive">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{keyword.keyword}</h4>
                          <Badge className={getImpactColor(keyword.competition)} variant="outline">
                            {keyword.competition} competition
                          </Badge>
                          {keyword.currentRank && keyword.currentRank <= 10 && (
                            <Badge variant="default" className="ff-badge-glow">
                              Top 10
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Volume:</span>
                            <p className="font-medium">{keyword.volume.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Difficulty:</span>
                            <p className={`font-medium ${getScoreColor(100 - keyword.difficulty)}`}>
                              {keyword.difficulty}%
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Current Rank:</span>
                            <p className="font-medium">
                              {keyword.currentRank ? `#${keyword.currentRank}` : 'Not ranked'}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Target Rank:</span>
                            <p className="font-medium text-primary">#{keyword.targetRank}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Traffic:</span>
                            <p className="font-medium">{keyword.traffic.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <div className="text-center">
                          <div className={`text-lg font-bold ${getScoreColor(keyword.opportunity)}`}>
                            {keyword.opportunity}
                          </div>
                          <p className="text-xs text-muted-foreground">Opportunity</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Opportunity Score</span>
                        <span>{keyword.opportunity}/100</span>
                      </div>
                      <Progress value={keyword.opportunity} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="meta" className="space-y-4">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Meta Tags Optimization</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={generateMetaTags} className="ff-focus-ring">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Meta Tags
                </Button>
                <Button size="sm" variant="outline" onClick={generateStructuredData} className="ff-focus-ring">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Schema
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle className="text-lg">Primary Meta Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title Tag ({metaData.title.length}/60)</label>
                    <Input
                      value={metaData.title}
                      onChange={(e) => setMetaData(prev => ({ ...prev, title: e.target.value }))}
                      className="ff-focus-ring"
                      maxLength={60}
                    />
                    <Progress value={(metaData.title.length / 60) * 100} className="h-1" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Meta Description ({metaData.description.length}/160)</label>
                    <Textarea
                      value={metaData.description}
                      onChange={(e) => setMetaData(prev => ({ ...prev, description: e.target.value }))}
                      className="ff-focus-ring resize-none"
                      rows={3}
                      maxLength={160}
                    />
                    <Progress value={(metaData.description.length / 160) * 100} className="h-1" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Canonical URL</label>
                    <Input
                      value={metaData.canonicalUrl}
                      onChange={(e) => setMetaData(prev => ({ ...prev, canonicalUrl: e.target.value }))}
                      className="ff-focus-ring"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle className="text-lg">Social Media Meta Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Open Graph Title</label>
                    <Input
                      value={metaData.ogTitle}
                      onChange={(e) => setMetaData(prev => ({ ...prev, ogTitle: e.target.value }))}
                      className="ff-focus-ring"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Open Graph Description</label>
                    <Textarea
                      value={metaData.ogDescription}
                      onChange={(e) => setMetaData(prev => ({ ...prev, ogDescription: e.target.value }))}
                      className="ff-focus-ring resize-none"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Open Graph Image URL</label>
                    <Input
                      value={metaData.ogImage}
                      onChange={(e) => setMetaData(prev => ({ ...prev, ogImage: e.target.value }))}
                      className="ff-focus-ring"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="text-lg">Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <h4 className="text-sm font-medium mb-2">Google Search Result Preview</h4>
                    <div className="space-y-1">
                      <h5 className="text-blue-600 text-lg font-medium cursor-pointer hover:underline">
                        {metaData.title}
                      </h5>
                      <p className="text-green-700 text-sm">{metaData.canonicalUrl}</p>
                      <p className="text-gray-600 text-sm">{metaData.description}</p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-muted/30">
                    <h4 className="text-sm font-medium mb-2">Social Media Preview</h4>
                    <div className="border rounded bg-white p-3 max-w-md">
                      <div className="w-full h-32 bg-gray-200 rounded mb-2 flex items-center justify-center">
                        {metaData.ogImage ? (
                          <img src={metaData.ogImage} alt="OG" className="w-full h-full object-cover rounded" />
                        ) : (
                          <Image className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <h5 className="font-medium text-sm">{metaData.ogTitle}</h5>
                      <p className="text-gray-600 text-xs mt-1">{metaData.ogDescription}</p>
                      <p className="text-gray-500 text-xs mt-1">{new URL(metaData.canonicalUrl || 'https://example.com').hostname}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          {contentOptimization && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="ff-card-interactive">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">Readability</h3>
                      </div>
                      <p className={`text-2xl font-bold ${getScoreColor(contentOptimization.readabilityScore)}`}>
                        {contentOptimization.readabilityScore}/100
                      </p>
                      <Progress value={contentOptimization.readabilityScore} className="h-2" />
                      <p className="text-xs text-muted-foreground">Content readability score</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card-interactive">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Target className="h-5 w-5 text-secondary" />
                        <h3 className="font-medium">Keyword Density</h3>
                      </div>
                      <p className={`text-2xl font-bold ${getScoreColor(contentOptimization.keywordDensity < 3 ? 85 : 60)}`}>
                        {contentOptimization.keywordDensity}%
                      </p>
                      <Progress value={(contentOptimization.keywordDensity / 5) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground">Target: 1-3%</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card-interactive">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Link className="h-5 w-5 text-accent" />
                        <h3 className="font-medium">Internal Links</h3>
                      </div>
                      <p className="text-2xl font-bold">{contentOptimization.internalLinks}</p>
                      <Progress value={Math.min(100, (contentOptimization.internalLinks / 30) * 100)} className="h-2" />
                      <p className="text-xs text-muted-foreground">Links to other pages</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card-interactive">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Eye className="h-5 w-5 text-green-500" />
                        <h3 className="font-medium">Heading Structure</h3>
                      </div>
                      <p className={`text-2xl font-bold ${getScoreColor(contentOptimization.headingStructure)}`}>
                        {contentOptimization.headingStructure}/100
                      </p>
                      <Progress value={contentOptimization.headingStructure} className="h-2" />
                      <p className="text-xs text-muted-foreground">H1-H6 hierarchy</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card-interactive">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Image className="h-5 w-5 text-blue-500" />
                        <h3 className="font-medium">Image SEO</h3>
                      </div>
                      <p className={`text-2xl font-bold ${getScoreColor(contentOptimization.imageOptimization)}`}>
                        {contentOptimization.imageOptimization}/100
                      </p>
                      <Progress value={contentOptimization.imageOptimization} className="h-2" />
                      <p className="text-xs text-muted-foreground">Alt text & optimization</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card-interactive">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Award className="h-5 w-5 text-purple-500" />
                        <h3 className="font-medium">Content Uniqueness</h3>
                      </div>
                      <p className={`text-2xl font-bold ${getScoreColor(contentOptimization.uniqueness)}`}>
                        {contentOptimization.uniqueness}%
                      </p>
                      <Progress value={contentOptimization.uniqueness} className="h-2" />
                      <p className="text-xs text-muted-foreground">Original content</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle className="text-lg">Content Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-500/5 rounded-lg">
                      <Lightbulb className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-sm">Optimize Content Length</p>
                        <p className="text-xs text-muted-foreground">
                          Current: {contentOptimization.contentLength} words. Target: 2000-3000 words for better rankings.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-yellow-500/5 rounded-lg">
                      <Target className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-medium text-sm">Improve Keyword Distribution</p>
                        <p className="text-xs text-muted-foreground">
                          Include target keywords naturally in headings and throughout content.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-green-500/5 rounded-lg">
                      <Link className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium text-sm">Add More Internal Links</p>
                        <p className="text-xs text-muted-foreground">
                          Link to related pages and tools to improve site navigation and SEO.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          {technicalSEO && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="ff-card-interactive">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Zap className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">Site Speed</h3>
                      </div>
                      <p className={`text-2xl font-bold ${getScoreColor(technicalSEO.siteSpeed)}`}>
                        {technicalSEO.siteSpeed}/100
                      </p>
                      <Progress value={technicalSEO.siteSpeed} className="h-2" />
                      <p className="text-xs text-muted-foreground">Page loading performance</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card-interactive">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-secondary" />
                        <h3 className="font-medium">Mobile Friendly</h3>
                      </div>
                      <p className={`text-2xl font-bold ${getScoreColor(technicalSEO.mobileOptimization)}`}>
                        {technicalSEO.mobileOptimization}/100
                      </p>
                      <Progress value={technicalSEO.mobileOptimization} className="h-2" />
                      <p className="text-xs text-muted-foreground">Mobile optimization</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card-interactive">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Search className="h-5 w-5 text-accent" />
                        <h3 className="font-medium">Crawlability</h3>
                      </div>
                      <p className={`text-2xl font-bold ${getScoreColor(technicalSEO.crawlability)}`}>
                        {technicalSEO.crawlability}/100
                      </p>
                      <Progress value={technicalSEO.crawlability} className="h-2" />
                      <p className="text-xs text-muted-foreground">Search engine crawling</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card-interactive">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-green-500" />
                        <h3 className="font-medium">Indexability</h3>
                      </div>
                      <p className={`text-2xl font-bold ${getScoreColor(technicalSEO.indexability)}`}>
                        {technicalSEO.indexability}/100
                      </p>
                      <Progress value={technicalSEO.indexability} className="h-2" />
                      <p className="text-xs text-muted-foreground">Search index status</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card-interactive">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <h3 className="font-medium">Structured Data</h3>
                      </div>
                      <p className={`text-2xl font-bold ${getScoreColor(technicalSEO.structuredData)}`}>
                        {technicalSEO.structuredData}/100
                      </p>
                      <Progress value={technicalSEO.structuredData} className="h-2" />
                      <p className="text-xs text-muted-foreground">Schema markup</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card-interactive">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-purple-500" />
                        <h3 className="font-medium">Technical Health</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Sitemap</span>
                          <span className={technicalSEO.sitemapStatus ? 'text-green-500' : 'text-red-500'}>
                            {technicalSEO.sitemapStatus ? '✓' : '✗'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Robots.txt</span>
                          <span className={technicalSEO.robotsTxtStatus ? 'text-green-500' : 'text-red-500'}>
                            {technicalSEO.robotsTxtStatus ? '✓' : '✗'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>SSL Certificate</span>
                          <span className={technicalSEO.sslStatus ? 'text-green-500' : 'text-red-500'}>
                            {technicalSEO.sslStatus ? '✓' : '✗'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle className="text-lg">Technical Improvements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-red-500/5 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium text-sm">Implement Structured Data</p>
                        <p className="text-xs text-muted-foreground">
                          Add schema.org markup for better search result features and visibility.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-yellow-500/5 rounded-lg">
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-medium text-sm">Optimize Page Speed</p>
                        <p className="text-xs text-muted-foreground">
                          Compress images, minify CSS/JS, and implement caching for better performance.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-blue-500/5 rounded-lg">
                      <Globe className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-sm">Enhance Crawlability</p>
                        <p className="text-xs text-muted-foreground">
                          Improve internal linking and fix any crawl errors in search console.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
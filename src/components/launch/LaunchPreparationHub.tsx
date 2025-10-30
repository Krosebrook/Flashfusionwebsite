/**
 * @fileoverview Launch Preparation Hub - Step 9 Implementation
 * @chunk launch
 * @category marketing
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Comprehensive launch preparation system with documentation generation,
 * marketing materials, support systems, and legal compliance tools.
 */

import React, { useMemo } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Switch } from '../ui/switch';
import { 
  Rocket,
  BookOpen,
  Users,
  Shield,
  Megaphone,
  FileText,
  Video,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  Clock,
  Download,
  Share2,
  Mail,
  MessageCircle,
  Phone,
  Globe,
  Star,
  TrendingUp,
  Eye,
  Heart,
  ThumbsUp,
  Camera,
  Mic,
  Edit,
  Copy,
  ExternalLink,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Target,
  Award,
  Briefcase,
  PieChart,
  BarChart3,
  Calendar,
  Loader2
} from 'lucide-react';
import { useLaunchAssets } from './useLaunchAssets';
import { useMarketingCampaigns } from './useMarketingCampaigns';
import { useSupportChannels } from './useSupportChannels';
import { useDocumentationGenerator } from './useDocumentationGenerator';
import { calculateLaunchReadiness } from './LaunchPreparationHub.logic';
import {
  INITIAL_ASSETS,
  INITIAL_CAMPAIGNS,
  INITIAL_SUPPORT_CHANNELS,
  LAUNCH_CHECKLIST,
} from '../../fixtures/launch/launch-preparation-fixtures';

export function LaunchPreparationHub() {
  const { assets } = useLaunchAssets(INITIAL_ASSETS);
  const { campaigns, getCampaignROI } = useMarketingCampaigns(INITIAL_CAMPAIGNS);
  const { channels: supportChannels } = useSupportChannels(INITIAL_SUPPORT_CHANNELS);
  const {
    isGenerating,
    generationProgress,
    generateDocumentation,
    generatePressKit,
  } = useDocumentationGenerator();

  const launchReadiness = useMemo(
    () => calculateLaunchReadiness(LAUNCH_CHECKLIST),
    []
  );

  return (
    <div className="space-y-6" style={{ fontFamily: 'var(--ff-font-secondary)' }}>
      <Card className="bg-[var(--ff-surface)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-primary)' }}>
            <Rocket className="w-6 h-6 text-[var(--ff-primary)]" />
            Launch Preparation Hub
          </CardTitle>
          <CardDescription className="text-[var(--ff-text-secondary)]">
            Comprehensive launch preparation with documentation generation, marketing materials, support systems, and legal compliance tools.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Launch Readiness Overview */}
          <Alert className="border-[var(--ff-primary)] bg-[var(--ff-primary)]/10 mb-6">
            <Target className="h-4 w-4 text-[var(--ff-primary)]" />
            <AlertDescription className="text-[var(--ff-text-secondary)]">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-[var(--ff-primary)]">Launch Readiness:</strong> {launchReadiness}% complete
                </div>
                <Badge variant={launchReadiness >= 80 ? 'default' : launchReadiness >= 60 ? 'secondary' : 'destructive'}>
                  {launchReadiness >= 80 ? 'Ready' : launchReadiness >= 60 ? 'In Progress' : 'Needs Work'}
                </Badge>
              </div>
              <Progress value={launchReadiness} className="h-2 mt-2" />
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="documentation">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="documentation" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Docs
              </TabsTrigger>
              <TabsTrigger value="marketing" className="flex items-center gap-2">
                <Megaphone className="w-4 h-4" />
                Marketing
              </TabsTrigger>
              <TabsTrigger value="support" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Support
              </TabsTrigger>
              <TabsTrigger value="legal" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Legal
              </TabsTrigger>
              <TabsTrigger value="checklist" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Checklist
              </TabsTrigger>
            </TabsList>

            <TabsContent value="documentation" className="space-y-6">
              <Alert className="border-[var(--ff-secondary)] bg-[var(--ff-secondary)]/10">
                <FileText className="h-4 w-4 text-[var(--ff-secondary)]" />
                <AlertDescription className="text-[var(--ff-text-secondary)]">
                  <strong className="text-[var(--ff-secondary)]">Documentation Generation:</strong> Create comprehensive user guides, API documentation, tutorials, and troubleshooting resources.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
                  <CardHeader>
                    <CardTitle className="text-[var(--ff-text-primary)] flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      User Documentation
                    </CardTitle>
                    <CardDescription className="text-[var(--ff-text-secondary)]">
                      Complete user guides and getting started resources
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      onClick={() => generateDocumentation('user-manual')}
                      disabled={isGenerating}
                      className="w-full bg-[var(--ff-primary)] hover:bg-[var(--ff-primary-600)] text-white"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Generate User Manual
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => generateDocumentation('tutorials')}
                      disabled={isGenerating}
                      variant="outline"
                      className="w-full border-[var(--border)]"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Generate Tutorial Scripts
                    </Button>
                    <Button
                      onClick={() => generateDocumentation('faq')}
                      disabled={isGenerating}
                      variant="outline"
                      className="w-full border-[var(--border)]"
                    >
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Generate FAQ Guide
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
                  <CardHeader>
                    <CardTitle className="text-[var(--ff-text-primary)] flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      Developer Resources
                    </CardTitle>
                    <CardDescription className="text-[var(--ff-text-secondary)]">
                      Technical documentation and API references
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      onClick={() => generateDocumentation('api-docs')}
                      disabled={isGenerating}
                      className="w-full bg-[var(--ff-secondary)] hover:bg-[var(--ff-secondary-600)] text-white"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Generate API Documentation
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-[var(--border)]"
                    >
                      <Code className="w-4 h-4 mr-2" />
                      SDK Documentation
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-[var(--border)]"
                    >
                      <Terminal className="w-4 h-4 mr-2" />
                      CLI Documentation
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {isGenerating && (
                <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[var(--ff-text-primary)]">Generating documentation...</span>
                      <span className="text-[var(--ff-text-muted)]">{generationProgress}%</span>
                    </div>
                    <Progress value={generationProgress} className="h-2" />
                    <p className="text-sm text-[var(--ff-text-muted)] mt-2">
                      Creating comprehensive documentation with examples and best practices...
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {assets.filter(asset => asset.type === 'documentation').map((asset) => (
                  <Card key={asset.id} className="bg-[var(--ff-surface)] border-[var(--border)]">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={asset.status === 'approved' ? 'default' : asset.status === 'review' ? 'secondary' : 'outline'}>
                          {asset.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {asset.priority}
                        </Badge>
                      </div>
                      <h4 className="text-sm font-semibold text-[var(--ff-text-primary)] mb-1">{asset.title}</h4>
                      <p className="text-xs text-[var(--ff-text-muted)] mb-3">{asset.description}</p>
                      <Progress value={asset.progress} className="h-1 mb-2" />
                      <p className="text-xs text-[var(--ff-text-muted)]">{asset.progress}% complete</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="marketing" className="space-y-6">
              <Alert className="border-[var(--ff-accent)] bg-[var(--ff-accent)]/10">
                <Megaphone className="h-4 w-4 text-[var(--ff-accent)]" />
                <AlertDescription className="text-[var(--ff-text-secondary)]">
                  <strong className="text-[var(--ff-accent)]">Marketing Campaign Management:</strong> Create and manage launch campaigns across multiple channels with performance tracking.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
                  <CardHeader>
                    <CardTitle className="text-[var(--ff-text-primary)] flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      Visual Assets
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full border-[var(--border)]">
                      <Download className="w-4 h-4 mr-2" />
                      Logo Package
                    </Button>
                    <Button variant="outline" className="w-full border-[var(--border)]">
                      <Camera className="w-4 h-4 mr-2" />
                      Screenshots
                    </Button>
                    <Button 
                      onClick={generatePressKit}
                      className="w-full bg-[var(--ff-primary)] hover:bg-[var(--ff-primary-600)] text-white"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Press Kit
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
                  <CardHeader>
                    <CardTitle className="text-[var(--ff-text-primary)] flex items-center gap-2">
                      <Share2 className="w-5 h-5" />
                      Social Media
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full border-[var(--border)]">
                      <Edit className="w-4 h-4 mr-2" />
                      Create Posts
                    </Button>
                    <Button variant="outline" className="w-full border-[var(--border)]">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Campaign
                    </Button>
                    <Button variant="outline" className="w-full border-[var(--border)]">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analytics
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
                  <CardHeader>
                    <CardTitle className="text-[var(--ff-text-primary)] flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Email Marketing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full border-[var(--border)]">
                      <Edit className="w-4 h-4 mr-2" />
                      Create Sequence
                    </Button>
                    <Button variant="outline" className="w-full border-[var(--border)]">
                      <Users className="w-4 h-4 mr-2" />
                      Manage Lists
                    </Button>
                    <Button variant="outline" className="w-full border-[var(--border)]">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Track Performance
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[var(--ff-text-primary)]">Active Campaigns</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {campaigns.map((campaign) => (
                    <Card key={campaign.id} className="bg-[var(--ff-surface)] border-[var(--border)]">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-[var(--ff-text-primary)]">{campaign.name}</h4>
                          <Badge variant={campaign.status === 'active' ? 'default' : campaign.status === 'scheduled' ? 'secondary' : 'outline'}>
                            {campaign.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-[var(--ff-text-muted)]">Reach</p>
                            <p className="text-[var(--ff-text-primary)] font-semibold">{campaign.reach.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[var(--ff-text-muted)]">Engagement</p>
                            <p className="text-[var(--ff-text-primary)] font-semibold">{campaign.engagement}%</p>
                          </div>
                          <div>
                            <p className="text-[var(--ff-text-muted)]">Budget</p>
                            <p className="text-[var(--ff-text-primary)] font-semibold">${campaign.budget.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[var(--ff-text-muted)]">ROI</p>
                            <p className="text-[var(--ff-text-primary)] font-semibold">
                              {getCampaignROI(campaign).roi}%
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <BarChart3 className="w-3 h-3 mr-1" />
                            Analytics
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="support" className="space-y-6">
              <Alert className="border-[var(--ff-warning)] bg-[var(--ff-warning)]/10">
                <Users className="h-4 w-4 text-[var(--ff-warning)]" />
                <AlertDescription className="text-[var(--ff-text-secondary)]">
                  <strong className="text-[var(--ff-warning)]">Support Systems:</strong> Configure help desk, community forums, knowledge base, and customer success tools for post-launch support.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {supportChannels.map((channel) => (
                  <Card key={channel.id} className="bg-[var(--ff-surface-light)] border-[var(--border)]">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-[var(--ff-text-primary)]">{channel.name}</h4>
                        <Badge variant={channel.status === 'active' ? 'default' : channel.status === 'testing' ? 'secondary' : 'outline'}>
                          {channel.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[var(--ff-text-muted)]">Response Time</span>
                          <span className="text-[var(--ff-text-primary)]">{channel.responseTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--ff-text-muted)]">Satisfaction</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-[var(--ff-text-primary)]">{channel.satisfaction}</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--ff-text-muted)]">Monthly Volume</span>
                          <span className="text-[var(--ff-text-primary)]">{channel.volume}</span>
                        </div>
                      </div>

                      <Button size="sm" variant="outline" className="w-full mt-3">
                        <Settings className="w-3 h-3 mr-1" />
                        Configure
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-[var(--ff-surface)] border-[var(--border)]">
                <CardHeader>
                  <CardTitle className="text-[var(--ff-text-primary)]">Support Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-[var(--ff-text-primary)]">24/7 Live Chat</Label>
                        <Switch checked={true} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-[var(--ff-text-primary)]">Auto-Response</Label>
                        <Switch checked={true} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-[var(--ff-text-primary)]">Ticket Escalation</Label>
                        <Switch checked={true} />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-[var(--ff-text-primary)]">Community Forum</Label>
                        <Switch checked={false} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-[var(--ff-text-primary)]">Video Support</Label>
                        <Switch checked={false} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-[var(--ff-text-primary)]">Phone Support</Label>
                        <Switch checked={false} />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[var(--border)]" />

                  <div className="space-y-2">
                    <Label className="text-[var(--ff-text-primary)]">Support Team Email</Label>
                    <Input 
                      defaultValue="support@flashfusion.ai" 
                      className="bg-[var(--input-background)] border-[var(--border)]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[var(--ff-text-primary)]">Auto-Response Message</Label>
                    <Textarea 
                      defaultValue="Thank you for contacting FlashFusion support. We've received your message and will respond within 4 hours."
                      className="bg-[var(--input-background)] border-[var(--border)]"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="legal" className="space-y-6">
              <Alert className="border-[var(--ff-error)] bg-[var(--ff-error)]/10">
                <Shield className="h-4 w-4 text-[var(--ff-error)]" />
                <AlertDescription className="text-[var(--ff-text-secondary)]">
                  <strong className="text-[var(--ff-error)]">Legal Compliance:</strong> Ensure all legal documents, privacy policies, and compliance requirements are properly configured before launch.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
                  <CardHeader>
                    <CardTitle className="text-[var(--ff-text-primary)]">Legal Documents</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--ff-text-primary)]">Terms of Service</span>
                      <Badge variant="default" className="bg-[var(--ff-success)] text-white">Complete</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--ff-text-primary)]">Privacy Policy</span>
                      <Badge variant="default" className="bg-[var(--ff-success)] text-white">Complete</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--ff-text-primary)]">Cookie Policy</span>
                      <Badge variant="secondary">Review</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--ff-text-primary)]">GDPR Compliance</span>
                      <Badge variant="default" className="bg-[var(--ff-success)] text-white">Complete</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--ff-text-primary)]">Data Processing Agreement</span>
                      <Badge variant="outline">Draft</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
                  <CardHeader>
                    <CardTitle className="text-[var(--ff-text-primary)]">Compliance & Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--ff-text-primary)]">SOC 2 Type II</span>
                      <Badge variant="default" className="bg-[var(--ff-success)] text-white">Certified</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--ff-text-primary)]">ISO 27001</span>
                      <Badge variant="secondary">In Progress</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--ff-text-primary)]">CCPA Compliance</span>
                      <Badge variant="default" className="bg-[var(--ff-success)] text-white">Complete</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--ff-text-primary)]">PCI DSS</span>
                      <Badge variant="outline">Not Required</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--ff-text-primary)]">Security Audit</span>
                      <Badge variant="default" className="bg-[var(--ff-success)] text-white">Passed</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-[var(--ff-surface)] border-[var(--border)]">
                <CardHeader>
                  <CardTitle className="text-[var(--ff-text-primary)]">Legal Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[var(--ff-text-primary)]">Company Legal Name</Label>
                      <Input 
                        defaultValue="FlashFusion, Inc." 
                        className="bg-[var(--input-background)] border-[var(--border)]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[var(--ff-text-primary)]">Jurisdiction</Label>
                      <Select defaultValue="delaware">
                        <SelectTrigger className="bg-[var(--input-background)] border-[var(--border)]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="delaware">Delaware, USA</SelectItem>
                          <SelectItem value="california">California, USA</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="eu">European Union</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[var(--ff-text-primary)]">Data Protection Officer Email</Label>
                    <Input 
                      defaultValue="dpo@flashfusion.ai" 
                      className="bg-[var(--input-background)] border-[var(--border)]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[var(--ff-text-primary)]">Legal Contact Address</Label>
                    <Textarea 
                      defaultValue="123 Innovation Drive, San Francisco, CA 94105, USA"
                      className="bg-[var(--input-background)] border-[var(--border)]"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="checklist" className="space-y-6">
              <Alert className="border-[var(--ff-success)] bg-[var(--ff-success)]/10">
                <CheckCircle className="h-4 w-4 text-[var(--ff-success)]" />
                <AlertDescription className="text-[var(--ff-text-secondary)]">
                  <strong className="text-[var(--ff-success)]">Launch Checklist:</strong> Track completion of all essential launch preparation tasks across documentation, marketing, support, and legal requirements.
                </AlertDescription>
              </Alert>

              <div className="space-y-6">
                {LAUNCH_CHECKLIST.map((category, categoryIndex) => (
                  <Card key={categoryIndex} className="bg-[var(--ff-surface)] border-[var(--border)]">
                    <CardHeader>
                      <CardTitle className="text-[var(--ff-text-primary)] flex items-center gap-2">
                        {categoryIndex === 0 && <BookOpen className="w-5 h-5" />}
                        {categoryIndex === 1 && <Megaphone className="w-5 h-5" />}
                        {categoryIndex === 2 && <Shield className="w-5 h-5" />}
                        {categoryIndex === 3 && <Users className="w-5 h-5" />}
                        {category.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {category.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {Math.random() > 0.3 ? (
                                <CheckCircle className="w-4 h-4 text-[var(--ff-success)]" />
                              ) : Math.random() > 0.5 ? (
                                <Clock className="w-4 h-4 text-[var(--ff-warning)]" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-[var(--ff-error)]" />
                              )}
                            </div>
                            <span className="text-[var(--ff-text-primary)]">{item}</span>
                            <div className="ml-auto">
                              {Math.random() > 0.3 && (
                                <Badge variant="default" className="bg-[var(--ff-success)] text-white">Done</Badge>
                              )}
                              {Math.random() > 0.7 && (
                                <Badge variant="secondary">In Progress</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
                <CardHeader>
                  <CardTitle className="text-[var(--ff-text-primary)]">Launch Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="bg-[var(--ff-primary)] hover:bg-[var(--ff-primary-600)] text-white">
                      <Rocket className="w-4 h-4 mr-2" />
                      Schedule Launch
                    </Button>
                    <Button variant="outline" className="border-[var(--border)]">
                      <Download className="w-4 h-4 mr-2" />
                      Export Checklist
                    </Button>
                    <Button variant="outline" className="border-[var(--border)]">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default LaunchPreparationHub;

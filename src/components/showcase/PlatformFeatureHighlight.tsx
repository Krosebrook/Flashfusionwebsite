import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { 
  ArrowRight, 
  Code2, 
  Palette, 
  Users, 
  Zap, 
  Shield, 
  BarChart3,
  Rocket,
  Sparkles,
  Play
} from 'lucide-react';
import exampleImage from 'figma:asset/75597ec4e78510972c849bf0e1a3b171e9c213e4.png';

interface PlatformFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlights: string[];
}

const PLATFORM_FEATURES: PlatformFeature[] = [
  {
    icon: <Code2 className="h-8 w-8" />,
    title: "AI-Powered Development",
    description: "Complete full-stack application generation with advanced AI assistance",
    highlights: ["React & Next.js", "Node.js APIs", "Database Schema", "Deployment Ready"]
  },
  {
    icon: <Palette className="h-8 w-8" />,
    title: "Content Creation Suite",
    description: "Multi-platform content generation for creators and marketers",
    highlights: ["Social Media Posts", "Blog Articles", "Video Scripts", "Email Campaigns"]
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Team Collaboration",
    description: "Real-time collaboration with AI-powered workflow orchestration",
    highlights: ["Live Editing", "Multi-Agent AI", "Version Control", "Team Analytics"]
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Advanced Analytics",
    description: "Comprehensive insights and performance optimization tools",
    highlights: ["Usage Tracking", "Performance Metrics", "ROI Analysis", "Predictive Insights"]
  }
];

const CREATOR_STATS = [
  { label: "Active Creators", value: "500+", growth: "+12%" },
  { label: "Content Generated", value: "1.2M+", growth: "+28%" },
  { label: "AI Tools Available", value: "60+", growth: "+15%" },
  { label: "Platform Uptime", value: "99.9%", growth: "Stable" }
];

export function PlatformFeatureHighlight() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {/* Hero Section with Main Platform Image */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF7B00]/5 via-transparent to-[#00B4D8]/5" />
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-8 mb-16 ff-fade-in-up">
            <Badge className="ff-btn-primary border-0 px-6 py-2 text-lg font-semibold">
              <Sparkles className="h-5 w-5 mr-2" />
              FlashFusion Platform Overview
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-bold font-['Sora'] leading-tight">
              The Complete
              <span className="ff-text-gradient block">
                Creator Ecosystem
              </span>
            </h1>
            
            <p className="text-xl text-[#CBD5E1] max-w-4xl mx-auto leading-relaxed">
              Experience the future of content creation and development with our comprehensive 
              AI-powered platform featuring 60+ tools, real-time collaboration, and automated workflows.
            </p>
          </div>

          {/* Main Platform Screenshot */}
          <div className="relative max-w-6xl mx-auto ff-slide-in-right">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-8 border border-[#334155]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF7B00]/10 to-[#00B4D8]/10" />
              
              <div className="relative">
                <ImageWithFallback
                  src={exampleImage}
                  alt="FlashFusion Platform - Complete Creator Dashboard Interface"
                  className="w-full h-auto rounded-2xl shadow-2xl ff-hover-lift"
                  style={{ maxHeight: '600px', objectFit: 'cover' }}
                />
                
                {/* Interactive overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Button className="ff-btn-primary text-lg px-8 py-4 ff-pulse-glow">
                      <Play className="h-6 w-6 mr-2" />
                      Explore Platform
                    </Button>
                    <p className="text-white text-sm">Click to see interactive demo</p>
                  </div>
                </div>
              </div>
              
              {/* Floating feature callouts */}
              <div className="absolute -top-6 -left-6 ff-pulse-glow">
                <Badge className="bg-[#FF7B00] text-white border-0 px-4 py-2">
                  <Zap className="h-4 w-4 mr-1" />
                  Live Platform
                </Badge>
              </div>
              
              <div className="absolute -top-6 -right-6 ff-pulse-glow-secondary">
                <Badge className="bg-[#00B4D8] text-white border-0 px-4 py-2">
                  <Shield className="h-4 w-4 mr-1" />
                  Production Ready
                </Badge>
              </div>
              
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-[#E91E63] text-white border-0 px-4 py-2 ff-pulse-glow-accent">
                  <Rocket className="h-4 w-4 mr-1" />
                  Launch Ready
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="py-16 border-y border-[#334155]/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {CREATOR_STATS.map((stat, index) => (
              <div key={index} className="text-center ff-stagger-fade">
                <h3 className="text-4xl font-bold font-['Sora'] ff-text-gradient mb-2">
                  {stat.value}
                </h3>
                <p className="text-[#CBD5E1] text-sm mb-1">{stat.label}</p>
                <div className="text-[#10B981] text-xs font-medium">
                  {stat.growth !== 'Stable' ? '↗ ' : '→ '}{stat.growth}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Platform Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16 ff-fade-in-up">
            <h2 className="text-4xl font-bold font-['Sora'] ff-text-gradient">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-[#CBD5E1] max-w-3xl mx-auto">
              From initial concept to production deployment, FlashFusion provides 
              all the tools and workflows modern creators need.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 ff-stagger-fade">
            {PLATFORM_FEATURES.map((feature, index) => (
              <Card 
                key={index}
                className="ff-card-interactive bg-[#1E293B] border-[#334155] p-8 group cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-[#FF7B00]/10 text-[#FF7B00] border border-[#FF7B00]/20">
                        {feature.icon}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <h3 className="text-2xl font-semibold font-['Sora'] text-white group-hover:text-[#FF7B00] transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-[#CBD5E1] leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {feature.highlights.map((highlight, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 rounded-full bg-[#FF7B00]" />
                          <span className="text-[#CBD5E1]">{highlight}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center text-[#FF7B00] text-sm font-medium group-hover:translate-x-2 transition-transform">
                      Learn more about this feature
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-[#FF7B00]/10 via-transparent to-[#00B4D8]/10 border-y border-[#334155]/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-8 ff-fade-in-up">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold font-['Sora'] ff-text-gradient">
              Ready to Experience FlashFusion?
            </h2>
            <p className="text-xl text-[#CBD5E1] max-w-3xl mx-auto">
              Join thousands of creators who are already transforming their workflows 
              with our AI-powered platform. Start building amazing projects today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="ff-btn-primary text-lg px-8 py-4 ff-hover-glow">
              <Rocket className="h-5 w-5 mr-2" />
              Start Free Trial
            </Button>
            
            <Button 
              variant="outline" 
              className="text-lg px-8 py-4 border-[#334155] text-[#CBD5E1] hover:border-[#FF7B00]/50 ff-focus-ring"
            >
              <Play className="h-5 w-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          <div className="flex justify-center items-center gap-8 text-sm text-[#94A3B8] flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#10B981]" />
              14-day free trial
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#10B981]" />
              No setup required
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#10B981]" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PlatformFeatureHighlight;
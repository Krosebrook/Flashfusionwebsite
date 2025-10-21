import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { 
  Sparkles, 
  Zap, 
  Rocket, 
  Code2, 
  Palette, 
  Users, 
  BarChart3, 
  Shield,
  ChevronRight,
  Play,
  Check,
  Star,
  ArrowRight
} from 'lucide-react';
import exampleImage from 'figma:asset/75597ec4e78510972c849bf0e1a3b171e9c213e4.png';

interface FeatureHighlight {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'primary' | 'secondary' | 'accent';
}

interface MetricCard {
  value: string;
  label: string;
  trend: '+' | '-' | '~';
  trendValue: string;
}

const FEATURE_HIGHLIGHTS: FeatureHighlight[] = [
  {
    icon: <Code2 className="h-6 w-6" />,
    title: "60+ AI Tools",
    description: "Complete creator toolkit across 6 specialized categories",
    color: 'primary'
  },
  {
    icon: <Palette className="h-6 w-6" />,
    title: "Content Generation",
    description: "AI-powered content creation for all platforms",
    color: 'secondary'
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Team Collaboration",
    description: "Real-time collaboration with AI assistance",
    color: 'accent'
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Analytics & Insights",
    description: "Comprehensive performance tracking and optimization",
    color: 'primary'
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Enterprise Security",
    description: "Production-ready security and compliance",
    color: 'secondary'
  },
  {
    icon: <Rocket className="h-6 w-6" />,
    title: "Auto Deployment",
    description: "Deploy to 8+ cloud platforms with one click",
    color: 'accent'
  }
];

const PLATFORM_METRICS: MetricCard[] = [
  { value: "500+", label: "Active Creators", trend: '+', trendValue: "12%" },
  { value: "1.2M+", label: "Content Generated", trend: '+', trendValue: "28%" },
  { value: "99.9%", label: "Uptime", trend: '~', trendValue: "0.1%" },
  { value: "2.3s", label: "Avg Load Time", trend: '-', trendValue: "15%" }
];

const CREATOR_TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Content Creator & YouTuber",
    avatar: "SC",
    content: "FlashFusion transformed my workflow. I can now generate, optimize, and deploy content 10x faster!",
    rating: 5
  },
  {
    name: "Marcus Rodriguez",
    role: "Full-Stack Developer",
    avatar: "MR",
    content: "The AI orchestration is incredible. It handles complex workflows while I focus on creativity.",
    rating: 5
  },
  {
    name: "Emily Johnson",
    role: "Digital Marketing Agency",
    avatar: "EJ",
    content: "Our client deliverables improved dramatically. FlashFusion is our secret weapon.",
    rating: 5
  }
];

export function FlashFusionPlatformShowcase() {
  const [activeDemo, setActiveDemo] = useState<'content' | 'code' | 'analytics'>('content');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % CREATOR_TESTIMONIALS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleDemoPlay = () => {
    setIsPlaying(true);
    // Simulate demo completion
    setTimeout(() => setIsPlaying(false), 3000);
  };

  const getFeatureColor = (color: 'primary' | 'secondary' | 'accent') => {
    switch (color) {
      case 'primary': return 'text-[#FF7B00] bg-[#FF7B00]/10 border-[#FF7B00]/20';
      case 'secondary': return 'text-[#00B4D8] bg-[#00B4D8]/10 border-[#00B4D8]/20';
      case 'accent': return 'text-[#E91E63] bg-[#E91E63]/10 border-[#E91E63]/20';
    }
  };

  const getTrendColor = (trend: '+' | '-' | '~') => {
    switch (trend) {
      case '+': return 'text-[#10B981]';
      case '-': return 'text-[#EF4444]';
      case '~': return 'text-[#F59E0B]';
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white ff-container-fluid">
      {/* Hero Section with Platform Image */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF7B00]/10 via-transparent to-[#00B4D8]/10" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 ff-fade-in-up">
              <div className="space-y-4">
                <Badge className="ff-btn-primary border-0 px-4 py-2 text-sm font-semibold">
                  <Sparkles className="h-4 w-4 mr-2" />
                  FlashFusion Platform 2025
                </Badge>
                
                <h1 className="text-5xl lg:text-6xl font-bold font-['Sora'] leading-tight">
                  Your Ultimate
                  <span className="ff-text-gradient block">
                    Creator Hub
                  </span>
                </h1>
                
                <p className="text-xl text-[#CBD5E1] leading-relaxed max-w-lg">
                  Transform ideas into production-ready applications with our comprehensive 
                  AI-powered platform featuring 60+ tools, real-time collaboration, and 
                  automated deployment.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="ff-btn-primary text-lg px-8 py-3 ff-hover-glow"
                  onClick={handleDemoPlay}
                  disabled={isPlaying}
                >
                  {isPlaying ? (
                    <>
                      <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      Starting Demo...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Start Free Trial
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="text-lg px-8 py-3 border-[#334155] text-[#CBD5E1] hover:border-[#FF7B00]/50 ff-focus-ring"
                >
                  <Code2 className="h-5 w-5 mr-2" />
                  View Documentation
                </Button>
              </div>

              <div className="flex items-center gap-6 text-sm text-[#94A3B8]">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#10B981]" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#10B981]" />
                  Setup in 60 seconds
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#10B981]" />
                  500+ creators trust us
                </div>
              </div>
            </div>

            <div className="relative ff-slide-in-right">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-6 border border-[#334155]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF7B00]/5 to-[#00B4D8]/5" />
                <div className="relative">
                  <ImageWithFallback
                    src={exampleImage}
                    alt="FlashFusion Platform Interface"
                    className="w-full h-auto rounded-xl shadow-2xl ff-hover-lift"
                  />
                  
                  {/* Overlay demo controls */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                    <Button 
                      className="ff-btn-secondary ff-hover-scale"
                      onClick={handleDemoPlay}
                    >
                      <Play className="h-6 w-6 mr-2" />
                      Interactive Demo
                    </Button>
                  </div>
                </div>
                
                {/* Floating feature badges */}
                <div className="absolute -top-4 -right-4 ff-pulse-glow">
                  <Badge className="bg-[#FF7B00] text-white border-0 px-3 py-1">
                    <Zap className="h-3 w-3 mr-1" />
                    Live Platform
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Metrics */}
      <section className="py-16 border-y border-[#334155]/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {PLATFORM_METRICS.map((metric, index) => (
              <Card key={index} className="ff-card-interactive bg-[#1E293B] border-[#334155] text-center ff-stagger-fade">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold font-['Sora'] ff-text-gradient">
                      {metric.value}
                    </h3>
                    <p className="text-[#CBD5E1] text-sm">{metric.label}</p>
                    <div className={`flex items-center justify-center gap-1 text-xs ${getTrendColor(metric.trend)}`}>
                      <span>{metric.trend === '+' ? '↗' : metric.trend === '-' ? '↘' : '→'}</span>
                      <span>{metric.trendValue}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16 ff-fade-in-up">
            <h2 className="text-4xl font-bold font-['Sora'] ff-text-gradient">
              Everything You Need to Create
            </h2>
            <p className="text-xl text-[#CBD5E1] max-w-3xl mx-auto">
              From content generation to deployment, FlashFusion provides a complete ecosystem 
              for modern creators and developers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 ff-stagger-fade">
            {FEATURE_HIGHLIGHTS.map((feature, index) => (
              <Card 
                key={index} 
                className={`ff-card-interactive bg-[#1E293B] border-[#334155] p-6 group cursor-pointer ${getFeatureColor(feature.color)}`}
              >
                <CardContent className="p-0">
                  <div className="space-y-4">
                    <div className={`inline-flex p-3 rounded-xl ${getFeatureColor(feature.color)}`}>
                      {feature.icon}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold font-['Sora'] text-white group-hover:text-[#FF7B00] transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-[#CBD5E1] text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center text-[#FF7B00] text-sm font-medium group-hover:translate-x-1 transition-transform">
                      Learn more
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-gradient-to-br from-[#1E293B] to-[#0F172A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12 ff-fade-in-up">
            <h2 className="text-4xl font-bold font-['Sora'] ff-text-gradient">
              See FlashFusion in Action
            </h2>
            <p className="text-xl text-[#CBD5E1] max-w-2xl mx-auto">
              Experience the power of AI-driven content creation and development workflows
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-4 ff-slide-in-left">
              {[
                { id: 'content', label: 'Content Pipeline', icon: <Palette className="h-5 w-5" /> },
                { id: 'code', label: 'Code Generation', icon: <Code2 className="h-5 w-5" /> },
                { id: 'analytics', label: 'Analytics Dashboard', icon: <BarChart3 className="h-5 w-5" /> }
              ].map((demo) => (
                <Button
                  key={demo.id}
                  variant={activeDemo === demo.id ? "default" : "outline"}
                  className={`w-full justify-start gap-3 p-4 ${
                    activeDemo === demo.id 
                      ? 'ff-btn-primary' 
                      : 'border-[#334155] text-[#CBD5E1] hover:border-[#FF7B00]/50'
                  }`}
                  onClick={() => setActiveDemo(demo.id as any)}
                >
                  {demo.icon}
                  {demo.label}
                </Button>
              ))}
            </div>

            <div className="lg:col-span-3 ff-slide-in-right">
              <Card className="bg-[#1E293B] border-[#334155] overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-[#FF7B00]/10 to-[#00B4D8]/10 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 mx-auto bg-[#FF7B00]/20 rounded-full flex items-center justify-center">
                        <Play className="h-8 w-8 text-[#FF7B00]" />
                      </div>
                      <h3 className="text-2xl font-semibold font-['Sora']">
                        {activeDemo === 'content' && 'Content Creation Pipeline'}
                        {activeDemo === 'code' && 'AI Code Generation'}
                        {activeDemo === 'analytics' && 'Real-time Analytics'}
                      </h3>
                      <p className="text-[#CBD5E1] max-w-md mx-auto">
                        {activeDemo === 'content' && 'Watch AI generate multi-platform content in seconds'}
                        {activeDemo === 'code' && 'See full-stack applications built from simple descriptions'}
                        {activeDemo === 'analytics' && 'Monitor performance and optimize in real-time'}
                      </p>
                      <Button 
                        className="ff-btn-primary ff-hover-glow"
                        onClick={handleDemoPlay}
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Play Demo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16 ff-fade-in-up">
            <h2 className="text-4xl font-bold font-['Sora'] ff-text-gradient">
              Trusted by Creators Worldwide
            </h2>
            <p className="text-xl text-[#CBD5E1] max-w-2xl mx-auto">
              Join thousands of creators who have transformed their workflows with FlashFusion
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <Card className="ff-card-interactive bg-[#1E293B] border-[#334155] p-8 text-center ff-breathe">
              <CardContent className="p-0 space-y-6">
                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                </div>
                
                <blockquote className="text-xl text-[#CBD5E1] italic leading-relaxed">
                  "{CREATOR_TESTIMONIALS[currentTestimonial].content}"
                </blockquote>
                
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-[#FF7B00] rounded-full flex items-center justify-center text-white font-semibold">
                    {CREATOR_TESTIMONIALS[currentTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-white font-['Sora']">
                      {CREATOR_TESTIMONIALS[currentTestimonial].name}
                    </p>
                    <p className="text-sm text-[#94A3B8]">
                      {CREATOR_TESTIMONIALS[currentTestimonial].role}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-2">
                  {CREATOR_TESTIMONIALS.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentTestimonial ? 'bg-[#FF7B00]' : 'bg-[#334155]'
                      }`}
                      onClick={() => setCurrentTestimonial(index)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#FF7B00]/10 via-transparent to-[#00B4D8]/10 border-y border-[#334155]/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-8 ff-fade-in-up">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold font-['Sora'] ff-text-gradient">
              Ready to Transform Your Creative Process?
            </h2>
            <p className="text-xl text-[#CBD5E1] max-w-3xl mx-auto">
              Join the FlashFusion community and experience the future of AI-powered content creation. 
              Start building amazing projects today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="ff-btn-primary text-lg px-8 py-4 ff-hover-glow">
              <Rocket className="h-5 w-5 mr-2" />
              Start Creating Now
            </Button>
            
            <Button 
              variant="outline" 
              className="text-lg px-8 py-4 border-[#334155] text-[#CBD5E1] hover:border-[#FF7B00]/50 ff-focus-ring"
            >
              Book a Demo
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>

          <div className="flex justify-center items-center gap-8 text-sm text-[#94A3B8] flex-wrap">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#10B981]" />
              14-day free trial
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#10B981]" />
              Cancel anytime
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#10B981]" />
              24/7 support
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#10B981]" />
              All features included
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FlashFusionPlatformShowcase;
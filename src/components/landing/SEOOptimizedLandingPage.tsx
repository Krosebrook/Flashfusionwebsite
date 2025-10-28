/**
 * @fileoverview FlashFusion SEO-Optimized Landing Page
 * @chunk landing
 * @category marketing
 * @version 2.0.0
 * @author FlashFusion Team
 * 
 * Premium SEO-optimized landing page with stunning visuals and proper meta tags.
 * 
 * Features:
 * - SEO-first architecture with proper meta tags
 * - Stunning hero section with immersive visuals
 * - Optimized for search engine indexing
 * - Performance-optimized components
 * - Schema markup for rich snippets
 * - Core Web Vitals optimized
 * - Accessibility compliant (WCAG 2.1 AA)
 * - Mobile-responsive design
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { NavigationEventManager } from '../../utils/navigation-system';
import { CompleteFeatureWorkflowDemo } from '../workflows/CompleteFeatureWorkflowDemo';
import { EnhancedAuthenticationSystem } from '../auth/EnhancedAuthenticationSystem';
import { ContactSupportSystem } from '../support/ContactSupportSystem';
import { WaitlistSystem } from '../waitlist/WaitlistSystem';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import type { AuthUser } from '../../hooks/useAuthentication';
import { 
  Star, 
  ArrowRight, 
  Check, 
  Play, 
  Users, 
  Zap, 
  Shield, 
  Rocket,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Twitter,
  Github,
  Linkedin,
  Mail,
  DollarSign,
  BarChart3,
  FileCheck,
  LogIn,
  UserPlus,
  LifeBuoy,
  Gift,
  Clock,
  Percent,
  Sparkles,
  Code,
  PaintBucket,
  Bot,
  TrendingUp,
  Globe,
  Lock,
  Smartphone,
  Monitor,
  Palette,
  Layers
} from 'lucide-react';

// SEO Meta Tags Component
function SEOMetaTags() {
  useEffect(() => {
    // Update document title and meta tags
    document.title = 'FlashFusion - AI Development Platform | Transform Ideas Into Reality';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'The most advanced AI development platform that turns your concepts into production-ready applications, content, and revenue streams in minutes. Join 10,000+ creators building the future with AI.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'The most advanced AI development platform that turns your concepts into production-ready applications, content, and revenue streams in minutes. Join 10,000+ creators building the future with AI.';
      document.head.appendChild(meta);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'AI development platform, no-code development, AI code generator, content creation, AI tools, development automation, creator platform, AI applications, machine learning, artificial intelligence');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = 'AI development platform, no-code development, AI code generator, content creation, AI tools, development automation, creator platform, AI applications, machine learning, artificial intelligence';
      document.head.appendChild(meta);
    }

    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: 'FlashFusion - AI Development Platform | Transform Ideas Into Reality' },
      { property: 'og:description', content: 'The most advanced AI development platform that turns your concepts into production-ready applications, content, and revenue streams in minutes.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href },
      { property: 'og:image', content: 'https://images.unsplash.com/photo-1624792054848-98a03bbb8546?q=80&w=1200&auto=format&fit=crop' },
      { property: 'og:site_name', content: 'FlashFusion' }
    ];

    ogTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (metaTag) {
        metaTag.setAttribute('content', tag.content);
      } else {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', tag.property);
        metaTag.setAttribute('content', tag.content);
        document.head.appendChild(metaTag);
      }
    });

    // Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'FlashFusion - AI Development Platform' },
      { name: 'twitter:description', content: 'Transform your ideas into reality with the most advanced AI development platform. Join 10,000+ creators building the future.' },
      { name: 'twitter:image', content: 'https://images.unsplash.com/photo-1624792054848-98a03bbb8546?q=80&w=1200&auto=format&fit=crop' }
    ];

    twitterTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[name="${tag.name}"]`);
      if (metaTag) {
        metaTag.setAttribute('content', tag.content);
      } else {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', tag.name);
        metaTag.setAttribute('content', tag.content);
        document.head.appendChild(metaTag);
      }
    });

    // JSON-LD Schema markup
    const schemaMarkup = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "FlashFusion",
      "description": "AI development platform that transforms ideas into production-ready applications",
      "url": window.location.origin,
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "29.00",
        "priceCurrency": "USD",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "price": "14.50",
          "priceCurrency": "USD",
          "description": "50% off promotional pricing"
        }
      },
      "creator": {
        "@type": "Organization",
        "name": "FlashFusion Team"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "2847"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schemaMarkup);
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      document.head.removeChild(script);
    };
  }, []);

  return null;
}

/**
 * SEO-Optimized Landing Page Component
 */
export function SEOOptimizedLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showWorkflowDemo, setShowWorkflowDemo] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showContactSupport, setShowContactSupport] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [isHeroVideoLoaded, setIsHeroVideoLoaded] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Handle scroll effects for navigation and parallax
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);

      // Parallax effect for hero background
      if (parallaxRef.current) {
        const scrollTop = window.pageYOffset;
        const rate = scrollTop * -0.5;
        parallaxRef.current.style.transform = `translateY(${rate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Preload hero image
  useEffect(() => {
    const img = new Image();
    img.src = 'https://images.unsplash.com/photo-1624792054848-98a03bbb8546?q=80&w=1920&auto=format&fit=crop';
    img.onload = () => setIsHeroVideoLoaded(true);
  }, []);

  // Handle smooth scrolling
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  // Handle authentication success with conversion tracking
  const handleAuthSuccess = (user: AuthUser) => {
    console.log('Authentication successful:', user);
    
    // Track successful conversion
    try {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        const urlParams = new URLSearchParams(window.location.search);
        const source = urlParams.get('source') || 'landing';
        const promo = urlParams.get('promo') || 'none';
        
        (window as any).gtag('event', 'sign_up', {
          method: 'email',
          source: source,
          promotional_code: promo,
          value: promo === '50OFF' ? 14.50 : 29.00,
          currency: 'USD'
        });
      }
    } catch (error) {
      console.warn('Failed to track conversion:', error);
    }
    
    setShowAuthModal(false);
    
    // Trigger navigation to app
    try {
      localStorage.setItem('ff-show-app', 'true');
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('app', 'true');
      window.history.pushState({}, '', currentUrl.toString());
      NavigationEventManager.getInstance().triggerNavigationChange();
    } catch (error) {
      console.error('Failed to navigate to app:', error);
      window.location.href = '?app=true';
    }
  };

  const handleAuthError = (error: string) => {
    console.error('Authentication error:', error);
  };

  const navigation = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' }
  ];

  const features = [
    {
      icon: <Bot className="w-8 h-8" />,
      title: 'AI Code Generation',
      description: 'Generate production-ready code in any language with advanced AI models trained on billions of code samples.',
      stats: '99.9% accuracy',
      gradient: 'from-[var(--ff-primary)] to-[var(--ff-secondary)]'
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: 'Content Creation',
      description: 'Create stunning visuals, compelling copy, and engaging media content at the speed of thought.',
      stats: '10x faster',
      gradient: 'from-[var(--ff-secondary)] to-[var(--ff-accent)]'
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'One-Click Deploy',
      description: 'Deploy your applications instantly across 20+ platforms with automated optimization and scaling.',
      stats: '5 second deploy',
      gradient: 'from-[var(--ff-accent)] to-[var(--ff-primary)]'
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Revenue Streams',
      description: 'Built-in monetization tools including marketplace integration, subscription management, and analytics.',
      stats: 'Up to 10x ROI',
      gradient: 'from-[var(--ff-primary)] to-[var(--ff-secondary)]'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Enterprise Security',
      description: 'Bank-level security with end-to-end encryption, SOC 2 compliance, and advanced threat protection.',
      stats: '100% secure',
      gradient: 'from-[var(--ff-secondary)] to-[var(--ff-accent)]'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Analytics & Insights',
      description: 'Real-time performance tracking, user behavior analysis, and AI-powered optimization recommendations.',
      stats: 'Real-time data',
      gradient: 'from-[var(--ff-accent)] to-[var(--ff-primary)]'
    }
  ];

  const handleEnterApp = () => {
    setShowAuthModal(true);
  };

  const handleTryDemo = () => {
    try {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('demo', 'true');
      window.history.pushState({}, '', currentUrl.toString());
      NavigationEventManager.getInstance().triggerNavigationChange();
    } catch (error) {
      console.error('Failed to start demo:', error);
      window.location.href = '?demo=true';
    }
  };

  return (
    <>
      <SEOMetaTags />
      
      <div className="min-h-screen" style={{ 
        background: 'var(--ff-bg-dark)',
        fontFamily: 'var(--ff-font-secondary)'
      }}>
        
        {/* Modals */}
        {showAuthModal && (
          <EnhancedAuthenticationSystem
            onAuthSuccess={handleAuthSuccess}
            onAuthError={handleAuthError}
            onClose={() => setShowAuthModal(false)}
          />
        )}

        {showContactSupport && (
          <ContactSupportSystem
            onClose={() => setShowContactSupport(false)}
          />
        )}

        {showWaitlist && (
          <WaitlistSystem
            onClose={() => setShowWaitlist(false)}
            source="landing-page"
          />
        )}

        {/* Fixed Navigation */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[var(--ff-bg-dark)]/80 backdrop-blur-xl border-b border-white/10' 
            : 'bg-transparent'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--ff-primary)] to-[var(--ff-secondary)] rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">FF</span>
                </div>
                <span className="text-xl font-bold text-white ff-text-headline">FlashFusion</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8">
                {navigation.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => scrollToSection(item.href.slice(1))}
                    className="text-[var(--ff-text-secondary)] hover:text-[var(--ff-primary)] transition-colors duration-200 text-sm font-semibold"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="flex items-center space-x-3">
                  <Button 
                    onClick={handleTryDemo}
                    variant="ghost"
                    className="text-white hover:bg-white/10 ff-btn-ghost"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Try Demo
                  </Button>
                  <Button 
                    onClick={() => setShowAuthModal(true)}
                    variant="outline"
                    className="border-[var(--ff-primary)]/30 text-[var(--ff-primary)] hover:bg-[var(--ff-primary)]/10 ff-btn-outline"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => setShowAuthModal(true)}
                    className="ff-btn-primary"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden text-white p-2"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <div className="lg:hidden bg-[var(--ff-surface)]/95 backdrop-blur-lg border-t border-white/10 rounded-b-xl">
                <div className="px-4 py-6 space-y-4">
                  {navigation.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => scrollToSection(item.href.slice(1))}
                      className="block text-[var(--ff-text-secondary)] hover:text-[var(--ff-primary)] transition-colors duration-200 text-base font-medium w-full text-left"
                    >
                      {item.label}
                    </button>
                  ))}
                  <div className="space-y-3 mt-6 pt-4 border-t border-white/10">
                    <Button 
                      onClick={handleTryDemo}
                      variant="ghost"
                      className="w-full ff-btn-ghost"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Try Demo
                    </Button>
                    <Button 
                      onClick={() => setShowAuthModal(true)}
                      variant="outline"
                      className="w-full ff-btn-outline"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                    <Button 
                      onClick={() => setShowAuthModal(true)}
                      className="w-full ff-btn-primary"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Get Started
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section with Stunning Visuals */}
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          
          {/* Parallax Background */}
          <div 
            ref={parallaxRef}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--ff-bg-dark)] via-[var(--ff-surface)] to-[var(--ff-bg-dark)]" />
            <div className="absolute inset-0 opacity-30">
              {isHeroVideoLoaded && (
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1624792054848-98a03bbb8546?q=80&w=1920&auto=format&fit=crop"
                  alt="Futuristic AI workspace with holographic interfaces and code visualization"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--ff-bg-dark)] via-transparent to-[var(--ff-bg-dark)]/50" />
          </div>

          {/* Animated Background Elements */}
          <div className="absolute inset-0 z-1">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[var(--ff-primary)]/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--ff-secondary)]/10 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-[var(--ff-accent)]/5 rounded-full blur-3xl animate-pulse delay-2000" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto text-center">
            
            {/* Promotional Banner */}
            <div className="mb-8 ff-fade-in-up">
              <div className="bg-gradient-to-r from-[var(--ff-accent)]/20 to-[var(--ff-secondary)]/20 border border-[var(--ff-accent)]/30 rounded-2xl p-4 max-w-2xl mx-auto mb-6 backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-3 flex-wrap">
                  <Gift className="w-5 h-5 text-[var(--ff-accent)]" />
                  <span className="text-sm font-semibold text-white">🎉 Limited Time Launch Offer:</span>
                  <div className="flex items-center space-x-2">
                    <Percent className="w-4 h-4 text-[var(--ff-accent)]" />
                    <span className="text-lg font-bold text-[var(--ff-accent)]">50% OFF</span>
                    <span className="text-sm text-white">for 4 months</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-white/80">
                    <Clock className="w-3 h-3" />
                    <span>Limited spots available</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicator */}
            <div className="mb-8 ff-fade-in-up" style={{ animationDelay: '200ms' }}>
              <Badge className="bg-white/10 text-white border-white/20 px-6 py-3 text-sm font-medium backdrop-blur-sm">
                <Users className="w-4 h-4 mr-2" />
                Join 10,000+ creators building the future
              </Badge>
            </div>

            {/* Main Headlines */}
            <div className="mb-12 max-w-5xl mx-auto ff-fade-in-up" style={{ animationDelay: '400ms' }}>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight tracking-tight">
                Transform Ideas Into 
                <span className="bg-gradient-to-r from-[var(--ff-primary)] via-[var(--ff-secondary)] to-[var(--ff-accent)] bg-clip-text text-transparent block mt-2 ff-text-gradient">
                  Reality With AI
                </span>
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl text-[var(--ff-text-secondary)] mb-8 leading-relaxed max-w-4xl mx-auto font-light">
                The most advanced AI development platform that turns your concepts into 
                <span className="text-[var(--ff-primary)] font-semibold"> production-ready applications</span>, 
                content, and revenue streams in minutes, not months.
              </p>
              
              {/* Key Value Props */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Badge className="bg-[var(--ff-primary)]/10 text-[var(--ff-primary)] border-[var(--ff-primary)]/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                  <Zap className="w-4 h-4 mr-2" />
                  10x Faster Development
                </Badge>
                <Badge className="bg-[var(--ff-secondary)]/10 text-[var(--ff-secondary)] border-[var(--ff-secondary)]/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                  <Shield className="w-4 h-4 mr-2" />
                  Enterprise Security
                </Badge>
                <Badge className="bg-[var(--ff-accent)]/10 text-[var(--ff-accent)] border-[var(--ff-accent)]/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Built-in Monetization
                </Badge>
              </div>
            </div>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 ff-fade-in-up" style={{ animationDelay: '600ms' }}>
              <Button 
                onClick={() => setShowAuthModal(true)}
                size="lg"
                className="ff-btn-primary ff-btn-lg group relative overflow-hidden"
              >
                <div className="flex items-center relative z-10">
                  <Gift className="w-5 h-5 mr-3" />
                  <div className="flex flex-col items-start">
                    <span className="text-lg font-bold">Get 50% Off - Start Building</span>
                    <span className="text-xs opacity-90">4 months promotional pricing</span>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="absolute -top-2 -right-2 bg-[var(--ff-accent)] text-white text-xs px-2 py-1 rounded-full font-bold z-20">
                  50% OFF
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--ff-primary)] to-[var(--ff-secondary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
              
              <Button 
                onClick={handleTryDemo}
                size="lg"
                variant="outline"
                className="ff-btn-outline ff-btn-lg group"
              >
                <Play className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                <span className="text-lg font-semibold">Try Interactive Demo</span>
                <Sparkles className="w-5 h-5 ml-3 group-hover:rotate-12 transition-transform" />
              </Button>
            </div>

            {/* Hero Visual Showcase */}
            <div className="relative max-w-6xl mx-auto ff-fade-in-up" style={{ animationDelay: '800ms' }}>
              <div className="ff-card ff-card-interactive relative overflow-hidden shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-[var(--ff-primary)]/20 via-[var(--ff-secondary)]/20 to-[var(--ff-accent)]/20 rounded-xl flex items-center justify-center relative overflow-hidden">
                  
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{ 
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      backgroundSize: '60px 60px'
                    }} />
                  </div>
                  
                  {/* Central Content */}
                  <div className="text-center relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-[var(--ff-primary)] to-[var(--ff-secondary)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg ff-pulse-glow">
                      <Play className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-white/80 font-semibold text-lg mb-2">FlashFusion Interface Preview</p>
                    <p className="text-white/60 text-sm">Click to see the platform in action</p>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute top-4 left-4 w-16 h-16 bg-[var(--ff-primary)]/20 rounded-lg flex items-center justify-center backdrop-blur-sm ff-fade-in-up" style={{ animationDelay: '1000ms' }}>
                    <Code className="w-8 h-8 text-[var(--ff-primary)]" />
                  </div>
                  <div className="absolute top-4 right-4 w-16 h-16 bg-[var(--ff-secondary)]/20 rounded-lg flex items-center justify-center backdrop-blur-sm ff-fade-in-up" style={{ animationDelay: '1200ms' }}>
                    <Palette className="w-8 h-8 text-[var(--ff-secondary)]" />
                  </div>
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-[var(--ff-accent)]/20 rounded-lg flex items-center justify-center backdrop-blur-sm ff-fade-in-up" style={{ animationDelay: '1400ms' }}>
                    <TrendingUp className="w-8 h-8 text-[var(--ff-accent)]" />
                  </div>
                  <div className="absolute bottom-4 right-4 w-16 h-16 bg-[var(--ff-primary)]/20 rounded-lg flex items-center justify-center backdrop-blur-sm ff-fade-in-up" style={{ animationDelay: '1600ms' }}>
                    <Rocket className="w-8 h-8 text-[var(--ff-primary)]" />
                  </div>
                </div>

                {/* Stats Overlay */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-4">
                    <div className="bg-[var(--ff-surface)]/90 backdrop-blur-lg rounded-lg px-4 py-2 border border-white/10">
                      <div className="text-[var(--ff-primary)] text-lg font-bold">10,000+</div>
                      <div className="text-xs text-white/70">Active Creators</div>
                    </div>
                    <div className="bg-[var(--ff-surface)]/90 backdrop-blur-lg rounded-lg px-4 py-2 border border-white/10">
                      <div className="text-[var(--ff-secondary)] text-lg font-bold">50M+</div>
                      <div className="text-xs text-white/70">AI Generations</div>
                    </div>
                    <div className="bg-[var(--ff-surface)]/90 backdrop-blur-lg rounded-lg px-4 py-2 border border-white/10">
                      <div className="text-[var(--ff-accent)] text-lg font-bold">99.9%</div>
                      <div className="text-xs text-white/70">Uptime</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-16 border-y border-white/5 bg-[var(--ff-surface)]/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-[var(--ff-text-muted)] text-sm mb-12 font-medium">
              Trusted by innovative teams worldwide
            </p>
            <div className="flex items-center justify-center space-x-12 opacity-60 flex-wrap gap-8">
              {['TechCorp', 'Innovate Co', 'Digital Agency', 'Creative Studio', 'StartupLab'].map((logo, index) => (
                <div key={index} className="text-white font-bold text-xl tracking-wide">
                  {logo}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-20 ff-stagger-fade">
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-8 tracking-tight">
                Everything you need to 
                <span className="bg-gradient-to-r from-[var(--ff-primary)] via-[var(--ff-secondary)] to-[var(--ff-accent)] bg-clip-text text-transparent block mt-2">
                  create & scale
                </span>
              </h2>
              <p className="text-xl sm:text-2xl text-[var(--ff-text-secondary)] max-w-4xl mx-auto leading-relaxed">
                Professional-grade AI tools designed for creators, developers, and entrepreneurs 
                who want to transform their ideas into profitable digital products.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 ff-stagger-fade">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="ff-card ff-card-interactive group relative overflow-hidden"
                >
                  <CardContent className="p-8 relative z-10">
                    
                    {/* Icon with Gradient Background */}
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                      <div className="text-white">
                        {feature.icon}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[var(--ff-primary)] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-[var(--ff-text-secondary)] mb-4 leading-relaxed text-lg">
                      {feature.description}
                    </p>
                    
                    {/* Stats Badge */}
                    <div className="flex items-center justify-between">
                      <Badge className="bg-[var(--ff-primary)]/10 text-[var(--ff-primary)] border-[var(--ff-primary)]/20 font-semibold">
                        {feature.stats}
                      </Badge>
                      <button className="text-[var(--ff-primary)] font-semibold hover:text-[var(--ff-secondary)] transition-colors duration-200 flex items-center text-sm">
                        Learn more
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </CardContent>
                  
                  {/* Hover Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--ff-primary)]/5 via-[var(--ff-secondary)]/5 to-[var(--ff-accent)]/5" />
            <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--ff-primary)]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--ff-accent)]/10 rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-5xl sm:text-6xl font-black text-white mb-8 tracking-tight">
              Ready to build the 
              <span className="bg-gradient-to-r from-[var(--ff-primary)] to-[var(--ff-secondary)] bg-clip-text text-transparent">
                future
              </span>
              ?
            </h2>
            <p className="text-xl text-[var(--ff-text-secondary)] mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of creators, developers, and entrepreneurs who are already 
              building amazing things with FlashFusion AI.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button 
                onClick={() => setShowAuthModal(true)}
                size="lg"
                className="ff-btn-primary ff-btn-xl group"
              >
                <Gift className="w-6 h-6 mr-3" />
                <span className="text-xl font-bold">Start Building - 50% OFF</span>
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                onClick={handleTryDemo}
                size="lg"
                variant="outline"
                className="ff-btn-outline ff-btn-xl"
              >
                <Play className="w-6 h-6 mr-3" />
                <span className="text-xl font-semibold">Try Demo First</span>
              </Button>
            </div>
            
            <p className="text-sm text-[var(--ff-text-muted)] mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

SEOOptimizedLandingPage.displayName = 'SEOOptimizedLandingPage';

export default SEOOptimizedLandingPage;
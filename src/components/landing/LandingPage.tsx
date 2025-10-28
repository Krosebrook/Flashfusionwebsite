import React, { memo, useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface LandingPageProps {
  onNavigateToApp: () => void;
  currentRoute: string;
  onRouteChange: (route: string) => void;
}

// Hero Section Component
const HeroSection = memo(({ onNavigateToApp }: { onNavigateToApp: () => void }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const heroRef = useRef<HTMLElement>(null);

  const typewriterText = 'AI Development Assistant';

  useEffect(() => {
    setIsVisible(true);
    
    // Typewriter effect
    let index = 0;
    const timer = setInterval(() => {
      setTypedText(typewriterText.substring(0, index));
      index++;
      if (index > typewriterText.length) {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <section 
      ref={heroRef}
      className={`relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-surface/50 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center space-y-8">
        {/* Main heading */}
        <div className="space-y-4">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
            🚀 Next-Generation AI Platform
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              FlashFusion
            </span>
            <span className="block text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground mt-2">
              {typedText}
              <span className="animate-pulse">|</span>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform your ideas into production-ready applications with our comprehensive AI development ecosystem. 
            <span className="text-primary font-semibold">60+ tools</span>, multi-agent orchestration, and one-click deployment.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={onNavigateToApp}
            size="lg"
            className="ff-btn-primary ff-hover-glow px-8 py-4 text-lg font-semibold"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Start Building Now
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-4 text-lg font-semibold border-primary/20 hover:border-primary/40"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Demo
          </Button>
        </div>

        {/* Social proof */}
        <div className="flex flex-col items-center space-y-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>10,000+ Developers</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>50,000+ Projects</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
              <span>99.9% Uptime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
});

// Features Section Component
const FeaturesSection = memo(() => {
  const [visibleFeatures, setVisibleFeatures] = useState<number[]>([]);
  const featuresRef = useRef<HTMLElement>(null);

  const features = [
    {
      icon: '🤖',
      title: 'Multi-Agent Orchestration',
      description: 'Coordinate multiple AI agents to handle complex development workflows simultaneously.',
      gradient: 'from-primary to-orange-500'
    },
    {
      icon: '⚡',
      title: 'One-Click Deployment',
      description: 'Deploy to AWS, Vercel, Netlify, and more with automated CI/CD pipelines.',
      gradient: 'from-secondary to-blue-500'
    },
    {
      icon: '🔧',
      title: '60+ AI Tools',
      description: 'Complete toolkit for code generation, testing, optimization, and documentation.',
      gradient: 'from-accent to-pink-500'
    },
    {
      icon: '🚀',
      title: 'Real-time Collaboration',
      description: 'Work with your team in real-time with live editing and instant synchronization.',
      gradient: 'from-success to-green-500'
    },
    {
      icon: '🔒',
      title: 'Enterprise Security',
      description: 'Bank-grade security with SOC2 compliance and end-to-end encryption.',
      gradient: 'from-warning to-yellow-500'
    },
    {
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Deep insights into development performance, team productivity, and project health.',
      gradient: 'from-purple-500 to-indigo-500'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger the feature animations
            features.forEach((_, index) => {
              setTimeout(() => {
                setVisibleFeatures(prev => [...prev, index]);
              }, index * 150);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={featuresRef} className="py-24 bg-gradient-to-b from-background to-surface/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            ✨ Powerful Features
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Everything you need to build
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              exceptional applications
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From ideation to deployment, FlashFusion provides a complete ecosystem 
            for modern application development.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className={`ff-card-interactive border-border/50 transition-all duration-700 ${
                visibleFeatures.includes(index) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-4 mx-auto mb-4 flex items-center justify-center`}>
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
});

// Pricing Section Component
const PricingSection = memo(() => {
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 'Free',
      period: 'forever',
      description: 'Perfect for learning and small projects',
      features: [
        '5 AI-generated projects per month',
        'Basic code generation tools',
        'Community support',
        'Standard deployment options',
        'Basic analytics'
      ],
      cta: 'Get Started Free',
      popular: false
    },
    {
      id: 'pro',
      name: 'Professional',
      price: '$29',
      period: 'per month',
      description: 'Ideal for professional developers and teams',
      features: [
        'Unlimited AI-generated projects',
        'Advanced multi-agent orchestration',
        'Priority support',
        'Enterprise deployment options',
        'Advanced analytics & insights',
        'Real-time collaboration',
        'Custom integrations'
      ],
      cta: 'Start Pro Trial',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'For large teams and organizations',
      features: [
        'Everything in Professional',
        'Dedicated AI agents',
        'Custom model training',
        'On-premise deployment',
        'Advanced security features',
        'SLA guarantees',
        'Dedicated support team'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-surface/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            💰 Simple Pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Choose your
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              perfect plan
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start free and scale as you grow. No hidden fees, no vendor lock-in.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative ff-card-interactive transition-all duration-300 ${
                plan.popular 
                  ? 'border-primary/50 ring-2 ring-primary/20 scale-105' 
                  : 'border-border/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground ml-2">/{plan.period}</span>
                  )}
                </div>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-success mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'ff-btn-primary ff-hover-glow' 
                      : 'ff-btn-secondary'
                  }`}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            All plans include 14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
});

// Navigation Component
const Navigation = memo(({ currentRoute, onRouteChange, onNavigateToApp }: {
  currentRoute: string;
  onRouteChange: (route: string) => void;
  onNavigateToApp: () => void;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-lg border-b border-border/50' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FF</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FlashFusion
            </span>
          </div>

          {/* Navigation items */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onRouteChange(item.id)}
                className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
                  currentRoute === item.id ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <Button 
            onClick={onNavigateToApp}
            className="ff-btn-primary"
          >
            Launch App
          </Button>
        </div>
      </div>
    </nav>
  );
});

// Main Landing Page Component
const LandingPage = memo(({ onNavigateToApp, currentRoute, onRouteChange }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentRoute={currentRoute}
        onRouteChange={onRouteChange}
        onNavigateToApp={onNavigateToApp}
      />
      
      <main>
        <HeroSection onNavigateToApp={onNavigateToApp} />
        <FeaturesSection />
        <PricingSection />
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/50 bg-surface/30">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FF</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                FlashFusion
              </span>
            </div>
            <p className="text-muted-foreground">
              © 2024 FlashFusion. Built with AI for the future of development.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
});

export default LandingPage;
/**
 * Enhanced FlashFusion Home Page
 * Clean, feature-focused home page with proper FlashFusion styling
 */

import React, { memo } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

export type PageRoute = 'home' | 'dashboard' | 'tools' | 'projects' | 'deployments' | 
                        'analytics' | 'collaboration' | 'templates' | 'integrations' | 
                        'settings' | 'about' | 'pricing' | 'contact' | 'ai-models' | 
                        'live-collaboration' | 'cicd-pipeline' | 'workflows' |
                        'ai-creation' | 'one-click-publishing' | 'creator-commerce' |
                        'enterprise-security' | 'smart-analytics' | 'quality-assurance';

interface EnhancedHomePageProps {
  onNavigate: (route: PageRoute) => void;
}

export const EnhancedHomePage = memo(({ onNavigate }: EnhancedHomePageProps) => (
  <div className="space-y-12 ff-fade-in-up">
    {/* Hero Section */}
    <div className="text-center space-y-6 py-16">
      <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full ff-text-sm ff-badge-primary">
        <span className="w-2 h-2 bg-primary rounded-full ff-pulse"></span>
        <span style={{ fontFamily: 'var(--ff-font-primary)', fontWeight: 'var(--ff-weight-medium)' }}>
          AI-Powered Development Platform
        </span>
      </div>
      
      <h1 className="ff-text-display">
        Build Applications
        <br />
        <span className="ff-text-4xl">with AI Assistance</span>
      </h1>
      
      <p className="ff-text-body max-w-3xl mx-auto">
        Transform your ideas into production-ready applications with FlashFusion's comprehensive 
        AI development ecosystem. <span className="text-primary" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>60+ tools</span>, 
        multi-agent orchestration, and one-click deployment.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center ff-stagger-fade">
        <Button size="lg" className="ff-btn-primary px-8" onClick={() => onNavigate('tools')}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Start Building
        </Button>
        <Button size="lg" className="ff-btn-secondary px-8" onClick={() => onNavigate('workflows')}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          Try Workflows
        </Button>
        <Button size="lg" variant="outline" className="ff-btn-outline px-8">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Watch Demo
        </Button>
      </div>
    </div>

    {/* Quick Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 ff-stagger-fade">
      {[
        { label: 'AI Tools', value: '60+', icon: '🤖' },
        { label: 'Projects Created', value: '10K+', icon: '📁' },
        { label: 'Deployments', value: '25K+', icon: '🚀' },
        { label: 'Developers', value: '5K+', icon: '👥' }
      ].map((stat, index) => (
        <Card key={index} className="ff-card-interactive text-center p-6">
          <div className="text-3xl mb-2">{stat.icon}</div>
          <div className="ff-text-2xl text-primary mb-1" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
            {stat.value}
          </div>
          <div className="ff-text-caption">{stat.label}</div>
        </Card>
      ))}
    </div>

    {/* Featured Tools */}
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="ff-text-headline mb-2">Featured AI Tools</h2>
        <p className="ff-text-body">Powerful tools to accelerate your development workflow</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 ff-stagger-fade">
        {[
          {
            name: 'Full-Stack App Builder',
            description: 'Generate complete applications with React, Node.js, and database integration',
            icon: '🏗️',
            badge: 'Popular',
            color: 'from-primary to-orange-500',
            action: () => onNavigate('tools')
          },
          {
            name: 'AI Code Assistant',
            description: 'Intelligent code completion, review, and optimization powered by advanced AI',
            icon: '🧠',
            badge: 'New',
            color: 'from-secondary to-blue-500',
            action: () => onNavigate('tools')
          },
          {
            name: 'Deploy Anywhere',
            description: 'One-click deployment to AWS, Vercel, Netlify, and 15+ other platforms',
            icon: '🚀',
            badge: 'Featured',
            color: 'from-accent to-pink-500',
            action: () => onNavigate('deployments')
          }
        ].map((tool, index) => (
          <Card key={index} className="ff-card-interactive p-6 cursor-pointer" onClick={tool.action}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-xl`}>
                {tool.icon}
              </div>
              <Badge variant="secondary" className="ff-badge-secondary ff-text-xs">
                {tool.badge}
              </Badge>
            </div>
            <h3 className="ff-text-lg mb-2" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
              {tool.name}
            </h3>
            <p className="ff-text-caption mb-4">{tool.description}</p>
            <Button size="sm" variant="outline" className="ff-btn-outline w-full">
              Launch Tool
            </Button>
          </Card>
        ))}
      </div>
    </div>

    {/* Premium Landing Page Demo */}
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="ff-text-headline mb-2">Marketing & Conversion</h2>
        <p className="ff-text-body">Premium landing page optimized for user acquisition and conversion</p>
      </div>
      
      <Card className="ff-card-interactive p-8 bg-gradient-to-br from-[#00D4FF]/10 to-[#4DD0E1]/10 border-[#00D4FF]/20">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-[#00D4FF]/20 text-[#00D4FF] px-4 py-2 rounded-full ff-text-sm">
            <span className="w-2 h-2 bg-[#00D4FF] rounded-full ff-pulse"></span>
            <span style={{ fontFamily: 'var(--ff-font-primary)', fontWeight: 'var(--ff-weight-medium)' }}>
              Premium Landing Experience
            </span>
          </div>
          
          <h3 className="ff-text-title text-white">
            Conversion-Optimized Landing Page
          </h3>
          
          <p className="ff-text-body max-w-2xl mx-auto">
            Experience our premium landing page designed with modern UX principles, 
            conversion optimization, and clean aesthetics. Perfect for marketing campaigns 
            and professional presentation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-[#00D4FF] hover:bg-[#00B8E6] text-white px-8"
              onClick={() => window.location.href = '?landing=true'}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Landing Page
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-[#00D4FF]/30 text-[#00D4FF] hover:bg-[#00D4FF]/10 px-8"
              onClick={() => {
                const landingUrl = new URL(window.location.href);
                landingUrl.searchParams.set('landing', 'true');
                window.open(landingUrl.toString(), '_blank');
              }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open in New Tab
            </Button>
          </div>

          {/* Features list */}
          <div className="grid md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto mt-8">
            {[
              { icon: '🎯', text: 'Conversion optimized design' },
              { icon: '⚡', text: 'Lightning-fast performance' },
              { icon: '📱', text: 'Mobile-first responsive' },
              { icon: '♿', text: 'Accessibility compliant' }
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 text-white/80">
                <span className="text-lg">{feature.icon}</span>
                <span className="ff-text-sm">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  </div>
));

EnhancedHomePage.displayName = 'EnhancedHomePage';
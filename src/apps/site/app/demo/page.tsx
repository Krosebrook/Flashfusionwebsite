'use client';

import { useState } from 'react';
import Link from 'next/link';
import BackButton from '../../components/BackButton';
import { Play, Code, Rocket, DollarSign, ArrowLeft, ArrowRight, Pause, RotateCcw, Check } from 'lucide-react';

interface Workflow {
  id: string;
  title: string;
  description: string;
  icon: any;
  duration: string;
  color: string;
  href: string;
}

const workflows: Workflow[] = [
  {
    id: 'ai-creation',
    title: 'AI-Powered Creation',
    description: 'Watch FlashFusion generate a complete full-stack application from a simple description in real-time.',
    icon: Code,
    duration: '3 min',
    color: 'var(--ff-primary)',
    href: '/demo/ai-creation'
  },
  {
    id: 'one-click-publish',
    title: 'One-Click Publishing',
    description: 'See how FlashFusion deploys your app to multiple platforms with a single click—no DevOps experience required.',
    icon: Rocket,
    duration: '2 min',
    color: 'var(--ff-secondary)',
    href: '/demo/one-click-publish'
  },
  {
    id: 'creator-commerce',
    title: 'Creator Commerce',
    description: 'Explore how FlashFusion helps you monetize your creations with integrated payment processing and analytics.',
    icon: DollarSign,
    duration: '4 min',
    color: 'var(--ff-accent)',
    href: '/demo/creator-commerce'
  }
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section 
        className="py-20 px-6"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 123, 0, 0.1) 0%, rgba(0, 180, 216, 0.1) 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <BackButton href="/" label="Back to Home" className="mb-8" />

          <div className="text-center max-w-3xl mx-auto">
            <h1 
              className="mb-6"
              style={{
                fontFamily: 'var(--ff-font-primary)',
                fontSize: 'var(--ff-text-5xl)',
                fontWeight: 'var(--ff-weight-extrabold)',
                lineHeight: 'var(--ff-leading-tight)',
                background: 'linear-gradient(135deg, var(--ff-primary) 0%, var(--ff-secondary) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Interactive Demos
            </h1>
            <p 
              className="text-xl mb-4"
              style={{
                color: 'var(--ff-text-secondary)',
                fontFamily: 'var(--ff-font-secondary)',
                lineHeight: 'var(--ff-leading-relaxed)'
              }}
            >
              Experience FlashFusion in action with these interactive demonstrations
            </p>
            <p 
              style={{
                color: 'var(--ff-text-muted)',
                fontFamily: 'var(--ff-font-secondary)',
                fontSize: 'var(--ff-text-sm)'
              }}
            >
              No signup required • Full keyboard navigation • Real working demos
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Cards */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {workflows.map((workflow) => (
              <Link
                key={workflow.id}
                href={workflow.href}
                className="group p-8 rounded-2xl border-2 transition-all hover:scale-105 hover:shadow-2xl"
                style={{
                  background: 'var(--ff-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all group-hover:scale-110"
                  style={{
                    background: `${workflow.color}20`,
                    color: workflow.color
                  }}
                >
                  <workflow.icon className="h-8 w-8" />
                </div>

                <h3 
                  className="mb-3"
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-2xl)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    color: 'var(--ff-text-primary)'
                  }}
                >
                  {workflow.title}
                </h3>

                <p 
                  className="mb-6"
                  style={{
                    color: 'var(--ff-text-secondary)',
                    fontFamily: 'var(--ff-font-secondary)',
                    lineHeight: 'var(--ff-leading-relaxed)'
                  }}
                >
                  {workflow.description}
                </p>

                <div className="flex items-center justify-between">
                  <span 
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full"
                    style={{
                      background: `${workflow.color}20`,
                      color: workflow.color,
                      fontFamily: 'var(--ff-font-primary)',
                      fontSize: 'var(--ff-text-sm)',
                      fontWeight: 'var(--ff-weight-semibold)'
                    }}
                  >
                    <Play className="h-3 w-3" />
                    {workflow.duration}
                  </span>

                  <span 
                    className="inline-flex items-center gap-2 transition-all group-hover:gap-4"
                    style={{
                      color: workflow.color,
                      fontFamily: 'var(--ff-font-primary)',
                      fontSize: 'var(--ff-text-sm)',
                      fontWeight: 'var(--ff-weight-semibold)'
                    }}
                  >
                    Try Demo
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div 
          className="max-w-4xl mx-auto text-center p-12 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 123, 0, 0.1) 0%, rgba(0, 180, 216, 0.1) 100%)',
            border: '1px solid rgba(255, 123, 0, 0.2)'
          }}
        >
          <h2 
            className="mb-6"
            style={{
              fontFamily: 'var(--ff-font-primary)',
              fontSize: 'var(--ff-text-4xl)',
              fontWeight: 'var(--ff-weight-bold)'
            }}
          >
            Ready to Build Real Apps?
          </h2>
          <p 
            className="mb-8"
            style={{
              color: 'var(--ff-text-secondary)',
              fontFamily: 'var(--ff-font-secondary)',
              fontSize: 'var(--ff-text-lg)'
            }}
          >
            Sign up now and start building production-ready applications in minutes
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg transition-all hover:scale-105"
              style={{
                background: 'var(--ff-gradient-primary)',
                color: 'white',
                fontFamily: 'var(--ff-font-primary)',
                fontWeight: 'var(--ff-weight-semibold)',
                boxShadow: 'var(--ff-glow)'
              }}
            >
              Sign Up to Build Real Apps
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border-2 transition-all hover:scale-105"
              style={{
                borderColor: 'var(--ff-primary)',
                color: 'var(--ff-primary)',
                fontFamily: 'var(--ff-font-primary)',
                fontWeight: 'var(--ff-weight-semibold)'
              }}
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
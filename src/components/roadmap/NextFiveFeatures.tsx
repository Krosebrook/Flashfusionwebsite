import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

export type NextFeature = {
  id: string;
  title: string;
  owner: string;
  status: 'at-risk' | 'on-track' | 'blocked';
  progress: number;
  deadline: string;
  summary: string;
  tools: string[];
  blockers?: string[];
  metricTarget: string;
};

export const nextFiveFeatures: NextFeature[] = [
  {
    id: 'full-stack-builder',
    title: 'Full-Stack App Builder (AI-driven)',
    owner: 'Platform',
    status: 'at-risk',
    progress: 42,
    deadline: 'This week',
    summary: 'Wire Configure/Preview/Deploy/Export tabs to real AI generation, previews, and downloads.',
    tools: ['AIService', 'file-generators', 'deployment connectors'],
    blockers: ['Missing AI wiring for generateFullStackApp', 'Download packaging incomplete'],
    metricTarget: 'Generate deployable project in <90s'
  },
  {
    id: 'gamification',
    title: 'Gamification XP & Achievements',
    owner: 'Engagement',
    status: 'at-risk',
    progress: 35,
    deadline: 'This week',
    summary: 'Persist XP, unlock achievements, and update leaderboard in real-time via Supabase.',
    tools: ['Supabase', 'GamificationService', 'Realtime listeners'],
    blockers: ['XP actions not wired to user events'],
    metricTarget: '+20% weekly active users'
  },
  {
    id: 'multi-agent',
    title: 'Multi-Agent Orchestration',
    owner: 'AI',
    status: 'on-track',
    progress: 55,
    deadline: 'Next week',
    summary: 'Coordinate specialist agents (planner, builder, reviewer) with shared memory and retries.',
    tools: ['AgentOrchestrator', 'TaskGraph', 'Memory store'],
    blockers: ['Need sandboxed tool execution tests'],
    metricTarget: 'Reduce failed runs <5%'
  },
  {
    id: 'print-on-demand',
    title: 'Print-on-Demand Automation',
    owner: 'Commerce',
    status: 'on-track',
    progress: 60,
    deadline: 'Next week',
    summary: 'Automate marketplace sync, order routing, and profitability analytics across vendors.',
    tools: ['Marketplace adapters', 'Order router', 'BI dashboards'],
    metricTarget: 'Sync latency <5 minutes'
  },
  {
    id: 'integration-studio',
    title: 'Integration Studio & Webhooks',
    owner: 'Platform',
    status: 'blocked',
    progress: 25,
    deadline: 'Next sprint',
    summary: 'One-click connectors with versioned webhooks, retries, and secret-scoped credentials.',
    tools: ['Webhook manager', 'Secrets vault', 'Audit log'],
    blockers: ['Credential vault contract not finalized'],
    metricTarget: '99.9% delivery success'
  }
];

export const getFeatureRisk = (feature: NextFeature): 'high' | 'medium' | 'low' => {
  if (feature.status === 'blocked') return 'high';
  if (feature.status === 'at-risk') return feature.progress < 50 ? 'high' : 'medium';
  return feature.progress < 40 ? 'medium' : 'low';
};

export const getProgressLabel = (progress: number): string => {
  if (progress >= 80) return 'Execution';
  if (progress >= 60) return 'Build';
  if (progress >= 40) return 'Integration';
  if (progress >= 20) return 'Design';
  return 'Discovery';
};

const statusColors: Record<NextFeature['status'], string> = {
  'on-track': 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40',
  'at-risk': 'bg-amber-500/20 text-amber-200 border border-amber-400/40',
  'blocked': 'bg-red-500/20 text-red-200 border border-red-400/40'
};

export const NextFiveFeaturesSection: React.FC = () => {
  return (
    <section id="next-features" className="py-24 px-4 sm:px-6 lg:px-8 bg-[var(--ff-surface)]/40 backdrop-blur-sm border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--ff-text-muted)]">Execution Radar</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tight">Next 5 Features & Tools</h2>
              <p className="text-lg text-[var(--ff-text-secondary)] max-w-3xl">
                Production-grade commits prioritized by impact. Track risk, owners, and what is needed to ship.
              </p>
            </div>
            <Badge className="bg-[var(--ff-primary)]/20 text-[var(--ff-primary-200)] border border-[var(--ff-primary-400)]/40 px-4 py-2 text-sm">
              Updated live from roadmap
            </Badge>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {nextFiveFeatures.map((feature) => (
            <Card key={feature.id} className="bg-[var(--ff-bg-dark)]/70 border-white/10 hover:border-[var(--ff-primary)]/40 transition-colors">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className={statusColors[feature.status]}>{feature.status.replace('-', ' ')}</Badge>
                  <span className="text-xs text-[var(--ff-text-muted)]">{feature.deadline}</span>
                </div>
                <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                <p className="text-sm text-[var(--ff-text-secondary)] leading-relaxed">{feature.summary}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-[var(--ff-text-muted)]">
                    <span>Owner • {feature.owner}</span>
                    <span className="font-semibold text-white">{feature.progress}% ({getProgressLabel(feature.progress)})</span>
                  </div>
                  <Progress value={feature.progress} className="h-2" />
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--ff-text-muted)]">Critical tools</p>
                  <div className="flex flex-wrap gap-2">
                    {feature.tools.map((tool) => (
                      <Badge key={tool} variant="secondary" className="bg-white/5 text-white border-white/10">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>

                {feature.blockers && feature.blockers.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--ff-text-muted)]">Blockers</p>
                    <ul className="space-y-1 list-disc list-inside text-sm text-amber-100/90">
                      {feature.blockers.map((blocker) => (
                        <li key={blocker}>{blocker}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-[var(--ff-text-muted)]">
                  <span>Target • {feature.metricTarget}</span>
                  <Badge variant="outline" className="border-white/20 text-white bg-white/5">
                    Risk: {getFeatureRisk(feature)}
                  </Badge>
                </div>

                <Button
                  variant="outline"
                  className="w-full ff-btn-outline"
                  onClick={() => console.info(`Inspecting feature ${feature.id}`)}
                >
                  Open Implementation Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

NextFiveFeaturesSection.displayName = 'NextFiveFeaturesSection';

export default NextFiveFeaturesSection;

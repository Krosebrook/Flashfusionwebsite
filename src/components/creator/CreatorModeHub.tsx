import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Zap, 
  Target, 
  TrendingUp, 
  Lightbulb, 
  Palette, 
  Calendar,
  MessageCircle,
  BarChart3,
  Hash,
  Video,
  Search,
  Users,
  DollarSign,
  Sparkles,
  Crown
} from 'lucide-react';

interface CreatorModule {
  id: string;
  title: string;
  description: string;
  painPoint: string;
  icon: React.ReactNode;
  category: 'content' | 'branding' | 'growth' | 'monetization' | 'analytics' | 'automation';
  tier: 'free' | 'pro' | 'enterprise';
  usage: number;
  maxUsage: number;
  isActive: boolean;
  completedTasks: number;
  totalTasks: number;
}

const CREATOR_MODULES: CreatorModule[] = [
  {
    id: 'content-calendar',
    title: 'Smart Content Calendar',
    description: 'Auto-schedules low-effort + high-engagement posts based on your content pillars and energy level.',
    painPoint: 'Burnout & Content Fatigue',
    icon: <Calendar className="h-5 w-5" />,
    category: 'automation',
    tier: 'free',
    usage: 15,
    maxUsage: 50,
    isActive: true,
    completedTasks: 8,
    totalTasks: 10
  },
  {
    id: 'prompt-library',
    title: 'Infinite Prompt Library',
    description: 'AI-generated ideas for each platform, niche, and mood. Filter by trending, evergreen, or audience type.',
    painPoint: 'Idea Block',
    icon: <Lightbulb className="h-5 w-5" />,
    category: 'content',
    tier: 'free',
    usage: 32,
    maxUsage: 100,
    isActive: true,
    completedTasks: 12,
    totalTasks: 15
  },
  {
    id: 'brand-reinforcer',
    title: 'Auto Brand Reinforcer',
    description: 'Every output (post, email, caption) is wrapped in your brand voice, color, and tone.',
    painPoint: 'Inconsistent Branding',
    icon: <Palette className="h-5 w-5" />,
    category: 'branding',
    tier: 'pro',
    usage: 8,
    maxUsage: 25,
    isActive: true,
    completedTasks: 6,
    totalTasks: 8
  },
  {
    id: 'hook-optimizer',
    title: 'Hook & CTA Optimizer',
    description: 'Suggests tested opening hooks, engagement questions, and call-to-actions based on platform and algorithmic trends.',
    painPoint: 'Low Engagement',
    icon: <Target className="h-5 w-5" />,
    category: 'growth',
    tier: 'pro',
    usage: 18,
    maxUsage: 50,
    isActive: true,
    completedTasks: 14,
    totalTasks: 20
  },
  {
    id: 'auto-poster',
    title: 'Cross-Platform AutoPoster',
    description: 'One-click distribute with format optimization across IG, TikTok, Twitter, YouTube, Pinterest.',
    painPoint: 'Posting Overwhelm',
    icon: <Zap className="h-5 w-5" />,
    category: 'automation',
    tier: 'pro',
    usage: 12,
    maxUsage: 30,
    isActive: true,
    completedTasks: 5,
    totalTasks: 12
  },
  {
    id: 'caption-bank',
    title: 'Caption Bank Generator',
    description: '100 ready-to-use, brand-aligned captions for product drops, daily posts, and promos.',
    painPoint: 'Caption Fatigue',
    icon: <MessageCircle className="h-5 w-5" />,
    category: 'content',
    tier: 'free',
    usage: 28,
    maxUsage: 75,
    isActive: true,
    completedTasks: 22,
    totalTasks: 25
  },
  {
    id: 'content-to-product',
    title: 'Content-to-Product Mapper',
    description: 'Suggests monetizable assets (eBooks, Notion kits, merch) based on your top-performing posts.',
    painPoint: 'Monetization Confusion',
    icon: <DollarSign className="h-5 w-5" />,
    category: 'monetization',
    tier: 'pro',
    usage: 6,
    maxUsage: 20,
    isActive: true,
    completedTasks: 3,
    totalTasks: 8
  },
  {
    id: 'pulse-dashboard',
    title: 'Creator Pulse Dashboard',
    description: 'Simplifies performance metrics into 3 actionable tasks.',
    painPoint: 'Analytics Understanding',
    icon: <BarChart3 className="h-5 w-5" />,
    category: 'analytics',
    tier: 'free',
    usage: 45,
    maxUsage: 100,
    isActive: true,
    completedTasks: 18,
    totalTasks: 20
  },
  {
    id: 'hashtag-engine',
    title: 'Smart Hashtag Engine',
    description: 'Based on niche, post style, and engagement trends. Auto-injected on publish.',
    painPoint: 'Hashtag Hell',
    icon: <Hash className="h-5 w-5" />,
    category: 'growth',
    tier: 'free',
    usage: 38,
    maxUsage: 80,
    isActive: true,
    completedTasks: 15,
    totalTasks: 18
  },
  {
    id: 'success-mirror',
    title: 'Success Mirror',
    description: 'Shows positive feedback, milestone wins, and community engagement stats as a motivation panel.',
    painPoint: 'Imposter Syndrome',
    icon: <Crown className="h-5 w-5" />,
    category: 'analytics',
    tier: 'free',
    usage: 22,
    maxUsage: 50,
    isActive: true,
    completedTasks: 10,
    totalTasks: 12
  },
  {
    id: 'reel-generator',
    title: 'AI Reel Generator',
    description: 'Upload raw footage or prompt an idea → get cut, subtitle, and music synced version in minutes.',
    painPoint: 'Video Editing Bottleneck',
    icon: <Video className="h-5 w-5" />,
    category: 'content',
    tier: 'pro',
    usage: 5,
    maxUsage: 15,
    isActive: true,
    completedTasks: 2,
    totalTasks: 6
  },
  {
    id: 'seo-enhancer',
    title: 'SEO Auto-Enhancer',
    description: 'Blog posts, YouTube descriptions, and landing pages enriched with real search keywords.',
    painPoint: 'SEO Blind Spots',
    icon: <Search className="h-5 w-5" />,
    category: 'growth',
    tier: 'pro',
    usage: 14,
    maxUsage: 35,
    isActive: true,
    completedTasks: 8,
    totalTasks: 12
  },
  {
    id: 'viral-sprint',
    title: 'Viral Prompt Sprint',
    description: 'Based on what\'s currently trending. 5 viral formats per platform with examples and editable templates.',
    painPoint: 'Stalled Growth',
    icon: <TrendingUp className="h-5 w-5" />,
    category: 'growth',
    tier: 'pro',
    usage: 9,
    maxUsage: 25,
    isActive: true,
    completedTasks: 4,
    totalTasks: 10
  },
  {
    id: 'strategy-builder',
    title: 'Auto Strategy Builder',
    description: 'You input goals, audience, and vibe → FlashFusion builds a full 90-day platform-specific plan.',
    painPoint: 'Platform Strategy Paralysis',
    icon: <Target className="h-5 w-5" />,
    category: 'automation',
    tier: 'enterprise',
    usage: 3,
    maxUsage: 10,
    isActive: true,
    completedTasks: 1,
    totalTasks: 5
  },
  {
    id: 'collab-matchmaker',
    title: 'Creator Collab Matchmaker',
    description: 'Find and DM other creators with shared goals, platforms, and sizes for collabs and growth sprints.',
    painPoint: 'Community Isolation',
    icon: <Users className="h-5 w-5" />,
    category: 'growth',
    tier: 'pro',
    usage: 7,
    maxUsage: 20,
    isActive: true,
    completedTasks: 3,
    totalTasks: 8
  }
];

const CATEGORY_COLORS = {
  content: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  branding: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  growth: 'bg-green-500/10 text-green-400 border-green-500/20',
  monetization: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  analytics: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  automation: 'bg-pink-500/10 text-pink-400 border-pink-500/20'
};

const TIER_COLORS = {
  free: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  pro: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  enterprise: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
};

interface CreatorModeHubProps {
  userTier: 'free' | 'pro' | 'enterprise';
  onModuleSelect: (moduleId: string) => void;
  onUpgrade: () => void;
}

export function CreatorModeHub({ userTier, onModuleSelect, onUpgrade }: CreatorModeHubProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const categories = ['all', 'content', 'branding', 'growth', 'monetization', 'analytics', 'automation'];
  
  const filteredModules = CREATOR_MODULES.filter(module => {
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.painPoint.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const availableModules = filteredModules.filter(module => {
    if (userTier === 'enterprise') return true;
    if (userTier === 'pro') return module.tier !== 'enterprise';
    return module.tier === 'free';
  });

  const lockedModules = filteredModules.filter(module => {
    if (userTier === 'enterprise') return false;
    if (userTier === 'pro') return module.tier === 'enterprise';
    return module.tier !== 'free';
  });

  const totalActiveModules = CREATOR_MODULES.filter(m => m.isActive).length;
  const completedTasks = CREATOR_MODULES.reduce((sum, m) => sum + m.completedTasks, 0);
  const totalTasks = CREATOR_MODULES.reduce((sum, m) => sum + m.totalTasks, 0);
  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Modules</p>
              <p className="text-2xl font-bold text-orange-400">{totalActiveModules}</p>
            </div>
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Sparkles className="h-6 w-6 text-orange-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold text-blue-400">{completionRate}%</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Target className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tasks Completed</p>
              <p className="text-2xl font-bold text-green-400">{completedTasks}</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Your Tier</p>
              <p className="text-2xl font-bold text-purple-400 capitalize">{userTier}</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Crown className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category === 'all' ? 'All Categories' : category}
            </Button>
          ))}
        </div>
        
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          
          {userTier !== 'enterprise' && (
            <Button onClick={onUpgrade} className="bg-gradient-to-r from-orange-500 to-orange-600">
              Upgrade to {userTier === 'free' ? 'Pro' : 'Enterprise'}
            </Button>
          )}
        </div>
      </div>

      {/* Available Modules */}
      {availableModules.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-foreground">Available Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableModules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="p-6 h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50 ff-card-interactive"
                  onClick={() => onModuleSelect(module.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      {module.icon}
                    </div>
                    <div className="flex gap-2">
                      <Badge className={CATEGORY_COLORS[module.category]} variant="outline">
                        {module.category}
                      </Badge>
                      <Badge className={TIER_COLORS[module.tier]} variant="outline">
                        {module.tier}
                      </Badge>
                    </div>
                  </div>

                  <h4 className="font-semibold text-lg mb-2 text-foreground">{module.title}</h4>
                  <p className="text-sm text-orange-400 mb-2 font-medium">Solves: {module.painPoint}</p>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{module.description}</p>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Usage</span>
                        <span className="text-primary">{module.usage}/{module.maxUsage}</span>
                      </div>
                      <Progress value={(module.usage / module.maxUsage) * 100} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-green-400">{module.completedTasks}/{module.totalTasks}</span>
                      </div>
                      <Progress 
                        value={(module.completedTasks / module.totalTasks) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Modules */}
      {lockedModules.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-muted-foreground">
            Upgrade to Access ({lockedModules.length} modules)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lockedModules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full opacity-60 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-purple-500/5 backdrop-blur-sm z-10" />
                  
                  <div className="relative z-20">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-muted rounded-lg">
                        {module.icon}
                      </div>
                      <div className="flex gap-2">
                        <Badge className={CATEGORY_COLORS[module.category]} variant="outline">
                          {module.category}
                        </Badge>
                        <Badge className={TIER_COLORS[module.tier]} variant="outline">
                          {module.tier}
                        </Badge>
                      </div>
                    </div>

                    <h4 className="font-semibold text-lg mb-2 text-muted-foreground">{module.title}</h4>
                    <p className="text-sm text-orange-400/60 mb-2 font-medium">Solves: {module.painPoint}</p>
                    <p className="text-sm text-muted-foreground/60 mb-4 line-clamp-3">{module.description}</p>

                    <Button 
                      onClick={onUpgrade}
                      size="sm" 
                      className="w-full bg-gradient-to-r from-orange-500 to-purple-600"
                    >
                      Upgrade to Unlock
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <Card className="p-6 bg-gradient-to-r from-orange-500/10 to-purple-500/10 border-orange-500/20">
        <h3 className="text-xl font-semibold mb-4 text-foreground">Quick Start Creator Mode</h3>
        <p className="text-muted-foreground mb-6">
          Activate Creator Mode with a single prompt. FlashFusion will generate your Brand Kit, Content Kit, and all relevant modules.
        </p>
        
        <div className="bg-card border border-border rounded-lg p-4 mb-4 font-mono text-sm">
          <p className="text-green-400">FlashFusion: Activate Creator Mode.</p>
          <p className="text-blue-400">User is a [creator type] targeting [audience] with a vibe of [brand tone].</p>
          <p className="text-purple-400">Generate my Brand Kit, Content Kit, and all relevant modules for:</p>
          <p className="text-orange-400 ml-4">1. Daily content creation</p>
          <p className="text-orange-400 ml-4">2. Growth systems</p>
          <p className="text-orange-400 ml-4">3. Product monetization</p>
          <p className="text-cyan-400">Export to: Notion, Canva, TikTok, Printify, and my dashboard.</p>
        </div>

        <Button 
          size="lg" 
          className="w-full bg-gradient-to-r from-orange-500 to-purple-600 ff-btn-primary"
          onClick={() => onModuleSelect('quick-start-wizard')}
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Activate Creator Mode Now
        </Button>
      </Card>
    </div>
  );
}
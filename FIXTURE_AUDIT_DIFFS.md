# Fixture Audit - Required Changes (Diffs)

This document contains the exact code that needs to be moved from components to fixtures to achieve 100% fixture compliance.

---

## Issue #1: ContentGeneratorTool.tsx - Array Consolidation

### Problem
Component has 3 inline arrays (lines 85-134) that conflict with existing fixture data.

### Decision: Use Fixture Version + Extend
The fixture file already has similar arrays. We should:
1. Keep fixture arrays as canonical
2. Remove inline arrays from component
3. Import from fixtures instead

### Changes Required

#### A. Remove from Component
**File:** `src/components/tools/generation/ContentGeneratorTool.tsx`
**Lines to DELETE:** 85-134

```diff
- // Content type options
- const CONTENT_TYPES = [
-   { value: 'blog-post', label: 'Blog Post', icon: '📝', description: 'Engaging blog articles' },
-   { value: 'article', label: 'Article', icon: '📰', description: 'In-depth articles' },
-   { value: 'social-media', label: 'Social Media', icon: '📱', description: 'Social posts' },
-   { value: 'email', label: 'Email', icon: '✉️', description: 'Email content' },
-   { value: 'landing-page', label: 'Landing Page', icon: '🌐', description: 'Web copy' },
-   { value: 'ad-copy', label: 'Ad Copy', icon: '📢', description: 'Advertisements' },
-   { value: 'video-script', label: 'Video Script', icon: '🎬', description: 'Video scripts' },
-   { value: 'product-description', label: 'Product Description', icon: '🛍️', description: 'Product copy' },
- ];
-
- const TONE_OPTIONS = [
-   { value: 'professional', label: 'Professional', description: 'Formal business tone' },
-   { value: 'conversational', label: 'Conversational', description: 'Friendly and approachable' },
-   { value: 'persuasive', label: 'Persuasive', description: 'Convincing sales copy' },
-   { value: 'informative', label: 'Informative', description: 'Educational content' },
-   { value: 'entertaining', label: 'Entertaining', description: 'Fun and engaging' },
-   { value: 'empathetic', label: 'Empathetic', description: 'Understanding and caring' },
-   { value: 'urgent', label: 'Urgent', description: 'Time-sensitive messaging' },
-   { value: 'inspirational', label: 'Inspirational', description: 'Motivational content' },
- ];
-
- const AUDIENCE_OPTIONS = [
-   { value: 'general', label: 'General Public', description: 'Broad audience appeal' },
-   { value: 'technical', label: 'Technical Professionals', description: 'Developers and engineers' },
-   { value: 'business', label: 'Business Professionals', description: 'Corporate audience' },
-   { value: 'consumers', label: 'Consumers', description: 'End users and customers' },
-   { value: 'students', label: 'Students', description: 'Academic audience' },
-   { value: 'senior', label: 'Senior Management', description: 'C-level executives' },
- ];
```

#### B. Add Import Statement
**File:** `src/components/tools/generation/ContentGeneratorTool.tsx`
**Add near top of file (around line 40):**

```diff
+ import {
+   CONTENT_TYPES,
+   TONES as TONE_OPTIONS,
+   AUDIENCES as AUDIENCE_OPTIONS,
+ } from '../../../fixtures/tools/content-generator-fixtures';
```

**Note:** We alias `TONES` to `TONE_OPTIONS` and `AUDIENCES` to `AUDIENCE_OPTIONS` to match the component's existing variable names. This minimizes code changes throughout the component.

---

## Issue #2: LaunchMarketingCampaign.tsx - Extract Mock Data

### Problem
Component contains 300+ lines of inline mock data (lines 173-476) that should be in fixtures.

### Changes Required

#### A. Add to Fixture File
**File:** `src/fixtures/marketing/marketing-fixtures.ts`
**ADD at end of file:**

```typescript
/**
 * Mock campaign data for testing and development
 */
export const MOCK_CAMPAIGNS = [
  {
    id: 'launch-twitter',
    name: 'Twitter Launch Campaign',
    type: 'social' as const,
    platform: 'Twitter',
    status: 'active' as const,
    startDate: Date.now() - 86400000,
    endDate: Date.now() + 604800000,
    budget: 5000,
    spent: 1250,
    metrics: {
      reach: 45000,
      impressions: 125000,
      engagement: 3400,
      clicks: 890,
      conversions: 47,
      cost_per_acquisition: 26.6,
    },
    content: {
      title: 'FlashFusion Launch - AI Development Revolution',
      description: 'Transform ideas into production-ready applications with 60+ AI tools',
      cta: 'Try FlashFusion Free',
      hashtags: ['#FlashFusion', '#AIDevTools', '#Launch', '#Developer'],
    },
    targeting: {
      demographics: ['Developers', 'Tech Entrepreneurs', 'Startup Founders'],
      interests: ['AI/ML', 'Software Development', 'Productivity Tools'],
      location: ['United States', 'Canada', 'United Kingdom', 'Germany'],
      devices: ['Desktop', 'Mobile'],
    },
  },
  {
    id: 'linkedin-b2b',
    name: 'LinkedIn B2B Campaign',
    type: 'social' as const,
    platform: 'LinkedIn',
    status: 'scheduled' as const,
    startDate: Date.now() + 86400000,
    endDate: Date.now() + 1209600000,
    budget: 8000,
    spent: 0,
    metrics: {
      reach: 0,
      impressions: 0,
      engagement: 0,
      clicks: 0,
      conversions: 0,
      cost_per_acquisition: 0,
    },
    content: {
      title: 'Enterprise AI Development Platform',
      description:
        "Scale your development team productivity with FlashFusion's enterprise-grade AI tools",
      cta: 'Request Demo',
      hashtags: ['#EnterpriseAI', '#DevTools', '#Productivity'],
    },
    targeting: {
      demographics: ['CTOs', 'Engineering Managers', 'Tech Leads'],
      interests: ['Enterprise Software', 'AI/ML', 'DevOps'],
      location: ['United States', 'Canada', 'United Kingdom'],
      devices: ['Desktop'],
    },
  },
  {
    id: 'product-hunt',
    name: 'Product Hunt Launch',
    type: 'pr' as const,
    platform: 'Product Hunt',
    status: 'scheduled' as const,
    startDate: Date.now() + 172800000,
    endDate: Date.now() + 259200000,
    budget: 2000,
    spent: 500,
    metrics: {
      reach: 25000,
      impressions: 85000,
      engagement: 1200,
      clicks: 450,
      conversions: 78,
      cost_per_acquisition: 6.41,
    },
    content: {
      title: 'FlashFusion - AI Development Assistant',
      description:
        'The ultimate AI-powered development platform with 60+ tools for building production-ready applications',
      cta: 'Upvote & Try Free',
    },
    targeting: {
      demographics: ['Product Hunt Community', 'Early Adopters', 'Tech Enthusiasts'],
      interests: ['New Products', 'AI Tools', 'Developer Tools'],
      location: ['Global'],
      devices: ['Desktop', 'Mobile'],
    },
  },
  {
    id: 'youtube-content',
    name: 'YouTube Content Series',
    type: 'content' as const,
    platform: 'YouTube',
    status: 'active' as const,
    startDate: Date.now() - 432000000,
    endDate: Date.now() + 2592000000,
    budget: 15000,
    spent: 3750,
    metrics: {
      reach: 75000,
      impressions: 180000,
      engagement: 8500,
      clicks: 2100,
      conversions: 156,
      cost_per_acquisition: 24.04,
    },
    content: {
      title: 'FlashFusion Tutorial Series',
      description: 'Learn to build full-stack applications with AI assistance',
      cta: 'Subscribe & Try FlashFusion',
    },
    targeting: {
      demographics: ['Developers', 'Students', 'Tech Enthusiasts'],
      interests: ['Programming Tutorials', 'AI/ML', 'Web Development'],
      location: ['Global'],
      devices: ['Desktop', 'Mobile', 'TV'],
    },
  },
];

/**
 * Mock influencer outreach data
 */
export const MOCK_INFLUENCERS = [
  {
    id: 'inf-1',
    name: 'TechGuru_Dev',
    platform: 'Twitter',
    followers: 125000,
    engagement_rate: 4.2,
    status: 'confirmed' as const,
    fee: 2500,
    deliverables: ['Tweet thread', 'Retweet campaign', 'Live demo'],
    expected_reach: 80000,
    contact_date: Date.now() - 604800000,
    campaign_date: Date.now() + 86400000,
  },
  {
    id: 'inf-2',
    name: 'CodeWithSarah',
    platform: 'YouTube',
    followers: 89000,
    engagement_rate: 6.8,
    status: 'negotiating' as const,
    fee: 5000,
    deliverables: ['Full video review', 'Shorts series', 'Community post'],
    expected_reach: 120000,
    contact_date: Date.now() - 432000000,
  },
  {
    id: 'inf-3',
    name: 'DevLifestyle',
    platform: 'Instagram',
    followers: 67000,
    engagement_rate: 8.1,
    status: 'contacted' as const,
    fee: 1800,
    deliverables: ['Story series', 'Reel', 'Post'],
    expected_reach: 45000,
    contact_date: Date.now() - 172800000,
  },
];

/**
 * Mock content pieces
 */
export const MOCK_CONTENT = [
  {
    id: 'content-1',
    title: 'FlashFusion Launch: The Future of AI Development',
    type: 'blog' as const,
    platform: ['Website', 'Medium', 'Dev.to'],
    status: 'published' as const,
    publish_date: Date.now() - 86400000,
    author: 'Marketing Team',
    performance: {
      views: 12500,
      shares: 340,
      likes: 890,
      comments: 156,
      conversion_rate: 3.2,
    },
    seo_score: 92,
  },
  {
    id: 'content-2',
    title: 'Building a Full-Stack App in 10 Minutes with FlashFusion',
    type: 'video' as const,
    platform: ['YouTube', 'Twitter', 'LinkedIn'],
    status: 'published' as const,
    publish_date: Date.now() - 172800000,
    author: 'Product Team',
    performance: {
      views: 45000,
      shares: 1200,
      likes: 3400,
      comments: 567,
      conversion_rate: 5.8,
    },
    seo_score: 87,
  },
  {
    id: 'content-3',
    title: 'FlashFusion vs Competition: Feature Comparison',
    type: 'infographic' as const,
    platform: ['Twitter', 'LinkedIn', 'Instagram'],
    status: 'approved' as const,
    publish_date: Date.now() + 86400000,
    author: 'Design Team',
    performance: {
      views: 0,
      shares: 0,
      likes: 0,
      comments: 0,
      conversion_rate: 0,
    },
    seo_score: 0,
  },
];

/**
 * Mock community metrics
 */
export const MOCK_COMMUNITY_METRICS = {
  discord: {
    members: 2340,
    active_users: 456,
    messages_per_day: 890,
    growth_rate: 15.2,
  },
  twitter: {
    followers: 8900,
    engagement_rate: 4.7,
    mentions: 234,
    hashtag_performance: {
      '#FlashFusion': 1240,
      '#AIDevTools': 890,
      '#BuildFaster': 567,
      '#Developer': 2340,
    },
  },
  github: {
    stars: 1560,
    forks: 234,
    contributors: 23,
    issues: 45,
  },
  reddit: {
    subscribers: 1890,
    posts_per_week: 12,
    upvote_ratio: 0.94,
  },
};

/**
 * Mock launch goals
 */
export const MOCK_LAUNCH_GOALS = [
  {
    id: 'goal-signups',
    metric: 'User Signups',
    target: 500,
    current: 287,
    deadline: Date.now() + 604800000,
    priority: 'critical' as const,
    campaigns: ['launch-twitter', 'linkedin-b2b', 'product-hunt'],
  },
  {
    id: 'goal-social-followers',
    metric: 'Social Media Followers',
    target: 10000,
    current: 8900,
    deadline: Date.now() + 1209600000,
    priority: 'high' as const,
    campaigns: ['launch-twitter', 'youtube-content'],
  },
  {
    id: 'goal-community-members',
    metric: 'Community Members',
    target: 3000,
    current: 2340,
    deadline: Date.now() + 1209600000,
    priority: 'medium' as const,
    campaigns: ['youtube-content'],
  },
  {
    id: 'goal-content-views',
    metric: 'Content Views',
    target: 100000,
    current: 57500,
    deadline: Date.now() + 1814400000,
    priority: 'medium' as const,
    campaigns: ['youtube-content'],
  },
];
```

#### B. Update Component Import
**File:** `src/components/marketing/LaunchMarketingCampaign.tsx`
**Update import (line 42-43):**

```diff
- import { SOCIAL_PLATFORMS, CONTENT_TEMPLATES } from '../../fixtures/marketing/marketing-fixtures';
+ import {
+   SOCIAL_PLATFORMS,
+   CONTENT_TEMPLATES,
+   MOCK_CAMPAIGNS,
+   MOCK_INFLUENCERS,
+   MOCK_CONTENT,
+   MOCK_COMMUNITY_METRICS,
+   MOCK_LAUNCH_GOALS,
+ } from '../../fixtures/marketing/marketing-fixtures';
```

#### C. Replace useEffect Logic
**File:** `src/components/marketing/LaunchMarketingCampaign.tsx`
**Replace lines 169-476:**

```diff
  // Initialize marketing data
  useEffect(() => {
    const initializeMarketingData = async () => {
      try {
-       // Mock campaigns
-       const mockCampaigns: MarketingCampaign[] = [
-         {
-           id: 'launch-twitter',
-           name: 'Twitter Launch Campaign',
-           /* ... 125 lines of campaign data ... */
-         },
-       ];
-
-       // Mock influencers
-       const mockInfluencers: InfluencerOutreach[] = [
-         /* ... 39 lines of influencer data ... */
-       ];
-
-       // Mock content pieces
-       const mockContent: ContentPiece[] = [
-         /* ... 53 lines of content data ... */
-       ];
-
-       // Mock community metrics
-       const mockCommunityMetrics: CommunityMetrics = {
-         /* ... 30 lines of metrics ... */
-       };
-
-       // Mock launch goals
-       const mockGoals: LaunchGoal[] = [
-         /* ... 38 lines of goals ... */
-       ];

-       setCampaigns(mockCampaigns);
-       setInfluencers(mockInfluencers);
-       setContentPieces(mockContent);
-       setCommunityMetrics(mockCommunityMetrics);
-       setLaunchGoals(mockGoals);
+       // Load mock data from fixtures
+       setCampaigns(MOCK_CAMPAIGNS as MarketingCampaign[]);
+       setInfluencers(MOCK_INFLUENCERS as InfluencerOutreach[]);
+       setContentPieces(MOCK_CONTENT as ContentPiece[]);
+       setCommunityMetrics(MOCK_COMMUNITY_METRICS as CommunityMetrics);
+       setLaunchGoals(MOCK_LAUNCH_GOALS as LaunchGoal[]);
      } catch (error) {
        console.error('Failed to load marketing data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeMarketingData();
  }, []);
```

**Result:** Removes ~300 lines from component, reduces file size by 21%

---

## Issue #3: AgentDesignerTool.tsx - Remove Orphaned Code

### Problem
Lines 174-185 contain an orphaned code fragment from incomplete fixture extraction.

### Changes Required

#### Remove Orphaned Code
**File:** `src/components/tools/generation/AgentDesignerTool.tsx`
**DELETE lines 174-185:**

```diff
  import {
    AGENT_PLATFORMS,
    AGENT_TEMPLATES,
    type AgentPlatform,
  } from '../../../fixtures/tools/agent-designer-fixtures';


- // AGENT_PLATFORMS and AGENT_TEMPLATES imported from fixtures
-
-   },
-   {
-     id: 'data_analyst',
-     name: 'Data Analysis Agent',
-     description: 'Process data, generate insights, and create visualizations',
-     type: 'assistant',
-     use_cases: ['Data Processing', 'Report Generation', 'Trend Analysis', 'Visualization'],
-     personality: { tone: 'analytical', formality: 'professional', empathy: 4 },
-   },
- ];

  export function AgentDesignerTool(): JSX.Element {
```

**Note:** This is a simple deletion - the code is not referenced anywhere and is syntactically incomplete.

---

## Summary of Changes

### Files to Modify

1. **src/fixtures/tools/content-generator-fixtures.ts**
   - No changes needed (already has correct data)

2. **src/components/tools/generation/ContentGeneratorTool.tsx**
   - Add import statement (1 line added)
   - Delete inline arrays (50 lines removed)
   - **Net change:** -49 lines

3. **src/fixtures/marketing/marketing-fixtures.ts**
   - Add 5 new exports (245 lines added)
   - **Net change:** +245 lines

4. **src/components/marketing/LaunchMarketingCampaign.tsx**
   - Update import statement (7 lines)
   - Replace useEffect logic (304 lines deleted, 5 lines added)
   - **Net change:** -299 lines

5. **src/components/tools/generation/AgentDesignerTool.tsx**
   - Delete orphaned code (12 lines removed)
   - **Net change:** -12 lines

### Overall Impact
- **Total Lines Removed from Components:** 360 lines
- **Total Lines Added to Fixtures:** 245 lines
- **Net Code Reduction:** 115 lines
- **Improved Separation of Concerns:** ✅
- **Fixture Coverage:** 100%

---

## Testing After Changes

After implementing all changes, verify:

```bash
# 1. Components compile without errors
npm run build

# 2. No TypeScript errors
npm run type-check

# 3. All imports resolve correctly
npm run lint

# 4. Components render properly
npm run dev
# Then manually test:
# - ContentGeneratorTool
# - LaunchMarketingCampaign
# - AgentDesignerTool

# 5. Search for remaining inline mock data
grep -r "const MOCK" src/components/
grep -r "const mock" src/components/
# Should return no results in component files
```

---

**Document Version:** 1.0
**Created:** 2025-10-27
**Status:** Ready for Implementation

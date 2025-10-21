import { UserStats } from '../types';

// Realistic startup statistics for FlashFusion platform
export const createUserStats = (userRole?: string, credits?: number): UserStats => ({
  level: userRole === 'pro' ? 8 : 3, // More realistic levels for startup
  xp: userRole === 'pro' ? 2450 : 820, // Realistic XP progression
  xpToNext: userRole === 'pro' ? 3200 : 1000, // Achievable XP targets
  totalProjects: userRole === 'pro' ? 15 : 4, // Realistic project counts
  totalImages: userRole === 'pro' ? 245 : 67, // Realistic image generation
  totalCode: userRole === 'pro' ? 89 : 23, // Realistic code generation
  credits: credits || 150, // Starter credit amount
  badges: [],
  dailyTasksCompleted: userRole === 'pro' ? 3 : 1, // Realistic daily engagement
  streak: userRole === 'pro' ? 7 : 3 // Achievable streak counts
});

export const updateUserStatsFromUser = (userStats: UserStats, userRole?: string, credits?: number): UserStats => ({
  ...userStats,
  level: userRole === 'pro' ? 8 : 3,
  xp: userRole === 'pro' ? 2450 : 820,
  xpToNext: userRole === 'pro' ? 3200 : 1000,
  totalProjects: userRole === 'pro' ? 15 : 4,
  totalImages: userRole === 'pro' ? 245 : 67,
  totalCode: userRole === 'pro' ? 89 : 23,
  credits: credits || userStats.credits,
  dailyTasksCompleted: userRole === 'pro' ? 3 : 1,
  streak: userRole === 'pro' ? 7 : 3
});

// Platform-wide realistic startup statistics
export const getPlatformStats = () => ({
  totalUsers: 8247, // Growing startup user base
  activeToday: 1834, // Healthy daily active users
  projectsGenerated: 15642, // Realistic project generation
  appsDeployed: 4892, // Good deployment rate
  totalAIRequests: 234567, // Substantial AI usage
  averageResponseTime: 0.8, // Excellent performance
  uptimePercentage: 99.7, // Production-ready uptime
  conversionRate: 12.4, // Healthy conversion rate
  customerSatisfaction: 4.6, // Strong satisfaction score
  monthlyGrowthRate: 28.5, // Strong startup growth
  retentionRate: 78.2, // Good user retention
  averageSessionTime: 24.5 // Minutes - good engagement
});

// Growth metrics for realistic startup analytics
export const getGrowthMetrics = () => ({
  newUsersToday: 127,
  newUsersThisWeek: 842,
  newUsersThisMonth: 3456,
  weekOverWeekGrowth: 23.8,
  monthOverMonthGrowth: 145.2,
  quarterOverQuarterGrowth: 456.7,
  topUserSegment: 'solo-developer',
  topFeature: 'full-stack-builder',
  mostActiveTimeUTC: '14:00-16:00',
  peakConcurrentUsers: 234,
  averageProjectsPerUser: 1.9
});

// Feature usage statistics for product analytics
export const getFeatureUsageStats = () => ({
  fullStackBuilder: { usage: 4892, conversionRate: 89.2 },
  contentGenerator: { usage: 3456, conversionRate: 72.8 },
  multiAgent: { usage: 1834, conversionRate: 65.4 },
  deployment: { usage: 2947, conversionRate: 94.6 },
  analytics: { usage: 1569, conversionRate: 58.3 },
  collaboration: { usage: 892, conversionRate: 76.9 },
  brandKit: { usage: 2103, conversionRate: 83.5 },
  aiTools: { usage: 6742, conversionRate: 91.2 }
});

// Revenue metrics for business analytics
export const getRevenueMetrics = () => ({
  mrr: 28450, // Monthly Recurring Revenue in USD
  arr: 341400, // Annual Recurring Revenue
  averageRevenuePerUser: 34.50,
  lifetimeValue: 287.60,
  churnRate: 3.2,
  expansionRevenue: 8240,
  paidConversionRate: 8.7,
  trialToPayConversion: 24.3,
  revenueGrowthRate: 42.8,
  customerAcquisitionCost: 12.40
});

export const completeTask = (userStats: UserStats, taskId: string, tasks: any[]): UserStats => {
  const task = tasks.find(t => t.id === taskId);
  if (task && !task.completed) {
    task.completed = true;
    return {
      ...userStats,
      xp: userStats.xp + task.xpReward,
      dailyTasksCompleted: userStats.dailyTasksCompleted + 1
    };
  }
  return userStats;
};
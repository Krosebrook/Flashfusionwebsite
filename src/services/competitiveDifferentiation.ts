import { supabase } from '../lib/supabase';
import { trackGamificationEvent } from '../lib/monitoring';

// AI-Powered Code Review System
export interface CodeReview {
  id: string;
  projectId: string;
  userId: string;
  code: string;
  analysis: {
    quality: number; // 0-100
    performance: number; // 0-100
    security: number; // 0-100
    maintainability: number; // 0-100
    suggestions: CodeSuggestion[];
    complexity: 'low' | 'medium' | 'high';
    estimatedLines: number;
  };
  aiReviewer: string;
  timestamp: string;
}

export interface CodeSuggestion {
  type: 'optimization' | 'security' | 'bug' | 'style' | 'feature';
  severity: 'low' | 'medium' | 'high' | 'critical';
  line?: number;
  message: string;
  suggestion: string;
  reasoning: string;
  confidence: number; // 0-1
}

// Community Challenge System
export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  requirements: string[];
  constraints?: string[];
  startDate: string;
  endDate: string;
  prizes: {
    xp: number;
    badges: string[];
    features?: string[];
  };
  participants: number;
  submissions: number;
  featured: boolean;
}

// Adaptive Learning Path
export interface LearningPath {
  id: string;
  userId: string;
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  strengths: string[];
  weaknesses: string[];
  recommendedTools: string[];
  nextChallenges: string[];
  progress: {
    [skill: string]: number; // 0-100
  };
  adaptationHistory: AdaptationEvent[];
}

export interface AdaptationEvent {
  timestamp: string;
  trigger: string;
  previousLevel: string;
  newLevel: string;
  reasoning: string;
}

// Smart Template Generator
export interface SmartTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  adaptiveElements: {
    [key: string]: any;
  };
  personalizationFactors: string[];
  usageCount: number;
  successRate: number;
}

export class CompetitiveDifferentiationService {
  
  // AI-Powered Code Review
  static async performCodeReview(projectId: string, code: string, userId: string): Promise<CodeReview> {
    try {
      // Simulate AI analysis (in production, integrate with Claude/GPT)
      const analysis = await this.analyzeCode(code);
      
      const review: CodeReview = {
        id: crypto.randomUUID(),
        projectId,
        userId,
        code,
        analysis,
        aiReviewer: 'FlashFusion AI Reviewer v2.0',
        timestamp: new Date().toISOString()
      };

      // Store review in database
      await supabase
        .from('code_reviews')
        .insert({
          id: review.id,
          project_id: projectId,
          user_id: userId,
          analysis_data: analysis,
          ai_reviewer: review.aiReviewer,
          created_at: review.timestamp
        });

      // Award XP for code review completion
      await this.awardXPForCodeReview(userId, analysis);

      trackGamificationEvent('code_review_completed', {
        userId,
        projectId,
        qualityScore: analysis.quality,
        suggestionsCount: analysis.suggestions.length
      });

      return review;
    } catch (error) {
      console.error('Error performing code review:', error);
      throw error;
    }
  }

  private static async analyzeCode(code: string): Promise<CodeReview['analysis']> {
    // Simulated AI analysis - replace with actual AI service
    const lines = code.split('\n').length;
    const hasComments = code.includes('//') || code.includes('/*');
    const hasTypeScript = code.includes(': ') && code.includes('interface');
    const hasTests = code.includes('test(') || code.includes('it(');
    
    const suggestions: CodeSuggestion[] = [];
    
    // Add suggestions based on code analysis
    if (!hasComments) {
      suggestions.push({
        type: 'style',
        severity: 'medium',
        message: 'Consider adding comments for better code documentation',
        suggestion: 'Add inline comments to explain complex logic',
        reasoning: 'Comments improve code maintainability and team collaboration',
        confidence: 0.8
      });
    }

    if (!hasTypeScript) {
      suggestions.push({
        type: 'optimization',
        severity: 'medium',
        message: 'Consider using TypeScript for better type safety',
        suggestion: 'Add type annotations to function parameters and return types',
        reasoning: 'TypeScript helps catch errors at compile time and improves developer experience',
        confidence: 0.9
      });
    }

    if (!hasTests) {
      suggestions.push({
        type: 'feature',
        severity: 'high',
        message: 'No tests detected',
        suggestion: 'Add unit tests for critical functions',
        reasoning: 'Tests ensure code reliability and make refactoring safer',
        confidence: 0.95
      });
    }

    return {
      quality: Math.min(100, 60 + (hasComments ? 15 : 0) + (hasTypeScript ? 15 : 0) + (hasTests ? 10 : 0)),
      performance: Math.min(100, 70 + Math.random() * 25),
      security: Math.min(100, 80 + Math.random() * 20),
      maintainability: Math.min(100, 65 + (hasComments ? 20 : 0) + (hasTypeScript ? 15 : 0)),
      suggestions,
      complexity: lines > 200 ? 'high' : lines > 50 ? 'medium' : 'low',
      estimatedLines: lines
    };
  }

  private static async awardXPForCodeReview(userId: string, analysis: CodeReview['analysis']): Promise<void> {
    const baseXP = 100;
    const qualityBonus = Math.floor(analysis.quality / 10) * 5;
    const suggestionBonus = Math.min(analysis.suggestions.length * 10, 50);
    
    const totalXP = baseXP + qualityBonus + suggestionBonus;
    
    // This would call your existing gamification service
    // await GamificationService.awardXP(userId, totalXP, 'Code Review Completed');
  }

  // Community Challenge System
  static async getCommunityhallenges(): Promise<Challenge[]> {
    try {
      const { data } = await supabase
        .from('community_challenges')
        .select('*')
        .eq('active', true)
        .order('featured', { ascending: false })
        .order('start_date', { ascending: false });

      return data || [];
    } catch (error) {
      console.error('Error fetching challenges:', error);
      return [];
    }
  }

  static async submitChallengeEntry(challengeId: string, userId: string, projectId: string): Promise<void> {
    try {
      await supabase
        .from('challenge_submissions')
        .insert({
          challenge_id: challengeId,
          user_id: userId,
          project_id: projectId,
          submitted_at: new Date().toISOString()
        });

      trackGamificationEvent('challenge_submitted', {
        userId,
        challengeId,
        projectId
      });
    } catch (error) {
      console.error('Error submitting challenge entry:', error);
      throw error;
    }
  }

  // Adaptive Learning System
  static async updateLearningPath(userId: string, activityData: any): Promise<LearningPath> {
    try {
      // Get current learning path
      const { data: currentPath } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Analyze user's recent activities
      const analysis = await this.analyzeUserProgress(userId, activityData);
      
      // Adapt the learning path
      const updatedPath = this.adaptLearningPath(currentPath, analysis);

      // Update in database
      await supabase
        .from('learning_paths')
        .upsert({
          user_id: userId,
          ...updatedPath,
          updated_at: new Date().toISOString()
        });

      return updatedPath;
    } catch (error) {
      console.error('Error updating learning path:', error);
      throw error;
    }
  }

  private static async analyzeUserProgress(userId: string, activityData: any): Promise<any> {
    // Analyze user's tool usage, project complexity, success rates, etc.
    const { data: toolUsage } = await supabase
      .from('ai_tool_usage')
      .select('tool_id, success, created_at')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    const { data: projects } = await supabase
      .from('projects')
      .select('project_type, features, created_at')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    return {
      toolUsage: toolUsage || [],
      projects: projects || [],
      ...activityData
    };
  }

  private static adaptLearningPath(currentPath: any, analysis: any): LearningPath {
    // AI-driven adaptation logic
    const strengths = this.identifyStrengths(analysis);
    const weaknesses = this.identifyWeaknesses(analysis);
    const recommendedTools = this.recommendTools(strengths, weaknesses);
    const nextChallenges = this.suggestChallenges(currentPath?.currentLevel || 'beginner', strengths, weaknesses);

    return {
      id: currentPath?.id || crypto.randomUUID(),
      userId: currentPath?.user_id,
      currentLevel: this.determineLevel(analysis),
      strengths,
      weaknesses,
      recommendedTools,
      nextChallenges,
      progress: this.calculateProgress(analysis),
      adaptationHistory: [
        ...(currentPath?.adaptation_history || []),
        {
          timestamp: new Date().toISOString(),
          trigger: 'Activity analysis',
          previousLevel: currentPath?.current_level || 'beginner',
          newLevel: this.determineLevel(analysis),
          reasoning: 'Based on recent tool usage and project complexity'
        }
      ]
    };
  }

  private static identifyStrengths(analysis: any): string[] {
    const strengths = [];
    
    // Analyze tool usage patterns
    const toolCategories = this.categorizeTool(analysis.toolUsage);
    Object.entries(toolCategories).forEach(([category, usage]: [string, any]) => {
      if (usage.successRate > 0.8 && usage.count > 5) {
        strengths.push(category);
      }
    });

    return strengths;
  }

  private static identifyWeaknesses(analysis: any): string[] {
    const weaknesses = [];
    
    const toolCategories = this.categorizeTools(analysis.toolUsage);
    Object.entries(toolCategories).forEach(([category, usage]: [string, any]) => {
      if (usage.successRate < 0.6 && usage.count > 2) {
        weaknesses.push(category);
      }
    });

    return weaknesses;
  }

  private static categorizeTools(toolUsage: any[]): any {
    const categories: any = {};
    
    toolUsage.forEach(usage => {
      const category = this.getToolCategory(usage.tool_id);
      if (!categories[category]) {
        categories[category] = { count: 0, successes: 0 };
      }
      categories[category].count++;
      if (usage.success) {
        categories[category].successes++;
      }
    });

    Object.keys(categories).forEach(category => {
      categories[category].successRate = categories[category].successes / categories[category].count;
    });

    return categories;
  }

  private static getToolCategory(toolId: string): string {
    // Map tool IDs to categories
    const categoryMap: any = {
      'code-generator': 'Code Generation',
      'ui-generator': 'UI Design',
      'api-generator': 'API Development',
      // ... more mappings
    };
    
    return categoryMap[toolId] || 'General';
  }

  private static recommendTools(strengths: string[], weaknesses: string[]): string[] {
    // Recommend tools that complement strengths and address weaknesses
    const recommendations = [];
    
    // Add advanced tools for strengths
    strengths.forEach(strength => {
      recommendations.push(...this.getAdvancedToolsForCategory(strength));
    });
    
    // Add beginner tools for weaknesses
    weaknesses.forEach(weakness => {
      recommendations.push(...this.getBeginnerToolsForCategory(weakness));
    });
    
    return [...new Set(recommendations)].slice(0, 10);
  }

  private static getAdvancedToolsForCategory(category: string): string[] {
    const toolMap: any = {
      'Code Generation': ['advanced-react-generator', 'backend-api-creator'],
      'UI Design': ['advanced-ui-composer', 'animation-studio'],
      // ... more mappings
    };
    
    return toolMap[category] || [];
  }

  private static getBeginnerToolsForCategory(category: string): string[] {
    const toolMap: any = {
      'Code Generation': ['simple-component-generator', 'basic-app-template'],
      'UI Design': ['color-palette-generator', 'basic-layout-creator'],
      // ... more mappings
    };
    
    return toolMap[category] || [];
  }

  private static suggestChallenges(level: string, strengths: string[], weaknesses: string[]): string[] {
    // Suggest challenges that match user level and focus on improvement areas
    return [
      `${level}-level-challenge-1`,
      `improve-${weaknesses[0] || 'general'}-skills`,
      `advanced-${strengths[0] || 'general'}-mastery`
    ].filter(Boolean);
  }

  private static determineLevel(analysis: any): 'beginner' | 'intermediate' | 'advanced' {
    const projectCount = analysis.projects.length;
    const toolsUsed = new Set(analysis.toolUsage.map((u: any) => u.tool_id)).size;
    const successRate = analysis.toolUsage.filter((u: any) => u.success).length / analysis.toolUsage.length;

    if (projectCount >= 20 && toolsUsed >= 15 && successRate >= 0.8) {
      return 'advanced';
    } else if (projectCount >= 5 && toolsUsed >= 5 && successRate >= 0.6) {
      return 'intermediate';
    } else {
      return 'beginner';
    }
  }

  private static calculateProgress(analysis: any): { [skill: string]: number } {
    // Calculate progress in different skill areas
    const skills = ['Code Generation', 'UI Design', 'API Development', 'Deployment', 'Testing'];
    const progress: any = {};

    skills.forEach(skill => {
      const categoryTools = analysis.toolUsage.filter((u: any) => 
        this.getToolCategory(u.tool_id) === skill
      );
      
      if (categoryTools.length > 0) {
        const successRate = categoryTools.filter((u: any) => u.success).length / categoryTools.length;
        const experienceBonus = Math.min(categoryTools.length * 2, 40);
        progress[skill] = Math.min(100, Math.floor(successRate * 60 + experienceBonus));
      } else {
        progress[skill] = 0;
      }
    });

    return progress;
  }

  // Smart Template Personalization
  static async getPersonalizedTemplates(userId: string): Promise<SmartTemplate[]> {
    try {
      // Get user's learning path and preferences
      const { data: learningPath } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Get user's project history
      const { data: projects } = await supabase
        .from('projects')
        .select('project_type, framework, features')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      // Generate personalized templates
      const templates = await this.generatePersonalizedTemplates(learningPath, projects || []);
      
      return templates;
    } catch (error) {
      console.error('Error getting personalized templates:', error);
      return [];
    }
  }

  private static async generatePersonalizedTemplates(learningPath: any, projects: any[]): Promise<SmartTemplate[]> {
    // AI-driven template personalization based on user data
    const templates: SmartTemplate[] = [];

    // Analyze user preferences
    const preferredFrameworks = this.extractPreferences(projects, 'framework');
    const preferredFeatures = this.extractPreferences(projects, 'features');
    const userLevel = learningPath?.current_level || 'beginner';

    // Generate templates based on preferences and skill level
    if (preferredFrameworks.includes('react')) {
      templates.push({
        id: 'personalized-react-app',
        name: 'Your Perfect React App',
        description: 'Customized React template based on your preferences',
        category: 'Web Application',
        adaptiveElements: {
          framework: 'react',
          styling: preferredFeatures.includes('tailwind') ? 'tailwind' : 'css-modules',
          stateManagement: userLevel === 'advanced' ? 'zustand' : 'useState',
          features: preferredFeatures.slice(0, 5)
        },
        personalizationFactors: ['previous projects', 'skill level', 'preferred features'],
        usageCount: 0,
        successRate: 0.95
      });
    }

    return templates;
  }

  private static extractPreferences(projects: any[], field: string): string[] {
    const preferences: any = {};
    
    projects.forEach(project => {
      const value = project[field];
      if (Array.isArray(value)) {
        value.forEach(v => {
          preferences[v] = (preferences[v] || 0) + 1;
        });
      } else if (value) {
        preferences[value] = (preferences[value] || 0) + 1;
      }
    });

    return Object.entries(preferences)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .map(([key]) => key);
  }
}
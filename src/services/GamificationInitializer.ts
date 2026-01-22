/**
 * Gamification System Initializer
 * Ensures the gamification system works in both online and offline modes
 */

import { GamificationService } from './GamificationService';
import { toast } from 'sonner';

export class GamificationInitializer {
  private static initialized = false;

  /**
   * Initialize the gamification system
   * This should be called once when the app starts
   */
  static async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Get or create user ID
      const userId = this.ensureUserId();
      
      // Initialize user stats (this will handle offline mode automatically)
      const userStats = await GamificationService.getUserStats(userId);
      
      if (userStats) {
        console.log('✅ Gamification system initialized successfully');
        console.log(`📊 User Level: ${userStats.level}, XP: ${userStats.total_xp}`);
        
        // Award welcome bonus for new users
        if (userStats.total_xp === 0 && userStats.level === 1) {
          await GamificationService.addXP(
            userId,
            50,
            'special',
            'Welcome to FlashFusion!',
            { first_time: true }
          );
        }
        
        // Record daily login
        await GamificationService.recordDailyLogin(userId);
        
      } else {
        console.warn('⚠️ Gamification system running in limited mode');
      }

    } catch (error) {
      console.error('❌ Failed to initialize gamification system:', error);
      // Don't show error toast - system will work in offline mode
    } finally {
      this.initialized = true;
    }
  }

  /**
   * Ensure user has a persistent ID
   */
  private static ensureUserId(): string {
    let userId = localStorage.getItem('ff_user_id');
    
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('ff_user_id', userId);
      localStorage.setItem('user_id', userId); // Backwards compatibility
      console.log('🆔 Created new user ID:', userId);
    }
    
    return userId;
  }

  /**
   * Test XP system with a sample award
   */
  static async testXPSystem(): Promise<boolean> {
    try {
      const userId = this.ensureUserId();
      const result = await GamificationService.addXP(
        userId,
        10,
        'tool_usage',
        'System test',
        { test: true }
      );
      
      return result !== null;
    } catch (error) {
      console.error('XP system test failed:', error);
      return false;
    }
  }

  /**
   * Award XP for common actions with error handling
   */
  static async awardXP(
    points: number, 
    action: string, 
    source: 'tool_usage' | 'project_completion' | 'achievement' | 'daily_streak' | 'collaboration' | 'special' = 'tool_usage',
    metadata: Record<string, any> = {}
  ): Promise<boolean> {
    try {
      const userId = this.ensureUserId();
      const result = await GamificationService.addXP(userId, points, source, action, metadata);
      return result !== null;
    } catch (error) {
      console.error('Failed to award XP:', error);
      return false;
    }
  }

  /**
   * Get current user stats with error handling
   */
  static async getCurrentStats() {
    try {
      const userId = this.ensureUserId();
      return await GamificationService.getUserStats(userId);
    } catch (error) {
      console.error('Failed to get user stats:', error);
      return null;
    }
  }

  /**
   * Check if the system is running in offline mode
   */
  static isOfflineMode(): boolean {
    try {
      const testKey = 'ff_offline_test';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return false; // LocalStorage is available
    } catch (error) {
      return true; // LocalStorage not available, fully offline
    }
  }
}

// Export convenience functions
export const initializeGamification = () => GamificationInitializer.initialize();
export const awardXP = (points: number, action: string, source?: any, metadata?: any) => 
  GamificationInitializer.awardXP(points, action, source, metadata);
export const getCurrentStats = () => GamificationInitializer.getCurrentStats();
export const testXPSystem = () => GamificationInitializer.testXPSystem();

export default GamificationInitializer;
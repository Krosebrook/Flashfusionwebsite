import { useState, useEffect } from 'react';
import { PageType } from '../types/core';

export function useAppData() {
  // Simplified mock data for debugging
  const [projects, setProjects] = useState<any[]>([]);
  const [dailyTasks, setDailyTasks] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>({ level: 1, xp: 0 });
  const [achievements, setAchievements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const refreshProjects = async () => {
    console.log('Refreshing projects...');
  };

  const awardXP = async (amount: number, reason: string, taskType?: string) => {
    console.log(`Awarding ${amount} XP for ${reason}`);
  };

  const trackToolUsage = (toolId: string) => {
    console.log(`Tool used: ${toolId}`);
  };

  const trackEvent = (event: string, data?: any) => {
    console.log(`Event tracked: ${event}`, data);
  };

  return {
    // State
    projects,
    dailyTasks,
    userStats,
    achievements,
    isLoading,
    user,
    isAuthenticated,
    
    // Actions
    refreshProjects,
    awardXP,
    trackToolUsage,
    trackEvent
  };
}

export function usePageNavigation() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  return {
    currentPage,
    setCurrentPage
  };
}
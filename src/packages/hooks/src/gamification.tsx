import React, { createContext, useContext, useState, useCallback } from 'react';

interface GamificationState {
  level: number;
  xp: number;
  xpToNext: number;
  achievements: Achievement[];
  streak: number;
  credits: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

interface GamificationContextType {
  state: GamificationState;
  addXP: (amount: number, reason?: string) => void;
  unlockAchievement: (achievementId: string) => void;
  addCredits: (amount: number) => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}

interface GamificationProviderProps {
  children: React.ReactNode;
}

export function GamificationProvider({ children }: GamificationProviderProps) {
  const [state, setState] = useState<GamificationState>({
    level: 1,
    xp: 0,
    xpToNext: 100,
    achievements: [],
    streak: 0,
    credits: 0
  });

  const addXP = useCallback((amount: number, reason?: string) => {
    setState(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      const xpInCurrentLevel = newXP % 100;
      const xpToNext = 100 - xpInCurrentLevel;

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNext
      };
    });
  }, []);

  const unlockAchievement = useCallback((achievementId: string) => {
    setState(prev => ({
      ...prev,
      achievements: [
        ...prev.achievements,
        {
          id: achievementId,
          name: `Achievement ${achievementId}`,
          description: 'Unlocked achievement',
          icon: '🏆',
          unlockedAt: new Date()
        }
      ]
    }));
  }, []);

  const addCredits = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      credits: prev.credits + amount
    }));
  }, []);

  const value = {
    state,
    addXP,
    unlockAchievement,
    addCredits
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}
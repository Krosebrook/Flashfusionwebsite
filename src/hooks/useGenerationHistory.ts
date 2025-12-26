/**
 * Custom hook for managing generation history
 * Provides localStorage-backed history with search and filtering
 */

import { useState, useEffect, useCallback } from 'react';
import type { GenerationResult } from './useAIGeneration';

const STORAGE_KEY = 'flashfusion_generation_history';
const MAX_HISTORY_SIZE = 50;

export interface GenerationHistoryItem extends GenerationResult {
  favorite?: boolean;
}

export function useGenerationHistory() {
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: GenerationHistoryItem[] = JSON.parse(stored);
        // Convert timestamp strings back to Date objects and validate structure
        const historyWithDates = parsed
          .filter((item): item is GenerationHistoryItem => 
            item && typeof item === 'object' && 'id' in item && 'timestamp' in item
          )
          .map((item) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          }));
        setHistory(historyWithDates);
      }
    } catch (error) {
      console.error('Failed to load generation history:', error);
      // Clear corrupted data
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch (error) {
        console.error('Failed to save generation history:', error);
        // Handle quota exceeded error specifically
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          console.warn('localStorage quota exceeded. Clearing old history...');
          // Keep only the most recent 10 items
          const reducedHistory = history.slice(0, 10);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(reducedHistory));
            setHistory(reducedHistory);
          } catch (retryError) {
            console.error('Failed to save even reduced history:', retryError);
          }
        }
      }
    }
  }, [history, isLoading]);

  const addToHistory = useCallback((result: GenerationResult) => {
    setHistory(prev => {
      const newHistory = [result, ...prev];
      // Keep only the most recent items
      return newHistory.slice(0, MAX_HISTORY_SIZE);
    });
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setHistory(prev =>
      prev.map(item =>
        item.id === id ? { ...item, favorite: !item.favorite } : item
      )
    );
  }, []);

  const getById = useCallback((id: string) => {
    return history.find(item => item.id === id);
  }, [history]);

  const filterByType = useCallback((type: string) => {
    return history.filter(item => item.type === type);
  }, [history]);

  const getFavorites = useCallback(() => {
    return history.filter(item => item.favorite);
  }, [history]);

  const searchHistory = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return history.filter(
      item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        item.prompt.toLowerCase().includes(lowerQuery)
    );
  }, [history]);

  return {
    history,
    isLoading,
    addToHistory,
    removeFromHistory,
    clearHistory,
    toggleFavorite,
    getById,
    filterByType,
    getFavorites,
    searchHistory,
  };
}

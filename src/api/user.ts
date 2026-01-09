/**
 * User API Service
 * Handles all user-related API operations with error handling and validation
 */

import type { User, UserPreferences } from '../types/core';

// API response wrapper type
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// File upload validation constraints
export const UPLOAD_CONSTRAINTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
};

/**
 * Validates file for profile picture upload
 * @param file - File to validate
 * @returns Validation result with error message if invalid
 */
export function validateProfilePicture(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > UPLOAD_CONSTRAINTS.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size must be less than ${UPLOAD_CONSTRAINTS.MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }

  // Check file type
  if (!UPLOAD_CONSTRAINTS.ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File type must be one of: ${UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Fetches user profile data
 * @param userId - User ID to fetch
 * @returns User profile data or error
 */
export async function fetchUserProfile(userId: string): Promise<ApiResponse<User>> {
  try {
    // TODO: Replace with actual API endpoint when backend is ready
    // For now, return mock data
    const mockUser: User = {
      id: userId,
      email: 'sarah.chen@example.com',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=150&h=150&fit=crop&crop=face',
      plan: 'pro',
      credits: 2400,
      joinedAt: '2024-01-15',
      lastActive: '2 hours ago',
      preferences: {
        theme: 'dark',
        language: 'en',
        timezone: 'UTC',
        notifications: {
          email: true,
          push: true,
          inApp: true,
          frequency: 'immediate',
          types: ['system', 'projects', 'collaboration'],
        },
        privacy: {
          profileVisibility: 'public',
          dataSharing: true,
          analytics: true,
        },
        accessibility: {
          reducedMotion: false,
          highContrast: false,
          fontSize: 'medium',
          screenReader: false,
        },
      },
      subscription: {
        id: 'sub-456',
        plan: 'FlashFusion Pro',
        status: 'active',
        currentPeriodEnd: '2024-04-15',
        features: ['Unlimited AI Generation', 'Advanced Analytics', 'Priority Support', 'Custom Branding'],
      },
    };

    return {
      data: mockUser,
      success: true,
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return {
      error: 'Failed to fetch user profile. Please try again.',
      success: false,
    };
  }
}

/**
 * Updates user profile data
 * @param userId - User ID to update
 * @param updates - Partial user data to update
 * @returns Updated user data or error
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<User>
): Promise<ApiResponse<User>> {
  try {
    // Validate required fields
    if (updates.email && !isValidEmail(updates.email)) {
      return {
        error: 'Invalid email address',
        success: false,
      };
    }

    // TODO: Replace with actual API call
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // For now, return the updates merged with current data
    const currentUser = await fetchUserProfile(userId);
    if (!currentUser.data) {
      throw new Error('User not found');
    }

    const updatedUser = { ...currentUser.data, ...updates };

    return {
      data: updatedUser,
      success: true,
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return {
      error: 'Failed to update user profile. Please try again.',
      success: false,
    };
  }
}

/**
 * Uploads profile picture with validation
 * @param userId - User ID
 * @param file - Image file to upload
 * @returns URL of uploaded image or error
 */
export async function uploadProfilePicture(
  userId: string,
  file: File
): Promise<ApiResponse<{ avatarUrl: string }>> {
  try {
    // Validate file
    const validation = validateProfilePicture(file);
    if (!validation.valid) {
      return {
        error: validation.error,
        success: false,
      };
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    // TODO: Replace with actual API endpoint
    // For now, create a local URL for preview
    const avatarUrl = URL.createObjectURL(file);

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      data: { avatarUrl },
      success: true,
    };
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return {
      error: 'Failed to upload profile picture. Please try again.',
      success: false,
    };
  }
}

/**
 * Updates user preferences
 * @param userId - User ID
 * @param preferences - User preferences to update
 * @returns Updated preferences or error
 */
export async function updateUserPreferences(
  userId: string,
  preferences: Partial<UserPreferences>
): Promise<ApiResponse<UserPreferences>> {
  try {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    // For now, return the preferences
    const currentUser = await fetchUserProfile(userId);
    if (!currentUser.data?.preferences) {
      throw new Error('User preferences not found');
    }

    const updatedPreferences = { ...currentUser.data.preferences, ...preferences };

    return {
      data: updatedPreferences,
      success: true,
    };
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return {
      error: 'Failed to update preferences. Please try again.',
      success: false,
    };
  }
}

/**
 * Exports user data in JSON format
 * @param userId - User ID
 * @returns User data as JSON or error
 */
export async function exportUserData(userId: string): Promise<ApiResponse<string>> {
  try {
    const userResponse = await fetchUserProfile(userId);
    if (!userResponse.data) {
      throw new Error('User not found');
    }

    const userData = JSON.stringify(userResponse.data, null, 2);
    const blob = new Blob([userData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `user-data-${userId}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return {
      data: 'Data exported successfully',
      success: true,
    };
  } catch (error) {
    console.error('Error exporting user data:', error);
    return {
      error: 'Failed to export user data. Please try again.',
      success: false,
    };
  }
}

// Helper function to validate email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

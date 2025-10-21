/**
 * Landing Page Toggle Component
 * Allows switching between the premium landing page and main application
 */

import React from 'react';
import { Button } from './button';
import { Eye, Settings } from 'lucide-react';

interface LandingToggleProps {
  className?: string;
}

export function LandingToggle({ className = '' }: LandingToggleProps) {
  const toggleLandingPage = () => {
    const currentUrl = new URL(window.location.href);
    
    if (currentUrl.searchParams.has('landing')) {
      // Remove landing parameter
      currentUrl.searchParams.delete('landing');
    } else {
      // Add landing parameter
      currentUrl.searchParams.set('landing', 'true');
    }
    
    window.location.href = currentUrl.toString();
  };

  const isLandingMode = window.location.search.includes('landing=true');

  return (
    <Button
      onClick={toggleLandingPage}
      variant="outline"
      size="sm"
      className={`text-xs ${className}`}
    >
      {isLandingMode ? (
        <>
          <Settings className="w-4 h-4 mr-2" />
          View App
        </>
      ) : (
        <>
          <Eye className="w-4 h-4 mr-2" />
          View Landing
        </>
      )}
    </Button>
  );
}

export default LandingToggle;
/**
 * GitHub Assistant Page
 * Main page for the GitHub Assistant Agent feature
 */

import React from 'react';
import GitHubAssistantInterface from '../github/GitHubAssistantInterface';

export const GitHubAssistantPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <GitHubAssistantInterface />
    </div>
  );
};

export default GitHubAssistantPage;

export const deploymentStatuses = [
  { id: 'deploying', name: 'Deploying', color: 'text-yellow-500' },
  { id: 'deployed', name: 'Deployed', color: 'text-green-500' },
  { id: 'failed', name: 'Failed', color: 'text-destructive' },
  { id: 'paused', name: 'Paused', color: 'text-muted-foreground' }
] as const;

export const deploymentBenefits = [
  {
    icon: '⚡',
    title: 'One-Click Deploy',
    description: 'Deploy your applications instantly with zero configuration'
  },
  {
    icon: '🔄',
    title: 'Auto-Deploy',
    description: 'Automatically deploy when you push changes to your repository'
  },
  {
    icon: '📊',
    title: 'Real-Time Monitoring',
    description: 'Track deployment status and performance metrics live'
  },
  {
    icon: '🌍',
    title: 'Global CDN',
    description: 'Serve your applications from edge locations worldwide'
  },
  {
    icon: '🔒',
    title: 'Secure by Default',
    description: 'HTTPS, environment variables, and secure build processes'
  },
  {
    icon: '📈',
    title: 'Analytics',
    description: 'Built-in analytics and performance insights'
  }
];

export const quickActions = [
  { id: 'redeploy', name: 'Redeploy', icon: '🔄' },
  { id: 'logs', name: 'View Logs', icon: '📋' },
  { id: 'settings', name: 'Settings', icon: '⚙️' },
  { id: 'delete', name: 'Delete', icon: '🗑️' }
];
/**
 * GitHub Repositories Data
 * Repository information for Krosebrook's GitHub projects
 */

export interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string;
  htmlUrl: string;
  language: string;
  stargazersCount: number;
  forksCount: number;
  openIssuesCount: number;
  updatedAt: string;
  createdAt: string;
  isPrivate: boolean;
  isFork: boolean;
  isArchived: boolean;
  defaultBranch: string;
  topics?: string[];
  category?: 'ai-tools' | 'music' | 'productivity' | 'automation' | 'ui-framework' | 'development' | 'other';
}

export const featuredRepositories: Repository[] = [
  {
    id: 1124432946,
    name: 'HarmoniQ-Music-Theory',
    fullName: 'Krosebrook/HarmoniQ-Music-Theory',
    description: 'Music Theory Platform',
    htmlUrl: 'https://github.com/Krosebrook/HarmoniQ-Music-Theory',
    language: 'TypeScript',
    stargazersCount: 0,
    forksCount: 0,
    openIssuesCount: 0,
    updatedAt: '2025-12-29T15:49:40Z',
    createdAt: '2025-12-29T02:37:57Z',
    isPrivate: false,
    isFork: false,
    isArchived: false,
    defaultBranch: 'main',
    category: 'music',
    topics: ['music', 'theory', 'education']
  },
  {
    id: 1123763795,
    name: 'Agent-K',
    fullName: 'Krosebrook/Agent-K',
    description: 'Tessa Iteration',
    htmlUrl: 'https://github.com/Krosebrook/Agent-K',
    language: 'TypeScript',
    stargazersCount: 0,
    forksCount: 0,
    openIssuesCount: 0,
    updatedAt: '2025-12-29T15:49:37Z',
    createdAt: '2025-12-27T15:14:16Z',
    isPrivate: false,
    isFork: false,
    isArchived: false,
    defaultBranch: 'main',
    category: 'ai-tools',
    topics: ['ai', 'agent', 'automation']
  },
  {
    id: 1116528805,
    name: 'INTincRoadmap',
    fullName: 'Krosebrook/INTincRoadmap',
    description: 'INT Inc Development Roadmap',
    htmlUrl: 'https://github.com/Krosebrook/INTincRoadmap',
    language: 'TypeScript',
    stargazersCount: 0,
    forksCount: 0,
    openIssuesCount: 0,
    updatedAt: '2025-12-29T15:49:35Z',
    createdAt: '2025-12-15T02:26:16Z',
    isPrivate: false,
    isFork: false,
    isArchived: false,
    defaultBranch: 'main',
    category: 'productivity',
    topics: ['roadmap', 'planning', 'project-management']
  },
  {
    id: 1106698889,
    name: 'PoDGen',
    fullName: 'Krosebrook/PoDGen',
    description: 'PoD Generator - Print on Demand Design Tool',
    htmlUrl: 'https://github.com/Krosebrook/PoDGen',
    language: 'TypeScript',
    stargazersCount: 0,
    forksCount: 0,
    openIssuesCount: 1,
    updatedAt: '2025-12-29T15:48:58Z',
    createdAt: '2025-11-29T19:06:13Z',
    isPrivate: false,
    isFork: false,
    isArchived: false,
    defaultBranch: 'main',
    category: 'productivity',
    topics: ['print-on-demand', 'design', 'generator']
  },
  {
    id: 1123471913,
    name: 'AetherAgentsOS',
    fullName: 'Krosebrook/AetherAgentsOS',
    description: 'AgentsOS - Multi-Agent Operating System',
    htmlUrl: 'https://github.com/Krosebrook/AetherAgentsOS',
    language: 'TypeScript',
    stargazersCount: 0,
    forksCount: 0,
    openIssuesCount: 0,
    updatedAt: '2025-12-29T14:39:19Z',
    createdAt: '2025-12-27T00:13:34Z',
    isPrivate: false,
    isFork: false,
    isArchived: false,
    defaultBranch: 'main',
    category: 'ai-tools',
    topics: ['ai', 'agents', 'os', 'multi-agent']
  },
  {
    id: 1122922847,
    name: 'Metropolisv2.0',
    fullName: 'Krosebrook/Metropolisv2.0',
    description: 'Metropolis - City Building Simulation',
    htmlUrl: 'https://github.com/Krosebrook/Metropolisv2.0',
    language: 'TypeScript',
    stargazersCount: 0,
    forksCount: 0,
    openIssuesCount: 0,
    updatedAt: '2025-12-29T14:39:16Z',
    createdAt: '2025-12-25T20:36:07Z',
    isPrivate: false,
    isFork: false,
    isArchived: false,
    defaultBranch: 'main',
    category: 'development',
    topics: ['game', 'simulation', 'city-builder']
  },
  {
    id: 1116528875,
    name: 'Bringittolife',
    fullName: 'Krosebrook/Bringittolife',
    description: 'Bring It To Life - Idea Implementation Platform',
    htmlUrl: 'https://github.com/Krosebrook/Bringittolife',
    language: 'TypeScript',
    stargazersCount: 0,
    forksCount: 0,
    openIssuesCount: 0,
    updatedAt: '2025-12-29T14:20:41Z',
    createdAt: '2025-12-15T02:26:27Z',
    isPrivate: false,
    isFork: false,
    isArchived: false,
    defaultBranch: 'main',
    category: 'productivity',
    topics: ['ideas', 'implementation', 'productivity']
  },
  {
    id: 1124008743,
    name: 'AutoArchtect',
    fullName: 'Krosebrook/AutoArchtect',
    description: 'AutomationCreator - Automation Architecture Tool',
    htmlUrl: 'https://github.com/Krosebrook/AutoArchtect',
    language: 'TypeScript',
    stargazersCount: 0,
    forksCount: 0,
    openIssuesCount: 0,
    updatedAt: '2025-12-29T14:20:12Z',
    createdAt: '2025-12-28T05:48:04Z',
    isPrivate: false,
    isFork: false,
    isArchived: false,
    defaultBranch: 'main',
    category: 'automation',
    topics: ['automation', 'architecture', 'workflow']
  },
  {
    id: 1123763877,
    name: 'Flash-UI',
    fullName: 'Krosebrook/Flash-UI',
    description: 'Flash UI - Modern UI Component Library',
    htmlUrl: 'https://github.com/Krosebrook/Flash-UI',
    language: 'TypeScript',
    stargazersCount: 0,
    forksCount: 0,
    openIssuesCount: 0,
    updatedAt: '2025-12-29T14:19:54Z',
    createdAt: '2025-12-27T15:14:30Z',
    isPrivate: false,
    isFork: false,
    isArchived: false,
    defaultBranch: 'main',
    category: 'ui-framework',
    topics: ['ui', 'components', 'library', 'react']
  },
  {
    id: 1123020842,
    name: 'LuminaJournal',
    fullName: 'Krosebrook/LuminaJournal',
    description: 'JournalingApp - Personal Journaling Platform',
    htmlUrl: 'https://github.com/Krosebrook/LuminaJournal',
    language: 'TypeScript',
    stargazersCount: 0,
    forksCount: 0,
    openIssuesCount: 0,
    updatedAt: '2025-12-29T02:34:32Z',
    createdAt: '2025-12-26T03:27:07Z',
    isPrivate: false,
    isFork: false,
    isArchived: false,
    defaultBranch: 'main',
    category: 'productivity',
    topics: ['journaling', 'personal', 'wellness']
  }
];

export const getCategoryColor = (category?: Repository['category']): string => {
  switch (category) {
    case 'ai-tools':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    case 'music':
      return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
    case 'productivity':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'automation':
      return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    case 'ui-framework':
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    case 'development':
      return 'bg-green-500/10 text-green-400 border-green-500/20';
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  }
};

export const getCategoryLabel = (category?: Repository['category']): string => {
  switch (category) {
    case 'ai-tools':
      return 'AI Tools';
    case 'music':
      return 'Music';
    case 'productivity':
      return 'Productivity';
    case 'automation':
      return 'Automation';
    case 'ui-framework':
      return 'UI Framework';
    case 'development':
      return 'Development';
    default:
      return 'Other';
  }
};

export const getRepositoriesByCategory = (category: Repository['category']) => {
  return featuredRepositories.filter(repo => repo.category === category);
};

export const getAllCategories = (): Repository['category'][] => {
  const categories: Repository['category'][] = [];
  featuredRepositories.forEach(repo => {
    if (repo.category) {
      let found = false;
      for (let i = 0; i < categories.length; i++) {
        if (categories[i] === repo.category) {
          found = true;
          break;
        }
      }
      if (!found) {
        categories.push(repo.category);
      }
    }
  });
  return categories;
};

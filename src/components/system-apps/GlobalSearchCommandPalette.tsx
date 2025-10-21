import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  Search, Command, ArrowRight, Clock, Star, Zap, 
  Code, Palette, Settings, Users, FileText, Database,
  Rocket, Shield, BarChart, Package, Globe, GitBranch,
  Play, Download, Copy, Share, Plus, Filter, X
} from 'lucide-react';
import { toast } from 'sonner';

interface SearchResult {
  id: string;
  type: 'tool' | 'project' | 'template' | 'documentation' | 'team' | 'command' | 'integration';
  title: string;
  description: string;
  category?: string;
  icon: string;
  url?: string;
  action?: () => void;
  shortcut?: string;
  metadata?: Record<string, any>;
  score?: number;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  shortcut: string;
  action: () => void;
  category: string;
}

interface GlobalSearchCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (url: string) => void;
}

// Mock search data - replace with real search API
const mockSearchData: SearchResult[] = [
  // Tools
  {
    id: 'code-generator',
    type: 'tool',
    title: 'AI Code Generator',
    description: 'Generate production-ready code in any language',
    category: 'Generation',
    icon: '🤖',
    url: '/tools/code-generator',
    score: 95
  },
  {
    id: 'full-stack-builder',
    type: 'tool',
    title: 'Full-Stack App Builder',
    description: 'Build complete applications with frontend, backend, and database',
    category: 'Generation',
    icon: '🏗️',
    url: '/tools/full-stack-builder',
    score: 92
  },
  {
    id: 'logo-generator',
    type: 'tool',
    title: 'AI Logo Generator',
    description: 'Create professional logos with AI-powered design',
    category: 'Design',
    icon: '🎨',
    url: '/tools/logo-generator',
    score: 88
  },
  
  // Projects
  {
    id: 'ecommerce-project',
    type: 'project',
    title: 'E-commerce Dashboard',
    description: 'Next.js e-commerce platform with Stripe integration',
    category: 'Active Projects',
    icon: '🛒',
    url: '/projects/ecommerce-dashboard',
    score: 90
  },
  {
    id: 'blog-project',
    type: 'project',
    title: 'Personal Blog',
    description: 'Gatsby blog with CMS integration',
    category: 'Active Projects',
    icon: '📝',
    url: '/projects/personal-blog',
    score: 85
  },
  
  // Templates
  {
    id: 'react-starter',
    type: 'template',
    title: 'React Starter Template',
    description: 'TypeScript + Tailwind + Vite starter template',
    category: 'Templates',
    icon: '⚛️',
    url: '/templates/react-starter',
    score: 87
  },
  {
    id: 'saas-template',
    type: 'template',
    title: 'SaaS Landing Page',
    description: 'Complete SaaS marketing site template',
    category: 'Templates',
    icon: '🚀',
    url: '/templates/saas-landing',
    score: 89
  },
  
  // Documentation
  {
    id: 'getting-started',
    type: 'documentation',
    title: 'Getting Started Guide',
    description: 'Learn how to use FlashFusion effectively',
    category: 'Documentation',
    icon: '📚',
    url: '/docs/getting-started',
    score: 82
  },
  {
    id: 'api-reference',
    type: 'documentation',
    title: 'API Reference',
    description: 'Complete API documentation and examples',
    category: 'Documentation',
    icon: '🔧',
    url: '/docs/api-reference',
    score: 80
  },
  
  // Team
  {
    id: 'team-workspace',
    type: 'team',
    title: 'Development Team',
    description: '5 members • 12 active projects',
    category: 'Team',
    icon: '👥',
    url: '/team/development',
    score: 86
  },
  
  // Integrations
  {
    id: 'github-integration',
    type: 'integration',
    title: 'GitHub Integration',
    description: 'Connect your GitHub repositories',
    category: 'Integrations',
    icon: '🔗',
    url: '/integrations/github',
    score: 84
  }
];

const quickActions: QuickAction[] = [
  {
    id: 'new-project',
    title: 'Create New Project',
    description: 'Start a new development project',
    icon: '➕',
    shortcut: 'Cmd+N',
    action: () => toast.success('Creating new project...'),
    category: 'Creation'
  },
  {
    id: 'generate-code',
    title: 'Generate Code',
    description: 'Open AI code generator',
    icon: '🤖',
    shortcut: 'Cmd+G',
    action: () => toast.success('Opening code generator...'),
    category: 'Generation'
  },
  {
    id: 'deploy-project',
    title: 'Deploy Project',
    description: 'Deploy current project to production',
    icon: '🚀',
    shortcut: 'Cmd+D',
    action: () => toast.success('Starting deployment...'),
    category: 'Deployment'
  },
  {
    id: 'open-settings',
    title: 'Open Settings',
    description: 'Configure your preferences',
    icon: '⚙️',
    shortcut: 'Cmd+,',
    action: () => toast.success('Opening settings...'),
    category: 'Navigation'
  },
  {
    id: 'view-analytics',
    title: 'View Analytics',
    description: 'Check your usage analytics',
    icon: '📊',
    shortcut: 'Cmd+A',
    action: () => toast.success('Opening analytics...'),
    category: 'Analytics'
  },
  {
    id: 'invite-team',
    title: 'Invite Team Member',
    description: 'Add someone to your workspace',
    icon: '👥',
    shortcut: 'Cmd+I',
    action: () => toast.success('Opening team invite...'),
    category: 'Team'
  }
];

const recentSearches = ['React component', 'API generator', 'deployment guide', 'team settings'];
const popularSearches = ['code generator', 'logo maker', 'full stack builder', 'documentation'];

export function GlobalSearchCommandPalette({ 
  isOpen, 
  onClose, 
  onNavigate 
}: GlobalSearchCommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showingCommands, setShowingCommands] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Search functionality with fuzzy matching
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowingCommands(false);
      return;
    }

    // Check if it's a command (starts with >)
    if (searchQuery.startsWith('>')) {
      setShowingCommands(true);
      const commandQuery = searchQuery.slice(1).toLowerCase();
      const filteredActions = quickActions.filter(action =>
        action.title.toLowerCase().includes(commandQuery) ||
        action.description.toLowerCase().includes(commandQuery) ||
        action.category.toLowerCase().includes(commandQuery)
      );
      
      setSearchResults(filteredActions.map(action => ({
        id: action.id,
        type: 'command' as const,
        title: action.title,
        description: action.description,
        icon: action.icon,
        shortcut: action.shortcut,
        action: action.action,
        category: action.category
      })));
      return;
    }

    setShowingCommands(false);

    // Fuzzy search implementation
    const searchTerms = searchQuery.toLowerCase().split(' ').filter(Boolean);
    
    const results = mockSearchData
      .map(item => {
        let score = 0;
        const titleLower = item.title.toLowerCase();
        const descriptionLower = item.description.toLowerCase();
        const categoryLower = item.category?.toLowerCase() || '';

        // Exact matches get highest score
        if (titleLower.includes(searchQuery.toLowerCase())) {
          score += 100;
        }

        // Partial matches
        searchTerms.forEach(term => {
          if (titleLower.includes(term)) score += 50;
          if (descriptionLower.includes(term)) score += 25;
          if (categoryLower.includes(term)) score += 15;
        });

        // Boost score for popular items
        score += item.score || 0;

        return { ...item, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 8);

    setSearchResults(results);
    setSelectedIndex(0);
  }, []);

  // Handle search input
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 150);

    return () => clearTimeout(debounceTimer);
  }, [query, performSearch]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < Math.max(searchResults.length - 1, quickActions.length - 1) ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : Math.max(searchResults.length - 1, quickActions.length - 1)
          );
          break;
        case 'Enter':
          e.preventDefault();
          handleSelection();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, searchResults.length, selectedIndex]);

  const handleSelection = useCallback(() => {
    if (query.trim() === '') {
      // Handle quick actions when no query
      if (selectedIndex < quickActions.length) {
        quickActions[selectedIndex].action();
        onClose();
      }
    } else if (searchResults.length > 0) {
      const selected = searchResults[selectedIndex];
      if (selected.action) {
        selected.action();
      } else if (selected.url && onNavigate) {
        onNavigate(selected.url);
      }
      onClose();
    }
  }, [query, searchResults, selectedIndex, onClose, onNavigate]);

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'tool': return <Zap className="w-4 h-4 text-primary" />;
      case 'project': return <Code className="w-4 h-4 text-secondary" />;
      case 'template': return <Package className="w-4 h-4 text-accent" />;
      case 'documentation': return <FileText className="w-4 h-4 text-info" />;
      case 'team': return <Users className="w-4 h-4 text-warning" />;
      case 'command': return <Command className="w-4 h-4 text-success" />;
      case 'integration': return <Globe className="w-4 h-4 text-purple-500" />;
      default: return <Search className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const handleQuickSearch = useCallback((searchTerm: string) => {
    setQuery(searchTerm);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4 bg-card border border-border rounded-lg shadow-2xl ff-fade-in-up">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <Input
            ref={inputRef}
            placeholder="Search tools, projects, docs... or type '>' for commands"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 bg-transparent text-base ff-focus-ring flex-1"
          />
          {query && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setQuery('')}
              className="flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <Badge variant="outline" className="text-xs flex-shrink-0">
            Esc to close
          </Badge>
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() === '' ? (
            // Show quick actions and suggestions when no query
            <div className="p-4 space-y-6">
              {/* Quick Actions */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Quick Actions
                </h3>
                <div className="space-y-1">
                  {quickActions.slice(0, 6).map((action, index) => (
                    <button
                      key={action.id}
                      onClick={() => {
                        action.action();
                        onClose();
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ff-hover-scale ${
                        selectedIndex === index ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                      }`}
                    >
                      <span className="text-lg">{action.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{action.title}</p>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {action.shortcut}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Recent Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <Button
                      key={term}
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickSearch(term)}
                      className="text-xs ff-hover-scale"
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Popular Searches */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Popular Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <Button
                      key={term}
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickSearch(term)}
                      className="text-xs ff-hover-scale"
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            // Show search results
            <div className="p-2">
              {searchResults.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => {
                    if (result.action) {
                      result.action();
                    } else if (result.url && onNavigate) {
                      onNavigate(result.url);
                    }
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ff-hover-scale ${
                    selectedIndex === index ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {getTypeIcon(result.type)}
                    <span className="text-lg">{result.icon}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium truncate">{result.title}</p>
                      {result.category && (
                        <Badge variant="outline" className="text-xs">
                          {result.category}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{result.description}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {result.shortcut && (
                      <Badge variant="outline" className="text-xs">
                        {result.shortcut}
                      </Badge>
                    )}
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            // No results found
            <div className="p-8 text-center">
              <Search className="w-8 h-8 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground mb-2">No results found for "{query}"</p>
              <p className="text-xs text-muted-foreground">
                Try searching for tools, projects, or type '>' for commands
              </p>
            </div>
          )}
        </div>

        {/* Footer with tips */}
        <div className="p-3 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd>
                Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Esc</kbd>
                Close
              </span>
            </div>
            <span>Type '>' for commands • Ctrl+K to open</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GlobalSearchCommandPalette;
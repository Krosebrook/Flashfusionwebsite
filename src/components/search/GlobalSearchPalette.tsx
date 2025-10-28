import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Search, 
  Command,
  ArrowRight,
  File,
  Folder,
  Settings,
  User,
  Zap,
  Globe,
  Code,
  Palette,
  Database,
  Clock,
  Star,
  Filter,
  ChevronRight,
  Keyboard,
  BookOpen,
  Play,
  Plus,
  Copy,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { SearchResult, Command as CommandType } from '../../types/core';

interface SearchCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  results: SearchResult[];
}

export default function GlobalSearchPalette() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('search');
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [commands, setCommands] = useState<CommandType[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isCommandMode, setIsCommandMode] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize data
  useEffect(() => {
    const mockResults: SearchResult[] = [
      {
        id: 'project-1',
        type: 'project',
        title: 'Creator Commerce Platform',
        description: 'E-commerce platform for content creators with AI-powered product generation',
        url: '/projects/creator-commerce',
        metadata: { framework: 'React', status: 'active' },
        score: 0.95
      },
      {
        id: 'tool-1',
        type: 'tool',
        title: 'AI Content Generator',
        description: 'Generate high-quality content using advanced AI models',
        url: '/tools/ai-content-generator',
        metadata: { category: 'AI Tools', pricing: 'pro' },
        score: 0.92
      },
      {
        id: 'template-1',
        type: 'template',
        title: 'SaaS Landing Page',
        description: 'Modern landing page template for SaaS products',
        url: '/templates/saas-landing',
        metadata: { framework: 'Next.js', complexity: 'intermediate' },
        score: 0.88
      },
      {
        id: 'doc-1',
        type: 'documentation',
        title: 'Getting Started Guide',
        description: 'Complete guide to building your first FlashFusion application',
        url: '/docs/getting-started',
        metadata: { category: 'Documentation', updated: '2024-03-20' },
        score: 0.85
      },
      {
        id: 'user-1',
        type: 'user',
        title: 'Sarah Chen',
        description: 'Product Designer at FlashFusion',
        url: '/users/sarah-chen',
        metadata: { role: 'team_member', department: 'Design' },
        score: 0.82
      }
    ];

    const mockCommands: CommandType[] = [
      {
        id: 'create-project',
        label: 'Create New Project',
        description: 'Start a new FlashFusion project',
        shortcut: '⌘+N',
        category: 'Actions',
        action: () => console.log('Creating new project'),
        icon: 'Plus'
      },
      {
        id: 'open-settings',
        label: 'Open Settings',
        description: 'Access application settings',
        shortcut: '⌘+,',
        category: 'Navigation',
        action: () => console.log('Opening settings'),
        icon: 'Settings'
      },
      {
        id: 'toggle-theme',
        label: 'Toggle Theme',
        description: 'Switch between light and dark theme',
        shortcut: '⌘+D',
        category: 'Preferences',
        action: () => console.log('Toggling theme'),
        icon: 'Palette'
      },
      {
        id: 'run-validation',
        label: 'Run Validation',
        description: 'Validate current project',
        shortcut: '⌘+R',
        category: 'Tools',
        action: () => console.log('Running validation'),
        icon: 'Zap'
      },
      {
        id: 'open-docs',
        label: 'Open Documentation',
        description: 'View FlashFusion documentation',
        shortcut: '⌘+?',
        category: 'Help',
        action: () => console.log('Opening docs'),
        icon: 'BookOpen'
      }
    ];

    setSearchResults(mockResults);
    setCommands(mockCommands);
    setRecentSearches(['creator commerce', 'ai tools', 'landing page', 'settings']);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === '>') {
        setIsCommandMode(true);
      }
      if (e.key === 'Escape') {
        setIsCommandMode(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <Folder className="w-4 h-4 text-blue-500" />;
      case 'tool':
        return <Zap className="w-4 h-4 text-purple-500" />;
      case 'template':
        return <File className="w-4 h-4 text-green-500" />;
      case 'documentation':
        return <BookOpen className="w-4 h-4 text-orange-500" />;
      case 'user':
        return <User className="w-4 h-4 text-pink-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCommandIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Plus':
        return <Plus className="w-4 h-4" />;
      case 'Settings':
        return <Settings className="w-4 h-4" />;
      case 'Palette':
        return <Palette className="w-4 h-4" />;
      case 'Zap':
        return <Zap className="w-4 h-4" />;
      case 'BookOpen':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <Command className="w-4 h-4" />;
    }
  };

  const categorizeResults = (): SearchCategory[] => {
    const categories: Record<string, SearchCategory> = {
      projects: {
        id: 'projects',
        name: 'Projects',
        icon: Folder,
        color: 'text-blue-500',
        results: []
      },
      tools: {
        id: 'tools',
        name: 'Tools',
        icon: Zap,
        color: 'text-purple-500',
        results: []
      },
      templates: {
        id: 'templates',
        name: 'Templates',
        icon: File,
        color: 'text-green-500',
        results: []
      },
      docs: {
        id: 'docs',
        name: 'Documentation',
        icon: BookOpen,
        color: 'text-orange-500',
        results: []
      },
      users: {
        id: 'users',
        name: 'People',
        icon: User,
        color: 'text-pink-500',
        results: []
      }
    };

    const filteredResults = searchResults.filter(result =>
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filteredResults.forEach(result => {
      const categoryKey = result.type === 'documentation' ? 'docs' : `${result.type}s`;
      if (categories[categoryKey]) {
        categories[categoryKey].results.push(result);
      }
    });

    return Object.values(categories).filter(category => category.results.length > 0);
  };

  const filteredCommands = commands.filter(command =>
    command.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    command.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-2">
          <Search className="w-8 h-8 text-primary" />
          <h1 className="ff-text-gradient">Global Search & Command Palette</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Instantly find projects, tools, templates, documentation, and execute commands across your entire FlashFusion workspace.
        </p>
      </motion.div>

      {/* Search Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              {isCommandMode && (
                <Command className="absolute left-9 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary" />
              )}
              <Input
                ref={searchInputRef}
                placeholder={isCommandMode ? "Type a command..." : "Search projects, tools, templates, docs... (⌘+K)"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 h-12 text-lg border-2 border-primary/20 focus:border-primary"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  <Keyboard className="w-3 h-3 mr-1" />
                  ⌘+K
                </Badge>
              </div>
            </div>

            {searchQuery && (
              <div className="mt-4 flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Search in:</span>
                <Button
                  variant={isCommandMode ? "ghost" : "secondary"}
                  size="sm"
                  onClick={() => setIsCommandMode(false)}
                >
                  Content
                </Button>
                <Button
                  variant={isCommandMode ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setIsCommandMode(true)}
                >
                  Commands
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Search Results or Commands */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {!searchQuery ? (
          // Recent Searches and Quick Actions
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Recent Searches</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setSearchQuery(search)}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    {search}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {commands.slice(0, 4).map((command) => (
                  <Button
                    key={command.id}
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={command.action}
                  >
                    <div className="flex items-center space-x-2">
                      {getCommandIcon(command.icon)}
                      <span>{command.label}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {command.shortcut}
                    </Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        ) : isCommandMode ? (
          // Commands View
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Command className="w-5 h-5" />
                <span>Commands</span>
                <Badge variant="outline">{filteredCommands.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredCommands.length === 0 ? (
                  <div className="text-center py-8">
                    <Command className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No commands found</p>
                  </div>
                ) : (
                  filteredCommands.map((command, index) => (
                    <motion.div
                      key={command.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-4 h-auto"
                        onClick={command.action}
                      >
                        <div className="flex items-center space-x-3 text-left">
                          {getCommandIcon(command.icon)}
                          <div>
                            <p className="font-medium">{command.label}</p>
                            <p className="text-sm text-muted-foreground">{command.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {command.category}
                          </Badge>
                          {command.shortcut && (
                            <Badge variant="secondary" className="text-xs">
                              {command.shortcut}
                            </Badge>
                          )}
                        </div>
                      </Button>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          // Search Results View
          <div className="space-y-6">
            {categorizeResults().length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or browse our recent content
                  </p>
                </CardContent>
              </Card>
            ) : (
              categorizeResults().map((category, categoryIndex) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: categoryIndex * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <category.icon className={`w-5 h-5 ${category.color}`} />
                        <span>{category.name}</span>
                        <Badge variant="outline">{category.results.length}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {category.results.map((result, index) => (
                          <motion.div
                            key={result.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Button
                              variant="ghost"
                              className="w-full justify-between p-4 h-auto"
                              onClick={() => setSelectedResult(result)}
                            >
                              <div className="flex items-start space-x-3 text-left">
                                {getResultIcon(result.type)}
                                <div className="flex-1">
                                  <p className="font-medium">{result.title}</p>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {result.description}
                                  </p>
                                  {result.metadata && (
                                    <div className="flex items-center space-x-2 mt-2">
                                      {Object.entries(result.metadata).slice(0, 2).map(([key, value], idx) => (
                                        <Badge key={idx} variant="outline" className="text-xs">
                                          {key}: {String(value)}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary" className="text-xs">
                                  {Math.round(result.score * 100)}% match
                                </Badge>
                                <ChevronRight className="w-4 h-4" />
                              </div>
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        )}
      </motion.div>

      {/* Keyboard Shortcuts Help */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Keyboard className="w-5 h-5" />
              <span>Keyboard Shortcuts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: '⌘+K', desc: 'Open search' },
                { key: '⌘+N', desc: 'New project' },
                { key: '⌘+,', desc: 'Settings' },
                { key: '⌘+D', desc: 'Toggle theme' },
                { key: '⌘+R', desc: 'Run validation' },
                { key: '⌘+?', desc: 'Help docs' }
              ].map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                  <span className="text-sm">{shortcut.desc}</span>
                  <Badge variant="outline" className="text-xs font-mono">
                    {shortcut.key}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
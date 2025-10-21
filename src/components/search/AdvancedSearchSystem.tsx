import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Clock, 
  Star, 
  Zap, 
  Code, 
  Palette, 
  ShoppingCart,
  FileText,
  Smartphone,
  Rocket,
  Brain,
  BarChart3,
  X,
  ArrowRight,
  Sparkles,
  TrendingUp,
  History,
  Bookmark,
  Eye,
  Download,
  Share,
  Command,
  Mic,
  MicOff,
  Loader2,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'tool' | 'feature' | 'template' | 'documentation' | 'tutorial' | 'integration';
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  tags: string[];
  rating: number;
  popularity: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  preview?: string;
  metadata: {
    lastUpdated: string;
    version?: string;
    downloads?: number;
    views?: number;
    bookmarks?: number;
  };
  relevanceScore: number;
  highlighted?: {
    title?: string;
    description?: string;
    content?: string;
  };
}

interface SearchFilters {
  type: string[];
  category: string[];
  difficulty: string[];
  rating: [number, number];
  tags: string[];
  dateRange: 'all' | 'week' | 'month' | 'quarter' | 'year';
  sortBy: 'relevance' | 'popularity' | 'rating' | 'recent' | 'alphabetical';
  sortOrder: 'asc' | 'desc';
}

interface AdvancedSearchSystemProps {
  placeholder?: string;
  initialQuery?: string;
  onResultSelect?: (result: SearchResult) => void;
  showFilters?: boolean;
  compact?: boolean;
  maxResults?: number;
  enableVoiceSearch?: boolean;
  enableAISearch?: boolean;
  recentSearches?: string[];
  popularSearches?: string[];
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    type: 'tool',
    title: 'Full-Stack App Builder',
    description: 'Generate complete web applications with AI-powered code generation across 15+ frameworks',
    category: 'Development',
    subcategory: 'Code Generation',
    tags: ['react', 'nextjs', 'vue', 'angular', 'fullstack', 'ai'],
    rating: 4.9,
    popularity: 95,
    difficulty: 'intermediate',
    estimatedTime: '30-60 min',
    url: '/tools/full-stack-builder',
    icon: Code,
    preview: 'Create production-ready applications with database, authentication, and deployment...',
    metadata: {
      lastUpdated: '2024-01-15',
      version: '2.1.0',
      downloads: 12543,
      views: 45231,
      bookmarks: 1205
    },
    relevanceScore: 98
  },
  {
    id: '2',
    type: 'tool',
    title: 'Multi-Agent AI Orchestration',
    description: 'Coordinate multiple AI agents for complex workflows and automation',
    category: 'AI & Automation',
    subcategory: 'Agent Systems',
    tags: ['ai', 'agents', 'orchestration', 'automation', 'workflow'],
    rating: 4.8,
    popularity: 88,
    difficulty: 'advanced',
    estimatedTime: '45-90 min',
    url: '/multi-agent-orchestration',
    icon: Brain,
    preview: 'Advanced AI agent coordination with real-time collaboration and task distribution...',
    metadata: {
      lastUpdated: '2024-01-10',
      version: '1.5.0',
      downloads: 8921,
      views: 32145,
      bookmarks: 892
    },
    relevanceScore: 92
  },
  {
    id: '3',
    type: 'feature',
    title: 'Repository Integration',
    description: 'Connect GitHub, GitLab, and Bitbucket repositories for context-aware AI generation',
    category: 'Development',
    subcategory: 'Version Control',
    tags: ['github', 'gitlab', 'bitbucket', 'integration', 'context'],
    rating: 4.7,
    popularity: 85,
    difficulty: 'beginner',
    estimatedTime: '15-30 min',
    url: '/settings#repository',
    icon: Zap,
    preview: 'Seamless integration with popular Git platforms for enhanced code analysis...',
    metadata: {
      lastUpdated: '2024-01-12',
      views: 28943,
      bookmarks: 675
    },
    relevanceScore: 87
  },
  {
    id: '4',
    type: 'tool',
    title: 'E-commerce Store Generator',
    description: 'Create fully functional online stores with payment processing and inventory management',
    category: 'E-commerce',
    subcategory: 'Store Building',
    tags: ['ecommerce', 'store', 'shopify', 'woocommerce', 'payment'],
    rating: 4.6,
    popularity: 82,
    difficulty: 'intermediate',
    estimatedTime: '60-120 min',
    url: '/tools/ecommerce-generator',
    icon: ShoppingCart,
    preview: 'Complete e-commerce solution with modern designs and payment integration...',
    metadata: {
      lastUpdated: '2024-01-08',
      version: '1.8.0',
      downloads: 7654,
      views: 24567,
      bookmarks: 543
    },
    relevanceScore: 85
  }
];

const categories = [
  { value: 'development', label: 'Development', icon: Code },
  { value: 'ecommerce', label: 'E-commerce', icon: ShoppingCart },
  { value: 'content', label: 'Content', icon: FileText },
  { value: 'design', label: 'Design', icon: Palette },
  { value: 'mobile', label: 'Mobile', icon: Smartphone },
  { value: 'deployment', label: 'Deployment', icon: Rocket },
  { value: 'ai', label: 'AI & Automation', icon: Brain },
  { value: 'analytics', label: 'Analytics', icon: BarChart3 }
];

const popularSearches = [
  'react app builder',
  'ai code generation',
  'ecommerce store',
  'github integration',
  'deployment pipeline',
  'mobile app',
  'content generator',
  'design system'
];

const recentSearches = [
  'full stack app',
  'ai agents',
  'repository connect',
  'shopify integration'
];

export function AdvancedSearchSystem({
  placeholder = "Search tools, features, templates...",
  initialQuery = '',
  onResultSelect,
  showFilters = true,
  compact = false,
  maxResults = 50,
  enableVoiceSearch = true,
  enableAISearch = true,
  recentSearches: propRecentSearches = recentSearches,
  popularSearches: propPopularSearches = popularSearches
}: AdvancedSearchSystemProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isVoiceSearching, setIsVoiceSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [aiSearchMode, setAiSearchMode] = useState(false);
  
  const [filters, setFilters] = useState<SearchFilters>({
    type: [],
    category: [],
    difficulty: [],
    rating: [0, 5],
    tags: [],
    dateRange: 'all',
    sortBy: 'relevance',
    sortOrder: 'desc'
  });

  // Simulated search function
  const performSearch = useCallback(async (searchQuery: string, searchFilters: SearchFilters) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
    
    // Filter and sort mock results
    let filteredResults = mockSearchResults.filter(result => {
      const matchesQuery = 
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = searchFilters.type.length === 0 || searchFilters.type.includes(result.type);
      const matchesCategory = searchFilters.category.length === 0 || searchFilters.category.includes(result.category.toLowerCase());
      const matchesDifficulty = searchFilters.difficulty.length === 0 || searchFilters.difficulty.includes(result.difficulty);
      const matchesRating = result.rating >= searchFilters.rating[0] && result.rating <= searchFilters.rating[1];
      
      return matchesQuery && matchesType && matchesCategory && matchesDifficulty && matchesRating;
    });

    // Add highlighting
    filteredResults = filteredResults.map(result => ({
      ...result,
      highlighted: {
        title: highlightText(result.title, searchQuery),
        description: highlightText(result.description, searchQuery)
      }
    }));

    // Sort results
    filteredResults.sort((a, b) => {
      switch (searchFilters.sortBy) {
        case 'popularity':
          return searchFilters.sortOrder === 'desc' ? b.popularity - a.popularity : a.popularity - b.popularity;
        case 'rating':
          return searchFilters.sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating;
        case 'recent':
          return searchFilters.sortOrder === 'desc' ? 
            new Date(b.metadata.lastUpdated).getTime() - new Date(a.metadata.lastUpdated).getTime() :
            new Date(a.metadata.lastUpdated).getTime() - new Date(b.metadata.lastUpdated).getTime();
        case 'alphabetical':
          return searchFilters.sortOrder === 'desc' ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title);
        default: // relevance
          return b.relevanceScore - a.relevanceScore;
      }
    });

    setResults(filteredResults.slice(0, maxResults));
    setIsSearching(false);
  }, [maxResults]);

  const highlightText = (text: string, searchTerm: string): string => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-primary/20 text-primary">$1</mark>');
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query, filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, filters, performSearch]);

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice search is not supported in your browser');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setIsVoiceSearching(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsVoiceSearching(false);
    };

    recognition.onerror = () => {
      setIsVoiceSearching(false);
    };

    recognition.onend = () => {
      setIsVoiceSearching(false);
    };

    recognition.start();
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: [],
      category: [],
      difficulty: [],
      rating: [0, 5],
      tags: [],
      dateRange: 'all',
      sortBy: 'relevance',
      sortOrder: 'desc'
    });
  };

  const hasActiveFilters = useMemo(() => {
    return filters.type.length > 0 || 
           filters.category.length > 0 || 
           filters.difficulty.length > 0 || 
           filters.rating[0] > 0 || 
           filters.rating[1] < 5 ||
           filters.tags.length > 0 ||
           filters.dateRange !== 'all' ||
           filters.sortBy !== 'relevance';
  }, [filters]);

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <Card className="ff-card-interactive">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Main Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 pr-20 h-12 text-base ff-focus-ring"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                {enableAISearch && (
                  <Button
                    size="sm"
                    variant={aiSearchMode ? "default" : "ghost"}
                    onClick={() => setAiSearchMode(!aiSearchMode)}
                    className="h-8 px-3"
                  >
                    <Sparkles className="w-4 h-4" />
                  </Button>
                )}
                {enableVoiceSearch && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleVoiceSearch}
                    disabled={isVoiceSearching}
                    className="h-8 px-3"
                  >
                    {isVoiceSearching ? (
                      <Mic className="w-4 h-4 text-red-500 animate-pulse" />
                    ) : (
                      <MicOff className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Quick Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Button
                size="sm"
                variant={selectedCategory === 'all' ? "default" : "outline"}
                onClick={() => setSelectedCategory('all')}
                className="flex-shrink-0"
              >
                All
              </Button>
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.value}
                    size="sm"
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.value)}
                    className="flex-shrink-0"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {category.label}
                  </Button>
                );
              })}
            </div>

            {/* AI Search Mode Indicator */}
            {aiSearchMode && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-primary/10 border border-primary/20 rounded-lg"
              >
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Sparkles className="w-4 h-4" />
                  AI Search Mode: Ask natural language questions about tools and features
                </div>
              </motion.div>
            )}

            {/* Advanced Filters Toggle */}
            {showFilters && (
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="ff-focus-ring"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Advanced Filters
                  <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                      !
                    </Badge>
                  )}
                </Button>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}

            {/* Advanced Filters */}
            <AnimatePresence>
              {showAdvancedFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-4 border-t border-border"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Type</label>
                      <Select>
                        <SelectTrigger className="ff-focus-ring">
                          <SelectValue placeholder="All types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tool">Tools</SelectItem>
                          <SelectItem value="feature">Features</SelectItem>
                          <SelectItem value="template">Templates</SelectItem>
                          <SelectItem value="documentation">Documentation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Difficulty</label>
                      <Select>
                        <SelectTrigger className="ff-focus-ring">
                          <SelectValue placeholder="All levels" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Sort By</label>
                      <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                        <SelectTrigger className="ff-focus-ring">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relevance">Relevance</SelectItem>
                          <SelectItem value="popularity">Popularity</SelectItem>
                          <SelectItem value="rating">Rating</SelectItem>
                          <SelectItem value="recent">Recent</SelectItem>
                          <SelectItem value="alphabetical">A-Z</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Updated</label>
                      <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
                        <SelectTrigger className="ff-focus-ring">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All time</SelectItem>
                          <SelectItem value="week">Last week</SelectItem>
                          <SelectItem value="month">Last month</SelectItem>
                          <SelectItem value="quarter">Last quarter</SelectItem>
                          <SelectItem value="year">Last year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Search Results or Suggestions */}
      {query ? (
        <div className="space-y-4">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">
                {isSearching ? 'Searching...' : `Found ${results.length} results`}
              </h3>
              {isSearching && <Loader2 className="w-4 h-4 animate-spin" />}
            </div>
            {results.length > 0 && (
              <div className="text-sm text-muted-foreground">
                Sorted by {filters.sortBy}
              </div>
            )}
          </div>

          {/* Results List */}
          <div className="space-y-3">
            <AnimatePresence>
              {results.map((result, index) => {
                const Icon = result.icon;
                return (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card 
                      className="ff-card-interactive cursor-pointer hover:border-primary/30"
                      onClick={() => onResultSelect?.(result)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <h4 
                                  className="font-semibold hover:text-primary transition-colors"
                                  dangerouslySetInnerHTML={{ 
                                    __html: result.highlighted?.title || result.title 
                                  }}
                                />
                                <p 
                                  className="text-sm text-muted-foreground mt-1 line-clamp-2"
                                  dangerouslySetInnerHTML={{ 
                                    __html: result.highlighted?.description || result.description 
                                  }}
                                />
                                
                                <div className="flex items-center gap-3 mt-3">
                                  <Badge variant="outline" className="text-xs">
                                    {result.type}
                                  </Badge>
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-500" />
                                    <span className="text-xs text-muted-foreground">
                                      {result.rating}
                                    </span>
                                  </div>
                                  {result.estimatedTime && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-muted-foreground" />
                                      <span className="text-xs text-muted-foreground">
                                        {result.estimatedTime}
                                      </span>
                                    </div>
                                  )}
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${
                                      result.difficulty === 'beginner' ? 'text-green-600' :
                                      result.difficulty === 'intermediate' ? 'text-yellow-600' :
                                      'text-red-600'
                                    }`}
                                  >
                                    {result.difficulty}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="text-right space-y-1">
                                <div className="text-xs text-muted-foreground">
                                  {result.metadata.views?.toLocaleString()} views
                                </div>
                                {result.metadata.downloads && (
                                  <div className="text-xs text-muted-foreground">
                                    {result.metadata.downloads.toLocaleString()} downloads
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {results.length === 0 && !isSearching && (
            <Card className="text-center p-8">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-muted/20 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground text-sm">
                    Try adjusting your search terms or filters
                  </p>
                </div>
                <Button variant="outline" onClick={clearFilters} className="ff-focus-ring">
                  Clear all filters
                </Button>
              </div>
            </Card>
          )}
        </div>
      ) : (
        /* Search Suggestions */
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Searches */}
          <Card className="ff-card-interactive">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <History className="w-4 h-4" />
                Recent Searches
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {propRecentSearches.map((search, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuery(search)}
                  className="w-full justify-start text-left"
                >
                  <Clock className="w-3 h-3 mr-2 text-muted-foreground" />
                  {search}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Popular Searches */}
          <Card className="ff-card-interactive">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Popular Searches
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {propPopularSearches.map((search, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuery(search)}
                  className="w-full justify-start text-left"
                >
                  <TrendingUp className="w-3 h-3 mr-2 text-muted-foreground" />
                  {search}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default AdvancedSearchSystem;
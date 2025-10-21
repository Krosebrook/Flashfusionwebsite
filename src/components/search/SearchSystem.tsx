import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Separator } from '../ui/separator';
import { 
  Search, 
  Filter, 
  X, 
  Star, 
  Clock, 
  Tag, 
  Folder, 
  Code, 
  Zap,
  Rocket,
  Users,
  ArrowRight,
  TrendingUp,
  Calendar,
  Hash
} from 'lucide-react';
import { useDebounce } from '../ui/use-mobile';

interface SearchableItem {
  id: string;
  type: 'tool' | 'project' | 'template' | 'tutorial';
  title: string;
  description: string;
  tags: string[];
  category?: string;
  rating?: number;
  usage_count?: number;
  created_at?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  framework?: string;
  status?: string;
  author?: string;
}

interface SearchFilter {
  type?: string[];
  category?: string[];
  tags?: string[];
  difficulty?: string[];
  rating?: number;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

interface SearchSystemProps {
  items: SearchableItem[];
  onItemSelect: (item: SearchableItem) => void;
  placeholder?: string;
  showFilters?: boolean;
  categories?: string[];
  popularTags?: string[];
}

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function SearchSystem({ 
  items, 
  onItemSelect, 
  placeholder = "Search tools, projects, templates...",
  showFilters = true,
  categories = [],
  popularTags = []
}: SearchSystemProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState<SearchFilter>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('ff_recent_searches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Save search to recent searches
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    
    const updated = [query, ...recentSearches.filter(q => q !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('ff_recent_searches', JSON.stringify(updated));
  };

  // Filter and search items
  const filteredItems = useMemo(() => {
    let filtered = items;

    // Apply text search
    if (debouncedQuery.trim()) {
      const query = debouncedQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query)) ||
        item.category?.toLowerCase().includes(query) ||
        item.author?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.type?.length) {
      filtered = filtered.filter(item => filters.type!.includes(item.type));
    }

    if (filters.category?.length) {
      filtered = filtered.filter(item => 
        item.category && filters.category!.includes(item.category)
      );
    }

    if (filters.tags?.length) {
      filtered = filtered.filter(item =>
        filters.tags!.some(tag => item.tags.includes(tag))
      );
    }

    if (filters.difficulty?.length) {
      filtered = filtered.filter(item =>
        item.difficulty && filters.difficulty!.includes(item.difficulty)
      );
    }

    if (filters.rating) {
      filtered = filtered.filter(item =>
        item.rating && item.rating >= filters.rating!
      );
    }

    // Sort by relevance and popularity
    return filtered.sort((a, b) => {
      // Boost exact matches
      const aExactMatch = a.title.toLowerCase() === debouncedQuery.toLowerCase();
      const bExactMatch = b.title.toLowerCase() === debouncedQuery.toLowerCase();
      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;

      // Then by usage count
      return (b.usage_count || 0) - (a.usage_count || 0);
    });
  }, [items, debouncedQuery, filters]);

  // Get search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];

    const suggestions = new Set<string>();
    const query = searchQuery.toLowerCase();

    // Add matching tags
    items.forEach(item => {
      item.tags.forEach(tag => {
        if (tag.toLowerCase().includes(query) && !tag.toLowerCase().startsWith(query)) {
          suggestions.add(tag);
        }
      });
    });

    // Add matching categories
    categories.forEach(category => {
      if (category.toLowerCase().includes(query)) {
        suggestions.add(category);
      }
    });

    return Array.from(suggestions).slice(0, 6);
  }, [searchQuery, items, categories]);

  // Handle search submission
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    saveRecentSearch(query);
    setIsSearchFocused(false);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({});
  };

  // Get active filter count
  const activeFilterCount = Object.values(filters).reduce((count, filter) => {
    if (Array.isArray(filter)) return count + filter.length;
    if (filter) return count + 1;
    return count;
  }, 0);

  const typeIcons = {
    tool: Zap,
    project: Folder,
    template: Code,
    tutorial: Users
  };

  return (
    <div className="relative">
      {/* Main Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(searchQuery);
              }
            }}
            placeholder={placeholder}
            className="pl-10 pr-20 h-12 text-base"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {showFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedSearch(true)}
                className="relative"
              >
                <Filter className="w-4 h-4 mr-1" />
                Filter
                {activeFilterCount > 0 && (
                  <Badge className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-white">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            )}
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchFocused(false);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Search Dropdown */}
        <AnimatePresence>
          {isSearchFocused && (searchQuery || recentSearches.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 z-50 mt-2 bg-card border rounded-lg shadow-lg max-h-96 overflow-auto"
            >
              <div className="p-4 space-y-4">
                {/* Recent Searches */}
                {!searchQuery && recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Recent Searches</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((recent, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSearch(recent)}
                          className="text-xs h-7"
                        >
                          {recent}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Search Suggestions */}
                {searchSuggestions.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Suggestions</span>
                    </div>
                    <div className="space-y-1">
                      {searchSuggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSearch(suggestion)}
                          className="w-full justify-start text-left h-8"
                        >
                          <Search className="w-3 h-3 mr-2" />
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Tags */}
                {!searchQuery && popularTags.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Popular Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {popularTags.map((tag, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSearch(tag)}
                          className="text-xs h-7"
                        >
                          <Hash className="w-3 h-3 mr-1" />
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search Results */}
      {(debouncedQuery || activeFilterCount > 0) && (
        <div className="mt-4 space-y-4">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''}
                {debouncedQuery && (
                  <span className="ml-2 text-muted-foreground">
                    for "{debouncedQuery}"
                  </span>
                )}
              </h3>
            </div>
            {activeFilterCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            )}
          </div>

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.type?.map(type => (
                <Badge key={type} variant="secondary" className="flex items-center gap-1">
                  {type}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => setFilters(prev => ({
                      ...prev,
                      type: prev.type?.filter(t => t !== type)
                    }))}
                  />
                </Badge>
              ))}
              {filters.category?.map(category => (
                <Badge key={category} variant="secondary" className="flex items-center gap-1">
                  {category}
                  <X 
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setFilters(prev => ({
                      ...prev,
                      category: prev.category?.filter(c => c !== category)
                    }))}
                  />
                </Badge>
              ))}
            </div>
          )}

          {/* Results List */}
          <div className="space-y-3">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    clearFilters();
                  }}
                >
                  Clear search
                </Button>
              </div>
            ) : (
              filteredItems.map((item) => {
                const Icon = typeIcons[item.type] || Code;
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card 
                      className="ff-card-interactive cursor-pointer"
                      onClick={() => onItemSelect(item)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold truncate">{item.title}</h4>
                              <Badge variant="outline" className="text-xs capitalize">
                                {item.type}
                              </Badge>
                              {item.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs">{item.rating}</span>
                                </div>
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {item.description}
                            </p>
                            
                            <div className="flex items-center gap-2 flex-wrap">
                              {item.category && (
                                <Badge variant="secondary" className="text-xs">
                                  {item.category}
                                </Badge>
                              )}
                              {item.difficulty && (
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    item.difficulty === 'beginner' ? 'border-green-500 text-green-500' :
                                    item.difficulty === 'intermediate' ? 'border-yellow-500 text-yellow-500' :
                                    'border-red-500 text-red-500'
                                  }`}
                                >
                                  {item.difficulty}
                                </Badge>
                              )}
                              {item.tags.slice(0, 3).map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {item.tags.length > 3 && (
                                <span className="text-xs text-muted-foreground">
                                  +{item.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Advanced Search Dialog */}
      <Dialog open={showAdvancedSearch} onOpenChange={setShowAdvancedSearch}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Advanced Search Filters</DialogTitle>
            <DialogDescription>
              Customize your search with advanced filters to find exactly what you're looking for.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Content Type */}
            <div>
              <h4 className="font-medium mb-2">Content Type</h4>
              <div className="flex flex-wrap gap-2">
                {['tool', 'project', 'template', 'tutorial'].map(type => (
                  <Button
                    key={type}
                    variant={filters.type?.includes(type) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilters(prev => {
                      const currentTypes = prev.type || [];
                      return {
                        ...prev,
                        type: currentTypes.includes(type)
                          ? currentTypes.filter(t => t !== type)
                          : [...currentTypes, type]
                      };
                    })}
                    className="capitalize"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={filters.category?.includes(category) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilters(prev => {
                        const currentCategories = prev.category || [];
                        return {
                          ...prev,
                          category: currentCategories.includes(category)
                            ? currentCategories.filter(c => c !== category)
                            : [...currentCategories, category]
                        };
                      })}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Difficulty */}
            <div>
              <h4 className="font-medium mb-2">Difficulty Level</h4>
              <div className="flex gap-2">
                {['beginner', 'intermediate', 'advanced'].map(difficulty => (
                  <Button
                    key={difficulty}
                    variant={filters.difficulty?.includes(difficulty) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilters(prev => {
                      const currentDifficulty = prev.difficulty || [];
                      return {
                        ...prev,
                        difficulty: currentDifficulty.includes(difficulty)
                          ? currentDifficulty.filter(d => d !== difficulty)
                          : [...currentDifficulty, difficulty]
                      };
                    })}
                    className="capitalize"
                  >
                    {difficulty}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={clearFilters}
              >
                Clear All Filters
              </Button>
              <Button
                onClick={() => setShowAdvancedSearch(false)}
                className="ff-btn-primary"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Click outside to close search results */}
      {isSearchFocused && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsSearchFocused(false)}
        />
      )}
    </div>
  );
}
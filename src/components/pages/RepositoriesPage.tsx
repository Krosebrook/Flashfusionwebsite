import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  Search, 
  ExternalLink, 
  Star, 
  GitFork, 
  AlertCircle,
  Code2,
  Calendar,
  Filter,
  Github
} from 'lucide-react';
import { featuredRepositories, getCategoryColor, getCategoryLabel, getAllCategories, getLanguageColor, type Repository } from '../../data/repositories';
import { motion } from 'motion/react';

export default function RepositoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Repository['category'] | 'all'>('all');
  
  const categories = getAllCategories();
  
  const filteredRepositories = featuredRepositories.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         repo.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || repo.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center space-x-3">
          <Github className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-4xl font-bold ff-text-gradient">GitHub Repositories</h1>
            <p className="text-muted-foreground text-lg mt-2">
              Explore our collection of open-source projects and tools
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="ff-card-interactive">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{featuredRepositories.length}</div>
              <div className="text-sm text-muted-foreground">Repositories</div>
            </CardContent>
          </Card>
          <Card className="ff-card-interactive">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{categories.length}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </CardContent>
          </Card>
          <Card className="ff-card-interactive">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">TypeScript</div>
              <div className="text-sm text-muted-foreground">Primary Language</div>
            </CardContent>
          </Card>
          <Card className="ff-card-interactive">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Open Source</div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {getCategoryLabel(category)}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Repository Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredRepositories.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No repositories found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredRepositories.map((repo, index) => (
            <motion.div
              key={repo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="ff-card-interactive h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Code2 className="w-8 h-8 text-primary" />
                    {repo.category && (
                      <Badge className={getCategoryColor(repo.category)} variant="outline">
                        {getCategoryLabel(repo.category)}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{repo.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {repo.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="space-y-3 mb-4">
                    {/* Language */}
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`} />
                      <span>{repo.language}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>{repo.stargazersCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <GitFork className="w-4 h-4" />
                        <span>{repo.forksCount}</span>
                      </div>
                      {repo.openIssuesCount > 0 && (
                        <div className="flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{repo.openIssuesCount}</span>
                        </div>
                      )}
                    </div>

                    {/* Last Updated */}
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Updated {formatDate(repo.updatedAt)}</span>
                    </div>

                    {/* Topics */}
                    {repo.topics && repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {repo.topics.slice(0, 3).map((topic) => (
                          <Badge key={topic} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(repo.htmlUrl, '_blank')}
                  >
                    <span>View on GitHub</span>
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center space-y-2"
      >
        <p className="text-muted-foreground">
          All repositories are open source and available on GitHub
        </p>
        <Button
          variant="link"
          onClick={() => window.open('https://github.com/Krosebrook', '_blank')}
          className="text-primary"
        >
          View all repositories on GitHub →
        </Button>
      </motion.div>
    </div>
  );
}

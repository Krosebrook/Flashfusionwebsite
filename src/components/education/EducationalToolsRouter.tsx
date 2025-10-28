/**
 * @fileoverview Educational Tools Router - Navigation and Tool Selection
 * @chunk education
 * @category educational-tools
 * @version 1.0.0
 * @author FlashFusion Team
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  BookOpen, Users, GraduationCap, Calculator, FileText, 
  PresentationChart, Clipboard, Brain, Search, Filter,
  Star, TrendingUp, Clock, Target, Award, Lightbulb
} from 'lucide-react';

// Educational Tool Categories
const EDUCATIONAL_TOOL_CATEGORIES = [
  {
    id: 'lesson-planning',
    name: 'Lesson Planning',
    description: 'AI-powered lesson plan generation and curriculum mapping tools',
    icon: BookOpen,
    color: 'var(--ff-primary)',
    tools: [
      { name: 'Differentiated Lesson Plans', description: 'Generate lessons for multiple learning levels', popular: true },
      { name: 'Curriculum Map Generator', description: 'Year-long pacing guides aligned to standards', popular: true },
      { name: 'Unit Plan Creator', description: 'Comprehensive unit planning with assessments', popular: false },
      { name: 'Cross-Curricular Integrator', description: 'Connect subjects with interdisciplinary activities', popular: false }
    ]
  },
  {
    id: 'assessment',
    name: 'Assessment & Evaluation',
    description: 'Comprehensive assessment creation and grading tools',
    icon: Clipboard,
    color: 'var(--ff-secondary)',
    tools: [
      { name: 'Quiz & Test Generator', description: 'Auto-generate multiple choice and short answer tests', popular: true },
      { name: 'Rubric Builder', description: 'Create detailed assessment rubrics', popular: true },
      { name: 'Portfolio Assessment', description: 'Student work portfolio evaluation tools', popular: false },
      { name: 'Peer Assessment Tools', description: 'Student-to-student evaluation frameworks', popular: false }
    ]
  },
  {
    id: 'student-support',
    name: 'Student Learning Support',
    description: 'Personalized learning tools and study assistance',
    icon: GraduationCap,
    color: 'var(--ff-accent)',
    tools: [
      { name: 'Study Path Generator', description: 'Personalized learning sequences', popular: true },
      { name: 'Flashcard Creator', description: 'AI-generated study flashcards', popular: true },
      { name: 'Essay Writing Assistant', description: 'Thesis generation and citation help', popular: true },
      { name: 'Practice Problem Generator', description: 'Subject-specific practice questions', popular: false }
    ]
  },
  {
    id: 'interactive-content',
    name: 'Interactive Content',
    description: 'Engaging multimedia and interactive learning materials',
    icon: PresentationChart,
    color: 'var(--ff-success)',
    tools: [
      { name: 'AI Slide Deck Creator', description: 'Auto-design presentations with content', popular: true },
      { name: 'Interactive Game Builder', description: 'Educational games and activities', popular: false },
      { name: 'Virtual Lab Simulator', description: 'Safe online laboratory experiences', popular: false },
      { name: 'AR/VR Learning Modules', description: 'Immersive educational experiences', popular: false }
    ]
  },
  {
    id: 'communication',
    name: 'Communication Tools',
    description: 'Parent communication and progress reporting systems',
    icon: Users,
    color: 'var(--ff-warning)',
    tools: [
      { name: 'Parent Newsletter Generator', description: 'Weekly classroom update templates', popular: true },
      { name: 'Progress Report Creator', description: 'Individual student progress summaries', popular: true },
      { name: 'Conference Scheduler', description: 'Parent-teacher meeting coordination', popular: false },
      { name: 'Behavioral Tracker', description: 'Student behavior monitoring and reporting', popular: false }
    ]
  },
  {
    id: 'digital-products',
    name: 'Digital Product Creation',
    description: 'Marketable educational content for online sales',
    icon: FileText,
    color: 'var(--ff-info)',
    tools: [
      { name: 'Printable Worksheet Designer', description: 'Professional educational printables', popular: true },
      { name: 'Study Planner Templates', description: 'Student organization and planning tools', popular: true },
      { name: 'Exam Prep Kit Builder', description: 'Comprehensive test preparation packages', popular: false },
      { name: 'Teacher Resource Bundler', description: 'Complete curriculum resource packages', popular: false }
    ]
  }
];

interface EducationalToolsRouterProps {
  onToolSelect?: (categoryId: string, toolName: string) => void;
}

/**
 * Educational Tools Router Component
 * Provides navigation and selection interface for educational tools
 */
function EducationalToolsRouter({ onToolSelect }: EducationalToolsRouterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showPopularOnly, setShowPopularOnly] = useState(false);

  // Filter tools based on search and popular filter
  const filteredCategories = EDUCATIONAL_TOOL_CATEGORIES.map(category => ({
    ...category,
    tools: category.tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPopular = !showPopularOnly || tool.popular;
      return matchesSearch && matchesPopular;
    })
  })).filter(category => category.tools.length > 0);

  const handleToolSelection = (categoryId: string, toolName: string) => {
    if (onToolSelect) {
      onToolSelect(categoryId, toolName);
    }
  };

  return (
    <div 
      className="min-h-screen p-6 space-y-8"
      style={{
        backgroundColor: 'var(--ff-bg-dark)',
        fontFamily: 'var(--ff-font-secondary)'
      }}
    >
      {/* Header */}
      <div className="text-center space-y-6">
        <div 
          className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, var(--ff-primary) 0%, var(--ff-secondary) 50%, var(--ff-accent) 100%)',
            animation: 'pulseGlow 3s ease-in-out infinite'
          }}
        >
          <Lightbulb className="w-8 h-8 text-white" />
          <h1 
            className="tracking-tight"
            style={{
              fontFamily: 'var(--ff-font-primary)',
              fontSize: 'var(--ff-text-3xl)',
              fontWeight: 'var(--ff-weight-bold)',
              color: 'white',
              lineHeight: 'var(--ff-leading-tight)'
            }}
          >
            Educational AI Tools
          </h1>
        </div>
        
        <p 
          className="max-w-4xl mx-auto"
          style={{
            fontSize: 'var(--ff-text-lg)',
            color: 'var(--ff-text-secondary)',
            lineHeight: 'var(--ff-leading-relaxed)'
          }}
        >
          Discover and access AI-powered educational tools designed for educators, students, and content creators. 
          Generate lesson plans, assessments, study materials, and interactive content with cutting-edge AI technology.
        </p>

        {/* Quick Stats */}
        <div className="flex justify-center gap-6 text-center">
          <div>
            <div 
              style={{
                fontSize: 'var(--ff-text-2xl)',
                fontWeight: 'var(--ff-weight-bold)',
                color: 'var(--ff-primary)',
                fontFamily: 'var(--ff-font-primary)'
              }}
            >
              65+
            </div>
            <div 
              style={{
                fontSize: 'var(--ff-text-sm)',
                color: 'var(--ff-text-muted)'
              }}
            >
              AI Tools
            </div>
          </div>
          <div>
            <div 
              style={{
                fontSize: 'var(--ff-text-2xl)',
                fontWeight: 'var(--ff-weight-bold)',
                color: 'var(--ff-secondary)',
                fontFamily: 'var(--ff-font-primary)'
              }}
            >
              7
            </div>
            <div 
              style={{
                fontSize: 'var(--ff-text-sm)',
                color: 'var(--ff-text-muted)'
              }}
            >
              Categories
            </div>
          </div>
          <div>
            <div 
              style={{
                fontSize: 'var(--ff-text-2xl)',
                fontWeight: 'var(--ff-weight-bold)',
                color: 'var(--ff-accent)',
                fontFamily: 'var(--ff-font-primary)'
              }}
            >
              24/7
            </div>
            <div 
              style={{
                fontSize: 'var(--ff-text-sm)',
                color: 'var(--ff-text-muted)'
              }}
            >
              Available
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <Card 
        className="max-w-4xl mx-auto"
        style={{
          background: 'var(--ff-gradient-surface)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--ff-radius-lg)'
        }}
      >
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                style={{ color: 'var(--ff-text-muted)' }}
              />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search educational tools..."
                className="pl-10"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'var(--ff-text-primary)',
                  fontSize: 'var(--ff-text-sm)',
                  borderRadius: 'var(--ff-radius)'
                }}
              />
            </div>

            {/* Filter Controls */}
            <div className="flex gap-2">
              <Button
                variant={showPopularOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowPopularOnly(!showPopularOnly)}
                className="flex items-center gap-2"
                style={{
                  backgroundColor: showPopularOnly ? 'var(--ff-primary)' : 'transparent',
                  borderColor: showPopularOnly ? 'var(--ff-primary)' : 'rgba(255, 255, 255, 0.2)',
                  color: showPopularOnly ? 'white' : 'var(--ff-text-primary)',
                  fontSize: 'var(--ff-text-sm)',
                  borderRadius: 'var(--ff-radius)'
                }}
              >
                <Star className="w-3 h-3" />
                Popular
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'var(--ff-text-primary)',
                  fontSize: 'var(--ff-text-sm)',
                  borderRadius: 'var(--ff-radius)'
                }}
              >
                <Filter className="w-3 h-3" />
                Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tool Categories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {filteredCategories.map((category) => (
          <Card 
            key={category.id}
            className="ff-card-interactive ff-hover-lift h-full"
            style={{
              background: 'var(--ff-gradient-surface)',
              border: selectedCategory === category.id 
                ? `2px solid ${category.color}` 
                : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--ff-radius-lg)',
              transition: 'all var(--ff-animation-duration) var(--ff-animation-ease)',
              cursor: 'pointer'
            }}
            onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${category.color}, ${category.color}99)`,
                      boxShadow: `0 4px 16px ${category.color}33`
                    }}
                  >
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle 
                      style={{
                        fontFamily: 'var(--ff-font-primary)',
                        fontSize: 'var(--ff-text-lg)',
                        fontWeight: 'var(--ff-weight-semibold)',
                        color: 'var(--ff-text-primary)',
                        lineHeight: 'var(--ff-leading-tight)'
                      }}
                    >
                      {category.name}
                    </CardTitle>
                  </div>
                </div>
                
                <Badge 
                  style={{
                    backgroundColor: `${category.color}22`,
                    color: category.color,
                    border: `1px solid ${category.color}44`,
                    fontSize: 'var(--ff-text-xs)'
                  }}
                >
                  {category.tools.length} tools
                </Badge>
              </div>
              
              <p 
                style={{
                  fontSize: 'var(--ff-text-sm)',
                  color: 'var(--ff-text-secondary)',
                  lineHeight: 'var(--ff-leading-relaxed)',
                  marginTop: 'var(--ff-space-2)'
                }}
              >
                {category.description}
              </p>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                {category.tools.slice(0, selectedCategory === category.id ? undefined : 2).map((tool, index) => (
                  <div 
                    key={index}
                    className="p-3 rounded-lg ff-hover-scale cursor-pointer"
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: 'var(--ff-radius)',
                      transition: 'all var(--ff-animation-duration) var(--ff-animation-ease)'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToolSelection(category.id, tool.name);
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 
                            style={{
                              fontFamily: 'var(--ff-font-primary)',
                              fontSize: 'var(--ff-text-sm)',
                              fontWeight: 'var(--ff-weight-semibold)',
                              color: 'var(--ff-text-primary)',
                              lineHeight: 'var(--ff-leading-tight)'
                            }}
                          >
                            {tool.name}
                          </h4>
                          {tool.popular && (
                            <Star 
                              className="w-3 h-3 fill-current"
                              style={{ color: 'var(--ff-warning)' }}
                            />
                          )}
                        </div>
                        <p 
                          style={{
                            fontSize: 'var(--ff-text-xs)',
                            color: 'var(--ff-text-muted)',
                            lineHeight: 'var(--ff-leading-relaxed)',
                            marginTop: 'var(--ff-space-1)'
                          }}
                        >
                          {tool.description}
                        </p>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          color: category.color,
                          fontSize: 'var(--ff-text-xs)',
                          padding: 'var(--ff-space-1) var(--ff-space-2)'
                        }}
                      >
                        Try Now
                      </Button>
                    </div>
                  </div>
                ))}
                
                {/* Show More/Less Button */}
                {category.tools.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    style={{
                      color: category.color,
                      fontSize: 'var(--ff-text-xs)',
                      fontWeight: 'var(--ff-weight-medium)'
                    }}
                  >
                    {selectedCategory === category.id 
                      ? `Show Less` 
                      : `+${category.tools.length - 2} More Tools`
                    }
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Tools Section */}
      <Card 
        className="max-w-7xl mx-auto"
        style={{
          background: 'var(--ff-gradient-surface)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--ff-radius-lg)'
        }}
      >
        <CardHeader>
          <CardTitle 
            className="flex items-center gap-3 text-center justify-center"
            style={{
              fontFamily: 'var(--ff-font-primary)',
              fontSize: 'var(--ff-text-2xl)',
              fontWeight: 'var(--ff-weight-semibold)',
              color: 'var(--ff-text-primary)'
            }}
          >
            <TrendingUp style={{ color: 'var(--ff-primary)' }} className="w-6 h-6" />
            Most Popular Educational Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {EDUCATIONAL_TOOL_CATEGORIES
              .flatMap(cat => cat.tools.filter(tool => tool.popular).map(tool => ({ ...tool, category: cat })))
              .slice(0, 8)
              .map((tool, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg ff-card-interactive text-center"
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--ff-radius)',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleToolSelection(tool.category.id, tool.name)}
                >
                  <div 
                    className="w-10 h-10 mx-auto mb-3 rounded-lg flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${tool.category.color}, ${tool.category.color}99)`
                    }}
                  >
                    <tool.category.icon className="w-5 h-5 text-white" />
                  </div>
                  
                  <h4 
                    style={{
                      fontFamily: 'var(--ff-font-primary)',
                      fontSize: 'var(--ff-text-sm)',
                      fontWeight: 'var(--ff-weight-semibold)',
                      color: 'var(--ff-text-primary)',
                      lineHeight: 'var(--ff-leading-tight)',
                      marginBottom: 'var(--ff-space-2)'
                    }}
                  >
                    {tool.name}
                  </h4>
                  
                  <p 
                    style={{
                      fontSize: 'var(--ff-text-xs)',
                      color: 'var(--ff-text-muted)',
                      lineHeight: 'var(--ff-leading-relaxed)'
                    }}
                  >
                    {tool.description}
                  </p>
                  
                  <div className="flex items-center justify-center gap-1 mt-3">
                    <Star 
                      className="w-3 h-3 fill-current"
                      style={{ color: 'var(--ff-warning)' }}
                    />
                    <span 
                      style={{
                        fontSize: 'var(--ff-text-xs)',
                        color: 'var(--ff-warning)',
                        fontWeight: 'var(--ff-weight-medium)'
                      }}
                    >
                      Popular
                    </span>
                  </div>
                </div>
              ))
            }
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center space-y-6 max-w-4xl mx-auto">
        <div>
          <h2 
            style={{
              fontFamily: 'var(--ff-font-primary)',
              fontSize: 'var(--ff-text-2xl)',
              fontWeight: 'var(--ff-weight-semibold)',
              color: 'var(--ff-text-primary)',
              marginBottom: 'var(--ff-space-4)'
            }}
          >
            Ready to Transform Your Educational Content?
          </h2>
          <p 
            style={{
              fontSize: 'var(--ff-text-base)',
              color: 'var(--ff-text-secondary)',
              lineHeight: 'var(--ff-leading-relaxed)',
              marginBottom: 'var(--ff-space-6)'
            }}
          >
            Join thousands of educators, students, and content creators who are already using 
            FlashFusion's AI-powered educational tools to create engaging, effective learning experiences.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            className="ff-btn-primary"
            style={{
              backgroundColor: 'var(--ff-primary)',
              color: 'white',
              fontFamily: 'var(--ff-font-primary)',
              fontSize: 'var(--ff-text-base)',
              fontWeight: 'var(--ff-weight-semibold)',
              padding: 'var(--ff-space-4) var(--ff-space-8)',
              borderRadius: 'var(--ff-radius-lg)',
              border: 'none'
            }}
          >
            Start Creating Content
          </Button>
          
          <Button
            variant="outline"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: 'var(--ff-text-primary)',
              fontFamily: 'var(--ff-font-primary)',
              fontSize: 'var(--ff-text-base)',
              fontWeight: 'var(--ff-weight-semibold)',
              padding: 'var(--ff-space-4) var(--ff-space-8)',
              borderRadius: 'var(--ff-radius-lg)'
            }}
          >
            Explore All Tools
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EducationalToolsRouter;
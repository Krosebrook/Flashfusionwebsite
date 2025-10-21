/**
 * @fileoverview FlashFusion Educational Content Studio - AI Academic Content Catalog
 * @chunk education
 * @category educational-tools
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Comprehensive AI-powered educational content generation platform:
 * - Multi-target content creation (Educators, Students, Digital Sellers)
 * - Standards-aligned curriculum development
 * - Interactive learning materials generation
 * - Assessment and grading tools
 * - Parent communication systems
 * - Personalized learning paths
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { 
  BookOpen, Users, GraduationCap, ShoppingBag, Brain, 
  FileText, PresentationChart, Clipboard, MessageSquare, 
  Target, Lightbulb, Download, Share2, Star, Zap,
  School, Calculator, Globe, Palette, Music, Beaker,
  History, Languages, Heart, Trophy, Puzzle, MapPin
} from 'lucide-react';

// Educational Content Types and Interfaces
interface EducationalContent {
  id: string;
  title: string;
  type: 'lesson' | 'assessment' | 'activity' | 'resource' | 'printable';
  targetAudience: 'educator' | 'student' | 'both' | 'seller';
  subject: string;
  gradeLevel: string;
  standard?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  format: string[];
  content: string;
  metadata: {
    duration?: string;
    materials?: string[];
    objectives?: string[];
    tags?: string[];
  };
  generatedAt: Date;
}

interface ContentGenerationRequest {
  type: string;
  subject: string;
  gradeLevel: string;
  standard?: string;
  topic: string;
  audience: string;
  format: string;
  specifications?: string;
  count?: number;
}

// Educational Standards and Subjects Configuration
const EDUCATIONAL_STANDARDS = [
  'Common Core State Standards',
  'Next Generation Science Standards',
  'International Baccalaureate (IB)',
  'Advanced Placement (AP)',
  'State Standards',
  'Custom Curriculum'
];

const SUBJECTS = [
  { id: 'math', name: 'Mathematics', icon: Calculator, color: 'text-blue-400' },
  { id: 'science', name: 'Science', icon: Beaker, color: 'text-green-400' },
  { id: 'english', name: 'English Language Arts', icon: BookOpen, color: 'text-purple-400' },
  { id: 'history', name: 'History & Social Studies', icon: History, color: 'text-amber-400' },
  { id: 'languages', name: 'World Languages', icon: Languages, color: 'text-cyan-400' },
  { id: 'arts', name: 'Visual & Performing Arts', icon: Palette, color: 'text-pink-400' },
  { id: 'music', name: 'Music Education', icon: Music, color: 'text-indigo-400' },
  { id: 'pe', name: 'Physical Education', icon: Heart, color: 'text-red-400' },
  { id: 'geography', name: 'Geography', icon: MapPin, color: 'text-emerald-400' },
  { id: 'critical', name: 'Critical Thinking', icon: Puzzle, color: 'text-orange-400' }
];

const GRADE_LEVELS = [
  'Pre-K', 'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade',
  '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade',
  '9th Grade', '10th Grade', '11th Grade', '12th Grade',
  'College/University', 'Adult Education', 'Professional Development'
];

const CONTENT_TYPES_BY_AUDIENCE = {
  educator: [
    { id: 'lesson-plans', name: 'Differentiated Lesson Plans', icon: BookOpen },
    { id: 'curriculum-maps', name: 'Standards-Aligned Curriculum Maps', icon: Target },
    { id: 'assessments', name: 'Assessment Tools & Rubrics', icon: Clipboard },
    { id: 'parent-comm', name: 'Parent Communication Templates', icon: MessageSquare },
    { id: 'activities', name: 'Interactive Student Activities', icon: Users }
  ],
  student: [
    { id: 'study-paths', name: 'Personalized Study Paths', icon: Target },
    { id: 'study-guides', name: 'Smart Study Guides', icon: BookOpen },
    { id: 'flashcards', name: 'AI-Generated Flashcards', icon: Brain },
    { id: 'essay-aids', name: 'Essay Writing Assistance', icon: FileText },
    { id: 'practice-tests', name: 'Practice Tests & Quizzes', icon: Clipboard }
  ],
  both: [
    { id: 'slide-decks', name: 'AI-Powered Presentations', icon: PresentationChart },
    { id: 'interactive-materials', name: 'Interactive Learning Games', icon: Puzzle },
    { id: 'homework-generators', name: 'Homework & Assignment Generators', icon: FileText },
    { id: 'project-tools', name: 'Group Project Frameworks', icon: Users },
    { id: 'language-support', name: 'Multi-Language Support Tools', icon: Languages }
  ],
  seller: [
    { id: 'printables', name: 'Educational Printable Packs', icon: Download },
    { id: 'planners', name: 'Study & Organization Tools', icon: Calendar },
    { id: 'exam-prep', name: 'Exam Preparation Kits', icon: GraduationCap },
    { id: 'teacher-bundles', name: 'Teacher Resource Bundles', icon: ShoppingBag }
  ]
};

/**
 * Educational Content Studio Component
 * Main interface for AI-powered educational content generation
 */
function EducationalContentStudio() {
  // State Management
  const [activeTab, setActiveTab] = useState<string>('educator');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<EducationalContent[]>([]);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedContentType, setSelectedContentType] = useState<string>('');
  
  // Form State
  const [formData, setFormData] = useState<ContentGenerationRequest>({
    type: '',
    subject: '',
    gradeLevel: '',
    standard: '',
    topic: '',
    audience: 'educator',
    format: 'document',
    specifications: '',
    count: 1
  });

  // Content Generation Handler
  const handleContentGeneration = useCallback(async () => {
    if (!formData.type || !formData.subject || !formData.topic) {
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate AI content generation process
      const progressSteps = [
        { step: 10, message: 'Analyzing educational standards...' },
        { step: 25, message: 'Generating content outline...' },
        { step: 50, message: 'Creating educational materials...' },
        { step: 75, message: 'Applying pedagogical best practices...' },
        { step: 90, message: 'Formatting and finalizing...' },
        { step: 100, message: 'Content generation complete!' }
      ];

      for (const { step, message } of progressSteps) {
        setGenerationProgress(step);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Generate mock content based on form data
      const newContent: EducationalContent = {
        id: `content-${Date.now()}`,
        title: `${formData.type.replace('-', ' ').toUpperCase()}: ${formData.topic}`,
        type: formData.type.includes('assessment') ? 'assessment' : 'lesson',
        targetAudience: formData.audience as any,
        subject: formData.subject,
        gradeLevel: formData.gradeLevel,
        standard: formData.standard,
        difficulty: 'intermediate',
        format: [formData.format],
        content: generateMockContent(formData),
        metadata: {
          duration: '45 minutes',
          materials: ['Whiteboard', 'Handouts', 'Digital presentation'],
          objectives: [
            `Students will understand ${formData.topic}`,
            `Students will apply concepts to real-world scenarios`,
            `Students will demonstrate mastery through assessment`
          ],
          tags: [formData.subject, formData.gradeLevel, formData.topic]
        },
        generatedAt: new Date()
      };

      setGeneratedContent(prev => [newContent, ...prev]);
      
    } catch (error) {
      console.error('Content generation failed:', error);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  }, [formData]);

  // Mock Content Generator
  const generateMockContent = (request: ContentGenerationRequest): string => {
    const templates = {
      'lesson-plans': `# ${request.topic} Lesson Plan\n\n## Learning Objectives\n- Students will understand key concepts of ${request.topic}\n- Students will apply knowledge through hands-on activities\n\n## Materials Needed\n- Textbook\n- Worksheets\n- Interactive whiteboard\n\n## Lesson Structure\n### Introduction (10 mins)\n- Hook students with engaging question\n- Review prior knowledge\n\n### Main Activity (25 mins)\n- Present new concepts\n- Guided practice\n- Independent work time\n\n### Closure (10 mins)\n- Review key points\n- Preview next lesson\n\n## Assessment\n- Formative: Exit ticket\n- Summative: Unit test\n\n## Differentiation\n- For advanced learners: Extension activities\n- For struggling learners: Additional scaffolding\n- For ELL students: Visual aids and vocabulary support`,
      
      'assessments': `# ${request.topic} Assessment\n\n## Multiple Choice Questions\n\n1. Which of the following best describes ${request.topic}?\na) Option A\nb) Option B\nc) Option C\nd) Option D\n\n## Short Answer Questions\n\n1. Explain the main concepts of ${request.topic} in your own words.\n\n2. Provide an example of how ${request.topic} applies to real life.\n\n## Essay Question\n\nDiscuss the importance of ${request.topic} in ${request.subject}. Support your answer with specific examples and evidence.\n\n## Rubric\n- Excellent (4): Demonstrates complete understanding\n- Proficient (3): Shows good understanding with minor gaps\n- Developing (2): Shows partial understanding\n- Beginning (1): Shows limited understanding`,
      
      'study-guides': `# ${request.topic} Study Guide\n\n## Key Concepts\n- Important concept 1\n- Important concept 2\n- Important concept 3\n\n## Vocabulary Terms\n- Term 1: Definition\n- Term 2: Definition\n- Term 3: Definition\n\n## Practice Questions\n1. Sample question about ${request.topic}\n2. Another practice question\n3. Application-based question\n\n## Study Tips\n- Review notes daily\n- Create concept maps\n- Practice with flashcards\n- Form study groups\n\n## Additional Resources\n- Recommended readings\n- Online videos\n- Practice websites`,
      
      default: `# ${request.topic} Educational Content\n\nThis is AI-generated educational content for ${request.subject} at the ${request.gradeLevel} level.\n\n## Overview\nComprehensive content covering key aspects of ${request.topic}.\n\n## Learning Outcomes\nStudents will gain understanding and practical skills related to the topic.\n\n## Implementation Guide\nStep-by-step instructions for effective delivery.`
    };

    return templates[request.type as keyof typeof templates] || templates.default;
  };

  // Get content types for current audience
  const currentContentTypes = useMemo(() => {
    return CONTENT_TYPES_BY_AUDIENCE[formData.audience as keyof typeof CONTENT_TYPES_BY_AUDIENCE] || [];
  }, [formData.audience]);

  return (
    <div 
      className="min-h-screen p-6 space-y-8"
      style={{
        backgroundColor: 'var(--ff-bg-dark)',
        fontFamily: 'var(--ff-font-secondary)'
      }}
    >
      {/* Header Section */}
      <div className="text-center space-y-6">
        <div 
          className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, var(--ff-primary) 0%, var(--ff-secondary) 50%, var(--ff-accent) 100%)',
            animation: 'pulseGlow 3s ease-in-out infinite'
          }}
        >
          <GraduationCap 
            className="w-8 h-8" 
            style={{ color: 'white' }}
          />
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
            Educational Content Studio
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
          Your AI-powered educational content creation platform. Generate standards-aligned lessons, 
          assessments, study materials, and resources for educators, students, and digital content creators.
        </p>

        {/* Key Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { label: 'Content Types', value: '20+', icon: BookOpen },
            { label: 'Grade Levels', value: '17', icon: GraduationCap },
            { label: 'Subjects', value: '10+', icon: School },
            { label: 'Standards', value: '6', icon: Target }
          ].map((stat, index) => (
            <Card 
              key={index}
              className="ff-card-interactive text-center"
              style={{
                background: 'var(--ff-gradient-surface)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--ff-radius-lg)'
              }}
            >
              <CardContent className="p-4">
                <stat.icon 
                  className="w-6 h-6 mx-auto mb-2"
                  style={{ color: 'var(--ff-primary)' }}
                />
                <div 
                  style={{
                    fontSize: 'var(--ff-text-2xl)',
                    fontWeight: 'var(--ff-weight-bold)',
                    color: 'var(--ff-text-primary)',
                    fontFamily: 'var(--ff-font-primary)'
                  }}
                >
                  {stat.value}
                </div>
                <div 
                  style={{
                    fontSize: 'var(--ff-text-sm)',
                    color: 'var(--ff-text-muted)'
                  }}
                >
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList 
          className="grid w-full grid-cols-4 max-w-4xl mx-auto"
          style={{
            background: 'var(--ff-surface)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--ff-radius-lg)',
            padding: 'var(--ff-space-1)'
          }}
        >
          {[
            { id: 'educator', label: 'For Educators', icon: Users },
            { id: 'student', label: 'For Students', icon: GraduationCap },
            { id: 'both', label: 'Shared Tools', icon: Brain },
            { id: 'seller', label: 'Digital Products', icon: ShoppingBag }
          ].map((tab) => (
            <TabsTrigger 
              key={tab.id}
              value={tab.id}
              className="ff-nav-item flex items-center gap-2 transition-all duration-300"
              style={{
                fontFamily: 'var(--ff-font-primary)',
                fontSize: 'var(--ff-text-sm)',
                fontWeight: 'var(--ff-weight-semibold)',
                color: activeTab === tab.id ? 'var(--ff-primary)' : 'var(--ff-text-muted)',
                borderRadius: 'var(--ff-radius)',
                backgroundColor: activeTab === tab.id ? 'rgba(255, 123, 0, 0.1)' : 'transparent'
              }}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Content Generation Interface */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Generation Form */}
          <Card 
            className="ff-card"
            style={{
              background: 'var(--ff-gradient-surface)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--ff-radius-lg)'
            }}
          >
            <CardHeader>
              <CardTitle 
                className="flex items-center gap-3"
                style={{
                  fontFamily: 'var(--ff-font-primary)',
                  fontSize: 'var(--ff-text-xl)',
                  fontWeight: 'var(--ff-weight-semibold)',
                  color: 'var(--ff-text-primary)'
                }}
              >
                <Lightbulb style={{ color: 'var(--ff-primary)' }} className="w-5 h-5" />
                Content Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Content Type Selection */}
              <div className="space-y-3">
                <label 
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-sm)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    color: 'var(--ff-text-primary)'
                  }}
                >
                  Content Type
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {currentContentTypes.map((type) => (
                    <Button
                      key={type.id}
                      variant={selectedContentType === type.id ? "default" : "outline"}
                      className="justify-start gap-3 h-auto p-4"
                      onClick={() => {
                        setSelectedContentType(type.id);
                        setFormData(prev => ({ ...prev, type: type.id, audience: activeTab }));
                      }}
                      style={{
                        backgroundColor: selectedContentType === type.id ? 'var(--ff-primary)' : 'transparent',
                        borderColor: selectedContentType === type.id ? 'var(--ff-primary)' : 'rgba(255, 255, 255, 0.2)',
                        color: selectedContentType === type.id ? 'white' : 'var(--ff-text-primary)',
                        fontFamily: 'var(--ff-font-primary)',
                        fontSize: 'var(--ff-text-sm)',
                        fontWeight: 'var(--ff-weight-medium)',
                        borderRadius: 'var(--ff-radius)',
                        transition: 'all var(--ff-animation-duration) var(--ff-animation-ease)'
                      }}
                    >
                      <type.icon className="w-4 h-4" />
                      <div className="text-left">
                        <div>{type.name}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <Separator style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

              {/* Subject Selection */}
              <div className="space-y-3">
                <label 
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-sm)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    color: 'var(--ff-text-primary)'
                  }}
                >
                  Subject Area
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SUBJECTS.map((subject) => (
                    <Button
                      key={subject.id}
                      variant={formData.subject === subject.id ? "default" : "outline"}
                      className="h-auto p-3 flex-col gap-1"
                      onClick={() => setFormData(prev => ({ ...prev, subject: subject.id }))}
                      style={{
                        backgroundColor: formData.subject === subject.id ? 'var(--ff-primary)' : 'transparent',
                        borderColor: formData.subject === subject.id ? 'var(--ff-primary)' : 'rgba(255, 255, 255, 0.2)',
                        color: formData.subject === subject.id ? 'white' : 'var(--ff-text-primary)',
                        fontFamily: 'var(--ff-font-primary)',
                        fontSize: 'var(--ff-text-xs)',
                        fontWeight: 'var(--ff-weight-medium)',
                        borderRadius: 'var(--ff-radius)',
                        transition: 'all var(--ff-animation-duration) var(--ff-animation-ease)'
                      }}
                    >
                      <subject.icon className={`w-4 h-4 ${subject.color}`} />
                      <span className="text-center leading-tight">{subject.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Grade Level and Standards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label 
                    style={{
                      fontFamily: 'var(--ff-font-primary)',
                      fontSize: 'var(--ff-text-sm)',
                      fontWeight: 'var(--ff-weight-semibold)',
                      color: 'var(--ff-text-primary)'
                    }}
                  >
                    Grade Level
                  </label>
                  <Select 
                    value={formData.gradeLevel} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, gradeLevel: value }))}
                  >
                    <SelectTrigger 
                      className="ff-input"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'var(--ff-text-primary)',
                        borderRadius: 'var(--ff-radius)'
                      }}
                    >
                      <SelectValue placeholder="Select grade level" />
                    </SelectTrigger>
                    <SelectContent 
                      style={{
                        backgroundColor: 'var(--ff-surface)',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'var(--ff-text-primary)'
                      }}
                    >
                      {GRADE_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label 
                    style={{
                      fontFamily: 'var(--ff-font-primary)',
                      fontSize: 'var(--ff-text-sm)',
                      fontWeight: 'var(--ff-weight-semibold)',
                      color: 'var(--ff-text-primary)'
                    }}
                  >
                    Educational Standard
                  </label>
                  <Select 
                    value={formData.standard} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, standard: value }))}
                  >
                    <SelectTrigger 
                      className="ff-input"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'var(--ff-text-primary)',
                        borderRadius: 'var(--ff-radius)'
                      }}
                    >
                      <SelectValue placeholder="Select standard" />
                    </SelectTrigger>
                    <SelectContent 
                      style={{
                        backgroundColor: 'var(--ff-surface)',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'var(--ff-text-primary)'
                      }}
                    >
                      {EDUCATIONAL_STANDARDS.map((standard) => (
                        <SelectItem key={standard} value={standard}>{standard}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Topic Input */}
              <div className="space-y-2">
                <label 
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-sm)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    color: 'var(--ff-text-primary)'
                  }}
                >
                  Topic or Learning Objective
                </label>
                <Input
                  value={formData.topic}
                  onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                  placeholder="e.g., Photosynthesis, American Revolution, Algebra Basics..."
                  className="ff-input"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'var(--ff-text-primary)',
                    fontSize: 'var(--ff-text-sm)',
                    borderRadius: 'var(--ff-radius)'
                  }}
                />
              </div>

              {/* Additional Specifications */}
              <div className="space-y-2">
                <label 
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-sm)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    color: 'var(--ff-text-primary)'
                  }}
                >
                  Additional Requirements (Optional)
                </label>
                <Textarea
                  value={formData.specifications}
                  onChange={(e) => setFormData(prev => ({ ...prev, specifications: e.target.value }))}
                  placeholder="Specific requirements, learning accommodations, format preferences..."
                  rows={3}
                  className="ff-input resize-none"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'var(--ff-text-primary)',
                    fontSize: 'var(--ff-text-sm)',
                    borderRadius: 'var(--ff-radius)'
                  }}
                />
              </div>

              {/* Generation Progress */}
              {isGenerating && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span 
                      style={{
                        fontSize: 'var(--ff-text-sm)',
                        color: 'var(--ff-text-secondary)'
                      }}
                    >
                      Generating content...
                    </span>
                    <span 
                      style={{
                        fontSize: 'var(--ff-text-sm)',
                        color: 'var(--ff-primary)',
                        fontWeight: 'var(--ff-weight-semibold)'
                      }}
                    >
                      {generationProgress}%
                    </span>
                  </div>
                  <Progress 
                    value={generationProgress} 
                    className="w-full"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      height: '8px',
                      borderRadius: 'var(--ff-radius-sm)'
                    }}
                  />
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleContentGeneration}
                disabled={isGenerating || !formData.type || !formData.subject || !formData.topic}
                className="w-full ff-btn-primary"
                style={{
                  backgroundColor: 'var(--ff-primary)',
                  color: 'white',
                  fontFamily: 'var(--ff-font-primary)',
                  fontSize: 'var(--ff-text-base)',
                  fontWeight: 'var(--ff-weight-semibold)',
                  padding: 'var(--ff-space-4) var(--ff-space-6)',
                  borderRadius: 'var(--ff-radius-lg)',
                  border: 'none',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  opacity: (isGenerating || !formData.type || !formData.subject || !formData.topic) ? 0.6 : 1,
                  transition: 'all var(--ff-animation-duration) var(--ff-animation-ease)'
                }}
                onMouseEnter={(e) => {
                  if (!isGenerating && formData.type && formData.subject && formData.topic) {
                    e.currentTarget.style.backgroundColor = 'var(--ff-primary-600)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = 'var(--ff-glow)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--ff-primary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Generating Educational Content...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Educational Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Content Display */}
          <Card 
            className="ff-card"
            style={{
              background: 'var(--ff-gradient-surface)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--ff-radius-lg)'
            }}
          >
            <CardHeader>
              <CardTitle 
                className="flex items-center justify-between"
                style={{
                  fontFamily: 'var(--ff-font-primary)',
                  fontSize: 'var(--ff-text-xl)',
                  fontWeight: 'var(--ff-weight-semibold)',
                  color: 'var(--ff-text-primary)'
                }}
              >
                <div className="flex items-center gap-3">
                  <FileText style={{ color: 'var(--ff-secondary)' }} className="w-5 h-5" />
                  Generated Content
                </div>
                {generatedContent.length > 0 && (
                  <Badge 
                    style={{
                      backgroundColor: 'rgba(0, 180, 216, 0.1)',
                      color: 'var(--ff-secondary)',
                      border: '1px solid rgba(0, 180, 216, 0.2)',
                      fontSize: 'var(--ff-text-xs)',
                      fontWeight: 'var(--ff-weight-semibold)'
                    }}
                  >
                    {generatedContent.length} items
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedContent.length === 0 ? (
                <div 
                  className="text-center py-12 space-y-4"
                  style={{ color: 'var(--ff-text-muted)' }}
                >
                  <div 
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  >
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 
                      style={{
                        fontFamily: 'var(--ff-font-primary)',
                        fontSize: 'var(--ff-text-lg)',
                        fontWeight: 'var(--ff-weight-semibold)',
                        color: 'var(--ff-text-secondary)',
                        marginBottom: 'var(--ff-space-2)'
                      }}
                    >
                      No content generated yet
                    </h3>
                    <p 
                      style={{
                        fontSize: 'var(--ff-text-sm)',
                        color: 'var(--ff-text-muted)'
                      }}
                    >
                      Fill out the form and click "Generate Educational Content" to create AI-powered educational materials.
                    </p>
                  </div>
                </div>
              ) : (
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {generatedContent.map((content) => (
                      <Card 
                        key={content.id}
                        className="ff-card-interactive"
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: 'var(--ff-radius)'
                        }}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <CardTitle 
                                style={{
                                  fontFamily: 'var(--ff-font-primary)',
                                  fontSize: 'var(--ff-text-base)',
                                  fontWeight: 'var(--ff-weight-semibold)',
                                  color: 'var(--ff-text-primary)',
                                  lineHeight: 'var(--ff-leading-snug)'
                                }}
                              >
                                {content.title}
                              </CardTitle>
                              <div className="flex flex-wrap gap-2">
                                <Badge 
                                  style={{
                                    backgroundColor: 'rgba(255, 123, 0, 0.1)',
                                    color: 'var(--ff-primary)',
                                    border: '1px solid rgba(255, 123, 0, 0.2)',
                                    fontSize: 'var(--ff-text-xs)'
                                  }}
                                >
                                  {content.subject}
                                </Badge>
                                <Badge 
                                  style={{
                                    backgroundColor: 'rgba(0, 180, 216, 0.1)',
                                    color: 'var(--ff-secondary)',
                                    border: '1px solid rgba(0, 180, 216, 0.2)',
                                    fontSize: 'var(--ff-text-xs)'
                                  }}
                                >
                                  {content.gradeLevel}
                                </Badge>
                                <Badge 
                                  style={{
                                    backgroundColor: 'rgba(233, 30, 99, 0.1)',
                                    color: 'var(--ff-accent)',
                                    border: '1px solid rgba(233, 30, 99, 0.2)',
                                    fontSize: 'var(--ff-text-xs)'
                                  }}
                                >
                                  {content.type}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="ff-btn-ghost"
                                style={{
                                  backgroundColor: 'transparent',
                                  borderColor: 'rgba(255, 255, 255, 0.2)',
                                  color: 'var(--ff-text-muted)',
                                  fontSize: 'var(--ff-text-xs)',
                                  padding: 'var(--ff-space-1) var(--ff-space-2)'
                                }}
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Export
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="ff-btn-ghost"
                                style={{
                                  backgroundColor: 'transparent',
                                  borderColor: 'rgba(255, 255, 255, 0.2)',
                                  color: 'var(--ff-text-muted)',
                                  fontSize: 'var(--ff-text-xs)',
                                  padding: 'var(--ff-space-1) var(--ff-space-2)'
                                }}
                              >
                                <Share2 className="w-3 h-3 mr-1" />
                                Share
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-4">
                            {/* Content Preview */}
                            <div 
                              className="p-4 rounded-lg"
                              style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: 'var(--ff-radius-sm)'
                              }}
                            >
                              <pre 
                                className="whitespace-pre-wrap text-wrap break-words"
                                style={{
                                  fontFamily: 'var(--ff-font-secondary)',
                                  fontSize: 'var(--ff-text-sm)',
                                  color: 'var(--ff-text-secondary)',
                                  lineHeight: 'var(--ff-leading-relaxed)',
                                  maxHeight: '200px',
                                  overflow: 'hidden'
                                }}
                              >
                                {content.content.substring(0, 500)}
                                {content.content.length > 500 && '...'}
                              </pre>
                            </div>

                            {/* Metadata */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span 
                                  style={{
                                    color: 'var(--ff-text-muted)',
                                    fontWeight: 'var(--ff-weight-medium)'
                                  }}
                                >
                                  Duration:
                                </span>
                                <span 
                                  style={{ 
                                    color: 'var(--ff-text-secondary)',
                                    marginLeft: 'var(--ff-space-2)'
                                  }}
                                >
                                  {content.metadata.duration}
                                </span>
                              </div>
                              <div>
                                <span 
                                  style={{
                                    color: 'var(--ff-text-muted)',
                                    fontWeight: 'var(--ff-weight-medium)'
                                  }}
                                >
                                  Standard:
                                </span>
                                <span 
                                  style={{ 
                                    color: 'var(--ff-text-secondary)',
                                    marginLeft: 'var(--ff-space-2)'
                                  }}
                                >
                                  {content.standard || 'Custom'}
                                </span>
                              </div>
                            </div>

                            {/* Learning Objectives */}
                            {content.metadata.objectives && (
                              <div>
                                <h4 
                                  style={{
                                    fontFamily: 'var(--ff-font-primary)',
                                    fontSize: 'var(--ff-text-sm)',
                                    fontWeight: 'var(--ff-weight-semibold)',
                                    color: 'var(--ff-text-primary)',
                                    marginBottom: 'var(--ff-space-2)'
                                  }}
                                >
                                  Learning Objectives:
                                </h4>
                                <ul className="list-disc list-inside space-y-1">
                                  {content.metadata.objectives.map((objective, index) => (
                                    <li 
                                      key={index}
                                      style={{
                                        fontSize: 'var(--ff-text-sm)',
                                        color: 'var(--ff-text-secondary)',
                                        lineHeight: 'var(--ff-leading-relaxed)'
                                      }}
                                    >
                                      {objective}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </Tabs>

      {/* Features Overview */}
      <Card 
        className="ff-card max-w-7xl mx-auto"
        style={{
          background: 'var(--ff-gradient-surface)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--ff-radius-lg)'
        }}
      >
        <CardHeader>
          <CardTitle 
            className="text-center"
            style={{
              fontFamily: 'var(--ff-font-primary)',
              fontSize: 'var(--ff-text-2xl)',
              fontWeight: 'var(--ff-weight-semibold)',
              color: 'var(--ff-text-primary)'
            }}
          >
            Comprehensive Educational Content Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'For Educators',
                description: 'Differentiated lesson plans, curriculum maps, assessment tools, and parent communication templates.',
                features: ['Standards-aligned content', 'Multiple learning styles', 'Assessment rubrics', 'Parent newsletters'],
                icon: Users,
                color: 'var(--ff-primary)'
              },
              {
                title: 'For Students',
                description: 'Personalized study paths, smart guides, flashcards, and essay assistance tools.',
                features: ['Adaptive learning paths', 'Interactive study guides', 'Practice assessments', 'Writing support'],
                icon: GraduationCap,
                color: 'var(--ff-secondary)'
              },
              {
                title: 'Shared Resources',
                description: 'Interactive presentations, learning games, project frameworks, and multi-language tools.',
                features: ['AI-powered slides', 'Interactive games', 'Collaboration tools', 'Language support'],
                icon: Brain,
                color: 'var(--ff-accent)'
              },
              {
                title: 'Digital Products',
                description: 'Marketable educational printables, study planners, exam prep kits, and resource bundles.',
                features: ['Printable worksheets', 'Study organizers', 'Exam preparation', 'Teacher bundles'],
                icon: ShoppingBag,
                color: 'var(--ff-success)'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="text-center space-y-4 p-6 rounded-lg ff-hover-lift"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--ff-radius-lg)',
                  transition: 'all var(--ff-animation-duration) var(--ff-animation-ease)'
                }}
              >
                <div 
                  className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${feature.color}, ${feature.color}99)`,
                    boxShadow: `0 8px 32px ${feature.color}33`
                  }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <div>
                  <h3 
                    style={{
                      fontFamily: 'var(--ff-font-primary)',
                      fontSize: 'var(--ff-text-lg)',
                      fontWeight: 'var(--ff-weight-semibold)',
                      color: 'var(--ff-text-primary)',
                      marginBottom: 'var(--ff-space-2)'
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p 
                    style={{
                      fontSize: 'var(--ff-text-sm)',
                      color: 'var(--ff-text-secondary)',
                      lineHeight: 'var(--ff-leading-relaxed)',
                      marginBottom: 'var(--ff-space-4)'
                    }}
                  >
                    {feature.description}
                  </p>
                </div>

                <div className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-2 text-left"
                      style={{ fontSize: 'var(--ff-text-xs)' }}
                    >
                      <Star 
                        className="w-3 h-3 flex-shrink-0"
                        style={{ color: feature.color }}
                      />
                      <span style={{ color: 'var(--ff-text-muted)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EducationalContentStudio;
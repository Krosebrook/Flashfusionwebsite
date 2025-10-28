/**
 * @fileoverview Educational Content Constants and Configuration
 * @chunk education
 * @category constants
 * @version 1.0.0
 * @author FlashFusion Team
 */

// Educational Standards
export const EDUCATIONAL_STANDARDS = [
  'Common Core State Standards',
  'Next Generation Science Standards (NGSS)',
  'International Baccalaureate (IB)',
  'Advanced Placement (AP)',
  'State Standards',
  'British National Curriculum',
  'Australian Curriculum',
  'Canadian Curriculum',
  'Custom Curriculum'
] as const;

// Grade Levels
export const GRADE_LEVELS = [
  'Pre-K',
  'Kindergarten',
  '1st Grade',
  '2nd Grade', 
  '3rd Grade',
  '4th Grade',
  '5th Grade',
  '6th Grade',
  '7th Grade',
  '8th Grade',
  '9th Grade',
  '10th Grade',
  '11th Grade',
  '12th Grade',
  'College/University',
  'Adult Education',
  'Professional Development'
] as const;

// Subject Areas
export const SUBJECTS = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    categories: ['Algebra', 'Geometry', 'Calculus', 'Statistics', 'Trigonometry', 'Number Theory'],
    color: '#3B82F6'
  },
  {
    id: 'science',
    name: 'Science',
    categories: ['Biology', 'Chemistry', 'Physics', 'Earth Science', 'Environmental Science', 'Astronomy'],
    color: '#10B981'
  },
  {
    id: 'english',
    name: 'English Language Arts',
    categories: ['Reading', 'Writing', 'Grammar', 'Literature', 'Poetry', 'Public Speaking'],
    color: '#8B5CF6'
  },
  {
    id: 'social-studies',
    name: 'Social Studies',
    categories: ['History', 'Geography', 'Civics', 'Economics', 'Anthropology', 'Sociology'],
    color: '#F59E0B'
  },
  {
    id: 'world-languages',
    name: 'World Languages',
    categories: ['Spanish', 'French', 'German', 'Mandarin', 'Japanese', 'Latin'],
    color: '#06B6D4'
  },
  {
    id: 'arts',
    name: 'Visual & Performing Arts',
    categories: ['Visual Arts', 'Music', 'Theater', 'Dance', 'Digital Arts', 'Art History'],
    color: '#EC4899'
  },
  {
    id: 'physical-education',
    name: 'Physical Education',
    categories: ['Fitness', 'Sports', 'Health', 'Nutrition', 'Safety', 'Recreation'],
    color: '#EF4444'
  },
  {
    id: 'technology',
    name: 'Technology & Computer Science',
    categories: ['Programming', 'Digital Literacy', 'Robotics', 'Web Design', 'Data Science', 'AI/ML'],
    color: '#6366F1'
  },
  {
    id: 'career-tech',
    name: 'Career & Technical Education',
    categories: ['Business', 'Engineering', 'Healthcare', 'Agriculture', 'Culinary Arts', 'Automotive'],
    color: '#84CC16'
  },
  {
    id: 'special-education',
    name: 'Special Education',
    categories: ['Learning Disabilities', 'Autism Support', 'Behavioral Support', 'Life Skills', 'Transition Services'],
    color: '#F97316'
  }
] as const;

// Content Types by Target Audience
export const CONTENT_TYPES = {
  educator: [
    {
      id: 'lesson-plans',
      name: 'Lesson Plans',
      description: 'Standards-aligned lesson plans with differentiation',
      formats: ['PDF', 'Word Doc', 'Google Docs', 'PowerPoint'],
      estimatedTime: '15-30 minutes'
    },
    {
      id: 'curriculum-maps',
      name: 'Curriculum Maps',
      description: 'Year-long pacing guides and scope & sequence',
      formats: ['Excel', 'PDF', 'Google Sheets'],
      estimatedTime: '45-60 minutes'
    },
    {
      id: 'assessment-tools',
      name: 'Assessment Tools',
      description: 'Quizzes, tests, rubrics, and evaluation forms',
      formats: ['PDF', 'Google Forms', 'Word Doc', 'Excel'],
      estimatedTime: '20-40 minutes'
    },
    {
      id: 'parent-communication',
      name: 'Parent Communication',
      description: 'Newsletters, progress reports, and communication templates',
      formats: ['PDF', 'Email Template', 'Word Doc'],
      estimatedTime: '10-20 minutes'
    },
    {
      id: 'classroom-activities',
      name: 'Classroom Activities',
      description: 'Interactive activities and engagement strategies',
      formats: ['PDF', 'PowerPoint', 'Interactive Worksheet'],
      estimatedTime: '25-35 minutes'
    }
  ],
  student: [
    {
      id: 'study-guides',
      name: 'Study Guides',
      description: 'Comprehensive study materials and summaries',
      formats: ['PDF', 'Interactive Webpage', 'Flashcards'],
      estimatedTime: '20-30 minutes'
    },
    {
      id: 'practice-tests',
      name: 'Practice Tests',
      description: 'Self-assessment quizzes and practice exams',
      formats: ['PDF', 'Interactive Quiz', 'Google Forms'],
      estimatedTime: '15-25 minutes'
    },
    {
      id: 'flashcards',
      name: 'Flashcards',
      description: 'Digital and printable flashcard sets',
      formats: ['Anki Export', 'Quizlet Export', 'PDF', 'Interactive'],
      estimatedTime: '10-15 minutes'
    },
    {
      id: 'essay-assistance',
      name: 'Essay Writing Tools',
      description: 'Outlines, thesis generators, and writing aids',
      formats: ['Word Doc', 'Google Docs', 'PDF Template'],
      estimatedTime: '30-45 minutes'
    },
    {
      id: 'study-schedules',
      name: 'Study Schedules',
      description: 'Personalized study plans and calendars',
      formats: ['PDF', 'Google Calendar', 'Excel'],
      estimatedTime: '15-20 minutes'
    }
  ],
  marketplace: [
    {
      id: 'printable-worksheets',
      name: 'Printable Worksheets',
      description: 'Ready-to-print educational worksheets',
      formats: ['PDF', 'PNG', 'SVG'],
      estimatedTime: '10-20 minutes'
    },
    {
      id: 'digital-planners',
      name: 'Digital Planners',
      description: 'Student and teacher planning templates',
      formats: ['PDF', 'Google Docs', 'Notion Template'],
      estimatedTime: '30-45 minutes'
    },
    {
      id: 'exam-prep-kits',
      name: 'Exam Prep Kits',
      description: 'Comprehensive test preparation packages',
      formats: ['PDF Bundle', 'Interactive Package', 'Video Series'],
      estimatedTime: '60-90 minutes'
    },
    {
      id: 'teacher-bundles',
      name: 'Teacher Resource Bundles',
      description: 'Complete unit or subject resource packages',
      formats: ['ZIP Bundle', 'Google Drive Folder', 'PDF Collection'],
      estimatedTime: '90-120 minutes'
    },
    {
      id: 'educational-games',
      name: 'Educational Games',
      description: 'Interactive learning games and activities',
      formats: ['Interactive Webpage', 'PDF Game', 'PowerPoint Game'],
      estimatedTime: '45-60 minutes'
    }
  ]
} as const;

// Learning Objectives Templates
export const LEARNING_OBJECTIVES = {
  bloom: [
    'Students will remember key facts about...',
    'Students will understand the concept of...',
    'Students will apply knowledge to solve...',
    'Students will analyze the relationship between...',
    'Students will evaluate different perspectives on...',
    'Students will create original solutions for...'
  ],
  smart: [
    'Students will demonstrate mastery by...',
    'Students will complete [specific task] with [accuracy level]...',
    'Students will achieve [learning goal] within [timeframe]...',
    'Students will show understanding through [assessment method]...'
  ],
  essential: [
    'Why is this knowledge important?',
    'How does this connect to real life?',
    'What patterns can students identify?',
    'How can students transfer this learning?'
  ]
} as const;

// Assessment Types
export const ASSESSMENT_TYPES = [
  {
    id: 'formative',
    name: 'Formative Assessment',
    description: 'Ongoing assessment during learning',
    examples: ['Exit tickets', 'Quick polls', 'Observation checklists', 'Learning journals']
  },
  {
    id: 'summative',
    name: 'Summative Assessment',
    description: 'Assessment of learning at the end',
    examples: ['Unit tests', 'Final projects', 'Standardized tests', 'Portfolios']
  },
  {
    id: 'diagnostic',
    name: 'Diagnostic Assessment',
    description: 'Assessment to identify prior knowledge',
    examples: ['Pre-tests', 'Skill inventories', 'Learning style assessments']
  },
  {
    id: 'authentic',
    name: 'Authentic Assessment',
    description: 'Real-world application assessment',
    examples: ['Performance tasks', 'Presentations', 'Case studies', 'Simulations']
  },
  {
    id: 'peer',
    name: 'Peer Assessment',
    description: 'Student-to-student evaluation',
    examples: ['Peer reviews', 'Group evaluations', 'Collaborative rubrics']
  },
  {
    id: 'self',
    name: 'Self Assessment',
    description: 'Student reflection and self-evaluation',
    examples: ['Self-checklists', 'Reflection journals', 'Goal setting']
  }
] as const;

// Differentiation Strategies
export const DIFFERENTIATION_STRATEGIES = {
  content: [
    'Varied reading levels',
    'Multiple resource types',
    'Choice in topics',
    'Flexible pacing',
    'Prerequisite skills support'
  ],
  process: [
    'Learning style accommodations',
    'Varied grouping strategies',
    'Multiple pathways to learning',
    'Flexible timelines',
    'Choice in learning activities'
  ],
  product: [
    'Multiple assessment formats',
    'Choice in final products',
    'Varied presentation methods',
    'Different complexity levels',
    'Alternative demonstrations'
  ],
  environment: [
    'Flexible seating options',
    'Varied learning spaces',
    'Noise level considerations',
    'Technology integration',
    'Accessibility accommodations'
  ]
} as const;

// Common Educational File Formats
export const FILE_FORMATS = [
  { id: 'pdf', name: 'PDF Document', extension: '.pdf', icon: '📄' },
  { id: 'docx', name: 'Word Document', extension: '.docx', icon: '📝' },
  { id: 'pptx', name: 'PowerPoint', extension: '.pptx', icon: '📊' },
  { id: 'xlsx', name: 'Excel Spreadsheet', extension: '.xlsx', icon: '📈' },
  { id: 'html', name: 'Interactive Webpage', extension: '.html', icon: '🌐' },
  { id: 'txt', name: 'Plain Text', extension: '.txt', icon: '📋' },
  { id: 'csv', name: 'CSV Data', extension: '.csv', icon: '📊' },
  { id: 'json', name: 'JSON Data', extension: '.json', icon: '💾' }
] as const;

// Educational Tool Categories
export const TOOL_CATEGORIES = [
  {
    id: 'content-creation',
    name: 'Content Creation',
    description: 'Tools for creating educational materials',
    icon: '✏️'
  },
  {
    id: 'assessment',
    name: 'Assessment & Evaluation',
    description: 'Testing and grading tools',
    icon: '📊'
  },
  {
    id: 'collaboration',
    name: 'Collaboration',
    description: 'Tools for group work and communication',
    icon: '👥'
  },
  {
    id: 'presentation',
    name: 'Presentation',
    description: 'Tools for creating presentations and visual aids',
    icon: '🎯'
  },
  {
    id: 'organization',
    name: 'Organization',
    description: 'Planning and scheduling tools',
    icon: '📅'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Data analysis and reporting tools', 
    icon: '📈'
  }
] as const;

// Popular Educational Platforms for Export
export const EDUCATIONAL_PLATFORMS = [
  {
    id: 'google-classroom',
    name: 'Google Classroom',
    formats: ['Google Docs', 'Google Sheets', 'Google Slides'],
    icon: '🏫'
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    formats: ['HTML', 'PDF', 'SCORM'],
    icon: '🎨'
  },
  {
    id: 'blackboard',
    name: 'Blackboard',
    formats: ['HTML', 'PDF', 'QTI'],
    icon: '⚫'
  },
  {
    id: 'moodle',
    name: 'Moodle',
    formats: ['HTML', 'PDF', 'SCORM'],
    icon: '🎓'
  },
  {
    id: 'schoology',
    name: 'Schoology',
    formats: ['PDF', 'Google Docs', 'HTML'],
    icon: '🏛️'
  },
  {
    id: 'edmodo',
    name: 'Edmodo',
    formats: ['PDF', 'Image', 'Document'],
    icon: '📚'
  }
] as const;

// Content Generation Presets
export const GENERATION_PRESETS = {
  'quick-lesson': {
    name: 'Quick Lesson (30 min)',
    duration: 30,
    sections: ['Objective', 'Introduction', 'Main Activity', 'Assessment', 'Closure'],
    defaultFormat: 'pdf'
  },
  'detailed-unit': {
    name: 'Detailed Unit Plan',
    duration: 90,
    sections: ['Unit Overview', 'Standards', 'Lessons', 'Assessments', 'Resources', 'Differentiation'],
    defaultFormat: 'docx'
  },
  'assessment-pack': {
    name: 'Assessment Package',
    duration: 45,
    sections: ['Instructions', 'Questions', 'Answer Key', 'Rubric', 'Extensions'],
    defaultFormat: 'pdf'
  },
  'study-materials': {
    name: 'Study Materials Set',
    duration: 60,
    sections: ['Study Guide', 'Flashcards', 'Practice Questions', 'Review Activities'],
    defaultFormat: 'multi'
  }
} as const;

// Quality Indicators for Generated Content
export const QUALITY_INDICATORS = [
  'Standards Alignment',
  'Age Appropriateness', 
  'Clear Learning Objectives',
  'Differentiation Options',
  'Assessment Integration',
  'Real-World Relevance',
  'Cultural Sensitivity',
  'Accessibility Features',
  'Engagement Strategies',
  'Technology Integration'
] as const;

export type EducationalStandard = typeof EDUCATIONAL_STANDARDS[number];
export type GradeLevel = typeof GRADE_LEVELS[number];
export type SubjectArea = typeof SUBJECTS[number]['id'];
export type ContentType = keyof typeof CONTENT_TYPES;
export type AssessmentType = typeof ASSESSMENT_TYPES[number]['id'];
export type FileFormat = typeof FILE_FORMATS[number]['id'];
export type ToolCategory = typeof TOOL_CATEGORIES[number]['id'];
export type EducationalPlatform = typeof EDUCATIONAL_PLATFORMS[number]['id'];
export type GenerationPreset = keyof typeof GENERATION_PRESETS;
/**
 * @fileoverview FlashFusion User Persona Cards
 * @chunk personas
 * @category pages
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Comprehensive user persona cards for SaaS platform with detailed feature mapping,
 * pain points analysis, workflow visualization, and success metrics tracking.
 * 
 * Features:
 * - Three distinct personas (Solo Creator, Development Team, Enterprise Client)
 * - Feature-to-persona mapping across all 65+ FlashFusion tools
 * - Visual design with avatars and color coding
 * - Interactive workflow visualization
 * - Device preference analysis
 * - Success metrics dashboard
 * - Pain point identification and solutions
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  User, 
  Users, 
  Building2, 
  Smartphone, 
  Monitor, 
  Tablet,
  Clock,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Zap,
  Code,
  Palette,
  Globe,
  BarChart3,
  Shield,
  Workflow,
  Brain,
  Rocket,
  Settings,
  Calendar,
  FileText,
  Database,
  Cloud,
  MessageSquare,
  Star,
  DollarSign,
  Users2,
  Briefcase,
  Award,
  PlayCircle,
  PieChart,
  Activity,
  BookOpen,
  Headphones,
  Lock,
  GitBranch,
  Package,
  Search,
  Filter,
  Download,
  Share2,
  Eye,
  Heart,
  ThumbsUp,
  Repeat,
  Hash,
  Image,
  Video,
  Music,
  Camera,
  Mic,
  Edit3,
  Layout,
  Layers,
  Grid,
  Move,
  RotateCcw,
  Save,
  Upload,
  Link,
  Mail,
  Phone,
  MapPin,
  Navigation,
  Compass,
  Home,
  Store,
  ShoppingCart,
  CreditCard,
  Truck,
  Package2,
  Receipt,
  PiggyBank
} from 'lucide-react';

// Persona interface definitions
interface PainPoint {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  frequency: 'rare' | 'occasional' | 'frequent' | 'constant';
  impact: number; // 1-10 scale
  solution?: string;
}

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  tools: string[];
  painPoints: string[];
  automation: boolean;
  complexity: 'low' | 'medium' | 'high';
}

interface FeatureUsage {
  category: string;
  features: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  usage: number; // percentage
  satisfaction: number; // 1-10 scale
}

interface DevicePreference {
  device: 'mobile' | 'tablet' | 'desktop' | 'multi-device';
  percentage: number;
  context: string;
  limitations?: string[];
}

interface SuccessMetric {
  id: string;
  name: string;
  target: string;
  current: string;
  progress: number;
  trend: 'up' | 'down' | 'stable';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface Persona {
  id: 'solo-creator' | 'development-team' | 'enterprise-client';
  name: string;
  subtitle: string;
  description: string;
  avatar: string;
  color: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  demographics: {
    age: string;
    experience: string;
    industry: string[];
    teamSize: string;
    budget: string;
    location: string;
  };
  painPoints: PainPoint[];
  workflow: WorkflowStep[];
  devicePreferences: DevicePreference[];
  featureUsage: FeatureUsage[];
  successMetrics: SuccessMetric[];
  goals: string[];
  frustrations: string[];
  motivations: string[];
  technicalSkills: {
    skill: string;
    level: number; // 1-10
  }[];
  preferredChannels: string[];
  decisionFactors: string[];
}

/**
 * FlashFusion User Persona Cards Component
 * 
 * Comprehensive persona analysis with feature mapping and behavioral insights
 */
export function UserPersonaCards() {
  const [selectedPersona, setSelectedPersona] = useState<string>('solo-creator');
  const [activeTab, setActiveTab] = useState('overview');

  // Comprehensive persona data
  const personas: Persona[] = useMemo(() => [
    {
      id: 'solo-creator',
      name: 'Solo Creator',
      subtitle: 'Independent Content Creator & Entrepreneur',
      description: 'Individual creators building personal brands and monetizing content across multiple platforms',
      avatar: '👨‍💻',
      color: {
        primary: '#FF7B00', // FlashFusion Primary Orange
        secondary: '#FFB866',
        accent: '#E66A00',
        background: 'linear-gradient(135deg, #FFF4E6 0%, #FFE8CC 100%)'
      },
      demographics: {
        age: '24-35 years',
        experience: '2-5 years content creation',
        industry: ['Content Creation', 'Personal Branding', 'Digital Marketing', 'E-commerce'],
        teamSize: '1 person (solo)',
        budget: '$50-500/month',
        location: 'Global (remote-first)'
      },
      painPoints: [
        {
          id: 'time-management',
          title: 'Time-Intensive Content Creation',
          description: 'Spending 6-8 hours daily on content creation, editing, and publishing across multiple platforms',
          severity: 'critical',
          frequency: 'constant',
          impact: 9,
          solution: 'AI-powered content generation and automation tools'
        },
        {
          id: 'technical-complexity',
          title: 'Technical Implementation Barriers',
          description: 'Lack of coding skills prevents implementing advanced features and integrations',
          severity: 'high',
          frequency: 'frequent',
          impact: 8,
          solution: 'No-code/low-code development tools and templates'
        },
        {
          id: 'platform-management',
          title: 'Multi-Platform Management Chaos',
          description: 'Managing content across 5-10 different platforms with different requirements',
          severity: 'high',
          frequency: 'constant',
          impact: 8,
          solution: 'Unified platform publishing and scheduling tools'
        },
        {
          id: 'monetization-optimization',
          title: 'Revenue Optimization Challenges',
          description: 'Difficulty identifying best monetization strategies and optimizing conversion rates',
          severity: 'medium',
          frequency: 'frequent',
          impact: 7,
          solution: 'AI-powered analytics and monetization recommendations'
        },
        {
          id: 'content-consistency',
          title: 'Brand Consistency Issues',
          description: 'Maintaining consistent branding and messaging across all content and platforms',
          severity: 'medium',
          frequency: 'frequent',
          impact: 6,
          solution: 'Brand kit generator and content templates'
        }
      ],
      workflow: [
        {
          id: 'ideation',
          title: 'Content Ideation & Planning',
          description: 'Brainstorming content ideas, researching trends, and planning content calendar',
          duration: '2-3 hours daily',
          tools: ['AI Content Generator', 'Trend Analysis', 'Content Calendar'],
          painPoints: ['time-management', 'content-consistency'],
          automation: true,
          complexity: 'medium'
        },
        {
          id: 'creation',
          title: 'Content Creation & Production',
          description: 'Creating videos, writing, designing graphics, and producing multimedia content',
          duration: '4-6 hours daily',
          tools: ['Image Generator', 'Video Editor', 'Brand Kit', 'Template Library'],
          painPoints: ['time-management', 'technical-complexity'],
          automation: true,
          complexity: 'high'
        },
        {
          id: 'optimization',
          title: 'SEO & Performance Optimization',
          description: 'Optimizing content for search engines and platform algorithms',
          duration: '1-2 hours daily',
          tools: ['SEO Optimizer', 'Analytics Dashboard', 'A/B Testing'],
          painPoints: ['technical-complexity', 'monetization-optimization'],
          automation: true,
          complexity: 'medium'
        },
        {
          id: 'publishing',
          title: 'Multi-Platform Publishing',
          description: 'Publishing and scheduling content across all social media and content platforms',
          duration: '1-2 hours daily',
          tools: ['Publishing Scheduler', 'Platform Integrations', 'Cross-posting Tools'],
          painPoints: ['platform-management', 'content-consistency'],
          automation: true,
          complexity: 'low'
        },
        {
          id: 'engagement',
          title: 'Community Engagement & Response',
          description: 'Responding to comments, engaging with audience, and building community',
          duration: '2-3 hours daily',
          tools: ['Social Media Manager', 'Comment Management', 'Community Tools'],
          painPoints: ['time-management', 'platform-management'],
          automation: false,
          complexity: 'low'
        },
        {
          id: 'monetization',
          title: 'Revenue Generation & Optimization',
          description: 'Managing sponsorships, affiliate marketing, product sales, and revenue streams',
          duration: '1-2 hours daily',
          tools: ['E-commerce Integration', 'Affiliate Manager', 'Revenue Analytics'],
          painPoints: ['monetization-optimization', 'technical-complexity'],
          automation: true,
          complexity: 'medium'
        }
      ],
      devicePreferences: [
        {
          device: 'mobile',
          percentage: 45,
          context: 'Content creation on-the-go, social media management, quick edits',
          limitations: ['Limited screen real estate', 'Processing power constraints']
        },
        {
          device: 'desktop',
          percentage: 40,
          context: 'Video editing, complex design work, analytics review, planning',
          limitations: ['Not portable', 'Setup time required']
        },
        {
          device: 'tablet',
          percentage: 15,
          context: 'Content review, lightweight editing, client presentations',
          limitations: ['Limited software availability', 'Input method constraints']
        }
      ],
      featureUsage: [
        {
          category: 'AI Content Generation',
          features: ['Text Generation', 'Image Generation', 'Video Scripts', 'Social Media Posts', 'Blog Articles'],
          priority: 'critical',
          usage: 95,
          satisfaction: 9
        },
        {
          category: 'Brand & Design Tools',
          features: ['Brand Kit Generator', 'Logo Creator', 'Template Library', 'Color Palette Generator'],
          priority: 'high',
          usage: 85,
          satisfaction: 8
        },
        {
          category: 'Publishing & Distribution',
          features: ['Multi-Platform Publishing', 'Content Scheduler', 'Auto-posting', 'Cross-platform Optimization'],
          priority: 'critical',
          usage: 90,
          satisfaction: 9
        },
        {
          category: 'Analytics & Optimization',
          features: ['Performance Analytics', 'SEO Optimizer', 'A/B Testing', 'Trend Analysis'],
          priority: 'high',
          usage: 75,
          satisfaction: 7
        },
        {
          category: 'Monetization Tools',
          features: ['E-commerce Integration', 'Affiliate Marketing', 'Sponsorship Manager', 'Revenue Tracking'],
          priority: 'high',
          usage: 70,
          satisfaction: 8
        },
        {
          category: 'Community Management',
          features: ['Comment Management', 'Social Listening', 'Engagement Analytics', 'Community Tools'],
          priority: 'medium',
          usage: 60,
          satisfaction: 7
        }
      ],
      successMetrics: [
        {
          id: 'content-output',
          name: 'Content Output Increase',
          target: '5x more content',
          current: '3.2x increase',
          progress: 64,
          trend: 'up',
          priority: 'critical'
        },
        {
          id: 'time-savings',
          name: 'Time Savings per Day',
          target: '4 hours saved',
          current: '2.8 hours saved',
          progress: 70,
          trend: 'up',
          priority: 'critical'
        },
        {
          id: 'revenue-growth',
          name: 'Monthly Revenue Growth',
          target: '200% increase',
          current: '145% increase',
          progress: 72,
          trend: 'up',
          priority: 'high'
        },
        {
          id: 'platform-reach',
          name: 'Platform Coverage',
          target: '10 platforms',
          current: '7 platforms',
          progress: 70,
          trend: 'up',
          priority: 'high'
        },
        {
          id: 'engagement-rate',
          name: 'Average Engagement Rate',
          target: '8% engagement',
          current: '5.2% engagement',
          progress: 65,
          trend: 'up',
          priority: 'medium'
        }
      ],
      goals: [
        'Scale content production to 10x current output',
        'Build sustainable passive income streams',
        'Establish strong personal brand across all platforms',
        'Automate 80% of content creation workflow',
        'Achieve 6-figure annual revenue'
      ],
      frustrations: [
        'Spending too much time on repetitive tasks',
        'Inconsistent content quality across platforms',
        'Difficulty keeping up with platform algorithm changes',
        'Limited technical skills for advanced implementations',
        'Burnout from constant content creation pressure'
      ],
      motivations: [
        'Creative freedom and independence',
        'Building a sustainable business',
        'Helping others through content',
        'Financial security and growth',
        'Recognition and influence in niche'
      ],
      technicalSkills: [
        { skill: 'Content Creation', level: 9 },
        { skill: 'Social Media Marketing', level: 8 },
        { skill: 'Basic Design', level: 6 },
        { skill: 'Video Editing', level: 7 },
        { skill: 'SEO Optimization', level: 5 },
        { skill: 'Analytics', level: 6 },
        { skill: 'Programming', level: 2 },
        { skill: 'Web Development', level: 3 }
      ],
      preferredChannels: [
        'YouTube tutorials',
        'Social media communities',
        'Creator forums',
        'Email newsletters',
        'Webinars and live streams'
      ],
      decisionFactors: [
        'Ease of use and learning curve',
        'Time savings and efficiency gains',
        'Cost-effectiveness and ROI',
        'Integration with existing tools',
        'Quality of AI-generated content',
        'Customer support and community'
      ]
    },
    {
      id: 'development-team',
      name: 'Development Team',
      subtitle: 'Collaborative Software Development Team',
      description: 'Small to medium development teams building applications and managing deployment workflows',
      avatar: '👥',
      color: {
        primary: '#00B4D8', // FlashFusion Secondary Cyan
        secondary: '#66D2E7',
        accent: '#00A2C2',
        background: 'linear-gradient(135deg, #E6F7FB 0%, #CCF0F7 100%)'
      },
      demographics: {
        age: '26-40 years',
        experience: '3-10 years development',
        industry: ['Software Development', 'SaaS', 'Web Development', 'Mobile Apps', 'Tech Startups'],
        teamSize: '3-15 developers',
        budget: '$500-5000/month',
        location: 'Distributed/hybrid teams'
      },
      painPoints: [
        {
          id: 'deployment-complexity',
          title: 'Complex Deployment Processes',
          description: 'Time-consuming manual deployment processes with high error rates and rollback challenges',
          severity: 'critical',
          frequency: 'frequent',
          impact: 9,
          solution: 'Automated CI/CD pipelines with one-click deployment'
        },
        {
          id: 'collaboration-overhead',
          title: 'Team Collaboration Inefficiencies',
          description: 'Code conflicts, communication gaps, and coordination challenges across distributed team members',
          severity: 'high',
          frequency: 'frequent',
          impact: 8,
          solution: 'Real-time collaboration tools and conflict resolution systems'
        },
        {
          id: 'code-quality',
          title: 'Inconsistent Code Quality',
          description: 'Varying code standards, insufficient testing, and technical debt accumulation',
          severity: 'high',
          frequency: 'frequent',
          impact: 8,
          solution: 'Automated code review and quality assurance tools'
        },
        {
          id: 'project-management',
          title: 'Project Coordination Challenges',
          description: 'Difficulty tracking progress, managing deadlines, and coordinating multiple projects',
          severity: 'medium',
          frequency: 'frequent',
          impact: 7,
          solution: 'Integrated project management and tracking systems'
        },
        {
          id: 'performance-monitoring',
          title: 'Limited Performance Visibility',
          description: 'Lack of real-time performance monitoring and proactive issue detection',
          severity: 'medium',
          frequency: 'occasional',
          impact: 6,
          solution: 'Comprehensive monitoring and alerting systems'
        }
      ],
      workflow: [
        {
          id: 'planning',
          title: 'Project Planning & Architecture',
          description: 'Requirements gathering, system design, and sprint planning',
          duration: '4-8 hours weekly',
          tools: ['Project Management', 'Architecture Planner', 'Requirements Tracker'],
          painPoints: ['project-management', 'collaboration-overhead'],
          automation: false,
          complexity: 'high'
        },
        {
          id: 'development',
          title: 'Code Development & Implementation',
          description: 'Writing code, implementing features, and building applications',
          duration: '6-8 hours daily',
          tools: ['Code Generator', 'IDE Integration', 'Template Library', 'Component Library'],
          painPoints: ['code-quality', 'collaboration-overhead'],
          automation: true,
          complexity: 'high'
        },
        {
          id: 'code-review',
          title: 'Code Review & Quality Assurance',
          description: 'Peer review, automated testing, and quality checks',
          duration: '2-3 hours daily',
          tools: ['AI Code Review', 'Automated Testing', 'Security Scanner', 'Quality Metrics'],
          painPoints: ['code-quality', 'collaboration-overhead'],
          automation: true,
          complexity: 'medium'
        },
        {
          id: 'testing',
          title: 'Testing & Bug Resolution',
          description: 'Unit testing, integration testing, and bug fixing',
          duration: '3-4 hours daily',
          tools: ['Test Automation', 'Bug Tracker', 'Performance Tester', 'Security Tester'],
          painPoints: ['code-quality', 'performance-monitoring'],
          automation: true,
          complexity: 'medium'
        },
        {
          id: 'deployment',
          title: 'Deployment & Release Management',
          description: 'Building, deploying, and releasing applications to production',
          duration: '2-4 hours per release',
          tools: ['CI/CD Pipeline', 'One-Click Deploy', 'Environment Manager', 'Release Tracker'],
          painPoints: ['deployment-complexity', 'performance-monitoring'],
          automation: true,
          complexity: 'high'
        },
        {
          id: 'monitoring',
          title: 'Performance Monitoring & Maintenance',
          description: 'Monitoring application performance, handling incidents, and maintenance',
          duration: '1-2 hours daily',
          tools: ['Performance Monitor', 'Alert System', 'Log Analyzer', 'Health Checker'],
          painPoints: ['performance-monitoring', 'deployment-complexity'],
          automation: true,
          complexity: 'medium'
        }
      ],
      devicePreferences: [
        {
          device: 'desktop',
          percentage: 70,
          context: 'Primary development work, code review, complex debugging, system administration',
          limitations: ['Not portable', 'Requires dedicated workspace']
        },
        {
          device: 'multi-device',
          percentage: 20,
          context: 'Synchronized work across desktop and laptop for flexibility',
          limitations: ['Synchronization complexity', 'Cost of multiple devices']
        },
        {
          device: 'mobile',
          percentage: 10,
          context: 'Quick status checks, notifications, emergency fixes, communication',
          limitations: ['Limited functionality', 'Small screen', 'Input constraints']
        }
      ],
      featureUsage: [
        {
          category: 'Development Tools',
          features: ['Code Generator', 'Full-Stack Builder', 'Template Library', 'Component Library', 'API Generator'],
          priority: 'critical',
          usage: 90,
          satisfaction: 9
        },
        {
          category: 'CI/CD & Deployment',
          features: ['Automated Pipeline', 'One-Click Deploy', 'Environment Manager', 'Release Automation'],
          priority: 'critical',
          usage: 85,
          satisfaction: 9
        },
        {
          category: 'Collaboration Tools',
          features: ['Live Code Collaboration', 'Team Workspace', 'Code Review System', 'Project Management'],
          priority: 'high',
          usage: 80,
          satisfaction: 8
        },
        {
          category: 'Quality Assurance',
          features: ['Automated Testing', 'Code Quality Scanner', 'Security Scanner', 'Performance Tester'],
          priority: 'high',
          usage: 75,
          satisfaction: 8
        },
        {
          category: 'Monitoring & Analytics',
          features: ['Performance Monitor', 'Error Tracking', 'Analytics Dashboard', 'Alert System'],
          priority: 'high',
          usage: 70,
          satisfaction: 7
        },
        {
          category: 'Integration & APIs',
          features: ['Third-party Integrations', 'API Management', 'Webhook System', 'Database Connectors'],
          priority: 'medium',
          usage: 65,
          satisfaction: 7
        }
      ],
      successMetrics: [
        {
          id: 'deployment-time',
          name: 'Deployment Time Reduction',
          target: '70% faster deployments',
          current: '52% improvement',
          progress: 74,
          trend: 'up',
          priority: 'critical'
        },
        {
          id: 'code-quality',
          name: 'Code Quality Score',
          target: '9.0/10 average',
          current: '7.8/10 average',
          progress: 87,
          trend: 'up',
          priority: 'high'
        },
        {
          id: 'bug-reduction',
          name: 'Production Bug Reduction',
          target: '60% fewer bugs',
          current: '41% reduction',
          progress: 68,
          trend: 'up',
          priority: 'high'
        },
        {
          id: 'team-velocity',
          name: 'Development Velocity',
          target: '40% faster delivery',
          current: '28% improvement',
          progress: 70,
          trend: 'up',
          priority: 'high'
        },
        {
          id: 'uptime',
          name: 'Application Uptime',
          target: '99.9% uptime',
          current: '99.2% uptime',
          progress: 99,
          trend: 'stable',
          priority: 'critical'
        }
      ],
      goals: [
        'Achieve 90% deployment automation',
        'Reduce production incidents by 80%',
        'Improve team collaboration efficiency',
        'Implement comprehensive monitoring',
        'Establish consistent code quality standards'
      ],
      frustrations: [
        'Manual deployment processes and rollback procedures',
        'Time spent on repetitive coding tasks',
        'Coordination challenges with distributed team',
        'Debugging production issues without proper monitoring',
        'Inconsistent development environments across team'
      ],
      motivations: [
        'Building robust, scalable applications',
        'Improving development team efficiency',
        'Delivering high-quality software on time',
        'Learning and adopting new technologies',
        'Career growth and technical leadership'
      ],
      technicalSkills: [
        { skill: 'Programming', level: 9 },
        { skill: 'Software Architecture', level: 8 },
        { skill: 'Database Design', level: 8 },
        { skill: 'DevOps/CI-CD', level: 7 },
        { skill: 'Cloud Platforms', level: 7 },
        { skill: 'API Development', level: 8 },
        { skill: 'Testing/QA', level: 7 },
        { skill: 'Performance Optimization', level: 6 }
      ],
      preferredChannels: [
        'Technical documentation',
        'Developer forums and communities',
        'GitHub and code repositories',
        'Technical blogs and tutorials',
        'Conference talks and webinars',
        'Slack/Discord communities'
      ],
      decisionFactors: [
        'Technical capabilities and features',
        'Integration with existing development stack',
        'Performance and reliability',
        'Developer experience and ease of use',
        'Scalability and enterprise features',
        'Community support and documentation',
        'Security and compliance features'
      ]
    },
    {
      id: 'enterprise-client',
      name: 'Enterprise Client',
      subtitle: 'Large Organization Technology Decision Maker',
      description: 'Enterprise-level organizations requiring scalable, secure, and compliant technology solutions',
      avatar: '🏢',
      color: {
        primary: '#E91E63', // FlashFusion Accent Magenta
        secondary: '#ED75A5',
        accent: '#D11B59',
        background: 'linear-gradient(135deg, #FCE8F0 0%, #F9D1E1 100%)'
      },
      demographics: {
        age: '35-55 years',
        experience: '10-25 years leadership',
        industry: ['Fortune 500', 'Financial Services', 'Healthcare', 'Manufacturing', 'Government'],
        teamSize: '50-500+ employees',
        budget: '$50,000-500,000+ annually',
        location: 'Global multi-location'
      },
      painPoints: [
        {
          id: 'scalability-concerns',
          title: 'Scalability and Performance at Enterprise Level',
          description: 'Concerns about system performance and scalability when serving millions of users',
          severity: 'critical',
          frequency: 'constant',
          impact: 10,
          solution: 'Enterprise-grade infrastructure with auto-scaling and load balancing'
        },
        {
          id: 'security-compliance',
          title: 'Security and Compliance Requirements',
          description: 'Meeting strict security standards, regulatory compliance, and audit requirements',
          severity: 'critical',
          frequency: 'constant',
          impact: 10,
          solution: 'SOC 2, GDPR, HIPAA compliance with advanced security features'
        },
        {
          id: 'integration-complexity',
          title: 'Complex System Integration Challenges',
          description: 'Integrating with legacy systems, multiple databases, and existing enterprise software',
          severity: 'high',
          frequency: 'frequent',
          impact: 9,
          solution: 'Enterprise API gateway and comprehensive integration framework'
        },
        {
          id: 'governance-control',
          title: 'Governance and Administrative Control',
          description: 'Need for centralized control, user management, and policy enforcement across organization',
          severity: 'high',
          frequency: 'constant',
          impact: 8,
          solution: 'Advanced admin controls, role-based access, and policy management'
        },
        {
          id: 'cost-optimization',
          title: 'Cost Management and ROI Optimization',
          description: 'Justifying large technology investments and optimizing total cost of ownership',
          severity: 'medium',
          frequency: 'frequent',
          impact: 7,
          solution: 'Detailed analytics, cost tracking, and ROI measurement tools'
        }
      ],
      workflow: [
        {
          id: 'evaluation',
          title: 'Technology Evaluation & Assessment',
          description: 'Comprehensive evaluation of technology solutions, security assessment, and vendor analysis',
          duration: '2-6 months',
          tools: ['Security Scanner', 'Compliance Checker', 'Performance Benchmarks', 'ROI Calculator'],
          painPoints: ['security-compliance', 'scalability-concerns'],
          automation: false,
          complexity: 'high'
        },
        {
          id: 'procurement',
          title: 'Procurement & Contract Negotiation',
          description: 'Legal review, contract negotiation, compliance verification, and purchase approval',
          duration: '1-3 months',
          tools: ['Contract Management', 'Compliance Dashboard', 'Vendor Portal', 'Legal Review Tools'],
          painPoints: ['security-compliance', 'cost-optimization'],
          automation: false,
          complexity: 'high'
        },
        {
          id: 'implementation',
          title: 'Enterprise Implementation & Integration',
          description: 'System deployment, legacy integration, user migration, and configuration management',
          duration: '3-12 months',
          tools: ['Enterprise Deployment', 'Integration Hub', 'Migration Tools', 'Configuration Manager'],
          painPoints: ['integration-complexity', 'scalability-concerns'],
          automation: true,
          complexity: 'high'
        },
        {
          id: 'training',
          title: 'Organization-wide Training & Adoption',
          description: 'Staff training, change management, user onboarding, and adoption measurement',
          duration: '2-6 months',
          tools: ['Training Platform', 'User Analytics', 'Adoption Tracker', 'Support System'],
          painPoints: ['governance-control', 'cost-optimization'],
          automation: false,
          complexity: 'medium'
        },
        {
          id: 'operations',
          title: 'Operations & Governance Management',
          description: 'Daily operations, user management, policy enforcement, and system administration',
          duration: 'Ongoing',
          tools: ['Admin Dashboard', 'User Management', 'Policy Engine', 'Monitoring Suite'],
          painPoints: ['governance-control', 'security-compliance'],
          automation: true,
          complexity: 'medium'
        },
        {
          id: 'optimization',
          title: 'Performance Optimization & ROI Analysis',
          description: 'Performance monitoring, cost analysis, ROI measurement, and continuous improvement',
          duration: 'Ongoing',
          tools: ['Enterprise Analytics', 'Cost Optimizer', 'Performance Monitor', 'ROI Dashboard'],
          painPoints: ['cost-optimization', 'scalability-concerns'],
          automation: true,
          complexity: 'medium'
        }
      ],
      devicePreferences: [
        {
          device: 'desktop',
          percentage: 50,
          context: 'Administrative work, detailed analysis, system configuration, strategic planning',
          limitations: ['Limited mobility', 'Office-bound usage']
        },
        {
          device: 'multi-device',
          percentage: 35,
          context: 'Seamless work across office desktop, laptop, and mobile for flexibility',
          limitations: ['Security concerns', 'Device management complexity']
        },
        {
          device: 'tablet',
          percentage: 15,
          context: 'Executive dashboards, presentations, mobile reviews, travel work',
          limitations: ['Limited functionality', 'Input method constraints']
        }
      ],
      featureUsage: [
        {
          category: 'Enterprise Security',
          features: ['Advanced Security Scanner', 'SOC 2 Compliance', 'GDPR Tools', 'Audit Logging', 'Access Control'],
          priority: 'critical',
          usage: 95,
          satisfaction: 9
        },
        {
          category: 'Administration & Governance',
          features: ['Enterprise Admin Panel', 'User Management', 'Role-Based Access', 'Policy Management', 'Compliance Dashboard'],
          priority: 'critical',
          usage: 90,
          satisfaction: 9
        },
        {
          category: 'Integration & APIs',
          features: ['Enterprise API Gateway', 'Legacy System Connectors', 'Database Integration', 'SSO Integration'],
          priority: 'critical',
          usage: 85,
          satisfaction: 8
        },
        {
          category: 'Analytics & Reporting',
          features: ['Enterprise Analytics', 'Custom Reports', 'ROI Dashboard', 'Usage Analytics', 'Cost Analysis'],
          priority: 'high',
          usage: 80,
          satisfaction: 8
        },
        {
          category: 'Scalability & Performance',
          features: ['Auto-scaling', 'Load Balancing', 'Performance Monitoring', 'Capacity Planning', 'Global CDN'],
          priority: 'critical',
          usage: 75,
          satisfaction: 8
        },
        {
          category: 'Support & Training',
          features: ['Dedicated Support', 'Training Platform', 'Documentation Portal', 'Change Management Tools'],
          priority: 'high',
          usage: 70,
          satisfaction: 7
        }
      ],
      successMetrics: [
        {
          id: 'roi-achievement',
          name: 'Return on Investment',
          target: '300% ROI within 12 months',
          current: '245% ROI achieved',
          progress: 82,
          trend: 'up',
          priority: 'critical'
        },
        {
          id: 'user-adoption',
          name: 'Organization-wide Adoption',
          target: '95% user adoption',
          current: '78% adoption',
          progress: 82,
          trend: 'up',
          priority: 'critical'
        },
        {
          id: 'security-score',
          name: 'Security Compliance Score',
          target: '100% compliance',
          current: '96% compliance',
          progress: 96,
          trend: 'up',
          priority: 'critical'
        },
        {
          id: 'system-uptime',
          name: 'Enterprise System Uptime',
          target: '99.99% uptime SLA',
          current: '99.95% uptime',
          progress: 99,
          trend: 'stable',
          priority: 'critical'
        },
        {
          id: 'cost-reduction',
          name: 'Operational Cost Reduction',
          target: '40% cost reduction',
          current: '32% reduction',
          progress: 80,
          trend: 'up',
          priority: 'high'
        }
      ],
      goals: [
        'Achieve enterprise-grade security and compliance',
        'Scale system to serve millions of users',
        'Integrate seamlessly with existing enterprise systems',
        'Demonstrate clear ROI and business value',
        'Minimize operational overhead and maintenance costs'
      ],
      frustrations: [
        'Lengthy procurement and approval processes',
        'Complexity of integrating with legacy systems',
        'Difficulty proving ROI and business value',
        'Security and compliance audit overhead',
        'Vendor lock-in and inflexible contracts'
      ],
      motivations: [
        'Competitive advantage through technology',
        'Operational efficiency and cost reduction',
        'Risk mitigation and regulatory compliance',
        'Innovation and digital transformation',
        'Employee productivity and satisfaction'
      ],
      technicalSkills: [
        { skill: 'Strategic Planning', level: 9 },
        { skill: 'Technology Assessment', level: 8 },
        { skill: 'Vendor Management', level: 8 },
        { skill: 'Compliance Management', level: 9 },
        { skill: 'Enterprise Architecture', level: 7 },
        { skill: 'Change Management', level: 8 },
        { skill: 'Budget Management', level: 9 },
        { skill: 'Risk Assessment', level: 8 }
      ],
      preferredChannels: [
        'Enterprise sales representatives',
        'Industry conferences and events',
        'Professional networks and referrals',
        'Analyst reports (Gartner, Forrester)',
        'Executive briefings and demos',
        'Peer recommendations and case studies'
      ],
      decisionFactors: [
        'Security and compliance certifications',
        'Scalability and enterprise-grade performance',
        'Total cost of ownership and ROI',
        'Integration capabilities with existing systems',
        'Vendor stability and long-term support',
        'Reference customers and case studies',
        'Contractual terms and service level agreements'
      ]
    }
  ], []);

  const selectedPersonaData = personas.find(p => p.id === selectedPersona) || personas[0];

  // Utility functions for rendering
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'warning';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      case 'stable': return <ArrowRight className="w-4 h-4 text-gray-500" />;
      default: return <ArrowRight className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)] p-6" style={{ fontFamily: 'var(--ff-font-secondary)' }}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 ff-fade-in-up">
          <Badge className="ff-badge-primary mb-4">
            <Users className="w-4 h-4 mr-2" />
            FlashFusion User Personas
          </Badge>
          
          <h1 className="ff-text-display">
            Know Your
            <span className="ff-text-gradient"> Users</span>
          </h1>
          
          <p className="ff-text-body max-w-3xl mx-auto">
            Comprehensive user persona analysis mapping every FlashFusion feature to specific user needs, 
            workflows, and success metrics across three primary user segments.
          </p>
        </div>

        {/* Persona Selection */}
        <div className="flex justify-center space-x-4 ff-stagger-fade">
          {personas.map((persona) => (
            <Button
              key={persona.id}
              variant={selectedPersona === persona.id ? "default" : "outline"}
              onClick={() => setSelectedPersona(persona.id)}
              className={`ff-btn-${selectedPersona === persona.id ? 'primary' : 'outline'} px-6 py-3`}
              style={{
                borderColor: selectedPersona === persona.id ? persona.color.primary : undefined,
                backgroundColor: selectedPersona === persona.id ? persona.color.primary : undefined
              }}
            >
              <span className="text-2xl mr-2">{persona.avatar}</span>
              {persona.name}
            </Button>
          ))}
        </div>

        {/* Main Persona Card */}
        <Card 
          className="ff-card overflow-hidden"
          style={{ 
            borderTopColor: selectedPersonaData.color.primary,
            borderTopWidth: '4px'
          }}
        >
          {/* Persona Header */}
          <div 
            className="p-8 text-white relative overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${selectedPersonaData.color.primary} 0%, ${selectedPersonaData.color.accent} 100%)`
            }}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 text-8xl opacity-20">
                {selectedPersonaData.avatar}
              </div>
            </div>
            
            <div className="relative z-10 grid md:grid-cols-3 gap-8">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="text-6xl mb-4">{selectedPersonaData.avatar}</div>
                <h2 className="text-3xl font-bold">{selectedPersonaData.name}</h2>
                <p className="text-xl opacity-90">{selectedPersonaData.subtitle}</p>
                <p className="text-base opacity-80">{selectedPersonaData.description}</p>
              </div>

              {/* Demographics */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold mb-3">Demographics</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Age:</strong> {selectedPersonaData.demographics.age}</div>
                  <div><strong>Experience:</strong> {selectedPersonaData.demographics.experience}</div>
                  <div><strong>Team Size:</strong> {selectedPersonaData.demographics.teamSize}</div>
                  <div><strong>Budget:</strong> {selectedPersonaData.demographics.budget}</div>
                  <div><strong>Industries:</strong> {selectedPersonaData.demographics.industry.join(', ')}</div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold mb-3">Key Metrics</h3>
                <div className="space-y-3">
                  {selectedPersonaData.successMetrics.slice(0, 3).map((metric) => (
                    <div key={metric.id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{metric.name}</span>
                        <span>{metric.progress}%</span>
                      </div>
                      <Progress value={metric.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Tabs */}
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6 bg-[var(--ff-surface)] border-b border-[var(--border)]">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="painpoints" className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Pain Points
                </TabsTrigger>
                <TabsTrigger value="workflow" className="flex items-center gap-2">
                  <Workflow className="w-4 h-4" />
                  Workflow
                </TabsTrigger>
                <TabsTrigger value="features" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Features
                </TabsTrigger>
                <TabsTrigger value="devices" className="flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  Devices
                </TabsTrigger>
                <TabsTrigger value="metrics" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Success
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="p-8 space-y-8">
                <div className="grid md:grid-cols-3 gap-8">
                  
                  {/* Goals */}
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-green-500" />
                        Primary Goals
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedPersonaData.goals.map((goal, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-sm">{goal}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Frustrations */}
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        Key Frustrations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedPersonaData.frustrations.map((frustration, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                          <span className="text-sm">{frustration}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Motivations */}
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-pink-500" />
                        Core Motivations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedPersonaData.motivations.map((motivation, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Heart className="w-4 h-4 text-pink-500 mt-1 flex-shrink-0" />
                          <span className="text-sm">{motivation}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Technical Skills */}
                <Card className="ff-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-blue-500" />
                      Technical Skills Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {selectedPersonaData.technicalSkills.map((skill, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{skill.skill}</span>
                            <span className="text-[var(--ff-text-muted)]">{skill.level}/10</span>
                          </div>
                          <Progress value={skill.level * 10} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pain Points Tab */}
              <TabsContent value="painpoints" className="p-8">
                <div className="grid gap-6">
                  {selectedPersonaData.painPoints.map((painPoint) => (
                    <Card key={painPoint.id} className="ff-card">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <CardTitle className="flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5 text-red-500" />
                              {painPoint.title}
                            </CardTitle>
                            <div className="flex gap-2">
                              <Badge variant={getSeverityColor(painPoint.severity)} className="text-xs">
                                {painPoint.severity}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {painPoint.frequency}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-red-500">{painPoint.impact}</div>
                            <div className="text-xs text-[var(--ff-text-muted)]">Impact Score</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-[var(--ff-text-secondary)]">{painPoint.description}</p>
                        {painPoint.solution && (
                          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="font-medium text-green-800 dark:text-green-200">FlashFusion Solution</span>
                            </div>
                            <p className="text-sm text-green-700 dark:text-green-300">{painPoint.solution}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Workflow Tab */}
              <TabsContent value="workflow" className="p-8">
                <div className="space-y-6">
                  {selectedPersonaData.workflow.map((step, index) => (
                    <Card key={step.id} className="ff-card">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[var(--ff-primary)] text-white flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            {step.title}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant={step.automation ? "default" : "outline"} className="text-xs">
                              {step.automation ? 'Automated' : 'Manual'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {step.complexity} complexity
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <p className="text-[var(--ff-text-secondary)]">{step.description}</p>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-[var(--ff-text-muted)]" />
                              <span className="text-[var(--ff-text-muted)]">Duration: {step.duration}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium mb-2 flex items-center gap-2">
                                <Zap className="w-4 h-4" />
                                Required Tools
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {step.tools.map((tool) => (
                                  <Badge key={tool} variant="secondary" className="text-xs">
                                    {tool}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            {step.painPoints.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4 text-red-500" />
                                  Associated Pain Points
                                </h4>
                                <div className="flex flex-wrap gap-1">
                                  {step.painPoints.map((painPointId) => {
                                    const painPoint = selectedPersonaData.painPoints.find(p => p.id === painPointId);
                                    return painPoint ? (
                                      <Badge key={painPointId} variant="destructive" className="text-xs">
                                        {painPoint.title.split(' ').slice(0, 2).join(' ')}
                                      </Badge>
                                    ) : null;
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Features Tab */}
              <TabsContent value="features" className="p-8">
                <div className="grid gap-6">
                  {selectedPersonaData.featureUsage.map((category) => (
                    <Card key={category.category} className="ff-card">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5" style={{ color: selectedPersonaData.color.primary }} />
                            {category.category}
                          </CardTitle>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm text-[var(--ff-text-muted)]">Usage</div>
                              <div className="font-bold">{category.usage}%</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-[var(--ff-text-muted)]">Satisfaction</div>
                              <div className="font-bold">{category.satisfaction}/10</div>
                            </div>
                            <Badge 
                              variant={category.priority === 'critical' ? 'destructive' : category.priority === 'high' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {category.priority}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Progress value={category.usage} className="h-3 mb-2" />
                            <div className="text-sm text-[var(--ff-text-muted)]">Usage Rate: {category.usage}%</div>
                          </div>
                          <div>
                            <Progress value={category.satisfaction * 10} className="h-3 mb-2" />
                            <div className="text-sm text-[var(--ff-text-muted)]">Satisfaction: {category.satisfaction}/10</div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-3">Included Features</h4>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {category.features.map((feature) => (
                              <div key={feature} className="flex items-center gap-2 p-2 bg-[var(--ff-surface)] rounded-lg">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Devices Tab */}
              <TabsContent value="devices" className="p-8">
                <div className="space-y-8">
                  
                  {/* Device Preference Overview */}
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Monitor className="w-5 h-5" />
                        Device Usage Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {selectedPersonaData.devicePreferences.map((device) => {
                          const DeviceIcon = device.device === 'mobile' ? Smartphone : 
                                           device.device === 'tablet' ? Tablet : 
                                           device.device === 'desktop' ? Monitor : Monitor;
                          
                          return (
                            <div key={device.device} className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <DeviceIcon className="w-6 h-6" style={{ color: selectedPersonaData.color.primary }} />
                                  <div>
                                    <h3 className="font-medium capitalize">{device.device.replace('-', ' ')}</h3>
                                    <p className="text-sm text-[var(--ff-text-muted)]">{device.context}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold" style={{ color: selectedPersonaData.color.primary }}>
                                    {device.percentage}%
                                  </div>
                                </div>
                              </div>
                              
                              <Progress value={device.percentage} className="h-3" />
                              
                              {device.limitations && (
                                <div className="ml-9 space-y-1">
                                  <h4 className="text-sm font-medium text-[var(--ff-text-muted)]">Limitations:</h4>
                                  {device.limitations.map((limitation, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <AlertTriangle className="w-3 h-3 text-yellow-500" />
                                      <span className="text-xs text-[var(--ff-text-muted)]">{limitation}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Device-Specific Insights */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="ff-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="w-5 h-5" />
                          Preferred Channels
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedPersonaData.preferredChannels.map((channel, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm">{channel}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="ff-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Scale className="w-5 h-5" />
                          Decision Factors
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedPersonaData.decisionFactors.map((factor, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm">{factor}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Success Metrics Tab */}
              <TabsContent value="metrics" className="p-8">
                <div className="grid gap-6">
                  {selectedPersonaData.successMetrics.map((metric) => (
                    <Card key={metric.id} className="ff-card">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Target className="w-5 h-5" style={{ color: selectedPersonaData.color.primary }} />
                            {metric.name}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(metric.trend)}
                            <Badge variant={metric.priority === 'critical' ? 'destructive' : metric.priority === 'high' ? 'default' : 'secondary'}>
                              {metric.priority}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-6">
                          <div>
                            <div className="text-sm text-[var(--ff-text-muted)] mb-1">Target</div>
                            <div className="text-lg font-bold text-green-600">{metric.target}</div>
                          </div>
                          <div>
                            <div className="text-sm text-[var(--ff-text-muted)] mb-1">Current</div>
                            <div className="text-lg font-bold" style={{ color: selectedPersonaData.color.primary }}>
                              {metric.current}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-[var(--ff-text-muted)] mb-1">Progress</div>
                            <div className="text-lg font-bold">{metric.progress}%</div>
                          </div>
                        </div>
                        
                        <div>
                          <Progress value={metric.progress} className="h-4" />
                          <div className="flex justify-between text-xs text-[var(--ff-text-muted)] mt-2">
                            <span>0%</span>
                            <span>Target: 100%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Summary Insights */}
        <Card className="ff-card">
          <CardHeader>
            <CardTitle className="text-center">
              Key Insights for {selectedPersonaData.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" 
                     style={{ backgroundColor: `${selectedPersonaData.color.primary}20` }}>
                  <AlertTriangle className="w-8 h-8" style={{ color: selectedPersonaData.color.primary }} />
                </div>
                <h3 className="font-semibold">Top Pain Point</h3>
                <p className="text-sm text-[var(--ff-text-muted)]">
                  {selectedPersonaData.painPoints[0]?.title}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" 
                     style={{ backgroundColor: `${selectedPersonaData.color.primary}20` }}>
                  <Zap className="w-8 h-8" style={{ color: selectedPersonaData.color.primary }} />
                </div>
                <h3 className="font-semibold">Most Used Feature</h3>
                <p className="text-sm text-[var(--ff-text-muted)]">
                  {selectedPersonaData.featureUsage.reduce((max, current) => 
                    current.usage > max.usage ? current : max
                  ).category}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" 
                     style={{ backgroundColor: `${selectedPersonaData.color.primary}20` }}>
                  <Target className="w-8 h-8" style={{ color: selectedPersonaData.color.primary }} />
                </div>
                <h3 className="font-semibold">Primary Success Metric</h3>
                <p className="text-sm text-[var(--ff-text-muted)]">
                  {selectedPersonaData.successMetrics.find(m => m.priority === 'critical')?.name || 
                   selectedPersonaData.successMetrics[0]?.name}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UserPersonaCards;
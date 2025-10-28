/**
 * @fileoverview FlashFusion Waitlist System
 * @chunk waitlist
 * @category marketing
 * @version 1.0.0
 * 
 * Comprehensive waitlist system with automated workflows, Slack integration,
 * and email notifications for FlashFusion early access program.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { 
  Mail, 
  User, 
  Building, 
  Briefcase, 
  Users, 
  Sparkles, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  X,
  Star,
  Zap,
  Crown,
  Gift,
  MessageSquare,
  Calendar,
  Globe
} from 'lucide-react';

interface WaitlistSystemProps {
  onClose: () => void;
  source?: string; // Track where the signup came from
}

type UserType = 'individual' | 'startup' | 'agency' | 'enterprise';
type InterestLevel = 'curious' | 'interested' | 'very-interested' | 'ready-to-buy';

interface WaitlistSignup {
  // Basic Information
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  jobTitle?: string;
  website?: string;
  
  // User Classification
  userType: UserType;
  teamSize: string;
  interestLevel: InterestLevel;
  
  // Interests & Use Cases
  primaryUseCase: string;
  interests: string[];
  currentTools: string[];
  
  // Communication Preferences
  newsletter: boolean;
  productUpdates: boolean;
  earlyAccess: boolean;
  
  // Open-ended
  comments: string;
  referralSource: string;
  
  // Metadata
  source: string;
  submittedAt: string;
}

export function WaitlistSystem({ onClose, source = 'landing-page' }: WaitlistSystemProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [waitlistPosition, setWaitlistPosition] = useState<number>(0);

  const [formData, setFormData] = useState<WaitlistSignup>({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    jobTitle: '',
    website: '',
    userType: 'individual',
    teamSize: '1',
    interestLevel: 'interested',
    primaryUseCase: '',
    interests: [],
    currentTools: [],
    newsletter: true,
    productUpdates: true,
    earlyAccess: true,
    comments: '',
    referralSource: '',
    source,
    submittedAt: ''
  });

  const totalSteps = 4;

  const userTypes = [
    { 
      value: 'individual', 
      label: 'Individual Creator', 
      icon: <User className="w-5 h-5" />, 
      description: 'Personal projects and creative work',
      priority: 'Standard'
    },
    { 
      value: 'startup', 
      label: 'Startup', 
      icon: <Zap className="w-5 h-5" />, 
      description: 'Early-stage company building products',
      priority: 'High'
    },
    { 
      value: 'agency', 
      label: 'Agency/Freelancer', 
      icon: <Briefcase className="w-5 h-5" />, 
      description: 'Serving clients and building solutions',
      priority: 'High'
    },
    { 
      value: 'enterprise', 
      label: 'Enterprise', 
      icon: <Building className="w-5 h-5" />, 
      description: 'Large organization with complex needs',
      priority: 'Priority'
    }
  ];

  const interestLevels = [
    { value: 'curious', label: 'Just Curious', color: 'bg-gray-500', description: 'Learning about the space' },
    { value: 'interested', label: 'Interested', color: 'bg-blue-500', description: 'Actively researching solutions' },
    { value: 'very-interested', label: 'Very Interested', color: 'bg-yellow-500', description: 'Likely to adopt early' },
    { value: 'ready-to-buy', label: 'Ready to Buy', color: 'bg-green-500', description: 'Ready to purchase when available' }
  ];

  const useCases = [
    'Content Creation & Marketing',
    'Web Development & Apps',
    'AI Model Integration',
    'Workflow Automation',
    'Team Collaboration',
    'Client Work & Services',
    'Product Development',
    'Research & Experimentation',
    'Other'
  ];

  const interestAreas = [
    'AI Code Generation',
    'Content Creation Tools',
    'Deployment Automation',
    'Team Collaboration',
    'Analytics & Insights',
    'Security & Compliance',
    'API Integrations',
    'Custom Workflows',
    'Mobile Development',
    'E-commerce Tools'
  ];

  const currentToolsOptions = [
    'GitHub/GitLab',
    'Vercel/Netlify',
    'AWS/Google Cloud',
    'Figma/Adobe Creative',
    'Notion/Airtable',
    'Slack/Discord',
    'Zapier/Make',
    'ChatGPT/Claude',
    'Cursor/VS Code',
    'Other AI Tools'
  ];

  const referralSources = [
    'Search Engine (Google, etc.)',
    'Social Media (Twitter, LinkedIn, etc.)',
    'Friend/Colleague Recommendation',
    'Blog/Article',
    'YouTube/Video',
    'Newsletter',
    'Community/Forum',
    'Conference/Event',
    'Advertisement',
    'Other'
  ];

  const handleInputChange = useCallback((field: keyof WaitlistSignup, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field-specific errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleArrayFieldToggle = useCallback((field: 'interests' | 'currentTools', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  }, []);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        
        if (!formData.firstName.trim()) {
          newErrors.firstName = 'First name is required';
        }
        
        if (!formData.lastName.trim()) {
          newErrors.lastName = 'Last name is required';
        }
        break;

      case 2:
        // Optional validation for step 2
        break;

      case 3:
        if (!formData.primaryUseCase.trim()) {
          newErrors.primaryUseCase = 'Please select your primary use case';
        }
        break;

      case 4:
        // Comments are optional, no validation needed
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitToSlack = async (signup: WaitlistSignup): Promise<void> => {
    const slackPayload = {
      text: `🚀 New FlashFusion Waitlist Signup!`,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `🚀 New Waitlist Signup - ${signup.userType.toUpperCase()}`
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Name:*\n${signup.firstName} ${signup.lastName}`
            },
            {
              type: "mrkdwn",
              text: `*Email:*\n${signup.email}`
            },
            {
              type: "mrkdwn",
              text: `*Company:*\n${signup.company || 'Not provided'}`
            },
            {
              type: "mrkdwn",
              text: `*User Type:*\n${userTypes.find(u => u.value === signup.userType)?.label}`
            }
          ]
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Interest Level:*\n${interestLevels.find(i => i.value === signup.interestLevel)?.label}`
            },
            {
              type: "mrkdwn",
              text: `*Team Size:*\n${signup.teamSize} people`
            },
            {
              type: "mrkdwn",
              text: `*Primary Use Case:*\n${signup.primaryUseCase}`
            },
            {
              type: "mrkdwn",
              text: `*Source:*\n${signup.referralSource || signup.source}`
            }
          ]
        }
      ]
    };

    if (signup.interests.length > 0) {
      slackPayload.blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Interests:*\n${signup.interests.join(', ')}`
        }
      });
    }

    if (signup.currentTools.length > 0) {
      slackPayload.blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Current Tools:*\n${signup.currentTools.join(', ')}`
        }
      });
    }

    if (signup.comments.trim()) {
      slackPayload.blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Comments:*\n${signup.comments}`
        }
      });
    }

    // Priority indicator
    const priority = userTypes.find(u => u.value === signup.userType)?.priority || 'Standard';
    const priorityEmoji = priority === 'Priority' ? '🔥' : priority === 'High' ? '⭐' : '👤';
    
    slackPayload.blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Priority Level:* ${priorityEmoji} ${priority}`
      }
    });

    // Simulate API call to Slack webhook
    console.log('Sending to Slack:', slackPayload);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const sendEmailNotification = async (signup: WaitlistSignup, position: number): Promise<void> => {
    // Email to kylerosebrook@gmail.com
    const emailData = {
      to: 'kylerosebrook@gmail.com',
      subject: `New FlashFusion Waitlist Signup - ${signup.firstName} ${signup.lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #FF7B00 0%, #00B4D8 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">FlashFusion Waitlist</h1>
            <p style="color: white; margin: 5px 0 0 0;">New Signup #${position}</p>
          </div>
          
          <div style="padding: 20px; background: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Contact Information</h2>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <p><strong>Name:</strong> ${signup.firstName} ${signup.lastName}</p>
              <p><strong>Email:</strong> ${signup.email}</p>
              <p><strong>Company:</strong> ${signup.company || 'Not provided'}</p>
              <p><strong>Job Title:</strong> ${signup.jobTitle || 'Not provided'}</p>
              <p><strong>Website:</strong> ${signup.website || 'Not provided'}</p>
            </div>
            
            <h3 style="color: #FF7B00;">User Profile</h3>
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <p><strong>User Type:</strong> ${userTypes.find(u => u.value === signup.userType)?.label}</p>
              <p><strong>Team Size:</strong> ${signup.teamSize} people</p>
              <p><strong>Interest Level:</strong> ${interestLevels.find(i => i.value === signup.interestLevel)?.label}</p>
              <p><strong>Priority:</strong> ${userTypes.find(u => u.value === signup.userType)?.priority}</p>
            </div>
            
            <h3 style="color: #00B4D8;">Use Case & Interests</h3>
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <p><strong>Primary Use Case:</strong> ${signup.primaryUseCase}</p>
              ${signup.interests.length > 0 ? `<p><strong>Interests:</strong> ${signup.interests.join(', ')}</p>` : ''}
              ${signup.currentTools.length > 0 ? `<p><strong>Current Tools:</strong> ${signup.currentTools.join(', ')}</p>` : ''}
            </div>
            
            ${signup.comments ? `
            <h3 style="color: #E91E63;">Comments</h3>
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <p style="white-space: pre-wrap;">${signup.comments}</p>
            </div>
            ` : ''}
            
            <h3 style="color: #333;">Communication Preferences</h3>
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <p><strong>Newsletter:</strong> ${signup.newsletter ? 'Yes' : 'No'}</p>
              <p><strong>Product Updates:</strong> ${signup.productUpdates ? 'Yes' : 'No'}</p>
              <p><strong>Early Access:</strong> ${signup.earlyAccess ? 'Yes' : 'No'}</p>
            </div>
            
            <div style="background: #e8f4f8; padding: 15px; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #666;">
                <strong>Referral Source:</strong> ${signup.referralSource || signup.source}<br>
                <strong>Waitlist Position:</strong> #${position}<br>
                <strong>Submitted:</strong> ${new Date(signup.submittedAt).toLocaleString()}
              </p>
            </div>
          </div>
          
          <div style="background: #333; padding: 15px; text-align: center;">
            <p style="color: #ccc; margin: 0; font-size: 12px;">
              FlashFusion AI Development Platform
            </p>
          </div>
        </div>
      `
    };

    // Simulate email sending
    console.log('Sending email notification:', emailData);
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    
    try {
      // Generate waitlist position (simulate based on current time)
      const position = Math.floor(Math.random() * 1000) + 500; // Simulate 500-1500 range
      setWaitlistPosition(position);
      
      // Complete form data
      const completeFormData = {
        ...formData,
        submittedAt: new Date().toISOString()
      };
      
      // Submit to Slack
      await submitToSlack(completeFormData);
      
      // Send email notification
      await sendEmailNotification(completeFormData, position);
      
      // Store locally for reference
      const existingSignups = JSON.parse(localStorage.getItem('ff-waitlist-signups') || '[]');
      existingSignups.push({ ...completeFormData, position });
      localStorage.setItem('ff-waitlist-signups', JSON.stringify(existingSignups));
      
      // Mark as submitted
      setIsSubmitted(true);
      
    } catch (error) {
      console.error('Failed to submit waitlist signup:', error);
      setErrors({ submit: 'Failed to join waitlist. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-lg bg-[var(--ff-surface)] border-[var(--ff-primary)]/20 shadow-2xl">
          <CardHeader className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[var(--ff-primary)] to-[var(--ff-secondary)] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--ff-font-primary)' }}>
                Welcome to FlashFusion!
              </h2>
              <p className="text-[var(--ff-text-muted)]">
                You're now on the waitlist for early access
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-[var(--ff-primary)]/20 to-[var(--ff-secondary)]/20 border border-[var(--ff-primary)]/30 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Crown className="w-6 h-6 text-[var(--ff-primary)]" />
                <span className="text-xl font-bold text-white">#{waitlistPosition}</span>
              </div>
              <p className="text-sm text-[var(--ff-text-muted)]">Your position on the waitlist</p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--ff-font-primary)' }}>
                What happens next?
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[var(--ff-primary)] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Email Confirmation</p>
                    <p className="text-xs text-[var(--ff-text-muted)]">Check your inbox for a welcome email with next steps</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[var(--ff-secondary)] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Early Access Updates</p>
                    <p className="text-xs text-[var(--ff-text-muted)]">Get exclusive updates on development progress</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[var(--ff-accent)] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Priority Access</p>
                    <p className="text-xs text-[var(--ff-text-muted)]">Be among the first to access FlashFusion when we launch</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Gift className="w-4 h-4 text-[var(--ff-primary)]" />
                <span className="text-sm font-medium text-white">Early Bird Benefits</span>
              </div>
              <ul className="text-xs text-[var(--ff-text-muted)] space-y-1">
                <li>• 50% off first 3 months when we launch</li>
                <li>• Exclusive access to beta features</li>
                <li>• Direct line to the development team</li>
                <li>• Priority customer support</li>
              </ul>
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-[var(--ff-primary)] to-[var(--ff-secondary)] hover:from-[var(--ff-primary-600)] hover:to-[var(--ff-secondary-600)] text-white font-semibold"
              >
                Awesome!
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Let's get started</h3>
              <p className="text-sm text-[var(--ff-text-muted)]">Basic information to create your waitlist profile</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">First Name *</label>
                <Input
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`bg-white/5 border-white/20 text-white placeholder:text-[var(--ff-text-muted)] ${
                    errors.firstName ? 'border-red-500' : 'focus:border-[var(--ff-primary)]'
                  }`}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.firstName}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Last Name *</label>
                <Input
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`bg-white/5 border-white/20 text-white placeholder:text-[var(--ff-text-muted)] ${
                    errors.lastName ? 'border-red-500' : 'focus:border-[var(--ff-primary)]'
                  }`}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--ff-text-muted)]" />
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`pl-10 bg-white/5 border-white/20 text-white placeholder:text-[var(--ff-text-muted)] ${
                    errors.email ? 'border-red-500' : 'focus:border-[var(--ff-primary)]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Company</label>
                <Input
                  type="text"
                  placeholder="Acme Inc."
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-[var(--ff-text-muted)] focus:border-[var(--ff-primary)]"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Job Title</label>
                <Input
                  type="text"
                  placeholder="Developer"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-[var(--ff-text-muted)] focus:border-[var(--ff-primary)]"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Tell us about yourself</h3>
              <p className="text-sm text-[var(--ff-text-muted)]">This helps us prioritize access and tailor the experience</p>
            </div>
            
            <div className="space-y-4">
              <label className="text-sm font-medium text-white">What best describes you? *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {userTypes.map((type) => (
                  <div
                    key={type.value}
                    onClick={() => handleInputChange('userType', type.value)}
                    className={`cursor-pointer p-4 rounded-lg border transition-all ${
                      formData.userType === type.value
                        ? 'bg-[var(--ff-primary)]/20 border-[var(--ff-primary)] text-white'
                        : 'bg-white/5 border-white/20 text-[var(--ff-text-muted)] hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`mt-1 ${formData.userType === type.value ? 'text-[var(--ff-primary)]' : 'text-[var(--ff-text-muted)]'}`}>
                        {type.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium">{type.label}</h3>
                          <Badge variant="outline" className={`text-xs ${
                            type.priority === 'Priority' ? 'border-red-400 text-red-400' :
                            type.priority === 'High' ? 'border-yellow-400 text-yellow-400' :
                            'border-gray-400 text-gray-400'
                          }`}>
                            {type.priority}
                          </Badge>
                        </div>
                        <p className="text-xs opacity-80 mt-1">{type.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Team Size</label>
                <select
                  value={formData.teamSize}
                  onChange={(e) => handleInputChange('teamSize', e.target.value)}
                  className="w-full bg-white/5 border border-white/20 text-white rounded-lg px-3 py-2 focus:border-[var(--ff-primary)] focus:outline-none"
                >
                  <option value="1">Just me</option>
                  <option value="2-5">2-5 people</option>
                  <option value="6-20">6-20 people</option>
                  <option value="21-100">21-100 people</option>
                  <option value="100+">100+ people</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Interest Level</label>
                <select
                  value={formData.interestLevel}
                  onChange={(e) => handleInputChange('interestLevel', e.target.value as InterestLevel)}
                  className="w-full bg-white/5 border border-white/20 text-white rounded-lg px-3 py-2 focus:border-[var(--ff-primary)] focus:outline-none"
                >
                  {interestLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Your interests</h3>
              <p className="text-sm text-[var(--ff-text-muted)]">Help us understand what you're looking for</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white mb-3 block">Primary Use Case *</label>
                <select
                  value={formData.primaryUseCase}
                  onChange={(e) => handleInputChange('primaryUseCase', e.target.value)}
                  className={`w-full bg-white/5 border border-white/20 text-white rounded-lg px-3 py-2 focus:outline-none ${
                    errors.primaryUseCase ? 'border-red-500' : 'focus:border-[var(--ff-primary)]'
                  }`}
                >
                  <option value="">Select your primary use case</option>
                  {useCases.map((useCase) => (
                    <option key={useCase} value={useCase}>{useCase}</option>
                  ))}
                </select>
                {errors.primaryUseCase && (
                  <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.primaryUseCase}
                  </p>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-white mb-3 block">
                  What interests you most? (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {interestAreas.map((interest) => (
                    <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={formData.interests.includes(interest)}
                        onCheckedChange={() => handleArrayFieldToggle('interests', interest)}
                      />
                      <span className="text-sm text-[var(--ff-text-muted)]">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-white mb-3 block">
                  What tools do you currently use? (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {currentToolsOptions.map((tool) => (
                    <label key={tool} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={formData.currentTools.includes(tool)}
                        onCheckedChange={() => handleArrayFieldToggle('currentTools', tool)}
                      />
                      <span className="text-sm text-[var(--ff-text-muted)]">{tool}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Almost done!</h3>
              <p className="text-sm text-[var(--ff-text-muted)]">Final details and communication preferences</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">How did you hear about us?</label>
                <select
                  value={formData.referralSource}
                  onChange={(e) => handleInputChange('referralSource', e.target.value)}
                  className="w-full bg-white/5 border border-white/20 text-white rounded-lg px-3 py-2 focus:border-[var(--ff-primary)] focus:outline-none"
                >
                  <option value="">Select source</option>
                  {referralSources.map((source) => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Anything else you'd like us to know?
                </label>
                <Textarea
                  placeholder="Tell us about your specific needs, questions, or anything else..."
                  value={formData.comments}
                  onChange={(e) => handleInputChange('comments', e.target.value)}
                  rows={4}
                  className="bg-white/5 border-white/20 text-white placeholder:text-[var(--ff-text-muted)] focus:border-[var(--ff-primary)] resize-none"
                />
                <p className="text-xs text-[var(--ff-text-muted)]">
                  This helps us better understand your needs and prioritize features
                </p>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium text-white">Communication Preferences</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <Checkbox
                      checked={formData.newsletter}
                      onCheckedChange={(checked) => handleInputChange('newsletter', checked)}
                    />
                    <span className="text-sm text-[var(--ff-text-muted)]">
                      Newsletter & product updates (monthly)
                    </span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <Checkbox
                      checked={formData.productUpdates}
                      onCheckedChange={(checked) => handleInputChange('productUpdates', checked)}
                    />
                    <span className="text-sm text-[var(--ff-text-muted)]">
                      Development progress updates (weekly)
                    </span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <Checkbox
                      checked={formData.earlyAccess}
                      onCheckedChange={(checked) => handleInputChange('earlyAccess', checked)}
                    />
                    <span className="text-sm text-[var(--ff-text-muted)]">
                      Early access invitations and beta testing
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-[var(--ff-surface)] border-[var(--ff-primary)]/20 shadow-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 p-0 hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--ff-primary)] to-[var(--ff-secondary)] rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--ff-font-primary)' }}>
                  Join the FlashFusion Waitlist
                </h1>
                <p className="text-sm text-[var(--ff-text-muted)]">Get early access to the future of AI development</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--ff-text-muted)]">Step {currentStep} of {totalSteps}</span>
                <span className="text-[var(--ff-text-muted)]">{Math.round((currentStep / totalSteps) * 100)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[var(--ff-primary)] to-[var(--ff-secondary)] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStep()}

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-sm text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {errors.submit}
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-gradient-to-r from-[var(--ff-primary)] to-[var(--ff-secondary)] hover:from-[var(--ff-primary-600)] hover:to-[var(--ff-secondary-600)] text-white font-semibold"
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[var(--ff-primary)] to-[var(--ff-secondary)] hover:from-[var(--ff-primary-600)] hover:to-[var(--ff-secondary-600)] text-white font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Joining Waitlist...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Join Waitlist
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default WaitlistSystem;
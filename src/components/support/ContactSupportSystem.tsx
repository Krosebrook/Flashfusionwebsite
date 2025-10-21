/**
 * @fileoverview FlashFusion Contact Support System
 * @chunk support
 * @category customer-support
 * @version 1.0.0
 * 
 * Comprehensive contact support system with multiple channels, 
 * automated ticket creation, and real-time notifications.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  X,
  User,
  MessageCircle,
  Calendar,
  Zap,
  LifeBuoy,
  FileText,
  Sparkles
} from 'lucide-react';

interface ContactSupportSystemProps {
  onClose: () => void;
  initialSubject?: string;
  initialCategory?: string;
}

type SupportCategory = 'technical' | 'billing' | 'feature-request' | 'bug-report' | 'general';
type Priority = 'low' | 'medium' | 'high' | 'urgent';

interface SupportTicket {
  name: string;
  email: string;
  subject: string;
  category: SupportCategory;
  priority: Priority;
  message: string;
  attachments?: File[];
}

export function ContactSupportSystem({ 
  onClose, 
  initialSubject = '', 
  initialCategory = 'general' 
}: ContactSupportSystemProps) {
  const [formData, setFormData] = useState<SupportTicket>({
    name: '',
    email: '',
    subject: initialSubject,
    category: initialCategory as SupportCategory,
    priority: 'medium',
    message: '',
    attachments: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ticketId, setTicketId] = useState<string>('');

  const categories = [
    { 
      value: 'technical', 
      label: 'Technical Support', 
      icon: <Zap className="w-4 h-4" />, 
      description: 'Platform issues, integrations, API problems',
      responseTime: '2-4 hours'
    },
    { 
      value: 'billing', 
      label: 'Billing & Payments', 
      icon: <FileText className="w-4 h-4" />, 
      description: 'Subscription, invoices, payment issues',
      responseTime: '4-8 hours'
    },
    { 
      value: 'feature-request', 
      label: 'Feature Request', 
      icon: <Sparkles className="w-4 h-4" />, 
      description: 'Suggest new features or improvements',
      responseTime: '1-2 days'
    },
    { 
      value: 'bug-report', 
      label: 'Bug Report', 
      icon: <AlertCircle className="w-4 h-4" />, 
      description: 'Report bugs or unexpected behavior',
      responseTime: '1-4 hours'
    },
    { 
      value: 'general', 
      label: 'General Inquiry', 
      icon: <MessageCircle className="w-4 h-4" />, 
      description: 'Questions, feedback, or other topics',
      responseTime: '4-12 hours'
    }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-green-500', description: 'General questions' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500', description: 'Standard issues' },
    { value: 'high', label: 'High', color: 'bg-orange-500', description: 'Affecting workflow' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-500', description: 'Critical business impact' }
  ];

  // Load user info if available
  useEffect(() => {
    const userInfo = localStorage.getItem('ff-user-info');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        setFormData(prev => ({
          ...prev,
          name: user.name || '',
          email: user.email || ''
        }));
      } catch (error) {
        console.error('Failed to load user info:', error);
      }
    }
  }, []);

  const handleInputChange = useCallback((field: keyof SupportTicket, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field-specific errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitToSlack = async (ticket: SupportTicket): Promise<void> => {
    // In a real implementation, this would be a webhook to Slack
    const slackPayload = {
      text: `🎫 New Support Ticket from FlashFusion`,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `🎫 New Support Ticket - ${ticket.category.toUpperCase()}`
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Name:*\n${ticket.name}`
            },
            {
              type: "mrkdwn",
              text: `*Email:*\n${ticket.email}`
            },
            {
              type: "mrkdwn",
              text: `*Subject:*\n${ticket.subject}`
            },
            {
              type: "mrkdwn",
              text: `*Priority:*\n${ticket.priority.toUpperCase()}`
            }
          ]
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Message:*\n${ticket.message}`
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Category:* ${categories.find(c => c.value === ticket.category)?.label}\n*Response Time:* ${categories.find(c => c.value === ticket.category)?.responseTime}`
          }
        }
      ]
    };

    // Simulate API call to Slack webhook
    console.log('Sending to Slack:', slackPayload);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const sendEmailNotification = async (ticket: SupportTicket, ticketId: string): Promise<void> => {
    // Email to kylerosebrook@gmail.com
    const emailData = {
      to: 'kylerosebrook@gmail.com',
      subject: `New FlashFusion Support Ticket #${ticketId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #FF7B00 0%, #00B4D8 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">FlashFusion Support</h1>
            <p style="color: white; margin: 5px 0 0 0;">New Support Ticket</p>
          </div>
          
          <div style="padding: 20px; background: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Ticket #${ticketId}</h2>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <h3 style="margin-top: 0; color: #FF7B00;">Customer Information</h3>
              <p><strong>Name:</strong> ${ticket.name}</p>
              <p><strong>Email:</strong> ${ticket.email}</p>
              <p><strong>Category:</strong> ${categories.find(c => c.value === ticket.category)?.label}</p>
              <p><strong>Priority:</strong> ${ticket.priority.toUpperCase()}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <h3 style="margin-top: 0; color: #00B4D8;">Subject</h3>
              <p>${ticket.subject}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #E91E63;">Message</h3>
              <p style="white-space: pre-wrap;">${ticket.message}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e8f4f8; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #666;">
                <strong>Expected Response Time:</strong> ${categories.find(c => c.value === ticket.category)?.responseTime}
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Generate ticket ID
      const newTicketId = `FF-${Date.now().toString().slice(-6)}`;
      setTicketId(newTicketId);
      
      // Submit to Slack
      await submitToSlack(formData);
      
      // Send email notification
      await sendEmailNotification(formData, newTicketId);
      
      // Mark as submitted
      setIsSubmitted(true);
      
      // Store ticket info locally for reference
      const ticketData = {
        id: newTicketId,
        ...formData,
        submittedAt: new Date().toISOString(),
        status: 'submitted'
      };
      
      const existingTickets = JSON.parse(localStorage.getItem('ff-support-tickets') || '[]');
      existingTickets.push(ticketData);
      localStorage.setItem('ff-support-tickets', JSON.stringify(existingTickets));
      
    } catch (error) {
      console.error('Failed to submit support ticket:', error);
      setErrors({ submit: 'Failed to submit ticket. Please try again or use alternative contact methods.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md bg-[var(--ff-surface)] border-[var(--ff-primary)]/20 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--ff-font-primary)' }}>
                Ticket Submitted Successfully!
              </h2>
              <p className="text-sm text-[var(--ff-text-muted)] mt-2">
                We've received your request and will respond soon.
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="bg-[var(--ff-primary)]/10 border border-[var(--ff-primary)]/20 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <LifeBuoy className="w-5 h-5 text-[var(--ff-primary)]" />
                <div>
                  <h3 className="text-sm font-semibold text-white">Ticket Details</h3>
                  <p className="text-xs text-[var(--ff-text-muted)]">Reference for your records</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--ff-text-muted)]">Ticket ID:</span>
                  <span className="text-white font-mono">#{ticketId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--ff-text-muted)]">Category:</span>
                  <span className="text-white">{categories.find(c => c.value === formData.category)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--ff-text-muted)]">Expected Response:</span>
                  <span className="text-white">{categories.find(c => c.value === formData.category)?.responseTime}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white">What happens next?</h4>
              <div className="space-y-2 text-xs text-[var(--ff-text-muted)]">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[var(--ff-primary)] rounded-full"></div>
                  <span>You'll receive an email confirmation shortly</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[var(--ff-secondary)] rounded-full"></div>
                  <span>Our team will review your request</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[var(--ff-accent)] rounded-full"></div>
                  <span>We'll respond within the expected timeframe</span>
                </div>
              </div>
            </div>
            
            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-[var(--ff-primary)] to-[var(--ff-secondary)] hover:from-[var(--ff-primary-600)] hover:to-[var(--ff-secondary-600)] text-white font-semibold"
            >
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                <LifeBuoy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--ff-font-primary)' }}>
                  Contact Support
                </h1>
                <p className="text-sm text-[var(--ff-text-muted)]">Get help from our expert team</p>
              </div>
            </div>

            {/* Support Channels */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                <MessageSquare className="w-5 h-5 text-[var(--ff-primary)] mx-auto mb-1" />
                <p className="text-xs text-white font-medium">Live Chat</p>
                <p className="text-xs text-[var(--ff-text-muted)]">24/7 Available</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                <Mail className="w-5 h-5 text-[var(--ff-secondary)] mx-auto mb-1" />
                <p className="text-xs text-white font-medium">Email</p>
                <p className="text-xs text-[var(--ff-text-muted)]">2-12 Hours</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                <Phone className="w-5 h-5 text-[var(--ff-accent)] mx-auto mb-1" />
                <p className="text-xs text-white font-medium">Phone</p>
                <p className="text-xs text-[var(--ff-text-muted)]">Business Hours</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--ff-text-muted)]" />
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`pl-10 bg-white/5 border-white/20 text-white placeholder:text-[var(--ff-text-muted)] ${
                      errors.name ? 'border-red-500' : 'focus:border-[var(--ff-primary)]'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--ff-text-muted)]" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
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
            </div>

            {/* Category Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">Category *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categories.map((category) => (
                  <div
                    key={category.value}
                    onClick={() => handleInputChange('category', category.value)}
                    className={`cursor-pointer p-4 rounded-lg border transition-all ${
                      formData.category === category.value
                        ? 'bg-[var(--ff-primary)]/20 border-[var(--ff-primary)] text-white'
                        : 'bg-white/5 border-white/20 text-[var(--ff-text-muted)] hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`mt-1 ${formData.category === category.value ? 'text-[var(--ff-primary)]' : 'text-[var(--ff-text-muted)]'}`}>
                        {category.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium">{category.label}</h3>
                        <p className="text-xs opacity-80 mt-1">{category.description}</p>
                        <div className="flex items-center space-x-1 mt-2">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs">{category.responseTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">Priority</label>
              <div className="flex flex-wrap gap-2">
                {priorities.map((priority) => (
                  <Button
                    key={priority.value}
                    type="button"
                    variant={formData.priority === priority.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInputChange('priority', priority.value)}
                    className={`${
                      formData.priority === priority.value
                        ? 'bg-[var(--ff-primary)] text-white'
                        : 'bg-white/5 border-white/20 text-[var(--ff-text-muted)] hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full mr-2 ${priority.color}`}></div>
                    {priority.label}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-[var(--ff-text-muted)]">
                {priorities.find(p => p.value === formData.priority)?.description}
              </p>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Subject *</label>
              <Input
                type="text"
                placeholder="Brief description of your issue"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className={`bg-white/5 border-white/20 text-white placeholder:text-[var(--ff-text-muted)] ${
                  errors.subject ? 'border-red-500' : 'focus:border-[var(--ff-primary)]'
                }`}
              />
              {errors.subject && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.subject}
                </p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Message *</label>
              <Textarea
                placeholder="Please provide detailed information about your request..."
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={6}
                className={`bg-white/5 border-white/20 text-white placeholder:text-[var(--ff-text-muted)] resize-none ${
                  errors.message ? 'border-red-500' : 'focus:border-[var(--ff-primary)]'
                }`}
              />
              <div className="flex justify-between items-center">
                {errors.message ? (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.message}
                  </p>
                ) : (
                  <p className="text-xs text-[var(--ff-text-muted)]">
                    Minimum 10 characters ({formData.message.length}/10)
                  </p>
                )}
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-sm text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.submit}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[var(--ff-primary)] to-[var(--ff-secondary)] hover:from-[var(--ff-primary-600)] hover:to-[var(--ff-secondary-600)] text-white font-semibold py-3"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting Ticket...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Support Ticket
                </>
              )}
            </Button>

            {/* Additional Help */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-white mb-2">Need immediate help?</h4>
              <div className="space-y-2 text-xs text-[var(--ff-text-muted)]">
                <p>• Check our <span className="text-[var(--ff-primary)]">Knowledge Base</span> for common solutions</p>
                <p>• Join our <span className="text-[var(--ff-secondary)]">Community Discord</span> for peer support</p>
                <p>• For urgent issues, use live chat or call our emergency line</p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ContactSupportSystem;
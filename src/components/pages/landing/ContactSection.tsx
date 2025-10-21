import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Badge } from '../../ui/badge';
import { 
  Mail, 
  MessageCircle, 
  Calendar, 
  MapPin, 
  Clock, 
  Send,
  Twitter,
  Github,
  Linkedin,
  BookOpen,
  Users,
  Headphones
} from 'lucide-react';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    type: ''
  });

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help from our support team",
      contact: "support@flashfusion.ai",
      responseTime: "24 hours",
      availability: "24/7",
      color: "text-primary"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our team in real-time",
      contact: "Available in app",
      responseTime: "< 5 minutes",
      availability: "9 AM - 6 PM PST",
      color: "text-secondary"
    },
    {
      icon: Calendar,
      title: "Schedule Demo",
      description: "Book a personalized demo",
      contact: "calendly.com/flashfusion",
      responseTime: "Same day",
      availability: "Business hours",
      color: "text-accent"
    },
    {
      icon: Users,
      title: "Community Discord",
      description: "Join our developer community",
      contact: "discord.gg/flashfusion",
      responseTime: "Community driven",
      availability: "24/7",
      color: "text-primary"
    }
  ];

  const socialLinks = [
    { icon: Twitter, name: "Twitter", url: "@FlashFusionAI", handle: "@FlashFusionAI" },
    { icon: Github, name: "GitHub", url: "github.com/flashfusion", handle: "flashfusion" },
    { icon: Linkedin, name: "LinkedIn", url: "linkedin.com/company/flashfusion", handle: "FlashFusion" },
    { icon: BookOpen, name: "Blog", url: "blog.flashfusion.ai", handle: "blog.flashfusion.ai" }
  ];

  const offices = [
    {
      city: "San Francisco",
      address: "123 Innovation Drive, Suite 400",
      timezone: "PST",
      type: "Headquarters"
    },
    {
      city: "New York",
      address: "456 Tech Avenue, Floor 15",
      timezone: "EST",
      type: "East Coast Office"
    },
    {
      city: "London",
      address: "789 Digital Street, Level 3",
      timezone: "GMT",
      type: "European Office"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 ff-text-gradient">
            Get in Touch
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions about FlashFusion? We're here to help you succeed with AI-powered development.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="w-5 h-5 mr-2 text-primary" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Company</label>
                      <Input
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="Your company name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Inquiry Type</label>
                      <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Question</SelectItem>
                          <SelectItem value="sales">Sales Inquiry</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="enterprise">Enterprise Solution</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Subject *</label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Brief description of your inquiry"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message *</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Tell us more about how we can help you..."
                      className="min-h-32"
                      required
                    />
                  </div>

                  <Button type="submit" className="ff-btn-primary w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="ff-card-interactive">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center ${method.color}`}>
                        <method.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{method.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                        <p className="text-sm font-medium">{method.contact}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {method.responseTime}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{method.availability}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Social Links & Offices */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => (
                    <div key={social.name} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                      <social.icon className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{social.name}</p>
                        <p className="text-xs text-muted-foreground">{social.handle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Office Locations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary" />
                  Our Offices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {offices.map((office, index) => (
                    <div key={office.city} className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{office.city}</h4>
                        <Badge variant="outline" className="text-xs">{office.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{office.address}</p>
                      <p className="text-xs text-muted-foreground">{office.timezone}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
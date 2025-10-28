import React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Zap, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail,
  Shield,
  Lock,
  FileText,
  HelpCircle,
  ExternalLink,
  ArrowUp,
  Heart
} from 'lucide-react';
import type { PageType } from '../../types/core';

interface AppFooterProps {
  currentPage: PageType;
  isAuthenticated: boolean;
  onPageChange?: (page: PageType) => void;
}

export function AppFooter({ currentPage, isAuthenticated, onPageChange }: AppFooterProps) {
  // Hide footer on certain pages for better UX
  const hideFooterPages: PageType[] = ['search', 'dashboard'];
  if (hideFooterPages.includes(currentPage)) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigation = (page: PageType) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      // Fallback navigation
      window.location.hash = `#/${page}`;
    }
  };

  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', page: 'features' as PageType, icon: Zap },
        { label: 'AI Tools', page: 'tools' as PageType, icon: Zap },
        { label: 'Pricing', page: 'pricing' as PageType, icon: Zap },
        { label: 'Integrations', page: 'integrations' as PageType, icon: Zap }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', page: 'about' as PageType, icon: Zap },
        { label: 'Contact', page: 'contact' as PageType, icon: Mail },
        { label: 'Testimonials', page: 'testimonials' as PageType, icon: Heart },
        { label: 'Blog', href: 'https://blog.flashfusion.ai', icon: ExternalLink }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: 'https://docs.flashfusion.ai', icon: FileText },
        { label: 'FAQ', page: 'faq' as PageType, icon: HelpCircle },
        { label: 'Support', page: 'contact' as PageType, icon: Mail },
        { label: 'API Reference', href: 'https://api.flashfusion.ai', icon: ExternalLink }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', page: 'privacy' as PageType, icon: Shield },
        { label: 'Terms of Service', page: 'terms' as PageType, icon: FileText },
        { label: 'Security', href: '/security', icon: Lock },
        { label: 'Compliance', href: '/compliance', icon: Shield }
      ]
    }
  ];

  const socialLinks = [
    { 
      label: 'GitHub', 
      href: 'https://github.com/flashfusion', 
      icon: Github,
      color: 'hover:text-gray-400'
    },
    { 
      label: 'Twitter', 
      href: 'https://twitter.com/flashfusion_ai', 
      icon: Twitter,
      color: 'hover:text-blue-400'
    },
    { 
      label: 'LinkedIn', 
      href: 'https://linkedin.com/company/flashfusion', 
      icon: Linkedin,
      color: 'hover:text-blue-600'
    },
    { 
      label: 'Email', 
      href: 'mailto:hello@flashfusion.ai', 
      icon: Mail,
      color: 'hover:text-primary'
    }
  ];

  const trustBadges = [
    { label: 'Enterprise Grade', icon: Shield },
    { label: 'Production Ready', icon: Zap },
    { label: 'Secure Platform', icon: Lock }
  ];

  return (
    <footer className="ff-footer bg-background/95 border-t border-border/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 py-6">
          {/* Compact Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg ff-text-gradient">
                FlashFusion
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered development platform for building production-ready applications.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.slice(0, 3).map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`ff-social-link ${social.color}`}
                  aria-label={social.label}
                >
                  <social.icon className="h-3 w-3" />
                </a>
              ))}
            </div>
          </div>

          {/* Compact Navigation Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="font-medium text-sm text-foreground">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.slice(0, 3).map((link) => (
                  <li key={link.label}>
                    {link.page ? (
                      <button
                        onClick={() => handleNavigation(link.page!)}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                      >
                        {link.label}
                        {link.href?.startsWith('http') && (
                          <ExternalLink className="h-2 w-2" />
                        )}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Compact Trust Indicators */}
        <div className="py-4 border-t border-border/30">
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            {trustBadges.slice(0, 3).map((badge) => (
              <div key={badge.label} className="flex items-center gap-1 text-muted-foreground">
                <badge.icon className="h-3 w-3 text-success" />
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Compact Bottom Footer */}
        <div className="py-4 border-t border-border/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span>© {currentYear} FlashFusion. All rights reserved.</span>
              <div className="flex items-center gap-1">
                <span>Status:</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span className="text-success">Operational</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span>60+ AI Tools • 8+ Platforms</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToTop}
                className="ff-focus-ring h-6 w-6 p-0"
              >
                <ArrowUp className="h-3 w-3" />
                <span className="sr-only">Back to top</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default AppFooter;
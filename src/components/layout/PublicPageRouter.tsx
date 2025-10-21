import React from 'react';
import { PageType } from '../../types';

// Import public pages
import { HomePage } from '../pages/HomePage';
import { AboutPage } from '../pages/AboutPage';
import { FeaturesPage } from '../pages/FeaturesPage';
import { PricingPage } from '../pages/PricingPage';
import { ContactPage } from '../pages/ContactPage';
import { TestimonialsPage } from '../pages/TestimonialsPage';
import { FAQPage } from '../pages/FAQPage';
import { PrivacyPage } from '../pages/PrivacyPage';
import { TermsPage } from '../pages/TermsPage';
import { DemoPage } from '../pages/DemoPage';

interface PublicPageRouterProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
}

export function PublicPageRouter({ currentPage, setCurrentPage }: PublicPageRouterProps) {
  const renderPublicPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'about':
        return <AboutPage />;
      case 'features':
        return <FeaturesPage />;
      case 'pricing':
        return <PricingPage setCurrentPage={setCurrentPage} />;
      case 'contact':
        return <ContactPage />;
      case 'testimonials':
        return <TestimonialsPage />;
      case 'faq':
        return <FAQPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'terms':
        return <TermsPage />;
      case 'demo':
        return <DemoPage />;
      default:
        return null;
    }
  };

  return renderPublicPage();
}
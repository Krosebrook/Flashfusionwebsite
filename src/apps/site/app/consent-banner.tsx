'use client';

import { useEffect, useState } from "react";

export default function ConsentBanner() {
  const [consentState, setConsentState] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check consent on mount
    const consent = localStorage.getItem('consent');
    setConsentState(consent);
    
    // Show banner if no consent decision yet
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('consent', 'granted');
    setConsentState('granted');
    setIsVisible(false);
    
    // Reload to initialize analytics
    window.location.reload();
  };

  const handleDecline = () => {
    localStorage.setItem('consent', 'denied');
    setConsentState('denied');
    setIsVisible(false);
  };

  if (!isVisible || consentState) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      style={{
        animation: 'slideInFromBottom 0.3s ease-out'
      }}
    >
      <div 
        className="ff-container"
        style={{
          maxWidth: '1024px'
        }}
      >
        <div 
          className="ff-card"
          style={{
            boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.4)',
            padding: '1.5rem'
          }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            <div className="flex-1">
              <h3 
                className="mb-2"
                style={{ 
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  margin: 0,
                  padding: 0
                }}
              >
                🍪 Cookie Consent
              </h3>
              <p 
                style={{ 
                  color: 'var(--ff-text-muted)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.5,
                  margin: 0,
                  padding: 0
                }}
              >
                We use analytics cookies to improve our site and understand how visitors interact with FlashFusion. 
                Your data is anonymized and never sold.
              </p>
            </div>
            
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={handleDecline}
                className="ff-btn-secondary"
                style={{
                  padding: '0.625rem 1.25rem',
                  fontSize: '0.9375rem'
                }}
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="ff-btn-primary"
                style={{
                  padding: '0.625rem 1.25rem',
                  fontSize: '0.9375rem'
                }}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
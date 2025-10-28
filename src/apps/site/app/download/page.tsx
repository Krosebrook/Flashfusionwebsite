'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Download, 
  Apple, 
  Smartphone, 
  Monitor, 
  CheckCircle, 
  ExternalLink,
  ChevronDown,
  Linux,
  Chrome
} from 'lucide-react';

interface Platform {
  name: string;
  icon: any;
  downloadUrl: string;
  fileSize: string;
  version: string;
  requirements: string;
}

export default function DownloadPage() {
  const [detectedOS, setDetectedOS] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);

  useEffect(() => {
    // Detect user's operating system
    const userAgent = window.navigator.userAgent.toLowerCase();
    const platform = window.navigator.platform.toLowerCase();

    if (userAgent.includes('android')) {
      setDetectedOS('android');
      setSelectedPlatform('android');
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      setDetectedOS('ios');
      setSelectedPlatform('ios');
    } else if (platform.includes('mac')) {
      setDetectedOS('macos');
      setSelectedPlatform('macos');
    } else if (platform.includes('win')) {
      setDetectedOS('windows');
      setSelectedPlatform('windows');
    } else if (platform.includes('linux')) {
      setDetectedOS('linux');
      setSelectedPlatform('linux');
    } else {
      setDetectedOS('windows'); // Default to Windows
      setSelectedPlatform('windows');
    }
  }, []);

  const desktopPlatforms: Record<string, Platform> = {
    windows: {
      name: 'Windows',
      icon: Monitor,
      downloadUrl: 'https://github.com/flashfusion/desktop/releases/download/v1.0.0/FlashFusion-Setup-1.0.0.exe',
      fileSize: '85 MB',
      version: '1.0.0',
      requirements: 'Windows 10 or later (64-bit)'
    },
    macos: {
      name: 'macOS',
      icon: Apple,
      downloadUrl: 'https://github.com/flashfusion/desktop/releases/download/v1.0.0/FlashFusion-1.0.0.dmg',
      fileSize: '92 MB',
      version: '1.0.0',
      requirements: 'macOS 11 (Big Sur) or later'
    },
    linux: {
      name: 'Linux',
      icon: Linux,
      downloadUrl: 'https://github.com/flashfusion/desktop/releases/download/v1.0.0/FlashFusion-1.0.0.AppImage',
      fileSize: '88 MB',
      version: '1.0.0',
      requirements: 'Ubuntu 20.04+ / Fedora 35+ or equivalent'
    }
  };

  const mobilePlatforms: Record<string, Platform> = {
    ios: {
      name: 'iOS',
      icon: Apple,
      downloadUrl: 'https://apps.apple.com/app/flashfusion/id1234567890',
      fileSize: 'Varies',
      version: '1.0.0',
      requirements: 'iOS 15.0 or later'
    },
    android: {
      name: 'Android',
      icon: Smartphone,
      downloadUrl: 'https://play.google.com/store/apps/details?id=co.flashfusion.app',
      fileSize: 'Varies',
      version: '1.0.0',
      requirements: 'Android 8.0 or later'
    }
  };

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  const getRecommendedPlatform = () => {
    if (detectedOS === 'ios' || detectedOS === 'android') {
      return mobilePlatforms[detectedOS];
    } else {
      return desktopPlatforms[detectedOS] || desktopPlatforms.windows;
    }
  };

  const recommendedPlatform = getRecommendedPlatform();
  const isMobile = detectedOS === 'ios' || detectedOS === 'android';

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section 
        className="py-20 px-6"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 123, 0, 0.1) 0%, rgba(0, 180, 216, 0.1) 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{
              background: 'linear-gradient(135deg, var(--ff-primary) 0%, var(--ff-secondary) 100%)',
              boxShadow: '0 10px 40px rgba(255, 123, 0, 0.3)'
            }}
          >
            <Download className="h-10 w-10 text-white" />
          </div>

          <h1 
            className="mb-6"
            style={{
              fontFamily: 'var(--ff-font-primary)',
              fontSize: 'var(--ff-text-5xl)',
              fontWeight: 'var(--ff-weight-extrabold)',
              lineHeight: 'var(--ff-leading-tight)',
              background: 'linear-gradient(135deg, var(--ff-primary) 0%, var(--ff-secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Download FlashFusion
          </h1>
          
          <p 
            className="text-xl max-w-2xl mx-auto mb-4"
            style={{
              color: 'var(--ff-text-secondary)',
              fontFamily: 'var(--ff-font-secondary)',
              lineHeight: 'var(--ff-leading-relaxed)'
            }}
          >
            Build faster with native desktop and mobile apps. Available for Windows, macOS, Linux, iOS, and Android.
          </p>

          {detectedOS && (
            <p 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: 'var(--ff-success)',
                fontFamily: 'var(--ff-font-secondary)',
                fontSize: 'var(--ff-text-sm)'
              }}
            >
              <CheckCircle className="h-4 w-4" />
              We detected you're on {recommendedPlatform.name}
            </p>
          )}
        </div>
      </section>

      {/* Recommended Download */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div 
            className="p-10 rounded-2xl border-2 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 123, 0, 0.1) 0%, rgba(0, 180, 216, 0.1) 100%)',
              borderColor: 'var(--ff-primary)'
            }}
          >
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
              style={{
                background: 'var(--ff-primary)',
                color: 'white'
              }}
            >
              <recommendedPlatform.icon className="h-8 w-8" />
            </div>

            <h2 
              className="mb-2"
              style={{
                fontFamily: 'var(--ff-font-primary)',
                fontSize: 'var(--ff-text-3xl)',
                fontWeight: 'var(--ff-weight-bold)',
                color: 'var(--ff-text-primary)'
              }}
            >
              FlashFusion for {recommendedPlatform.name}
            </h2>

            <p 
              className="mb-6"
              style={{
                color: 'var(--ff-text-secondary)',
                fontFamily: 'var(--ff-font-secondary)',
                fontSize: 'var(--ff-text-base)'
              }}
            >
              Version {recommendedPlatform.version} • {recommendedPlatform.fileSize}
            </p>

            <button
              onClick={() => handleDownload(recommendedPlatform.downloadUrl)}
              className="inline-flex items-center gap-3 px-10 py-5 rounded-xl transition-all hover:scale-105 mb-6"
              style={{
                background: 'linear-gradient(135deg, var(--ff-primary) 0%, var(--ff-secondary) 100%)',
                color: 'white',
                fontFamily: 'var(--ff-font-primary)',
                fontSize: 'var(--ff-text-lg)',
                fontWeight: 'var(--ff-weight-semibold)',
                boxShadow: '0 10px 40px rgba(255, 123, 0, 0.3)'
              }}
            >
              <Download className="h-6 w-6" />
              Download for {recommendedPlatform.name}
            </button>

            <div className="space-y-2">
              <p 
                style={{
                  color: 'var(--ff-text-muted)',
                  fontFamily: 'var(--ff-font-secondary)',
                  fontSize: 'var(--ff-text-sm)'
                }}
              >
                <strong>System Requirements:</strong> {recommendedPlatform.requirements}
              </p>
              <p 
                style={{
                  color: 'var(--ff-text-muted)',
                  fontFamily: 'var(--ff-font-secondary)',
                  fontSize: 'var(--ff-text-xs)'
                }}
              >
                Free for all users • No credit card required • Automatic updates
              </p>
            </div>
          </div>

          {/* Show All Platforms Toggle */}
          <div className="text-center mt-6">
            <button
              onClick={() => setShowAllPlatforms(!showAllPlatforms)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all hover:scale-105"
              style={{
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: 'var(--ff-text-secondary)',
                fontFamily: 'var(--ff-font-primary)',
                fontWeight: 'var(--ff-weight-semibold)'
              }}
            >
              {showAllPlatforms ? 'Hide' : 'Show'} all platforms
              <ChevronDown 
                className={`h-4 w-4 transition-transform ${showAllPlatforms ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* All Platforms */}
      {showAllPlatforms && (
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Desktop Apps */}
            <div className="mb-12">
              <h3 
                className="mb-6 flex items-center gap-3"
                style={{
                  fontFamily: 'var(--ff-font-primary)',
                  fontSize: 'var(--ff-text-2xl)',
                  fontWeight: 'var(--ff-weight-bold)',
                  color: 'var(--ff-text-primary)'
                }}
              >
                <Monitor className="h-6 w-6" style={{ color: 'var(--ff-primary)' }} />
                Desktop Apps
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(desktopPlatforms).map(([key, platform]) => (
                  <div
                    key={key}
                    className="p-6 rounded-xl border transition-all hover:scale-105"
                    style={{
                      background: 'var(--ff-surface)',
                      borderColor: selectedPlatform === key 
                        ? 'var(--ff-primary)' 
                        : 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                      style={{
                        background: `${selectedPlatform === key ? 'var(--ff-primary)' : 'rgba(255, 255, 255, 0.1)'}`,
                        color: selectedPlatform === key ? 'white' : 'var(--ff-text-secondary)'
                      }}
                    >
                      <platform.icon className="h-6 w-6" />
                    </div>

                    <h4 
                      className="mb-2"
                      style={{
                        fontFamily: 'var(--ff-font-primary)',
                        fontSize: 'var(--ff-text-xl)',
                        fontWeight: 'var(--ff-weight-semibold)',
                        color: 'var(--ff-text-primary)'
                      }}
                    >
                      {platform.name}
                    </h4>

                    <div className="mb-4 space-y-1">
                      <p 
                        style={{
                          color: 'var(--ff-text-muted)',
                          fontFamily: 'var(--ff-font-secondary)',
                          fontSize: 'var(--ff-text-sm)'
                        }}
                      >
                        v{platform.version} • {platform.fileSize}
                      </p>
                      <p 
                        style={{
                          color: 'var(--ff-text-muted)',
                          fontFamily: 'var(--ff-font-secondary)',
                          fontSize: 'var(--ff-text-xs)'
                        }}
                      >
                        {platform.requirements}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDownload(platform.downloadUrl)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105"
                      style={{
                        background: selectedPlatform === key 
                          ? 'var(--ff-gradient-primary)' 
                          : 'transparent',
                        border: selectedPlatform === key 
                          ? 'none' 
                          : '2px solid rgba(255, 255, 255, 0.1)',
                        color: selectedPlatform === key 
                          ? 'white' 
                          : 'var(--ff-text-primary)',
                        fontFamily: 'var(--ff-font-primary)',
                        fontWeight: 'var(--ff-weight-semibold)',
                        fontSize: 'var(--ff-text-sm)'
                      }}
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Apps */}
            <div>
              <h3 
                className="mb-6 flex items-center gap-3"
                style={{
                  fontFamily: 'var(--ff-font-primary)',
                  fontSize: 'var(--ff-text-2xl)',
                  fontWeight: 'var(--ff-weight-bold)',
                  color: 'var(--ff-text-primary)'
                }}
              >
                <Smartphone className="h-6 w-6" style={{ color: 'var(--ff-secondary)' }} />
                Mobile Apps
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                {Object.entries(mobilePlatforms).map(([key, platform]) => (
                  <div
                    key={key}
                    className="p-6 rounded-xl border transition-all hover:scale-105"
                    style={{
                      background: 'var(--ff-surface)',
                      borderColor: selectedPlatform === key 
                        ? 'var(--ff-secondary)' 
                        : 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: selectedPlatform === key 
                            ? 'var(--ff-secondary)' 
                            : 'rgba(255, 255, 255, 0.1)',
                          color: selectedPlatform === key ? 'white' : 'var(--ff-text-secondary)'
                        }}
                      >
                        <platform.icon className="h-6 w-6" />
                      </div>

                      <div className="flex-1">
                        <h4 
                          className="mb-1"
                          style={{
                            fontFamily: 'var(--ff-font-primary)',
                            fontSize: 'var(--ff-text-xl)',
                            fontWeight: 'var(--ff-weight-semibold)',
                            color: 'var(--ff-text-primary)'
                          }}
                        >
                          {platform.name}
                        </h4>

                        <p 
                          className="mb-3"
                          style={{
                            color: 'var(--ff-text-muted)',
                            fontFamily: 'var(--ff-font-secondary)',
                            fontSize: 'var(--ff-text-sm)'
                          }}
                        >
                          {platform.requirements}
                        </p>

                        <button
                          onClick={() => handleDownload(platform.downloadUrl)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105"
                          style={{
                            background: selectedPlatform === key 
                              ? 'var(--ff-secondary)' 
                              : 'transparent',
                            border: selectedPlatform === key 
                              ? 'none' 
                              : '2px solid rgba(255, 255, 255, 0.1)',
                            color: selectedPlatform === key 
                              ? 'white' 
                              : 'var(--ff-text-primary)',
                            fontFamily: 'var(--ff-font-primary)',
                            fontWeight: 'var(--ff-weight-semibold)',
                            fontSize: 'var(--ff-text-sm)'
                          }}
                        >
                          {key === 'ios' ? 'App Store' : 'Play Store'}
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Web App Option */}
      <section 
        className="py-16 px-6"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(255, 123, 0, 0.05) 100%)'
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: 'rgba(233, 30, 99, 0.1)',
              color: 'var(--ff-accent)'
            }}
          >
            <Chrome className="h-8 w-8" />
          </div>

          <h3 
            className="mb-4"
            style={{
              fontFamily: 'var(--ff-font-primary)',
              fontSize: 'var(--ff-text-3xl)',
              fontWeight: 'var(--ff-weight-bold)',
              color: 'var(--ff-text-primary)'
            }}
          >
            Prefer to use FlashFusion in your browser?
          </h3>

          <p 
            className="mb-6"
            style={{
              color: 'var(--ff-text-secondary)',
              fontFamily: 'var(--ff-font-secondary)',
              fontSize: 'var(--ff-text-lg)'
            }}
          >
            Access all features instantly without downloading anything
          </p>

          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg transition-all hover:scale-105"
            style={{
              background: 'var(--ff-accent)',
              color: 'white',
              fontFamily: 'var(--ff-font-primary)',
              fontWeight: 'var(--ff-weight-semibold)'
            }}
          >
            Launch Web App
            <ExternalLink className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 
            className="text-center mb-12"
            style={{
              fontFamily: 'var(--ff-font-primary)',
              fontSize: 'var(--ff-text-3xl)',
              fontWeight: 'var(--ff-weight-bold)',
              color: 'var(--ff-text-primary)'
            }}
          >
            Why Download the Native App?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Offline Access',
                description: 'Continue working on your projects even without an internet connection',
                icon: '🔌'
              },
              {
                title: 'Better Performance',
                description: 'Native apps are optimized for speed and responsiveness on your device',
                icon: '⚡'
              },
              {
                title: 'System Integration',
                description: 'Deep integration with your OS for file management, notifications, and more',
                icon: '🔗'
              },
              {
                title: 'Auto Updates',
                description: 'Get the latest features and security updates automatically',
                icon: '🔄'
              },
              {
                title: 'Keyboard Shortcuts',
                description: 'Access powerful keyboard shortcuts for faster workflow',
                icon: '⌨️'
              },
              {
                title: 'Local Storage',
                description: 'Store your projects locally for faster access and privacy',
                icon: '💾'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border"
                style={{
                  background: 'var(--ff-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 
                  className="mb-2"
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-lg)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    color: 'var(--ff-text-primary)'
                  }}
                >
                  {feature.title}
                </h4>
                <p 
                  style={{
                    color: 'var(--ff-text-secondary)',
                    fontFamily: 'var(--ff-font-secondary)',
                    fontSize: 'var(--ff-text-sm)',
                    lineHeight: 'var(--ff-leading-relaxed)'
                  }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h3 
            className="text-center mb-12"
            style={{
              fontFamily: 'var(--ff-font-primary)',
              fontSize: 'var(--ff-text-3xl)',
              fontWeight: 'var(--ff-weight-bold)',
              color: 'var(--ff-text-primary)'
            }}
          >
            Download FAQs
          </h3>

          <div className="space-y-4">
            {[
              {
                q: 'Is the app free?',
                a: 'Yes! FlashFusion apps are free to download and use. Premium features require a subscription.'
              },
              {
                q: 'How do I install the desktop app?',
                a: 'Download the installer for your OS, run it, and follow the on-screen instructions. Installation takes less than 2 minutes.'
              },
              {
                q: 'Can I use the same account on multiple devices?',
                a: 'Absolutely! Sign in with your FlashFusion account on any device and your projects will sync automatically.'
              },
              {
                q: 'Are my projects stored locally or in the cloud?',
                a: 'Both! Projects are stored in the cloud for sync across devices, with local caching for offline access.'
              },
              {
                q: 'How do I update the app?',
                a: 'Desktop apps auto-update when you restart. Mobile apps update through the App Store or Play Store.'
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border"
                style={{
                  background: 'var(--ff-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <h4 
                  className="mb-2"
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-base)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    color: 'var(--ff-text-primary)'
                  }}
                >
                  {faq.q}
                </h4>
                <p 
                  style={{
                    color: 'var(--ff-text-secondary)',
                    fontFamily: 'var(--ff-font-secondary)',
                    fontSize: 'var(--ff-text-sm)',
                    lineHeight: 'var(--ff-leading-relaxed)'
                  }}
                >
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/faq"
              style={{
                color: 'var(--ff-primary)',
                fontFamily: 'var(--ff-font-primary)',
                fontWeight: 'var(--ff-weight-semibold)',
                fontSize: 'var(--ff-text-sm)'
              }}
            >
              View all FAQs →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

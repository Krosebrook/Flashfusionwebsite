'use client';

import { useState, useEffect } from 'react';
import { Download, Apple, Smartphone, Monitor } from 'lucide-react';

interface SmartDownloadButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export default function SmartDownloadButton({ 
  variant = 'primary',
  size = 'md',
  showIcon = true,
  className = ''
}: SmartDownloadButtonProps) {
  const [platform, setPlatform] = useState<'windows' | 'macos' | 'linux' | 'ios' | 'android' | null>(null);
  const [buttonText, setButtonText] = useState('Download FlashFusion');
  const [downloadUrl, setDownloadUrl] = useState('/download');

  useEffect(() => {
    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const platformCheck = window.navigator.platform.toLowerCase();

    let detectedPlatform: typeof platform = null;
    let text = 'Download FlashFusion';
    let url = '/download';

    if (userAgent.includes('android')) {
      detectedPlatform = 'android';
      text = 'Get on Play Store';
      url = 'https://play.google.com/store/apps/details?id=co.flashfusion.app';
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      detectedPlatform = 'ios';
      text = 'Get on App Store';
      url = 'https://apps.apple.com/app/flashfusion/id1234567890';
    } else if (platformCheck.includes('mac')) {
      detectedPlatform = 'macos';
      text = 'Download for Mac';
      url = 'https://github.com/flashfusion/desktop/releases/download/v1.0.0/FlashFusion-1.0.0.dmg';
    } else if (platformCheck.includes('win')) {
      detectedPlatform = 'windows';
      text = 'Download for Windows';
      url = 'https://github.com/flashfusion/desktop/releases/download/v1.0.0/FlashFusion-Setup-1.0.0.exe';
    } else if (platformCheck.includes('linux')) {
      detectedPlatform = 'linux';
      text = 'Download for Linux';
      url = 'https://github.com/flashfusion/desktop/releases/download/v1.0.0/FlashFusion-1.0.0.AppImage';
    }

    setPlatform(detectedPlatform);
    setButtonText(text);
    setDownloadUrl(url);
  }, []);

  const getIcon = () => {
    if (!showIcon) return null;

    switch (platform) {
      case 'ios':
      case 'macos':
        return <Apple className={size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} />;
      case 'android':
        return <Smartphone className={size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} />;
      default:
        return <Download className={size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} />;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-10 py-5 text-lg';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  const handleClick = () => {
    if (platform === 'ios' || platform === 'android') {
      // Open app store in new tab
      window.open(downloadUrl, '_blank');
    } else {
      // Navigate to download page or trigger download
      window.location.href = downloadUrl;
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 rounded-lg transition-all hover:scale-105 ${getSizeClasses()} ${className}`}
      style={{
        background: variant === 'primary' 
          ? 'linear-gradient(135deg, var(--ff-primary) 0%, var(--ff-secondary) 100%)'
          : 'transparent',
        border: variant === 'secondary' 
          ? '2px solid var(--ff-primary)' 
          : 'none',
        color: variant === 'primary' ? 'white' : 'var(--ff-primary)',
        fontFamily: 'var(--ff-font-primary)',
        fontWeight: 'var(--ff-weight-semibold)',
        boxShadow: variant === 'primary' ? 'var(--ff-glow)' : 'none'
      }}
    >
      {getIcon()}
      {buttonText}
    </button>
  );
}

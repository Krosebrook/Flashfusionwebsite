'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export default function BackButton({ 
  href, 
  label = 'Back',
  className = '' 
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 transition-all hover:gap-3 ff-focus-ring ${className}`}
      style={{
        color: 'var(--ff-text-secondary)',
        fontFamily: 'var(--ff-font-secondary)',
        fontSize: 'var(--ff-text-sm)',
        padding: '0.5rem 0'
      }}
      aria-label={label}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Download } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav 
      className="sticky top-0 z-50 border-b backdrop-blur-lg"
      style={{
        background: 'rgba(15, 23, 42, 0.9)',
        borderColor: 'rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="ff-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/"
            className="flex items-center gap-2"
          >
            <span 
              className="ff-text-gradient"
              style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.5rem',
                fontWeight: 800
              }}
            >
              FlashFusion
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/features"
              className="transition-colors hover:text-white"
              style={{
                color: 'var(--ff-text-secondary)',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 500
              }}
            >
              Features
            </Link>
            <Link 
              href="/pricing"
              className="transition-colors hover:text-white"
              style={{
                color: 'var(--ff-text-secondary)',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 500
              }}
            >
              Pricing
            </Link>
            <Link 
              href="/download"
              className="transition-colors hover:text-white flex items-center gap-1"
              style={{
                color: 'var(--ff-text-secondary)',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 500
              }}
            >
              <Download className="h-4 w-4" />
              Download
            </Link>
            <Link 
              href="/faq"
              className="transition-colors hover:text-white"
              style={{
                color: 'var(--ff-text-secondary)',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 500
              }}
            >
              FAQ
            </Link>
            <Link 
              href="/signin"
              className="transition-colors hover:text-white"
              style={{
                color: 'var(--ff-text-secondary)',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 500
              }}
            >
              Sign In
            </Link>
            <Link 
              href="/signup"
              className="ff-btn-primary"
              style={{
                padding: '0.5rem 1.5rem',
                fontSize: '0.9375rem'
              }}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
            style={{ color: 'var(--ff-text-primary)' }}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <div className="flex flex-col gap-4">
              <Link 
                href="/features"
                onClick={() => setIsOpen(false)}
                className="py-2 transition-colors hover:text-white"
                style={{
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: 500
                }}
              >
                Features
              </Link>
              <Link 
                href="/pricing"
                onClick={() => setIsOpen(false)}
                className="py-2 transition-colors hover:text-white"
                style={{
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: 500
                }}
              >
                Pricing
              </Link>
              <Link 
                href="/download"
                onClick={() => setIsOpen(false)}
                className="py-2 transition-colors hover:text-white flex items-center gap-2"
                style={{
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: 500
                }}
              >
                <Download className="h-4 w-4" />
                Download
              </Link>
              <Link 
                href="/faq"
                onClick={() => setIsOpen(false)}
                className="py-2 transition-colors hover:text-white"
                style={{
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: 500
                }}
              >
                FAQ
              </Link>
              <Link 
                href="/signin"
                onClick={() => setIsOpen(false)}
                className="py-2 transition-colors hover:text-white"
                style={{
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: 500
                }}
              >
                Sign In
              </Link>
              <Link 
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="ff-btn-primary mt-2"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
'use client';

import { useState } from 'react';
import Link from 'next/link';
import BackButton from '../../components/BackButton';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Simulate authentication
    setTimeout(() => {
      setSuccess('Welcome back! Taking you to the FlashFusion platform...');
      setIsLoading(false);
      
      // Redirect to demo for now (until full app is deployed)
      setTimeout(() => {
        window.location.href = '/demo';
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ background: 'var(--ff-bg-dark)' }}>
      <div className="w-full max-w-md">
        <BackButton href="/" label="Back to Home" className="mb-8" />

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 
              className="mb-2"
              style={{
                fontFamily: 'var(--ff-font-primary)',
                fontSize: 'var(--ff-text-3xl)',
                fontWeight: 'var(--ff-weight-extrabold)',
                background: 'linear-gradient(135deg, var(--ff-primary) 0%, var(--ff-secondary) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              FlashFusion
            </h1>
          </Link>
          <p 
            style={{
              color: 'var(--ff-text-secondary)',
              fontFamily: 'var(--ff-font-secondary)'
            }}
          >
            Sign in to your account
          </p>
        </div>

        {/* Beta Notice */}
        <div 
          className="mb-6 p-4 rounded-xl border flex items-start gap-3"
          style={{
            background: 'rgba(255, 123, 0, 0.1)',
            borderColor: 'rgba(255, 123, 0, 0.3)'
          }}
        >
          <Sparkles className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--ff-primary)' }} />
          <div>
            <p 
              className="mb-1"
              style={{
                color: 'var(--ff-text-primary)',
                fontFamily: 'var(--ff-font-primary)',
                fontSize: 'var(--ff-text-sm)',
                fontWeight: 'var(--ff-weight-semibold)'
              }}
            >
              Beta Access Available
            </p>
            <p 
              style={{
                color: 'var(--ff-text-secondary)',
                fontFamily: 'var(--ff-font-secondary)',
                fontSize: 'var(--ff-text-sm)',
                lineHeight: 'var(--ff-leading-relaxed)'
              }}
            >
              FlashFusion is currently in private beta. Sign in with any email to explore our interactive demos and features.
            </p>
          </div>
        </div>

        {/* Sign In Card */}
        <div 
          className="p-8 rounded-2xl border shadow-xl"
          style={{
            background: 'var(--ff-surface)',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label 
                htmlFor="email"
                className="block mb-2"
                style={{
                  color: 'var(--ff-text-primary)',
                  fontFamily: 'var(--ff-font-primary)',
                  fontSize: 'var(--ff-text-sm)',
                  fontWeight: 'var(--ff-weight-semibold)'
                }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
                  style={{ color: 'var(--ff-text-muted)' }}
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 focus:outline-none transition-all"
                  style={{
                    background: 'var(--ff-bg-dark)',
                    borderColor: email ? 'var(--ff-primary)' : 'rgba(255, 255, 255, 0.1)',
                    color: 'var(--ff-text-primary)',
                    fontFamily: 'var(--ff-font-secondary)'
                  }}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label 
                  htmlFor="password"
                  style={{
                    color: 'var(--ff-text-primary)',
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-sm)',
                    fontWeight: 'var(--ff-weight-semibold)'
                  }}
                >
                  Password
                </label>
                <Link
                  href="/reset-password"
                  className="transition-colors hover:underline"
                  style={{
                    color: 'var(--ff-primary)',
                    fontFamily: 'var(--ff-font-secondary)',
                    fontSize: 'var(--ff-text-sm)'
                  }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
                  style={{ color: 'var(--ff-text-muted)' }}
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 rounded-lg border-2 focus:outline-none transition-all"
                  style={{
                    background: 'var(--ff-bg-dark)',
                    borderColor: password ? 'var(--ff-primary)' : 'rgba(255, 255, 255, 0.1)',
                    color: 'var(--ff-text-primary)',
                    fontFamily: 'var(--ff-font-secondary)'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" style={{ color: 'var(--ff-text-muted)' }} />
                  ) : (
                    <Eye className="h-5 w-5" style={{ color: 'var(--ff-text-muted)' }} />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div 
                className="flex items-center gap-2 p-3 rounded-lg animate-in fade-in"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}
              >
                <AlertCircle className="h-5 w-5" style={{ color: 'var(--ff-error)' }} />
                <p 
                  style={{
                    color: 'var(--ff-error)',
                    fontFamily: 'var(--ff-font-secondary)',
                    fontSize: 'var(--ff-text-sm)'
                  }}
                >
                  {error}
                </p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div 
                className="flex items-center gap-2 p-3 rounded-lg animate-in fade-in"
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}
              >
                <CheckCircle className="h-5 w-5" style={{ color: 'var(--ff-success)' }} />
                <p 
                  style={{
                    color: 'var(--ff-success)',
                    fontFamily: 'var(--ff-font-secondary)',
                    fontSize: 'var(--ff-text-sm)'
                  }}
                >
                  {success}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, var(--ff-primary) 0%, var(--ff-secondary) 100%)',
                color: 'white',
                fontFamily: 'var(--ff-font-primary)',
                fontWeight: 'var(--ff-weight-semibold)',
                boxShadow: '0 10px 40px rgba(255, 123, 0, 0.3)'
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div 
              className="absolute inset-0 flex items-center"
            >
              <div className="w-full border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            </div>
            <div className="relative flex justify-center">
              <span 
                className="px-4"
                style={{
                  background: 'var(--ff-surface)',
                  color: 'var(--ff-text-muted)',
                  fontFamily: 'var(--ff-font-secondary)',
                  fontSize: 'var(--ff-text-sm)'
                }}
              >
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Sign In */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setError('Social login coming soon in full release')}
              className="py-3 px-4 rounded-lg border-2 transition-all hover:scale-105"
              style={{
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: 'var(--ff-text-primary)',
                fontFamily: 'var(--ff-font-secondary)',
                fontSize: 'var(--ff-text-sm)'
              }}
            >
              Google
            </button>
            <button
              type="button"
              onClick={() => setError('Social login coming soon in full release')}
              className="py-3 px-4 rounded-lg border-2 transition-all hover:scale-105"
              style={{
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: 'var(--ff-text-primary)',
                fontFamily: 'var(--ff-font-secondary)',
                fontSize: 'var(--ff-text-sm)'
              }}
            >
              GitHub
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p 
              style={{
                color: 'var(--ff-text-secondary)',
                fontFamily: 'var(--ff-font-secondary)',
                fontSize: 'var(--ff-text-sm)'
              }}
            >
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="transition-colors hover:underline"
                style={{
                  color: 'var(--ff-primary)',
                  fontWeight: 'var(--ff-weight-semibold)'
                }}
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Quick Access */}
        <div 
          className="mt-6 p-4 rounded-xl border text-center"
          style={{
            background: 'var(--ff-surface)',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <p 
            className="mb-3"
            style={{
              color: 'var(--ff-text-secondary)',
              fontFamily: 'var(--ff-font-secondary)',
              fontSize: 'var(--ff-text-sm)'
            }}
          >
            Want to explore first?
          </p>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 px-6 py-2 rounded-lg border-2 transition-all hover:scale-105"
            style={{
              borderColor: 'var(--ff-primary)',
              color: 'var(--ff-primary)',
              fontFamily: 'var(--ff-font-primary)',
              fontSize: 'var(--ff-text-sm)',
              fontWeight: 'var(--ff-weight-semibold)'
            }}
          >
            Try Interactive Demos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

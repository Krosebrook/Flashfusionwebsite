'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

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

    // Simulate API call (replace with actual authentication)
    setTimeout(() => {
      // For demo purposes, accept any email/password
      setSuccess('Sign in successful! Redirecting to dashboard...');
      
      // Redirect to main app
      setTimeout(() => {
        window.location.href = 'https://app.flashfusion.co/dashboard';
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ background: 'var(--ff-bg-dark)' }}>
      <div className="w-full max-w-md">
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
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all"
                  style={{
                    background: 'var(--ff-bg-dark)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
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
                  className="w-full pl-12 pr-12 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all"
                  style={{
                    background: 'var(--ff-bg-dark)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'var(--ff-text-primary)',
                    fontFamily: 'var(--ff-font-secondary)'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
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
                className="flex items-center gap-2 p-3 rounded-lg"
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
                className="flex items-center gap-2 p-3 rounded-lg"
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
                background: 'var(--ff-gradient-primary)',
                color: 'white',
                fontFamily: 'var(--ff-font-primary)',
                fontWeight: 'var(--ff-weight-semibold)',
                boxShadow: 'var(--ff-glow)'
              }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
              style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
            />
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
                style={{
                  color: 'var(--ff-primary)',
                  fontWeight: 'var(--ff-weight-semibold)'
                }}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            style={{
              color: 'var(--ff-text-muted)',
              fontFamily: 'var(--ff-font-secondary)',
              fontSize: 'var(--ff-text-sm)'
            }}
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

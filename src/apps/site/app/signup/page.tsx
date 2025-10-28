'use client';

import { useState } from 'react';
import Link from 'next/link';
import BackButton from '../../components/BackButton';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, ArrowRight, Sparkles, Check } from 'lucide-react';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Validation
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      setIsLoading(false);
      return;
    }

    // Simulate successful signup
    setTimeout(() => {
      setSuccess('Welcome to FlashFusion! Taking you to the platform...');
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
            Create your account
          </p>
        </div>

        {/* Beta Offer */}
        <div 
          className="mb-6 p-4 rounded-xl border"
          style={{
            background: 'rgba(255, 123, 0, 0.1)',
            borderColor: 'rgba(255, 123, 0, 0.3)'
          }}
        >
          <div className="flex items-start gap-3">
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
                🎉 Early Access - 50% OFF!
              </p>
              <p 
                style={{
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'var(--ff-font-secondary)',
                  fontSize: 'var(--ff-text-sm)',
                  lineHeight: 'var(--ff-leading-relaxed)'
                }}
              >
                Join our beta program and get lifetime 50% discount on all plans
              </p>
            </div>
          </div>
        </div>

        {/* Sign Up Card */}
        <div 
          className="p-8 rounded-2xl border shadow-xl"
          style={{
            background: 'var(--ff-surface)',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label 
                htmlFor="name"
                className="block mb-2"
                style={{
                  color: 'var(--ff-text-primary)',
                  fontFamily: 'var(--ff-font-primary)',
                  fontSize: 'var(--ff-text-sm)',
                  fontWeight: 'var(--ff-weight-semibold)'
                }}
              >
                Full Name
              </label>
              <div className="relative">
                <User 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
                  style={{ color: 'var(--ff-text-muted)' }}
                />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 focus:outline-none transition-all"
                  style={{
                    background: 'var(--ff-bg-dark)',
                    borderColor: name ? 'var(--ff-primary)' : 'rgba(255, 255, 255, 0.1)',
                    color: 'var(--ff-text-primary)',
                    fontFamily: 'var(--ff-font-secondary)'
                  }}
                  required
                />
              </div>
            </div>

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
              <label 
                htmlFor="password"
                className="block mb-2"
                style={{
                  color: 'var(--ff-text-primary)',
                  fontFamily: 'var(--ff-font-primary)',
                  fontSize: 'var(--ff-text-sm)',
                  fontWeight: 'var(--ff-weight-semibold)'
                }}
              >
                Password
              </label>
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
                  placeholder="At least 8 characters"
                  className="w-full pl-12 pr-12 py-3 rounded-lg border-2 focus:outline-none transition-all"
                  style={{
                    background: 'var(--ff-bg-dark)',
                    borderColor: password ? 'var(--ff-primary)' : 'rgba(255, 255, 255, 0.1)',
                    color: 'var(--ff-text-primary)',
                    fontFamily: 'var(--ff-font-secondary)'
                  }}
                  required
                  minLength={8}
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
              <p 
                className="mt-2"
                style={{
                  color: 'var(--ff-text-muted)',
                  fontFamily: 'var(--ff-font-secondary)',
                  fontSize: 'var(--ff-text-xs)'
                }}
              >
                Must be at least 8 characters with a mix of letters and numbers
              </p>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                className="flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                style={{
                  borderColor: agreedToTerms ? 'var(--ff-primary)' : 'rgba(255, 255, 255, 0.1)',
                  background: agreedToTerms ? 'var(--ff-primary)' : 'transparent'
                }}
                aria-label="Agree to terms"
              >
                {agreedToTerms && <Check className="h-3 w-3 text-white" />}
              </button>
              <label 
                style={{
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'var(--ff-font-secondary)',
                  fontSize: 'var(--ff-text-sm)',
                  lineHeight: 'var(--ff-leading-relaxed)'
                }}
              >
                I agree to the{' '}
                <Link
                  href="/terms"
                  className="transition-colors hover:underline"
                  style={{
                    color: 'var(--ff-primary)',
                    fontWeight: 'var(--ff-weight-semibold)'
                  }}
                >
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link
                  href="/privacy"
                  className="transition-colors hover:underline"
                  style={{
                    color: 'var(--ff-primary)',
                    fontWeight: 'var(--ff-weight-semibold)'
                  }}
                >
                  Privacy Policy
                </Link>
              </label>
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
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
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
                Or sign up with
              </span>
            </div>
          </div>

          {/* Social Sign Up */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setError('Social signup coming soon in full release')}
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
              onClick={() => setError('Social signup coming soon in full release')}
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

          {/* Sign In Link */}
          <div className="text-center">
            <p 
              style={{
                color: 'var(--ff-text-secondary)',
                fontFamily: 'var(--ff-font-secondary)',
                fontSize: 'var(--ff-text-sm)'
              }}
            >
              Already have an account?{' '}
              <Link
                href="/signin"
                className="transition-colors hover:underline"
                style={{
                  color: 'var(--ff-primary)',
                  fontWeight: 'var(--ff-weight-semibold)'
                }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* What's Included */}
        <div 
          className="mt-6 p-6 rounded-xl border"
          style={{
            background: 'var(--ff-surface)',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <p 
            className="mb-4"
            style={{
              color: 'var(--ff-text-primary)',
              fontFamily: 'var(--ff-font-primary)',
              fontSize: 'var(--ff-text-sm)',
              fontWeight: 'var(--ff-weight-semibold)'
            }}
          >
            Your free account includes:
          </p>
          <ul className="space-y-2">
            {[
              '5 projects with unlimited iterations',
              '10 AI generations per month',
              'Access to all workflow demos',
              'Community support',
              'Basic deployment options'
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <Check className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--ff-success)' }} />
                <span 
                  style={{
                    color: 'var(--ff-text-secondary)',
                    fontFamily: 'var(--ff-font-secondary)',
                    fontSize: 'var(--ff-text-sm)'
                  }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

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

    // Simulate API call (replace with actual authentication)
    setTimeout(() => {
      setSuccess('Account created successfully! Redirecting to dashboard...');
      
      // Redirect to main app
      setTimeout(() => {
        window.location.href = 'https://app.flashfusion.co/onboarding';
      }, 1500);
    }, 1000);
  };

  const passwordStrength = () => {
    if (password.length === 0) return { strength: 0, label: '' };
    if (password.length < 6) return { strength: 25, label: 'Weak', color: 'var(--ff-error)' };
    if (password.length < 10) return { strength: 50, label: 'Fair', color: 'var(--ff-warning)' };
    if (password.length < 12) return { strength: 75, label: 'Good', color: 'var(--ff-secondary)' };
    return { strength: 100, label: 'Strong', color: 'var(--ff-success)' };
  };

  const strength = passwordStrength();

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
            Create your account
          </p>
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

              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span 
                      style={{
                        color: strength.color,
                        fontFamily: 'var(--ff-font-secondary)',
                        fontSize: 'var(--ff-text-xs)',
                        fontWeight: 'var(--ff-weight-semibold)'
                      }}
                    >
                      {strength.label}
                    </span>
                    <span 
                      style={{
                        color: 'var(--ff-text-muted)',
                        fontFamily: 'var(--ff-font-secondary)',
                        fontSize: 'var(--ff-text-xs)'
                      }}
                    >
                      {password.length} characters
                    </span>
                  </div>
                  <div 
                    className="h-1 rounded-full overflow-hidden"
                    style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                  >
                    <div 
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${strength.strength}%`,
                        background: strength.color
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1"
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: 'var(--ff-primary)'
                }}
              />
              <label 
                htmlFor="terms"
                style={{
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'var(--ff-font-secondary)',
                  fontSize: 'var(--ff-text-sm)',
                  lineHeight: '1.5'
                }}
              >
                I agree to the{' '}
                <Link href="/terms" style={{ color: 'var(--ff-primary)' }}>
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" style={{ color: 'var(--ff-primary)' }}>
                  Privacy Policy
                </Link>
              </label>
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
                Or sign up with
              </span>
            </div>
          </div>

          {/* Social Sign Up */}
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

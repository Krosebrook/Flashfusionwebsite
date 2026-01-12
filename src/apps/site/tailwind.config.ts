import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // FlashFusion Brand Colors (New Design System)
        primary: {
          50: 'hsl(var(--primary-50))',
          100: 'hsl(var(--primary-100))',
          200: 'hsl(var(--primary-200))',
          300: 'hsl(var(--primary-300))',
          400: 'hsl(var(--primary-400))',
          500: 'hsl(var(--primary-500))',
          600: 'hsl(var(--primary-600))',
          700: 'hsl(var(--primary-700))',
          800: 'hsl(var(--primary-800))',
          900: 'hsl(var(--primary-900))',
          DEFAULT: 'hsl(var(--primary))',
        },
        secondary: {
          50: 'hsl(var(--secondary-50))',
          100: 'hsl(var(--secondary-100))',
          200: 'hsl(var(--secondary-200))',
          300: 'hsl(var(--secondary-300))',
          400: 'hsl(var(--secondary-400))',
          500: 'hsl(var(--secondary-500))',
          600: 'hsl(var(--secondary-600))',
          700: 'hsl(var(--secondary-700))',
          800: 'hsl(var(--secondary-800))',
          900: 'hsl(var(--secondary-900))',
          DEFAULT: 'hsl(var(--secondary))',
        },
        success: {
          50: 'hsl(var(--success-50))',
          100: 'hsl(var(--success-100))',
          300: 'hsl(var(--success-300))',
          500: 'hsl(var(--success-500))',
          700: 'hsl(var(--success-700))',
          900: 'hsl(var(--success-900))',
          DEFAULT: 'hsl(var(--success))',
        },
        warning: {
          50: 'hsl(var(--warning-50))',
          100: 'hsl(var(--warning-100))',
          300: 'hsl(var(--warning-300))',
          500: 'hsl(var(--warning-500))',
          700: 'hsl(var(--warning-700))',
          900: 'hsl(var(--warning-900))',
          DEFAULT: 'hsl(var(--warning))',
        },
        error: {
          50: 'hsl(var(--error-50))',
          100: 'hsl(var(--error-100))',
          300: 'hsl(var(--error-300))',
          500: 'hsl(var(--error-500))',
          700: 'hsl(var(--error-700))',
          900: 'hsl(var(--error-900))',
          DEFAULT: 'hsl(var(--error))',
        },
        info: {
          50: 'hsl(var(--info-50))',
          100: 'hsl(var(--info-100))',
          300: 'hsl(var(--info-300))',
          500: 'hsl(var(--info-500))',
          700: 'hsl(var(--info-700))',
          900: 'hsl(var(--info-900))',
          DEFAULT: 'hsl(var(--info))',
        },
        neutral: {
          50: 'hsl(var(--neutral-50))',
          100: 'hsl(var(--neutral-100))',
          200: 'hsl(var(--neutral-200))',
          300: 'hsl(var(--neutral-300))',
          400: 'hsl(var(--neutral-400))',
          500: 'hsl(var(--neutral-500))',
          600: 'hsl(var(--neutral-600))',
          700: 'hsl(var(--neutral-700))',
          800: 'hsl(var(--neutral-800))',
          900: 'hsl(var(--neutral-900))',
          950: 'hsl(var(--neutral-950))',
        },
        // Shadcn/UI compatible colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        
        // Legacy colors (backward compatibility)
        'ff-primary': '#FF7B00',
        'ff-secondary': '#00B4D8',
        'ff-accent': '#E91E63',
        'ff-bg-dark': '#0F172A',
        'ff-surface': '#1E293B',
        'ff-text-primary': '#FFFFFF',
        'ff-text-secondary': '#CBD5E1',
        'ff-text-muted': '#94A3B8',
      },
      fontFamily: {
        heading: ['Poppins', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        // Legacy aliases
        sora: ['Sora', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px hsl(var(--primary) / 0.5), 0 0 40px hsl(var(--primary) / 0.3)',
        'glow-secondary': '0 0 20px hsl(var(--secondary) / 0.5), 0 0 40px hsl(var(--secondary) / 0.3)',
        'glow-accent': '0 0 20px hsl(280, 100%, 70% / 0.5), 0 0 40px hsl(280, 100%, 70% / 0.3)',
        glass: '0 8px 32px 0 rgba(15, 6, 24, 0.37)',
        'glass-light': '0 4px 16px 0 rgba(255, 255, 255, 0.1)',
      },
      backdropBlur: {
        glass: '12px',
        'glass-light': '8px',
        'glass-heavy': '20px',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        glow: 'glow 2s ease-in-out infinite alternate',
        float: 'float 3s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glow: {
          '0%': {
            boxShadow: '0 0 20px hsl(var(--primary) / 0.5)',
          },
          '100%': {
            boxShadow: '0 0 40px hsl(var(--primary) / 0.8), 0 0 80px hsl(var(--primary) / 0.5)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '200% 0',
          },
          '100%': {
            backgroundPosition: '-200% 0',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;

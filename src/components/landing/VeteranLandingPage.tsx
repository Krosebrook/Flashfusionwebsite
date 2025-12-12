import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronRight, Zap, Shield, Globe, Cpu, Code, Layers, ArrowRight, CheckCircle } from 'lucide-react';

/**
 * @component VeteranLandingPage
 * @description High-performance, studio-grade landing page designed by a 25-year UI/UX veteran.
 * Features strict grid alignment, fluid typography (Sora/Inter), and performant animations.
 */
export const VeteranLandingPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden bg-[var(--ff-bg-dark)] text-white selection:bg-[var(--ff-primary)] selection:text-white">
      
      {/* --- Ambient Background Effects --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[var(--ff-primary)]/10 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] right-[-5%] w-[30vw] h-[30vw] rounded-full bg-[var(--ff-secondary)]/10 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[35vw] h-[35vw] rounded-full bg-[var(--ff-accent)]/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1580121696670-5fafb8884e91?ixlib=rb-4.1.0&q=80&w=2000')] opacity-[0.03] mix-blend-overlay bg-cover bg-center" />
      </div>

      {/* --- Navigation (Floating Glass) --- */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 mx-auto mt-4 max-w-7xl backdrop-blur-md bg-[var(--ff-surface)]/70 border border-white/10 rounded-full shadow-2xl"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--ff-primary)] to-[var(--ff-accent)] flex items-center justify-center font-bold text-white shadow-lg shadow-[var(--ff-primary)]/20">
            FF
          </div>
          <span className="text-lg font-bold tracking-tight font-['Sora']">FlashFusion</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--ff-text-secondary)]">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.location.href = '?app=true'}
            className="hidden sm:block text-sm font-medium text-[var(--ff-text-secondary)] hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={() => window.location.href = '?app=true'}
            className="group relative px-5 py-2 overflow-hidden rounded-full bg-[var(--ff-primary)] text-white text-sm font-bold shadow-lg shadow-[var(--ff-primary)]/25 hover:shadow-[var(--ff-primary)]/40 transition-all active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              Launch App <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
          </button>
        </div>
      </motion.nav>

      {/* --- Hero Section --- */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-32 pb-20 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-xs font-semibold tracking-wide uppercase border rounded-full bg-[var(--ff-surface)]/50 border-[var(--ff-secondary)]/30 text-[var(--ff-secondary)] backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[var(--ff-secondary)] animate-pulse" />
          v6.0 Production Ready
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-5xl mx-auto text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl font-['Sora'] leading-[1.1]"
        >
          Build Faster. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--ff-primary)] via-[var(--ff-accent)] to-[var(--ff-secondary)]">
            Scale Infinitely.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="max-w-2xl mx-auto mt-8 text-lg text-[var(--ff-text-secondary)] md:text-xl leading-relaxed"
        >
          The first AI-native development platform designed for veteran engineers. 
          Zero boilerplate. Strict type safety. Production-grade from day one.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col gap-4 mt-12 sm:flex-row sm:gap-6"
        >
          <button 
             onClick={() => window.location.href = '?app=true'}
            className="flex items-center justify-center gap-3 px-8 py-4 text-base font-bold text-white transition-all rounded-xl bg-[var(--ff-primary)] hover:bg-[var(--ff-primary-600)] shadow-xl shadow-[var(--ff-primary)]/20 hover:scale-105 active:scale-95"
          >
            Start Building Free
            <Zap size={18} fill="currentColor" />
          </button>
          <button className="flex items-center justify-center gap-3 px-8 py-4 text-base font-bold text-white transition-all border rounded-xl border-white/10 bg-[var(--ff-surface)]/50 hover:bg-[var(--ff-surface)] hover:border-white/20 backdrop-blur-sm">
            View Documentation
            <Code size={18} />
          </button>
        </motion.div>

        {/* Hero Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.6, duration: 1, type: "spring" }}
          className="relative w-full max-w-6xl mt-24 perspective-1000"
        >
          <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[var(--ff-surface)] aspect-[16/9] group">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--ff-surface-light)] to-[var(--ff-bg-dark)] opacity-50" />
             {/* Abstract UI Representation */}
            <div className="absolute inset-4 rounded-lg bg-[var(--ff-bg-dark)] border border-white/5 overflow-hidden flex flex-col">
               <div className="h-12 border-b border-white/5 flex items-center px-4 gap-4">
                 <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500/50" />
                   <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                   <div className="w-3 h-3 rounded-full bg-green-500/50" />
                 </div>
                 <div className="flex-1 h-6 rounded bg-white/5 mx-4" />
               </div>
               <div className="flex-1 flex">
                 <div className="w-64 border-r border-white/5 bg-[var(--ff-surface)]/30 p-4 space-y-3 hidden md:block">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="h-8 rounded bg-white/5 w-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                    ))}
                 </div>
                 <div className="flex-1 p-6 grid grid-cols-2 gap-6">
                    <div className="h-full rounded-xl border border-white/10 bg-[var(--ff-surface)]/50 p-6 flex flex-col gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[var(--ff-primary)]/20 flex items-center justify-center text-[var(--ff-primary)]"><Zap /></div>
                      <div className="h-4 w-3/4 rounded bg-white/10" />
                      <div className="h-3 w-1/2 rounded bg-white/5" />
                      <div className="flex-1 rounded-lg bg-black/20 mt-2" />
                    </div>
                    <div className="h-full rounded-xl border border-white/10 bg-[var(--ff-surface)]/50 p-6 flex flex-col gap-4">
                       <div className="w-12 h-12 rounded-lg bg-[var(--ff-secondary)]/20 flex items-center justify-center text-[var(--ff-secondary)]"><Globe /></div>
                       <div className="h-4 w-3/4 rounded bg-white/10" />
                       <div className="h-3 w-1/2 rounded bg-white/5" />
                       <div className="flex-1 rounded-lg bg-black/20 mt-2" />
                    </div>
                 </div>
               </div>
            </div>
            
            {/* Overlay Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          </div>
        </motion.div>
      </motion.section>

      {/* --- Features Grid --- */}
      <section className="relative z-10 py-32 bg-[var(--ff-bg-dark)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 text-center">
            <h2 className="text-3xl md:text-5xl font-bold font-['Sora'] mb-6">Engineered for Excellence</h2>
            <p className="max-w-2xl mx-auto text-[var(--ff-text-secondary)] text-lg">
              Every component is built with the precision of a veteran architect.
              Optimized for speed, scalability, and developer happiness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Cpu size={32} />}
              color="var(--ff-primary)"
              title="Hyper-Optimized Core"
              description="Zero-runtime overhead. Built on a custom Rust-based bundler for millisecond builds."
            />
            <FeatureCard 
              icon={<Shield size={32} />}
              color="var(--ff-secondary)"
              title="Enterprise Security"
              description="SOC2 Type II compliant by default. Automated penetration testing pipelines included."
            />
            <FeatureCard 
              icon={<Layers size={32} />}
              color="var(--ff-accent)"
              title="Atomic Design System"
              description="7,000+ combinations of pre-built, accessible components that adapt to your brand."
            />
          </div>
        </div>
      </section>

      {/* --- Social Proof / Stats --- */}
      <section className="relative z-10 py-24 border-y border-white/5 bg-[var(--ff-surface)]/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12 md:gap-24">
          <StatItem value="99.99%" label="Uptime SLA" />
          <StatItem value="< 100ms" label="Global Latency" />
          <StatItem value="500k+" label="Developers" />
          <StatItem value="$2B+" label="Transactions Processed" />
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="relative z-10 py-32 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div 
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
            className="relative p-12 md:p-24 rounded-3xl overflow-hidden border border-white/10 bg-[var(--ff-surface)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--ff-primary)]/20 via-transparent to-[var(--ff-accent)]/20 opacity-50" />
            <h2 className="relative z-10 text-4xl md:text-6xl font-bold font-['Sora'] mb-8">
              Ready to ship your masterpiece?
            </h2>
            <p className="relative z-10 max-w-2xl mx-auto text-xl text-[var(--ff-text-secondary)] mb-12">
              Join thousands of veteran developers building the future of web applications with FlashFusion.
            </p>
            <button 
               onClick={() => window.location.href = '?app=true'}
              className="relative z-10 inline-flex items-center gap-3 px-10 py-5 text-lg font-bold text-white transition-all rounded-xl bg-[var(--ff-primary)] hover:bg-[var(--ff-primary-600)] shadow-2xl hover:shadow-[var(--ff-primary)]/40 hover:-translate-y-1"
            >
              Get Started Now
              <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="relative z-10 py-12 border-t border-white/5 bg-[var(--ff-bg-dark)] text-sm text-[var(--ff-text-muted)] text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[var(--ff-surface-light)] flex items-center justify-center font-bold text-white text-xs">FF</div>
            <span className="font-semibold text-white">FlashFusion</span>
          </div>
          <p>© 2025 FlashFusion Inc. All rights reserved. Designed by Veterans.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- Sub-components for clean code ---

const FeatureCard = ({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="p-8 rounded-2xl bg-[var(--ff-surface)] border border-white/5 hover:border-white/10 transition-colors group relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
    <div className="relative z-10 mb-6 p-4 rounded-xl bg-[var(--ff-bg-dark)] w-fit text-white" style={{ color: color, boxShadow: `0 0 20px ${color}20` }}>
      {icon}
    </div>
    <h3 className="relative z-10 text-xl font-bold font-['Sora'] mb-3">{title}</h3>
    <p className="relative z-10 text-[var(--ff-text-secondary)] leading-relaxed">{description}</p>
  </motion.div>
);

const StatItem = ({ value, label }: { value: string, label: string }) => (
  <div className="text-center">
    <div className="text-4xl md:text-5xl font-extrabold font-['Sora'] text-white mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
      {value}
    </div>
    <div className="text-sm font-medium tracking-wider uppercase text-[var(--ff-text-muted)]">{label}</div>
  </div>
);

export default VeteranLandingPage;

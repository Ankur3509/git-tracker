'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Navbar Alternative: Simple Logo */}
      <div className="flex items-center justify-between mb-24">
        <div className="font-mono font-bold text-xl flex items-center gap-2">
          <span className="text-indigo-500">$</span>
          <span>git_tracker_</span>
        </div>
        <div className="flex gap-8 font-mono text-sm text-zinc-500">
          <Link href="/dashboard" className="hover:text-white transition-colors">/dashboard</Link>
          <Link href="/onboarding" className="text-indigo-400 hover:text-indigo-300 transition-colors">/connect</Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="mb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="font-mono text-indigo-500 text-sm mb-4">{'// Open Source Intelligence'}</div>
            <h1 className="text-6xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500 leading-tight">
              Visualize your repository growth.
            </h1>
            <p className="text-zinc-400 text-lg mb-10 leading-relaxed max-w-lg">
              Automated telemetry, AI-generated insights, and social assets for developers who build in public.
            </p>
            <div className="flex gap-4">
              <Link href="/onboarding" className="btn-indigo px-8 py-3 text-base">
                Get Started
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
              <Link href="/dashboard" className="btn-ghost px-8 py-3 text-base">View Demo</Link>
            </div>
          </div>

          <div className={`terminal-window transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="terminal-header">
              <div className="dot dot-red"></div>
              <div className="dot dot-yellow"></div>
              <div className="dot dot-green"></div>
              <div className="ml-4 text-[10px] text-zinc-500 font-mono">agent.py — git-tracker — 80x24</div>
            </div>
            <div className="terminal-body">
              <div className="mb-2"><span className="text-indigo-400">$</span> git_tracker --remote=origin</div>
              <div className="text-zinc-500 mb-2">Connecting to github_api... [OK]</div>
              <div className="flex gap-2 mb-2">
                <span className="text-emerald-500">✓</span>
                <span>Metrics captured: stars=1,240, views=5,602</span>
              </div>
              <div className="mb-4">
                <span className="text-indigo-400">$</span> generating_social_payload...
              </div>
              <div className="p-4 bg-zinc-900/50 rounded border border-zinc-800 italic text-zinc-400 text-xs">
                "Another 10% jump in stars today for @sagarit/git-tracker! Huge thanks to the community for the clones and support. 🚀 #BuildInPublic"
              </div>
              <div className="mt-4"><span className="text-indigo-400 animation-pulse">_</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento-style Feature Section */}
      <section className="mb-32">
        <div className="section-header uppercase tracking-widest text-[10px] font-bold">
          {'// Core Capabilities'}
        </div>

        <div className="grid md:grid-cols-12 gap-6 h-auto md:h-[600px]">
          <div className="md:col-span-8 glass-card p-10 flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
            <div>
              <h3 className="text-3xl font-bold mb-4">Neural Data Analysis</h3>
              <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
                Our AI agent monitors your GitHub traffic patterns and star conversion rates to predict future growth vectors.
              </p>
            </div>
            <div className="font-mono text-zinc-600 text-sm">STATE: OPERATIONAL</div>
          </div>

          <div className="md:col-span-4 glass-card p-10 bg-indigo-500/5 border-indigo-500/20">
            <div className="w-12 h-12 bg-indigo-500 rounded-lg mb-6 flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Instant Payload</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Generate ready-to-post content for LinkedIn and X with one click. Adheres to character limits and SEO practices.
            </p>
          </div>

          <div className="md:col-span-4 glass-card p-10">
            <h3 className="text-xl font-bold mb-3">Daily Telemetry</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Track stars, views, and clones with sub-24h precision. No more waiting for the standard GitHub traffic tab delay.
            </p>
          </div>

          <div className="md:col-span-8 glass-card p-10 flex items-center justify-between">
            <div className="max-w-xs">
              <h3 className="text-xl font-bold mb-3">Secure Link</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Zero data persistence. We only read public metrics. Your private data stays in your control.
              </p>
            </div>
            <div className="hidden sm:block opacity-20 transform rotate-12">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
            </div>
          </div>
        </div>
      </section>

      {/* System Status Alternative Footer */}
      <footer className="pt-12 border-t border-zinc-900 flex flex-col sm:row items-center justify-between gap-6 opacity-50">
        <div className="font-mono text-xs">© 2026 GIT_TRACKER.v1.0.2</div>
        <div className="flex gap-4 items-center">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
          <span className="font-mono text-[10px] uppercase tracking-tighter">System Status: 100% Operational</span>
        </div>
      </footer>
    </div>
  );
}

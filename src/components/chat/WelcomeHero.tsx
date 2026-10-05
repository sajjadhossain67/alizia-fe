'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Cpu,
  ShieldCheck,
  Palette,
  Database,
  ArrowUpRight,
  Sparkles,
  Search,
  Code2,
  FileText
} from 'lucide-react';

const SUGGESTIONS = [
  {
    tag: 'Deep Reasoning',
    title: 'Analyze Concurrency & Memory',
    text: 'Analyze distributed consensus latency and formal verification invariants for high-throughput messaging.',
    icon: Cpu,
    category: 'Architecture'
  },
  {
    tag: 'Proof Mode',
    title: 'Cryptographic Claim Verification',
    text: 'Generate a verifiable proof decomposing claims with arXiv grounded citations and sandbox execution.',
    icon: ShieldCheck,
    category: 'Verification'
  },
  {
    tag: 'UI & Design',
    title: 'Gemini Polish & Glass Tokens',
    text: 'Review reactive state architecture and design system tokens for edge-to-edge perfection.',
    icon: Palette,
    category: 'Design'
  },
  {
    tag: 'Agent Studio',
    title: 'Autonomous Multi-Step Plan',
    text: 'Plan, execute, and verify a 5-phase Python test harness with deterministic assert validations.',
    icon: Database,
    category: 'Autonomous'
  },
];

export const WelcomeHero: React.FC = () => {
  const { sendMessage } = useApp();

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center px-4 py-8 md:py-16 text-center select-none animate-in fade-in duration-300">
      {/* Sparkle Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent)]/30 text-[var(--accent)] text-xs font-semibold mb-6 shadow-xs">
        <Sparkles size={14} className="animate-pulse" />
        <span>Frontier Multimodal Intelligence & Proof Protocol</span>
      </div>

      {/* Main Gemini-Style Greeting */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--color-on-surface)] leading-tight mb-2">
        Hello,{' '}
        <span className="bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570] bg-clip-text text-transparent">
          Developer
        </span>
      </h1>
      <h2 className="text-lg md:text-2xl font-normal text-[var(--color-on-surface-muted)] mb-10">
        How can Alizia help you today?
      </h2>

      {/* Suggestion Cards Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
        {SUGGESTIONS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={() => sendMessage(item.text)}
              className="group relative p-4 rounded-[var(--radius-xl)] bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-outline)] hover:border-[var(--accent)]/40 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-semibold text-[var(--color-on-surface-muted)] group-hover:text-[var(--accent)] transition-colors uppercase tracking-wider">
                  {item.category}
                </span>
                <div className="w-7 h-7 rounded-full bg-[var(--color-surface)] border border-[var(--color-outline)] flex items-center justify-center text-[var(--color-on-surface-muted)] group-hover:text-[var(--accent)] transition-colors shadow-xs">
                  <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-[var(--color-on-surface)] group-hover:text-[var(--accent)] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[var(--color-on-surface-muted)] line-clamp-2 leading-relaxed">
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

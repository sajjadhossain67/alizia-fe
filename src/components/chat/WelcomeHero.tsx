'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Lightbulb,
  Code2,
  ShieldCheck,
} from 'lucide-react';

const SUGGESTIONS = [
  {
    text: 'Analyze distributed consensus protocols and formal verification invariants',
    icon: Compass,
  },
  {
    text: 'Generate a verifiable proof decomposing claims with arXiv grounded citations',
    icon: ShieldCheck,
  },
  {
    text: 'Write a resilient TypeScript hook for streaming SSE tokens with backpressure',
    icon: Code2,
  },
  {
    text: 'Design a minimalist, calm interface with generous whitespace and tonal surfaces',
    icon: Lightbulb,
  },
];

export const WelcomeHero: React.FC = () => {
  const { sendMessage } = useApp();

  return (
    <div className="w-full max-w-[830px] mx-auto flex flex-col items-start px-4 select-none animate-in fade-in duration-300">
      {/* Gemini Signature Gradient Greeting */}
      <div className="mb-10 sm:mb-12">
        <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-medium tracking-tight bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570] bg-clip-text text-transparent leading-[1.12]">
          Hello, Developer
        </h1>
        <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-medium tracking-tight text-[#444746] dark:text-[#444746] leading-[1.12] mt-1">
          How can I help you today?
        </h2>
      </div>

      {/* 4 Clean Gemini Suggestion Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
        {SUGGESTIONS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={() => sendMessage(item.text)}
              className="group h-[175px] p-4.5 rounded-2xl bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-hover)] transition-all duration-200 cursor-pointer flex flex-col justify-between border border-transparent hover:border-[var(--color-outline)] select-none"
            >
              <p className="text-[14px] text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-on-surface)] leading-relaxed font-normal line-clamp-4 transition-colors">
                {item.text}
              </p>

              <div className="flex justify-end pt-2">
                <div className="w-9 h-9 rounded-full bg-[var(--color-background)] flex items-center justify-center text-[var(--color-on-surface-muted)] group-hover:text-[var(--color-on-surface)] transition-all">
                  <Icon size={18} strokeWidth={1.8} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


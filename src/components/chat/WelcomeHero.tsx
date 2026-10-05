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
    text: 'Write a clean TypeScript hook for streaming SSE tokens with backpressure',
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
    <div className="w-full max-w-4xl mx-auto flex flex-col items-start justify-center px-4 pt-12 pb-6 select-none animate-in fade-in duration-300">
      {/* Gemini Signature Gradient Greeting */}
      <div className="flex flex-col mb-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570] bg-clip-text text-transparent leading-[1.15]">
          Hello, Developer
        </h1>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[var(--color-on-surface-disabled)] leading-[1.15] mt-1">
          How can I help you today?
        </h2>
      </div>

      {/* 4 Clean Gemini Prompt Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
        {SUGGESTIONS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={() => sendMessage(item.text)}
              className="group h-40 p-4 rounded-2xl bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-hover)] transition-all duration-200 cursor-pointer flex flex-col justify-between select-none"
            >
              <p className="text-[14px] text-[var(--color-on-surface)] leading-relaxed font-normal line-clamp-3">
                {item.text}
              </p>

              <div className="flex justify-end">
                <div className="w-9 h-9 rounded-full bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-on-surface-muted)] group-hover:text-[var(--color-on-surface)] transition-colors">
                  <Icon size={18} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

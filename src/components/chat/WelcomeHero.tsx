'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronRight, Cpu, ShieldCheck, Palette, Database } from 'lucide-react';

const SUGGESTIONS = [
  {
    tag: 'Architecture',
    text: 'Analyze system concurrency bottlenecks and distributed locking strategies.',
    icon: Cpu
  },
  {
    tag: 'Verifiable AI',
    text: 'Run a verifiable agent to inspect code and generate formal execution proofs.',
    icon: ShieldCheck
  },
  {
    tag: 'Design System',
    text: 'Synthesize high-performance reactive UI patterns with glassmorphism.',
    icon: Palette
  },
  {
    tag: 'Knowledge Engine',
    text: 'Inspect multi-tier memory architecture and pgvector hybrid search.',
    icon: Database
  }
];

export const WelcomeHero: React.FC = () => {
  const { sendMessage } = useApp();

  return (
    <div className="welcome-hero">
      <h1 className="welcome-greeting">Hello, Developer</h1>
      <h2 className="welcome-sub">How can Alizia help you today?</h2>

      <div className="suggestion-grid">
        {SUGGESTIONS.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              className="suggestion-card"
              onClick={() => sendMessage(item.text)}
            >
              <div className="suggestion-text">{item.text}</div>
              <div className="suggestion-footer">
                <span className="suggestion-tag">{item.tag}</span>
                <div className="suggestion-icon-circle">
                  <IconComponent size={14} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

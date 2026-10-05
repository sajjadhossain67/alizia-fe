'use client';

import React, { useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { WelcomeHero } from './WelcomeHero';
import { ChatMessage } from './ChatMessage';
import { InputDock } from './InputDock';
import { ProofDrawer } from './ProofDrawer';

export const ChatView: React.FC = () => {
  const { activeConversation, isGenerating, activeProof, setActiveProof } = useApp();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const messages = activeConversation?.messages || [];

  // Auto-scroll to bottom on message updates or generation
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  return (
    <div className="flex-1 w-full h-full flex flex-col justify-between overflow-hidden relative">
      {/* Scrollable messages area */}
      <div
        ref={scrollAreaRef}
        className="flex-1 w-full overflow-y-auto px-2 md:px-6 py-4 scroll-smooth custom-scrollbar flex flex-col items-center"
      >
        <div className="w-full max-w-4xl flex-1 flex flex-col justify-center">
          {messages.length === 0 ? (
            <WelcomeHero />
          ) : (
            <div className="w-full flex flex-col gap-4 py-4 pb-12">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Input Dock at Bottom */}
      <InputDock />

      {/* Verifiable Proof Drawer Sheet */}
      {activeProof && (
        <ProofDrawer proof={activeProof} onClose={() => setActiveProof(null)} />
      )}
    </div>
  );
};

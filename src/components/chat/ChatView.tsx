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
    <section className="view-container active">
      <div className="chat-scroll-area" ref={scrollAreaRef}>
        <div className="chat-content-constrained">
          {messages.length === 0 ? (
            <WelcomeHero />
          ) : (
            <div className="flex flex-col gap-7 w-full py-4">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
            </div>
          )}
        </div>
      </div>

      <InputDock />

      {activeProof && (
        <ProofDrawer proof={activeProof} onClose={() => setActiveProof(null)} />
      )}
    </section>
  );
};

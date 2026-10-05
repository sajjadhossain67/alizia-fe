'use client';

import React, { useState } from 'react';
import { Message } from '../../types';
import { MarkdownRenderer } from '../MarkdownRenderer';
import { useApp } from '../../context/AppContext';
import { speechService } from '../../services/speech';
import { Sparkles, ChevronDown, Copy, Volume2, ThumbsUp, Check, ShieldCheck, Share2 } from 'lucide-react';
import { AliziaSparkle } from '../ui/AliziaSparkle';

export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const { showToast, setActiveProof } = useApp();
  const [thinkingOpen, setThinkingOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    showToast('Response copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    speechService.speak(message.content, (speaking) => {
      setIsSpeaking(speaking);
    });
  };

  if (isUser) {
    return (
      <div className="w-full flex justify-end px-4 py-2 animate-in fade-in duration-200">
        <div className="max-w-[85%] md:max-w-2xl flex flex-col items-end gap-1.5">
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-1 justify-end">
              {message.attachments.map((att) => (
                <div
                  key={att.id}
                  className="rounded-xl overflow-hidden border border-[var(--color-outline)] shadow-xs max-w-xs max-h-48"
                >
                  {att.type.startsWith('image/') ? (
                    <img src={att.dataUrl} alt={att.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="p-3 bg-[var(--color-surface-container)] text-xs text-[var(--color-on-surface-variant)]">
                      {att.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="px-5 py-3 rounded-2xl rounded-tr-sm bg-[var(--color-surface-container)] text-[var(--color-on-surface)] border border-[var(--color-outline)] shadow-xs text-sm md:text-base leading-relaxed break-words">
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  const hasThinking = Boolean(
    message.thinking &&
    message.thinking.trim() &&
    !message.thinking.includes('Analyzing objective with')
  );

  return (
    <div className="w-full flex items-start gap-4 px-4 py-4 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Alizia Sparkle Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4285F4]/20 via-[#9B72CB]/20 to-[#D96570]/20 border border-[var(--color-outline)] flex items-center justify-center shrink-0 shadow-xs mt-1">
        <AliziaSparkle size={18} thinking={message.isLive} animate={message.isLive} />
      </div>

      <div className="flex-1 flex flex-col gap-2 min-w-0">
        {/* Model Header */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--color-on-surface)]">Alizia AI</span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-[var(--color-surface-container)] text-[var(--color-on-surface-muted)] border border-[var(--color-outline)]">
            {message.model || 'Alizia Nova 1.5'}
          </span>
          {message.isLive && (
            <span className="flex items-center gap-1 text-[11px] text-[var(--accent)] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-ping" />
              Thinking...
            </span>
          )}
        </div>

        {/* Expandable Thinking Accordion */}
        {hasThinking && (
          <div className="w-full rounded-[var(--radius-lg)] border border-[var(--color-outline)] bg-[var(--color-surface-container)]/60 overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setThinkingOpen(!thinkingOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2 hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer select-none text-left"
            >
              <div className="flex items-center gap-2 text-[var(--color-on-surface-muted)]">
                <Sparkles size={14} className="text-[#9B72CB]" />
                <span className="font-medium text-[var(--color-on-surface-variant)]">Thinking Process</span>
              </div>
              <ChevronDown
                size={14}
                className={`text-[var(--color-on-surface-muted)] transition-transform duration-200 ${
                  thinkingOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {thinkingOpen && (
              <div className="px-3.5 pb-3 pt-1 text-[11px] font-mono text-[var(--color-on-surface-muted)] leading-relaxed whitespace-pre-wrap border-t border-[var(--color-outline)]/50">
                {message.thinking}
              </div>
            )}
          </div>
        )}

        {/* Message Body */}
        <div className="text-sm md:text-base leading-relaxed text-[var(--color-on-surface)] break-words">
          <MarkdownRenderer content={message.content} isLive={message.isLive} />
        </div>

        {/* Actions Toolbar */}
        {!message.isLive && message.content && (
          <div className="flex flex-wrap items-center gap-2 mt-2 pt-1">
            {/* Show Proof Button */}
            {message.proof && (
              <button
                onClick={() => setActiveProof(message.proof)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all cursor-pointer shadow-xs shadow-emerald-500/10 mr-1"
                title="Inspect Atomic Claims, Citations & Sandbox Verifications"
              >
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Show Proof</span>
                <span className="text-[10px] font-mono px-1 rounded bg-emerald-500/20 text-emerald-300 uppercase">
                  {message.proof.verifier_verdict} {(message.proof.confidence * 100).toFixed(0)}%
                </span>
              </button>
            )}

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-full text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
              title="Copy message"
              aria-label="Copy message"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>

            {/* Read Aloud Button */}
            <button
              onClick={handleSpeak}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isSpeaking
                  ? 'text-[var(--accent)] bg-[var(--accent-subtle)]'
                  : 'text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)]'
              }`}
              title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
              aria-label="Read aloud"
            >
              <Volume2 size={14} />
            </button>

            {/* Thumbs Up Button */}
            <button
              onClick={() => {
                setLiked(!liked);
                showToast(liked ? 'Feedback removed' : 'Thank you for your feedback!');
              }}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                liked
                  ? 'text-[#4285F4] bg-blue-500/15'
                  : 'text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)]'
              }`}
              title="Good response"
              aria-label="Thumbs up"
            >
              <ThumbsUp size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

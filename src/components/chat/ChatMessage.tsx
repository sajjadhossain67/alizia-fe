'use client';

import React, { useState } from 'react';
import { Message } from '../../types';
import { MarkdownRenderer } from '../MarkdownRenderer';
import { useApp } from '../../context/AppContext';
import { speechService } from '../../services/speech';
import { Sparkles, ChevronDown, Copy, Volume2, ThumbsUp, Check } from 'lucide-react';
import Image from 'next/image';

export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const { showToast } = useApp();
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
      <div className="chat-message-row user-row">
        <div className="message-bubble-wrapper">
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {message.attachments.map((att) => (
                <div key={att.id} className="message-media-attachment">
                  {att.type.startsWith('image/') ? (
                    <img src={att.dataUrl} alt={att.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="p-3 bg-[var(--bg-tertiary)] text-xs text-[var(--text-secondary)]">
                      {att.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="user-bubble">{message.content}</div>
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
    <div className="chat-message-row assistant-row">
      <div className="message-avatar alizia-avatar">
        <Image
          src="/assets/alizia-logo.png"
          alt="Alizia AI"
          width={24}
          height={24}
          className="object-contain"
        />
      </div>

      <div className="message-bubble-wrapper">
        <div className="assistant-header">
          <span className="assistant-name">Alizia AI</span>
          <span className="assistant-model-tag">{message.model || 'Alizia Nova 1.0'}</span>
        </div>

        {/* Expandable Thinking Process Accordion */}
        {hasThinking && (
          <div className={`thinking-accordion ${thinkingOpen ? 'open' : ''}`}>
            <div
              className="thinking-header cursor-pointer select-none"
              onClick={() => setThinkingOpen(!thinkingOpen)}
            >
              <Sparkles size={16} className="thinking-sparkle" />
              <span className="thinking-title">Thinking process</span>
              <ChevronDown
                size={14}
                className={`thinking-chevron transition-transform duration-200 ${thinkingOpen ? 'rotate-180' : ''}`}
              />
            </div>
            {thinkingOpen && (
              <div className="thinking-content whitespace-pre-wrap font-mono text-xs text-[var(--text-secondary)] bg-[var(--bg-tertiary)]/40 p-3.5 rounded-xl border border-[var(--border-subtle)] mt-2">
                {message.thinking}
              </div>
            )}
          </div>
        )}

        {/* Message Markdown Body */}
        <div className="message-body">
          <MarkdownRenderer content={message.content} isLive={message.isLive} />
        </div>

        {/* Actions Toolbar */}
        {!message.isLive && message.content && (
          <div className="message-actions-toolbar flex items-center gap-2 mt-2">
            <button
              className="msg-action-btn copy-msg-btn"
              onClick={handleCopy}
              title="Copy response"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>

            <button
              className={`msg-action-btn speak-msg-btn ${isSpeaking ? 'active' : ''}`}
              onClick={handleSpeak}
              title={isSpeaking ? 'Stop reading' : 'Read aloud'}
            >
              {isSpeaking ? (
                <span className="voice-wave-container">
                  <span className="voice-wave-bar" />
                  <span className="voice-wave-bar" />
                  <span className="voice-wave-bar" />
                  <span className="voice-wave-bar" />
                </span>
              ) : (
                <Volume2 size={14} />
              )}
            </button>

            <button
              className={`msg-action-btn thumbs-up-btn ${liked ? 'active text-indigo-400' : ''}`}
              onClick={() => setLiked(!liked)}
              title="Helpful response"
            >
              <ThumbsUp size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, ArrowUp, Square, Mic, X, FileText, ShieldCheck, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Attachment } from '../../types';

export const InputDock: React.FC = () => {
  const {
    sendMessage,
    stopGeneration,
    isGenerating,
    attachments,
    addAttachment,
    removeAttachment,
    isDictating,
    toggleDictation,
    currentTranscript,
    proofMode,
    setProofMode,
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync speech dictation transcript into input
  useEffect(() => {
    if (currentTranscript) {
      setInputVal(currentTranscript);
      adjustTextareaHeight();
    }
  }, [currentTranscript]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputVal(e.target.value);
    adjustTextareaHeight();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (isGenerating) {
      stopGeneration();
      return;
    }

    if (!inputVal.trim() && attachments.length === 0) return;

    sendMessage(inputVal);
    setInputVal('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const att: Attachment = {
          id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: event.target?.result as string,
        };
        addAttachment(att);
      };

      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });

    e.target.value = '';
  };

  const hasContent = inputVal.trim().length > 0 || attachments.length > 0;

  return (
    <div className="w-full flex flex-col items-center justify-center px-4 pb-4 pt-1 pointer-events-none select-none z-20">
      <div className="w-full max-w-3xl flex flex-col gap-2 pointer-events-auto">
        {/* Floating Input Dock Pill */}
        <div className="relative w-full rounded-[28px] md:rounded-[32px] bg-[var(--color-surface-container)]/95 border border-[var(--color-outline)] shadow-[var(--shadow-floating)] backdrop-blur-2xl transition-all duration-200 focus-within:border-[var(--accent)]/60 focus-within:ring-2 focus-within:ring-[var(--accent)]/20 p-2 md:p-2.5">
          {/* Attachment Previews Tray */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 px-3 pt-1 pb-2 border-b border-[var(--color-outline)] mb-2">
              {attachments.map((att, idx) => (
                <div
                  key={att.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-outline)] text-xs text-[var(--color-on-surface)] shadow-xs"
                >
                  {att.type.startsWith('image/') ? (
                    <img src={att.dataUrl} className="w-4 h-4 rounded-full object-cover" alt={att.name} />
                  ) : (
                    <FileText size={13} className="text-[var(--accent)]" />
                  )}
                  <span className="truncate max-w-[120px] font-medium text-[11px]">{att.name}</span>
                  <button
                    onClick={() => removeAttachment(idx)}
                    className="p-0.5 rounded-full hover:bg-[var(--color-surface-hover)] text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] cursor-pointer"
                    title="Remove attachment"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Row */}
          <div className="flex items-end gap-2 px-1">
            {/* Left Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-full text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer shrink-0 mb-0.5"
              title="Attach images or documents"
              aria-label="Attach file"
            >
              <Plus size={20} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*,.txt,.py,.js,.ts,.json,.md,.csv"
              multiple
              onChange={handleFileUpload}
            />

            {/* Main Auto-Grow Textarea */}
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputVal}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask Alizia anything..."
              className="flex-1 bg-transparent border-none text-sm md:text-base text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-muted)] focus:outline-none resize-none py-2 px-1 max-h-48 leading-relaxed custom-scrollbar"
            />

            {/* Right Action Tools: Proof Mode Toggle, Mic, Send/Stop */}
            <div className="flex items-center gap-1.5 shrink-0 mb-0.5">
              {/* Proof Mode Chip */}
              <button
                type="button"
                onClick={() => setProofMode(!proofMode)}
                className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  proofMode
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-xs shadow-emerald-500/10'
                    : 'bg-transparent text-[var(--color-on-surface-muted)] border-transparent hover:bg-[var(--color-surface-hover)]'
                }`}
                title={proofMode ? 'Proof Mode Active: Claims are cryptographically grounded' : 'Click to enable Proof Mode'}
              >
                <ShieldCheck size={14} className={proofMode ? 'text-emerald-400' : 'text-current'} />
                <span>Proof</span>
              </button>

              {/* Dictation Mic Button */}
              <button
                onClick={toggleDictation}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  isDictating
                    ? 'bg-red-500/20 text-red-400 animate-pulse'
                    : 'text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)]'
                }`}
                title={isDictating ? 'Stop dictation' : 'Dictate with voice'}
                aria-label="Voice dictation"
              >
                <Mic size={19} />
              </button>

              {/* Send / Stop Button */}
              <button
                onClick={handleSubmit}
                disabled={!hasContent && !isGenerating}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs ${
                  isGenerating
                    ? 'bg-[var(--color-on-surface)] text-[var(--color-surface)] hover:opacity-90 active:scale-95'
                    : hasContent
                    ? 'bg-[var(--accent)] text-white hover:brightness-105 active:scale-95 shadow-sm'
                    : 'bg-[var(--color-surface-hover)] text-[var(--color-on-surface-muted)] opacity-50 cursor-not-allowed'
                }`}
                title={isGenerating ? 'Stop generating' : 'Send message'}
                aria-label={isGenerating ? 'Stop generating' : 'Send message'}
              >
                {isGenerating ? (
                  <Square size={13} className="fill-current" />
                ) : (
                  <ArrowUp size={18} strokeWidth={2.5} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer Note */}
        <p className="text-[11px] text-center text-[var(--color-on-surface-muted)] tracking-wide">
          Alizia AI can make mistakes. Verify important factual and mathematical claims with Proof Mode.
        </p>
      </div>
    </div>
  );
};

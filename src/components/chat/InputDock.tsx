'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, ArrowUp, Square, Mic, X, FileText, ShieldCheck } from 'lucide-react';
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

  useEffect(() => {
    if (currentTranscript) {
      setInputVal(currentTranscript);
      adjustTextareaHeight();
    }
  }, [currentTranscript]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 220)}px`;
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
    <div className="w-full max-w-[840px] mx-auto px-4 pb-4 select-none">
      {/* Signature Gemini Capsule Container */}
      <div className="w-full rounded-[28px] bg-[var(--color-surface-container)] transition-all duration-200 p-3 flex flex-col gap-2">
        {/* Attachment Previews */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-2 pt-1 pb-2">
            {attachments.map((att, idx) => (
              <div
                key={att.id}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-surface)] text-xs text-[var(--color-on-surface)]"
              >
                {att.type.startsWith('image/') ? (
                  <img src={att.dataUrl} className="w-4 h-4 rounded-full object-cover" alt={att.name} />
                ) : (
                  <FileText size={13} className="text-[var(--accent)]" />
                )}
                <span className="truncate max-w-[140px] font-medium text-[12px]">{att.name}</span>
                <button
                  onClick={() => removeAttachment(idx)}
                  className="p-0.5 rounded-full hover:bg-[var(--color-surface-hover)] text-[var(--color-on-surface-muted)] cursor-pointer"
                  title="Remove"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={inputVal}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask Alizia"
          className="w-full bg-transparent border-none text-[15px] md:text-[16px] text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-disabled)] focus:outline-none resize-none px-3 pt-1 leading-relaxed custom-scrollbar max-h-48"
        />

        {/* Bottom Actions Row inside the capsule */}
        <div className="flex items-center justify-between px-1 pt-1">
          {/* Left Upload Button */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
              title="Add image or document"
              aria-label="Add file"
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

            {/* Proof Mode Toggle */}
            <button
              type="button"
              onClick={() => setProofMode(!proofMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                proofMode
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)]'
              }`}
              title={proofMode ? 'Proof Mode ON' : 'Proof Mode OFF'}
            >
              <ShieldCheck size={14} className={proofMode ? 'text-emerald-400' : 'text-current'} />
              <span>Proof</span>
            </button>
          </div>

          {/* Right: Mic & Send */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleDictation}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isDictating
                  ? 'bg-red-500/20 text-red-400 animate-pulse'
                  : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)]'
              }`}
              title={isDictating ? 'Stop dictation' : 'Voice input'}
              aria-label="Voice input"
            >
              <Mic size={18} />
            </button>

            <button
              onClick={handleSubmit}
              disabled={!hasContent && !isGenerating}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isGenerating
                  ? 'bg-[var(--color-on-surface)] text-[var(--color-background)] hover:opacity-90 active:scale-95'
                  : hasContent
                  ? 'bg-[var(--color-on-surface)] text-[var(--color-background)] hover:opacity-90 active:scale-95 shadow-xs'
                  : 'text-[var(--color-on-surface-disabled)] opacity-40 cursor-not-allowed'
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

      {/* Gemini Minimal Disclaimer */}
      <p className="text-[12px] text-center text-[var(--color-on-surface-disabled)] mt-2 font-normal">
        Alizia can make mistakes, so double-check it
      </p>
    </div>
  );
};

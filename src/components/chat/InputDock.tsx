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
          dataUrl: event.target?.result as string
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
    <div className="input-dock-container">
      <div className="input-dock-inner">
        <div className="input-dock">
          {/* Attached Previews */}
          {attachments.length > 0 && (
            <div className="attached-previews-container has-files">
              {attachments.map((att, idx) => (
                <div key={att.id} className="preview-chip">
                  {att.type.startsWith('image/') ? (
                    <img src={att.dataUrl} className="preview-thumb" alt={att.name} />
                  ) : (
                    <FileText size={16} className="text-[var(--accent-cyan)]" />
                  )}
                  <span className="truncate max-w-[120px]">{att.name}</span>
                  <button
                    className="preview-remove-btn"
                    onClick={() => removeAttachment(idx)}
                    title="Remove file"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Row */}
          <div className="input-row">
            <div className="dock-left-actions">
              <button
                className="icon-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Add files or image for Vision analysis"
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
            </div>

            <textarea
              ref={textareaRef}
              className="dock-textarea"
              placeholder="Ask Alizia anything..."
              rows={1}
              value={inputVal}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
            />

            <div className="dock-right-actions flex items-center gap-1.5">
              <button
                type="button"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  proofMode
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5 border border-white/5'
                }`}
                onClick={() => setProofMode(!proofMode)}
                title={proofMode ? 'Proof Mode ON: Verifiable claim grounding & sandbox assertions active' : 'Click to enable Proof Mode'}
              >
                <ShieldCheck size={14} className={proofMode ? 'text-emerald-400' : 'text-white/40'} />
                <span className="hidden sm:inline">Proof</span>
              </button>

              <button
                className={`icon-btn mic-btn ${isDictating ? 'listening' : ''}`}
                onClick={toggleDictation}
                title={isDictating ? 'Stop listening' : 'Dictate with voice'}
              >
                <Mic size={20} />
              </button>

              <button
                className={`send-btn ${hasContent || isGenerating ? 'ready' : ''} ${isGenerating ? 'generating' : ''}`}
                onClick={handleSubmit}
                title={isGenerating ? 'Stop generating' : 'Send message'}
              >
                {isGenerating ? (
                  <Square size={14} className="fill-current" />
                ) : (
                  <ArrowUp size={18} />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="dock-disclaimer">
          Alizia can make mistakes. Verify important info.
        </div>
      </div>
    </div>
  );
};

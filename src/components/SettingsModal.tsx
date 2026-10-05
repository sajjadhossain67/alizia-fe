'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sliders, Check } from 'lucide-react';
import { ThemeMode, ReasoningEffort } from '../types';

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, setIsSettingsOpen, settings, updateSettings, showToast, checkBackendStatus } = useApp();
  
  const [backendUrl, setBackendUrl] = useState(settings.backendUrl);
  const [theme, setTheme] = useState<ThemeMode>(settings.theme);
  const [reasoningEffort, setReasoningEffort] = useState<ReasoningEffort>(settings.reasoningEffort);

  if (!isSettingsOpen) return null;

  const handleSave = () => {
    updateSettings({
      backendUrl: backendUrl.trim() || 'http://localhost:8000',
      theme,
      reasoningEffort
    });
    checkBackendStatus();
    showToast('Settings saved successfully');
    setIsSettingsOpen(false);
  };

  return (
    <div className="modal-overlay open fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="modal-box w-full max-w-lg rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-medium)] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="modal-header flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-[var(--accent-purple)]" />
            <span className="modal-title font-semibold text-base text-[var(--text-primary)]">Alizia Settings</span>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="icon-btn p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body p-6 flex flex-col gap-5 overflow-y-auto max-h-[75vh]">
          {/* Backend URL */}
          <div className="setting-row flex flex-col gap-1.5">
            <label className="setting-label text-sm font-medium text-[var(--text-primary)]">
              Alizia AI Backend URL
            </label>
            <span className="setting-desc text-xs text-[var(--text-tertiary)] leading-relaxed">
              Direct connection to the Python FastAPI Orchestrator (e.g., http://localhost:8000).
            </span>
            <input
              type="text"
              className="setting-input mt-1 w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)] transition-colors"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              placeholder="http://localhost:8000"
            />
          </div>

          {/* Theme Selector */}
          <div className="setting-row flex flex-col gap-1.5">
            <label className="setting-label text-sm font-medium text-[var(--text-primary)]">
              Interface Theme Aesthetic
            </label>
            <span className="setting-desc text-xs text-[var(--text-tertiary)] leading-relaxed">
              Tailored visual palette and background aurora effects.
            </span>
            <div className="grid grid-cols-3 gap-2.5 mt-1.5">
              {(['dark', 'light', 'cyber'] as ThemeMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTheme(mode)}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-medium capitalize flex items-center justify-center gap-1.5 transition-all ${
                    theme === mode
                      ? 'border-[var(--accent-purple)] bg-[var(--accent-purple)]/15 text-[var(--text-primary)] shadow-sm'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:border-[var(--border-medium)]'
                  }`}
                >
                  {theme === mode && <Check size={14} className="text-[var(--accent-purple)]" />}
                  <span>{mode === 'dark' ? 'Gemini Dark' : mode === 'light' ? 'Gemini Light' : 'Cyber Aurora'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reasoning Depth */}
          <div className="setting-row flex flex-col gap-1.5">
            <label className="setting-label text-sm font-medium text-[var(--text-primary)]">
              Default Reasoning Depth
            </label>
            <span className="setting-desc text-xs text-[var(--text-tertiary)] leading-relaxed">
              Allocates compute budget for internal chain-of-thought verification.
            </span>
            <div className="grid grid-cols-3 gap-2.5 mt-1.5">
              {(['high', 'medium', 'low'] as ReasoningEffort[]).map((effort) => (
                <button
                  key={effort}
                  type="button"
                  onClick={() => setReasoningEffort(effort)}
                  className={`px-3 py-2 rounded-xl border text-xs font-medium capitalize flex items-center justify-center gap-1.5 transition-all ${
                    reasoningEffort === effort
                      ? 'border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/15 text-[var(--text-primary)] shadow-sm'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:border-[var(--border-medium)]'
                  }`}
                >
                  {reasoningEffort === effort && <Check size={14} className="text-[var(--accent-cyan)]" />}
                  <span>{effort}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/50">
          <button
            type="button"
            onClick={() => setIsSettingsOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs font-semibold hover:opacity-95 shadow-md transition-all"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

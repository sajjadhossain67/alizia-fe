'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ALIZIA_MODELS } from '../services/api';
import {
  Menu,
  Plus,
  ChevronDown,
  Moon,
  Sun,
  ShieldCheck,
  Layers,
  Sparkles,
  Check,
  MessageSquare,
  Bot,
  Database
} from 'lucide-react';
import Link from 'next/link';
import { AliziaSparkle } from './ui/AliziaSparkle';

export const Header: React.FC = () => {
  const {
    settings,
    updateSettings,
    showToast,
    toggleSidebar,
    createConversation,
    activeView,
    setActiveView,
    proofMode,
    setProofMode,
  } = useApp();

  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeModel = ALIZIA_MODELS.find((m) => m.id === settings.activeModel) || ALIZIA_MODELS[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setModelDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleSelectModel = (modelId: string, modelName: string) => {
    updateSettings({ activeModel: modelId });
    setModelDropdownOpen(false);
    showToast(`Switched active model to ${modelName}`);
  };

  const handleToggleTheme = () => {
    const themeSequence = ['dark', 'light', 'amoled', 'sepia', 'high-contrast'] as const;
    const current = settings.theme || 'dark';
    const nextIdx = (themeSequence.indexOf(current as any) + 1) % themeSequence.length;
    const next = themeSequence[nextIdx];
    updateSettings({ theme: next });
    showToast(`Switched theme to ${next.toUpperCase()}`);
  };

  return (
    <header className="w-full h-16 px-4 md:px-6 border-b border-[var(--color-outline)] bg-[var(--color-glass-surface)] backdrop-blur-xl flex items-center justify-between z-30 shrink-0 select-none">
      {/* Left: Menu Drawer Toggle, Brand Sparkle, Model Selector */}
      <div className="flex items-center gap-3">
        {/* Toggle Sidebar Drawer */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)] transition-all cursor-pointer"
          title="Open Conversation History & Settings"
          aria-label="Open Conversation History"
        >
          <Menu size={20} />
        </button>

        {/* Quick New Chat Button */}
        <button
          onClick={() => createConversation()}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--color-surface-container)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-outline)] transition-all cursor-pointer"
          title="New Chat"
        >
          <Plus size={14} />
          <span>New Chat</span>
        </button>

        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2 pl-1">
          <AliziaSparkle size={22} animate />
          <span className="font-bold text-base md:text-lg tracking-tight bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570] bg-clip-text text-transparent">
            Alizia
          </span>
        </div>

        {/* Gemini-Style Floating Model Selector */}
        <div className="relative ml-1" ref={dropdownRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setModelDropdownOpen((prev) => !prev);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-outline)] text-xs font-semibold text-[var(--color-on-surface)] transition-all cursor-pointer shadow-xs"
            aria-haspopup="listbox"
            aria-expanded={modelDropdownOpen}
          >
            <span>{activeModel.name}</span>
            <ChevronDown
              size={13}
              className={`text-[var(--color-on-surface-muted)] transition-transform duration-200 ${
                modelDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {modelDropdownOpen && (
            <div className="absolute top-[calc(100%+6px)] left-0 w-72 rounded-[var(--radius-lg)] p-1.5 bg-[var(--color-surface)] border border-[var(--color-outline)] shadow-[var(--shadow-floating)] z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-1">
              {ALIZIA_MODELS.map((model) => {
                const isSelected = model.id === settings.activeModel;
                return (
                  <button
                    key={model.id}
                    onClick={() => handleSelectModel(model.id, model.name)}
                    className={`flex flex-col gap-0.5 p-2.5 rounded-[var(--radius-md)] text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold'
                        : 'text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold">{model.name}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-[var(--color-surface-container)] text-[var(--color-on-surface-muted)]">
                        {model.context}
                      </span>
                    </div>
                    <span className="text-[11px] text-[var(--color-on-surface-muted)] leading-tight">
                      {model.description}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Center: Mode Switcher Tabs */}
      <div className="hidden lg:flex items-center p-1 rounded-full bg-[var(--color-surface-container)] border border-[var(--color-outline)]">
        <button
          onClick={() => setActiveView('chat')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
            activeView === 'chat'
              ? 'bg-[var(--color-surface)] text-[var(--color-on-surface)] shadow-xs'
              : 'text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)]'
          }`}
        >
          <MessageSquare size={13} />
          <span>Chat</span>
        </button>

        <button
          onClick={() => setActiveView('agents')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
            activeView === 'agents'
              ? 'bg-[var(--color-surface)] text-[var(--color-on-surface)] shadow-xs'
              : 'text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)]'
          }`}
        >
          <Bot size={13} />
          <span>Agents</span>
          <span className="text-[9px] font-bold uppercase px-1 py-0.2 rounded bg-purple-500/20 text-purple-400">
            Auto
          </span>
        </button>

        <button
          onClick={() => setActiveView('rag')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
            activeView === 'rag'
              ? 'bg-[var(--color-surface)] text-[var(--color-on-surface)] shadow-xs'
              : 'text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)]'
          }`}
        >
          <Database size={13} />
          <span>Knowledge & RAG</span>
        </button>
      </div>

      {/* Right Actions: Proof Mode, Theme Switcher, Tokens Link, User Avatar */}
      <div className="flex items-center gap-2">
        {/* Proof Mode Toggle Chip */}
        <button
          onClick={() => {
            const next = !proofMode;
            setProofMode(next);
            showToast(next ? 'Proof Mode Enabled: Formal verification active' : 'Proof Mode Disabled');
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
            proofMode
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-xs shadow-emerald-500/10'
              : 'bg-transparent text-[var(--color-on-surface-muted)] border-[var(--color-outline)] hover:text-[var(--color-on-surface)]'
          }`}
          title="Toggle Proof Mode: Cryptographic verification of all claims"
        >
          <ShieldCheck size={14} className={proofMode ? 'text-emerald-400' : 'text-current'} />
          <span className="hidden sm:inline">Proof Mode</span>
        </button>

        {/* Link to Design System Showcase */}
        <Link
          href="/design-system"
          className="hidden md:flex items-center gap-1 p-2 rounded-full text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)] transition-colors"
          title="Open Design System Component Gallery"
        >
          <Layers size={17} />
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={handleToggleTheme}
          className="p-2 rounded-full text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
          title={`Theme: ${settings.theme}. Click to switch theme`}
          aria-label="Toggle Theme"
        >
          {settings.theme === 'light' ? (
            <Sun size={17} />
          ) : (
            <Moon size={17} />
          )}
        </button>

        {/* User Avatar */}
        <div
          className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4285F4] to-[#9B72CB] text-white font-bold text-xs flex items-center justify-center shadow-xs ring-2 ring-[var(--color-outline)] cursor-pointer select-none"
          title="User Account: Developer (Pro)"
        >
          A
        </div>
      </div>
    </header>
  );
};

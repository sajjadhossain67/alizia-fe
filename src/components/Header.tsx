'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ALIZIA_MODELS } from '../services/api';
import {
  Menu,
  ChevronDown,
  Moon,
  Sun,
  ShieldCheck,
  Check,
} from 'lucide-react';
import Link from 'next/link';

export const Header: React.FC = () => {
  const {
    settings,
    updateSettings,
    showToast,
    toggleSidebar,
    proofMode,
    setProofMode,
  } = useApp();

  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeModel = ALIZIA_MODELS.find((m) => m.id === settings.activeModel) || ALIZIA_MODELS[0];

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
    <header className="w-full h-16 px-4 md:px-6 flex items-center justify-between select-none z-30 shrink-0">
      {/* Left: Hamburger menu + Brand name + Model picker */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] transition-colors cursor-pointer"
          title="Main menu"
          aria-label="Main menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="text-[21px] font-medium tracking-normal text-[var(--color-on-surface)] hover:opacity-90 transition-opacity"
          >
            Alizia
          </Link>

          {/* Clean Gemini Model Dropdown Pill */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setModelDropdownOpen((prev) => !prev);
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-hover)] text-xs font-normal text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-all cursor-pointer"
              aria-haspopup="listbox"
              aria-expanded={modelDropdownOpen}
            >
              <span>{activeModel.name}</span>
              <ChevronDown
                size={14}
                className={`text-[var(--color-on-surface-muted)] transition-transform duration-200 ${
                  modelDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {modelDropdownOpen && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-72 rounded-2xl p-2 bg-[var(--color-surface-container)] border border-[var(--color-outline)] shadow-[var(--shadow-floating)] z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-1">
                {ALIZIA_MODELS.map((model) => {
                  const isSelected = model.id === settings.activeModel;
                  return (
                    <button
                      key={model.id}
                      onClick={() => handleSelectModel(model.id, model.name)}
                      className={`flex flex-col gap-0.5 p-3 rounded-xl text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--color-surface-hover)] text-[var(--color-on-surface)] font-medium'
                          : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface)]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-medium">{model.name}</span>
                        {isSelected && <Check size={14} className="text-[#8ab4f8]" />}
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
      </div>

      {/* Right: Proof Mode toggle + Theme button + User Avatar */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            const next = !proofMode;
            setProofMode(next);
            showToast(next ? 'Proof Mode ON' : 'Proof Mode OFF');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
            proofMode
              ? 'bg-[var(--color-surface-container)] text-[#8ab4f8] hover:bg-[var(--color-surface-hover)]'
              : 'text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)]'
          }`}
          title="Verifiable Proof Mode"
        >
          <ShieldCheck size={15} className={proofMode ? 'text-[#8ab4f8]' : 'text-current'} />
          <span className="hidden sm:inline">Proof Mode</span>
        </button>

        <button
          onClick={handleToggleTheme}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] transition-colors cursor-pointer"
          title={`Theme: ${settings.theme}`}
          aria-label="Toggle theme"
        >
          {settings.theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User Account Avatar */}
        <div
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4285F4] to-[#9B72CB] text-white font-medium text-xs flex items-center justify-center cursor-pointer select-none ml-1"
          title="User Account"
        >
          S
        </div>
      </div>
    </header>
  );
};


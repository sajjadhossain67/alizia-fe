'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ALIZIA_MODELS } from '../services/api';
import { ChevronDown, Moon, Sun, Monitor, Check } from 'lucide-react';
import Image from 'next/image';

export const Header: React.FC = () => {
  const { settings, updateSettings, showToast } = useApp();
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeModel = ALIZIA_MODELS.find(m => m.id === settings.activeModel) || ALIZIA_MODELS[0];

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
    const current = settings.theme || 'dark';
    const next = current === 'dark' ? 'light' : current === 'light' ? 'cyber' : 'dark';
    updateSettings({ theme: next });
    showToast(`Switched theme to ${next.toUpperCase()}`);
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <div className="brand-badge">
          <div className="relative w-7 h-7 shrink-0">
            <Image
              src="/assets/alizia-logo.png"
              alt="Alizia AI Logo"
              width={28}
              height={28}
              className="brand-logo-img object-contain"
              priority
              onError={(e) => {
                // Fallback if image fails to load
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <span className="brand-name">Alizia</span>
        </div>

        {/* Model Switcher (Gemini Style) */}
        <div className={`model-selector-dropdown relative ${modelDropdownOpen ? 'open' : ''}`} ref={dropdownRef}>
          <button
            className="model-selector-btn"
            onClick={(e) => {
              e.stopPropagation();
              setModelDropdownOpen(prev => !prev);
            }}
          >
            <span>{activeModel.name}</span>
            <ChevronDown size={16} className={`transition-transform duration-200 ${modelDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {modelDropdownOpen && (
            <div className="model-dropdown-menu">
              {ALIZIA_MODELS.map((model) => (
                <button
                  key={model.id}
                  className={`model-option ${model.id === settings.activeModel ? 'active' : ''}`}
                  onClick={() => handleSelectModel(model.id, model.name)}
                >
                  <div className="model-option-header">
                    <span className="model-option-name">{model.name}</span>
                    <span className="model-context-tag">{model.context}</span>
                  </div>
                  <div className="model-option-desc">{model.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="header-right">
        <button
          className="header-action-btn"
          onClick={handleToggleTheme}
          title={`Current theme: ${settings.theme}. Click to switch.`}
        >
          {settings.theme === 'dark' ? (
            <Moon size={16} />
          ) : settings.theme === 'light' ? (
            <Sun size={16} />
          ) : (
            <Monitor size={16} />
          )}
          <span className="capitalize">{settings.theme}</span>
        </button>

        <div className="user-avatar-btn" title="User Profile">
          A
        </div>
      </div>
    </header>
  );
};

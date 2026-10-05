'use client';

import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Plus,
  MessageSquare,
  Bot,
  Database,
  Trash2,
  Settings,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

export const Sidebar: React.FC = () => {
  const {
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
    createConversation,
    conversations,
    activeConversationId,
    selectConversation,
    deleteConversation,
    activeView,
    setActiveView,
    backendOnline,
    setIsSettingsOpen,
  } = useApp();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen, setSidebarOpen]);

  if (!sidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-over Drawer */}
      <aside
        className="relative z-10 w-80 max-w-[85vw] h-full bg-[var(--color-surface)] border-r border-[var(--color-outline)] shadow-[var(--shadow-floating)] flex flex-col animate-in slide-in-from-left duration-250"
        role="dialog"
        aria-label="Navigation & History Drawer"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-outline)] bg-[var(--color-surface-container)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4285F4] via-[#9B72CB] to-[#D96570] flex items-center justify-center text-white shadow-xs">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--color-on-surface)] leading-tight">Alizia AI</h2>
              <span className="text-[11px] text-[var(--color-on-surface-muted)]">Frontier Workspace</span>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-full text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[var(--accent)] text-white hover:brightness-105 active:scale-[0.98] font-medium text-xs md:text-sm shadow-sm transition-all cursor-pointer"
            onClick={() => {
              createConversation();
              setSidebarOpen(false);
            }}
          >
            <Plus size={16} />
            <span>New Chat</span>
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="px-3 py-1 flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-[var(--color-on-surface-muted)] uppercase tracking-wider px-2 py-1">
            Workspaces
          </span>
          <button
            className={`flex items-center justify-between w-full px-3 py-2 rounded-[var(--radius-md)] text-xs font-medium transition-colors cursor-pointer ${
              activeView === 'chat'
                ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-hover)]'
            }`}
            onClick={() => {
              setActiveView('chat');
              setSidebarOpen(false);
            }}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare size={16} />
              <span>Alizia Chat</span>
            </div>
            <ChevronRight size={14} className="opacity-50" />
          </button>

          <button
            className={`flex items-center justify-between w-full px-3 py-2 rounded-[var(--radius-md)] text-xs font-medium transition-colors cursor-pointer ${
              activeView === 'agents'
                ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-hover)]'
            }`}
            onClick={() => {
              setActiveView('agents');
              setSidebarOpen(false);
            }}
          >
            <div className="flex items-center gap-2.5">
              <Bot size={16} />
              <span>Autonomous Agent</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-400">
              Auto
            </span>
          </button>

          <button
            className={`flex items-center justify-between w-full px-3 py-2 rounded-[var(--radius-md)] text-xs font-medium transition-colors cursor-pointer ${
              activeView === 'rag'
                ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-hover)]'
            }`}
            onClick={() => {
              setActiveView('rag');
              setSidebarOpen(false);
            }}
          >
            <div className="flex items-center gap-2.5">
              <Database size={16} />
              <span>Knowledge & RAG</span>
            </div>
            <ChevronRight size={14} className="opacity-50" />
          </button>

          <Link
            href="/design-system"
            className="flex items-center justify-between w-full px-3 py-2 rounded-[var(--radius-md)] text-xs font-medium text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex items-center gap-2.5">
              <Layers size={16} />
              <span>Design System</span>
            </div>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400">
              Tokens
            </span>
          </Link>
        </div>

        {/* Recent Conversations */}
        <div className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-[var(--color-on-surface-muted)] uppercase tracking-wider px-2 py-1">
            Recent Conversations
          </span>
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-xs text-[var(--color-on-surface-muted)]">
              No recent conversations
            </div>
          ) : (
            conversations.map((convo) => {
              const isActive = convo.id === activeConversationId && activeView === 'chat';
              return (
                <div
                  key={convo.id}
                  onClick={() => {
                    selectConversation(convo.id);
                    setSidebarOpen(false);
                  }}
                  className={`group flex items-center justify-between w-full px-3 py-2 rounded-[var(--radius-md)] text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[var(--color-surface-hover)] text-[var(--color-on-surface)] font-semibold'
                      : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-surface)]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare size={14} className="shrink-0 opacity-60" />
                    <span className="truncate">{convo.title || 'New conversation'}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(convo.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[var(--color-on-surface-muted)] hover:text-[var(--danger)] rounded transition-opacity cursor-pointer"
                    title="Delete conversation"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--color-outline)] bg-[var(--color-surface-container)] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[var(--color-on-surface-muted)]">
            <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-500 ring-2 ring-emerald-500/20' : 'bg-amber-500 ring-2 ring-amber-500/20'}`} />
            <span>{backendOnline ? 'Online (v1.0)' : 'Simulator Active'}</span>
          </div>

          <button
            onClick={() => {
              setIsSettingsOpen(true);
              setSidebarOpen(false);
            }}
            className="p-1.5 rounded-full text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
            title="Settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </aside>
    </div>
  );
};

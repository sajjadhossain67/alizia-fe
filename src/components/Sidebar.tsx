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
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-over Drawer */}
      <aside
        className="relative z-10 w-72 sm:w-80 h-full bg-[var(--color-surface-container)] shadow-[var(--shadow-floating)] flex flex-col animate-in slide-in-from-left duration-250 select-none"
        role="dialog"
        aria-label="Navigation & History Drawer"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4285F4] via-[#9B72CB] to-[#D96570] flex items-center justify-center text-white shadow-xs">
              <Sparkles size={14} />
            </div>
            <span className="text-[17px] font-medium text-[var(--color-on-surface)]">Alizia</span>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="px-4 py-3">
          <button
            className="w-full flex items-center gap-3 py-2.5 px-4 rounded-full bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-on-surface)] active:scale-[0.98] font-medium text-[14px] shadow-xs transition-all cursor-pointer"
            onClick={() => {
              createConversation();
              setSidebarOpen(false);
            }}
          >
            <Plus size={18} className="text-[#8ab4f8]" />
            <span>New chat</span>
          </button>
        </div>

        {/* Workspaces Navigation */}
        <div className="px-3 py-1 flex flex-col gap-1">
          <button
            className={`flex items-center justify-between w-full px-4 py-2.5 rounded-full text-[13.5px] font-normal transition-colors cursor-pointer ${
              activeView === 'chat'
                ? 'bg-[var(--color-surface-hover)] text-[var(--color-on-surface)] font-medium'
                : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface)]'
            }`}
            onClick={() => {
              setActiveView('chat');
              setSidebarOpen(false);
            }}
          >
            <div className="flex items-center gap-3">
              <MessageSquare size={17} className="opacity-70" />
              <span>Chat</span>
            </div>
          </button>

          <button
            className={`flex items-center justify-between w-full px-4 py-2.5 rounded-full text-[13.5px] font-normal transition-colors cursor-pointer ${
              activeView === 'agents'
                ? 'bg-[var(--color-surface-hover)] text-[var(--color-on-surface)] font-medium'
                : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface)]'
            }`}
            onClick={() => {
              setActiveView('agents');
              setSidebarOpen(false);
            }}
          >
            <div className="flex items-center gap-3">
              <Bot size={17} className="opacity-70" />
              <span>Agents Studio</span>
            </div>
          </button>

          <button
            className={`flex items-center justify-between w-full px-4 py-2.5 rounded-full text-[13.5px] font-normal transition-colors cursor-pointer ${
              activeView === 'rag'
                ? 'bg-[var(--color-surface-hover)] text-[var(--color-on-surface)] font-medium'
                : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface)]'
            }`}
            onClick={() => {
              setActiveView('rag');
              setSidebarOpen(false);
            }}
          >
            <div className="flex items-center gap-3">
              <Database size={17} className="opacity-70" />
              <span>Knowledge Base</span>
            </div>
          </button>

          <Link
            href="/design-system"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-full text-[13.5px] font-normal text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface)] transition-colors cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex items-center gap-3">
              <Layers size={17} className="opacity-70" />
              <span>Design System</span>
            </div>
          </Link>
        </div>

        {/* Recent Conversations */}
        <div className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar flex flex-col gap-1 mt-2">
          <span className="text-[12px] font-medium text-[var(--color-on-surface-muted)] px-4 py-1.5">
            Recent
          </span>
          {conversations.length === 0 ? (
            <div className="px-4 py-3 text-xs text-[var(--color-on-surface-muted)]">
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
                  className={`group flex items-center justify-between w-full px-4 py-2 rounded-full text-[13px] transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[var(--color-surface-hover)] text-[var(--color-on-surface)] font-medium'
                      : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface)] hover:text-[var(--color-on-surface)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <MessageSquare size={14} className="shrink-0 opacity-50" />
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
        <div className="p-3 px-4 border-t border-[var(--color-outline)] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[var(--color-on-surface-muted)]">
            <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span>{backendOnline ? 'Online' : 'Local'}</span>
          </div>

          <button
            onClick={() => {
              setIsSettingsOpen(true);
              setSidebarOpen(false);
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
            title="Settings"
          >
            <Settings size={17} />
          </button>
        </div>
      </aside>
    </div>
  );
};

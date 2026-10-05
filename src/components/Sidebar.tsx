'use client';

import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Plus,
  MessageSquare,
  Bot,
  Database,
  Trash2,
  Settings,
  Layers,
  Menu,
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
    <>
      {/* Soft Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Gemini Slide-over Drawer */}
      <aside
        className="fixed inset-y-0 left-0 z-50 w-72 sm:w-80 h-full bg-[var(--color-surface-container)] shadow-2xl flex flex-col justify-between select-none animate-in slide-in-from-left duration-250 border-r border-[var(--color-outline)]"
        role="navigation"
        aria-label="Main Navigation & History"
      >
        <div className="flex flex-col h-full">
          {/* Top Header: Hamburger + Official Brand Logo */}
          <div className="h-16 px-4 flex items-center gap-3 shrink-0">
            <button
              onClick={toggleSidebar}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
              title="Close menu"
              aria-label="Close menu"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-2.5">
              <img
                src="/assets/alizia-logo.png"
                alt="Alizia AI"
                className="w-6 h-6 object-contain"
              />
              <span className="text-[19px] font-medium tracking-tight text-[var(--color-on-surface)]">
                Alizia
              </span>
            </div>
          </div>

          {/* New Chat Button (Iconic Gemini Pill) */}
          <div className="px-4 py-2 shrink-0">
            <button
              className="w-full flex items-center gap-3 py-3 px-4 rounded-full bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-on-surface)] active:scale-[0.98] font-medium text-[14px] shadow-xs transition-all cursor-pointer border border-[var(--color-outline)]"
              onClick={() => {
                createConversation();
                setSidebarOpen(false);
              }}
            >
              <Plus size={18} className="text-[#8ab4f8]" />
              <span>New chat</span>
            </button>
          </div>

          {/* Workspaces / Navigation Section */}
          <div className="px-3 py-2 flex flex-col gap-0.5 shrink-0">
            <button
              className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-full text-[13.5px] font-normal transition-colors cursor-pointer ${
                activeView === 'chat'
                  ? 'bg-[var(--color-surface-hover)] text-[var(--color-on-surface)] font-medium'
                  : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface)]'
              }`}
              onClick={() => {
                setActiveView('chat');
                setSidebarOpen(false);
              }}
            >
              <MessageSquare size={17} className="opacity-70 text-[#8ab4f8]" />
              <span>Chat</span>
            </button>

            <button
              className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-full text-[13.5px] font-normal transition-colors cursor-pointer ${
                activeView === 'agents'
                  ? 'bg-[var(--color-surface-hover)] text-[var(--color-on-surface)] font-medium'
                  : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface)]'
              }`}
              onClick={() => {
                setActiveView('agents');
                setSidebarOpen(false);
              }}
            >
              <Bot size={17} className="opacity-70 text-[#c084fc]" />
              <span>Agents Studio</span>
            </button>

            <button
              className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-full text-[13.5px] font-normal transition-colors cursor-pointer ${
                activeView === 'rag'
                  ? 'bg-[var(--color-surface-hover)] text-[var(--color-on-surface)] font-medium'
                  : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface)]'
              }`}
              onClick={() => {
                setActiveView('rag');
                setSidebarOpen(false);
              }}
            >
              <Database size={17} className="opacity-70 text-[#38bdf8]" />
              <span>Knowledge Base</span>
            </button>

            <Link
              href="/design-system"
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-full text-[13.5px] font-normal text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface)] transition-colors cursor-pointer"
              onClick={() => setSidebarOpen(false)}
            >
              <Layers size={17} className="opacity-70 text-[#f472b6]" />
              <span>Design System</span>
            </Link>
          </div>

          {/* Recent Conversations */}
          <div className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar flex flex-col gap-0.5 min-h-0">
            <span className="text-[12px] font-medium text-[var(--color-on-surface-muted)] px-4 py-1.5 shrink-0">
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
                    <span className="truncate pr-2">{convo.title || 'New conversation'}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(convo.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[var(--color-on-surface-muted)] hover:text-[var(--danger)] rounded-full transition-opacity cursor-pointer shrink-0"
                      title="Delete conversation"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer: Settings & Status */}
          <div className="p-3 px-4 border-t border-[var(--color-outline)] shrink-0 flex items-center justify-between">
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
              aria-label="Settings"
            >
              <Settings size={17} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};



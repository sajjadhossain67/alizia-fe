'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Menu,
  Plus,
  MessageSquare,
  Bot,
  Database,
  Trash2,
  Settings,
  Sparkles
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    sidebarCollapsed,
    toggleSidebar,
    createConversation,
    conversations,
    activeConversationId,
    selectConversation,
    deleteConversation,
    activeView,
    setActiveView,
    backendOnline,
    setIsSettingsOpen
  } = useApp();

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <button
          className="icon-btn"
          onClick={toggleSidebar}
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="new-chat-container">
        <button
          className="new-chat-btn"
          onClick={() => createConversation()}
          title="New chat"
        >
          <Plus size={18} />
          <span>New chat</span>
        </button>
      </div>

      {/* Mode Switcher Navigation */}
      <nav className="sidebar-modes">
        <button
          className={`mode-tab ${activeView === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveView('chat')}
          title="Alizia Chat"
        >
          <MessageSquare size={18} />
          <span>Alizia Chat</span>
        </button>

        <button
          className={`mode-tab ${activeView === 'agents' ? 'active' : ''}`}
          onClick={() => setActiveView('agents')}
          title="Autonomous Agent Studio"
        >
          <Bot size={18} />
          <span>Autonomous Agent</span>
          <span className="mode-badge">Auto</span>
        </button>

        <button
          className={`mode-tab ${activeView === 'rag' ? 'active' : ''}`}
          onClick={() => setActiveView('rag')}
          title="Knowledge & RAG Lab"
        >
          <Database size={18} />
          <span>Knowledge & RAG</span>
        </button>
      </nav>

      {/* History List */}
      <div className="history-label">Recent Chats</div>
      <div className="sidebar-history">
        {conversations.length === 0 ? (
          <div className="p-3 text-xs text-[var(--text-tertiary)]">No conversations yet</div>
        ) : (
          conversations.map((convo) => {
            const isActive = convo.id === activeConversationId && activeView === 'chat';
            return (
              <div
                key={convo.id}
                className={`history-item ${isActive ? 'active' : ''}`}
                onClick={() => selectConversation(convo.id)}
                title={convo.title}
              >
                <MessageSquare size={16} className="shrink-0 opacity-70" />
                <span className="history-item-title">{convo.title || 'New conversation'}</span>
                <div className="history-item-actions">
                  <button
                    className="history-action-btn delete-btn"
                    title="Delete conversation"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(convo.id);
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div
          className="backend-status-pill cursor-pointer"
          title={backendOnline ? 'Alizia FastAPI Backend Connected' : 'Running on Built-in Intelligent Simulator Engine'}
        >
          <span className={`status-dot ${backendOnline ? 'online' : ''}`} />
          <span>{backendOnline ? 'Connected (v1.0.0)' : 'Simulator Active'}</span>
        </div>

        <button
          className="footer-btn"
          onClick={() => setIsSettingsOpen(true)}
          title="Settings"
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

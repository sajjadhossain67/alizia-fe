'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { ChatView } from '../components/chat/ChatView';
import { AgentStudio } from '../components/agents/AgentStudio';
import { RagLab } from '../components/rag/RagLab';
import { SettingsModal } from '../components/SettingsModal';
import { ToastContainer } from '../components/ToastContainer';

export default function Home() {
  const { activeView } = useApp();

  return (
    <div className="w-screen h-screen flex bg-[var(--color-background)] text-[var(--color-on-surface)] overflow-hidden" id="app-container">
      {/* Google Gemini Collapsible Sidebar Rail / Panel */}
      <Sidebar />

      {/* Main Canvas Area - Fluid Edge-to-Edge */}
      <div className="flex-1 h-full min-w-0 flex flex-col overflow-hidden relative">
        <Header />

        <main className="flex-1 w-full h-[calc(100vh-64px)] overflow-hidden flex flex-col relative">
          {activeView === 'chat' && <ChatView />}
          {activeView === 'agents' && <AgentStudio />}
          {activeView === 'rag' && <RagLab />}
        </main>
      </div>

      {/* Modals & Overlays */}
      <SettingsModal />
      <ToastContainer />
    </div>
  );
}


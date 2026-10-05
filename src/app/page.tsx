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
    <div className="w-full h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-on-surface)] overflow-hidden relative" id="app-container">
      {/* On-Demand Slide-over History & Settings Drawer (0px space when closed) */}
      <Sidebar />

      {/* Edge-to-Edge Header */}
      <Header />

      {/* Main Content Area - 100% Full Width Edge-to-Edge */}
      <main className="flex-1 w-full h-[calc(100vh-64px)] overflow-hidden flex flex-col relative">
        {activeView === 'chat' && <ChatView />}
        {activeView === 'agents' && <AgentStudio />}
        {activeView === 'rag' && <RagLab />}
      </main>

      {/* Modals & Overlays */}
      <SettingsModal />
      <ToastContainer />
    </div>
  );
}

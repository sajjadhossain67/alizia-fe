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
    <div className="app-container" id="app-container">
      {/* Google Gemini Style Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="main-wrapper">
        <Header />

        {/* Dynamic Views */}
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

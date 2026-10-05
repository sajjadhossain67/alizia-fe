'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  Attachment,
  Conversation,
  Message,
  Settings,
  ThemeMode,
  ViewMode,
  ToastItem,
  ReasoningEffort
} from '../types';
import { apiClient } from '../services/api';
import { speechService } from '../services/speech';

const STORAGE_KEYS = {
  CONVERSATIONS: 'alizia_conversations_v1',
  ACTIVE_CONVO_ID: 'alizia_active_convo_id',
  SETTINGS: 'alizia_settings_v1',
};

const DEFAULT_SETTINGS: Settings = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
  activeModel: 'alizia-nova',
  reasoningEffort: 'high',
  theme: 'dark',
  stream: true,
  webSearchEnabled: true,
  autoTTS: false,
};

interface AppContextType {
  conversations: Conversation[];
  activeConversationId: string | null;
  activeConversation: Conversation | null;
  createConversation: () => Conversation;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  updateConversationTitle: (id: string, title: string) => void;
  
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
  
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  
  attachments: Attachment[];
  addAttachment: (att: Attachment) => void;
  removeAttachment: (index: number) => void;
  clearAttachments: () => void;
  
  isGenerating: boolean;
  backendOnline: boolean | null;
  checkBackendStatus: () => Promise<void>;
  
  sendMessage: (promptText?: string) => Promise<void>;
  stopGeneration: () => void;
  
  toasts: ToastItem[];
  showToast: (message: string) => void;
  
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;

  isDictating: boolean;
  toggleDictation: () => void;
  currentTranscript: string;

  proofMode: boolean;
  setProofMode: (val: boolean) => void;
  activeProof: any | null;
  setActiveProof: (proof: any | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ViewMode>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDictating, setIsDictating] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [proofMode, setProofMode] = useState(true);
  const [activeProof, setActiveProof] = useState<any | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      // 1. Settings
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        document.documentElement.setAttribute('data-theme', parsed.theme || 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
      }

      // 2. Conversations
      const savedConvos = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      let parsedConvos: Conversation[] = [];
      if (savedConvos) {
        parsedConvos = JSON.parse(savedConvos);
      }

      const savedActiveId = localStorage.getItem(STORAGE_KEYS.ACTIVE_CONVO_ID);

      if (parsedConvos.length > 0) {
        setConversations(parsedConvos);
        const validActive = parsedConvos.some(c => c.id === savedActiveId);
        const activeId = validActive ? (savedActiveId as string) : parsedConvos[0].id;
        setActiveConversationId(activeId);
        localStorage.setItem(STORAGE_KEYS.ACTIVE_CONVO_ID, activeId);
      } else {
        // Create initial conversation
        const initialId = `convo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const initialConvo: Conversation = {
          id: initialId,
          title: 'New conversation',
          createdAt: Date.now(),
          model: 'alizia-nova',
          messages: []
        };
        setConversations([initialConvo]);
        setActiveConversationId(initialId);
        localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify([initialConvo]));
        localStorage.setItem(STORAGE_KEYS.ACTIVE_CONVO_ID, initialId);
      }
    } catch (e) {
      console.error('Error loading state from localStorage:', e);
    }
  }, []);

  // Sync settings baseUrl to API client
  useEffect(() => {
    apiClient.setBaseUrl(settings.backendUrl);
  }, [settings.backendUrl]);

  // Initial and periodic backend health check
  const checkBackendStatus = useCallback(async () => {
    const res = await apiClient.checkHealth();
    setBackendOnline(res.online);
  }, []);

  useEffect(() => {
    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 15000);
    return () => clearInterval(interval);
  }, [checkBackendStatus]);

  // Speech dictation callbacks
  useEffect(() => {
    speechService.setCallbacks(
      (transcript) => setCurrentTranscript(transcript),
      (listening) => setIsDictating(listening),
      () => {}
    );
  }, []);

  const showToast = useCallback((message: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2800);
  }, []);

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings(prev => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(next));
        if (updates.theme) {
          document.documentElement.setAttribute('data-theme', updates.theme);
        }
      } catch (err) {
        console.error('Failed to save settings:', err);
      }
      return next;
    });
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const toggleDictation = useCallback(() => {
    const ok = speechService.toggleListening();
    if (!ok) {
      showToast('Speech Recognition not supported in this browser.');
    }
  }, [showToast]);

  const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

  const createConversation = useCallback((): Conversation => {
    speechService.stopSpeaking();
    const id = `convo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newConvo: Conversation = {
      id,
      title: 'New conversation',
      createdAt: Date.now(),
      model: settings.activeModel,
      messages: []
    };

    setConversations(prev => {
      const updated = [newConvo, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setActiveConversationId(id);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_CONVO_ID, id);
    setActiveView('chat');
    return newConvo;
  }, [settings.activeModel]);

  const selectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_CONVO_ID, id);
    setActiveView('chat');
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => {
      const updated = prev.filter(c => c.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(updated));
      } catch {}

      if (id === activeConversationId) {
        if (updated.length > 0) {
          setActiveConversationId(updated[0].id);
          localStorage.setItem(STORAGE_KEYS.ACTIVE_CONVO_ID, updated[0].id);
        } else {
          // create a fresh conversation
          const freshId = `convo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          const fresh: Conversation = {
            id: freshId,
            title: 'New conversation',
            createdAt: Date.now(),
            model: settings.activeModel,
            messages: []
          };
          setActiveConversationId(freshId);
          localStorage.setItem(STORAGE_KEYS.ACTIVE_CONVO_ID, freshId);
          localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify([fresh]));
          return [fresh];
        }
      }
      return updated;
    });
  }, [activeConversationId, settings.activeModel]);

  const updateConversationTitle = useCallback((id: string, title: string) => {
    setConversations(prev => {
      const updated = prev.map(c => (c.id === id ? { ...c, title } : c));
      try {
        localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const addAttachment = useCallback((att: Attachment) => {
    setAttachments(prev => [...prev, att]);
  }, []);

  const removeAttachment = useCallback((index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearAttachments = useCallback(() => {
    setAttachments([]);
  }, []);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
    showToast('Generation cancelled.');
  }, [showToast]);

  const sendMessage = useCallback(async (promptText?: string) => {
    if (isGenerating) return;

    const currentConvo = conversations.find(c => c.id === activeConversationId);
    if (!currentConvo) return;

    const text = (promptText || '').trim();
    const currentAttachments = [...attachments];

    if (!text && currentAttachments.length === 0) return;

    clearAttachments();

    // 1. Add User Message
    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      attachments: currentAttachments,
      createdAt: Date.now()
    };

    // 2. Add Assistant Message Placeholder
    const assistantMsgId = `ast_${Date.now()}`;
    const assistantMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      model: settings.activeModel,
      content: '',
      thinking: '',
      proof: null,
      isLive: true,
      createdAt: Date.now()
    };

    const updatedMessages = [...currentConvo.messages, userMsg, assistantMsg];
    let newTitle = currentConvo.title;
    if (currentConvo.messages.length === 0 && text) {
      newTitle = text.slice(0, 36) + (text.length > 36 ? '...' : '');
    }

    setConversations(prev => {
      const next = prev.map(c => 
        c.id === currentConvo.id 
          ? { ...c, title: newTitle, messages: updatedMessages }
          : c
      );
      try {
        localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(next));
      } catch {}
      return next;
    });

    setIsGenerating(true);
    abortControllerRef.current = new AbortController();

    try {
      await apiClient.streamResponse(
        {
          messages: [...currentConvo.messages, userMsg],
          model: settings.activeModel,
          reasoningEffort: settings.reasoningEffort,
          attachments: currentAttachments,
          proof: proofMode
        },
        {
          signal: abortControllerRef.current.signal,
          onThinking: (thoughtChunk) => {
            setConversations(prev => {
              const next = prev.map(c => {
                if (c.id !== currentConvo.id) return c;
                const msgs = c.messages.map(m => 
                  m.id === assistantMsgId ? { ...m, thinking: thoughtChunk } : m
                );
                return { ...c, messages: msgs };
              });
              return next;
            });
          },
          onDelta: (deltaContent) => {
            setConversations(prev => {
              const next = prev.map(c => {
                if (c.id !== currentConvo.id) return c;
                const msgs = c.messages.map(m => 
                  m.id === assistantMsgId ? { ...m, content: deltaContent } : m
                );
                return { ...c, messages: msgs };
              });
              return next;
            });
          },
          onComplete: (result) => {
            setConversations(prev => {
              const next = prev.map(c => {
                if (c.id !== currentConvo.id) return c;
                const msgs = c.messages.map(m => 
                  m.id === assistantMsgId 
                    ? { ...m, content: result.content, thinking: result.thinking, proof: result.proof, isLive: false }
                    : m
                );
                return { ...c, messages: msgs };
              });
              try {
                localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(next));
              } catch {}
              return next;
            });
            setIsGenerating(false);
          },
          onError: (err) => {
            console.error('Stream error:', err);
            setConversations(prev => {
              const next = prev.map(c => {
                if (c.id !== currentConvo.id) return c;
                const msgs = c.messages.map(m => 
                  m.id === assistantMsgId 
                    ? { ...m, content: `Error: ${err.message}`, isLive: false }
                    : m
                );
                return { ...c, messages: msgs };
              });
              return next;
            });
            setIsGenerating(false);
          }
        }
      );
    } catch (err: any) {
      console.error('Generation exception:', err);
      setIsGenerating(false);
    }
  }, [isGenerating, conversations, activeConversationId, attachments, clearAttachments, settings.activeModel, settings.reasoningEffort]);

  return (
    <AppContext.Provider
      value={{
        conversations,
        activeConversationId,
        activeConversation,
        createConversation,
        selectConversation,
        deleteConversation,
        updateConversationTitle,
        activeView,
        setActiveView,
        sidebarOpen,
        sidebarCollapsed: !sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        settings,
        updateSettings,
        attachments,
        addAttachment,
        removeAttachment,
        clearAttachments,
        isGenerating,
        backendOnline,
        checkBackendStatus,
        sendMessage,
        stopGeneration,
        toasts,
        showToast,
        isSettingsOpen,
        setIsSettingsOpen,
        isDictating,
        toggleDictation,
        currentTranscript,
        proofMode,
        setProofMode,
        activeProof,
        setActiveProof,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

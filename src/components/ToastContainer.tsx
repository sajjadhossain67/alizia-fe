'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container fixed bottom-6 right-6 flex flex-col gap-2 z-50 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="toast pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-medium)] text-[var(--text-primary)] shadow-lg backdrop-blur-md animate-messageFadeIn text-sm"
        >
          <Info size={16} className="text-[var(--accent-cyan)] shrink-0" />
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

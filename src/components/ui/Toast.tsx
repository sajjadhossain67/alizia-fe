import React, { useEffect, useState } from 'react';
import { cn } from './utils';

export interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  duration?: number;
  onDismiss: (id: string) => void;
  undoAction?: () => void;
  undoLabel?: string;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = 'info',
  duration = 4000,
  onDismiss,
  undoAction,
  undoLabel = 'Undo',
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (elapsed >= duration) {
        clearInterval(interval);
        onDismiss(id);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [id, duration, onDismiss]);

  const typeIcons = {
    success: (
      <svg className="w-4 h-4 text-[var(--success)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    warning: (
      <svg className="w-4 h-4 text-[var(--warning)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    error: (
      <svg className="w-4 h-4 text-[var(--danger)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    info: (
      <svg className="w-4 h-4 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="relative flex items-center justify-between gap-3 px-4 py-3 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-outline)] shadow-[var(--shadow-floating)] text-xs md:text-sm text-[var(--color-on-surface)] min-w-72 max-w-md overflow-hidden animate-in slide-in-from-bottom duration-200"
    >
      <div className="flex items-center gap-2.5 truncate">
        <span className="shrink-0">{typeIcons[type]}</span>
        <span className="truncate">{message}</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {undoAction && (
          <button
            type="button"
            onClick={() => {
              undoAction();
              onDismiss(id);
            }}
            className="font-semibold text-[var(--accent)] hover:underline cursor-pointer text-xs"
          >
            {undoLabel}
          </button>
        )}
        <button
          type="button"
          onClick={() => onDismiss(id)}
          aria-label="Dismiss notification"
          className="p-1 rounded-full text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
        >
          ×
        </button>
      </div>

      {/* Progress timer bar */}
      <div
        className="absolute bottom-0 left-0 h-0.5 bg-[var(--accent)]/50 transition-all duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

import React from 'react';
import { cn } from './utils';

export interface ErrorStateProps {
  title?: string;
  message: string;
  code?: string;
  onRetry?: () => void;
  onReport?: () => void;
  fullPanel?: boolean;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  code,
  onRetry,
  onReport,
  fullPanel = false,
  className,
}) => {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-[var(--radius-lg)] border border-[var(--danger)]/30 bg-[var(--danger-subtle)] text-[var(--color-on-surface)] p-4 flex flex-col gap-3',
        fullPanel && 'max-w-md mx-auto my-auto text-center items-center p-8',
        className
      )}
    >
      <div className={cn('flex items-center gap-3', fullPanel && 'flex-col')}>
        <div className="w-10 h-10 rounded-full bg-[var(--danger)]/20 text-[var(--danger)] flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div className="flex flex-col gap-0.5">
          <h4 className="text-sm font-semibold text-[var(--color-on-surface)]">{title}</h4>
          <p className="text-xs text-[var(--color-on-surface-variant)]">{message}</p>
          {code && (
            <span className="font-mono text-[10px] text-[var(--color-on-surface-muted)] mt-1">
              Error code: {code}
            </span>
          )}
        </div>
      </div>

      {(onRetry || onReport) && (
        <div className={cn('flex items-center gap-2.5 pt-1', fullPanel && 'justify-center')}>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[var(--danger)] text-white hover:brightness-105 active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              Retry request
            </button>
          )}
          {onReport && (
            <button
              type="button"
              onClick={onReport}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-hover)] transition-all cursor-pointer"
            >
              Report issue
            </button>
          )}
        </div>
      )}
    </div>
  );
};

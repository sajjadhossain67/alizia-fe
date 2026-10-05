import React, { forwardRef } from 'react';
import { cn } from './utils';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'assist' | 'filter' | 'input' | 'suggestion';
  selected?: boolean;
  icon?: React.ReactNode;
  onDismiss?: (e: React.MouseEvent) => void;
  dismissLabel?: string;
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      children,
      className,
      variant = 'suggestion',
      selected = false,
      icon,
      onDismiss,
      dismissLabel = 'Dismiss chip',
      disabled = false,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        aria-pressed={variant === 'filter' ? selected : undefined}
        className={cn(
          'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer select-none border',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
          'disabled:opacity-50 disabled:pointer-events-none',
          selected
            ? 'bg-[var(--accent-subtle)] text-[var(--accent)] border-[var(--accent)]'
            : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] border-[var(--color-outline)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-on-surface)]',
          className
        )}
        {...props}
      >
        {icon && <span className="inline-flex shrink-0 text-current">{icon}</span>}
        <span className="truncate">{children}</span>
        {onDismiss && (
          <span
            role="button"
            tabIndex={0}
            aria-label={dismissLabel}
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(e);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                onDismiss(e as any);
              }
            }}
            className="inline-flex items-center justify-center -mr-1 ml-1 w-4 h-4 rounded-full hover:bg-[var(--color-outline-strong)] text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] transition-colors cursor-pointer"
          >
            ×
          </span>
        )}
      </button>
    );
  }
);

Chip.displayName = 'Chip';

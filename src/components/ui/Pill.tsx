import React from 'react';
import { cn } from './utils';

export interface PillProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  interactive?: boolean;
}

export const Pill: React.FC<PillProps> = ({
  children,
  className,
  variant = 'neutral',
  size = 'md',
  dot = false,
  interactive = false,
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1.5',
    md: 'text-xs px-3 py-1 gap-2',
    lg: 'text-sm px-4 py-1.5 gap-2.5',
  };

  const variantClasses = {
    neutral:
      'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] border border-[var(--color-outline)]',
    accent:
      'bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/30 font-semibold',
    success:
      'bg-[var(--success-subtle)] text-[var(--success)] border border-[var(--success)]/30 font-medium',
    warning:
      'bg-[var(--warning-subtle)] text-[var(--warning)] border border-[var(--warning)]/30 font-medium',
    danger:
      'bg-[var(--danger-subtle)] text-[var(--danger)] border border-[var(--danger)]/30 font-medium',
    gradient:
      'bg-gradient-to-r from-[#4285F4]/15 via-[#9B72CB]/15 to-[#D96570]/15 text-[var(--color-on-surface)] border border-[#9B72CB]/30 font-medium',
  };

  const dotColorClasses = {
    neutral: 'bg-[var(--color-on-surface-muted)]',
    accent: 'bg-[var(--accent)]',
    success: 'bg-[var(--success)]',
    warning: 'bg-[var(--warning)]',
    danger: 'bg-[var(--danger)]',
    gradient: 'bg-[#9B72CB]',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full select-none transition-all duration-200',
        sizeClasses[size],
        variantClasses[variant],
        interactive &&
          'cursor-pointer hover:brightness-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
        className
      )}
      tabIndex={interactive ? 0 : undefined}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            dotColorClasses[variant]
          )}
        />
      )}
      {children}
    </div>
  );
};

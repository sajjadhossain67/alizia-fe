import React from 'react';
import { cn } from './utils';

export interface BannerProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'info' | 'warning' | 'danger' | 'success' | 'brand';
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  className?: string;
}

export const Banner: React.FC<BannerProps> = ({
  title,
  children,
  variant = 'info',
  icon,
  action,
  onDismiss,
  className,
}) => {
  const variantClasses = {
    info: 'bg-[var(--accent-subtle)] text-[var(--color-on-surface)] border-[var(--accent)]/30',
    warning: 'bg-[var(--warning-subtle)] text-[var(--color-on-surface)] border-[var(--warning)]/30',
    danger: 'bg-[var(--danger-subtle)] text-[var(--color-on-surface)] border-[var(--danger)]/30',
    success: 'bg-[var(--success-subtle)] text-[var(--color-on-surface)] border-[var(--success)]/30',
    brand:
      'bg-gradient-to-r from-[#4285F4]/15 via-[#9B72CB]/15 to-[#D96570]/15 text-[var(--color-on-surface)] border-[#9B72CB]/40',
  };

  return (
    <div
      role="alert"
      className={cn(
        'w-full px-4 py-3 rounded-[var(--radius-lg)] border flex items-center justify-between gap-4 text-xs md:text-sm transition-all duration-200 select-none',
        variantClasses[variant],
        className
      )}
    >
      <div className="flex items-center gap-3 truncate">
        {icon && <span className="shrink-0 text-current">{icon}</span>}
        <div className="flex flex-col gap-0.5 truncate">
          {title && <span className="font-semibold text-current truncate">{title}</span>}
          <div className="text-[var(--color-on-surface-variant)] truncate">{children}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 hover:bg-white/30 text-current transition-colors cursor-pointer"
          >
            {action.label}
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss banner"
            className="p-1 rounded-full text-current/70 hover:text-current hover:bg-black/10 transition-colors cursor-pointer"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

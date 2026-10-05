import React from 'react';
import { cn } from './utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'gradient' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  className,
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.2',
    md: 'text-xs px-2 py-0.5',
  };

  const variantClasses = {
    primary: 'bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/30 font-semibold',
    secondary: 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] border border-[var(--color-outline)] font-medium',
    success: 'bg-[var(--success-subtle)] text-[var(--success)] border border-[var(--success)]/30 font-semibold',
    warning: 'bg-[var(--warning-subtle)] text-[var(--warning)] border border-[var(--warning)]/30 font-semibold',
    danger: 'bg-[var(--danger-subtle)] text-[var(--danger)] border border-[var(--danger)]/30 font-semibold',
    gradient: 'bg-gradient-to-r from-[#4285F4]/20 via-[#9B72CB]/20 to-[#D96570]/20 text-[var(--color-on-surface)] border border-[#9B72CB]/40 font-semibold',
    outline: 'border border-[var(--color-outline-strong)] text-[var(--color-on-surface-muted)] font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md select-none tracking-wide uppercase',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

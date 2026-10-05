import React, { forwardRef } from 'react';
import { cn } from './utils';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'tonal' | 'outlined' | 'text' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  label: string; // Mandatory for accessibility (WCAG AA/AAA)
  loading?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      children,
      className,
      variant = 'text',
      size = 'md',
      label,
      loading = false,
      disabled = false,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer shrink-0';

    const sizeClasses = {
      xs: 'w-7 h-7 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
    };

    const variantClasses = {
      filled:
        'bg-[var(--accent)] text-white hover:brightness-105 shadow-sm active:brightness-95',
      tonal:
        'bg-[var(--color-surface-container)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-outline)]',
      outlined:
        'border border-[var(--color-outline-strong)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)]',
      text:
        'bg-transparent text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-on-surface)]',
      gradient:
        'bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570] text-white shadow-md hover:opacity-95',
    };

    return (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        title={label}
        disabled={disabled || loading}
        aria-busy={loading}
        className={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          children
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

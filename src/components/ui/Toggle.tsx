import React, { forwardRef } from 'react';
import { cn } from './utils';

export interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      pressed,
      onPressedChange,
      children,
      className,
      size = 'md',
      disabled = false,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'h-8 px-2.5 text-xs gap-1.5',
      md: 'h-10 px-3.5 text-sm gap-2',
      lg: 'h-12 px-4.5 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        type={type}
        role="button"
        aria-pressed={pressed}
        disabled={disabled}
        onClick={() => onPressedChange(!pressed)}
        className={cn(
          'inline-flex items-center justify-center rounded-[var(--radius-md)] font-medium transition-all duration-200 select-none cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
          pressed
            ? 'bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/40 shadow-xs'
            : 'bg-transparent text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-on-surface)] border border-transparent',
          disabled && 'opacity-50 pointer-events-none cursor-not-allowed',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Toggle.displayName = 'Toggle';

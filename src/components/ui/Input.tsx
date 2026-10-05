import React, { forwardRef, useState } from 'react';
import { cn } from './utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  pill?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      prefixIcon,
      suffixIcon,
      clearable = false,
      onClear,
      pill = false,
      className,
      value,
      onChange,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `input_${label.toLowerCase().replace(/\s+/g, '_')}` : undefined);
    const hasValue = value !== undefined && value !== '';

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-[var(--color-on-surface-variant)] px-1 select-none"
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            'relative flex items-center w-full transition-all duration-200 border',
            pill ? 'rounded-full px-4' : 'rounded-[var(--radius-md)] px-3.5',
            'bg-[var(--color-surface-container)] text-[var(--color-on-surface)]',
            error
              ? 'border-[var(--danger)] focus-within:ring-2 focus-within:ring-[var(--danger)]'
              : 'border-[var(--color-outline)] focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent)]/30',
            disabled && 'opacity-50 pointer-events-none'
          )}
        >
          {prefixIcon && (
            <span className="shrink-0 text-[var(--color-on-surface-muted)] mr-2.5">
              {prefixIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            value={value}
            onChange={onChange}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            className={cn(
              'w-full py-2.5 bg-transparent text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-muted)] focus:outline-none disabled:cursor-not-allowed',
              className
            )}
            {...props}
          />
          {clearable && hasValue && (
            <button
              type="button"
              tabIndex={-1}
              onClick={onClear}
              aria-label="Clear input"
              className="shrink-0 text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] ml-1 p-0.5 rounded-full hover:bg-[var(--color-surface-hover)] cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
          {suffixIcon && (
            <span className="shrink-0 text-[var(--color-on-surface-muted)] ml-2">
              {suffixIcon}
            </span>
          )}
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="text-xs text-[var(--danger)] px-1 font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="text-xs text-[var(--color-on-surface-muted)] px-1">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

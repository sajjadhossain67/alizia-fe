import React, { useState, useRef, useEffect } from 'react';
import { cn } from './utils';

export interface SelectOption<T = string> {
  value: T;
  label: string;
  description?: string;
  badge?: string;
  disabled?: boolean;
}

export interface SelectProps<T = string> {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Select<T extends string = string>({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select option',
  className,
  disabled = false,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const currentIndex = options.findIndex((o) => o.value === value);
      const next = options[currentIndex + 1];
      if (next && !next.disabled) onChange(next.value);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const currentIndex = options.findIndex((o) => o.value === value);
      const prev = options[currentIndex - 1];
      if (prev && !prev.disabled) onChange(prev.value);
    }
  };

  return (
    <div ref={containerRef} className={cn('relative w-full flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-xs font-medium text-[var(--color-on-surface-variant)] px-1 select-none">
          {label}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          'flex items-center justify-between w-full px-3.5 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200 border cursor-pointer',
          'bg-[var(--color-surface-container)] text-[var(--color-on-surface)] border-[var(--color-outline)]',
          'hover:bg-[var(--color-surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
          isOpen && 'border-[var(--accent)] ring-2 ring-[var(--accent)]/30',
          disabled && 'opacity-50 pointer-events-none cursor-not-allowed'
        )}
      >
        <div className="flex items-center gap-2 truncate">
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
          {selectedOption?.badge && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[var(--accent-subtle)] text-[var(--accent)]">
              {selectedOption.badge}
            </span>
          )}
        </div>
        <svg
          className={cn(
            'w-4 h-4 text-[var(--color-on-surface-muted)] transition-transform duration-200 shrink-0',
            isOpen && 'rotate-180'
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 top-[calc(100%+6px)] left-0 w-full max-h-60 overflow-y-auto rounded-[var(--radius-lg)] p-1.5 bg-[var(--color-surface)] border border-[var(--color-outline)] shadow-[var(--shadow-floating)] animate-in fade-in zoom-in-95 duration-150 custom-scrollbar"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  if (opt.disabled) return;
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-[var(--radius-md)] text-xs md:text-sm cursor-pointer select-none transition-colors duration-150',
                  isSelected
                    ? 'bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold'
                    : 'text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)]',
                  opt.disabled && 'opacity-40 cursor-not-allowed'
                )}
              >
                <div className="flex flex-col gap-0.5 truncate">
                  <span className="truncate">{opt.label}</span>
                  {opt.description && (
                    <span className="text-[11px] text-[var(--color-on-surface-muted)] truncate">
                      {opt.description}
                    </span>
                  )}
                </div>
                {isSelected && (
                  <svg className="w-4 h-4 text-[var(--accent)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

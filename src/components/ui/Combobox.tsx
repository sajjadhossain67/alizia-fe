import React, { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from './utils';

export interface ComboboxItem {
  value: string;
  label: string;
  category?: string;
  description?: string;
}

export interface ComboboxProps {
  items: ComboboxItem[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  label?: string;
  className?: string;
}

export const Combobox: React.FC<ComboboxProps> = ({
  items,
  value,
  onChange,
  placeholder = 'Select item...',
  searchPlaceholder = 'Type to filter...',
  emptyText = 'No results found',
  label,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedItem = items.find((i) => i.value === value);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const lower = search.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(lower) ||
        (item.description && item.description.toLowerCase().includes(lower)) ||
        (item.category && item.category.toLowerCase().includes(lower))
    );
  }, [items, search]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn('relative w-full flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-xs font-medium text-[var(--color-on-surface-variant)] px-1 select-none">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className={cn(
          'flex items-center justify-between w-full px-3.5 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200 border cursor-pointer',
          'bg-[var(--color-surface-container)] text-[var(--color-on-surface)] border-[var(--color-outline)]',
          'hover:bg-[var(--color-surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]'
        )}
      >
        <span className="truncate">{selectedItem ? selectedItem.label : placeholder}</span>
        <svg
          className={cn('w-4 h-4 text-[var(--color-on-surface-muted)] transition-transform duration-200 shrink-0', isOpen && 'rotate-180')}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 top-[calc(100%+6px)] left-0 w-full rounded-[var(--radius-lg)] p-2 bg-[var(--color-surface)] border border-[var(--color-outline)] shadow-[var(--shadow-floating)] animate-in fade-in zoom-in-95 duration-150">
          <div className="relative mb-2">
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full px-3 py-1.5 rounded-[var(--radius-md)] text-xs bg-[var(--color-surface-container)] text-[var(--color-on-surface)] border border-[var(--color-outline)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="max-h-52 overflow-y-auto custom-scrollbar flex flex-col gap-1">
            {filteredItems.length === 0 ? (
              <div className="py-4 text-center text-xs text-[var(--color-on-surface-muted)]">
                {emptyText}
              </div>
            ) : (
              filteredItems.map((item) => {
                const isSelected = item.value === value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      onChange(item.value);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={cn(
                      'flex items-center justify-between w-full text-left px-3 py-2 rounded-[var(--radius-md)] text-xs transition-colors duration-150 cursor-pointer',
                      isSelected
                        ? 'bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold'
                        : 'text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)]'
                    )}
                  >
                    <div className="flex flex-col truncate">
                      <span className="truncate">{item.label}</span>
                      {item.description && (
                        <span className="text-[11px] text-[var(--color-on-surface-muted)] truncate">
                          {item.description}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <svg className="w-4 h-4 text-[var(--accent)] shrink-0 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

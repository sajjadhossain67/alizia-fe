import React, { useState, useEffect, useRef } from 'react';
import { cn } from './utils';
import { Kbd } from './Kbd';

export interface CommandItem {
  id: string;
  label: string;
  category: string;
  icon?: React.ReactNode;
  shortcut?: string;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  items,
  placeholder = 'Type a command or search...',
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredItems = items.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  // Group by category
  const categories = Array.from(new Set(filteredItems.map((i) => i.category)));

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].onSelect();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-outline)] shadow-[var(--shadow-floating)] overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        {/* Search header */}
        <div className="flex items-center px-4 py-3.5 border-b border-[var(--color-outline)] gap-3 bg-[var(--color-surface-container)]">
          <svg className="w-5 h-5 text-[var(--color-on-surface-muted)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm md:text-base text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-muted)] focus:outline-none"
          />
          <Kbd>ESC</Kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2 custom-scrollbar flex flex-col gap-3">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-sm text-[var(--color-on-surface-muted)]">
              No matching commands or actions
            </div>
          ) : (
            categories.map((category) => {
              const catItems = filteredItems.filter((i) => i.category === category);
              return (
                <div key={category} className="flex flex-col gap-1">
                  <div className="text-[11px] font-semibold text-[var(--color-on-surface-muted)] uppercase tracking-wider px-3 py-1">
                    {category}
                  </div>
                  {catItems.map((item) => {
                    const itemGlobalIndex = filteredItems.findIndex((i) => i.id === item.id);
                    const isSelected = itemGlobalIndex === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          item.onSelect();
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(itemGlobalIndex)}
                        className={cn(
                          'flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-md)] text-xs md:text-sm font-medium transition-colors duration-150 cursor-pointer text-left',
                          isSelected
                            ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                            : 'text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)]'
                        )}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          {item.icon && <span className="shrink-0 text-current">{item.icon}</span>}
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.shortcut && <Kbd>{item.shortcut}</Kbd>}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

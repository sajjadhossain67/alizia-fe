import React, { useState, useRef, useEffect } from 'react';
import { cn } from './utils';

export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  destructive?: boolean;
  disabled?: boolean;
  divider?: boolean;
  onClick?: () => void;
}

export interface MenuProps {
  trigger: React.ReactNode;
  items: MenuItem[];
  align?: 'start' | 'end';
  side?: 'top' | 'bottom';
  className?: string;
}

export const Menu: React.FC<MenuProps> = ({
  trigger,
  items,
  align = 'end',
  side = 'bottom',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const alignClasses = {
    start: 'left-0',
    end: 'right-0',
  };

  const sideClasses = {
    top: 'bottom-[calc(100%+6px)]',
    bottom: 'top-[calc(100%+6px)]',
  };

  return (
    <div ref={menuRef} className="relative inline-block">
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
        className="inline-flex cursor-pointer"
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          role="menu"
          className={cn(
            'absolute z-50 min-w-52 rounded-[var(--radius-lg)] p-1.5 bg-[var(--color-surface)] border border-[var(--color-outline)] shadow-[var(--shadow-floating)] animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-0.5',
            alignClasses[align],
            sideClasses[side],
            className
          )}
        >
          {items.map((item) => {
            if (item.divider) {
              return <div key={item.id} className="h-px my-1 bg-[var(--color-outline)]" role="separator" />;
            }

            return (
              <button
                key={item.id}
                role="menuitem"
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
                className={cn(
                  'flex items-center justify-between w-full px-3 py-2 rounded-[var(--radius-md)] text-xs font-medium transition-colors duration-150 cursor-pointer text-left',
                  item.destructive
                    ? 'text-[var(--danger)] hover:bg-[var(--danger-subtle)]'
                    : 'text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)]',
                  item.disabled && 'opacity-40 cursor-not-allowed pointer-events-none'
                )}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {item.icon && <span className="shrink-0 text-current">{item.icon}</span>}
                  <span className="truncate">{item.label}</span>
                </div>
                {item.shortcut && (
                  <span className="text-[10px] font-mono text-[var(--color-on-surface-muted)] ml-3">
                    {item.shortcut}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

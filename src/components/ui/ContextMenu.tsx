import React, { useState, useEffect, useRef } from 'react';
import { cn } from './utils';
import { MenuItem } from './Menu';

export interface ContextMenuProps {
  children: React.ReactNode;
  items: MenuItem[];
  className?: string;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ children, items, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const x = Math.min(e.clientX, window.innerWidth - 220);
    const y = Math.min(e.clientY, window.innerHeight - 260);
    setPosition({ x, y });
    setIsOpen(true);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  return (
    <div onContextMenu={handleContextMenu} className={cn('relative', className)}>
      {children}

      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          style={{ top: `${position.y}px`, left: `${position.x}px` }}
          className="fixed z-50 min-w-48 rounded-[var(--radius-lg)] p-1.5 bg-[var(--color-surface)] border border-[var(--color-outline)] shadow-[var(--shadow-floating)] animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-0.5"
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
                <div className="flex items-center gap-2 truncate">
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  <span className="truncate">{item.label}</span>
                </div>
                {item.shortcut && (
                  <span className="text-[10px] font-mono text-[var(--color-on-surface-muted)] ml-2">
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

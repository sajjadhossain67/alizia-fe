import React, { useEffect } from 'react';
import { cn } from './utils';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'bottom' | 'right' | 'left';
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'bottom',
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const positionClasses = {
    bottom:
      'bottom-0 left-0 right-0 max-h-[85vh] rounded-t-[var(--radius-xl)] animate-in slide-in-from-bottom duration-250',
    right:
      'top-0 right-0 bottom-0 w-full max-w-md rounded-l-[var(--radius-xl)] animate-in slide-in-from-right duration-250',
    left:
      'top-0 left-0 bottom-0 w-full max-w-md rounded-r-[var(--radius-xl)] animate-in slide-in-from-left duration-250',
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Drawer'}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'fixed bg-[var(--color-surface)] border border-[var(--color-outline)] shadow-[var(--shadow-floating)] p-5 flex flex-col gap-4 overflow-hidden',
          positionClasses[position],
          className
        )}
      >
        {position === 'bottom' && (
          <div className="w-12 h-1.5 rounded-full bg-[var(--color-outline-strong)] mx-auto mb-1 shrink-0" />
        )}

        <div className="flex items-center justify-between gap-4 shrink-0 pb-2 border-b border-[var(--color-outline)]">
          {title && <h3 className="text-base font-semibold text-[var(--color-on-surface)]">{title}</h3>}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="p-1 rounded-full text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)] ml-auto cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">{children}</div>
      </div>
    </div>
  );
};

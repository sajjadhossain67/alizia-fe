import React, { useEffect } from 'react';
import { cn } from './utils';

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  side?: 'right' | 'left';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  side = 'right',
  size = 'md',
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

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-xl',
    xl: 'max-w-3xl',
    full: 'max-w-[95vw]',
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Side panel'}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'fixed top-0 bottom-0 w-full bg-[var(--color-surface)] border-[var(--color-outline)] shadow-[var(--shadow-floating)] flex flex-col z-50',
          side === 'right'
            ? 'right-0 border-l animate-in slide-in-from-right duration-250'
            : 'left-0 border-r animate-in slide-in-from-left duration-250',
          sizeClasses[size],
          className
        )}
      >
        <div className="flex items-start justify-between p-5 border-b border-[var(--color-outline)]">
          <div className="flex flex-col gap-0.5">
            {title && <h3 className="text-base font-semibold text-[var(--color-on-surface)]">{title}</h3>}
            {description && <p className="text-xs text-[var(--color-on-surface-muted)]">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="p-1 rounded-full text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">{children}</div>

        {footer && <div className="p-4 border-t border-[var(--color-outline)] bg-[var(--color-surface-container)] flex items-center justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
};

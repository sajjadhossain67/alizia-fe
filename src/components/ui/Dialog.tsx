import React, { useEffect, useRef } from 'react';
import { cn } from './utils';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'md',
  className,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
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

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'dialog-title' : undefined}
        aria-describedby={description ? 'dialog-desc' : undefined}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'w-full rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-outline)] shadow-[var(--shadow-floating)] p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-150',
          maxWidthClasses[maxWidth],
          className
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            {title && (
              <h2 id="dialog-title" className="text-lg font-semibold text-[var(--color-on-surface)]">
                {title}
              </h2>
            )}
            {description && (
              <p id="dialog-desc" className="text-xs text-[var(--color-on-surface-muted)]">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-full text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="py-2 text-sm text-[var(--color-on-surface-variant)]">{children}</div>

        {footer && <div className="flex items-center justify-end gap-3 pt-2">{footer}</div>}
      </div>
    </div>
  );
};

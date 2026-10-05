import React, { useState, useRef, useEffect } from 'react';
import { cn } from './utils';

export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom';
  className?: string;
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  align = 'start',
  side = 'bottom',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const alignClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  };

  const sideClasses = {
    top: 'bottom-[calc(100%+8px)]',
    bottom: 'top-[calc(100%+8px)]',
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
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
          role="dialog"
          className={cn(
            'absolute z-50 rounded-[var(--radius-lg)] p-3 bg-[var(--color-surface)] border border-[var(--color-outline)] shadow-[var(--shadow-floating)] animate-in fade-in zoom-in-95 duration-150 min-w-48',
            alignClasses[align],
            sideClasses[side],
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

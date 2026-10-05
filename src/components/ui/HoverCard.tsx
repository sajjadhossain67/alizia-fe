import React, { useState, useRef } from 'react';
import { cn } from './utils';

export interface HoverCardProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  openDelay?: number;
  closeDelay?: number;
  side?: 'top' | 'bottom';
  className?: string;
}

export const HoverCard: React.FC<HoverCardProps> = ({
  trigger,
  children,
  openDelay = 250,
  closeDelay = 200,
  side = 'bottom',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsOpen(true), openDelay);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsOpen(false), closeDelay);
  };

  const sideClasses = {
    top: 'bottom-[calc(100%+8px)] left-0',
    bottom: 'top-[calc(100%+8px)] left-0',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="inline-flex cursor-pointer">{trigger}</div>
      {isOpen && (
        <div
          role="region"
          aria-label="Hover preview"
          className={cn(
            'absolute z-50 w-72 rounded-[var(--radius-lg)] p-4 bg-[var(--color-surface)] border border-[var(--color-outline)] shadow-[var(--shadow-floating)] animate-in fade-in zoom-in-95 duration-150',
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

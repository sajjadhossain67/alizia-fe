import React from 'react';
import { cn } from './utils';

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const Kbd: React.FC<KbdProps> = ({ children, className, ...props }) => {
  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center font-mono text-[10px] font-semibold tracking-wider px-1.5 py-0.5 rounded-[4px]',
        'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-muted)] border border-[var(--color-outline)]',
        'shadow-[0_1px_0_1px_rgba(0,0,0,0.2)] select-none',
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  );
};

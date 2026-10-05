import React from 'react';
import { cn } from './utils';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  label,
  className,
  ...props
}) => {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn('w-px self-stretch bg-[var(--color-outline)] my-1', className)}
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={cn('flex items-center w-full my-3 gap-3', className)}
        {...props}
      >
        <div className="flex-1 h-px bg-[var(--color-outline)]" />
        <span className="text-[11px] font-semibold text-[var(--color-on-surface-muted)] uppercase tracking-wider select-none shrink-0">
          {label}
        </span>
        <div className="flex-1 h-px bg-[var(--color-outline)]" />
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn('w-full h-px bg-[var(--color-outline)] my-2', className)}
      {...props}
    />
  );
};

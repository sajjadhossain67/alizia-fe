import React from 'react';
import { cn } from './utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // 0 to 100, undefined for indeterminate
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'accent' | 'gradient';
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  showValue = false,
  size = 'md',
  variant = 'accent',
  className,
  ...props
}) => {
  const isIndeterminate = value === undefined;
  const clampedValue = Math.min(Math.max(value || 0, 0), 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const fillVariantClasses = {
    accent: 'bg-[var(--accent)]',
    gradient: 'bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570]',
  };

  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)} {...props}>
      <div
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(
          'relative w-full rounded-full bg-[var(--color-surface-container)] overflow-hidden border border-[var(--color-outline)]',
          sizeClasses[size]
        )}
      >
        {isIndeterminate ? (
          <div className="absolute inset-0 w-1/3 bg-[var(--accent)] rounded-full animate-[indeterminate_1.5s_infinite_linear]" />
        ) : (
          <div
            className={cn('h-full rounded-full transition-all duration-300 ease-out', fillVariantClasses[variant])}
            style={{ width: `${clampedValue}%` }}
          />
        )}
      </div>

      {showValue && !isIndeterminate && (
        <div className="flex justify-end text-[11px] font-mono text-[var(--color-on-surface-muted)] tabular-nums">
          {Math.round(clampedValue)}%
        </div>
      )}
    </div>
  );
};

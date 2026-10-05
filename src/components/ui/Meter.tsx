import React from 'react';
import { cn } from './utils';

export interface MeterProps {
  value: number;
  max: number;
  label?: string;
  unit?: string;
  warningThreshold?: number; // default 0.8 (80%)
  dangerThreshold?: number; // default 0.95 (95%)
  className?: string;
}

export const Meter: React.FC<MeterProps> = ({
  value,
  max,
  label,
  unit = '',
  warningThreshold = 0.8,
  dangerThreshold = 0.95,
  className,
}) => {
  const ratio = max > 0 ? value / max : 0;
  const percentage = Math.min(Math.max(ratio * 100, 0), 100);

  let status: 'normal' | 'warning' | 'danger' = 'normal';
  if (ratio >= dangerThreshold) status = 'danger';
  else if (ratio >= warningThreshold) status = 'warning';

  const fillColors = {
    normal: 'bg-[var(--accent)]',
    warning: 'bg-[var(--warning)]',
    danger: 'bg-[var(--danger)]',
  };

  const statusTextColors = {
    normal: 'text-[var(--color-on-surface-muted)]',
    warning: 'text-[var(--warning)] font-semibold',
    danger: 'text-[var(--danger)] font-bold',
  };

  return (
    <div className={cn('w-full flex flex-col gap-1.5 text-xs', className)}>
      <div className="flex items-center justify-between">
        {label && <span className="font-medium text-[var(--color-on-surface-variant)]">{label}</span>}
        <span className={cn('font-mono tabular-nums', statusTextColors[status])}>
          {value.toLocaleString()} / {max.toLocaleString()} {unit}
          {status === 'warning' && ' (80% reached)'}
          {status === 'danger' && ' (Budget limit!)'}
        </span>
      </div>

      <div
        role="meter"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Budget meter'}
        className="relative w-full h-2 rounded-full bg-[var(--color-surface-container)] border border-[var(--color-outline)] overflow-hidden"
      >
        <div
          className={cn('h-full rounded-full transition-all duration-300 ease-out', fillColors[status])}
          style={{ width: `${percentage}%` }}
        />
        {/* Visual 80% warning marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/20 pointer-events-none"
          style={{ left: `${warningThreshold * 100}%` }}
          title="80% Warning threshold"
        />
      </div>
    </div>
  );
};

import React from 'react';
import { cn } from './utils';

export interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  valueDisplay?: string | number;
  disabled?: boolean;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  label,
  valueDisplay,
  disabled = false,
  className,
}) => {
  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);

  return (
    <div className={cn('w-full flex flex-col gap-2', disabled && 'opacity-50 pointer-events-none', className)}>
      {(label || valueDisplay !== undefined) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="font-medium text-[var(--color-on-surface-variant)]">{label}</span>}
          {valueDisplay !== undefined && (
            <span className="font-mono text-[var(--color-on-surface-muted)] tabular-nums">{valueDisplay}</span>
          )}
        </div>
      )}
      <div className="relative flex items-center w-full h-5 touch-none select-none">
        {/* Track background */}
        <div className="relative w-full h-1.5 rounded-full bg-[var(--color-outline-strong)] overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] transition-all duration-75"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {/* Real HTML input for accessibility */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          aria-label={label || 'Slider'}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {/* Visual Thumb */}
        <div
          className="pointer-events-none absolute w-4 h-4 rounded-full bg-white shadow-md border-2 border-[var(--accent)] transition-transform duration-75 -translate-x-1/2"
          style={{ left: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

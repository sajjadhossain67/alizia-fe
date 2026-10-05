import React from 'react';
import { cn } from './utils';

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  disabled = false,
  label,
  description,
  className,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onCheckedChange(!checked);
    }
  };

  return (
    <label
      className={cn(
        'inline-flex items-center gap-3 cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div
        role="switch"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && onCheckedChange(!checked)}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2',
          checked ? 'bg-[var(--accent)]' : 'bg-[var(--color-outline-strong)]'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out transform',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </div>
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-sm font-medium text-[var(--color-on-surface)]">{label}</span>}
          {description && <span className="text-xs text-[var(--color-on-surface-muted)]">{description}</span>}
        </div>
      )}
    </label>
  );
};

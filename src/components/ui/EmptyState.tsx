import React from 'react';
import { cn } from './utils';
import { AliziaSparkle } from './AliziaSparkle';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto my-auto select-none gap-4',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-container)] border border-[var(--color-outline)] flex items-center justify-center shadow-xs">
        {icon || <AliziaSparkle size={28} />}
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold text-[var(--color-on-surface)]">{title}</h3>
        <p className="text-xs md:text-sm text-[var(--color-on-surface-muted)] leading-relaxed">
          {description}
        </p>
      </div>

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

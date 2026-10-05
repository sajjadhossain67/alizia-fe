import React from 'react';
import { cn } from './utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  shimmer = true,
  circle = false,
  className,
  ...props
}) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative overflow-hidden bg-[var(--color-surface-container)]',
        circle ? 'rounded-full' : 'rounded-[var(--radius-md)]',
        shimmer
          ? 'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent'
          : 'animate-pulse',
        className
      )}
      {...props}
    />
  );
};

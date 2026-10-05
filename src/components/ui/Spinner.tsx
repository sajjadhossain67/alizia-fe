import React from 'react';
import { cn } from './utils';

export interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  label?: string;
  className?: string;
}

const sizeMap = {
  xs: 14,
  sm: 18,
  md: 24,
  lg: 32,
  xl: 48,
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  label = 'Loading...',
  className,
  ...props
}) => {
  const pixelSize = typeof size === 'number' ? size : sizeMap[size] || 24;

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="status"
      aria-label={label}
      className={cn('animate-spin inline-block shrink-0', className)}
      {...props}
    >
      <defs>
        <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4285F4" />
          <stop offset="50%" stopColor="#9B72CB" />
          <stop offset="100%" stopColor="#D96570" />
        </linearGradient>
      </defs>
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="var(--color-outline-strong)"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="opacity-25"
      />
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="url(#spinnerGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="40 60"
      />
    </svg>
  );
};

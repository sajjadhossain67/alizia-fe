import React from 'react';
import { cn } from './utils';

export interface AliziaSparkleProps extends React.SVGProps<SVGSVGElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  animate?: boolean;
  thinking?: boolean;
  className?: string;
}

const sizeMap = {
  xs: 14,
  sm: 18,
  md: 24,
  lg: 32,
  xl: 48,
};

export const AliziaSparkle: React.FC<AliziaSparkleProps> = ({
  size = 'md',
  animate = false,
  thinking = false,
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
      className={cn(
        'inline-block transition-transform duration-300',
        thinking && 'animate-[spin_4s_linear_infinite]',
        animate && !thinking && 'animate-pulse',
        className
      )}
      role="img"
      aria-label={thinking ? 'Alizia is thinking' : 'Alizia Sparkle'}
      {...props}
    >
      <defs>
        <linearGradient id="aliziaSparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4285F4" />
          <stop offset="50%" stopColor="#9B72CB" />
          <stop offset="100%" stopColor="#D96570" />
        </linearGradient>
        <radialGradient id="aliziaGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9B72CB" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#9B72CB" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Subtle Glow backing */}
      <circle cx="12" cy="12" r="10" fill="url(#aliziaGlow)" />

      {/* Main 4-point Organic Star */}
      <path
        d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4772 12 22C12 16.4772 16.4772 12 22 12C16.4772 12 12 7.52285 12 2Z"
        fill="url(#aliziaSparkleGrad)"
      />

      {/* Secondary accent mini sparkle */}
      <path
        d="M19 3C19 4.65685 17.6569 6 16 6C17.6569 6 19 7.34315 19 9C19 7.34315 20.3431 6 22 6C20.3431 6 19 4.65685 19 3Z"
        fill="#9B72CB"
        opacity="0.85"
      />
    </svg>
  );
};

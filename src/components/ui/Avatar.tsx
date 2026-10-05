import React, { useState } from 'react';
import { cn } from './utils';
import { AliziaSparkle } from './AliziaSparkle';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isModel?: boolean;
  modelThinking?: boolean;
  status?: 'online' | 'busy' | 'offline';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'User',
  size = 'md',
  isModel = false,
  modelThinking = false,
  status,
  className,
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const statusSizeClasses = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
  };

  const statusColors = {
    online: 'bg-[var(--success)]',
    busy: 'bg-[var(--warning)]',
    offline: 'bg-[var(--color-on-surface-disabled)]',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={cn('relative inline-flex shrink-0 select-none', className)}>
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-medium overflow-hidden border border-[var(--color-outline)] shadow-xs transition-transform duration-200',
          sizeClasses[size],
          isModel
            ? 'bg-gradient-to-br from-[#4285F4]/20 via-[#9B72CB]/20 to-[#D96570]/20 text-[var(--accent)]'
            : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface)]'
        )}
      >
        {isModel ? (
          <AliziaSparkle size={size} thinking={modelThinking} />
        ) : src && !imageError ? (
          <img
            src={src}
            alt={name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-[var(--color-surface)]',
            statusSizeClasses[size],
            statusColors[status]
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
};

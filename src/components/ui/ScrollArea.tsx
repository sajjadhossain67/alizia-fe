import React from 'react';
import { cn } from './utils';

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: string | number;
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({
  children,
  maxHeight,
  className,
  style,
  ...props
}) => {
  return (
    <div
      tabIndex={0}
      style={{ maxHeight, ...style }}
      className={cn(
        'w-full overflow-y-auto overflow-x-hidden custom-scrollbar focus-visible:outline-none',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

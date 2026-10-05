import React, { useState, useRef, useEffect } from 'react';
import { cn } from './utils';

export interface ResizablePanelsProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultLeftWidth?: number; // percentage (e.g. 50)
  minLeftWidth?: number; // min percentage
  maxLeftWidth?: number; // max percentage
  className?: string;
}

export const ResizablePanels: React.FC<ResizablePanelsProps> = ({
  left,
  right,
  defaultLeftWidth = 50,
  minLeftWidth = 20,
  maxLeftWidth = 80,
  className,
}) => {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const rawPct = ((e.clientX - rect.left) / rect.width) * 100;
      const clamped = Math.min(Math.max(rawPct, minLeftWidth), maxLeftWidth);
      setLeftWidth(clamped);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, minLeftWidth, maxLeftWidth]);

  return (
    <div
      ref={containerRef}
      className={cn('relative flex w-full h-full overflow-hidden select-none', className)}
    >
      {/* Left Panel */}
      <div style={{ width: `${leftWidth}%` }} className="h-full overflow-auto custom-scrollbar">
        {left}
      </div>

      {/* Resizable Divider Handle */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={Math.round(leftWidth)}
        tabIndex={0}
        onMouseDown={() => setIsDragging(true)}
        className={cn(
          'relative w-1.5 hover:w-2 -mx-0.5 z-20 cursor-col-resize transition-all duration-150 flex items-center justify-center shrink-0 group',
          isDragging ? 'bg-[var(--accent)]' : 'bg-[var(--color-outline)] hover:bg-[var(--accent)]/60'
        )}
      >
        <div className="w-1 h-8 rounded-full bg-[var(--color-on-surface-muted)] group-hover:bg-white" />
      </div>

      {/* Right Panel */}
      <div style={{ width: `${100 - leftWidth}%` }} className="h-full overflow-auto custom-scrollbar">
        {right}
      </div>
    </div>
  );
};

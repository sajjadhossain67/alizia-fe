import React, { forwardRef, useEffect, useRef } from 'react';
import { cn } from './utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxRows?: number;
  minRows?: number;
  showCount?: boolean;
  maxCount?: number;
  onEnterSubmit?: () => void;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      value,
      onChange,
      onKeyDown,
      maxRows = 8,
      minRows = 1,
      showCount = false,
      maxCount,
      onEnterSubmit,
      placeholder = 'Ask anything...',
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLTextAreaElement | null>(null);

    // Auto grow calculation
    const adjustHeight = () => {
      const textarea = internalRef.current;
      if (!textarea) return;

      textarea.style.height = 'auto';
      const lineHeight = 24; // standard 24px line-height
      const maxHeight = maxRows * lineHeight;
      const minHeight = minRows * lineHeight;
      const scrollHeight = textarea.scrollHeight;

      if (scrollHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
        textarea.style.overflowY = 'auto';
      } else {
        textarea.style.height = `${Math.max(scrollHeight, minHeight)}px`;
        textarea.style.overflowY = 'hidden';
      }
    };

    useEffect(() => {
      adjustHeight();
    }, [value]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Prevent submit during IME composition (Chinese, Japanese, Korean)
      if (e.nativeEvent.isComposing) return;

      if (e.key === 'Enter' && !e.shiftKey && onEnterSubmit) {
        e.preventDefault();
        onEnterSubmit();
        return;
      }
      onKeyDown?.(e);
    };

    const count = typeof value === 'string' ? value.length : 0;

    return (
      <div className="relative w-full flex flex-col">
        <textarea
          ref={(node) => {
            internalRef.current = node;
            if (typeof forwardedRef === 'function') {
              forwardedRef(node);
            } else if (forwardedRef) {
              forwardedRef.current = node;
            }
          }}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            onChange?.(e);
            adjustHeight();
          }}
          onKeyDown={handleKeyDown}
          rows={minRows}
          className={cn(
            'w-full resize-none bg-transparent text-sm md:text-base leading-6 text-[var(--color-on-surface)]',
            'placeholder:text-[var(--color-on-surface-muted)] focus:outline-none transition-[height] duration-75',
            'custom-scrollbar',
            className
          )}
          {...props}
        />
        {showCount && (
          <div className="flex justify-end text-[11px] text-[var(--color-on-surface-muted)] mt-1 select-none tabular-nums">
            {count} {maxCount ? `/ ${maxCount}` : 'chars'}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

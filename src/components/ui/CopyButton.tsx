import React, { useState } from 'react';
import { cn } from './utils';

export interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  textToCopy: string;
  label?: string;
  copiedLabel?: string;
  size?: 'sm' | 'md';
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  label = 'Copy',
  copiedLabel = 'Copied!',
  size = 'sm',
  className,
  ...props
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const sizeClasses = {
    sm: 'h-7 px-2 text-xs gap-1.5',
    md: 'h-8 px-3 text-sm gap-2',
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : label}
      title={copied ? copiedLabel : label}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 cursor-pointer select-none border',
        copied
          ? 'bg-[var(--success-subtle)] text-[var(--success)] border-[var(--success)]/40'
          : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-muted)] border-[var(--color-outline)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] active:scale-95',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-[var(--success)] shrink-0 animate-in zoom-in-75 duration-150" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="text-[11px] font-semibold">{copiedLabel}</span>
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5 text-current shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {label && <span className="text-[11px]">{label}</span>}
        </>
      )}
    </button>
  );
};

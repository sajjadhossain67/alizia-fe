import React, { useState, useRef, useEffect } from 'react';
import { cn } from './utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'pill' | 'underline' | 'segmented';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'pill',
  size = 'md',
  className,
}) => {
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    }
    if (nextIndex !== index && !tabs[nextIndex].disabled) {
      e.preventDefault();
      onChange(tabs[nextIndex].id);
      const buttons = tabListRef.current?.querySelectorAll<HTMLButtonElement>('button[role="tab"]');
      buttons?.[nextIndex]?.focus();
    }
  };

  const sizeClasses = {
    sm: 'text-xs py-1 px-3 gap-1.5',
    md: 'text-sm py-1.5 px-4 gap-2',
    lg: 'text-base py-2 px-5 gap-2.5',
  };

  const containerVariantClasses = {
    pill: 'gap-1.5 bg-transparent',
    underline: 'gap-4 border-b border-[var(--color-outline)]',
    segmented: 'p-1 rounded-full bg-[var(--color-surface-container)] border border-[var(--color-outline)] gap-1',
  };

  return (
    <div
      ref={tabListRef}
      role="tablist"
      aria-label="Tabs"
      className={cn('inline-flex items-center', containerVariantClasses[variant], className)}
    >
      {tabs.map((tab, idx) => {
        const isActive = tab.id === activeTab;

        let tabClasses = '';
        if (variant === 'pill') {
          tabClasses = isActive
            ? 'bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold shadow-xs'
            : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-on-surface)]';
        } else if (variant === 'underline') {
          tabClasses = isActive
            ? 'text-[var(--accent)] font-semibold border-b-2 border-[var(--accent)] -mb-px'
            : 'text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] border-b-2 border-transparent';
        } else if (variant === 'segmented') {
          tabClasses = isActive
            ? 'bg-[var(--color-surface)] text-[var(--color-on-surface)] font-medium shadow-sm'
            : 'text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)]';
        }

        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={cn(
              'inline-flex items-center justify-center rounded-full transition-all duration-200 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
              sizeClasses[size],
              tabClasses,
              tab.disabled && 'opacity-40 cursor-not-allowed'
            )}
          >
            {tab.icon && <span className="inline-flex shrink-0 text-current">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-muted)] tabular-nums font-semibold">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

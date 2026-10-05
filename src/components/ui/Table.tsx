import React, { useState } from 'react';
import { cn } from './utils';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  zebra?: boolean;
  stickyHeader?: boolean;
  className?: string;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  keyField,
  zebra = true,
  stickyHeader = false,
  className,
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal === bVal) return 0;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return sortOrder === 'asc' ? -1 : 1;
  });

  return (
    <div className={cn('w-full overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-outline)] custom-scrollbar', className)}>
      <table className="w-full text-left text-xs md:text-sm border-collapse">
        <thead className={cn('bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] border-b border-[var(--color-outline)] font-semibold select-none', stickyHeader && 'sticky top-0 z-10')}>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key)}
                className={cn(
                  'px-4 py-3',
                  col.sortable && 'cursor-pointer hover:text-[var(--color-on-surface)] transition-colors',
                  col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                )}
              >
                <div className={cn('inline-flex items-center gap-1.5', col.align === 'right' && 'flex-row-reverse')}>
                  <span>{col.header}</span>
                  {col.sortable && (
                    <span className="text-[10px] text-[var(--color-on-surface-muted)]">
                      {sortKey === col.key ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-outline)] text-[var(--color-on-surface)]">
          {sortedData.map((row, index) => (
            <tr
              key={String(row[keyField])}
              className={cn(
                'transition-colors duration-150 hover:bg-[var(--color-surface-hover)]',
                zebra && index % 2 === 1 && 'bg-[var(--color-surface-container)]/40'
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    'px-4 py-3 align-middle',
                    col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                  )}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

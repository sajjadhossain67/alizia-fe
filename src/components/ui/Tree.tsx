import React, { useState } from 'react';
import { cn } from './utils';

export interface TreeNode {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
  badge?: string;
  defaultExpanded?: boolean;
}

export interface TreeProps {
  data: TreeNode[];
  onSelectNode?: (node: TreeNode) => void;
  selectedId?: string;
  className?: string;
}

const TreeItem: React.FC<{
  node: TreeNode;
  level: number;
  selectedId?: string;
  onSelect?: (node: TreeNode) => void;
}> = ({ node, level, selectedId, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(node.defaultExpanded ?? false);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = node.id === selectedId;

  return (
    <div className="flex flex-col">
      <div
        role="treeitem"
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={isSelected}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (hasChildren) setIsExpanded(!isExpanded);
          onSelect?.(node);
        }}
        className={cn(
          'flex items-center justify-between py-1.5 pr-2 rounded-[var(--radius-sm)] text-xs font-medium cursor-pointer transition-colors duration-150 select-none',
          isSelected
            ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
            : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-on-surface)]'
        )}
      >
        <div className="flex items-center gap-1.5 truncate">
          {hasChildren ? (
            <span
              className={cn(
                'w-4 h-4 flex items-center justify-center text-[10px] text-[var(--color-on-surface-muted)] transition-transform duration-150 shrink-0',
                isExpanded && 'rotate-90'
              )}
            >
              ▶
            </span>
          ) : (
            <span className="w-4 shrink-0" />
          )}

          {node.icon && <span className="shrink-0 text-current">{node.icon}</span>}
          <span className="truncate">{node.label}</span>
        </div>

        {node.badge && (
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--color-surface-container)] text-[var(--color-on-surface-muted)] tabular-nums">
            {node.badge}
          </span>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div role="group" className="flex flex-col">
          {node.children!.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const Tree: React.FC<TreeProps> = ({ data, onSelectNode, selectedId, className }) => {
  return (
    <div role="tree" className={cn('w-full flex flex-col gap-0.5', className)}>
      {data.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          level={0}
          selectedId={selectedId}
          onSelect={onSelectNode}
        />
      ))}
    </div>
  );
};

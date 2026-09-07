'use client';

import { EyeOff } from 'lucide-react';

import { cn } from '@/lib/utils';
import { TableId } from '@/store/subscriptions/table.store';
import { DropdownMenuItem } from '@/components/ui/custom/dropdown-menu';
import useTableColumnDisplayToggle from '@/hooks/table-columns-adjust/useTableColumnDisplayToggle';
import { TableColumnId, TableColumnOrderingSource } from '@/store/table-columns-adjust/table-column-adjuster.types';

export interface TableColumnHideMenuItemProps {
  tableId: TableId;
  /** The column whose header this menu belongs to. */
  columnId: TableColumnId;
  /** Ordering source, for a table that keeps its column order in its own store. */
  ordering?: TableColumnOrderingSource;
  /** Called after the column is hidden, so the host menu can close itself. */
  onAction?: () => void;
  className?: string;
  /** Item label. Defaults to "Hide Column". */
  children?: React.ReactNode;
}

/**
 * "Hide Column" menu item for the column its header owns.
 *
 * Renders nothing for the table's first column, which is never hideable — there is no point
 * offering an action that cannot run.
 */
export default function TableColumnHideMenuItem({
  tableId,
  columnId,
  ordering,
  onAction,
  className,
  children,
}: TableColumnHideMenuItemProps) {
  const { hideColumn, isColumnHideable } = useTableColumnDisplayToggle(tableId, ordering);

  if (!isColumnHideable(columnId)) {
    return null;
  }

  const handleHideColumn = () => {
    hideColumn(columnId);
    onAction?.();
  };

  return (
    <DropdownMenuItem onClick={ handleHideColumn } className={ cn('cursor-pointer', className) }>
      <EyeOff className="size-4" />
      { children ?? 'Hide Column' }
    </DropdownMenuItem>
  );
}

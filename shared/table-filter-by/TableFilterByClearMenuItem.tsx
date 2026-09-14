'use client';

import { FilterX } from 'lucide-react';

import { cn } from '@/lib/utils';
import { TableId, AppColumnId } from '@/store/subscriptions/table.store';
import { DropdownMenuItem } from '@/components/ui/custom/dropdown-menu';
import useTableFilterByQuery from '@/hooks/table-filter-by/useTableFilterByQuery';

export interface TableFilterByClearMenuItemProps {
  /** The table the column is rendered in. Prefixes the search param key. */
  tableId: TableId;
  /** The column whose header this menu belongs to. */
  columnId: AppColumnId;
  /** Called after the filter is cleared, so the host menu can close itself. */
  onAction?: () => void;
  className?: string;
  /** Item label. Defaults to "Clear Filter". */
  children?: React.ReactNode;
}

/**
 * "Clear Filter" in the column's main menu, so dropping a filter is one click from the trigger
 * rather than a hover into the "Filter By" submenu.
 *
 * Renders nothing when the column has no filter applied — there is no point offering an action that
 * has nothing to do.
 */
export default function TableFilterByClearMenuItem({
  tableId,
  columnId,
  onAction,
  className,
  children,
}: TableFilterByClearMenuItemProps) {
  const { hasFilterValue, clearFilterValue } = useTableFilterByQuery(tableId, columnId);

  if (!hasFilterValue) {
    return null;
  }

  const handleClearFilter = () => {
    clearFilterValue();
    onAction?.();
  };

  return (
    <DropdownMenuItem onClick={ handleClearFilter } className={ cn('cursor-pointer', className) }>
      <FilterX className="size-4" />
      { children ?? 'Clear Filter' }
    </DropdownMenuItem>
  );
}

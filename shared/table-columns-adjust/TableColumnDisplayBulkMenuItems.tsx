'use client';

import { Eye, EyeOff } from 'lucide-react';

import { cn } from '@/lib/utils';
import { TableId } from '@/store/subscriptions/table.store';
import { TableColumnOrderingSource } from '@/store/table-columns-adjust/table-column-adjuster.types';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/custom/dropdown-menu';
import useTableColumnDisplayToggle from '@/hooks/table-columns-adjust/useTableColumnDisplayToggle';

export interface TableColumnDisplayBulkMenuItemsProps {
  tableId: TableId;
  /** Ordering source, for a table that keeps its column order in its own store. */
  ordering?: TableColumnOrderingSource;
  /** Separator above the actions. @default true */
  showSeparator?: boolean;
  hideAllText?: React.ReactNode;
  showAllText?: React.ReactNode;
  className?: string;
}

/**
 * "Hide All" / "Show All" actions for the bottom of the show/hide list.
 *
 * "Hide All" leaves the table's first column standing, since it is never hideable, which is what
 * keeps this menu reachable afterwards. Each action is disabled once it would do nothing.
 */
export default function TableColumnDisplayBulkMenuItems({
  tableId,
  ordering,
  showSeparator = true,
  hideAllText,
  showAllText,
  className,
}: TableColumnDisplayBulkMenuItemsProps) {
  const { showAllColumns, hideAllColumns, canShowAll, canHideAll } = useTableColumnDisplayToggle(tableId, ordering);

  return (
    <>
      { showSeparator ? <DropdownMenuSeparator /> : null }
      <DropdownMenuItem
        onSelect={ (event: Event) => event.preventDefault() }
        onClick={ hideAllColumns }
        disabled={ !canHideAll }
        className={ cn('cursor-pointer', className) }
      >
        <EyeOff className="size-4" />
        { hideAllText ?? 'Hide All' }
      </DropdownMenuItem>
      <DropdownMenuItem
        onSelect={ (event: Event) => event.preventDefault() }
        onClick={ showAllColumns }
        disabled={ !canShowAll }
        className={ cn('cursor-pointer', className) }
      >
        <Eye className="size-4" />
        { showAllText ?? 'Show All' }
      </DropdownMenuItem>
    </>
  );
}

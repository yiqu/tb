'use client';

import { cn } from '@/lib/utils';
import { TableId } from '@/store/subscriptions/table.store';
import { DropdownMenuCheckboxItem } from '@/components/ui/custom/dropdown-menu';
import useTableColumnDisplayToggle from '@/hooks/table-columns-adjust/useTableColumnDisplayToggle';
import { TableColumnId, TableColumnOrderingSource } from '@/store/table-columns-adjust/table-column-adjuster.types';

export interface TableColumnDisplayCheckboxItemProps {
  tableId: TableId;
  /** The column this row toggles. */
  columnId: TableColumnId;
  /** Ordering source, for a table that keeps its column order in its own store. */
  ordering?: TableColumnOrderingSource;
  className?: string;
  /** Row label. Defaults to the column id. */
  children?: React.ReactNode;
}

/**
 * One column's checkbox row in the show/hide list: checked when shown, click to toggle.
 *
 * Disabled for the table's first column, which is never hideable. The menu is kept open on select
 * so several columns can be toggled in one visit.
 */
export default function TableColumnDisplayCheckboxItem({
  tableId,
  columnId,
  ordering,
  className,
  children,
}: TableColumnDisplayCheckboxItemProps) {
  const { toggleColumnDisplay, isColumnShown, isColumnHideable } = useTableColumnDisplayToggle(tableId, ordering);
  const isShown: boolean = isColumnShown(columnId);

  return (
    <DropdownMenuCheckboxItem
      checked={ isShown }
      disabled={ isShown && !isColumnHideable(columnId) }
      onSelect={ (event: Event) => event.preventDefault() }
      onCheckedChange={ () => toggleColumnDisplay(columnId) }
      className={ cn('cursor-pointer', className) }
    >
      { children ?? columnId }
    </DropdownMenuCheckboxItem>
  );
}

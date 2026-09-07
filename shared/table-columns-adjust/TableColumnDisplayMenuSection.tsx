'use client';

import { cn } from '@/lib/utils';
import { TableId } from '@/store/subscriptions/table.store';
import { DropdownMenuGroup, DropdownMenuLabel } from '@/components/ui/custom/dropdown-menu';
import { TableColumnId, TableColumnOrderingSource } from '@/store/table-columns-adjust/table-column-adjuster.types';

import TableColumnHideMenuItem from './TableColumnHideMenuItem';
import TableColumnDisplaySubMenu from './TableColumnDisplaySubMenu';

export interface TableColumnDisplayMenuSectionProps {
  tableId: TableId;
  /** The column whose header this menu belongs to. */
  columnId: TableColumnId;
  /** Ordering source, for a table that keeps its column order in its own store. */
  ordering?: TableColumnOrderingSource;
  /** Column id to header text. Falls back to the column id. */
  columnLabels?: Record<string, string>;
  /** Called after "Hide Column" runs, so the host menu can close itself. */
  onAction?: () => void;
  /** Section heading. Pass `null` to drop it. */
  label?: React.ReactNode;
  /** Show the "Hide All" / "Show All" actions under the column list. @default true */
  showBulkActions?: boolean;
  /** Class for the group wrapper. */
  className?: string;
  /** Class for the section heading. */
  labelClassName?: string;
  /** Class for the submenu panel — where to change its height, width or padding. */
  subMenuContentClassName?: string;
}

/**
 * The "Display" section of a column's three dot menu: hide this column, plus a submenu for toggling
 * any column of the table.
 *
 * Drop this into an existing `<DropdownMenuContent>` that already has other options (add your own
 * `<DropdownMenuSeparator />` above it), or use `TableColumnDisplayMenuButton` for the whole menu.
 */
export default function TableColumnDisplayMenuSection({
  tableId,
  columnId,
  ordering,
  columnLabels,
  onAction,
  label,
  showBulkActions,
  className,
  labelClassName,
  subMenuContentClassName,
}: TableColumnDisplayMenuSectionProps) {
  return (
    <DropdownMenuGroup className={ className }>
      { label === null ? null : (
        <DropdownMenuLabel className={ cn('text-foreground/50', labelClassName) }>{ label ?? 'Display' }</DropdownMenuLabel>
      ) }
      <TableColumnHideMenuItem tableId={ tableId } columnId={ columnId } ordering={ ordering } onAction={ onAction } />
      <TableColumnDisplaySubMenu
        tableId={ tableId }
        ordering={ ordering }
        columnLabels={ columnLabels }
        showBulkActions={ showBulkActions }
        contentClassName={ subMenuContentClassName }
      />
    </DropdownMenuGroup>
  );
}

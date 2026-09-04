'use client';

import { Columns3 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { TableId } from '@/store/subscriptions/table.store';
import useOrderedTableColumns from '@/hooks/table-columns-adjust/useOrderedTableColumns';
import { TableColumnId, TableColumnOrderingSource } from '@/store/table-columns-adjust/table-column-adjuster.types';
import { DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/custom/dropdown-menu';

import TableColumnDisplayCheckboxItem from './TableColumnDisplayCheckboxItem';
import TableColumnDisplayBulkMenuItems from './TableColumnDisplayBulkMenuItems';

/**
 * Tall enough for a long column list, capped by the room Radix reports so it never runs off screen.
 * The fallback keeps it sane if the variable is not set. Override with `contentClassName`.
 */
const SUB_CONTENT_MAX_HEIGHT = 'max-h-[min(36rem,var(--radix-dropdown-menu-content-available-height,36rem))]';

export interface TableColumnDisplaySubMenuProps {
  tableId: TableId;
  /** Ordering source, for a table that keeps its column order in its own store. */
  ordering?: TableColumnOrderingSource;
  /** Column id to header text. Falls back to the column id. */
  columnLabels?: Record<string, string>;
  triggerText?: React.ReactNode;
  /** Show the "Hide All" / "Show All" actions under the list. @default true */
  showBulkActions?: boolean;
  /** Class for the submenu trigger row. */
  className?: string;
  /** Class for the submenu panel — where to change its height, width or padding. */
  contentClassName?: string;
}

/**
 * Submenu listing every column of the table as a checkbox, in the table's current column order,
 * with the bulk actions underneath.
 *
 * No `side` prop on purpose: Radix picks the side with room (right, flipping left near the viewport
 * edge) instead of us hard coding one.
 */
export default function TableColumnDisplaySubMenu({
  tableId,
  ordering,
  columnLabels,
  triggerText,
  showBulkActions = true,
  className,
  contentClassName,
}: TableColumnDisplaySubMenuProps) {
  const orderedColumns = useOrderedTableColumns(tableId, ordering);

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className={ cn('cursor-pointer', className) }>
        <Columns3 className="size-4" />
        { triggerText ?? 'Show / Hide Columns' }
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className={ cn('min-w-56 overflow-x-hidden overflow-y-auto', SUB_CONTENT_MAX_HEIGHT, contentClassName) }>
        { orderedColumns.map((columnId: TableColumnId) => (
          <TableColumnDisplayCheckboxItem key={ columnId } tableId={ tableId } columnId={ columnId } ordering={ ordering }>
            { columnLabels?.[columnId] ?? columnId }
          </TableColumnDisplayCheckboxItem>
        )) }

        { showBulkActions ? <TableColumnDisplayBulkMenuItems tableId={ tableId } ordering={ ordering } /> : null }
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}

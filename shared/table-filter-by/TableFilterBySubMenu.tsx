'use client';

import { ListFilter } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Typography from '@/components/typography/Typography';
import { TableId, AppColumnId } from '@/store/subscriptions/table.store';
import useTableFilterByActive from '@/hooks/table-filter-by/useTableFilterByActive';
import { DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/custom/dropdown-menu';

import TableFilterByPanel from './TableFilterByPanel';

export interface TableFilterBySubMenuProps {
  /** The table the column is rendered in. Prefixes the search param key. */
  tableId: TableId;
  /** The column being filtered. */
  columnId: AppColumnId;
  triggerText?: React.ReactNode;
  /** Field label inside the panel. Pass `null` to drop it. */
  label?: React.ReactNode;
  /** Apply button text. */
  applyText?: React.ReactNode;
  /** Clear button text. */
  clearText?: React.ReactNode;
  /** Called after the filter is applied, so the host menu can close itself. */
  onAction?: () => void;
  /** Class for the submenu trigger row. */
  className?: string;
  /** Class for the submenu panel — where to change its width or padding. */
  contentClassName?: string;
}

/**
 * The "Filter By" submenu: a trigger row carrying an "Active" chip while a filter is applied,
 * opening onto the filter panel.
 *
 * The chip rather than a highlighted row: the menu already uses its accent background for hover and
 * open state, so tinting the row to mean "has a filter" competed with that and read as selection.
 *
 * Opens by default when the column already has a filter, so the value the table is filtered on is
 * one hover away rather than hidden. No `side` prop on purpose — Radix picks the side with room.
 */
export default function TableFilterBySubMenu({
  tableId,
  columnId,
  triggerText,
  label,
  applyText,
  clearText,
  onAction,
  className,
  contentClassName,
}: TableFilterBySubMenuProps) {
  const { hasActive } = useTableFilterByActive(tableId, columnId);

  return (
    <DropdownMenuSub defaultOpen={ hasActive }>
      <DropdownMenuSubTrigger className={ cn('cursor-pointer', className) }>
        <ListFilter className="size-4" />
        { triggerText ?? 'Filter By' }
        { hasActive ?
          <Badge variant="secondary" className="px-1.5 py-0">
            <Typography as="span" variant="span0">
              Active
            </Typography>
          </Badge>
        : null }
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className={ cn('min-w-64 p-4', contentClassName) }>
        <TableFilterByPanel
          tableId={ tableId }
          columnId={ columnId }
          label={ label }
          applyText={ applyText }
          clearText={ clearText }
          onAction={ onAction }
        />
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}

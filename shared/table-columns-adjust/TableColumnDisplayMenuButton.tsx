'use client';

import { useState } from 'react';
import { EllipsisVertical } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { TableId } from '@/store/subscriptions/table.store';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/custom/dropdown-menu';
import { TableColumnId, TableColumnOrderingSource } from '@/store/table-columns-adjust/table-column-adjuster.types';

import TableColumnDisplayMenuSection from './TableColumnDisplayMenuSection';

export interface TableColumnDisplayMenuButtonProps {
  tableId: TableId;
  /** The column whose header this menu belongs to. */
  columnId: TableColumnId;
  /** Ordering source, for a table that keeps its column order in its own store. */
  ordering?: TableColumnOrderingSource;
  /** Column id to header text. Falls back to the column id. */
  columnLabels?: Record<string, string>;
  /** Section heading inside the menu. Pass `null` to drop it. */
  label?: React.ReactNode;
  /** Show the "Hide All" / "Show All" actions under the column list. @default true */
  showBulkActions?: boolean;
  /** Which edge of the trigger the menu lines up with. @default 'start' */
  align?: 'start' | 'center' | 'end';
  /** Class for the trigger button. */
  className?: string;
  /** Class for the menu panel. */
  contentClassName?: string;
  /** Class for the submenu panel — where to change its height, width or padding. */
  subMenuContentClassName?: string;
  /** Trigger content. Defaults to a three dot icon. */
  children?: React.ReactNode;
}

/**
 * The whole show/hide menu for one column header: three dot trigger, menu, and the Display section.
 *
 * This is the one-line drop-in for a new table. A table whose header menu also has other options
 * (sorting, pinning, filtering…) should build its own `DropdownMenu` and put
 * `TableColumnDisplayMenuSection` inside it instead.
 */
export default function TableColumnDisplayMenuButton({
  tableId,
  columnId,
  ordering,
  columnLabels,
  label,
  showBulkActions,
  align = 'start',
  className,
  contentClassName,
  subMenuContentClassName,
  children,
}: TableColumnDisplayMenuButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={ isOpen } onOpenChange={ setIsOpen }>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Column actions"
          className={ cn(`
            flex size-6 shrink-0 items-center justify-center rounded-md
            hover:bg-sidebar-accent/50
          `, className) }
        >
          { children ?? <EllipsisVertical className="size-4 text-muted-foreground" /> }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={ align } className={ contentClassName }>
        <TableColumnDisplayMenuSection
          tableId={ tableId }
          columnId={ columnId }
          ordering={ ordering }
          columnLabels={ columnLabels }
          label={ label }
          showBulkActions={ showBulkActions }
          subMenuContentClassName={ subMenuContentClassName }
          onAction={ () => setIsOpen(false) }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

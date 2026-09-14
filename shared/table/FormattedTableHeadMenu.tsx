'use client';

import { useState } from 'react';
import { EllipsisVertical } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { TableId, AppColumnId } from '@/store/subscriptions/table.store';
import { SEARCH_TABLE_COLUMN_TEXT } from '@/shared/table/table.utils';
import useTableFilterByActive from '@/hooks/table-filter-by/useTableFilterByActive';
import TableFilterByMenuSection from '@/shared/table-filter-by/TableFilterByMenuSection';
import TableColumnDisplayMenuSection from '@/shared/table-columns-adjust/TableColumnDisplayMenuSection';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/custom/dropdown-menu';

import FormattedTableHeadMenuPinOption from './FormattedTableHeadMenuPinOption';

type FormattedTableHeadMenuProps = {
  columnId: string;
  tableId: TableId;
  columnIndex: number;
};

export default function FormattedTableHeadMenu({ columnId, tableId, columnIndex }: FormattedTableHeadMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { activeCount } = useTableFilterByActive(tableId, columnId as AppColumnId);

  const handleMenuAction = () => {
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={ isOpen } onOpenChange={ setIsOpen }>
      <div className="relative ml-auto shrink-0">
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Column actions"
            className={ cn(`
              flex size-6 items-center justify-center rounded-md transition-opacity
              hover:bg-sidebar-accent/50
            `) }
          >
            <EllipsisVertical className="size-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        { activeCount > 0 ?
          <span
            className={ `
              pointer-events-none absolute -top-1.5 -right-1.5 z-10 flex size-4 items-center justify-center rounded-full bg-accent
              text-[10px] font-medium text-accent-foreground
            ` }
          >
            { activeCount }
          </span>
        : null }
      </div>
      <DropdownMenuContent align="start">
        <FormattedTableHeadMenuPinOption
          onAction={ handleMenuAction }
          tableId={ tableId }
          columnId={ columnId as AppColumnId }
          columnIndex={ columnIndex }
        />
        <DropdownMenuSeparator />
        <TableColumnDisplayMenuSection
          onAction={ handleMenuAction }
          tableId={ tableId }
          columnId={ columnId as AppColumnId }
          columnLabels={ SEARCH_TABLE_COLUMN_TEXT }
        />
        <TableFilterByMenuSection tableId={ tableId } columnId={ columnId as AppColumnId } />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

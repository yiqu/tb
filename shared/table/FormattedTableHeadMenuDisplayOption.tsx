'use client';

import { EyeOff, Columns3 } from 'lucide-react';

import { TableId, AppColumnId } from '@/store/subscriptions/table.store';
import { SEARCH_TABLE_COLUMN_TEXT } from '@/shared/table/table.utils';
import useTableColumnVisibility from '@/hooks/table-columns-adjust/useTableColumnVisibility';
import useTableColumnDisplayToggle from '@/hooks/table-columns-adjust/useTableColumnDisplayToggle';
import {
  DropdownMenuSub,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/custom/dropdown-menu';

interface Props {
  onAction: () => void;
  tableId: TableId;
  columnId: AppColumnId;
}

/**
 * "Display" section of a column's three dot menu: hide this column, or toggle any of the table's
 * columns from a submenu listing every possible column for that table.
 */
export default function FormattedTableHeadMenuDisplayOption({ onAction, tableId, columnId }: Props) {
  const { allColumns } = useTableColumnVisibility(tableId);
  const { hideColumn, toggleColumnDisplay, isColumnShown, canHideColumn } = useTableColumnDisplayToggle(tableId);

  const handleHideColumn = () => {
    hideColumn(columnId);
    onAction();
  };

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuLabel className="text-foreground/50">Display</DropdownMenuLabel>
        <DropdownMenuItem onClick={ handleHideColumn } className="cursor-pointer" disabled={ !canHideColumn }>
          <EyeOff className="size-4" />
          Hide Column
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <Columns3 className="size-4" />
            Show / Hide Columns
          </DropdownMenuSubTrigger>
          { /* No `side` prop on purpose: Radix picks the side with room (right, flipping left near
               the viewport edge) instead of us hard coding one. */ }
          <DropdownMenuSubContent className="max-h-80 min-w-56 overflow-x-hidden overflow-y-auto">
            { allColumns.map((menuColumnId: AppColumnId) => {
              const isShown: boolean = isColumnShown(menuColumnId);

              return (
                <DropdownMenuCheckboxItem
                  key={ menuColumnId }
                  checked={ isShown }
                  disabled={ isShown && !canHideColumn }
                  // Keep the menu open so several columns can be toggled in one go.
                  onSelect={ (event: Event) => event.preventDefault() }
                  onCheckedChange={ () => toggleColumnDisplay(menuColumnId) }
                  className="cursor-pointer"
                >
                  { SEARCH_TABLE_COLUMN_TEXT[menuColumnId] ?? menuColumnId }
                </DropdownMenuCheckboxItem>
              );
            }) }
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuGroup>
    </>
  );
}

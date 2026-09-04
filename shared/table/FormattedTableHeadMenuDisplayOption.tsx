'use client';

import { Eye, EyeOff, Columns3 } from 'lucide-react';

import { TableId } from '@/store/subscriptions/table.store';
import { SEARCH_TABLE_COLUMN_TEXT } from '@/shared/table/table.utils';
import useOrderedTableColumns from '@/hooks/table-columns-adjust/useOrderedTableColumns';
import useTableColumnDisplayToggle from '@/hooks/table-columns-adjust/useTableColumnDisplayToggle';
import { TableColumnId, TableColumnOrderingSource } from '@/store/table-columns-adjust/table-column-adjuster.types';
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
  columnId: TableColumnId;
  /** Column id to header text. Defaults to the app tables' map. */
  columnLabels?: Record<string, string>;
  /** Ordering source, for a table that keeps its column order in its own store. */
  ordering?: TableColumnOrderingSource;
}

/**
 * "Display" section of a column's three dot menu: hide this column, or toggle any of the table's
 * columns from a submenu listing every possible column for that table.
 *
 * Drop-in for any table: give it a table id registered in `/store/table-columns-adjust`, and
 * optionally that table's own label map and ordering source.
 */
export default function FormattedTableHeadMenuDisplayOption({
  onAction,
  tableId,
  columnId,
  columnLabels = SEARCH_TABLE_COLUMN_TEXT,
  ordering,
}: Props) {
  // Listed in the table's current column order, so the menu matches the table left to right.
  const orderedColumns = useOrderedTableColumns(tableId, ordering);
  const { hideColumn, toggleColumnDisplay, showAllColumns, hideAllColumns, isColumnShown, isColumnHideable, canShowAll, canHideAll } =
    useTableColumnDisplayToggle(tableId, ordering);

  const handleHideColumn = () => {
    hideColumn(columnId);
    onAction();
  };

  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel className="text-foreground/50">Display</DropdownMenuLabel>
      { /* The first column of the table can never be hidden, so it is not offered the option. */ }
      { isColumnHideable(columnId) ?
        <DropdownMenuItem onClick={ handleHideColumn } className="cursor-pointer">
          <EyeOff className="size-4" />
          Hide Column
        </DropdownMenuItem>
      : null }
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="cursor-pointer">
          <Columns3 className="size-4" />
          Show / Hide Columns
        </DropdownMenuSubTrigger>
        { /* No `side` prop on purpose: Radix picks the side with room (right, flipping left near
             the viewport edge) instead of us hard coding one. */ }
        <DropdownMenuSubContent className="max-h-80 min-w-56 overflow-x-hidden overflow-y-auto">
          { orderedColumns.map((menuColumnId: TableColumnId) => {
            const isShown: boolean = isColumnShown(menuColumnId);

            return (
              <DropdownMenuCheckboxItem
                key={ menuColumnId }
                checked={ isShown }
                disabled={ isShown && !isColumnHideable(menuColumnId) }
                // Keep the menu open so several columns can be toggled in one go.
                onSelect={ (event: Event) => event.preventDefault() }
                onCheckedChange={ () => toggleColumnDisplay(menuColumnId) }
                className="cursor-pointer"
              >
                { columnLabels[menuColumnId] ?? menuColumnId }
              </DropdownMenuCheckboxItem>
            );
          }) }

          <DropdownMenuSeparator />
          { /* Bulk actions. "Hide All" leaves the first column standing, it is never hideable. */ }
          <DropdownMenuItem
            onSelect={ (event: Event) => event.preventDefault() }
            onClick={ hideAllColumns }
            disabled={ !canHideAll }
            className="cursor-pointer"
          >
            <EyeOff className="size-4" />
            Hide All
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={ (event: Event) => event.preventDefault() }
            onClick={ showAllColumns }
            disabled={ !canShowAll }
            className="cursor-pointer"
          >
            <Eye className="size-4" />
            Show All
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  );
}

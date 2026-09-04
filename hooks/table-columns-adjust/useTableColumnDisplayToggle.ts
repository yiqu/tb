'use client';

import { useCallback } from 'react';

import { TableId, useColumnOrdinalObject, useTableColumnsActions } from '@/store/subscriptions/table.store';
import { TableColumnId } from '@/store/table-columns-adjust/table-column-adjuster.types';
import { getOrdinalsWithColumnLast } from '@/store/table-columns-adjust/table-column-adjuster.utils';
import { useTableColumnAdjusterActions } from '@/store/table-columns-adjust/table-column-adjuster.store';

import useTableColumnVisibility from './useTableColumnVisibility';

/**
 * Show/hide actions for a table's columns, with the ordering side effect applied.
 *
 * Showing a column also moves it to the last position of the table's ordinal ordering, so a column
 * brought back from the hidden list re-enters the table at the end rather than popping back into
 * the middle of an ordering the user has since rearranged. Tables without a persisted ordering
 * (e.g. the search table) simply keep their hard coded order — the reorder call is a no-op there.
 *
 * @param tableId - Which table's columns are being toggled.
 * @returns `showColumn`, `hideColumn`, `toggleColumnDisplay` plus the visibility state the menu
 *          needs (`isColumnShown`, `canHideColumn`).
 */
export default function useTableColumnDisplayToggle<TTableId extends TableId>(tableId: TTableId) {
  const { isColumnShown, canHideColumn } = useTableColumnVisibility(tableId);
  const { setColumnDisplay } = useTableColumnAdjusterActions();
  const { reorderColumns } = useTableColumnsActions();
  const columnsOrderedByOrdinal = useColumnOrdinalObject(tableId);

  const showColumn = useCallback(
    (columnId: TableColumnId<TTableId>) => {
      setColumnDisplay(tableId, columnId, true);
      reorderColumns(getOrdinalsWithColumnLast(columnsOrderedByOrdinal, columnId), tableId);
    },
    [tableId, columnsOrderedByOrdinal, setColumnDisplay, reorderColumns],
  );

  const hideColumn = useCallback(
    (columnId: TableColumnId<TTableId>) => {
      // Never hide the last remaining column: the header menu would go with it.
      if (!canHideColumn) {
        return;
      }
      setColumnDisplay(tableId, columnId, false);
    },
    [tableId, canHideColumn, setColumnDisplay],
  );

  const toggleColumnDisplay = useCallback(
    (columnId: TableColumnId<TTableId>) => {
      if (isColumnShown(columnId)) {
        hideColumn(columnId);
        return;
      }
      showColumn(columnId);
    },
    [isColumnShown, hideColumn, showColumn],
  );

  return {
    showColumn,
    hideColumn,
    toggleColumnDisplay,
    isColumnShown,
    canHideColumn,
  };
}

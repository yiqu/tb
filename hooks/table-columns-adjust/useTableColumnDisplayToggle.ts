'use client';

import { useCallback } from 'react';

import { TableId } from '@/store/subscriptions/table.store';
import { TableColumnId } from '@/store/table-columns-adjust/table-column-adjuster.types';
import { useTableColumnAdjusterActions } from '@/store/table-columns-adjust/table-column-adjuster.store';

import useTableColumnVisibility from './useTableColumnVisibility';

/**
 * Show/hide actions for a table's columns.
 *
 * Hiding a column leaves its position in the table's ordering untouched, so showing it again drops
 * it straight back where it was rather than moving it around.
 *
 * @param tableId - Which table's columns are being toggled.
 * @returns `showColumn`, `hideColumn`, `toggleColumnDisplay` plus the visibility state the menu
 *          needs (`isColumnShown`, `canHideColumn`).
 */
export default function useTableColumnDisplayToggle<TTableId extends TableId>(tableId: TTableId) {
  const { isColumnShown, canHideColumn } = useTableColumnVisibility(tableId);
  const { setColumnDisplay } = useTableColumnAdjusterActions();

  const showColumn = useCallback(
    (columnId: TableColumnId<TTableId>) => {
      setColumnDisplay(tableId, columnId, true);
    },
    [tableId, setColumnDisplay],
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

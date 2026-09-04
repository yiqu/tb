'use client';

import { useCallback } from 'react';

import { TableId } from '@/store/subscriptions/table.store';
import { TableColumnId, TableColumnOrderingSource } from '@/store/table-columns-adjust/table-column-adjuster.types';
import { useTableColumnAdjusterActions } from '@/store/table-columns-adjust/table-column-adjuster.store';

import useTableColumnVisibility from './useTableColumnVisibility';
import useOrderedVisibleTableColumns from './useOrderedVisibleTableColumns';

/**
 * Show/hide actions for a table's columns.
 *
 * Hiding a column leaves its position in the table's ordering untouched, so showing it again drops
 * it straight back where it was rather than moving it around.
 *
 * The table's first (left-most) column can never be hidden. Since the last remaining column is by
 * definition also the first one, that single rule guarantees a table always keeps at least one
 * column — and with it the header menu, which is the only way to bring hidden columns back.
 *
 * @param tableId - Which table's columns are being toggled.
 * @param ordering - Optional ordering source, for a table that keeps its order in its own store.
 * @returns `showColumn`, `hideColumn`, `toggleColumnDisplay` plus the state the menu needs
 *          (`isColumnShown`, `isColumnHideable`).
 */
export default function useTableColumnDisplayToggle<TTableId extends TableId>(
  tableId: TTableId,
  ordering?: TableColumnOrderingSource,
) {
  const { visibleColumns, isColumnShown } = useTableColumnVisibility(tableId);
  const { setColumnDisplay } = useTableColumnAdjusterActions();
  const orderedVisibleColumns = useOrderedVisibleTableColumns(tableId, ordering);

  const firstVisibleColumnId: string | undefined = orderedVisibleColumns[0];

  /** A column can be hidden unless it is the table's first column (or the only one left). */
  const isColumnHideable = useCallback(
    (columnId: TableColumnId<TTableId>) => {
      return visibleColumns.length > 1 && columnId !== firstVisibleColumnId;
    },
    [visibleColumns, firstVisibleColumnId],
  );

  const showColumn = useCallback(
    (columnId: TableColumnId<TTableId>) => {
      setColumnDisplay(tableId, columnId, true);
    },
    [tableId, setColumnDisplay],
  );

  const hideColumn = useCallback(
    (columnId: TableColumnId<TTableId>) => {
      if (!isColumnHideable(columnId)) {
        return;
      }
      setColumnDisplay(tableId, columnId, false);
    },
    [tableId, isColumnHideable, setColumnDisplay],
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
    isColumnHideable,
  };
}

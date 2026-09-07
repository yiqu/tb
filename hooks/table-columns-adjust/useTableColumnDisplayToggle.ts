'use client';

import { useCallback } from 'react';

import { TableId } from '@/store/subscriptions/table.store';
import { TableColumnId, TableColumnOrderingSource } from '@/store/table-columns-adjust/table-column-adjuster.types';
import { useTableColumnAdjusterActions } from '@/store/table-columns-adjust/table-column-adjuster.store';
import {
  getSingleColumnShownConfiguration,
  getDefaultTableColumnDisplayConfiguration,
} from '@/store/table-columns-adjust/table-column-adjuster.utils';

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
 * @returns `showColumn`, `hideColumn`, `toggleColumnDisplay`, the bulk `showAllColumns` /
 *          `hideAllColumns`, plus the state the menu needs (`isColumnShown`, `isColumnHideable`,
 *          `canShowAll`, `canHideAll`).
 */
export default function useTableColumnDisplayToggle<TTableId extends TableId>(
  tableId: TTableId,
  ordering?: TableColumnOrderingSource,
) {
  const { visibleColumns, hiddenColumns, isColumnShown } = useTableColumnVisibility(tableId);
  const { setColumnDisplay, setTableColumnsDisplay } = useTableColumnAdjusterActions();
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

  /** Shows every column of the table. */
  const showAllColumns = useCallback(() => {
    setTableColumnsDisplay(tableId, getDefaultTableColumnDisplayConfiguration(tableId));
  }, [tableId, setTableColumnsDisplay]);

  /** Hides every column except the first one, which is never hideable. */
  const hideAllColumns = useCallback(() => {
    if (!firstVisibleColumnId) {
      return;
    }
    setTableColumnsDisplay(tableId, getSingleColumnShownConfiguration(tableId, firstVisibleColumnId as TableColumnId<TTableId>));
  }, [tableId, firstVisibleColumnId, setTableColumnsDisplay]);

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
    showAllColumns,
    hideAllColumns,
    isColumnShown,
    isColumnHideable,
    /** `false` when every column is already shown. */
    canShowAll: hiddenColumns.length > 0,
    /** `false` when only the unhideable first column is left. */
    canHideAll: visibleColumns.length > 1,
  };
}

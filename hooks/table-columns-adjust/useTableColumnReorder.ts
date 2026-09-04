'use client';

import { useCallback } from 'react';

import { TableId, useColumnOrdinalObject, useTableColumnsActions } from '@/store/subscriptions/table.store';
import { getColumnsSortedByOrdinal, getOrdinalsForOrderedColumns } from '@/store/table-columns-adjust/table-column-adjuster.utils';

import useTableColumnVisibility from './useTableColumnVisibility';

/**
 * Persists a drag and drop reorder of the columns a table is currently showing.
 *
 * Drag and drop only ever sees the visible columns, so writing their indexes straight back as
 * ordinals would collide with the ordinals still held by hidden columns. The hidden columns are
 * therefore appended (in their existing relative order) after the reordered visible ones before
 * the whole list is re-indexed.
 *
 * @param tableId - Which table was reordered.
 * @returns `reorderVisibleColumns`, taking the visible columns in their new left-to-right order.
 */
export default function useTableColumnReorder(tableId: TableId) {
  const { hiddenColumns } = useTableColumnVisibility(tableId);
  const { reorderColumns } = useTableColumnsActions();
  const columnsOrderedByOrdinal = useColumnOrdinalObject(tableId);

  const reorderVisibleColumns = useCallback(
    (reorderedVisibleColumns: readonly string[]) => {
      const hiddenColumnsSorted: string[] = getColumnsSortedByOrdinal(hiddenColumns, columnsOrderedByOrdinal);
      reorderColumns(getOrdinalsForOrderedColumns([...reorderedVisibleColumns, ...hiddenColumnsSorted]), tableId);
    },
    [tableId, hiddenColumns, columnsOrderedByOrdinal, reorderColumns],
  );

  return { reorderVisibleColumns };
}

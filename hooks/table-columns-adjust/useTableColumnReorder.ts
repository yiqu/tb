'use client';

import { useCallback } from 'react';

import { TableId, useColumnOrdinalObject, useTableColumnsActions } from '@/store/subscriptions/table.store';
import { getOrdinalsAfterVisibleReorder } from '@/store/table-columns-adjust/table-column-adjuster.utils';

/**
 * Persists a drag and drop reorder of the columns a table is currently showing.
 *
 * Drag and drop only ever sees the visible columns, so writing their indexes straight back as
 * ordinals would collide with the ordinals still held by hidden columns. The reordered visible
 * columns are therefore dropped back into the slots they already occupied in the full ordering,
 * which leaves every hidden column exactly where it was.
 *
 * @param tableId - Which table was reordered.
 * @returns `reorderVisibleColumns`, taking the visible columns in their new left-to-right order.
 */
export default function useTableColumnReorder(tableId: TableId) {
  const { reorderColumns } = useTableColumnsActions();
  const columnsOrderedByOrdinal = useColumnOrdinalObject(tableId);

  const reorderVisibleColumns = useCallback(
    (reorderedVisibleColumns: readonly string[]) => {
      reorderColumns(getOrdinalsAfterVisibleReorder(columnsOrderedByOrdinal, reorderedVisibleColumns), tableId);
    },
    [tableId, columnsOrderedByOrdinal, reorderColumns],
  );

  return { reorderVisibleColumns };
}

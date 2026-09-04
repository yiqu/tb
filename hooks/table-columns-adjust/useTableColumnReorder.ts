'use client';

import { useCallback } from 'react';

import { TableId } from '@/store/subscriptions/table.store';
import { TableColumnOrderingSource } from '@/store/table-columns-adjust/table-column-adjuster.types';
import { getOrdinalsAfterVisibleReorder } from '@/store/table-columns-adjust/table-column-adjuster.utils';

import useTableColumnOrdering from './useTableColumnOrdering';

/**
 * Persists a drag and drop reorder of the columns a table is currently showing.
 *
 * Drag and drop only ever sees the visible columns, so writing their indexes straight back as
 * ordinals would collide with the ordinals still held by hidden columns. The reordered visible
 * columns are therefore dropped back into the slots they already occupied in the full ordering,
 * which leaves every hidden column exactly where it was.
 *
 * @param tableId - Which table was reordered.
 * @param ordering - Optional ordering source, for a table that keeps its order in its own store.
 * @returns `reorderVisibleColumns`, taking the visible columns in their new left-to-right order.
 */
export default function useTableColumnReorder(tableId: TableId, ordering?: TableColumnOrderingSource) {
  const { ordinals, reorderColumns } = useTableColumnOrdering(tableId, ordering);

  const reorderVisibleColumns = useCallback(
    (reorderedVisibleColumns: readonly string[]) => {
      reorderColumns(getOrdinalsAfterVisibleReorder(ordinals, reorderedVisibleColumns));
    },
    [ordinals, reorderColumns],
  );

  return { reorderVisibleColumns };
}

'use client';

import { useMemo, useCallback } from 'react';

import { TableId, useColumnOrdinalObject, useTableColumnsActions } from '@/store/subscriptions/table.store';
import { TableColumnOrderingSource } from '@/store/table-columns-adjust/table-column-adjuster.types';

/**
 * Resolves where a table's column order is read from and written to.
 *
 * Defaults to the app's table store (`table.store.ts`), which is what the subscriptions, bills and
 * search tables use. A table that owns its ordering in its own zustand store passes that store's
 * source in instead, and every ordering aware hook follows it — no shared store has to grow a field
 * for the new table.
 *
 * @param tableId - Which table's order to read from the app store, when no source is given.
 * @param ordering - Optional source to use instead. Memoize it, it feeds other hooks' deps.
 */
export default function useTableColumnOrdering(tableId: TableId, ordering?: TableColumnOrderingSource): TableColumnOrderingSource {
  const columnsOrderedByOrdinal = useColumnOrdinalObject(tableId);
  const { reorderColumns } = useTableColumnsActions();

  const reorderAppColumns = useCallback(
    (ordinals: Record<string, number>) => {
      reorderColumns(ordinals, tableId);
    },
    [tableId, reorderColumns],
  );

  return useMemo(
    () => ordering ?? { ordinals: columnsOrderedByOrdinal, reorderColumns: reorderAppColumns },
    [ordering, columnsOrderedByOrdinal, reorderAppColumns],
  );
}

'use client';

import { useMemo } from 'react';

import { TableId } from '@/store/subscriptions/table.store';
import { TableColumnId, TableColumnOrderingSource } from '@/store/table-columns-adjust/table-column-adjuster.types';
import { getDefaultTableColumns, getColumnsSortedByOrdinal } from '@/store/table-columns-adjust/table-column-adjuster.utils';

import useTableColumnOrdering from './useTableColumnOrdering';

/**
 * Every one of a table's columns — shown and hidden alike — in the user's current column order.
 *
 * Hidden columns keep their ordinal slot, so this is the order the columns appear in (or would
 * appear in, once shown). Used by the show/hide menu so its list matches the table left to right
 * instead of the hard coded default order. Tables without a persisted ordering (e.g. the search
 * table) fall back to that hard coded order.
 *
 * @param tableId - Which table's columns to order.
 * @param ordering - Optional ordering source, for a table that keeps its order in its own store.
 * @returns All of the table's column ids sorted by their persisted ordinal.
 */
export default function useOrderedTableColumns<TTableId extends TableId>(
  tableId: TTableId,
  ordering?: TableColumnOrderingSource,
): TableColumnId<TTableId>[] {
  const { ordinals } = useTableColumnOrdering(tableId, ordering);

  return useMemo(() => getColumnsSortedByOrdinal(getDefaultTableColumns(tableId), ordinals), [tableId, ordinals]);
}

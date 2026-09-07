'use client';

import { useMemo } from 'react';

import { TableId } from '@/store/subscriptions/table.store';
import { TableColumnOrderingSource } from '@/store/table-columns-adjust/table-column-adjuster.types';
import { getColumnsSortedByOrdinal } from '@/store/table-columns-adjust/table-column-adjuster.utils';

import useTableColumnOrdering from './useTableColumnOrdering';
import useTableColumnVisibility from './useTableColumnVisibility';

/**
 * The columns a table should actually render: shown columns only, in the user's persisted order.
 *
 * This is the drop-in replacement for the old `columnsSorted` computation that every table used to
 * do inline off the hard coded column list — headers and rows both read from this so they can never
 * drift apart.
 *
 * @param tableId - Which table's columns to resolve.
 * @param ordering - Optional ordering source, for a table that keeps its order in its own store.
 * @returns The visible column ids sorted by their persisted ordinal.
 */
export default function useOrderedVisibleTableColumns(tableId: TableId, ordering?: TableColumnOrderingSource): string[] {
  const { visibleColumns } = useTableColumnVisibility(tableId);
  const { ordinals } = useTableColumnOrdering(tableId, ordering);

  return useMemo(() => getColumnsSortedByOrdinal(visibleColumns, ordinals), [visibleColumns, ordinals]);
}

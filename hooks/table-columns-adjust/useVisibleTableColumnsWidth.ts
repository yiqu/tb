'use client';

import { TableId, useTotalColumnsWidth } from '@/store/subscriptions/table.store';

import useTableColumnVisibility from './useTableColumnVisibility';

/**
 * Total pixel width of the columns a table is currently rendering.
 *
 * Hidden columns must not count towards the table's width, otherwise the table keeps reserving
 * space for columns that are no longer painted.
 *
 * @param tableId - Which table to measure.
 * @returns The summed width (px) of the visible columns only.
 */
export default function useVisibleTableColumnsWidth(tableId: TableId): number {
  const { visibleColumns } = useTableColumnVisibility(tableId);

  return useTotalColumnsWidth(tableId, visibleColumns);
}

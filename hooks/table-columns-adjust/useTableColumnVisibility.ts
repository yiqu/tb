'use client';

import { useMemo, useCallback } from 'react';

import { TableId } from '@/store/subscriptions/table.store';
import { TableColumnId } from '@/store/table-columns-adjust/table-column-adjuster.types';
import { useTableColumnDisplayConfiguration } from '@/store/table-columns-adjust/table-column-adjuster.store';
import {
  getIsColumnShown,
  getDefaultTableColumns,
  getHiddenTableColumns,
  getVisibleTableColumns,
} from '@/store/table-columns-adjust/table-column-adjuster.utils';

/**
 * Resolves which columns a table should render, from the table's hard coded column list plus the
 * persisted show/hide configuration for that table id.
 *
 * The decision is always made the same way: walk `getDefaultTableColumns(tableId)` and ask the
 * table's `TableColumnDisplayConfiguration` whether each column is shown (missing keys = shown).
 *
 * @param tableId - Which table's columns to resolve.
 * @returns
 * - `allColumns`     – every possible column for the table, in its hard coded order (menu source).
 * - `visibleColumns` – the shown columns, in hard coded order (ordering is applied separately).
 * - `hiddenColumns`  – the hidden columns, in hard coded order.
 * - `isColumnShown`  – predicate for a single column id.
 * - `canHideColumn`  – `false` when only one column is left, so a table can never be emptied out
 *                      (the header menu is the only way to bring columns back).
 */
export default function useTableColumnVisibility<TTableId extends TableId>(tableId: TTableId) {
  const configuration = useTableColumnDisplayConfiguration(tableId);

  const allColumns = useMemo(() => getDefaultTableColumns(tableId), [tableId]);
  const visibleColumns = useMemo(() => getVisibleTableColumns(tableId, configuration), [tableId, configuration]);
  const hiddenColumns = useMemo(() => getHiddenTableColumns(tableId, configuration), [tableId, configuration]);

  const isColumnShown = useCallback(
    (columnId: TableColumnId<TTableId>) => {
      return getIsColumnShown(configuration, columnId);
    },
    [configuration],
  );

  return {
    allColumns,
    visibleColumns,
    hiddenColumns,
    isColumnShown,
    canHideColumn: visibleColumns.length > 1,
  };
}

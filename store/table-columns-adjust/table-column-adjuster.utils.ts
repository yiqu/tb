import { TEST_TABLE_COLUMNS } from '@/store/test-table/test-table.columns';
import { TableId, BILLS_TABLE_COLUMNS, SEARCH_TABLE_COLUMNS, SUBSCRIPTIONS_TABLE_COLUMNS } from '@/store/subscriptions/table.store';

import {
  TableColumnId,
  TableColumnIdsByTableId,
  TableColumnDisplayConfiguration,
  TableColumnDisplayConfigurations,
} from './table-column-adjuster.types';

/**
 * Every table's hard coded (default = ALL possible) column list, keyed by table id.
 *
 * Registering a table here — plus one line in `TableColumnIdsByTableId` — is all the feature needs
 * to know about it; the table keeps its own store for whatever state it owns.
 */
const TABLE_COLUMNS_BY_TABLE_ID: { [TTableId in TableId]: readonly TableColumnIdsByTableId[TTableId][] } = {
  subscriptions: SUBSCRIPTIONS_TABLE_COLUMNS,
  bills: BILLS_TABLE_COLUMNS,
  search: SEARCH_TABLE_COLUMNS,
  test: TEST_TABLE_COLUMNS,
};

/**
 * The default (ALL possible) column ids for a table, looked up by its table id.
 *
 * This is the single source of truth the whole show/hide feature reads from: the menu lists these,
 * and visibility is decided by walking this list and checking the table's display configuration.
 */
export function getDefaultTableColumns<TTableId extends TableId>(tableId: TTableId): readonly TableColumnId<TTableId>[] {
  return TABLE_COLUMNS_BY_TABLE_ID[tableId];
}

/** A fresh configuration for one table with every column shown. */
export function getDefaultTableColumnDisplayConfiguration<TTableId extends TableId>(
  tableId: TTableId,
): TableColumnDisplayConfiguration<TTableId> {
  const configuration = {} as TableColumnDisplayConfiguration<TTableId>;
  for (const columnId of getDefaultTableColumns(tableId)) {
    configuration[columnId] = true;
  }
  return configuration;
}

/** A fresh configuration for every table, used as the store's initial state. */
export function getDefaultTableColumnDisplayConfigurations(): TableColumnDisplayConfigurations {
  return {
    subscriptions: getDefaultTableColumnDisplayConfiguration('subscriptions'),
    bills: getDefaultTableColumnDisplayConfiguration('bills'),
    search: getDefaultTableColumnDisplayConfiguration('search'),
    test: getDefaultTableColumnDisplayConfiguration('test'),
  };
}

/**
 * Reconciles a persisted configuration against the hard coded column list for a table.
 *
 * Columns added since the value was persisted default to shown, columns that no longer exist are
 * dropped, and a configuration that would hide every column falls back to the defaults so the
 * header menu (the only way back) can never be hidden away.
 */
export function normalizeTableColumnDisplayConfiguration<TTableId extends TableId>(
  tableId: TTableId,
  persistedConfiguration: unknown,
): TableColumnDisplayConfiguration<TTableId> {
  const defaultConfiguration = getDefaultTableColumnDisplayConfiguration(tableId);

  if (!persistedConfiguration || typeof persistedConfiguration !== 'object') {
    return defaultConfiguration;
  }

  const persisted = persistedConfiguration as Record<string, unknown>;
  const normalized = {} as TableColumnDisplayConfiguration<TTableId>;
  let shownCount = 0;

  for (const columnId of getDefaultTableColumns(tableId)) {
    const isShown = typeof persisted[columnId] === 'boolean' ? (persisted[columnId] as boolean) : true;
    normalized[columnId] = isShown;
    if (isShown) {
      shownCount += 1;
    }
  }

  return shownCount > 0 ? normalized : defaultConfiguration;
}

/** Reconciles the whole persisted store payload, one table at a time. */
export function normalizeTableColumnDisplayConfigurations(persistedConfigurations: unknown): TableColumnDisplayConfigurations {
  const persisted = (persistedConfigurations ?? {}) as Record<string, unknown>;

  return {
    subscriptions: normalizeTableColumnDisplayConfiguration('subscriptions', persisted.subscriptions),
    bills: normalizeTableColumnDisplayConfiguration('bills', persisted.bills),
    search: normalizeTableColumnDisplayConfiguration('search', persisted.search),
    test: normalizeTableColumnDisplayConfiguration('test', persisted.test),
  };
}

/** `true` when the column is not explicitly hidden. Unknown columns default to shown. */
export function getIsColumnShown<TTableId extends TableId>(
  configuration: TableColumnDisplayConfiguration<TTableId> | undefined,
  columnId: TableColumnId<TTableId>,
): boolean {
  return configuration?.[columnId] !== false;
}

/** The table's hard coded columns filtered down to the ones toggled shown (default order). */
export function getVisibleTableColumns<TTableId extends TableId>(
  tableId: TTableId,
  configuration: TableColumnDisplayConfiguration<TTableId> | undefined,
): TableColumnId<TTableId>[] {
  return getDefaultTableColumns(tableId).filter((columnId) => getIsColumnShown(configuration, columnId));
}

/** The table's hard coded columns filtered down to the ones toggled hidden (default order). */
export function getHiddenTableColumns<TTableId extends TableId>(
  tableId: TTableId,
  configuration: TableColumnDisplayConfiguration<TTableId> | undefined,
): TableColumnId<TTableId>[] {
  return getDefaultTableColumns(tableId).filter((columnId) => !getIsColumnShown(configuration, columnId));
}

/** Sorts column ids by their persisted ordinal. Columns without an ordinal keep their relative order. */
export function getColumnsSortedByOrdinal<TColumnId extends string>(
  columnIds: readonly TColumnId[],
  ordinals: Readonly<Record<string, number>>,
): TColumnId[] {
  return [...columnIds].toSorted((a: TColumnId, b: TColumnId) => (ordinals[a] ?? 0) - (ordinals[b] ?? 0));
}

/** Turns an ordered column list into the `{ columnId: ordinal }` object the table store persists. */
export function getOrdinalsForOrderedColumns(orderedColumnIds: readonly string[]): Record<string, number> {
  const ordinals: Record<string, number> = {};
  for (const [index, columnId] of orderedColumnIds.entries()) {
    ordinals[columnId] = index;
  }
  return ordinals;
}

/**
 * Applies a reorder of the visible columns while leaving hidden columns where they are.
 *
 * Drag and drop only ever sees the visible columns, so their new indexes cannot be written back as
 * ordinals directly — that would collide with the ordinals still held by hidden columns. Instead the
 * reordered visible columns are dropped back into the slots they already occupied in the full
 * ordering, so a hidden column keeps its place and returns to it when it is shown again.
 *
 * @param ordinals - The table's current `{ columnId: ordinal }` object (all columns, shown or not).
 * @param reorderedVisibleColumns - The visible columns in their new left-to-right order.
 */
export function getOrdinalsAfterVisibleReorder(
  ordinals: Readonly<Record<string, number>>,
  reorderedVisibleColumns: readonly string[],
): Record<string, number> {
  const visibleColumnIds = new Set<string>(reorderedVisibleColumns);
  const orderedColumnIds: string[] = getColumnsSortedByOrdinal(Object.keys(ordinals), ordinals);

  let nextVisibleIndex = 0;
  const nextOrderedColumnIds: string[] = orderedColumnIds.map((columnId: string) => {
    if (!visibleColumnIds.has(columnId)) {
      return columnId;
    }
    const nextColumnId: string = reorderedVisibleColumns[nextVisibleIndex] ?? columnId;
    nextVisibleIndex += 1;
    return nextColumnId;
  });

  return getOrdinalsForOrderedColumns(nextOrderedColumnIds);
}

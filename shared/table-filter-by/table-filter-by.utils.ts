import { AppColumnId } from '@/store/subscriptions/table.store';

/**
 * How one column's "Filter By" menu item behaves.
 *
 * Every field is optional — an empty object is a perfectly good entry and means "filterable, with
 * the defaults". The search param key defaults to the column id, which is what we want almost
 * everywhere; `searchParamKey` is the escape hatch for a column id that is already taken by another
 * search param on the same page.
 */
export interface TableFilterByColumnConfig {
  /**
   * Search param the filter writes to. Defaults to the column id.
   *
   * Only set this when the bare column id would collide with a different search param on the same
   * page, and name it `tableId__columnId` when you do — `frequency` is the one such case today,
   * see below.
   */
  searchParamKey?: string;
  /** Placeholder for the filter input. Falls back to a generic one. */
  placeholder?: string;
  /** Helper text under the input, for a column whose filter accepts more than plain text. */
  hint?: string;
}

/**
 * Every column in the app that gets a "Filter By" item in its header menu, keyed by column id.
 *
 * A column id that is absent from this object has no "Filter By" item — that is the whole test, so
 * adding the filter to a new column is one entry here and a matching read on the server.
 *
 * Column ids are shared across tables on purpose (`cost` is filterable in both the bills and the
 * subscriptions table). They never render on the same page, so one entry covers both.
 */
export const TABLE_FILTER_BY_COLUMNS: Partial<Record<AppColumnId, TableFilterByColumnConfig>> = {
  cost: {
    placeholder: 'e.g. 10, >10, <=99.99',
    hint: 'Supports >, <, >= and <=',
  },
  /**
   * `frequency` the search param is already the bills page's frequency multi select, which reads a
   * comma separated list of exact values. This free text filter is a different thing (a `contains`
   * match), so it keeps the table prefixed key instead of fighting over that one.
   */
  frequency: {
    searchParamKey: 'bills__frequency',
    placeholder: 'e.g. monthly',
  },
  subscription: {
    placeholder: 'Subscription name',
  },
  name: {
    placeholder: 'Subscription name',
  },
  billCycleDuration: {
    placeholder: 'e.g. monthly',
  },
  description: {
    placeholder: 'Description text',
  },
  url: {
    placeholder: 'URL text',
  },
};

/** Default placeholder for a filterable column that does not name its own. */
export const TABLE_FILTER_BY_DEFAULT_PLACEHOLDER = 'Enter filter text...';

/**
 * Whether a column's header menu shows the "Filter By" item.
 *
 * @param columnId - The column the header menu belongs to.
 */
export function getIsColumnFilterable(columnId: AppColumnId): boolean {
  return !!TABLE_FILTER_BY_COLUMNS[columnId];
}

/**
 * The config for a filterable column, or `undefined` when the column is not filterable.
 *
 * @param columnId - The column the header menu belongs to.
 */
export function getTableFilterByColumnConfig(columnId: AppColumnId): TableFilterByColumnConfig | undefined {
  return TABLE_FILTER_BY_COLUMNS[columnId];
}

/**
 * The search param a column's filter reads and writes: the column id, unless the column names its
 * own `tableId__columnId` key to get out of the way of another param.
 *
 * This is the only place the key is derived. Change the shape here (add a table prefix back, switch
 * to a single packed param) and every consumer follows.
 *
 * @param columnId - The column the header menu belongs to.
 */
export function getTableFilterByParamKey(columnId: AppColumnId): string {
  return TABLE_FILTER_BY_COLUMNS[columnId]?.searchParamKey ?? columnId;
}

/**
 * The filter input's placeholder for a column.
 *
 * @param columnId - The column the header menu belongs to.
 */
export function getTableFilterByPlaceholder(columnId: AppColumnId): string {
  return TABLE_FILTER_BY_COLUMNS[columnId]?.placeholder ?? TABLE_FILTER_BY_DEFAULT_PLACEHOLDER;
}

/**
 * Search param keys for every filterable column of a table, for a consumer that clears them as a
 * group.
 *
 * @param columnIds - The table's column ids.
 */
export function getTableFilterByParamKeys(columnIds: readonly AppColumnId[]): string[] {
  return columnIds.filter((columnId) => getIsColumnFilterable(columnId)).map((columnId) => getTableFilterByParamKey(columnId));
}

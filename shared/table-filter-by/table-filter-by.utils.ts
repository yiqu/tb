import { TableId, AppColumnId } from '@/store/subscriptions/table.store';

/** Joins the table id and the column id into a filter's search param key. */
export const TABLE_FILTER_BY_PARAM_SEPARATOR = '__';

/**
 * How one column's "Filter By" menu item behaves.
 *
 * Every field is optional — an empty object is a perfectly good entry and means "filterable, with
 * the defaults". The search param key defaults to `tableId__columnId`; `searchParamKey` is the
 * escape hatch for a column that needs some other key.
 */
export interface TableFilterByColumnConfig {
  /**
   * Search param the filter writes to, overriding the `tableId__columnId` default.
   *
   * Only set this when a column needs a key the default cannot produce — one shared by two tables,
   * say. Nothing needs it today; the table prefix already keeps every filter out of the way of the
   * other params on its page.
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
 * One entry covers that column in every table that has it: `cost` is filterable in both the bills
 * and the subscriptions table, and the table prefix keeps their search params apart
 * (`bills__cost`, `subscriptions__cost`).
 */
export const TABLE_FILTER_BY_COLUMNS: Partial<Record<AppColumnId, TableFilterByColumnConfig>> = {
  cost: {
    placeholder: 'e.g. 10, >10, <=99.99',
    hint: 'Supports >, <, >= and <=',
  },
  /**
   * Free text, and comma separated to match more than one: "year,month" matches yearly and monthly.
   * `bills.server.ts` does the splitting — keep the two in step.
   */
  frequency: {
    placeholder: 'e.g. month, or year,month',
    hint: 'Comma separate to match more than one',
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
 * The search param a column's filter reads and writes: `tableId__columnId`, unless the column names
 * its own key.
 *
 * The table prefix is what keeps a filter clear of the other params on its page — `bills__frequency`
 * next to the bills page's own `frequency` multi select — and keeps the same column filterable in
 * two tables without them sharing one value.
 *
 * This is the only place the key is derived. Change the shape here and every consumer follows.
 *
 * @param tableId - The table the column is rendered in.
 * @param columnId - The column the header menu belongs to.
 */
export function getTableFilterByParamKey(tableId: TableId, columnId: AppColumnId): string {
  return TABLE_FILTER_BY_COLUMNS[columnId]?.searchParamKey ?? `${tableId}${TABLE_FILTER_BY_PARAM_SEPARATOR}${columnId}`;
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
 * @param tableId - The table the columns are rendered in.
 * @param columnIds - The table's column ids.
 */
export function getTableFilterByParamKeys(tableId: TableId, columnIds: readonly AppColumnId[]): string[] {
  return columnIds.filter((columnId) => getIsColumnFilterable(columnId)).map((columnId) => getTableFilterByParamKey(tableId, columnId));
}

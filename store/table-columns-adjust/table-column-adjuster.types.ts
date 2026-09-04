import { TableId, BILLS_TABLE_COLUMNS, SEARCH_TABLE_COLUMNS, SUBSCRIPTIONS_TABLE_COLUMNS } from '@/store/subscriptions/table.store';

/**
 * Every table id mapped to the union of its hard coded column ids.
 *
 * Adding a new table is a two step change: add the table id to `TableId`, add its hard coded
 * column list here, and every type/helper/hook below picks it up automatically.
 */
export interface TableColumnIdsByTableId {
  subscriptions: (typeof SUBSCRIPTIONS_TABLE_COLUMNS)[number];
  bills: (typeof BILLS_TABLE_COLUMNS)[number];
  search: (typeof SEARCH_TABLE_COLUMNS)[number];
}

/** The column ids that belong to a given table id. Defaults to the union of all app columns. */
export type TableColumnId<TTableId extends TableId = TableId> = TableColumnIdsByTableId[TTableId];

/**
 * Show/hide configuration for a single table: a key/value object where the key is a column id
 * belonging to that table and the value is `true` (shown) or `false` (hidden).
 */
export type TableColumnDisplayConfiguration<TTableId extends TableId = TableId> = Record<TableColumnId<TTableId>, boolean>;

/** One `TableColumnDisplayConfiguration` per table id, which is what the store persists. */
export type TableColumnDisplayConfigurations = {
  [TTableId in TableId]: TableColumnDisplayConfiguration<TTableId>;
};

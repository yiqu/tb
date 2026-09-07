/**
 * The demo table's hard coded column list — the one thing every table has to declare.
 *
 * Kept in its own dependency free file so both the column adjuster registry
 * (`/store/table-columns-adjust`) and this table's own store can read it without an import cycle.
 */
export const TEST_TABLE_COLUMNS = ['project', 'owner', 'status', 'priority', 'updated'] as const;

export type TestTableColumnId = (typeof TEST_TABLE_COLUMNS)[number];

/** Header text for each column, handed to the show/hide menu so it can label its checkboxes. */
export const TEST_TABLE_COLUMN_LABELS: Record<TestTableColumnId, string> = {
  project: 'Project',
  owner: 'Owner',
  status: 'Status',
  priority: 'Priority',
  updated: 'Last Updated',
};

/** Starting width (px) per column. Persisted per column once the user resizes one. */
export const TEST_TABLE_COLUMN_WIDTHS: Record<TestTableColumnId, number> = {
  project: 220,
  owner: 160,
  status: 140,
  priority: 120,
  updated: 160,
};

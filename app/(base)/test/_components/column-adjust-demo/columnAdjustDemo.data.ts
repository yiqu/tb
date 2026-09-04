import { TestTableColumnId } from '@/store/test-table/test-table.columns';

/** A row of the demo table: one value per column id, so cells are a plain lookup. */
export type ColumnAdjustDemoRow = { id: string } & Record<TestTableColumnId, string>;

export const COLUMN_ADJUST_DEMO_ROWS: ColumnAdjustDemoRow[] = [
  { id: '1', project: 'Apollo', owner: 'Dana', status: 'In progress', priority: 'High', updated: 'Mar 2, 2026' },
  { id: '2', project: 'Borealis', owner: 'Sam', status: 'Blocked', priority: 'High', updated: 'Feb 27, 2026' },
  { id: '3', project: 'Cascade', owner: 'Riley', status: 'In review', priority: 'Medium', updated: 'Feb 24, 2026' },
  { id: '4', project: 'Dune', owner: 'Alex', status: 'Done', priority: 'Low', updated: 'Feb 18, 2026' },
  { id: '5', project: 'Everest', owner: 'Jordan', status: 'Not started', priority: 'Medium', updated: 'Feb 11, 2026' },
];

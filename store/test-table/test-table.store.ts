import { useMemo } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { TableColumnOrderingSource } from '@/store/table-columns-adjust/table-column-adjuster.types';

import { TestTableColumnId, TEST_TABLE_COLUMNS, TEST_TABLE_COLUMN_WIDTHS } from './test-table.columns';

interface TestTableColumnsActions {
  setColumnWidth: (_columnId: string, _width: number) => void;
  reorderColumns: (_ordinals: Record<string, number>) => void;
}

interface TestTableColumnsState {
  /** Column width in px, keyed by column id. */
  columnWidths: Record<string, number>;
  /** Left to right position of every column, keyed by column id. */
  columnOrdinals: Record<string, number>;

  actions: TestTableColumnsActions;
}

/**
 * Everything the demo table needs to own for itself: its column widths and its column order.
 *
 * This is the "bring your own store" half of dropping the column adjuster into a new table — the
 * show/hide state lives in the shared adjuster store (keyed by table id), while the ordering and
 * widths a table needs live here, next to the table. Nothing in `/store/subscriptions/table.store.ts`
 * had to grow a field for this table.
 */
const useTestTableColumnsStore = create<TestTableColumnsState>()(
  persist(
    (set) => ({
      columnWidths: { ...TEST_TABLE_COLUMN_WIDTHS },
      columnOrdinals: Object.fromEntries(TEST_TABLE_COLUMNS.map((columnId: TestTableColumnId, index: number) => [columnId, index])),

      actions: {
        setColumnWidth: (columnId, width) => {
          set((state) => ({
            columnWidths: { ...state.columnWidths, [columnId]: width },
          }));
        },
        reorderColumns: (ordinals) => {
          set((state) => ({
            columnOrdinals: { ...state.columnOrdinals, ...ordinals },
          }));
        },
      },
    }),
    {
      name: 'test-table-columns-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        columnWidths: state.columnWidths,
        columnOrdinals: state.columnOrdinals,
      }),
    },
  ),
);

export const useTestTableColumnWidth = (columnId: string): number =>
  useTestTableColumnsStore((state) => state.columnWidths[columnId] ?? 140);

export const useTestTableColumnsActions = (): TestTableColumnsActions => useTestTableColumnsStore((state) => state.actions);

/**
 * The demo table's ordering, in the shape the column adjuster hooks accept.
 *
 * Passing this to `useOrderedVisibleTableColumns` / `useTableColumnReorder` / … is what points those
 * hooks at this store instead of the app's table store.
 */
export const useTestTableColumnOrdering = (): TableColumnOrderingSource => {
  const ordinals = useTestTableColumnsStore((state) => state.columnOrdinals);
  const { reorderColumns } = useTestTableColumnsActions();

  return useMemo(() => ({ ordinals, reorderColumns }), [ordinals, reorderColumns]);
};

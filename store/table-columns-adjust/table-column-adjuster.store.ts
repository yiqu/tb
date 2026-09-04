import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { TableId } from '@/store/subscriptions/table.store';

import { TableColumnId, TableColumnDisplayConfiguration, TableColumnDisplayConfigurations } from './table-column-adjuster.types';
import {
  getIsColumnShown,
  getDefaultTableColumnDisplayConfigurations,
  normalizeTableColumnDisplayConfigurations,
} from './table-column-adjuster.utils';

interface TableColumnAdjusterActions {
  setColumnDisplay: <TTableId extends TableId>(_tableId: TTableId, _columnId: TableColumnId<TTableId>, _isShown: boolean) => void;
  toggleColumnDisplay: <TTableId extends TableId>(_tableId: TTableId, _columnId: TableColumnId<TTableId>) => void;
  /** Replaces a table's whole configuration in one write, for bulk actions like show/hide all. */
  setTableColumnsDisplay: <TTableId extends TableId>(
    _tableId: TTableId,
    _configuration: TableColumnDisplayConfiguration<TTableId>,
  ) => void;
}

interface TableColumnAdjusterState {
  /** One show/hide configuration object per table id, persisted to local storage. */
  columnDisplayConfigurations: TableColumnDisplayConfigurations;

  actions: TableColumnAdjusterActions;
}

/**
 * Show/hide state for table columns, keyed by table id then column id.
 *
 * Deliberately decoupled from `table.store.ts` (widths, ordinals, pinning) so this store — plus the
 * helpers in `table-column-adjuster.utils.ts` and the hooks in `/hooks/table-columns-adjust` — can be
 * dropped into another app that has its own hard coded column lists.
 */
const useTableColumnAdjusterStore = create<TableColumnAdjusterState>()(
  persist(
    (set, get) => ({
      columnDisplayConfigurations: getDefaultTableColumnDisplayConfigurations(),

      actions: {
        setColumnDisplay: (tableId, columnId, isShown) => {
          set((state) => {
            const nextConfiguration = {
              ...state.columnDisplayConfigurations[tableId],
              [columnId]: isShown,
            } as TableColumnDisplayConfiguration;

            return {
              columnDisplayConfigurations: {
                ...state.columnDisplayConfigurations,
                [tableId]: nextConfiguration,
              } as TableColumnDisplayConfigurations,
            };
          });
        },
        toggleColumnDisplay: (tableId, columnId) => {
          const { setColumnDisplay } = get().actions;
          const configuration = get().columnDisplayConfigurations[tableId];
          setColumnDisplay(tableId, columnId, !getIsColumnShown(configuration, columnId));
        },
        setTableColumnsDisplay: (tableId, configuration) => {
          set((state) => ({
            columnDisplayConfigurations: {
              ...state.columnDisplayConfigurations,
              [tableId]: configuration,
            } as TableColumnDisplayConfigurations,
          }));
        },
      },
    }),
    {
      name: 'table-column-adjuster-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        columnDisplayConfigurations: state.columnDisplayConfigurations,
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<Pick<TableColumnAdjusterState, 'columnDisplayConfigurations'>> | undefined;
        return {
          ...currentState,
          columnDisplayConfigurations: normalizeTableColumnDisplayConfigurations(persisted?.columnDisplayConfigurations),
        };
      },
    },
  ),
);

/** The show/hide configuration object for a single table. Stable reference, safe to memoize on. */
export const useTableColumnDisplayConfiguration = <TTableId extends TableId>(tableId: TTableId): TableColumnDisplayConfiguration<TTableId> =>
  useTableColumnAdjusterStore((state) => state.columnDisplayConfigurations[tableId] as TableColumnDisplayConfiguration<TTableId>);

export const useTableColumnAdjusterActions = () => useTableColumnAdjusterStore((state) => state.actions);

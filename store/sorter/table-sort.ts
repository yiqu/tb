import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { SortDirection } from '@/shared/table/table.utils';

export type SortOptions = 'arrival_date' | 'status' | 'user_id';

export interface SortConfig {
  field: SortOptions;
  direction: SortDirection;
}

export const SORT_ORDER_OPTIONS: SortOptions[] = ['arrival_date', 'status', 'user_id'];

export const SortOptionDisplayMap: Record<SortOptions, string> = {
  arrival_date: 'Arrival Date',
  status: 'Status',
  user_id: 'User ID',
};

export const DEFAULT_SORT_OPTION: SortOptions = 'arrival_date'; // this item should always be checked and not removable

export const DEFAULT_SORT_ARRAY: SortConfig[] = [{ field: DEFAULT_SORT_OPTION, direction: 'asc' }];

type TableSortState = {
  currentSort: SortConfig[];

  actions: {
    setCurrentSort: (sort: SortConfig[]) => void;
    clearCurrentSort: () => void;
  };
};

const tableSortStoreBase = create<TableSortState>()(
  persist(
    (set) => ({
      currentSort: DEFAULT_SORT_ARRAY,

      actions: {
        setCurrentSort: (sort: SortConfig[]) => {
          set(() => ({ currentSort: sort }));
        },
        clearCurrentSort: () => {
          set(() => ({ currentSort: DEFAULT_SORT_ARRAY }));
        },
      },
    }),
    {
      name: 'table-sort-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentSort: state.currentSort,
      }),
    },
  ),
);

export const useCurrentSort = () => tableSortStoreBase((state) => state.currentSort);
export const useTableSortActions = () => tableSortStoreBase((state) => state.actions);

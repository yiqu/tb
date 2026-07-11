import { create } from 'zustand';

import { SortDirection } from '@/shared/table/table.utils';

type SortOptions = 'arrival_date' | 'status' | 'user_id';

interface SortConfig {
  field: SortOptions;
  direction: SortDirection;
}

const SORT_ORDER_OPTIONS = ['arrival_date', 'status', 'user_id'];

const SortOptionDisplayMap = {
  arrival_date: 'Arrival Date',
  status: 'Status',
  user_id: 'User ID',
};

const DEFAULT_SORT_OPTION = 'arrival_date'; // this item should always be checked and not removable

const DEFAULT_SORT_ARRAY: SortConfig[] = [{ field: DEFAULT_SORT_OPTION, direction: 'asc' }];

type TableSortState = {
  currentSort: SortConfig[];

  actions: {
    setCurrentSort: (sort: SortConfig[]) => void;
    clearCurrentSort: () => void;
  };
};

const tableSortStoreBase = create<TableSortState>()((set) => ({
  currentSort: DEFAULT_SORT_ARRAY,

  actions: {
    setCurrentSort: (sort: SortConfig[]) => {
      set(() => ({ currentSort: sort }));
    },
    clearCurrentSort: () => {
      set(() => ({ currentSort: DEFAULT_SORT_ARRAY }));
    },
  },
}));

export const useCurrentSort = () => tableSortStoreBase((state) => state.currentSort);
export const useTableSortActions = () => tableSortStoreBase((state) => state.actions);

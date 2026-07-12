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

/**
 * Normalizes a sort array at the store boundary: drops entries whose field is not a known
 * sort option, dedupes by field (first occurrence wins), coerces directions to asc/desc,
 * and guarantees DEFAULT_SORT_OPTION is always present. Caller-provided order is preserved.
 */
export function normalizeSortConfigs(sort: SortConfig[]): SortConfig[] {
  const seenFields = new Set<SortOptions>();
  const validSort: SortConfig[] = [];

  for (const config of sort) {
    if (!config || !SORT_ORDER_OPTIONS.includes(config.field) || seenFields.has(config.field)) {
      continue;
    }
    seenFields.add(config.field);
    validSort.push({ field: config.field, direction: config.direction === 'desc' ? 'desc' : 'asc' });
  }

  if (!seenFields.has(DEFAULT_SORT_OPTION)) {
    return [...DEFAULT_SORT_ARRAY, ...validSort];
  }
  return validSort;
}

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
          set(() => ({ currentSort: normalizeSortConfigs(sort) }));
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
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<Pick<TableSortState, 'currentSort'>> | undefined;
        const persistedSort = Array.isArray(persisted?.currentSort) ? persisted.currentSort : currentState.currentSort;
        return {
          ...currentState,
          currentSort: normalizeSortConfigs(persistedSort),
        };
      },
    },
  ),
);

export const useCurrentSort = () => tableSortStoreBase((state) => state.currentSort);
export const useTableSortActions = () => tableSortStoreBase((state) => state.actions);

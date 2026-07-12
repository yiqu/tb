'use client';

import { useMemo } from 'react';

import { SortConfig, useCurrentSort } from '@/store/sorter/table-sort';

import { buildSortSearchParamsString } from './multi-sort.utils';

interface MultiSortValues {
  /** The raw sort configs, in the order the user arranged them. */
  sortConfig: SortConfig[];
  /** URLSearchParams string, e.g. sort=arrival_date&sort=user_id&direction=asc&direction=desc */
  searchParamsString: string;
}

export default function useMultiSortValues(): MultiSortValues {
  const currentSort = useCurrentSort();

  const searchParamsString = useMemo(() => {
    return buildSortSearchParamsString(currentSort);
  }, [currentSort]);

  return {
    sortConfig: currentSort,
    searchParamsString,
  };
}
